"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type DashboardData = {
  today: string; generatedAt: string;
  newMembers: Array<{ id: number; name: string; membershipStatus: string }>;
  pendingMembers: Array<{ id: number; name: string }>; pendingMemberCount: number;
  pendingCards: Array<{ id: number; name: string | null; cardType: string; reviewStatus: string }>; pendingCardCount: number;
  weeklyAttendance: { events: number; present: number; absent: number; pending: number };
  absentees: Array<{ id: number; name: string; consecutive: number }>;
  pendingApplications: Array<{ id: number; memberName: string; status: string; programTitle: string }>; pendingApplicationCount: number;
  events: Array<{ id: number; title: string; startsAt: string; capacity: number | null; registered: number; waitlisted: number }>;
  pendingRequests: Array<{ id: number; requestType: string; subject: string; name: string | null; status: string; submittedAt: string }>;
  pendingRequestCount: number;
  logs: Array<{ id: number; action: string; memberName: string; previousValue: string | null; newValue: string | null; createdAt: string }>;
};

const requestLabel: Record<string, string> = { prayer: "기도", counseling: "상담", "spirit-ministry": "성령사역", "new-family": "새가족", discipleship: "제자훈련", community: "공동체", "bible-conference": "사경회", event: "행사" };
const actionLabel: Record<string, string> = { "member-approval": "교인 승인", "member-status": "회원 상태 변경", "discipleship-status": "훈련 신청 상태 변경", "discipleship-complete": "훈련 수료 처리" };
function date(value: string) { return new Date(value).toLocaleString("ko-KR", { month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit" }); }

export function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null); const [error, setError] = useState("");
  useEffect(() => { fetch("/api/admin/dashboard", { cache: "no-store" }).then(async (response) => ({ response, body: await response.json() as DashboardData & { error?: string } })).then(({ response, body }) => response.ok ? setData(body) : setError(body.error ?? "대시보드를 불러오지 못했습니다.")).catch(() => setError("대시보드를 불러오지 못했습니다.")); }, []);
  if (!data) return <section className="admin-dashboard"><p className="dashboard-loading">{error || "관리 현황을 불러오는 중입니다…"}</p></section>;
  return <section className="admin-dashboard">
    <div className="dashboard-heading"><div><p className="section-kicker">ADMIN OVERVIEW</p><h2>오늘 확인할 운영 현황</h2><p>{data.today.replaceAll("-", ". ")} 기준 · 숫자를 누르면 바로 관리 화면으로 이동합니다.</p></div><span>마지막 집계 {date(data.generatedAt)}</span></div>
    <section className="dashboard-stat-grid">
      <Stat href="/admin/members" label="오늘의 신규 회원" value={`${data.newMembers.length}명`} note={data.newMembers.length ? data.newMembers.map((item) => item.name).join(" · ") : "오늘 가입한 회원이 없습니다."} tone="gold" />
      <Stat href="/admin/members" label="승인 대기 회원" value={`${data.pendingMemberCount}명`} note={data.pendingMembers.length ? data.pendingMembers.map((item) => item.name).join(" · ") : "승인 대기 회원이 없습니다."} />
      <Stat href="/admin/members" label="새가족 등록카드" value={`${data.pendingCardCount}건`} note={data.pendingCards.length ? data.pendingCards.map((item) => item.name ?? "이름 미입력").join(" · ") : "검토할 등록카드가 없습니다."} />
      <Stat href="/admin/attendance" label="이번 주 출석" value={`${data.weeklyAttendance.present}명`} note={`출석 모임 ${data.weeklyAttendance.events}회 · 결석 ${data.weeklyAttendance.absent}명 · 미마감 ${data.weeklyAttendance.pending}회`} />
    </section>
    <section className="dashboard-panels">
      <Panel title="연속 결석자" kicker="CARE SIGNAL" href="/admin/attendance" empty="2회 이상 연속 결석자가 없습니다.">{data.absentees.map((item) => <li key={item.id}><strong>{item.name}</strong><span>주일예배 {item.consecutive}회 연속 결석</span></li>)}</Panel>
      <Panel title="제자훈련 신청 대기" kicker="DISCIPLESHIP" href="/admin/discipleship" empty="처리할 훈련 신청이 없습니다.">{data.pendingApplications.map((item) => <li key={item.id}><strong>{item.memberName}</strong><span>{item.programTitle} · {item.status === "waitlisted" ? "대기" : "승인 대기"}</span></li>)}</Panel>
      <Panel title="행사 신청 현황" kicker="EVENT REGISTRATION" href="/admin/events" empty="현재 신청을 받는 행사가 없습니다.">{data.events.map((item) => <li key={item.id}><strong>{item.title}</strong><span>확정 {item.registered}{item.capacity ? ` / ${item.capacity}` : "명"} · 대기 {item.waitlisted}</span></li>)}</Panel>
      <Panel title="상담·기도·사역 요청" kicker="MINISTRY REQUESTS" href="/admin/requests" empty="처리 중인 요청이 없습니다.">{data.pendingRequests.map((item) => <li key={item.id}><strong>{requestLabel[item.requestType] ?? item.requestType} · {item.subject}</strong><span>{item.name ?? "익명"} · {item.status === "reviewing" ? "확인 중" : "접수"}</span></li>)}</Panel>
      <Panel title="최근 관리자 작업" kicker="ACTIVITY" href="/admin/members" empty="아직 기록된 관리자 작업이 없습니다.">{data.logs.map((item) => <li key={item.id}><strong>{actionLabel[item.action] ?? item.action}</strong><span>{item.memberName} · {date(item.createdAt)}</span></li>)}</Panel>
    </section>
  </section>;
}

function Stat({ href, label, value, note, tone }: { href: string; label: string; value: string; note: string; tone?: string }) { return <Link href={href} className={`dashboard-stat ${tone ? `is-${tone}` : ""}`}><small>{label}</small><strong>{value}</strong><p>{note}</p><span>관리하기 →</span></Link>; }
function Panel({ title, kicker, href, empty, children }: { title: string; kicker: string; href: string; empty: string; children: React.ReactNode }) { const items = Array.isArray(children) ? children : [children]; return <article className="dashboard-panel"><div><p className="section-kicker">{kicker}</p><h3>{title}</h3><Link href={href}>전체 보기 →</Link></div>{items.length ? <ul>{items}</ul> : <p className="dashboard-empty">{empty}</p>}</article>; }
