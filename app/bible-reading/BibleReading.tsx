"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { READING_DAYS, readingForDay, readingLabel } from "@/lib/bible-reading";

const GUEST_KEY = "immanuel-bible-reading-365-v1";
type Mode = "loading" | "guest" | "member" | "error";

function safeDays(value: unknown): number[] {
  return Array.isArray(value) ? [...new Set(value.filter((day) => Number.isInteger(day) && day >= 1 && day <= READING_DAYS))] as number[] : [];
}

export function BibleReading() {
  const [mode, setMode] = useState<Mode>("loading");
  const [completed, setCompleted] = useState<number[]>([]);
  const [day, setDay] = useState(1);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");
  const chapters = readingForDay(day);
  const nextUnread = Array.from({ length: READING_DAYS }, (_, index) => index + 1).find((number) => !completed.includes(number));

  function load() {
    void fetch("/api/member/bible-reading", { cache: "no-store" }).then(async (response) => {
      if (response.status === 401) {
        let stored: unknown = [];
        try { stored = JSON.parse(localStorage.getItem(GUEST_KEY) || "[]"); } catch { /* 이전 기록이 손상되면 빈 진도로 시작합니다. */ }
        const saved = safeDays(stored);
        setCompleted(saved);
        setDay(firstUnread(saved));
        setMode("guest");
        return;
      }
      if (!response.ok) throw new Error("진도를 불러오지 못했습니다. 다시 시도해 주세요.");
      const data = await response.json();
      const saved = safeDays(data.completedDays);
      setCompleted(saved);
      setDay(firstUnread(saved));
      setMode("member");
    }).catch((error) => {
      setMode("error");
      setNotice(error instanceof Error ? error.message : "진도를 불러오지 못했습니다.");
    });
  }

  useEffect(() => { void load(); }, []);

  async function toggleCompleted() {
    if (saving || (mode !== "guest" && mode !== "member")) return;
    const updated = completed.includes(day) ? completed.filter((value) => value !== day) : [...completed, day].sort((a, b) => a - b);
    setSaving(true);
    setNotice("");
    try {
      if (mode === "guest") {
        localStorage.setItem(GUEST_KEY, JSON.stringify(updated));
      } else {
        const response = await fetch("/api/member/bible-reading", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ day, completed: !completed.includes(day) }),
        });
        if (!response.ok) {
          const result = await response.json().catch(() => ({}));
          throw new Error(result.error || "진도를 저장하지 못했습니다. 다시 시도해 주세요.");
        }
      }
      setCompleted(updated);
      setNotice(updated.includes(day) ? `${day}일차를 읽음으로 기록했습니다.` : `${day}일차 읽음 표시를 해제했습니다.`);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "진도를 저장하지 못했습니다.");
    } finally { setSaving(false); }
  }

  return <div className="reading-page">
    <div className="reading-shell">
      <div className="reading-heading"><p className="section-kicker">BIBLE READING</p><h1>성경읽기</h1><p>하루 3~4장씩, 창세기부터 요한계시록까지 365일에 읽습니다. 시작 날짜는 자유롭게 정하세요.</p></div>
      <div className="reading-layout">
        <section className="reading-card" aria-labelledby="reading-day-title">
          <div className="reading-topline"><span>365일 통독표</span><span>{day} / {READING_DAYS}일</span></div>
          <div className="reading-day-heading"><div><p className="reading-eyebrow">오늘 선택한 분량</p><h2 id="reading-day-title">{day}일차</h2><p className="reading-passage">{readingLabel(chapters)}</p></div><span className="reading-check">{completed.includes(day) ? "읽음" : "읽기 전"}</span></div>
          <p className="reading-instruction">장 제목을 누르면 대한성서공회 개역개정 본문이 새 창에서 열립니다. 모두 읽은 뒤 아래에서 완료를 표시하세요.</p>
          <ul className="reading-chapters">{chapters.map((item) => <li key={`${item.code}-${item.chapter}`}><a href={item.url} target="_blank" rel="noopener noreferrer" aria-label={`${item.name} ${item.chapter}장 대한성서공회에서 읽기`}><span>{item.name} {item.chapter}장</span><span aria-hidden="true">↗</span></a></li>)}</ul>
          {mode === "loading" && <p role="status">진도를 불러오는 중입니다…</p>}
          {mode === "error" && <button type="button" className="reading-secondary" onClick={() => { setMode("loading"); setNotice(""); void load(); }}>진도 다시 불러오기</button>}
          {(mode === "guest" || mode === "member") && <button className="reading-primary" type="button" onClick={() => void toggleCompleted()} disabled={saving}>{saving ? "저장 중…" : completed.includes(day) ? "읽음 표시 해제" : "이 날 분량 읽음 표시"}</button>}
          {notice && <p className="reading-notice" role="status">{notice}</p>}
          <div className="reading-controls"><button type="button" disabled={day === 1} onClick={() => { setDay(day - 1); setNotice(""); }}>← 이전</button><label htmlFor="reading-day-select">일차 이동</label><select id="reading-day-select" value={day} onChange={(event) => { setDay(Number(event.target.value)); setNotice(""); }}>{Array.from({ length: READING_DAYS }, (_, index) => <option value={index + 1} key={index + 1}>{index + 1}일차</option>)}</select><button type="button" disabled={day === READING_DAYS} onClick={() => { setDay(day + 1); setNotice(""); }}>다음 →</button></div>
        </section>
        <aside className="reading-progress"><h2>내 읽기 진도</h2><strong>{mode === "loading" ? "…" : completed.length}<small> / {READING_DAYS}일</small></strong><progress value={completed.length} max={READING_DAYS} aria-label="성경읽기 완료 진도" /><p>읽음 표시는 직접 누른 날만 기록됩니다. 지나간 분량도 일차를 선택해 읽을 수 있습니다.</p>{nextUnread && <button type="button" className="reading-secondary" disabled={mode === "loading" || mode === "error"} onClick={() => { setDay(nextUnread); setNotice(""); }}>{nextUnread}일차 이어 읽기</button>}{!nextUnread && mode !== "loading" && <p>365일 읽기를 모두 마쳤습니다.</p>}{mode === "guest" && <p className="reading-account">현재 기록은 이 브라우저에 저장됩니다. 기기를 바꾸어 이어 읽으려면 <Link href="/login?returnTo=/bible-reading">로그인</Link>한 뒤 기록하세요. 로그인 기록과 브라우저 기록은 따로 보관됩니다.</p>}{mode === "member" && <p className="reading-account">로그인 계정에 진도가 저장됩니다.</p>}</aside>
      </div>
      <p className="reading-credit">성경 본문은 대한성서공회 웹사이트에서 제공하며, 임마누엘 홈페이지에는 본문을 저장하지 않습니다.</p>
    </div>
  </div>;
}

function firstUnread(days: number[]) {
  return Array.from({ length: READING_DAYS }, (_, index) => index + 1).find((day) => !days.includes(day)) ?? READING_DAYS;
}
