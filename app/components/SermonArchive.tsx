"use client";

import { useEffect, useState } from "react";

type Sermon = { id: number; title: string; scripture: string | null; preacher: string | null; videoUrl: string; description: string | null; preachedOn: string };

function youtubeId(value: string) {
  try {
    const url = new URL(value);
    if (url.hostname.includes("youtu.be")) return url.pathname.slice(1).split("/")[0];
    return url.searchParams.get("v") ?? url.pathname.split("/").filter(Boolean).at(-1) ?? "";
  } catch { return ""; }
}

export function SermonArchive() {
  const [items, setItems] = useState<Sermon[] | null>(null);
  const [query, setQuery] = useState("");
  useEffect(() => { fetch("/api/sermons").then((response) => response.json()).then((value) => { const data = value as { sermons?: Sermon[] }; setItems(data.sermons ?? []); }).catch(() => setItems([])); }, []);
  if (items === null) return <section className="resource-list resource-empty"><p>설교 영상을 불러오는 중입니다…</p></section>;
  if (!items.length) return <section className="resource-list resource-empty"><p>현재 등록된 설교 영상이 없습니다.</p></section>;
  const keyword = query.trim().toLowerCase();
  const filtered = keyword ? items.filter((item) => [item.title, item.scripture, item.preacher, item.description].some((value) => value?.toLowerCase().includes(keyword))) : items;
  return <><div className="resource-tools"><label><span>설교 검색</span><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="제목, 본문, 설교자 검색" /></label><small>{filtered.length}편</small></div>{!filtered.length ? <section className="resource-list resource-empty"><p>검색 결과가 없습니다.</p></section> : <section className="resource-list sermon-grid" aria-label="설교 영상 목록">{filtered.map((item) => {
    const id = youtubeId(item.videoUrl);
    return <article className="resource-card" key={item.id}>
      {id && <div className="sermon-video"><iframe src={`https://www.youtube.com/embed/${id}`} title={item.title} allowFullScreen /></div>}
      <small>{item.preachedOn}{item.scripture ? ` · ${item.scripture}` : ""}</small><h2>{item.title}</h2>
      {item.preacher && <p className="resource-meta">{item.preacher}</p>}{item.description && <p>{item.description}</p>}
      <a href={item.videoUrl} target="_blank" rel="noreferrer">YouTube에서 보기</a>
    </article>;
  })}</section>}</>;
}
