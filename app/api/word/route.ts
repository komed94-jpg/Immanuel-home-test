import { desc, eq, lte } from "drizzle-orm";
import { isImmanuelAdminRequest } from "@/app/chatgpt-auth";
import { getDb } from "@/db";
import { dailyWords } from "@/db/schema";
import { getPublishDateKst } from "@/lib/daily-word";
import { ensureAutomaticWord, prepareAutomaticWords } from "@/lib/daily-word-service";

function clean(value: unknown, max: number) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export async function GET(request: Request) {
  const publishDate = getPublishDateKst();
  await ensureAutomaticWord(publishDate);

  const showAll = new URL(request.url).searchParams.get("all") === "1" && await isImmanuelAdminRequest(request);
  const query = getDb()
    .select()
    .from(dailyWords)
    .orderBy(desc(dailyWords.publishedOn), desc(dailyWords.id));
  const rows = showAll
    ? await query.limit(100)
    : await query.where(lte(dailyWords.publishedOn, publishDate)).limit(100);

  return Response.json({
    words: rows,
    automation: { enabled: true, time: "04:30", timeZone: "Asia/Seoul", publishDate }
  });
}

export async function POST(request: Request) {
  if (!await isImmanuelAdminRequest(request)) {
    return Response.json({ error: "권한이 없습니다." }, { status: 403 });
  }

  const prepareDays = Number(new URL(request.url).searchParams.get("prepare"));
  if (Number.isInteger(prepareDays) && prepareDays > 0 && prepareDays <= 31) {
    const result = await prepareAutomaticWords(prepareDays);
    return Response.json({ ok: true, ...result });
  }

  const body = (await request.json()) as Record<string, unknown>;
  const title = clean(body.title, 200);
  const scripture = clean(body.scripture, 240);
  const revisedKoreanText = clean(body.revisedKoreanText, 12000);
  const newKoreanTranslationText = clean(body.newKoreanTranslationText, 12000);
  const nivText = clean(body.nivText, 12000);
  const message = clean(body.message, 6000);
  const application = clean(body.application, 4000);
  const prayer = clean(body.prayer, 2000);
  const publishedOn = clean(body.publishedOn, 20);

  if (!title || !scripture || !message || !/^\d{4}-\d{2}-\d{2}$/.test(publishedOn)) {
    return Response.json({ error: "날짜, 제목, 성경 본문, 말씀 내용을 확인해 주세요." }, { status: 400 });
  }

  const [saved] = await getDb()
    .insert(dailyWords)
    .values({
      title,
      scripture,
      revisedKoreanText: revisedKoreanText || null,
      newKoreanTranslationText: newKoreanTranslationText || null,
      nivText: nivText || null,
      message,
      application: application || null,
      prayer: prayer || null,
      source: "manual",
      publishedOn
    })
    .returning();

  return Response.json({ word: saved }, { status: 201 });
}

export async function PATCH(request: Request) {
  if (!await isImmanuelAdminRequest(request)) {
    return Response.json({ error: "권한이 없습니다." }, { status: 403 });
  }

  const id = Number(new URL(request.url).searchParams.get("id"));
  if (!Number.isInteger(id) || id < 1) {
    return Response.json({ error: "대상을 확인해 주세요." }, { status: 400 });
  }

  const body = (await request.json()) as Record<string, unknown>;
  const title = clean(body.title, 200);
  const scripture = clean(body.scripture, 240);
  const message = clean(body.message, 6000);
  const publishedOn = clean(body.publishedOn, 20);
  if (!title || !scripture || !message || !/^\d{4}-\d{2}-\d{2}$/.test(publishedOn)) {
    return Response.json({ error: "날짜, 제목, 성경 본문, 강해 내용을 확인해 주세요." }, { status: 400 });
  }

  const [saved] = await getDb().update(dailyWords).set({
    title,
    scripture,
    revisedKoreanText: clean(body.revisedKoreanText, 12000) || null,
    newKoreanTranslationText: clean(body.newKoreanTranslationText, 12000) || null,
    nivText: clean(body.nivText, 12000) || null,
    message,
    application: clean(body.application, 4000) || null,
    prayer: clean(body.prayer, 2000) || null,
    source: "manual",
    publishedOn
  }).where(eq(dailyWords.id, id)).returning();

  if (!saved) return Response.json({ error: "말씀을 찾지 못했습니다." }, { status: 404 });
  return Response.json({ word: saved });
}

export async function DELETE(request: Request) {
  if (!await isImmanuelAdminRequest(request)) {
    return Response.json({ error: "권한이 없습니다." }, { status: 403 });
  }

  const id = Number(new URL(request.url).searchParams.get("id"));
  if (!Number.isInteger(id) || id < 1) {
    return Response.json({ error: "대상을 확인해 주세요." }, { status: 400 });
  }

  await getDb().delete(dailyWords).where(eq(dailyWords.id, id));
  return Response.json({ ok: true });
}
