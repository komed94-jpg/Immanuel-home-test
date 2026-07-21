"use client";

import { useEffect, useMemo, useState } from "react";

type Application = { id: number; programId: number; title: string; schedule: string | null; location: string | null; status: string; adminNote: string | null; appliedAt: string; completedAt: string | null };
type Session = { id: number; programId: number; sessionNumber: number; title: string; heldOn: string | null };
type Attendance = { applicationId: number; sessionId: number; status: string; note: string | null };
const statusLabels: Record<string, string> = { pending: "승인 대기", approved: "참여 승인", waitlisted: "대기자", rejected: "반려", cancelled: "취소", completed: "수료" };
const attendanceLabels: Record<string, string> = { present: "출석", late: "지각", excused: "사유 결석", absent: "결석" };

export function MemberDiscipleship() {
  const [data, setData] = useState<{ applications: Application[]; sessions: Session[]; attendance: Attendance[] } | null>(null);
  const [notice, setNotice] = useState("");
  const load = () => fetch("/api/member/discipleship", { cache: "no-store" }).then(async (response) => (await response.json()) as typeof data).then((value) => setData(value)).catch(() => setData({ applications: [], sessions: [], attendance: [] }));
  useEffect(() => {
    fetch("/api/member/discipleship", { cache: "no-store" })
      .then(async (response) => (await response.json()) as { applications: Application[]; sessions: Session[]; attendance: Attendance[] })
      .then((value) => setData(value))
      .catch(() => setData({ applications: [], sessions: [], attendance: [] }));
  }, []);
  const attendanceMap = useMemo(() => new Map((data?.attendance ?? []).map((item) => [`${item.applicationId}:${item.sessionId}`, item])), [data]);
  async function cancel(id: number) { if (!window.confirm("제자훈련 신청을 취소하시겠습니까?")) return; const response = await fetch("/api/member/discipleship", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, action: "cancel" }) }); const result = await response.json() as { error?: string }; setNotice(response.ok ? "신청을 취소했습니다." : result.error ?? "취소하지 못했습니다."); if (response.ok) load(); }
  if (!data) return <p className="resource-empty">훈련 이력을 불러오는 중입니다…</p>;
  if (!data.applications.length) return <div className="member-empty-panel"><p>아직 신청한 제자훈련 과정이 없습니다.</p><a className="primary-link" href="/discipleship">과정 보기</a></div>;
  return <div className="member-discipleship-list">{notice && <p className="content-manager-notice">{notice}</p>}{data.applications.map((application) => {
    const sessions = data.sessions.filter((item) => item.programId === application.programId);
    const attended = sessions.filter((session) => ["present", "late"].includes(attendanceMap.get(`${application.id}:${session.id}`)?.status ?? "")).length;
    const progress = sessions.length ? Math.round((attended / sessions.length) * 100) : 0;
    return <article key={application.id} className="member-training-card"><div className="member-training-heading"><div><small>{statusLabels[application.status] ?? application.status}</small><h3>{application.title}</h3><p>{[application.schedule, application.location].filter(Boolean).join(" · ") || "세부 일정은 관리자 안내를 확인해 주세요."}</p></div><strong>{application.status === "completed" ? "수료" : `${progress}%`}</strong></div>
      {application.adminNote && <p className="member-training-note">관리자 안내: {application.adminNote}</p>}
      {["approved", "completed"].includes(application.status) && <><div className="training-progress" aria-label={`진도 ${progress}%`}><span style={{ width: `${progress}%` }} /></div><ol className="training-step-list">{sessions.map((session) => { const record = attendanceMap.get(`${application.id}:${session.id}`); return <li key={session.id} className={record ? `attendance-${record.status}` : ""}><span>{session.sessionNumber}</span><div><strong>{session.title}</strong><small>{session.heldOn ?? "일정 미정"}</small></div><em>{record ? attendanceLabels[record.status] ?? record.status : "미처리"}</em></li>; })}</ol></>}
      {["pending", "approved", "waitlisted"].includes(application.status) && <button className="text-action" type="button" onClick={() => cancel(application.id)}>신청 취소</button>}
      {application.completedAt && <p className="training-completed-date">수료일 {new Date(application.completedAt).toLocaleDateString("ko-KR")}</p>}
    </article>;
  })}</div>;
}
