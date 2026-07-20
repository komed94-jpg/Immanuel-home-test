import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { dailyWords } from "@/db/schema";
import { getDailyWordSeed, getPublishDateKst } from "@/lib/daily-word";

export async function ensureAutomaticWord(publishedOn = getPublishDateKst()) {
  const db = getDb();
  const [existing] = await db
    .select({
      id: dailyWords.id,
      source: dailyWords.source,
      revisedKoreanText: dailyWords.revisedKoreanText,
      newKoreanTranslationText: dailyWords.newKoreanTranslationText,
      nivText: dailyWords.nivText,
    })
    .from(dailyWords)
    .where(eq(dailyWords.publishedOn, publishedOn))
    .limit(1);

  if (existing) {
    const seed = getDailyWordSeed(publishedOn);
    const translations = existing.source === "automatic" ? {
      revisedKoreanText: existing.revisedKoreanText || seed.revisedKoreanText || null,
      newKoreanTranslationText: existing.newKoreanTranslationText || seed.newKoreanTranslationText || null,
      nivText: existing.nivText || seed.nivText || null,
    } : null;
    if (translations && (
      translations.revisedKoreanText !== existing.revisedKoreanText ||
      translations.newKoreanTranslationText !== existing.newKoreanTranslationText ||
      translations.nivText !== existing.nivText
    )) {
      await db.update(dailyWords).set(translations).where(eq(dailyWords.id, existing.id));
    }
    return { created: false, id: existing.id, publishedOn };
  }

  const seed = getDailyWordSeed(publishedOn);
  const [created] = await db
    .insert(dailyWords)
    .values({ ...seed, publishedOn, source: "automatic" })
    .onConflictDoNothing({ target: dailyWords.publishedOn })
    .returning({ id: dailyWords.id });

  if (created) {
    return { created: true, id: created.id, publishedOn };
  }

  const [concurrent] = await db
    .select({ id: dailyWords.id })
    .from(dailyWords)
    .where(eq(dailyWords.publishedOn, publishedOn))
    .limit(1);

  return { created: false, id: concurrent?.id ?? null, publishedOn };
}

export async function prepareAutomaticWords(days: number) {
  const start = getPublishDateKst();
  let prepared = 0;

  for (let offset = 0; offset < days; offset += 1) {
    const date = new Date(`${start}T00:00:00+09:00`);
    date.setUTCDate(date.getUTCDate() + offset);
    const publishedOn = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Seoul",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(date);
    const result = await ensureAutomaticWord(publishedOn);
    if (result.created) prepared += 1;
  }

  return { prepared, days, start };
}
