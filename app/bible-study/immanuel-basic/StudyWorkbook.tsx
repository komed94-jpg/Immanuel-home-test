"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { BibleStudyCourse } from "@/lib/bible-study";

type SavedResponse = { pageKey: string; questionKey: string; answer: string; studiedOn: string; updatedAt: string };
type SavedProgress = { pageKey: string; studiedOn: string; completedAt: string };
type StudyState = { responses: SavedResponse[]; progress: SavedProgress[]; completion: { status: string; certifiedAt: string | null } | null; totalPages: number };

export function StudyWorkbook({ course, startPageKey }: { course: BibleStudyCourse; startPageKey?: string }) {
  const requestedIndex = startPageKey ? course.pages.findIndex((item) => item.key === startPageKey) : -1;
  const [pageIndex, setPageIndex] = useState(requestedIndex >= 0 ? requestedIndex : 0);
  const didSetResume = useRef(requestedIndex >= 0);
  const [data, setData] = useState<StudyState | null>(null);
  const [needsLogin, setNeedsLogin] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [notice, setNotice] = useState("");
  const page = course.pages[pageIndex];
  const coursePageKeys = useMemo(() => new Set(course.pages.map((item) => item.key)), [course.pages]);
  const progressKeys = useMemo(() => new Set((data?.progress ?? []).filter((item) => coursePageKeys.has(item.pageKey)).map((item) => item.pageKey)), [coursePageKeys, data]);
  const completed = progressKeys.size;
  const percent = Math.round((completed / course.pages.length) * 100);
  const completedLessons = useMemo(() => {
    if (!course.totalLessons) return null;
    return Array.from({ length: course.totalLessons }, (_, index) => index + 1).filter((unit) => {
      const unitPages = course.pages.filter((item) => item.unit === unit);
      return unitPages.length > 0 && unitPages.every((item) => progressKeys.has(item.key));
    }).length;
  }, [course.pages, course.totalLessons, progressKeys]);

  async function load() {
    const response = await fetch(`/api/member/study?course=${course.slug}`, { cache: "no-store" });
    const result = await response.json() as StudyState & { error?: string };
    if (response.status === 401) { setNeedsLogin(true); setData({ responses: [], progress: [], completion: null, totalPages: course.pages.length }); return; }
    if (!response.ok) { setNotice(result.error ?? "학습 기록을 불러오지 못했습니다."); return; }
    setNeedsLogin(false);
    setData(result);
    setAnswers(Object.fromEntries(result.responses.map((item) => [`${item.pageKey}:${item.questionKey}`, item.answer])));
  }

  useEffect(() => {
    fetch(`/api/member/study?course=${course.slug}`, { cache: "no-store" })
      .then(async (response) => ({ response, result: await response.json() as StudyState & { error?: string } }))
      .then(({ response, result }) => {
        if (response.status === 401) { setNeedsLogin(true); setData({ responses: [], progress: [], completion: null, totalPages: course.pages.length }); return; }
        if (!response.ok) { setNotice(result.error ?? "학습 기록을 불러오지 못했습니다."); return; }
        setNeedsLogin(false);
        setData(result);
        setAnswers(Object.fromEntries(result.responses.map((item) => [`${item.pageKey}:${item.questionKey}`, item.answer])));
        if (!didSetResume.current) {
          const savedKeys = new Set(result.progress.map((item) => item.pageKey));
          const nextPage = course.pages.findIndex((item) => !savedKeys.has(item.key));
          setPageIndex(nextPage >= 0 ? nextPage : course.pages.length - 1);
          didSetResume.current = true;
        }
      })
      .catch(() => setNotice("학습 기록을 불러오지 못했습니다."));
  }, [course.pages, course.pages.length, course.slug]);

  async function saveAnswer(questionKey: string, answer: string) {
    if (needsLogin) return;
    setAnswers((current) => ({ ...current, [`${page.key}:${questionKey}`]: answer }));
    const response = await fetch("/api/member/study", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "answer", courseSlug: course.slug, lessonSlug: course.lessonSlug, pageKey: page.key, questionKey, answer }) });
    setNotice(response.ok ? "답변을 저장했습니다." : "답변을 저장하지 못했습니다.");
    if (response.ok) await load();
  }

  async function completePage() {
    if (needsLogin) return;
    const response = await fetch("/api/member/study", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "complete-page", courseSlug: course.slug, lessonSlug: course.lessonSlug, pageKey: page.key }) });
    setNotice(response.ok ? "이 페이지의 공부 날짜와 완료 기록을 저장했습니다." : "완료 기록을 저장하지 못했습니다.");
    if (response.ok) await load();
  }

  return <section className="web-study-shell">
    <aside className="web-study-sidebar" aria-label="교재 목차">
      <p className="section-kicker">WEB WORKBOOK</p>
      <h2>{course.title}</h2>
      <div className="web-study-progress"><span style={{ width: `${percent}%` }} /></div>
      <strong>{needsLogin ? `총 ${course.totalLessons ? `${course.totalLessons}과 · ` : ""}${course.pages.length}쪽 · 로그인 후 진도 저장` : course.totalLessons && completedLessons !== null ? `${completedLessons}/${course.totalLessons}과 · ${completed}/${course.pages.length}쪽 · ${percent}%` : `${completed}/${course.pages.length}쪽 완료 · ${percent}%`}</strong>
      <ol>{course.pages.map((item, index) => <li key={item.key}>
        <button type="button" className={index === pageIndex ? "is-active" : ""} onClick={() => setPageIndex(index)}>
          <span>{index + 1}</span><em><small>{item.lesson}</small>{item.title}</em>{progressKeys.has(item.key) && <small>완료</small>}
        </button>
      </li>)}</ol>
    </aside>
    <article className="web-study-page">
      <div className="web-study-page-heading">
        <div><p className="section-kicker">{page.eyebrow}</p><h2>{page.title}</h2>{page.scripture && <span>{page.scripture}</span>}</div>
        <b>{String(pageIndex + 1).padStart(2, "0")} / {String(course.pages.length).padStart(2, "0")}</b>
      </div>
      {page.body && <div className="web-study-body">{page.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>}
      {page.sections && <div className="web-study-sections">{page.sections.map((section) => <section className="web-study-section" key={`${section.label}:${section.title}`}>
        <p className="web-study-section-label">{section.label}</p><h3>{section.title}</h3>{section.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</section>)}</div>}
      {needsLogin && <div className="web-study-login-callout"><strong>읽기는 누구나 할 수 있습니다.</strong><p>답변 저장, 공부 날짜 기록, 진도와 수료 관리는 로그인한 교인에게 열립니다.</p><a className="primary-link" href={`/login?returnTo=${encodeURIComponent(`/bible-study/${course.slug}`)}`}>로그인하여 답변 기록하기</a></div>}
      <div className="web-study-questions">{page.questions.map((question) => {
        const key = `${page.key}:${question.key}`;
        return <label key={question.key}><span>{question.label}</span><strong>{question.prompt}</strong>{question.visibility === "private" && <small className="web-study-private-note">이 답변은 관리자 화면에 표시되지 않고 본인에게만 보입니다.</small>}<textarea rows={5} value={answers[key] ?? ""} disabled={needsLogin} onChange={(event) => setAnswers((current) => ({ ...current, [key]: event.target.value }))} onBlur={(event) => void saveAnswer(question.key, event.target.value)} placeholder={needsLogin ? "로그인하면 이곳에 답을 기록할 수 있습니다." : "여기에 답을 적으면 자동 저장됩니다."} /></label>;
      })}</div>
      {notice && <p className="content-manager-notice" role="status">{notice}</p>}
      <div className="web-study-actions">
        <button type="button" className="text-action" disabled={pageIndex === 0} onClick={() => setPageIndex((value) => Math.max(0, value - 1))}>이전</button>
        {!needsLogin && <button type="button" className="primary-link" onClick={() => void completePage()}>{progressKeys.has(page.key) ? "완료 날짜 다시 저장" : "이 페이지 공부 완료"}</button>}
        <button type="button" className="text-action" disabled={pageIndex === course.pages.length - 1} onClick={() => setPageIndex((value) => Math.min(course.pages.length - 1, value + 1))}>다음</button>
      </div>
      {data?.completion && <p className="web-study-completion">{data.completion.status === "certified" ? "관리자가 수료 처리했습니다." : "전체 학습 완료 상태입니다. 관리자 확인 후 수료 처리됩니다."}</p>}
    </article>
  </section>;
}
