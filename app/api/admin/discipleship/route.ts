import { and, asc, desc, eq, inArray } from "drizzle-orm";
import { isImmanuelAdminRequest } from "@/app/chatgpt-auth";
import { getDb } from "@/db";
import { discipleshipApplications, discipleshipAttendance, discipleshipPrograms, discipleshipSessions, memberApprovalLogs, members } from "@/db/schema";
import { ensureDiscipleshipSessions, numericCapacity } from "@/lib/discipleship";
import { sameOrigin } from "@/lib/member-auth";

const applicationStatuses = new Set(["pending", "approved", "waitlisted", "rejected", "cancelled"]);
const attendanceStatuses = new Set(["present", "late", "excused", "absent"]);
function clean(value: unknown, max: number) { return typeof value === "string" ? value.trim().slice(0, max) : ""; }

export async function GET(request: Request) {
  if (!await isImmanuelAdminRequest(request)) return Response.json({ error: "권한이 없습니다." }, { status: 403 });
  const db = getDb();
  const programs = await db.select().from(discipleshipPrograms).orderBy(asc(discipleshipPrograms.sortOrder), desc(discipleshipPrograms.id)).limit(100);
  for (const program of programs) await ensureDiscipleshipSessions(program.id);
  const programIds = programs.map((item) => item.id);
  const sessions = programIds.length ? await db.select().from(discipleshipSessions).where(inArray(discipleshipSessions.programId, programIds)).orderBy(asc(discipleshipSessions.sessionNumber)) : [];
  const applications = programIds.length ? await db.select({
    id: discipleshipApplications.id,
    programId: discipleshipApplications.programId,
    memberId: discipleshipApplications.memberId,
    memberName: members.name,
    memberNumber: members.memberNumber,
    phone: members.phone,
    status: discipleshipApplications.status,
    motivation: discipleshipApplications.motivation,
    adminNote: discipleshipApplications.adminNote,
    appliedAt: discipleshipApplications.appliedAt,
    completedAt: discipleshipApplications.completedAt,
  }).from(discipleshipApplications)
    .innerJoin(members, eq(discipleshipApplications.memberId, members.id))
    .where(inArray(discipleshipApplications.programId, programIds))
    .orderBy(desc(discipleshipApplications.appliedAt)).limit(5000) : [];
  const applicationIds = applications.map((item) => item.id);
  const attendance = applicationIds.length ? await db.select().from(discipleshipAttendance).where(inArray(discipleshipAttendance.applicationId, applicationIds)).limit(40000) : [];
  return Response.json({ programs, sessions, applications, attendance });
}

