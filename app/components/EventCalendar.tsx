"use client";

import { useEffect, useState } from "react";
import { MinistryRequestForm } from "@/app/components/MinistryRequestForm";

type ChurchEvent = { id: number; title: string; category: string | null; startsAt: string; endsAt: string | null; location: string | null; description: string | null; registrationOpen: boolean };
const format = (value: string) => new Date(value).toLocaleString("ko-KR", { dateStyle: "long", timeStyle: "short" });

export function EventCalendar() {
  const [items, setItems] = useState<ChurchEvent[] | null>(null);
  const [showPast, setShowPast] = useState(false);
  useEffect(() => { fetch("/api/events").then((response) => response.json()).then((value) => { const data = value as { events?: ChurchEvent[] }; setItems(data.events ?? []); }).catch(() => setItems([])); }, []);
  if (items === null) return <section className="resource-list resource-empty"><p>행사 일정을 불러오는 중입니다…</p></section>;
  if (!items.length) return <section className="resource-list resource-empty"><p>현재 등록된 행사 일정이 없습니다.</p></section>;
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const filtered = showPast ? items : items.filter((item) => new Date(item.endsAt ?? item.startsAt) >= today);
  return <><div className="resource-tools"><strong>행사 {filtered.length}건</strong><label className="resource-toggle"><input type="checkbox" checked={showPast} onChange={(event) => setShowPast(event.target.checked)} /> 지난 행사 함께 보기</label></div>{!filtered.length ? <section className="resource-list resource-empty"><p>예정된 행사가 없습니다.</p></section> : <section className="resource-list event-list" aria-label="행사 일정 목록">{filtered.map((item) => <article className="resource-card event-card" key={item.id}>
    <time>{format(item.startsAt)}</time>{item.category && <small>{item.category}</small>}<h2>{item.title}</h2>
    {item.endsAt && <p className="resource-meta">종료: {format(item.endsAt)}</p>}{item.location && <p className="resource-meta">장소: {item.location}</p>}{item.description && <p>{item.description}</p>}
    {item.registrationOpen && <details className="event-application"><summary>행사 신청</summary><MinistryRequestForm requestType="event" subjectLabel="행사" messageLabel="참여 인원과 전달사항" submitLabel="행사 신청 보내기" privacyMessage="행사 신청 확인과 안내 연락을 위해서만 사용합니다." nameRequired contactRequired fixedSubject={item.title} /></details>}
  </article>)}</section>}</>;
}
