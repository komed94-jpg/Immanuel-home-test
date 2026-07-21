"use client";

import { useEffect, useState } from "react";

type Application = { id: number; eventId: number; status: string; attendanceStatus: string | null; appliedAt: string; title: string; startsAt: string };
const applicationLabels: Record<string, string> = { registered: "참가 확정", waitlisted: "대기", cancelled: "취소" };
const attendanceLabels: Record<string, string> = { present: "출석", late: "지각", excused: "사유 결석", absent: "결석" };

export function MemberEventHistory() {
  const [applications, setApplications] = useState<Application[] | null>(null);
  useEffect(() => { fetch("/api/member/event-applications", { cache: "no-store" }).then(async (response) => response.ok ? await response.json() as { applications?: Application[] } : { applications: [] }).then((value) => setApplications(value.applications ?? [])).catch(() => setApplications([])); }, []);
  if (applications === null) return <p className="resource-empty">참가 이력을 불러오는 중입니다…</p>;
  if (!applications.length) return <div className="member-empty-panel"><p>아직 신청한 행사가 없습니다.</p><a className="primary-link" href="/events">행사 보기</a></div>;
  return <div className="member-event-history">{applications.map((item) => <article key={item.id}><time>{new Date(item.startsAt).toLocaleString("ko-KR", { dateStyle: "long", timeStyle: "short" })}</time><div><small>{applicationLabels[item.status] ?? item.status}</small><h3>{item.title}</h3><p>신청일 {new Date(item.appliedAt).toLocaleDateString("ko-KR")}{item.attendanceStatus ? ` · ${attendanceLabels[item.attendanceStatus] ?? item.attendanceStatus}` : ""}</p></div></article>)}</div>;
}
