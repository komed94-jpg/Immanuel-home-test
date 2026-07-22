"use client";

import { useEffect, useMemo, useState } from "react";
import { EventRegistrationForm } from "@/app/components/EventRegistrationForm";

type ChurchEvent = { id: number; title: string; category: string | null; startsAt: string; endsAt: string | null; location: string | null; description: string | null; registrationOpen: boolean; registrationStartsAt: string | null; registrationEndsAt: string | null; capacity: number | null; registeredCount: number; registrationAvailable: boolean };
type Application = { id: number; eventId: number; status: string; attendanceStatus: string | null };

const weekdayNames = ["일", "월", "화", "수", "목", "금", "토"];
const dateOnly = (value: Date) => new Date(value.getFullYear(), value.getMonth(), value.getDate());
const dateKey = (value: Date | string) => { const date = typeof value === "string" ? new Date(value) : value; return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`; };
const formatDate = (value: Date) => value.toLocaleDateString("ko-KR", { month: "long", day: "numeric", weekday: "long" });
const formatTime = (value: string) => new Date(value).toLocaleTimeString("ko-KR", { hour: "numeric", minute: "2-digit" });

export function EventCalendar({ loggedIn = false }: { loggedIn?: boolean }) {
  const [items, setItems] = useState<ChurchEvent[] | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [month, setMonth] = useState(() => new Date(new Date().getFullYear(), new Date().getMonth(), 1));
  const [selectedDate, setSelectedDate] = useState(() => dateOnly(new Date()));

  useEffect(() => {
    fetch("/api/events").then((response) => response.json()).then((value) => setItems((value as { events?: ChurchEvent[] }).events ?? [])).catch(() => setItems([]));
    if (loggedIn) fetch("/api/member/event-applications", { cache: "no-store" }).then((response) => response.ok ? response.json() : { applications: [] }).then((value: { applications?: Application[] }) => setApplications(value.applications ?? [])).catch(() => setApplications([]));
  }, [loggedIn]);

  const eventsByDate = useMemo(() => {
    const map = new Map<string, ChurchEvent[]>();
    (items ?? []).forEach((item) => { const key = dateKey(item.startsAt); map.set(key, [...(map.get(key) ?? []), item]); });
    return map;
  }, [items]);
  const selectedEvents = eventsByDate.get(dateKey(selectedDate)) ?? [];
  const firstGridDate = new Date(month.getFullYear(), month.getMonth(), 1 - month.getDay());
  const days = Array.from({ length: 42 }, (_, index) => new Date(firstGridDate.getFullYear(), firstGridDate.getMonth(), firstGridDate.getDate() + index));
  const today = dateOnly(new Date());
  const moveMonth = (offset: number) => { const next = new Date(month.getFullYear(), month.getMonth() + offset, 1); setMonth(next); };
  const moveToday = () => { const now = dateOnly(new Date()); setMonth(new Date(now.getFullYear(), now.getMonth(), 1)); setSelectedDate(now); };

  if (items === null) return <section className="resource-list resource-empty"><p>행사 일정을 불러오는 중입니다…</p></section>;

  return <section className="event-calendar-wrap" aria-label="행사 캘린더">
    <div className="event-calendar-toolbar">
      <div><p className="section-kicker">EVENT CALENDAR</p><h2>{month.toLocaleDateString("ko-KR", { year: "numeric", month: "long" })}</h2></div>
      <div className="calendar-actions"><button type="button" onClick={() => moveMonth(-1)} aria-label="이전 달">‹</button><button type="button" className="calendar-today" onClick={moveToday}>오늘</button><button type="button" onClick={() => moveMonth(1)} aria-label="다음 달">›</button></div>
    </div>
    <div className="event-calendar-layout">
      <div className="calendar-grid" role="grid" aria-label={`${month.getMonth() + 1}월 행사 일정`}>
        {weekdayNames.map((name, index) => <div className={`calendar-weekday ${index === 0 ? "is-sunday" : ""}`} key={name}>{name}</div>)}
        {days.map((day) => {
          const key = dateKey(day); const dayEvents = eventsByDate.get(key) ?? []; const inMonth = day.getMonth() === month.getMonth();
          const isSelected = key === dateKey(selectedDate); const isToday = key === dateKey(today);
          return <button type="button" className={`calendar-day ${inMonth ? "" : "is-outside"} ${isSelected ? "is-selected" : ""} ${isToday ? "is-today" : ""}`} key={key} onClick={() => setSelectedDate(dateOnly(day))}>
            <span className="calendar-date">{day.getDate()}</span>{dayEvents.slice(0, 2).map((item) => <span className="calendar-event" key={item.id}>{item.title}</span>)}{dayEvents.length > 2 && <span className="calendar-more">+{dayEvents.length - 2}개</span>}
          </button>;
        })}
      </div>
      <aside className="calendar-detail" aria-live="polite">
        <p className="section-kicker">SELECTED DAY</p><h3>{formatDate(selectedDate)}</h3>
        {!selectedEvents.length ? <p className="calendar-empty">등록된 행사가 없습니다.</p> : <div className="calendar-detail-list">{selectedEvents.map((item) => <article key={item.id}>
          <time>{formatTime(item.startsAt)}{item.endsAt && ` – ${formatTime(item.endsAt)}`}</time>{item.category && <small>{item.category}</small>}<h4>{item.title}</h4>
          {item.location && <p className="calendar-location">{item.location}</p>}{item.description && <p>{item.description}</p>}
          {item.registrationOpen && <div className="calendar-registration"><div className="event-registration-meta">{item.capacity ? <span>정원 {item.registeredCount} / {item.capacity}</span> : <span>정원 제한 없음</span>}{item.registrationEndsAt && <span>신청 마감: {new Date(item.registrationEndsAt).toLocaleDateString("ko-KR", { month: "long", day: "numeric" })}</span>}</div><EventRegistrationForm eventId={item.id} available={item.registrationAvailable} loggedIn={loggedIn} application={applications.find((application) => application.eventId === item.id)} /></div>}
        </article>)}</div>}
      </aside>
    </div>
  </section>;
}
