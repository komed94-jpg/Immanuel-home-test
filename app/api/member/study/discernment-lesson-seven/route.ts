import { and, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { bibleStudyPageProgress, bibleStudyResponses } from "@/db/schema";
import { getMemberFromRequest, sameOrigin } from "@/lib/member-auth";

const courseSlug = "discernment-to-love";
const lessonSlug = "discernment-lesson-7";

const questionKeys: Record<string, string[]> = {
  "l7-opening": ["l7-q0"],
  "l7-part-1": ["l7-q1", "l7-q2", "l7-q3", "l7-q4", "l7-q5", "l7-q6", "l7-q7"],
  "l7-part-2": ["l7-q8", "l7-q9", "l7-q10", "l7-q11", "l7-q12", "l7-q13"],
  "l7-part-3": ["l7-q14", "l7-q15", "l7-q16", "l7-q17", "l7-q18", "l7-q19", "l7-q20"],
  "l7-part-4": ["l7-q21", "l7-q22", "l7-q23", "l7-q24", "l7-q25", "l7-q26", "l7-q27", "l7-q28"],
  "l7-part-5": ["l7-q29", "l7-q30", "l7-q31", "l7-q32", "l7-q33", "l7-q34", "l7-q35", "l7-q36"],
  "l7-part-6": ["l7-q37", "l7-q38", "l7-q39", "l7-q40", "l7-q41", "l7-q42", "l7-q43", "l7-q44", "l7-q45"],
  "l7-closing": [
    "l7-q46", "l7-q47", "l7-q48", "l7-q49", "l7-q50", "l7-q51", "l7-q52",
    "l7-share-1", "l7-share-2", "l7-share-3", "l7-share-4", "l7-share-5", "l7-share-6", "l7-share-7"
  ]
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
