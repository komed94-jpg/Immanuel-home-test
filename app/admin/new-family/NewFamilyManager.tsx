"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

type Followup = {
  id: number;
  journeyId: number;
  actionType: string;
  happenedOn: string;
  result: string;
  nextActionOn: string | null;
  note: string | null;
  createdAt: string;
};

type Journey = {
  id: number;
  registrationId: number;
  memberId: number | null;
  stage: string;
  journeyStatus: string;
  assignee: string | null;
  firstVisitedOn: string | null;
  visitCount: number;
  lastContactOn: string | null;
  lastContactResult: string | null;
  nextActionOn: string | null;
  consultationNote: string | null;
  smallGroupName: string | null;
  educationProgress: number;
  settledAt: string | null;
  updatedAt: string;
  cardType: string;
  reviewStatus: string;
  familyInfo: string;
  participation: string | null;
  name: string | null;
  contact: string | null;
  submittedAt: string;
  memberName: string | null;
  memberNumber: string | null;
};

type Payload = { journeys: Journey[]; followups: Followup[] };

const stageOrder = ["received", "assigned", "contacted", "consulted", "approved", "connected", "education", "settled"];
const stageLabels: Record<string, string> = {
  received: "첫 방문",
  assigned: "담당 배정",
  contacted: "첫 연락",
  consulted: "등록 상담",
  approved: "교인 승인",
  connected: "목장 연결",
  education: "새가족 교육",
  settled: "정착 완료",
};
const statusLabels: Record<string, string> = { active: "진행 중", on_hold: "보류", completed: "정착 완료" };
const actionLabels: Record<string, string> = { call: "전화", message: "문자·메신저", visit: "방문", consultation: "등록 상담", group: "목장 연결", education: "교육", note: "내부 메모" };

function koreaToday() {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Seoul", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
}

function displayDate(value: string | null) {
  return value ? value.replaceAll("-", ". ") : "미정";
}

