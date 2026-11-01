"use client";

import { useEffect, useState } from "react";
import { BIBLE_BOOKS } from "@/lib/bible-reading";

type DailyWord = {
  id: number;
  title: string;
  scripture: string;
  revisedKoreanText: string | null;
  newKoreanTranslationText: string | null;
  nivText: string | null;
  message: string;
  application: string | null;
  prayer: string | null;
  source: string;
  publishedOn: string;
};

type Translation = { label: string; text: string | null; url: string | null };

function koreanBibleUrl(scripture: string, version: "GAE" | "SAENEW") {
  const match = /^(.+?)\s+(\d+):\d+/.exec(scripture);
  if (!match) return null;
  const bookName = match[1] === "요한일서" ? "요한1서" : match[1];
  const book = BIBLE_BOOKS.find((item) => item.name === bookName);
  const chapter = Number(match[2]);
  if (!book || chapter < 1 || chapter > book.chapters) return null;
  return `https://www.bskorea.or.kr/bible/korbibReadpage.php?book=${book.code}&chap=${chapter}&version=${version}`;
}

function formatDate(value: string) {
  return new Date(`${value}T00:00:00`).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long"
  });
}

export function DailyWordArchive() {
  const [items, setItems] = useState<DailyWord[] | null>(null);

  useEffect(() => {
    fetch("/api/word")
      .then((response) => response.json())
      .then((value) => {
        const data = value as { words?: DailyWord[] };
        setItems(data.words ?? []);
      })
      .catch(() => setItems([]));
  }, []);

  if (items === null) {
    return <section className="resource-list resource-empty"><p>오늘의 말씀을 불러오는 중입니다…</p></section>;
  }

  if (!items.length) {
    return <section className="resource-list resource-empty"><p>현재 등록된 오늘의 말씀이 없습니다.</p></section>;
  }

  return (
    <section className="resource-list daily-word-list" aria-label="오늘의 말씀 목록">
      {items.map((item, index) => (
        <article className={`resource-card daily-word-card${index === 0 ? " is-latest" : ""}`} key={item.id}>
          <time dateTime={item.publishedOn}>{formatDate(item.publishedOn)}</time>
          {index === 0 && <small>오늘의 말씀</small>}
          <h2>{item.title}</h2>
          <p className="daily-word-scripture">{item.scripture}</p>
          <div className="daily-word-translations" aria-label={`${item.scripture} 성경 번역본`}>
            {([
              { label: "개역개정", text: item.revisedKoreanText, url: koreanBibleUrl(item.scripture, "GAE") },
              { label: "새번역", text: item.newKoreanTranslationText, url: koreanBibleUrl(item.scripture, "SAENEW") },
              { label: "NIV", text: item.nivText, url: "https://www.biblegateway.com/versions/New-International-Version-NIV-Bible/" }
            ] satisfies Translation[]).map((translation) => (
              <section className="daily-word-translation" key={translation.label}>
                <h3>{translation.label}</h3>
                {translation.text ? <p>{translation.text}</p> : (
                  <p>본문은 제공 기관에서 읽을 수 있습니다. {translation.url && <a href={translation.url} target="_blank" rel="noopener noreferrer" aria-label={`${item.scripture} ${translation.label} 본문 새 창에서 읽기`}>{translation.label === "NIV" ? "NIV에서 구절 찾기 ↗" : "해당 장에서 본문 읽기 ↗"}</a>}</p>
                )}
              </section>
            ))}
          </div>
          <p className="daily-word-translation-notice">개역개정·새번역은 대한성서공회에서, NIV는 Bible Gateway에서 읽을 수 있습니다. 본문은 각 제공 기관에서 열립니다.</p>
          <div className="daily-word-section"><small>말씀 강해</small><p className="daily-word-message">{item.message}</p></div>
          {item.application && <div className="daily-word-section daily-word-application"><small>오늘의 적용</small><p>{item.application}</p></div>}
          {item.prayer && <div className="daily-word-prayer"><small>함께 드리는 기도</small><p>{item.prayer}</p></div>}
        </article>
      ))}
    </section>
  );
}
