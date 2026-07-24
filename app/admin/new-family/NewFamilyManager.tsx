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

type MessageLog = {
  id: number;
  journeyId: number;
  channel: string;
  recipient: string;
  content: string;
  status: string;
  providerMessageId: string | null;
  errorMessage: string | null;
  sentAt: string | null;
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

type Payload = {
  journeys: Journey[];
  followups: Followup[];
  messages: MessageLog[];
  messageCapabilities: { aiConfigured: boolean; smsConfigured: boolean; alimtalkConfigured: boolean };
};

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
const messageStatusLabels: Record<string, string> = { sent: "발송 완료", failed: "발송 실패", not_configured: "연결 설정 필요" };

function koreaToday() {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Seoul", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
}

function displayDate(value: string | null) {
  return value ? value.replaceAll("-", ". ") : "미정";
}

function normalizeMobile(value: string) {
  return value.replace(/\D/g, "").slice(0, 11);
}

function displayMobile(value: string) {
  const digits = normalizeMobile(value);
  if (digits.length === 11) return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
  if (digits.length === 10) return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
  return value;
}

export function NewFamilyManager() {
  const [data, setData] = useState<Payload | null>(null);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("active");
  const [notice, setNotice] = useState("");
  const [composerId, setComposerId] = useState<number | null>(null);
  const [drafts, setDrafts] = useState<Record<number, string>>({});
  const [tones, setTones] = useState<Record<number, string>>({});
  const [channels, setChannels] = useState<Record<number, string>>({});
  const [confirmed, setConfirmed] = useState<Record<number, boolean>>({});
  const [recipients, setRecipients] = useState<Record<number, string>>({});
  const [workingId, setWorkingId] = useState<number | null>(null);
  const today = koreaToday();
  const messageCapabilities = data?.messageCapabilities ?? { aiConfigured: false, smsConfigured: false, alimtalkConfigured: false };

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

  async function generateDraft(item: Journey) {
    const channel = channels[item.id] ?? "sms";
    setWorkingId(item.id);
    setNotice(channel === "alimtalk" ? "승인된 알림톡 문안을 불러오는 중입니다…" : "AI가 첫 연락 문안을 작성하는 중입니다…");
    const response = await fetch("/api/admin/new-family/message", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "generate",
        journeyId: item.id,
        tone: tones[item.id] ?? "warm",
        channel,
        assignee: item.assignee ?? "",
      }),
    });
    const result = await response.json() as { content?: string; source?: string; error?: string };
    setWorkingId(null);
    if (!response.ok || !result.content) return setNotice(result.error ?? "AI 문안을 만들지 못했습니다.");
    setDrafts((current) => ({ ...current, [item.id]: result.content ?? "" }));
    setConfirmed((current) => ({ ...current, [item.id]: false }));
    setNotice(result.source === "alimtalk_template"
      ? "카카오에서 승인된 문안을 불러왔습니다. 알림톡 문안은 수정하지 말고 받는 분만 확인해 주세요."
      : result.source === "ai"
        ? "AI 문안을 만들었습니다. 내용을 확인하고 필요하면 수정해 주세요."
        : "AI 연결 전이라 안전한 기본 문안을 만들었습니다. 내용을 확인해 주세요.");
  }

  async function sendMessage(item: Journey) {
    const content = drafts[item.id]?.trim() ?? "";
    const recipient = normalizeMobile(recipients[item.id] ?? item.contact ?? "");
    if (!content) return setNotice("먼저 문안을 작성하거나 AI 문안을 만들어 주세요.");
    if (!confirmed[item.id]) return setNotice("받는 분과 문안을 확인한 뒤 ‘최종 확인’에 체크해 주세요.");
    if (!/^01\d{8,9}$/.test(recipient)) return setNotice("받는 분의 휴대전화 번호를 확인해 주세요.");
    setWorkingId(item.id);
    setNotice("첫 연락 메시지를 발송하는 중입니다…");
    const response = await fetch("/api/admin/new-family/message", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "send",
        journeyId: item.id,
        channel: channels[item.id] ?? "sms",
        content,
        recipient,
        confirmed: true,
      }),
    });
    const result = await response.json() as { error?: string; configured?: boolean };
    setWorkingId(null);
    if (!response.ok) {
      await load();
      return setNotice(result.error ?? "메시지를 발송하지 못했습니다.");
    }
    await load();
    setConfirmed((current) => ({ ...current, [item.id]: false }));
    setComposerId(null);
    setNotice("첫 연락을 발송하고 정착 기록에 자동으로 남겼습니다.");
  }

  async function saveRecipient(item: Journey) {
    const phone = normalizeMobile(recipients[item.id] ?? item.contact ?? "");
    if (!/^01\d{8,9}$/.test(phone)) return setNotice("010-1234-5678 형식의 휴대전화 번호를 입력해 주세요.");
    setWorkingId(item.id);
    setNotice("받는 분의 휴대전화 번호를 저장하는 중입니다…");
    const response = await fetch("/api/admin/new-family/message", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "save-recipient", journeyId: item.id, phone }),
    });
    const result = await response.json() as { error?: string };
    setWorkingId(null);
    if (!response.ok) return setNotice(result.error ?? "휴대전화 번호를 저장하지 못했습니다.");
    setRecipients((current) => ({ ...current, [item.id]: phone }));
    await load();
    setNotice("받는 분의 휴대전화 번호를 저장했습니다.");
  }

  async function openSmsApp(item: Journey) {
    const content = drafts[item.id]?.trim() ?? "";
    const phone = normalizeMobile(recipients[item.id] ?? item.contact ?? "");
    if (!content) return setNotice("먼저 문안을 작성하거나 AI 문안을 만들어 주세요.");
    if (!confirmed[item.id]) return setNotice("받는 분과 문안을 확인한 뒤 ‘최종 확인’에 체크해 주세요.");
    if (!/^01\d{8,9}$/.test(phone)) return setNotice("받는 분의 휴대전화 번호를 확인해 주세요.");
    setWorkingId(item.id);
    const response = await fetch("/api/admin/new-family/message", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "save-recipient", journeyId: item.id, phone }),
    });
    const result = await response.json() as { error?: string };
    setWorkingId(null);
    if (!response.ok) return setNotice(result.error ?? "휴대전화 번호를 저장하지 못했습니다.");
    await navigator.clipboard?.writeText(content).catch(() => undefined);
    const separator = /iPad|iPhone|iPod/.test(navigator.userAgent) ? "&" : "?";
    window.location.assign(`sms:${phone}${separator}body=${encodeURIComponent(content)}`);
    setNotice("문자 앱을 열고 문안도 복사했습니다. 실제 발송 버튼을 눌러 주세요.");
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
      const itemMessages = data?.messages.filter((message) => message.journeyId === item.id) ?? [];
      const stageIndex = Math.max(0, stageOrder.indexOf(item.stage));
      const overdue = item.journeyStatus === "active" && Boolean(item.nextActionOn && item.nextActionOn < today);
      const selectedChannel = channels[item.id] ?? "sms";
      const channelReady = selectedChannel === "alimtalk" ? messageCapabilities.alimtalkConfigured : messageCapabilities.smsConfigured;
      const recipientValue = recipients[item.id] ?? item.contact ?? "";
      const hasMobile = /^01\d{8,9}$/.test(normalizeMobile(recipientValue));
      const hasDraft = Boolean(drafts[item.id]?.trim());
      const nativeSmsFallback = selectedChannel === "sms" && !messageCapabilities.smsConfigured;
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
        <div className="new-family-contact-actions">
          <div><strong>첫 연락</strong><p>AI가 환영 문안을 만들고, 담당자가 확인한 뒤 문자 또는 알림톡으로 보냅니다.</p></div>
          <button type="button" onClick={() => setComposerId(composerId === item.id ? null : item.id)}>{composerId === item.id ? "작성창 닫기" : "AI 첫 연락 작성"}</button>
        </div>
        {composerId === item.id && <section className="new-family-message-composer">
          <div className="new-family-message-heading">
            <div><small>받는 분</small><strong>{item.memberName ?? item.name ?? "이름 미입력"}</strong></div>
            <p>상담 메모와 가족정보는 AI에 전달하지 않습니다. 발송 전 담당자가 반드시 최종 문안을 확인합니다.</p>
          </div>
          <div className="new-family-recipient-editor">
            <label><span>수신 휴대전화</span><input type="tel" inputMode="tel" autoComplete="tel" placeholder="010-1234-5678" value={displayMobile(recipientValue)} onChange={(event) => {
              setRecipients((current) => ({ ...current, [item.id]: event.target.value }));
              setConfirmed((current) => ({ ...current, [item.id]: false }));
            }} /></label>
            <button type="button" onClick={() => void saveRecipient(item)} disabled={workingId === item.id || !hasMobile}>번호 저장</button>
            <small className={hasMobile ? "is-valid" : ""}>{hasMobile ? "발송 가능한 번호입니다." : "휴대전화 번호를 입력하면 발송 버튼이 활성화됩니다."}</small>
          </div>
          <div className="new-family-message-capabilities" aria-label="메시지 연결 상태">
            <span className={messageCapabilities.aiConfigured ? "is-ready" : ""}>AI {messageCapabilities.aiConfigured ? "연결됨" : "기본 문안"}</span>
            <span className={messageCapabilities.smsConfigured ? "is-ready" : ""}>문자 {messageCapabilities.smsConfigured ? "발송 가능" : "설정 필요"}</span>
            <span className={messageCapabilities.alimtalkConfigured ? "is-ready" : ""}>알림톡 {messageCapabilities.alimtalkConfigured ? "발송 가능" : "승인 템플릿 필요"}</span>
          </div>
          <div className="new-family-message-options">
            <label><span>문안 유형</span><select disabled={selectedChannel === "alimtalk"} value={tones[item.id] ?? "warm"} onChange={(event) => setTones((current) => ({ ...current, [item.id]: event.target.value }))}>
              <option value="warm">따뜻한 환영형</option><option value="concise">간결한 안내형</option><option value="pastoral">목회적 환영형</option>
            </select></label>
            <button type="button" onClick={() => void generateDraft(item)} disabled={workingId === item.id || (selectedChannel === "alimtalk" && !messageCapabilities.alimtalkConfigured)}>{workingId === item.id ? "작성 중…" : selectedChannel === "alimtalk" ? "승인 문안 불러오기" : drafts[item.id] ? "AI로 다시 작성" : "AI 문안 만들기"}</button>
          </div>
          <label className="new-family-message-field"><span>발송 문안</span><textarea readOnly={selectedChannel === "alimtalk"} rows={6} maxLength={2000} value={drafts[item.id] ?? ""} onChange={(event) => {
            setDrafts((current) => ({ ...current, [item.id]: event.target.value }));
            setConfirmed((current) => ({ ...current, [item.id]: false }));
          }} placeholder={selectedChannel === "alimtalk" ? "카카오 승인 문안을 불러옵니다." : "AI 문안 만들기를 누르거나 직접 첫 연락 문안을 입력합니다."} /><small>{(drafts[item.id] ?? "").length} / 2,000자</small></label>
          <div className="new-family-message-send">
            <label><span>발송 채널</span><select value={selectedChannel} onChange={(event) => {
              setChannels((current) => ({ ...current, [item.id]: event.target.value }));
              setDrafts((current) => ({ ...current, [item.id]: "" }));
              setConfirmed((current) => ({ ...current, [item.id]: false }));
            }}>
              <option value="sms">문자(SMS/LMS)</option><option value="alimtalk">카카오 알림톡</option>
            </select></label>
            <label className="new-family-message-confirm"><input type="checkbox" checked={confirmed[item.id] ?? false} onChange={(event) => setConfirmed((current) => ({ ...current, [item.id]: event.target.checked }))} /><span>받는 분과 문안을 최종 확인했습니다.</span></label>
            <button type="button" onClick={() => void (nativeSmsFallback ? openSmsApp(item) : sendMessage(item))} disabled={workingId === item.id || !confirmed[item.id] || !hasMobile || !hasDraft || (selectedChannel === "alimtalk" && !channelReady)}>{workingId === item.id ? "준비 중…" : nativeSmsFallback ? "문자 앱으로 열기" : "확인 후 발송"}</button>
          </div>
          <p className="new-family-message-note">{!hasMobile ? "위에서 받는 분의 휴대전화 번호를 입력해 주세요. " : ""}{nativeSmsFallback ? "자동 문자 발송 서비스가 연결되기 전에는 기기의 문자 앱을 열고 문안을 자동 입력합니다. " : "문자는 이 화면에서 바로 발송됩니다. "}알림톡은 카카오 채널과 사전 승인 문안이 모두 연결된 경우에만 발송되며, 승인 문안은 수정할 수 없습니다.</p>
          {itemMessages.length > 0 && <details className="new-family-message-history"><summary>최근 발송 기록 {itemMessages.length}건</summary><ul>{itemMessages.slice(0, 5).map((message) => <li key={message.id}>
            <div><strong>{message.channel === "alimtalk" ? "알림톡" : "문자"} · {messageStatusLabels[message.status] ?? message.status}</strong><time>{new Date(message.createdAt).toLocaleString("ko-KR")}</time></div>
            <p>{message.content}</p>{message.errorMessage && <small>{message.errorMessage}</small>}
          </li>)}</ul></details>}
        </section>}
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
