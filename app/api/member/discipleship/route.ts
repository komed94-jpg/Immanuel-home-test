import { and, asc, desc, eq, inArray } from "drizzle-orm";
import { getDb } from "@/db";
import { discipleshipApplications, discipleshipAttendance, discipleshipPrograms, discipleshipSessions } from "@/db/schema";
import { ensureDiscipleshipSessions, promoteWaitlistedApplicant } from "@/lib/discipleship";
import { getMemberFromRequest, sameOrigin } from "@/lib/member-auth";

function clean(value: unknown, max: number) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export async function GET(request: Request) {
  const member = await getMemberFromRequest(request);
  if (!member) return Response.json({ error: "로그인이 필요합니다." }, { status: 401 });
  const db = getDb();
  const applications = await db.select({
    id: discipleshipApplications.id,
    programId: discipleshipApplications.programId,
    title: discipleshipPrograms.title,
    schedule: discipleshipPrograms.schedule,
    location: discipleshipPrograms.location,
    status: discipleshipApplications.status,
    motivation: discipleshipApplications.motivation,
    adminNote: discipleshipApplications.adminNote,
    appliedAt: discipleshipApplications.appliedAt,
    completedAt: discipleshipApplications.completedAt,
  }).from(discipleshipApplications)
    .innerJoin(discipleshipPrograms, eq(discipleshipApplications.programId, discipleshipPrograms.id))
    .where(eq(discipleshipApplications.memberId, member.id))
    .orderBy(desc(discipleshipApplications.appliedAt));

  for (const programId of [...new Set(applications.map((item) => item.programId))]) await ensureDiscipleshipSessions(programId);
  const programIds = [...new Set(applications.map((item) => item.programId))];
  const sessions = programIds.length ? await db.select().from(discipleshipSessions).where(inArray(discipleshipSessions.programId, programIds)).orderBy(asc(discipleshipSessions.sessionNumber)) : [];
  const applicationIds = applications.map((item) => item.id);
  const attendance = applicationIds.length ? await db.select({ applicationId: discipleshipAttendance.applicationId, sessionId: discipleshipAttendance.sessionId, status: discipleshipAttendance.status, note: discipleshipAttendance.note }).from(discipleshipAttendance).where(inArray(discipleshipAttendance.applicationId, applicationIds)) : [];
  return Response.json({ applications, sessions, attendance });
}

export async function POST(request: Request) {
  const member = await getMemberFromRequest(request);
  if (!member) return Response.json({ error: "로그인이 필요합니다." }, { status: 401 });
  if (member.membershipStatus !== "active") return Response.json({ error: "등록 교인 승인 후 신청할 수 있습니다." }, { status: 403 });
  if (!sameOrigin(request)) return Response.json({ error: "올바르지 않은 요청입니다." }, { status: 403 });
  const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
  const programId = Number(body.programId);
  const motivation = clean(body.motivation, 1500);
  if (!Number.isInteger(programId) || programId < 1 || motivation.length < 5) return Response.json({ error: "과정과 신청 동기를 확인해 주세요." }, { status: 400 });
  const db = getDb();
  const [program] = await db.select({ id: discipleshipPrograms.id, status: discipleshipPrograms.status }).from(discipleshipPrograms).where(eq(discipleshipPrograms.id, programId)).limit(1);
  if (!program || program.status !== "recruiting") return Response.json({ error: "현재 신청할 수 없는 과정입니다." }, { status: 409 });
  const [existing] = await db.select({ id: discipleshipApplications.id, status: discipleshipApplications.status }).from(discipleshipApplications).where(and(eq(discipleshipApplications.programId, programId), eq(discipleshipApplications.memberId, member.id))).limit(1);
  if (existing && !["cancelled", "rejected"].includes(existing.status)) return Response.json({ error: "이미 신청한 과정입니다." }, { status: 409 });
  const now = new Date();
  const [application] = existing
    ? await db.update(discipleshipApplications).set({ motivation, status: "pending", adminNote: null, appliedAt: now, reviewedAt: null, completedAt: null, updatedAt: now }).where(eq(discipleshipApplications.id, existing.id)).returning()
    : await db.insert(discipleshipApplications).values({ programId, memberId: member.id, motivation }).returning();
  await ensureDiscipleshipSessions(programId);
  return Response.json({ application }, { status: 201 });
}

export async function PATCH(request: Request) {
  const member = await getMemberFromRequest(request);
  if (!member) return Response.json({ error: "로그인이 필요합니다." }, { status: 401 });
  if (!sameOrigin(request)) return Response.json({ error: "올바르지 않은 요청입니다." }, { status: 403 });
  const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
  const id = Number(body.id);
  if (!Number.isInteger(id) || id < 1 || body.action !== "cancel") return Response.json({ error: "취소할 신청을 확인해 주세요." }, { status: 400 });
  const [current] = await getDb().select({ id: discipleshipApplications.id, programId: discipleshipApplications.programId, status: discipleshipApplications.status }).from(discipleshipApplications).where(and(eq(discipleshipApplications.id, id), eq(discipleshipApplications.memberId, member.id))).limit(1);
  if (!current || !["pending", "approved", "waitlisted"].includes(current.status)) return Response.json({ error: "취소할 수 없는 신청입니다." }, { status: 409 });
  await getDb().update(discipleshipApplications).set({ status: "cancelled", updatedAt: new Date() }).where(eq(discipleshipApplications.id, id));
  const promotedId = current.status === "approved" ? await promoteWaitlistedApplicant(current.programId) : null;
  return Response.json({ ok: true, promotedId });
}
