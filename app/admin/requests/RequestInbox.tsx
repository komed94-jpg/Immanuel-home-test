"use client";

import { useEffect, useState } from "react";

type RequestType = "prayer" | "counseling" | "new-family" | "spirit-ministry" | "bible-conference" | "discipleship" | "community" | "event";

type MinistryRequest = {
  id: number;
  requestType: RequestType;
  name: string | null;
  contact: string | null;
  subject: string;
  message: string;
  options: string | null;
  status: string;
  adminNote: string | null;
  submittedAt: string | number;
};

type RequestDetails = {
  cardType?: string;
  birthDate?: string;
  address?: string;
  email?: string;
  occupation?: string;
  familyInfo?: string;
  guideName?: string;
  guidePhone?: string;
  guideRelation?: string;
  faithStatus?: string;
  previousChurchName?: string;
  faithHistory?: string;
  faithYears?: string;
  churchPosition?: string;
  serviceHistory?: string;
  ordinanceType?: string;
  ordinanceChurch?: string;
  referral?: string;
  participation?: string[];
};

function getDetails(options: string | null): RequestDetails | null {
  if (!options) return null;
  try {
    const parsed = JSON.parse(options) as { details?: RequestDetails };
    return parsed.details ?? null;
  } catch {
    return null;
  }
}

const requestLabels: Record<RequestType, string> = {
  prayer: "기도 요청",
  counseling: "상담 요청",
  "new-family": "새가족 등록",
  "spirit-ministry": "성령사역 요청",
  "bible-conference": "사경회 요청",
  discipleship: "제자훈련 신청",
  community: "공동체 연결",
  event: "행사 신청"
};

const receiptPrefixes: Record<RequestType, string> = {
  prayer: "PR",
  counseling: "CO",
  "new-family": "NF",
  "spirit-ministry": "SM",
  "bible-conference": "BC",
  discipleship: "DT",
  community: "CM",
  event: "EV"
};

const statusLabels: Record<string, string> = {
  received: "접수",
  reviewing: "확인 중",
  completed: "완료"
};

