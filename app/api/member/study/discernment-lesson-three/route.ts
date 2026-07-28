import { and, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { bibleStudyPageProgress, bibleStudyResponses } from "@/db/schema";
import { getMemberFromRequest, sameOrigin } from "@/lib/member-auth";

const courseSlug = "discernment-to-love";
const lessonSlug = "discernment-lesson-3";

const questionKeys: Record<string, string[]> = {
  "l3-opening": ["l3-q0"],
  "l3-sign-1": ["l3-q1", "l3-q2", "l3-q3", "l3-q4", "l3-q5"],
  "l3-sign-2": ["l3-q6", "l3-q7", "l3-q8", "l3-q9", "l3-q10", "l3-q11"],
  "l3-sign-3": ["l3-q12", "l3-q13", "l3-q14", "l3-q15", "l3-q16", "l3-q17"],
  "l3-sign-4": ["l3-q18", "l3-q19", "l3-q20", "l3-q21", "l3-q22"],
  "l3-sign-5": ["l3-q23", "l3-q24", "l3-q25", "l3-q26", "l3-q27"],
  "l3-sign-6": ["l3-q28", "l3-q29", "l3-q30", "l3-q31", "l3-q32"],
  "l3-closing": ["l3-q33", "l3-q34", "l3-q35", "l3-q36", "l3-share-1", "l3-share-2", "l3-share-3", "l3-share-4"]
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
