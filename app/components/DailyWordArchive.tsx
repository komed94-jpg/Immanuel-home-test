"use client";

import { useEffect, useState } from "react";

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

type Translation = { label: string; text: string | null };

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
              { label: "개역개정", text: item.revisedKoreanText },
              { label: "새번역", text: item.newKoreanTranslationText },
              { label: "NIV", text: item.nivText }
            ] satisfies Translation[]).map((translation) => (
              <section className="daily-word-translation" key={translation.label}>
                <h3>{translation.label}</h3>
                <p>{translation.text || "본문 준비 중"}</p>
              </section>
            ))}
          </div>
          <div className="daily-word-section"><small>말씀 강해</small><p className="daily-word-message">{item.message}</p></div>
          {item.application && <div className="daily-word-section daily-word-application"><small>오늘의 적용</small><p>{item.application}</p></div>}
          {item.prayer && <div className="daily-word-prayer"><small>함께 드리는 기도</small><p>{item.prayer}</p></div>}
        </article>
      ))}
    </section>
  );
}