export function RequestInbox() {
  const [requestType, setRequestType] = useState<RequestType>("prayer");
  const [requests, setRequests] = useState<MinistryRequest[]>([]);
  const [state, setState] = useState<"loading" | "ready" | "error">("loading");
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [notice, setNotice] = useState("");

  async function updateStatus(id: number, status: string) {
    const response = await fetch("/api/requests", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status })
    });
    if (!response.ok) return;
    setRequests((current) => current.map((item) => item.id === id ? { ...item, status } : item));
  }

  async function saveNote(id: number, adminNote: string) {
    const response = await fetch("/api/requests", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, adminNote }) });
    if (!response.ok) { setNotice("내부 메모를 저장하지 못했습니다."); return; }
    setRequests((current) => current.map((item) => item.id === id ? { ...item, adminNote } : item));
    setNotice("내부 메모를 저장했습니다.");
  }

  async function removeRequest(id: number) {
    if (!window.confirm("이 접수 내용을 삭제하시겠습니까? 삭제 후에는 복구할 수 없습니다.")) return;
    const response = await fetch(`/api/requests?id=${id}`, { method: "DELETE" });
    if (!response.ok) { setNotice("접수 내용을 삭제하지 못했습니다."); return; }
    setRequests((current) => current.filter((item) => item.id !== id));
    setNotice("접수 내용을 삭제했습니다.");
  }

  useEffect(() => {
    let active = true;

    fetch(`/api/requests?type=${requestType}`, { cache: "no-store" })
      .then(async (response) => {
        const data = (await response.json()) as { requests?: MinistryRequest[] };
        if (!response.ok) throw new Error("접수 내용을 불러오지 못했습니다.");
        if (active) {
          setRequests(data.requests ?? []);
          setState("ready");
        }
      })
      .catch(() => active && setState("error"));

    return () => {
      active = false;
    };
  }, [requestType]);

  const keyword = query.trim().toLowerCase();
  const filtered = requests.filter((item) => (statusFilter === "all" || item.status === statusFilter) && (!keyword || [item.subject, item.message, item.name, item.contact, item.adminNote].some((value) => value?.toLowerCase().includes(keyword))));

  return (
    <section className="request-inbox">
      <div className="request-tabs" aria-label="접수 유형">
        {(Object.keys(requestLabels) as RequestType[]).map((type) => (
          <button
            type="button"
            className={requestType === type ? "is-active" : ""}
            aria-pressed={requestType === type}
            onClick={() => {
              if (type !== requestType) {
                setState("loading");
                setRequestType(type);
              }
            }}
            key={type}
          >
            {requestLabels[type]}
          </button>
        ))}
      </div>
      <div className="request-inbox-tools"><label><span>접수 검색</span><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="이름, 연락처, 제목, 내용 검색" /></label><label><span>처리 상태</span><select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}><option value="all">전체</option><option value="received">접수</option><option value="reviewing">확인 중</option><option value="completed">완료</option></select></label></div>
      {notice && <p className="content-manager-notice" role="status">{notice}</p>}

      {state === "loading" && <p className="request-inbox-notice">접수 내용을 불러오는 중입니다…</p>}
      {state === "error" && <p className="request-inbox-notice is-error">접수 내용을 불러오지 못했습니다.</p>}
      {state === "ready" && requests.length === 0 && (
        <p className="request-inbox-notice">아직 접수된 {requestLabels[requestType]}이 없습니다.</p>
      )}

      {state === "ready" && requests.length > 0 && filtered.length === 0 && <p className="request-inbox-notice">검색 조건에 맞는 접수가 없습니다.</p>}
      {state === "ready" && filtered.length > 0 && (
        <div className="request-list">
          {filtered.map((item) => (
            <article className="request-card" key={item.id}>
              <div className="request-card-heading">
                <div>
                  <small>{requestLabels[item.requestType]} · {statusLabels[item.status] ?? item.status}</small>
                  <h2>{item.subject}</h2>
                </div>
                <time dateTime={String(item.submittedAt)}>
                  {new Date(item.submittedAt).toLocaleString("ko-KR")}
                </time>
              </div>
              <dl>
                <div><dt>접수번호</dt><dd>{receiptPrefixes[item.requestType]}-{item.id}</dd></div>
                <div><dt>이름</dt><dd>{item.name || "미기재"}</dd></div>
                <div><dt>연락처</dt><dd>{item.contact || "미기재"}</dd></div>
              </dl>
              <p className="request-card-message">{item.message}</p>
              {item.requestType === "new-family" && getDetails(item.options) && (
                <dl className="request-card-details">
                  <div><dt>카드 구분</dt><dd>{getDetails(item.options)?.cardType === "registration" ? "등록카드" : "방문카드"}</dd></div>
                  <div><dt>생년월일</dt><dd>{getDetails(item.options)?.birthDate || "미기재"}</dd></div>
                  <div><dt>주소</dt><dd>{getDetails(item.options)?.address || "미기재"}</dd></div>
                  <div><dt>이메일</dt><dd>{getDetails(item.options)?.email || "미기재"}</dd></div>
                  <div><dt>직장 또는 하는 일</dt><dd>{getDetails(item.options)?.occupation || "미기재"}</dd></div>
                  <div><dt>가족 정보</dt><dd>{getDetails(item.options)?.familyInfo || "미기재"}</dd></div>
                  <div><dt>인도자 이름</dt><dd>{getDetails(item.options)?.guideName || "미기재"}</dd></div>
                  <div><dt>인도자 전화번호</dt><dd>{getDetails(item.options)?.guidePhone || "미기재"}</dd></div>
                  <div><dt>인도자와의 관계</dt><dd>{getDetails(item.options)?.guideRelation || "미기재"}</dd></div>
                  <div><dt>현재 신앙 상태</dt><dd>{getDetails(item.options)?.faithStatus || "미기재"}</dd></div>
                  <div><dt>이전 교회 이름</dt><dd>{getDetails(item.options)?.previousChurchName || "미기재"}</dd></div>
                  <div><dt>이전 교회·신앙 경력</dt><dd>{getDetails(item.options)?.faithHistory || "미기재"}</dd></div>
                  <div><dt>신앙 년수</dt><dd>{getDetails(item.options)?.faithYears || "미기재"}</dd></div>
                  <div><dt>이전 교회 직분</dt><dd>{getDetails(item.options)?.churchPosition || "미기재"}</dd></div>
                  <div><dt>이전 교회 봉사 이력</dt><dd>{getDetails(item.options)?.serviceHistory || "미기재"}</dd></div>
                  <div><dt>세례·침례 여부</dt><dd>{getDetails(item.options)?.ordinanceType || "미기재"}</dd></div>
                  <div><dt>세례·침례 집례 교회</dt><dd>{getDetails(item.options)?.ordinanceChurch || "미기재"}</dd></div>
                  <div><dt>알게 된 경로</dt><dd>{getDetails(item.options)?.referral || "미기재"}</dd></div>
                  <div><dt>관심 참여</dt><dd>{getDetails(item.options)?.participation?.join(", ") || "미선택"}</dd></div>
                </dl>
              )}
              <div className="request-status-actions" aria-label="접수 처리 상태">
                {(Object.keys(statusLabels)).map((status) => <button
                  type="button"
                  className={item.status === status ? "is-active" : ""}
                  onClick={() => updateStatus(item.id, status)}
                  key={status}
                >{statusLabels[status]}</button>)}
              </div>
              <form className="request-admin-note" onSubmit={(event) => { event.preventDefault(); const data = new FormData(event.currentTarget); void saveNote(item.id, String(data.get("adminNote") ?? "")); }}><label><span>관리자 내부 메모</span><textarea name="adminNote" rows={3} defaultValue={item.adminNote ?? ""} placeholder="담당자, 연락 결과, 후속 조치 등을 기록합니다." /></label><button type="submit">메모 저장</button></form>
              <button className="request-delete-button" type="button" onClick={() => void removeRequest(item.id)}>접수 내용 삭제</button>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
