"use client";

import { useEffect, useState } from "react";

type Course = { slug: string; title: string; totalPages: number; totalLessons?: number };
type StudyState = { progress: { pageKey: string }[]; completion: { status: string; certifiedAt: string | null } | null };

export function MemberBibleStudy({ courses }: { courses: Course[] }) {
  const [records, setRecords] = useState<Record<string, StudyState>>({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    Promise.all(courses.map(async (course) => {
      const response = await fetch(`/api/member/study?course=${encodeURIComponent(course.slug)}`, { cache: "no-store" });
      const result = response.ok ? await response.json() as StudyState : { progress: [], completion: null };
      return [course.slug, result] as const;
    })).then((items) => {
      setRecords(Object.fromEntries(items));
      setLoaded(true);
    }).catch(() => setLoaded(true));
  }, [courses]);

  if (!loaded) return <p className="resource-empty">성경공부 기록을 불러오는 중입니다…</p>;
  return <div className="member-bible-study-list">{courses.map((course) => {
    const record = records[course.slug];
    const completedPages = new Set(record?.progress.map((item) => item.pageKey) ?? []).size;
    const percent = Math.round((completedPages / course.totalPages) * 100);
    const status = record?.completion?.status === "certified" ? "수료 완료" : record?.completion ? "수료 확인 중" : completedPages ? "학습 중" : "시작 전";
    return <article className="member-training-card" key={course.slug}>
      <div className="member-training-heading"><div><small>{status}</small><h3>{course.title}</h3><p>{course.totalLessons ? `${course.totalLessons}과 · ` : ""}${completedPages}/${course.totalPages}쪽 완료</p></div><strong>{record?.completion?.status === "certified" ? "수료" : `${percent}%`}</strong></div>
      <div className="training-progress" aria-label={`진도 ${percent}%`}><span style={{ width: `${percent}%` }} /></div>
      <a className="text-action" href={`/bible-study/${course.slug}`}>{completedPages ? "이어서 공부하기" : "성경공부 시작"}</a>
    </article>;
  })}</div>;
}
