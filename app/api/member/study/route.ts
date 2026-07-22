import { and, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { bibleStudyCompletions, bibleStudyPageProgress, bibleStudyResponses } from "@/db/schema";
import { getBibleStudyCourse, totalPages } from "@/lib/bible-study";
import { getMemberFromRequest, sameOrigin } from "@/lib/member-auth";

function clean(value: unknown, max: number) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function koreaDate(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Seoul", year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(date);
  const pick = (type: string) => parts.find((part) => part.type === type)?.value ?? "";
  return `${pick("year")}-${pick("month")}-${pick("day")}`;
}

export async function GET(request: Request) {
  const member = await getMemberFromRequest(request);
  if (!member) return Response.json({ error: "로그인이 필요합니다." }, { status: 401 });
  const url = new URL(request.url);
  const courseSlug = clean(url.searchParams.get("course"), 80);
  const course = getBibleStudyCourse(courseSlug);
  if (!course) return Response.json({ error: "교재를 찾지 못했습니다." }, { status: 404 });
  const db = getDb();
  const [responses, progress, completions] = await Promise.all([
    db.select().from(bibleStudyResponses).where(and(eq(bibleStudyResponses.memberId, member.id), eq(bibleStudyResponses.courseSlug, course.slug))),
    db.select().from(bibleStudyPageProgress).where(and(eq(bibleStudyPageProgress.memberId, member.id), eq(bibleStudyPageProgress.courseSlug, course.slug))),
    db.select().from(bibleStudyCompletions).where(and(eq(bibleStudyCompletions.memberId, member.id), eq(bibleStudyCompletions.courseSlug, course.slug))).limit(1),
  ]);
  return Response.json({ responses, progress, completion: completions[0] ?? null, totalPages: totalPages(course) });
}

export async function POST(request: Request) {
  const member = await getMemberFromRequest(request);
  if (!member) return Response.json({ error: "로그인이 필요합니다." }, { status: 401 });
  if (!sameOrigin(request)) return Response.json({ error: "올바르지 않은 요청입니다." }, { status: 403 });
  const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
  const action = clean(body.action, 40);
  const course = getBibleStudyCourse(clean(body.courseSlug, 80));
  const lessonSlug = clean(body.lessonSlug, 80);
  const pageKey = clean(body.pageKey, 80);
  if (!course || lessonSlug !== course.lessonSlug || !course.pages.some((page) => page.key === pageKey)) return Response.json({ error: "교재 페이지를 확인해 주세요." }, { status: 400 });
  const db = getDb();
  const now = new Date();
  const studiedOn = koreaDate(now);

  if (action === "answer") {
    const questionKey = clean(body.questionKey, 80);
    const answer = clean(body.answer, 5000);
    const page = course.pages.find((item) => item.key === pageKey);
    if (!page?.questions.some((question) => question.key === questionKey)) return Response.json({ error: "질문을 확인해 주세요." }, { status: 400 });
    const [saved] = await db.insert(bibleStudyResponses).values({ memberId: member.id, courseSlug: course.slug, lessonSlug, pageKey, questionKey, answer, studiedOn, updatedAt: now })
      .onConflictDoUpdate({ target: [bibleStudyResponses.memberId, bibleStudyResponses.courseSlug, bibleStudyResponses.lessonSlug, bibleStudyResponses.pageKey, bibleStudyResponses.questionKey], set: { answer, studiedOn, updatedAt: now } })
      .returning();
    return Response.json({ response: saved });
  }

  if (action === "complete-page") {
    const [saved] = await db.insert(bibleStudyPageProgress).values({ memberId: member.id, courseSlug: course.slug, lessonSlug, pageKey, studiedOn, completedAt: now, updatedAt: now })
      .onConflictDoUpdate({ target: [bibleStudyPageProgress.memberId, bibleStudyPageProgress.courseSlug, bibleStudyPageProgress.lessonSlug, bibleStudyPageProgress.pageKey], set: { studiedOn, completedAt: now, updatedAt: now } })
      .returning();
    const progress = await db.select({ pageKey: bibleStudyPageProgress.pageKey }).from(bibleStudyPageProgress).where(and(eq(bibleStudyPageProgress.memberId, member.id), eq(bibleStudyPageProgress.courseSlug, course.slug)));
    if (progress.length >= totalPages(course)) {
      await db.insert(bibleStudyCompletions).values({ memberId: member.id, courseSlug: course.slug, status: "ready", completedAt: now, updatedAt: now })
        .onConflictDoUpdate({ target: [bibleStudyCompletions.memberId, bibleStudyCompletions.courseSlug], set: { status: "ready", completedAt: now, updatedAt: now } });
    }
    return Response.json({ progress: saved, completedPages: progress.length, totalPages: totalPages(course) });
  }

  return Response.json({ error: "처리할 작업을 확인해 주세요." }, { status: 400 });
}
