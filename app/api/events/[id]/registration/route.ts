import { and, asc, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { churchEvents, eventApplications } from "@/db/schema";
import { createOpaqueToken, getMemberFromRequest, normalizePhone, sameOrigin, tokenHash } from "@/lib/member-auth";

const activeStatuses = ["registered", "waitlisted"];
function clean(value: unknown, max: number) { return typeof value === "string" ? value.trim().slice(0, max) : ""; }
function registrationOpen(event: { registrationOpen: boolean; registrationStartsAt: string | null; registrationEndsAt: string | null }) { const now = Date.now(); return event.registrationOpen && (!event.registrationStartsAt || Date.parse(event.registrationStartsAt) <= now) && (!event.registrationEndsAt || Date.parse(event.registrationEndsAt) >= now); }
async function eventFor(params: Promise<{ id: string }>) { const id = Number((await params).id); if (!Number.isInteger(id) || id < 1) return null; const [event] = await getDb().select().from(churchEvents).where(and(eq(churchEvents.id, id), eq(churchEvents.isPublic, true))).limit(1); return event ?? null; }

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!sameOrigin(request)) return Response.json({ error: "올바르지 않은 요청입니다." }, { status: 403 });
  const event = await eventFor(params); if (!event || !registrationOpen(event)) return Response.json({ error: "현재 신청할 수 없는 행사입니다." }, { status: 409 });
  const body = (await request.json().catch(() => ({}))) as Record<string, unknown>; const member = await getMemberFromRequest(request);
  const name = member?.name ?? clean(body.name, 80); const contact = member?.phone ?? normalizePhone(body.contact);
  if (name.length < 2 || contact.length < 8) return Response.json({ error: "이름과 연락처를 정확히 입력해 주세요." }, { status: 400 });
  const db = getDb(); const [current] = await db.select({ id: eventApplications.id, status: eventApplications.status }).from(eventApplications).where(and(eq(eventApplications.eventId, event.id), eq(eventApplications.contactKey, contact))).limit(1);
  if (current && current.status !== "cancelled") return Response.json({ error: "이미 이 연락처로 신청되어 있습니다." }, { status: 409 });
  const counts = await db.select({ id: eventApplications.id }).from(eventApplications).where(and(eq(eventApplications.eventId, event.id), eq(eventApplications.status, "registered")));
  const status = event.capacity !== null && counts.length >= event.capacity ? "waitlisted" : "registered";
  const cancelToken = createOpaqueToken();
  if (current) {
    const [application] = await db.update(eventApplications).set({ memberId: member?.id ?? null, applicantType: member?.membershipStatus === "active" ? "member" : "nonmember", applicantName: name, contact, contactKey: contact, status, note: clean(body.note, 1000) || null, adminNote: null, attendanceStatus: null, cancelTokenHash: tokenHash(cancelToken), cancelledAt: null, updatedAt: new Date() }).where(eq(eventApplications.id, current.id)).returning({ id: eventApplications.id, status: eventApplications.status, appliedAt: eventApplications.appliedAt });
    return Response.json({ application, cancelToken });
  }
  const [application] = await db.insert(eventApplications).values({ eventId: event.id, memberId: member?.id ?? null, applicantType: member?.membershipStatus === "active" ? "member" : "nonmember", applicantName: name, contact, contactKey: contact, status, note: clean(body.note, 1000) || null, cancelTokenHash: tokenHash(cancelToken) }).returning({ id: eventApplications.id, status: eventApplications.status, appliedAt: eventApplications.appliedAt });
  return Response.json({ application, cancelToken }, { status: 201 });
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!sameOrigin(request)) return Response.json({ error: "올바르지 않은 요청입니다." }, { status: 403 });
  const event = await eventFor(params); if (!event) return Response.json({ error: "행사를 찾지 못했습니다." }, { status: 404 });
  const member = await getMemberFromRequest(request); const body = (await request.json().catch(() => ({}))) as Record<string, unknown>; const cancelToken = clean(body.cancelToken, 200);
  const conditions = [eq(eventApplications.eventId, event.id)];
  if (member) conditions.push(eq(eventApplications.memberId, member.id)); else if (cancelToken) conditions.push(eq(eventApplications.cancelTokenHash, tokenHash(cancelToken))); else return Response.json({ error: "신청 취소 정보를 확인해 주세요." }, { status: 400 });
  const [application] = await getDb().select().from(eventApplications).where(and(...conditions)).limit(1);
  if (!application || !activeStatuses.includes(application.status)) return Response.json({ error: "취소할 신청을 찾지 못했습니다." }, { status: 404 });
  await getDb().update(eventApplications).set({ status: "cancelled", cancelledAt: new Date(), updatedAt: new Date() }).where(eq(eventApplications.id, application.id));
  const [waiting] = await getDb().select().from(eventApplications).where(and(eq(eventApplications.eventId, event.id), eq(eventApplications.status, "waitlisted"))).orderBy(asc(eventApplications.appliedAt)).limit(1);
  if (waiting) await getDb().update(eventApplications).set({ status: "registered", updatedAt: new Date() }).where(eq(eventApplications.id, waiting.id));
  return Response.json({ ok: true, promotedId: waiting?.id ?? null });
}
