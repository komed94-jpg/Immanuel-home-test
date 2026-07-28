"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { lessonNinePages } from "./lesson-nine";
import type { Block, Question } from "./lesson-nine/types";

type SavedResponse = { pageKey: string; questionKey: string; answer: string; studiedOn: string; updatedAt: string };
type SavedProgress = { pageKey: string; studiedOn: string; completedAt: string };
type StudyState = { responses: SavedResponse[]; progress: SavedProgress[]; totalPages: number };

const course = {
  slug: "discernment-to-love",
  lessonSlug: "discernment-lesson-9",
  title: "9과 · AI는 언약의 당사자가 될 수 있는가",
  pages: lessonNinePages
};

function RichText({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g).filter(Boolean);
  return <>{parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) return <strong key={index}>{part.slice(2, -2)}</strong>;
    if (part.startsWith("*") && part.endsWith("*")) return <em key={index}>{part.slice(1, -1)}</em>;
    return <span key={index}>{part}</span>;
  })}</>;
}

export function DiscernmentLessonNineWorkbook({ startPage }: { startPage?: string }) {
  const requestedIndex = startPage ? course.pages.findIndex((item) => item.key === startPage) : -1;
  const [pageIndex, setPageIndex] = useState(requestedIndex >= 0 ? requestedIndex : 0);
  const [data, setData] = useState<StudyState | null>(null);
  const [needsLogin, setNeedsLogin] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [notice, setNotice] = useState("");
  const contentRef = useRef<HTMLElement>(null);
  const page = course.pages[pageIndex];
  const blocks = page.blocks;
  const questionMap = useMemo(() => new Map(page.questions.map((question) => [question.key, question])), [page.questions]);
  const progressKeys = useMemo(() => new Set((data?.progress ?? []).map((item) => item.pageKey)), [data]);
  const completed = progressKeys.size;
  const percent = Math.round((completed / course.pages.length) * 100);

  async function load() {
    const response = await fetch("/api/member/study/discernment-lesson-nine", { cache: "no-store" });
    const result = await response.json() as StudyState & { error?: string };
    if (response.status === 401) {
      setNeedsLogin(true);
      setData({ responses: [], progress: [], totalPages: course.pages.length });
      return;
    }
    if (!response.ok) {
      setNotice(result.error ?? "학습 기록을 불러오지 못했습니다.");
      return;
    }
    setNeedsLogin(false);
    setData(result);
    setAnswers(Object.fromEntries(result.responses.map((item) => [`${item.pageKey}:${item.questionKey}`, item.answer])));
  }

  useEffect(() => {
    void load().catch(() => setNotice("학습 기록을 불러오지 못했습니다."));
  }, []);

  function selectPage(nextIndex: number) {
    const bounded = Math.max(0, Math.min(course.pages.length - 1, nextIndex));
    const nextPage = course.pages[bounded];
    setPageIndex(bounded);
    const url = new URL(window.location.href);
    url.searchParams.set("lesson", "9");
    url.searchParams.set("page", nextPage.key);
    url.hash = "study-content";
    window.history.pushState({ bibleStudyPage: nextPage.key }, "", url);
    window.requestAnimationFrame(() => {
      contentRef.current?.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
        block: "start"
      });
      contentRef.current?.focus({ preventScroll: true });
    });
  }

  async function saveAnswer(questionKey: string, answer: string) {
    if (needsLogin) return;
    setAnswers((current) => ({ ...current, [`${page.key}:${questionKey}`]: answer }));
    const response = await fetch("/api/member/study/discernment-lesson-nine", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "answer", pageKey: page.key, questionKey, answer })
    });
    setNotice(response.ok ? "답변을 저장했습니다." : "답변을 저장하지 못했습니다.");
    if (response.ok) await load();
  }

  async function completePage() {
    if (needsLogin) return;
    const response = await fetch("/api/member/study/discernment-lesson-nine", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "complete-page", pageKey: page.key })
    });
    setNotice(response.ok ? "이 페이지의 공부 날짜와 완료 기록을 저장했습니다." : "완료 기록을 저장하지 못했습니다.");
    if (response.ok) await load();
  }

  function renderQuestion(questionKey: string) {
    const question = questionMap.get(questionKey) as Question | undefined;
    if (!question) return null;
    const answerKey = `${page.key}:${question.key}`;
    return <div className="web-study-questions" key={`question:${question.key}`}><label>
      <span>{question.label}</span>
      <strong style={{ whiteSpace: "pre-line" }}><RichText text={question.prompt} /></strong>
      <textarea
        rows={5}
        value={answers[answerKey] ?? ""}
        disabled={needsLogin}
        onChange={(event) => setAnswers((current) => ({ ...current, [answerKey]: event.target.value }))}
        onBlur={(event) => void saveAnswer(question.key, event.target.value)}
        placeholder={needsLogin ? "로그인하면 이곳에 답을 기록할 수 있습니다." : "여기에 답을 적으면 자동 저장됩니다."}
      />
    </label></div>;
  }

  function renderBlock(block: Block, index: number) {
    if (block.type === "heading") return <section className="web-study-section" key={index}><h3>{block.text}</h3></section>;
    if (block.type === "paragraphs") return <div className="web-study-body" key={index}>{block.body.map((paragraph, paragraphIndex) => <p key={paragraphIndex}><RichText text={paragraph} /></p>)}</div>;
    if (block.type === "scripture") return <blockquote className="web-study-section" key={index}><p className="web-study-section-label">{block.label ?? "본문"}</p>{block.refs.map((reference) => <p key={reference}><strong>[본문] {reference}</strong></p>)}</blockquote>;
    if (block.type === "question") return renderQuestion(block.key);
    if (block.type === "callout") return <aside className="web-study-login-callout" key={index}><strong>{block.title}</strong>{block.body.map((paragraph, paragraphIndex) => <p key={paragraphIndex}><RichText text={paragraph} /></p>)}</aside>;
    if (block.type === "quote") return <blockquote className="web-study-section" key={index}>{block.body.map((paragraph, paragraphIndex) => <p key={paragraphIndex}><RichText text={paragraph} /></p>)}</blockquote>;
    if (block.type === "list") {
      const ListTag = block.ordered ? "ol" : "ul";
      return <section className="web-study-section" key={index}><ListTag>{block.items.map((item, itemIndex) => <li key={itemIndex}><RichText text={item} /></li>)}</ListTag></section>;
    }
    if (block.type === "table") return <div key={index} style={{ overflowX: "auto", margin: "1.5rem 0" }}><table style={{ width: "100%", borderCollapse: "collapse" }}>
      <thead><tr>{block.headers.map((header, headerIndex) => <th key={headerIndex} style={{ textAlign: "left", padding: "0.75rem", borderBottom: "1px solid currentColor" }}><RichText text={header} /></th>)}</tr></thead>
      <tbody>{block.rows.map((row, rowIndex) => <tr key={rowIndex}>{row.map((cell, cellIndex) => <td key={cellIndex} style={{ verticalAlign: "top", padding: "0.75rem", borderBottom: "1px solid rgba(128,128,128,.25)" }}><RichText text={cell} /></td>)}</tr>)}</tbody>
    </table></div>;
    return <p key={index}><RichText text={block.text} /></p>;
  }

  return <section className="web-study-shell">
    <aside className="web-study-sidebar" aria-label="교재 목차">
      <p className="section-kicker">분별에서 사랑으로</p>
      <h2>9과 학습 순서</h2>
      <div className="web-study-progress"><span style={{ width: `${percent}%` }} /></div>
      <strong>{needsLogin ? `총 ${course.pages.length}쪽 · 로그인 후 진도 저장` : `${completed}/${course.pages.length}쪽 완료 · ${percent}%`}</strong>
      <ol>{course.pages.map((item, index) => <li key={item.key}><button type="button" className={index === pageIndex ? "is-active" : ""} aria-current={index === pageIndex ? "page" : undefined} onClick={() => selectPage(index)}><span>{index + 1}</span><em><small>{item.eyebrow}</small>{item.title}</em>{progressKeys.has(item.key) && <small>완료</small>}</button></li>)}</ol>
    </aside>
    <article className="web-study-page" id="study-content" ref={contentRef} tabIndex={-1}>
      <div className="web-study-page-heading"><div><p className="section-kicker">{page.eyebrow}</p><h2>{page.title}</h2></div><b>{String(pageIndex + 1).padStart(2, "0")} / {String(course.pages.length).padStart(2, "0")}</b></div>
      {needsLogin && <div className="web-study-login-callout"><strong>읽기는 누구나 할 수 있습니다.</strong><p>답변 저장, 공부 날짜 기록, 진도 관리는 로그인한 교인에게 열립니다.</p><a className="primary-link" href={`/login?returnTo=${encodeURIComponent(`/bible-study/${course.slug}?lesson=9&page=${page.key}#study-content`)}`}>로그인하여 이 페이지부터 기록하기</a></div>}
      <div className="web-study-sections">{blocks.map(renderBlock)}</div>
      {notice && <p className="content-manager-notice" role="status">{notice}</p>}
      <div className="web-study-actions">
        <button type="button" className="text-action" disabled={pageIndex === 0} onClick={() => selectPage(pageIndex - 1)}>이전</button>
        {!needsLogin && <button type="button" className="primary-link" onClick={() => void completePage()}>{progressKeys.has(page.key) ? "완료 날짜 다시 저장" : "이 페이지 공부 완료"}</button>}
        <button type="button" className="text-action" disabled={pageIndex === course.pages.length - 1} onClick={() => selectPage(pageIndex + 1)}>다음</button>
      </div>
    </article>
  </section>;
}
