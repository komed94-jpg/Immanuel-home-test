import { and, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { bibleStudyPageProgress, bibleStudyResponses } from "@/db/schema";
import { getMemberFromRequest, sameOrigin } from "@/lib/member-auth";

const courseSlug = "discernment-to-love";
const lessonSlug = "discernment-lesson-2";

const questionKeys: Record<string, string[]> = {
  "l2-opening": ["l2-q0"],
  "l2-sign-1": ["l2-q1", "l2-q2", "l2-q3", "l2-q4", "l2-q5"],
  "l2-sign-2": ["l2-q6", "l2-q7", "l2-q8", "l2-q9"],
  "l2-sign-3": ["l2-q10", "l2-q11", "l2-q12", "l2-q13"],
  "l2-sign-4": ["l2-q14", "l2-q15", "l2-q16", "l2-q17"],
  "l2-sign-5": ["l2-q18", "l2-q19", "l2-q20", "l2-q21", "l2-q22"],
  "l2-sign-6": ["l2-q23", "l2-q24", "l2-q25", "l2-q26"],
  "l2-closing": ["l2-q27", "l2-q28", "l2-q29", "l2-share-1", "l2-share-2", "l2-share-3", "l2-share-4"]
};

const pageKeys = Object.keys(questionKeys);

function clean(value: unknown, max: number) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function koreaDate(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).formatToParts(date);
  const pick = (type: string) => parts.find((part) => part.type === type)?.value ?? "";
  return `${pick("year")}-${pick("month")}-${pick("day")}`;
}

export async function GET(request: Request) {
  const member = await getMemberFromRequest(request);
  if (!member) return Response.json({ error: "로그인이 필요합니다." }, { status: 401 });

  const db = getDb();
  const [responses, progress] = await Promise.all([
    db.select().from(bibleStudyResponses).where(and(
      eq(bibleStudyResponses.memberId, member.id),
      eq(bibleStudyResponses.courseSlug, courseSlug),
      eq(bibleStudyResponses.lessonSlug, lessonSlug)
    )),
    db.select().from(bibleStudyPageProgress).where(and(
      eq(bibleStudyPageProgress.memberId, member.id),
      eq(bibleStudyPageProgress.courseSlug, courseSlug),
      eq(bibleStudyPageProgress.lessonSlug, lessonSlug)
    ))
  ]);

  return Response.json({ responses, progress, totalPages: pageKeys.length });
}

export async function POST(request: Request) {
  const member = await getMemberFromRequest(request);
  if (!member) return Response.json({ error: "로그인이 필요합니다." }, { status: 401 });
  if (!sameOrigin(request)) return Response.json({ error: "올바르지 않은 요청입니다." }, { status: 403 });

  const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
  const action = clean(body.action, 40);
  const pageKey = clean(body.pageKey, 80);

  if (!pageKeys.includes(pageKey)) {
    return Response.json({ error: "교재 페이지를 확인해 주세요." }, { status: 400 });
  }

  const db = getDb();
  const now = new Date();
  const studiedOn = koreaDate(now);

  if (action === "answer") {
    const questionKey = clean(body.questionKey, 80);
    const answer = clean(body.answer, 5000);

    if (!questionKeys[pageKey]?.includes(questionKey)) {
      return Response.json({ error: "질문을 확인해 주세요." }, { status: 400 });
    }

    const [saved] = await db.insert(bibleStudyResponses).values({
      memberId: member.id,
      courseSlug,
      lessonSlug,
      pageKey,
      questionKey,
      answer,
      studiedOn,
      updatedAt: now
    }).onConflictDoUpdate({
      target: [
        bibleStudyResponses.memberId,
        bibleStudyResponses.courseSlug,
        bibleStudyResponses.lessonSlug,
        bibleStudyResponses.pageKey,
        bibleStudyResponses.questionKey
      ],
      set: { answer, studiedOn, updatedAt: now }
    }).returning();

    return Response.json({ response: saved });
  }

  if (action === "complete-page") {
    const [saved] = await db.insert(bibleStudyPageProgress).values({
      memberId: member.id,
      courseSlug,
      lessonSlug,
      pageKey,
      studiedOn,
      completedAt: now,
      updatedAt: now
    }).onConflictDoUpdate({
      target: [
        bibleStudyPageProgress.memberId,
        bibleStudyPageProgress.courseSlug,
        bibleStudyPageProgress.lessonSlug,
        bibleStudyPageProgress.pageKey
      ],
      set: { studiedOn, completedAt: now, updatedAt: now }
    }).returning();

    const progress = await db.select({ pageKey: bibleStudyPageProgress.pageKey })
      .from(bibleStudyPageProgress)
      .where(and(
        eq(bibleStudyPageProgress.memberId, member.id),
        eq(bibleStudyPageProgress.courseSlug, courseSlug),
        eq(bibleStudyPageProgress.lessonSlug, lessonSlug)
      ));

    return Response.json({ progress: saved, completedPages: progress.length, totalPages: pageKeys.length });
  }

  return Response.json({ error: "처리할 작업을 확인해 주세요." }, { status: 400 });
}
