import { and, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { bibleStudyPageProgress, bibleStudyResponses } from "@/db/schema";
import { getMemberFromRequest, sameOrigin } from "@/lib/member-auth";

const courseSlug = "discernment-to-love";
const lessonSlug = "discernment-lesson-9";

const questionKeys: Record<string, string[]> = {
  "l9-opening": ["l9-q0"],
  "l9-part-1": ["l9-q1", "l9-q2", "l9-q3", "l9-q4", "l9-q5", "l9-q6", "l9-q7", "l9-q8", "l9-q9", "l9-q10"],
  "l9-part-2": ["l9-q11", "l9-q12", "l9-q13", "l9-q14", "l9-q15", "l9-q16", "l9-q17", "l9-q18"],
  "l9-part-3": ["l9-q19", "l9-q20", "l9-q21", "l9-q22", "l9-q23", "l9-q24", "l9-q25", "l9-q26"],
  "l9-part-4": ["l9-q27", "l9-q28", "l9-q29", "l9-q30", "l9-q31", "l9-q32", "l9-q33"],
  "l9-part-5": ["l9-q34", "l9-q35", "l9-q36", "l9-q37", "l9-q38", "l9-q39", "l9-q40", "l9-q41", "l9-q42", "l9-q43", "l9-q44"],
  "l9-part-6": ["l9-q45", "l9-q46", "l9-q47", "l9-q48", "l9-q49", "l9-q50"],
  "l9-closing": ["l9-q51", "l9-q52", "l9-q53", "l9-q54", "l9-q55", "l9-q56", "l9-share-1", "l9-share-2", "l9-share-3", "l9-share-4", "l9-share-5"]
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
