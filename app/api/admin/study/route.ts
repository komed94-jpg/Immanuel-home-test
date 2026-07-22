import { desc, eq, inArray } from "drizzle-orm";
import { isImmanuelAdminRequest } from "@/app/chatgpt-auth";
import { getDb } from "@/db";
import { bibleStudyCompletions, bibleStudyPageProgress, bibleStudyResponses, members } from "@/db/schema";
import { getBibleStudyCourse, immanuelBasicCourse, totalPages } from "@/lib/bible-study";
import { sameOrigin } from "@/lib/member-auth";

function clean(value: unknown, max: number) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export async function GET(request: Request) {
  if (!await isImmanuelAdminRequest(request)) return Response.json({ error: "권한이 없습니다." }, { status: 403 });
  const course = immanuelBasicCourse;
  const db = getDb();
  const [progress, completions] = await Promise.all([
    db.select({ memberId: bibleStudyPageProgress.memberId, pageKey: bibleStudyPageProgress.pageKey, studiedOn: bibleStudyPageProgress.studiedOn, completedAt: bibleStudyPageProgress.completedAt })
      .from(bibleStudyPageProgress).where(eq(bibleStudyPageProgress.courseSlug, course.slug)).orderBy(desc(bibleStudyPageProgress.completedAt)).limit(5000),
    db.select({ id: bibleStudyCompletions.id, memberId: bibleStudyCompletions.memberId, status: bibleStudyCompletions.status, adminNote: bibleStudyCompletions.adminNote, completedAt: bibleStudyCompletions.completedAt, certifiedAt: bibleStudyCompletions.certifiedAt })
      .from(bibleStudyCompletions).where(eq(bibleStudyCompletions.courseSlug, course.slug)).orderBy(desc(bibleStudyCompletions.completedAt)).limit(500),
  ]);
  const memberIds = [...new Set([...progress.map((item) => item.memberId), ...completions.map((item) => item.memberId)])];
  const memberRows = memberIds.length ? await db.select({ id: members.id, name: members.name, email: members.email, phone: members.phone, memberNumber: members.memberNumber }).from(members).where(inArray(members.id, memberIds)) : [];
  const responses = memberIds.length ? await db.select({ memberId: bibleStudyResponses.memberId, pageKey: bibleStudyResponses.pageKey, questionKey: bibleStudyResponses.questionKey, answer: bibleStudyResponses.answer, studiedOn: bibleStudyResponses.studiedOn, updatedAt: bibleStudyResponses.updatedAt })
    .from(bibleStudyResponses).where(eq(bibleStudyResponses.courseSlug, course.slug)).orderBy(desc(bibleStudyResponses.updatedAt)).limit(8000) : [];
  return Response.json({ course: { slug: course.slug, title: course.title, totalPages: totalPages(course) }, members: memberRows, progress, completions, responses });
}

export async function PATCH(request: Request) {
  if (!await isImmanuelAdminRequest(request)) return Response.json({ error: "권한이 없습니다." }, { status: 403 });
  if (!sameOrigin(request)) return Response.json({ error: "올바르지 않은 요청입니다." }, { status: 403 });
  const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
  const course = getBibleStudyCourse(clean(body.courseSlug, 80));
  const memberId = Number(body.memberId);
  const status = clean(body.status, 40);
  const adminNote = clean(body.adminNote, 1000);
  if (!course || !Number.isInteger(memberId) || !["certified", "ready"].includes(status)) return Response.json({ error: "수료 처리 정보를 확인해 주세요." }, { status: 400 });
  const now = new Date();
  const [saved] = await getDb().insert(bibleStudyCompletions).values({ memberId, courseSlug: course.slug, status, adminNote: adminNote || null, certifiedAt: status === "certified" ? now : null, completedAt: now, updatedAt: now })
    .onConflictDoUpdate({ target: [bibleStudyCompletions.memberId, bibleStudyCompletions.courseSlug], set: { status, adminNote: adminNote || null, certifiedAt: status === "certified" ? now : null, updatedAt: now } })
    .returning();
  return Response.json({ completion: saved });
}
