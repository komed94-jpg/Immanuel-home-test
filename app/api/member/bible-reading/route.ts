import { and, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { bibleStudyPageProgress } from "@/db/schema";
import { getMemberFromRequest, sameOrigin } from "@/lib/member-auth";
import { READING_COURSE, READING_DAYS } from "@/lib/bible-reading";

function dayKey(day: number) { return `day-${String(day).padStart(3, "0")}`; }

export async function GET(request: Request) {
  const member = await getMemberFromRequest(request);
  if (!member) return Response.json({ error: "로그인이 필요합니다." }, { status: 401 });
  const rows = await getDb().select({ pageKey: bibleStudyPageProgress.pageKey })
    .from(bibleStudyPageProgress).where(and(
      eq(bibleStudyPageProgress.memberId, member.id),
      eq(bibleStudyPageProgress.courseSlug, READING_COURSE),
    ));
  const completedDays = rows.map((row) => Number(row.pageKey.slice(4)))
    .filter((day) => Number.isInteger(day) && day >= 1 && day <= READING_DAYS);
  return Response.json({ completedDays }, { headers: { "Cache-Control": "private, no-store" } });
}

export async function POST(request: Request) {
  const member = await getMemberFromRequest(request);
  if (!member) return Response.json({ error: "로그인이 필요합니다." }, { status: 401 });
  if (!sameOrigin(request)) return Response.json({ error: "올바르지 않은 요청입니다." }, { status: 403 });
  const body = await request.json().catch(() => null);
  const day = body?.day;
  if (!Number.isInteger(day) || day < 1 || day > READING_DAYS || typeof body?.completed !== "boolean")
    return Response.json({ error: "읽기 날짜를 확인해 주세요." }, { status: 400 });

  const db = getDb();
  const filter = and(
    eq(bibleStudyPageProgress.memberId, member.id),
    eq(bibleStudyPageProgress.courseSlug, READING_COURSE),
    eq(bibleStudyPageProgress.lessonSlug, "year"),
    eq(bibleStudyPageProgress.pageKey, dayKey(day)),
  );
  if (body.completed) {
    const now = new Date();
    const studiedOn = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Seoul", year: "numeric", month: "2-digit", day: "2-digit" }).format(now);
    await db.insert(bibleStudyPageProgress).values({
      memberId: member.id, courseSlug: READING_COURSE, lessonSlug: "year",
      pageKey: dayKey(day), studiedOn, completedAt: now, updatedAt: now,
    }).onConflictDoNothing();
  } else {
    await db.delete(bibleStudyPageProgress).where(filter);
  }
  return Response.json({ day, completed: body.completed }, { headers: { "Cache-Control": "private, no-store" } });
}