export function NewFamilyManager() {
  const [data, setData] = useState<Payload | null>(null);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("active");
  const [notice, setNotice] = useState("");
  const today = koreaToday();

  async function load() {
    const response = await fetch("/api/admin/new-family", { cache: "no-store" });
    const result = await response.json() as Payload & { error?: string };
    if (!response.ok) throw new Error(result.error ?? "새가족 정착 현황을 불러오지 못했습니다.");
    setData(result);
  }

  useEffect(() => {
    fetch("/api/admin/new-family", { cache: "no-store" })
      .then(async (response) => ({ response, result: await response.json() as Payload & { error?: string } }))
      .then(({ response, result }) => {
        if (!response.ok) throw new Error(result.error ?? "새가족 정착 현황을 불러오지 못했습니다.");
        setData(result);
      })
      .catch((error) => setNotice(error instanceof Error ? error.message : "새가족 정착 현황을 불러오지 못했습니다."));
  }, []);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return (data?.journeys ?? []).filter((item) => {
      const overdue = item.journeyStatus === "active" && Boolean(item.nextActionOn && item.nextActionOn < today);
      const matchesFilter = filter === "all"
        || (filter === "overdue" ? overdue : filter === "unassigned" ? item.journeyStatus === "active" && !item.assignee : item.journeyStatus === filter || item.stage === filter);
      const haystack = [item.name, item.memberName, item.contact, item.assignee, item.memberNumber, item.smallGroupName].filter(Boolean).join(" ").toLowerCase();
      return matchesFilter && (!needle || haystack.includes(needle));
    });
  }, [data, filter, query, today]);

  const summary = useMemo(() => {
    const rows = data?.journeys ?? [];
    return {
      active: rows.filter((item) => item.journeyStatus === "active").length,
      overdue: rows.filter((item) => item.journeyStatus === "active" && item.nextActionOn && item.nextActionOn < today).length,
      unassigned: rows.filter((item) => item.journeyStatus === "active" && !item.assignee).length,
      completed: rows.filter((item) => item.journeyStatus === "completed").length,
    };
  }, [data, today]);

  async function saveJourney(event: FormEvent<HTMLFormElement>, id: number) {
    event.preventDefault();
    setNotice("정착 기록을 저장하는 중입니다…");
    const form = event.currentTarget;
    const response = await fetch("/api/admin/new-family", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...Object.fromEntries(new FormData(form)) }),
    });
    const result = await response.json() as { error?: string };
    if (!response.ok) return setNotice(result.error ?? "정착 기록을 저장하지 못했습니다.");
    await load();
    setNotice("정착 기록을 저장했습니다.");
  }

  async function addFollowup(event: FormEvent<HTMLFormElement>, journeyId: number) {
    event.preventDefault();
    setNotice("후속 조치를 기록하는 중입니다…");
    const form = event.currentTarget;
    const response = await fetch("/api/admin/new-family", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ journeyId, ...Object.fromEntries(new FormData(form)) }),
    });
    const result = await response.json() as { error?: string };
    if (!response.ok) return setNotice(result.error ?? "후속 조치를 저장하지 못했습니다.");
    form.reset();
    await load();
    setNotice("후속 조치를 기록했습니다.");
  }

  return <section className="admin-manager new-family-manager">
    <div className="new-family-summary">
      <button type="button" onClick={() => setFilter("active")}><small>진행 중</small><strong>{summary.active}명</strong></button>
      <button type="button" className={summary.overdue ? "is-alert" : ""} onClick={() => setFilter("overdue")}><small>후속 조치 지연</small><strong>{summary.overdue}명</strong></button>
      <button type="button" onClick={() => setFilter("unassigned")}><small>담당자 미배정</small><strong>{summary.unassigned}명</strong></button>
      <button type="button" onClick={() => setFilter("completed")}><small>정착 완료</small><strong>{summary.completed}명</strong></button>
    </div>
    <div className="new-family-toolbar">
      <label><span>새가족 검색</span><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="이름, 연락처, 담당자, 목장" /></label>
      <label><span>진행 상태</span><select value={filter} onChange={(event) => setFilter(event.target.value)}>
        <option value="all">전체</option><option value="active">진행 중</option><option value="overdue">후속 조치 지연</option><option value="unassigned">담당자 미배정</option><option value="on_hold">보류</option><option value="completed">정착 완료</option>
        {stageOrder.map((stage) => <option value={stage} key={stage}>{stageLabels[stage]}</option>)}
      </select></label>
    </div>
    {notice && <p className="content-manager-notice" role="status">{notice}</p>}
    {!data && !notice && <p className="resource-empty">정착 현황을 불러오는 중입니다…</p>}
    {data && filtered.length === 0 && <p className="resource-empty">조건에 맞는 새가족이 없습니다.</p>}
    <div className="new-family-journey-list">{filtered.map((item) => {
      const itemFollowups = data?.followups.filter((followup) => followup.journeyId === item.id) ?? [];
      const stageIndex = Math.max(0, stageOrder.indexOf(item.stage));
      const overdue = item.journeyStatus === "active" && Boolean(item.nextActionOn && item.nextActionOn < today);
      return <article className={`new-family-journey-card ${overdue ? "is-overdue" : ""}`} key={`${item.id}:${item.updatedAt}`}>
        <div className="new-family-card-heading">
          <div><small>{item.cardType === "registration" ? "등록카드" : "방문카드"} · {statusLabels[item.journeyStatus] ?? item.journeyStatus}</small><h2>{item.memberName ?? item.name ?? "이름 미입력"} <span>{item.memberNumber ?? "교인번호 미발급"}</span></h2><p>{item.contact ?? "연락처 없음"} · 첫 방문 {displayDate(item.firstVisitedOn)}</p></div>
          <div className={overdue ? "is-alert" : ""}><small>{overdue ? "후속 조치 지연" : "다음 조치"}</small><strong>{displayDate(item.nextActionOn)}</strong></div>
        </div>
        <ol className="new-family-stage-track">{stageOrder.map((stage, index) => <li className={index <= stageIndex ? "is-done" : ""} key={stage}><span>{index + 1}</span><small>{stageLabels[stage]}</small></li>)}</ol>
        <div className="new-family-care-glance">
          <span><small>담당자</small><strong>{item.assignee || "미배정"}</strong></span>
          <span><small>방문</small><strong>{item.visitCount}회</strong></span>
          <span><small>목장</small><strong>{item.smallGroupName || "미연결"}</strong></span>
          <span><small>교육</small><strong>{item.educationProgress}%</strong></span>
        </div>
        <details className="new-family-care-editor"><summary>정착 정보와 후속 조치 관리</summary>
          <form className="new-family-journey-form" onSubmit={(event) => void saveJourney(event, item.id)}>
            <div className="new-family-form-grid">
              <label><span>현재 단계</span><select name="stage" defaultValue={item.stage}>{stageOrder.map((stage) => <option value={stage} key={stage}>{stageLabels[stage]}</option>)}</select></label>
              <label><span>진행 상태</span><select name="journeyStatus" defaultValue={item.journeyStatus}>{Object.entries(statusLabels).map(([value, label]) => <option value={value} key={value}>{label}</option>)}</select></label>
              <label><span>담당자</span><input name="assignee" defaultValue={item.assignee ?? ""} placeholder="담당 목회자·리더" /></label>
              <label><span>다음 연락·조치일</span><input name="nextActionOn" type="date" defaultValue={item.nextActionOn ?? ""} /></label>
              <label><span>첫 방문일</span><input name="firstVisitedOn" type="date" defaultValue={item.firstVisitedOn ?? ""} /></label>
              <label><span>방문 횟수</span><input name="visitCount" type="number" min="1" max="999" defaultValue={item.visitCount} /></label>
              <label><span>연결 목장</span><input name="smallGroupName" defaultValue={item.smallGroupName ?? ""} placeholder="목장명 또는 목자" /></label>
              <label><span>새가족 교육 진도</span><input name="educationProgress" type="number" min="0" max="100" defaultValue={item.educationProgress} /></label>
            </div>
            <label><span>등록 상담·돌봄 메모 <small>관리자 전용</small></span><textarea name="consultationNote" rows={4} defaultValue={item.consultationNote ?? ""} placeholder="상담 내용, 연결 필요, 돌봄 유의사항을 기록합니다." /></label>
            <button type="submit">정착 정보 저장</button>
          </form>
          <section className="new-family-followup-section">
            <div><h3>후속 조치 기록</h3><p>연락과 방문 결과를 남기면 다음 조치일이 관리자 현황에 표시됩니다.</p></div>
            <form className="new-family-followup-form" onSubmit={(event) => void addFollowup(event, item.id)}>
              <label><span>유형</span><select name="actionType" defaultValue="call">{Object.entries(actionLabels).map(([value, label]) => <option value={value} key={value}>{label}</option>)}</select></label>
              <label><span>실행일</span><input name="happenedOn" type="date" defaultValue={today} required /></label>
              <label><span>결과</span><input name="result" maxLength={500} placeholder="통화 완료, 상담 일정 확정 등" required /></label>
              <label><span>다음 조치일</span><input name="nextActionOn" type="date" /></label>
              <label className="is-wide"><span>상세 메모</span><textarea name="note" rows={3} placeholder="필요한 후속 조치와 담당자 참고 내용을 기록합니다." /></label>
              <button type="submit">후속 조치 추가</button>
            </form>
            {itemFollowups.length ? <ul className="new-family-followup-list">{itemFollowups.map((followup) => <li key={followup.id}><time>{displayDate(followup.happenedOn)}</time><strong>{actionLabels[followup.actionType] ?? followup.actionType} · {followup.result}</strong>{followup.note && <p>{followup.note}</p>}{followup.nextActionOn && <small>다음 조치 {displayDate(followup.nextActionOn)}</small>}</li>)}</ul> : <p className="resource-empty">아직 기록된 후속 조치가 없습니다.</p>}
          </section>
        </details>
      </article>;
    })}</div>
  </section>;
}
