"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";

type Sermon = { id: number; title: string; scripture: string | null; preacher: string | null; preachedOn: string; videoUrl: string; description: string | null };
type ChurchEvent = { id: number; title: string; category: string | null; startsAt: string; endsAt: string | null; location: string | null; description: string | null };
type Program = { id: number; title: string; summary: string; schedule: string | null; location: string | null; capacity: string | null; status: string; sortOrder: number };
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

export function ContentManager() {
  const [sermons, setSermons] = useState<Sermon[]>([]);
  const [events, setEvents] = useState<ChurchEvent[]>([]);
  const [words, setWords] = useState<DailyWord[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [editingWordId, setEditingWordId] = useState<number | null>(null);
  const [editingSermonId, setEditingSermonId] = useState<number | null>(null);
  const [editingEventId, setEditingEventId] = useState<number | null>(null);
  const [editingProgramId, setEditingProgramId] = useState<number | null>(null);
  const [notice, setNotice] = useState("");

  const load = useCallback(async () => {
    const [sermonResponse, eventResponse, wordResponse, programResponse] = await Promise.all([
      fetch("/api/sermons"),
      fetch("/api/events"),
      fetch("/api/word?all=1"),
      fetch("/api/discipleship-programs")
    ]);
    const sermonData = (await sermonResponse.json()) as { sermons?: Sermon[] };
    const eventData = (await eventResponse.json()) as { events?: ChurchEvent[] };
    const wordData = (await wordResponse.json()) as { words?: DailyWord[] };
    const programData = (await programResponse.json()) as { programs?: Program[] };
    setSermons(sermonData.sermons ?? []);
    setEvents(eventData.events ?? []);
    setWords(wordData.words ?? []);
    setPrograms(programData.programs ?? []);
  }, []);

  useEffect(() => {
    let active = true;
    Promise.all([fetch("/api/sermons"), fetch("/api/events"), fetch("/api/word?all=1"), fetch("/api/discipleship-programs")])
      .then(async ([sermonResponse, eventResponse, wordResponse, programResponse]) => {
        const sermonData = (await sermonResponse.json()) as { sermons?: Sermon[] };
        const eventData = (await eventResponse.json()) as { events?: ChurchEvent[] };
        const wordData = (await wordResponse.json()) as { words?: DailyWord[] };
        const programData = (await programResponse.json()) as { programs?: Program[] };
        if (active) {
          setSermons(sermonData.sermons ?? []);
          setEvents(eventData.events ?? []);
          setWords(wordData.words ?? []);
          setPrograms(programData.programs ?? []);
        }
      })
      .catch(() => active && setNotice("목록을 불러오지 못했습니다."));
    return () => { active = false; };
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>, endpoint: string) {
    event.preventDefault();
    const form = event.currentTarget;
    const payload = Object.fromEntries(new FormData(form));
    const response = await fetch(endpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    const result = (await response.json()) as { error?: string };
    if (!response.ok) { setNotice(result.error ?? "저장하지 못했습니다."); return; }
    form.reset();
    setNotice("저장되었습니다.");
    await load();
  }

  async function remove(endpoint: string, id: number) {
    if (!window.confirm("이 항목을 삭제하시겠습니까?")) return;
    const response = await fetch(`${endpoint}?id=${id}`, { method: "DELETE" });
    if (!response.ok) { setNotice("삭제하지 못했습니다."); return; }
    setNotice("삭제되었습니다.");
    await load();
  }

  async function updateWord(event: FormEvent<HTMLFormElement>, id: number) {
    event.preventDefault();
    const response = await fetch(`/api/word?id=${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(new FormData(event.currentTarget)))
    });
    const result = (await response.json()) as { error?: string };
    if (!response.ok) { setNotice(result.error ?? "수정하지 못했습니다."); return; }
    setEditingWordId(null);
    setNotice("오늘의 말씀이 수정되었습니다.");
    await load();
  }

  async function update(event: FormEvent<HTMLFormElement>, endpoint: string, close: () => void) {
    event.preventDefault();
    const response = await fetch(endpoint, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(Object.fromEntries(new FormData(event.currentTarget))) });
    const result = (await response.json()) as { error?: string };
    if (!response.ok) { setNotice(result.error ?? "수정하지 못했습니다."); return; }
    close(); setNotice("수정되었습니다."); await load();
  }

  async function prepareWords() {
    const response = await fetch("/api/word?prepare=7", { method: "POST" });
    const result = (await response.json()) as { error?: string; prepared?: number };
    setNotice(response.ok ? `앞으로 7일 말씀 ${result.prepared ?? 0}건을 준비했습니다.` : result.error ?? "준비하지 못했습니다.");
    if (response.ok) await load();
  }

  async function submitGiving(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const response = await fetch("/api/giving", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(Object.fromEntries(new FormData(form))) });
    const result = (await response.json()) as { error?: string };
    setNotice(response.ok ? "헌금 안내가 저장되었습니다." : result.error ?? "저장하지 못했습니다.");
    if (response.ok) form.reset();
  }

  return <section className="content-manager">
    {notice && <p className="content-manager-notice" role="status">{notice}</p>}
    <div className="daily-word-manager">
      <h2>오늘의 말씀 등록</h2>
      <p className="daily-word-automation-note">매일 한국시간 새벽 4시 30분에 날짜별 말씀이 자동으로 준비됩니다. 자동 등록된 내용도 아래에서 직접 수정하거나 삭제할 수 있습니다.</p>
      <button className="admin-secondary-button" type="button" onClick={prepareWords}>앞으로 7일 말씀 미리 준비</button>
      <form className="request-form" onSubmit={(event) => submit(event, "/api/word")}>
        <div className="request-form-grid"><label><span>게시일</span><input name="publishedOn" type="date" required /></label><label><span>성경 본문</span><input name="scripture" type="text" required placeholder="예: 요한복음 3:16" /></label></div>
        <label><span>제목</span><input name="title" type="text" required /></label>
        <label><span>개역개정 본문 <small>허가된 본문이 있을 때 입력</small></span><textarea name="revisedKoreanText" rows={4} /></label>
        <label><span>새번역 본문 <small>허가된 본문이 있을 때 입력</small></span><textarea name="newKoreanTranslationText" rows={4} /></label>
        <label><span>NIV 본문 <small>허가된 본문이 있을 때 입력</small></span><textarea name="nivText" rows={4} lang="en" /></label>
        <label><span>말씀 강해</span><textarea name="message" rows={8} required /></label>
        <label><span>오늘의 적용 <small>선택</small></span><textarea name="application" rows={4} /></label>
        <label><span>함께 드리는 기도 <small>선택</small></span><textarea name="prayer" rows={4} /></label>
        <button className="primary-link request-submit" type="submit">오늘의 말씀 저장</button>
      </form>
      <div className="admin-content-list">{words.map((item) => <article key={item.id}><div className="admin-word-item"><div className="admin-word-heading"><div><small>{item.publishedOn} · {item.scripture} · {item.source === "automatic" ? "자동 등록" : "관리자 등록"}</small><h3>{item.title}</h3></div><div className="admin-content-actions"><button type="button" onClick={() => setEditingWordId(editingWordId === item.id ? null : item.id)}>{editingWordId === item.id ? "닫기" : "수정"}</button><button type="button" onClick={() => remove("/api/word", item.id)}>삭제</button></div></div>{editingWordId === item.id && <form className="request-form word-edit-form" onSubmit={(event) => updateWord(event, item.id)}>
        <div className="request-form-grid"><label><span>게시일</span><input name="publishedOn" type="date" required defaultValue={item.publishedOn} /></label><label><span>성경 본문</span><input name="scripture" type="text" required defaultValue={item.scripture} /></label></div>
        <label><span>제목</span><input name="title" type="text" required defaultValue={item.title} /></label>
        <label><span>개역개정 본문</span><textarea name="revisedKoreanText" rows={4} defaultValue={item.revisedKoreanText ?? ""} /></label>
        <label><span>새번역 본문</span><textarea name="newKoreanTranslationText" rows={4} defaultValue={item.newKoreanTranslationText ?? ""} /></label>
        <label><span>NIV 본문</span><textarea name="nivText" rows={4} lang="en" defaultValue={item.nivText ?? ""} /></label>
        <label><span>말씀 강해</span><textarea name="message" rows={8} required defaultValue={item.message} /></label>
        <label><span>오늘의 적용</span><textarea name="application" rows={4} defaultValue={item.application ?? ""} /></label>
        <label><span>함께 드리는 기도</span><textarea name="prayer" rows={4} defaultValue={item.prayer ?? ""} /></label>
        <button className="primary-link request-submit" type="submit">수정 내용 저장</button>
      </form>}</div></article>)}</div>
    </div>
    <div className="content-manager-grid">
      <div>
        <h2>설교 영상 등록</h2>
        <form className="request-form" onSubmit={(event) => submit(event, "/api/sermons")}>
          <label><span>설교 제목</span><input name="title" type="text" required /></label>
          <div className="request-form-grid"><label><span>설교일</span><input name="preachedOn" type="date" required /></label><label><span>설교자</span><input name="preacher" type="text" /></label></div>
          <label><span>본문</span><input name="scripture" type="text" placeholder="예: 요한복음 3:16" /></label>
          <label><span>YouTube 주소</span><input name="videoUrl" type="url" required placeholder="https://www.youtube.com/watch?v=..." /></label>
          <label><span>설명 <small>선택</small></span><textarea name="description" rows={4} /></label>
          <button className="primary-link request-submit" type="submit">설교 저장</button>
        </form>
        <div className="admin-content-list">{sermons.map((item) => <article key={item.id}><div className="admin-editable-item"><div className="admin-content-heading"><div><small>{item.preachedOn}</small><h3>{item.title}</h3></div><div className="admin-content-actions"><button type="button" onClick={() => setEditingSermonId(editingSermonId === item.id ? null : item.id)}>{editingSermonId === item.id ? "닫기" : "수정"}</button><button type="button" onClick={() => remove("/api/sermons", item.id)}>삭제</button></div></div>{editingSermonId === item.id && <form className="request-form word-edit-form" onSubmit={(event) => update(event, "/api/sermons", () => setEditingSermonId(null))}>
          <input type="hidden" name="id" value={item.id} /><label><span>설교 제목</span><input name="title" required defaultValue={item.title} /></label><div className="request-form-grid"><label><span>설교일</span><input name="preachedOn" type="date" required defaultValue={item.preachedOn} /></label><label><span>설교자</span><input name="preacher" defaultValue={item.preacher ?? ""} /></label></div><label><span>본문</span><input name="scripture" defaultValue={item.scripture ?? ""} /></label><label><span>YouTube 주소</span><input name="videoUrl" type="url" required defaultValue={item.videoUrl} /></label><label><span>설명</span><textarea name="description" rows={4} defaultValue={item.description ?? ""} /></label><button className="primary-link request-submit" type="submit">수정 내용 저장</button>
        </form>}</div></article>)}</div>
      </div>
      <div>
        <h2>행사 일정 등록</h2>
        <form className="request-form" onSubmit={(event) => submit(event, "/api/events")}>
          <label><span>행사명</span><input name="title" type="text" required /></label>
          <label><span>구분 <small>선택</small></span><input name="category" type="text" placeholder="예배, 훈련, 공동체" /></label>
          <div className="request-form-grid"><label><span>시작</span><input name="startsAt" type="datetime-local" required /></label><label><span>종료 <small>선택</small></span><input name="endsAt" type="datetime-local" /></label></div>
          <label><span>장소 <small>선택</small></span><input name="location" type="text" /></label>
          <label><span>설명 <small>선택</small></span><textarea name="description" rows={4} /></label>
          <button className="primary-link request-submit" type="submit">행사 저장</button>
        </form>
        <div className="admin-content-list">{events.map((item) => <article key={item.id}><div className="admin-editable-item"><div className="admin-content-heading"><div><small>{new Date(item.startsAt).toLocaleString("ko-KR")}</small><h3>{item.title}</h3></div><div className="admin-content-actions"><button type="button" onClick={() => setEditingEventId(editingEventId === item.id ? null : item.id)}>{editingEventId === item.id ? "닫기" : "수정"}</button><button type="button" onClick={() => remove("/api/events", item.id)}>삭제</button></div></div>{editingEventId === item.id && <form className="request-form word-edit-form" onSubmit={(event) => update(event, "/api/events", () => setEditingEventId(null))}>
          <input type="hidden" name="id" value={item.id} /><label><span>행사명</span><input name="title" required defaultValue={item.title} /></label><label><span>구분</span><input name="category" defaultValue={item.category ?? ""} /></label><div className="request-form-grid"><label><span>시작</span><input name="startsAt" type="datetime-local" required defaultValue={item.startsAt.slice(0, 16)} /></label><label><span>종료</span><input name="endsAt" type="datetime-local" defaultValue={item.endsAt?.slice(0, 16) ?? ""} /></label></div><label><span>장소</span><input name="location" defaultValue={item.location ?? ""} /></label><label><span>설명</span><textarea name="description" rows={4} defaultValue={item.description ?? ""} /></label><button className="primary-link request-submit" type="submit">수정 내용 저장</button>
        </form>}</div></article>)}</div>
      </div>
    </div>
    <div className="giving-manager">
      <h2>제자훈련 과정 관리</h2>
      <form className="request-form" onSubmit={(event) => submit(event, "/api/discipleship-programs")}>
        <label><span>과정명</span><input name="title" required /></label><label><span>과정 소개</span><textarea name="summary" rows={5} required /></label><div className="request-form-grid"><label><span>일정</span><input name="schedule" placeholder="예: 매주 수요일 오후 7시" /></label><label><span>장소</span><input name="location" /></label></div><div className="request-form-grid"><label><span>정원</span><input name="capacity" placeholder="예: 12명" /></label><label><span>상태</span><select name="status" defaultValue="recruiting"><option value="recruiting">모집 중</option><option value="ongoing">진행 중</option><option value="closed">마감</option></select></label></div><label><span>표시 순서</span><input name="sortOrder" type="number" defaultValue="0" /></label><button className="primary-link request-submit" type="submit">과정 저장</button>
      </form>
      <div className="admin-content-list">{programs.map((item) => <article key={item.id}><div className="admin-editable-item"><div className="admin-content-heading"><div><small>{item.status === "recruiting" ? "모집 중" : item.status === "ongoing" ? "진행 중" : "마감"}</small><h3>{item.title}</h3></div><div className="admin-content-actions"><button type="button" onClick={() => setEditingProgramId(editingProgramId === item.id ? null : item.id)}>{editingProgramId === item.id ? "닫기" : "수정"}</button><button type="button" onClick={() => remove("/api/discipleship-programs", item.id)}>삭제</button></div></div>{editingProgramId === item.id && <form className="request-form word-edit-form" onSubmit={(event) => update(event, "/api/discipleship-programs", () => setEditingProgramId(null))}><input type="hidden" name="id" value={item.id} /><label><span>과정명</span><input name="title" required defaultValue={item.title} /></label><label><span>과정 소개</span><textarea name="summary" rows={5} required defaultValue={item.summary} /></label><div className="request-form-grid"><label><span>일정</span><input name="schedule" defaultValue={item.schedule ?? ""} /></label><label><span>장소</span><input name="location" defaultValue={item.location ?? ""} /></label></div><div className="request-form-grid"><label><span>정원</span><input name="capacity" defaultValue={item.capacity ?? ""} /></label><label><span>상태</span><select name="status" defaultValue={item.status}><option value="recruiting">모집 중</option><option value="ongoing">진행 중</option><option value="closed">마감</option></select></label></div><label><span>표시 순서</span><input name="sortOrder" type="number" defaultValue={item.sortOrder} /></label><button className="primary-link request-submit" type="submit">수정 내용 저장</button></form>}</div></article>)}</div>
    </div>
    <div className="giving-manager">
      <h2>온라인 헌금 안내 등록</h2>
      <form className="request-form" onSubmit={submitGiving}>
        <div className="request-form-grid"><label><span>은행</span><input name="bank" type="text" required /></label><label><span>예금주</span><input name="accountHolder" type="text" required /></label></div>
        <label><span>계좌번호</span><input name="accountNumber" type="text" required /></label>
        <label><span>추가 안내 <small>선택</small></span><textarea name="note" rows={4} placeholder="입금자명 작성 방법 등 확인된 안내만 입력" /></label>
        <button className="primary-link request-submit" type="submit">헌금 안내 저장</button>
      </form>
    </div>
  </section>;
}
