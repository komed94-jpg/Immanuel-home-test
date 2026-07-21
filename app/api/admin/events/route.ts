import { and, asc, desc, eq, inArray } from "drizzle-orm";
import { isImmanuelAdminRequest } from "@/app/chatgpt-auth";
import { getDb } from "@/db";
import { attendanceEvents, attendanceRecords, churchEvents, eventApplications, members } from "@/db/schema";
import { sameOrigin } from "@/lib/member-auth";

const applicationStatuses = new Set(["registered", "waitlisted", "cancelled"]);
const attendanceStatuses = new Set(["present", "late", "excused", "absent"]);
function clean(value: unknown, max: number) { return typeof value === "string" ? value.trim().slice(0, max) : ""; }
function csvCell(value: unknown) { let text = String(value ?? ""); if (/^[=+\-@]/.test(text)) text = `'${text}`; return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text; }

export async function GET(request: Request) {
  if (!await isImmanuelAdminRequest(request)) return Response.json({ error: "권한이 없습니다." }, { status: 403 });
  const db = getDb(); const url = new URL(request.url); const eventId = Number(url.searchParams.get("eventId")); const format = url.searchParams.get("format");
  const events = await db.select().from(churchEvents).orderBy(desc(churchEvents.startsAt), desc(churchEvents.id)).limit(500);
  const ids = events.map((item) => item.id);
  const applications = ids.length ? await db.select({ id: eventApplications.id, eventId: eventApplications.eventId, memberId: eventApplications.memberId, applicantType: eventApplications.applicantType, applicantName: eventApplications.applicantName, contact: eventApplications.contact, status: eventApplications.status, attendanceStatus: eventApplications.attendanceStatus, note: eventApplications.note, adminNote: eventApplications.adminNote, appliedAt: eventApplications.appliedAt, cancelledAt: eventApplications.cancelledAt, memberNumber: members.memberNumber, memberEmail: members.email }).from(eventApplications).leftJoin(members, eq(eventApplications.memberId, members.id)).where(inArray(eventApplications.eventId, ids)).orderBy(asc(eventApplications.appliedAt)).limit(10000) : [];
  if (format === "csv") {
    if (!Number.isInteger(eventId) || eventId < 1) return Response.json({ error: "행사를 선택해 주세요." }, { status: 400 });
    const event = events.find((item) => item.id === eventId); if (!event) return Response.json({ error: "행사를 찾지 못했습니다." }, { status: 404 });
    const rows = [["행사명", "신청자", "구분", "연락처", "교인번호", "신청 상태", "출석", "신청일", "전달사항", "관리자 메모"], ...applications.filter((item) => item.eventId === eventId).map((item) => [event.title, item.applicantName, item.applicantType === "member" ? "멤버" : "비멤버", item.contact, item.memberNumber ?? "", labelStatus(item.status), labelAttendance(item.attendanceStatus), new Date(item.appliedAt).toLocaleString("ko-KR"), item.note ?? "", item.adminNote ?? ""])];
    return new Response(`\uFEFF${rows.map((row) => row.map(csvCell).join(",")).join("\n")}`, { headers: { "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": `attachment; filename="event-${event.id}-applications.csv"` } });
  }
  return Response.json({ events, applications });
}

