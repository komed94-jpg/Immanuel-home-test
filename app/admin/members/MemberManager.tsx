"use client";

import { useEffect, useState } from "react";

type Member = { id: number; name: string; email: string; phone: string; birthDate: string; accountStatus: string; membershipStatus: string; role: string; memberNumber: string | null; registrationCategory: number | null; approvedAt: string | null; createdAt: string };
const statusLabels: Record<string, string> = { nonmember: "비멤버", pending: "승인 대기", active: "등록 교인", inactive: "비활성" };

export function MemberManager() {
  const [members, setMembers] = useState<Member[]>([]);
  const [state, setState] = useState<"loading" | "ready" | "error">("loading");
  const [query, setQuery] = useState("");
  const [notice, setNotice] = useState("");

  async function load() {
    const response = await fetch("/api/admin/members", { cache: "no-store" });
    const result = (await response.json()) as { members?: Member[] };
    if (!response.ok) throw new Error();
    setMembers(result.members ?? []); setState("ready");
  }
  useEffect(() => {
    fetch("/api/admin/members", { cache: "no-store" })
      .then(async (response) => {
        const result = (await response.json()) as { members?: Member[] };
        if (!response.ok) throw new Error();
        setMembers(result.members ?? []);
        setState("ready");
      })
      .catch(() => setState("error"));
  }, []);

  async function patch(id: number, payload: Record<string, unknown>, success: string) {
    const response = await fetch("/api/admin/members", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, ...payload }) });
    const result = (await response.json()) as { error?: string; member?: { memberNumber?: string } };
    setNotice(response.ok ? result.member?.memberNumber ? `${success}: ${result.member.memberNumber}` : success : result.error ?? "처리하지 못했습니다.");
    if (response.ok) await load();
  }

  const keyword = query.trim().toLowerCase();
  const filtered = members.filter((item) => !keyword || [item.name, item.email, item.phone, item.memberNumber].some((value) => value?.toLowerCase().includes(keyword)));
  return <section className="member-manager">
    <div className="request-inbox-tools"><label><span>회원 검색</span><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="이름, 전화번호, 이메일, 교인번호" /></label></div>
    {notice && <p className="content-manager-notice" role="status">{notice}</p>}
    {state === "loading" && <p className="request-inbox-notice">회원 목록을 불러오는 중입니다…</p>}
    {state === "error" && <p className="request-inbox-notice is-error">회원 목록을 불러오지 못했습니다.</p>}
    {state === "ready" && <div className="member-admin-list">{filtered.map((item) => <article className="member-admin-card" key={item.id}>
      <div className="member-admin-heading"><div><small>{statusLabels[item.membershipStatus] ?? item.membershipStatus} · {item.accountStatus === "active" ? "계정 정상" : "계정 정지"}</small><h2>{item.name}</h2></div><strong>{item.memberNumber ?? "교인번호 미발급"}</strong></div>
      <dl><div><dt>연락처</dt><dd>{item.phone}</dd></div><div><dt>이메일</dt><dd>{item.email}</dd></div><div><dt>생년월일</dt><dd>{item.birthDate}</dd></div><div><dt>가입일</dt><dd>{new Date(item.createdAt).toLocaleDateString("ko-KR")}</dd></div></dl>
      {!item.memberNumber && <div className="member-approval-actions"><span>교인 등록 승인</span>{[[1, "성인"], [2, "십대"], [3, "십대 이전"]].map(([category, label]) => <button type="button" key={category} onClick={() => { if (window.confirm(`${item.name}님을 ${label} 교인으로 승인하시겠습니까?`)) void patch(item.id, { action: "approve", category }, "교인번호를 발급했습니다"); }}>{label}</button>)}</div>}
      <div className="member-admin-controls"><label><span>교인 상태</span><select value={item.membershipStatus} onChange={(event) => void patch(item.id, { action: "status", status: event.target.value }, "교인 상태를 변경했습니다.")}><option value="nonmember">비멤버</option><option value="pending">승인 대기</option><option value="active">등록 교인</option><option value="inactive">비활성</option></select></label><label><span>권한</span><select value={item.role} onChange={(event) => void patch(item.id, { action: "role", role: event.target.value }, "회원 권한을 변경했습니다.")}><option value="member">일반 회원</option><option value="leader">리더</option><option value="staff">사역자</option></select></label><button type="button" onClick={() => void patch(item.id, { action: "account", accountStatus: item.accountStatus === "active" ? "suspended" : "active" }, item.accountStatus === "active" ? "계정을 정지했습니다." : "계정을 활성화했습니다.")}>{item.accountStatus === "active" ? "계정 정지" : "계정 활성화"}</button></div>
    </article>)}</div>}
  </section>;
}
