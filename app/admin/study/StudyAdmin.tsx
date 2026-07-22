"use client";

import { useEffect, useMemo, useState } from "react";

type Member = { id: number; name: string; email: string; phone: string; memberNumber: string | null };
type Progress = { memberId: number; pageKey: string; studiedOn: string; completedAt: string };
type Completion = { id: number; memberId: number; status: string; adminNote: string | null; completedAt: string; certifiedAt: string | null };
type ResponseItem = { memberId: number; pageKey: string; questionKey: string; answer: string; studiedOn: string; updatedAt: string };
type Payload = { course: { slug: string; title: string; totalPages: number }; members: Member[]; progress: Progress[]; completions: Completion[]; responses: ResponseItem[] };

export function StudyAdmin() {
  const [data, setData] = useState<Payload | null>(null);
  const [notice, setNotice] = useState("");
  async function load() {
    const response = await fetch("/api/admin/study", { cache: "no-store" });
    const result = await response.json() as Payload & { error?: string };
    if (!response.ok) { setNotice(result.error ?? "학습 현황을 불러오지 못했습니다."); return; }
    setData(result);
  }
  useEffect(() => {
    fetch("/api/admin/study", { cache: "no-store" })
      .then(async (response) => ({ response, result: await response.json() as Payload & { error?: string } }))
      .then(({ response, result }) => response.ok ? setData(result) : setNotice(result.error ?? "학습 현황을 불러오지 못했습니다."))
      .catch(() => setNotice("학습 현황을 불러오지 못했습니다."));
  }, []);
  const rows = useMemo(() => {
    if (!data) return [];
    const progressByMember = new Map<number, Progress[]>();
    for (const item of data.progress) progressByMember.set(item.memberId, [...(progressByMember.get(item.memberId) ?? []), item]);
    const completionMap = new Map(data.completions.map((item) => [item.memberId, item]));
    return data.members.map((member) => {
      const progress = progressByMember.get(member.id) ?? [];
      const last = progress.sort((a, b) => b.completedAt.localeCompare(a.completedAt))[0];
      return { member, progressCount: new Set(progress.map((item) => item.pageKey)).size, last, completion: completionMap.get(member.id) ?? null };
    }).sort((a, b) => (b.last?.completedAt ?? "").localeCompare(a.last?.completedAt ?? ""));
  }, [data]);

  async function certify(memberId: number, status: string) {
    if (!data) return;
    const response = await fetch("/api/admin/study", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ courseSlug: data.course.slug, memberId, status }) });
    setNotice(response.ok ? (status === "certified" ? "수료 처리했습니다." : "수료 대기로 되돌렸습니다.") : "처리하지 못했습니다.");
    if (response.ok) await load();
  }

  if (!data) return <section className="admin-manager"><p>{notice || "성경공부 학습 현황을 불러오는 중입니다…"}</p></section>;
  return <section className="admin-manager study-admin">
    {notice && <p className="content-manager-notice" role="status">{notice}</p>}
    <div className="discipleship-admin-summary"><article><small>교재</small><strong>{data.course.title}</strong></article><article><small>학습자</small><strong>{rows.length}명</strong></article><article><small>수료 대기</small><strong>{rows.filter((item) => item.completion?.status === "ready").length}명</strong></article><article><small>수료 완료</small><strong>{rows.filter((item) => item.completion?.status === "certified").length}명</strong></article></div>
    <div className="study-admin-list">{rows.length ? rows.map((row) => {
      const percent = Math.round((row.progressCount / data.course.totalPages) * 100);
      const answers = data.responses.filter((item) => item.memberId === row.member.id);
      return <article key={row.member.id} className="study-admin-card">
        <div className="applicant-heading"><div><small>{row.completion?.status === "certified" ? "수료 완료" : row.completion ? "수료 대기" : "진행 중"}</small><h3>{row.member.name} <span>{row.member.memberNumber ?? "교인번호 없음"}</span></h3><p>{row.member.phone} · 마지막 공부 {row.last?.studiedOn ?? "기록 없음"}</p></div><strong>{percent}%</strong></div>
        <div className="training-progress"><span style={{ width: `${percent}%` }} /></div>
        <details><summary>답변 보기</summary>{answers.length ? <div className="study-answer-list">{answers.map((answer) => <section key={`${answer.pageKey}:${answer.questionKey}`}><small>{answer.pageKey} · {answer.questionKey} · {answer.studiedOn}</small><p>{answer.answer || "답변 없음"}</p></section>)}</div> : <p className="resource-empty">아직 저장된 답변이 없습니다.</p>}</details>
        <div className="applicant-actions">{row.completion?.status === "certified" ? <button type="button" onClick={() => void certify(row.member.id, "ready")}>수료 대기로 변경</button> : <button type="button" className="primary-link" disabled={row.progressCount < data.course.totalPages} onClick={() => void certify(row.member.id, "certified")}>수료 처리</button>}</div>
      </article>;
    }) : <p className="resource-empty">아직 학습 기록이 없습니다.</p>}</div>
  </section>;
}
