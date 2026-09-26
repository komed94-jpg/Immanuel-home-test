// 66권 이름·장 수·링크 코드는 대한성서공회 공개 도서 목록 기준.
export const BIBLE_BOOKS = [
  { name: "창세기", code: "gen", chapters: 50 },
  { name: "출애굽기", code: "exo", chapters: 40 },
  { name: "레위기", code: "lev", chapters: 27 },
  { name: "민수기", code: "num", chapters: 36 },
  { name: "신명기", code: "deu", chapters: 34 },
  { name: "여호수아", code: "jos", chapters: 24 },
  { name: "사사기", code: "jdg", chapters: 21 },
  { name: "룻기", code: "rut", chapters: 4 },
  { name: "사무엘상", code: "1sa", chapters: 31 },
  { name: "사무엘하", code: "2sa", chapters: 24 },
  { name: "열왕기상", code: "1ki", chapters: 22 },
  { name: "열왕기하", code: "2ki", chapters: 25 },
  { name: "역대상", code: "1ch", chapters: 29 },
  { name: "역대하", code: "2ch", chapters: 36 },
  { name: "에스라", code: "ezr", chapters: 10 },
  { name: "느헤미야", code: "neh", chapters: 13 },
  { name: "에스더", code: "est", chapters: 10 },
  { name: "욥기", code: "job", chapters: 42 },
  { name: "시편", code: "psa", chapters: 150 },
  { name: "잠언", code: "pro", chapters: 31 },
  { name: "전도서", code: "ecc", chapters: 12 },
  { name: "아가", code: "sng", chapters: 8 },
  { name: "이사야", code: "isa", chapters: 66 },
  { name: "예레미야", code: "jer", chapters: 52 },
  { name: "예레미야애가", code: "lam", chapters: 5 },
  { name: "에스겔", code: "ezk", chapters: 48 },
  { name: "다니엘", code: "dan", chapters: 12 },
  { name: "호세아", code: "hos", chapters: 14 },
  { name: "요엘", code: "jol", chapters: 3 },
  { name: "아모스", code: "amo", chapters: 9 },
  { name: "오바댜", code: "oba", chapters: 1 },
  { name: "요나", code: "jnh", chapters: 4 },
  { name: "미가", code: "mic", chapters: 7 },
  { name: "나훔", code: "nam", chapters: 3 },
  { name: "하박국", code: "hab", chapters: 3 },
  { name: "스바냐", code: "zep", chapters: 3 },
  { name: "학개", code: "hag", chapters: 2 },
  { name: "스가랴", code: "zec", chapters: 14 },
  { name: "말라기", code: "mal", chapters: 4 },
  { name: "마태복음", code: "mat", chapters: 28 },
  { name: "마가복음", code: "mrk", chapters: 16 },
  { name: "누가복음", code: "luk", chapters: 24 },
  { name: "요한복음", code: "jhn", chapters: 21 },
  { name: "사도행전", code: "act", chapters: 28 },
  { name: "로마서", code: "rom", chapters: 16 },
  { name: "고린도전서", code: "1co", chapters: 16 },
  { name: "고린도후서", code: "2co", chapters: 13 },
  { name: "갈라디아서", code: "gal", chapters: 6 },
  { name: "에베소서", code: "eph", chapters: 6 },
  { name: "빌립보서", code: "php", chapters: 4 },
  { name: "골로새서", code: "col", chapters: 4 },
  { name: "데살로니가전서", code: "1th", chapters: 5 },
  { name: "데살로니가후서", code: "2th", chapters: 3 },
  { name: "디모데전서", code: "1ti", chapters: 6 },
  { name: "디모데후서", code: "2ti", chapters: 4 },
  { name: "디도서", code: "tit", chapters: 3 },
  { name: "빌레몬서", code: "phm", chapters: 1 },
  { name: "히브리서", code: "heb", chapters: 13 },
  { name: "야고보서", code: "jas", chapters: 5 },
  { name: "베드로전서", code: "1pe", chapters: 5 },
  { name: "베드로후서", code: "2pe", chapters: 3 },
  { name: "요한1서", code: "1jn", chapters: 5 },
  { name: "요한2서", code: "2jn", chapters: 1 },
  { name: "요한3서", code: "3jn", chapters: 1 },
  { name: "유다서", code: "jud", chapters: 1 },
  { name: "요한계시록", code: "rev", chapters: 22 },
] as const;

export const READING_DAYS = 365;
export const READING_CHAPTERS = 1189;
export const READING_COURSE = "bible-reading-365";

export type ReadingChapter = { name: string; code: string; chapter: number; url: string };

const chapters: ReadingChapter[] = BIBLE_BOOKS.flatMap((book) =>
  Array.from({ length: book.chapters }, (_, index) => ({
    name: book.name,
    code: book.code,
    chapter: index + 1,
    url: `https://www.bskorea.or.kr/bible/korbibReadpage.php?book=${book.code}&chap=${index + 1}&version=GAE`,
  })),
);

export function readingForDay(day: number): ReadingChapter[] {
  if (!Number.isInteger(day) || day < 1 || day > READING_DAYS) return [];
  const start = Math.floor((day - 1) * READING_CHAPTERS / READING_DAYS);
  const end = Math.floor(day * READING_CHAPTERS / READING_DAYS);
  return chapters.slice(start, end);
}

export function readingLabel(items: ReadingChapter[]): string {
  if (!items.length) return "";
  const first = items[0];
  const last = items[items.length - 1];
  return first.name === last.name
    ? `${first.name} ${first.chapter}–${last.chapter}장`
    : `${first.name} ${first.chapter}장 – ${last.name} ${last.chapter}장`;
}
