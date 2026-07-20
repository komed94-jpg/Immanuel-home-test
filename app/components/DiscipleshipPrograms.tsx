"use client";

import { useEffect, useState } from "react";

type Program = { id: number; title: string; summary: string; schedule: string | null; location: string | null; capacity: string | null; status: string };
const labels: Record<string, string> = { recruiting: "모집 중", ongoing: "진행 중", closed: "마감" };

export function DiscipleshipPrograms() {
  const [programs, setPrograms] = useState<Program[] | null>(null);
  useEffect(() => { fetch("/api/discipleship-programs").then(async (response) => (await response.json()) as { programs?: Program[] }).then((data) => setPrograms(data.programs ?? [])).catch(() => setPrograms([])); }, []);
  if (programs === null) return <p className="resource-empty">제자훈련 과정을 불러오는 중입니다…</p>;
  if (!programs.length) return null;
  return <section className="discipleship-programs" aria-labelledby="program-list-title">
    <p className="section-kicker">CURRENT PROGRAMS</p><h2 id="program-list-title">현재 제자훈련 과정</h2>
    <div className="resource-list">{programs.map((program) => <article className="resource-card" key={program.id}>
      <small>{labels[program.status] ?? program.status}</small><h3>{program.title}</h3><p>{program.summary}</p>
      {(program.schedule || program.location || program.capacity) && <dl>
        {program.schedule && <div><dt>일정</dt><dd>{program.schedule}</dd></div>}
        {program.location && <div><dt>장소</dt><dd>{program.location}</dd></div>}
        {program.capacity && <div><dt>정원</dt><dd>{program.capacity}</dd></div>}
      </dl>}
    </article>)}</div>
  </section>;
}