export async function PATCH(request: Request) {
  if (!await isImmanuelAdminRequest(request)) return Response.json({ error: "권한이 없습니다." }, { status: 403 });
  if (!sameOrigin(request)) return Response.json({ error: "올바르지 않은 요청입니다." }, { status: 403 });
  const body = (await request.json().catch(() => ({}))) as Record<string, unknown>; const action = clean(body.action, 40); const db = getDb();
  if (action === "application-status") {
    const id = Number(body.id); const requested = clean(body.status, 20); const adminNote = clean(body.adminNote, 1000);
    if (!Number.isInteger(id) || !applicationStatuses.has(requested)) return Response.json({ error: "신청 상태를 확인해 주세요." }, { status: 400 });
    const [current] = await db.select({ id: eventApplications.id, eventId: eventApplications.eventId, status: eventApplications.status, capacity: churchEvents.capacity }).from(eventApplications).innerJoin(churchEvents, eq(eventApplications.eventId, churchEvents.id)).where(eq(eventApplications.id, id)).limit(1);
    if (!current) return Response.json({ error: "신청자를 찾지 못했습니다." }, { status: 404 });
    let status = requested;
    if (requested === "registered" && current.status !== "registered" && current.capacity !== null) { const currentRegistered = await db.select({ id: eventApplications.id }).from(eventApplications).where(and(eq(eventApplications.eventId, current.eventId), eq(eventApplications.status, "registered"))); if (currentRegistered.length >= current.capacity) status = "waitlisted"; }
    await db.update(eventApplications).set({ status, adminNote: adminNote || null, cancelledAt: status === "cancelled" ? new Date() : null, updatedAt: new Date() }).where(eq(eventApplications.id, id));
    let promotedId: number | null = null;
    if (current.status === "registered" && status !== "registered") promotedId = await promoteWaitlisted(db, current.eventId);
    return Response.json({ ok: true, status, promotedId });
  }
  if (action === "link-attendance") {
    const id = Number(body.eventId); if (!Number.isInteger(id)) return Response.json({ error: "행사를 확인해 주세요." }, { status: 400 });
    const [event] = await db.select().from(churchEvents).where(eq(churchEvents.id, id)).limit(1); if (!event) return Response.json({ error: "행사를 찾지 못했습니다." }, { status: 404 });
    if (event.attendanceEventId) return Response.json({ attendanceEventId: event.attendanceEventId });
    const [attendanceEvent] = await db.insert(attendanceEvents).values({ title: event.title, eventType: "event", heldOn: event.startsAt.slice(0, 10), startsAt: event.startsAt }).returning();
    await db.update(churchEvents).set({ attendanceEventId: attendanceEvent.id }).where(eq(churchEvents.id, event.id));
    return Response.json({ attendanceEventId: attendanceEvent.id });
  }
  if (action === "attendance") {
    const applicationId = Number(body.applicationId); const attendanceStatus = clean(body.attendanceStatus, 20);
    if (!Number.isInteger(applicationId) || !attendanceStatuses.has(attendanceStatus)) return Response.json({ error: "출석 상태를 확인해 주세요." }, { status: 400 });
    const [application] = await db.select({ id: eventApplications.id, eventId: eventApplications.eventId, memberId: eventApplications.memberId, status: eventApplications.status, attendanceEventId: churchEvents.attendanceEventId }).from(eventApplications).innerJoin(churchEvents, eq(eventApplications.eventId, churchEvents.id)).where(eq(eventApplications.id, applicationId)).limit(1);
    if (!application || application.status !== "registered") return Response.json({ error: "참가 확정자만 출석 처리할 수 있습니다." }, { status: 409 });
    const now = new Date(); await db.update(eventApplications).set({ attendanceStatus, updatedAt: now }).where(eq(eventApplications.id, application.id));
    if (application.memberId && application.attendanceEventId) await db.insert(attendanceRecords).values({ eventId: application.attendanceEventId, memberId: application.memberId, status: attendanceStatus, method: "event-registration", checkedInAt: now }).onConflictDoUpdate({ target: [attendanceRecords.eventId, attendanceRecords.memberId], set: { status: attendanceStatus, method: "event-registration", checkedInAt: now } });
    return Response.json({ ok: true });
  }
  return Response.json({ error: "처리할 작업을 확인해 주세요." }, { status: 400 });
}

async function promoteWaitlisted(db: ReturnType<typeof getDb>, eventId: number) { const [waiting] = await db.select({ id: eventApplications.id }).from(eventApplications).where(and(eq(eventApplications.eventId, eventId), eq(eventApplications.status, "waitlisted"))).orderBy(asc(eventApplications.appliedAt)).limit(1); if (!waiting) return null; await db.update(eventApplications).set({ status: "registered", updatedAt: new Date() }).where(eq(eventApplications.id, waiting.id)); return waiting.id; }
function labelStatus(status: string) { return ({ registered: "참가 확정", waitlisted: "대기", cancelled: "취소" } as Record<string, string>)[status] ?? status; }
function labelAttendance(status: string | null) { return ({ present: "출석", late: "지각", excused: "사유 결석", absent: "결석" } as Record<string, string>)[status ?? ""] ?? "미처리"; }