export async function PATCH(request: Request) {
  if (!await isImmanuelAdminRequest(request)) return Response.json({ error: "권한이 없습니다." }, { status: 403 });
  if (!sameOrigin(request)) return Response.json({ error: "올바르지 않은 요청입니다." }, { status: 403 });
  const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
  const action = clean(body.action, 40);
  const db = getDb();

  if (action === "application-status") {
    const id = Number(body.id); const requestedStatus = clean(body.status, 30); const adminNote = clean(body.adminNote, 1000);
    if (!Number.isInteger(id) || !applicationStatuses.has(requestedStatus)) return Response.json({ error: "신청 상태를 확인해 주세요." }, { status: 400 });
    const [current] = await db.select({ id: discipleshipApplications.id, memberId: discipleshipApplications.memberId, programId: discipleshipApplications.programId, status: discipleshipApplications.status, capacity: discipleshipPrograms.capacity }).from(discipleshipApplications).innerJoin(discipleshipPrograms, eq(discipleshipApplications.programId, discipleshipPrograms.id)).where(eq(discipleshipApplications.id, id)).limit(1);
    if (!current) return Response.json({ error: "신청을 찾지 못했습니다." }, { status: 404 });
    let status = requestedStatus;
    if (requestedStatus === "approved" && current.status !== "approved") {
      const approved = await db.select({ id: discipleshipApplications.id }).from(discipleshipApplications).where(and(eq(discipleshipApplications.programId, current.programId), eq(discipleshipApplications.status, "approved")));
      const capacity = numericCapacity(current.capacity);
      if (capacity !== null && approved.length >= capacity) status = "waitlisted";
    }
    const now = new Date();
    await db.update(discipleshipApplications).set({ status, adminNote: adminNote || null, reviewedAt: now, completedAt: null, updatedAt: now }).where(eq(discipleshipApplications.id, id));
    await db.insert(memberApprovalLogs).values({ memberId: current.memberId, action: "discipleship-status", previousValue: current.status, newValue: status, note: adminNote || null });
    let promotedId: number | null = null;
    if (current.status === "approved" && ["cancelled", "rejected"].includes(status)) promotedId = await promoteWaitlisted(current.programId);
    return Response.json({ ok: true, status, promotedId });
  }

  if (action === "attendance") {
    const applicationId = Number(body.applicationId); const sessionId = Number(body.sessionId); const status = clean(body.status, 20); const note = clean(body.note, 500);
    if (!Number.isInteger(applicationId) || !Number.isInteger(sessionId) || !attendanceStatuses.has(status)) return Response.json({ error: "출석 정보를 확인해 주세요." }, { status: 400 });
    const [application] = await db.select({ memberId: discipleshipApplications.memberId, programId: discipleshipApplications.programId, status: discipleshipApplications.status }).from(discipleshipApplications).where(eq(discipleshipApplications.id, applicationId)).limit(1);
    const [session] = await db.select({ programId: discipleshipSessions.programId }).from(discipleshipSessions).where(eq(discipleshipSessions.id, sessionId)).limit(1);
    if (!application || !session || application.programId !== session.programId || !["approved", "completed"].includes(application.status)) return Response.json({ error: "과정과 훈련생 정보를 확인해 주세요." }, { status: 409 });
    const [saved] = await db.insert(discipleshipAttendance).values({ applicationId, sessionId, status, note: note || null, checkedAt: new Date() }).onConflictDoUpdate({ target: [discipleshipAttendance.sessionId, discipleshipAttendance.applicationId], set: { status, note: note || null, checkedAt: new Date() } }).returning();
    return Response.json({ attendance: saved });
  }

  if (action === "session-date") {
    const sessionId = Number(body.sessionId); const heldOn = clean(body.heldOn, 20);
    if (!Number.isInteger(sessionId) || (heldOn && !/^\d{4}-\d{2}-\d{2}$/.test(heldOn))) return Response.json({ error: "회차 날짜를 확인해 주세요." }, { status: 400 });
    await db.update(discipleshipSessions).set({ heldOn: heldOn || null }).where(eq(discipleshipSessions.id, sessionId));
    return Response.json({ ok: true });
  }

  if (action === "complete") {
    const id = Number(body.id); const adminNote = clean(body.adminNote, 1000);
    if (!Number.isInteger(id)) return Response.json({ error: "수료 처리할 신청을 확인해 주세요." }, { status: 400 });
    const [current] = await db.select({ memberId: discipleshipApplications.memberId, status: discipleshipApplications.status }).from(discipleshipApplications).where(eq(discipleshipApplications.id, id)).limit(1);
    if (!current || current.status !== "approved") return Response.json({ error: "승인된 훈련생만 수료 처리할 수 있습니다." }, { status: 409 });
    const now = new Date();
    await db.update(discipleshipApplications).set({ status: "completed", completedAt: now, adminNote: adminNote || null, updatedAt: now }).where(eq(discipleshipApplications.id, id));
    await db.insert(memberApprovalLogs).values({ memberId: current.memberId, action: "discipleship-complete", previousValue: current.status, newValue: "completed", note: adminNote || null });
    return Response.json({ ok: true });
  }
  return Response.json({ error: "처리할 작업을 확인해 주세요." }, { status: 400 });
}

async function promoteWaitlisted(programId: number) {
  const db = getDb();
  const [next] = await db.select({ id: discipleshipApplications.id, memberId: discipleshipApplications.memberId }).from(discipleshipApplications).where(and(eq(discipleshipApplications.programId, programId), eq(discipleshipApplications.status, "waitlisted"))).orderBy(asc(discipleshipApplications.appliedAt)).limit(1);
  if (!next) return null;
  await db.update(discipleshipApplications).set({ status: "approved", reviewedAt: new Date(), updatedAt: new Date() }).where(eq(discipleshipApplications.id, next.id));
  await db.insert(memberApprovalLogs).values({ memberId: next.memberId, action: "discipleship-auto-promote", previousValue: "waitlisted", newValue: "approved", note: "정원 발생에 따른 자동 승인" });
  return next.id;
}
