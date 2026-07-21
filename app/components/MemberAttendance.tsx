"use client";

import { useEffect, useState } from "react";
type RecordItem = { id: number; status: string; checkedInAt: string; title: string; eventType: string; heldOn: string };
const labels: Record<string, string> = { present: "출석", late: "지각", excused: "사유 있음", absent: "결석" };

export function MemberAttendance() {
  const [records, setRecords] = useState<RecordItem[] | null>(null);
  useEffect(() => { fetch("/api/member/attendance", { cache: "no-store" }).then((response) => response.json()).then((value: { records?: RecordItem[] }) => setRecords(value.records ?? [])).catch(() => setRecords([])); }, []);
  if (records === null) return <p className="resource-empty">출석 기록을 불러오는 중입니다…</p>;
  if (!records.length) return <p className="resource-empty">아직 등록된 출석 기록이 없습니다.</p>;
  return <div className="member-attendance-list">{records.map((item) => <article key={item.id}><time>{item.heldOn}</time><div><strong>{item.title}</strong><small>{labels[item.status] ?? item.status}</small></div></article>)}</div>;
}
