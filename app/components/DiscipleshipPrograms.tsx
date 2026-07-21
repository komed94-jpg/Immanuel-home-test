"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";

type Program = { id: number; title: string; summary: string; schedule: string | null; location: string | null; capacity: string | null; status: string };
type Application = { id: number; programId: number; status: string };
const labels: Record<string, string> = { recruiting: "모집 중", ongoing: "진행 중", closed: "마감" };
const applicationLabels: Record<string, string> = { pending: "승인 대기", approved: "참여 승인", waitlisted: "대기자", rejected: "반려", cancelled: "취소", completed: "수료" };

export function DiscipleshipPrograms({ canApply, loggedIn }: { canApply: boolean; loggedIn: boolean }) {
  const [programs, setPrograms] = useState<Program[] | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [openId, setOpenId] = useState<number | null>(null);
  const [notice, setNotice] = useState("");
  useEffect(() => {
    fetch("/api/discipleship-programs").then(async (response) => (await response.json()) as { programs?: Program[] }).then((data) => setPrograms(data.programs ?? [])).catch(() => setPrograms([]));
    if (loggedIn) fetch("/api/member/discipleship", { cache: "no-store" }).then(async (response) => (await response.json()) as { applications?: Application[] }).then((data) => setApplications(data.applications ?? [])).catch(() => setApplications([]));
  }, [loggedIn]);

  async function submit(event: FormEvent<HTMLFormElement>, programId: number) {
    event.preventDefault(); setNotice("처리 중입니다…");
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/member/discipleship", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ programId, motivation: form.get("motivation") }) });
    const data = await response.json() as { error?: string; application?: Application };
    if (!response.ok || !data.application) { setNotice(data.error ?? "신청하지 못했습니다."); return; }
    setApplications((current) => [...current.filter((item) => item.programId !== programId), data.application!]);
    setOpenId(null); setNotice("신청되었습니다. 내 정보에서 승인 상태를 확인할 수 있습니다.");
  }

  if (programs === null) return <p className="resource-empty">제자훈련 과정을 불러오는 중입니다…</p>;
  return <section className="discipleship-programs" aria-labelledby="program-list-title">
    <p className="section-kicker">CURRENT PROGRAMS</p><h2 id="program-list-title">현재 제자훈련 과정</h2>
    {notice && <p className="content-manager-notice" role="status">{notice}</p>}
    {!programs.length ? <p className="resource-empty">현재 모집 중인 과정이 없습니다.</p> : <div className="resource-list">{programs.map((program) => {
      const application = applications.find((item) => item.programId === program.id);
      return <article className="resource-card discipleship-program-card" key={program.id}>
        <div><small>{labels[program.status] ?? program.status}</small><h3>{program.title}</h3><p>{program.summary}</p>
          {(program.schedule || program.location || program.capacity) && <dl>
            {program.schedule && <div><dt>일정</dt><dd>{program.schedule}</dd></div>}
            {program.location && <div><dt>장소</dt><dd>{program.location}</dd></div>}
            {program.capacity && <div><dt>정원</dt><dd>{program.capacity}</dd></div>}
          </dl>}
        </div>
        {application ? <div className={`discipleship-status status-${application.status}`}><span>{applicationLabels[application.status] ?? application.status}</span><Link href="/member#discipleship-history">내 신청 확인</Link></div>
          : program.status !== "recruiting" ? <p className="resource-empty">현재 신청이 마감되었습니다.</p>
          : !canApply ? <Link className="primary-link" href={loggedIn ? "/member" : "/login?returnTo=/discipleship"}>{loggedIn ? "교인 승인 상태 확인" : "로그인 후 신청"}</Link>
          : openId !== program.id ? <button className="primary-link" type="button" onClick={() => { setOpenId(program.id); setNotice(""); }}>이 과정 신청</button>
          : <form className="discipleship-inline-form" onSubmit={(event) => submit(event, program.id)}><label><span>신청 동기와 기대하는 변화</span><textarea name="motivation" rows={5} minLength={5} maxLength={1500} required /></label><div><button className="primary-link" type="submit">신청서 제출</button><button type="button" onClick={() => setOpenId(null)}>닫기</button></div></form>}
      </article>;
    })}</div>}
  </section>;
}
