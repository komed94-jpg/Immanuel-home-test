"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
type AttendanceEvent = { id: number; title: string; eventType: string; heldOn: string; startsAt: string | null };
type Member = { id: number; name: string; memberNumber: string | null };
type RecordItem = { id: number; memberId: number; status: string; note: string | null };
const typeLabels: Record<string, string> = { sunday: "주일예배", dawn: "새벽예배", friday: "금요기도회", "small-group": "목장 모임", discipleship: "제자훈련", special: "특별집회", event: "교회 행사" };

export function AttendanceManager() {
  const [events, setEvents] = useState<AttendanceEvent[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [records, setRecords] = useState<RecordItem[]>([]);
  const [selectedEvent, setSelectedEvent] = useState("");
  const [query, setQuery] = useState("");
  const [notice, setNotice] = useState("");

  const load = useCallback(async (eventId = "") => {
    const response = await fetch(`/api/admin/attendance${eventId ? `?eventId=${eventId}` : ""}`, { cache: "no-store" });
    const result = (await response.json()) as { events?: AttendanceEvent[]; members?: Member[]; records?: RecordItem[] };
    if (!response.ok) throw new Error();
    setEvents(result.events ?? []); setMembers(result.members ?? []); setRecords(result.records ?? []);
  }, []);
  useEffect(() => {
    fetch("/api/admin/attendance", { cache: "no-store" })
      .then(async (response) => {
        const result = (await response.json()) as { events?: AttendanceEvent[]; members?: Member[]; records?: RecordItem[] };
        if (!response.ok) throw new Error();
        setEvents(result.events ?? []);
        setMembers(result.members ?? []);
        setRecords(result.records ?? []);
      })
      .catch(() => setNotice("출석 정보를 불러오지 못했습니다."));
  }, []);

  function selectEvent(eventId: string) {
    setSelectedEvent(eventId);
    if (!eventId) { setRecords([]); return; }
    load(eventId).catch(() => setNotice("출석 정보를 불러오지 못했습니다."));
  }

  async function createEvent(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); const form = event.currentTarget;
    const response = await fetch("/api/admin/attendance", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "create-event", ...Object.fromEntries(new FormData(form)) }) });
    const result = (await response.json()) as { error?: string; event?: AttendanceEvent };
    setNotice(response.ok ? "출석 모임을 만들었습니다." : result.error ?? "저장하지 못했습니다.");
    if (response.ok) { form.reset(); await load(""); if (result.event) setSelectedEvent(String(result.event.id)); }
  }

  async function mark(memberId: number, status: string) {
    if (!selectedEvent) return;
    const response = await fetch("/api/admin/attendance", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "mark", eventId: Number(selectedEvent), memberId, status }) });
    if (!response.ok) { setNotice("출석을 저장하지 못했습니다."); return; }
    setNotice("출석을 저장했습니다."); await load(selectedEvent);
  }
  const keyword = query.trim().toLowerCase();
  const filtered = members.filter((item) => !keyword || [item.name, item.memberNumber].some((value) => value?.toLowerCase().includes(keyword)));
  const recordMap = new Map(records.map((item) => [item.memberId, item.status]));
  return <section className="attendance-manager">
    {notice && <p className="content-manager-notice" role="status">{notice}</p>}
    <div className="attendance-manager-grid"><form className="request-form" onSubmit={createEvent}><h2>출석 모임 만들기</h2><label><span>모임명</span><input name="title" required placeholder="예: 2026년 7월 넷째 주 주일예배" /></label><div className="request-form-grid"><label><span>구분</span><select name="eventType" defaultValue="sunday">{Object.entries(typeLabels).map(([value, label]) => <option value={value} key={value}>{label}</option>)}</select></label><label><span>날짜</span><input name="heldOn" type="date" required /></label></div><label><span>시작 시각 <small>선택</small></span><input name="startsAt" type="datetime-local" /></label><button className="primary-link request-submit" type="submit">출석 모임 저장</button></form>
    <div className="attendance-event-list"><h2>출석 모임 선택</h2><select value={selectedEvent} onChange={(event) => selectEvent(event.target.value)}><option value="">모임을 선택하세요</option>{events.map((item) => <option value={item.id} key={item.id}>{item.heldOn} · {item.title}</option>)}</select></div></div>
    {selectedEvent && <><div className="request-inbox-tools"><label><span>교인 검색</span><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="이름 또는 교인번호" /></label></div><div className="attendance-member-list">{filtered.map((item) => <article key={item.id}><div><strong>{item.name}</strong><small>{item.memberNumber}</small></div><div>{[["present", "출석"], ["late", "지각"], ["excused", "사유"], ["absent", "결석"]].map(([status, label]) => <button type="button" className={recordMap.get(item.id) === status ? "is-active" : ""} key={status} onClick={() => void mark(item.id, status)}>{label}</button>)}</div></article>)}</div></>}
  </section>;
}
