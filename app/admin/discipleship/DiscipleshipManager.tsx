"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type Program = { id: number; title: string; schedule: string | null; location: string | null; capacity: string | null; status: string };
type Session = { id: number; programId: number; sessionNumber: number; title: string; heldOn: string | null };
type Application = { id: number; programId: number; memberId: number; memberName: string; memberNumber: string | null; phone: string; status: string; motivation: string | null; adminNote: string | null; appliedAt: string; completedAt: string | null };
type Attendance = { id: number; sessionId: number; applicationId: number; status: string; note: string | null };
type Payload = { programs: Program[]; sessions: Session[]; applications: Application[]; attendance: Attendance[] };
const statusLabels: Record<string, string> = { pending: "승인 대기", approved: "참여 승인", waitlisted: "대기자", rejected: "반려", cancelled: "취소", completed: "수료" };
const attendanceLabels: Record<string, string> = { present: "출석", late: "지각", excused: "사유 결석", absent: "결석" };

export function DiscipleshipManager() {
  const [data, setData] = useState<Payload | null>(null);
  const [programId, setProgramId] = useState<number | null>(null);
  const [notice, setNotice] = useState("");
  const load = async () => { const response = await fetch("/api/admin/discipleship", { cache: "no-store" }); const value = await response.json() as Payload & { error?: string }; if (!response.ok) { setNotice(value.error ?? "정보를 불러오지 못했습니다."); return; } setData(value); setProgramId((current) => current ?? value.programs[0]?.id ?? null); };
  useEffect(() => {
    fetch("/api/admin/discipleship", { cache: "no-store" })
      .then(async (response) => ({ response, value: await response.json() as Payload & { error?: string } }))
      .then(({ response, value }) => { if (!response.ok) { setNotice(value.error ?? "정보를 불러오지 못했습니다."); return; } setData(value); setProgramId(value.programs[0]?.id ?? null); })
      .catch(() => setNotice("정보를 불러오지 못했습니다."));
  }, []);
  const applications = useMemo(() => data?.applications.filter((item) => item.programId === programId) ?? [], [data, programId]);
  const sessions = useMemo(() => data?.sessions.filter((item) => item.programId === programId) ?? [], [data, programId]);
  const attendanceMap = useMemo(() => new Map((data?.attendance ?? []).map((item) => [`${item.applicationId}:${item.sessionId}`, item])), [data]);
  const counts = useMemo(() => applications.reduce<Record<string, number>>((result, item) => ({ ...result, [item.status]: (result[item.status] ?? 0) + 1 }), {}), [applications]);

  async function patch(body: Record<string, unknown>, success: string) {
    setNotice("처리 중입니다…");
    const response = await fetch("/api/admin/discipleship", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const result = await response.json() as { error?: string; status?: string };
    setNotice(response.ok ? (result.status === "waitlisted" ? "정원이 가득 차 대기자로 처리했습니다." : success) : result.error ?? "처리하지 못했습니다.");
    if (response.ok) await load();
  }

  if (!data) return <section className="admin-manager"><p>{notice || "제자훈련 정보를 불러오는 중입니다…"}</p></section>;
  const program = data.programs.find((item) => item.id === programId);
  return <section className="admin-manager discipleship-manager">
    <div className="admin-toolbar"><label><span>관리할 과정</span><select value={programId ?? ""} onChange={(event) => setProgramId(Number(event.target.value))}>{data.programs.map((item) => <option key={item.id} value={item.id}>{item.title}</option>)}</select></label><Link href="/admin/content" className="secondary-admin-action">과정 개설·수정</Link></div>
    {notice && <p className="content-manager-notice" role="status">{notice}</p>}
    {!program ? <div className="member-empty-panel"><p>개설된 제자훈련 과정이 없습니다.</p><Link href="/admin/content" className="primary-link">과정 개설</Link></div> : <>
      <div className="discipleship-admin-summary"><article><small>정원</small><strong>{program.capacity || "제한 없음"}</strong></article><article><small>승인</small><strong>{counts.approved ?? 0}</strong></article><article><small>대기</small><strong>{counts.waitlisted ?? 0}</strong></article><article><small>수료</small><strong>{counts.completed ?? 0}</strong></article></div>
      <section className="discipleship-session-editor"><div><h2>8단계 회차 일정</h2><p>각 회차 날짜를 정하면 훈련생의 내 정보에도 표시됩니다.</p></div><div className="session-date-grid">{sessions.map((session) => <label key={session.id}><span>{session.sessionNumber}. {session.title}</span><input type="date" defaultValue={session.heldOn ?? ""} onBlur={(event) => { if (event.target.value !== (session.heldOn ?? "")) patch({ action: "session-date", sessionId: session.id, heldOn: event.target.value }, "회차 일정을 저장했습니다."); }} /></label>)}</div></section>
      <section className="discipleship-applicant-section"><h2>신청자·훈련생</h2>{!applications.length ? <p className="resource-empty">아직 신청자가 없습니다.</p> : <div className="discipleship-applicant-list">{applications.map((application) => <ApplicantCard key={application.id} application={application} sessions={sessions} attendanceMap={attendanceMap} patch={patch} />)}</div>}</section>
    </>}
  </section>;
}

function ApplicantCard({ application, sessions, attendanceMap, patch }: { application: Application; sessions: Session[]; attendanceMap: Map<string, Attendance>; patch: (body: Record<string, unknown>, success: string) => Promise<void> }) {
  const attended = sessions.filter((session) => ["present", "late"].includes(attendanceMap.get(`${application.id}:${session.id}`)?.status ?? "")).length;
  const progress = sessions.length ? Math.round((attended / sessions.length) * 100) : 0;
  return <article className="discipleship-applicant-card"><div className="applicant-heading"><div><small>{statusLabels[application.status] ?? application.status}</small><h3>{application.memberName} <span>{application.memberNumber ?? "교인번호 없음"}</span></h3><p>{application.phone} · 신청 {new Date(application.appliedAt).toLocaleDateString("ko-KR")}</p></div><strong>{application.status === "completed" ? "수료" : `${progress}%`}</strong></div>
    {application.motivation && <details><summary>신청 동기</summary><p>{application.motivation}</p></details>}
    {["pending", "waitlisted"].includes(application.status) && <div className="applicant-actions"><button className="primary-link" type="button" onClick={() => patch({ action: "application-status", id: application.id, status: "approved" }, "참여를 승인했습니다.")}>승인</button><button type="button" onClick={() => patch({ action: "application-status", id: application.id, status: "waitlisted" }, "대기자로 처리했습니다.")}>대기</button><button type="button" onClick={() => patch({ action: "application-status", id: application.id, status: "rejected", adminNote: "관리자 반려" }, "신청을 반려했습니다.")}>반려</button></div>}
    {["approved", "completed"].includes(application.status) && <><div className="training-progress"><span style={{ width: `${progress}%` }} /></div><div className="admin-attendance-grid">{sessions.map((session) => { const record = attendanceMap.get(`${application.id}:${session.id}`); return <label key={session.id}><span>{session.sessionNumber}. {session.title}<small>{session.heldOn ?? "일정 미정"}</small></span><select value={record?.status ?? ""} onChange={(event) => { if (event.target.value) patch({ action: "attendance", applicationId: application.id, sessionId: session.id, status: event.target.value }, "출석을 저장했습니다."); }}><option value="">미처리</option>{Object.entries(attendanceLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>; })}</div></>}
    {application.status === "approved" && <div className="applicant-actions"><button className="primary-link" type="button" onClick={() => patch({ action: "complete", id: application.id }, "수료 처리했습니다.")}>수료 처리</button><button type="button" onClick={() => patch({ action: "application-status", id: application.id, status: "cancelled", adminNote: "관리자 취소" }, "참여를 취소했습니다.")}>참여 취소</button></div>}
  </article>;
}
