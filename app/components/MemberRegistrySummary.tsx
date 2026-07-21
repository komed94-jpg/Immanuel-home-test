"use client";
import { useEffect, useState } from "react";
type Registration = { id: number; cardType: string; reviewStatus: string; reviewNote: string | null; createdAt: string; reviewedAt: string | null };
type Family = { id: number; name: string; memberNumber: string | null; relationship: string; householdName: string };
const reviewLabels: Record<string, string> = { received: "접수", reviewing: "검토 중", needs_update: "보완 요청", on_hold: "보류", rejected: "반려", approved: "승인" };
export function MemberRegistrySummary() {
  const [data, setData] = useState<{ registration: Registration | null; family: Family[] } | null>(null);
  useEffect(() => { fetch("/api/member/registry", { cache: "no-store" }).then(async (response) => { if (!response.ok) throw new Error(); return response.json(); }).then(setData).catch(() => setData({ registration: null, family: [] })); }, []);
  if (!data) return <p className="resource-empty">교적 정보를 불러오는 중입니다…</p>;
  return <div className="member-registry-summary"><div><h3>새가족 등록카드</h3>{data.registration ? <><p><strong>{reviewLabels[data.registration.reviewStatus] ?? data.registration.reviewStatus}</strong> · {new Date(data.registration.createdAt).toLocaleDateString("ko-KR")}</p>{data.registration.reviewNote && <p className="member-review-note">관리자 안내: {data.registration.reviewNote}</p>}</> : <p>연결된 등록카드가 없습니다.</p>}</div><div><h3>가족 연결</h3>{data.family.length ? <ul>{data.family.map((item) => <li key={item.id}><strong>{item.name}</strong><span>{item.relationship}{item.memberNumber ? ` · ${item.memberNumber}` : ""}</span></li>)}</ul> : <p>아직 연결된 가족 구성원이 없습니다.</p>}</div></div>;
}
