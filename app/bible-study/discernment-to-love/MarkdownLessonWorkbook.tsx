"use client";

import { useEffect, useMemo, useRef, useState } from "react";

export type MarkdownLessonPage = { key: string; eyebrow: string; title: string; markdown: string };

type SavedResponse = { pageKey: string; questionKey: string; answer: string; studiedOn: string; updatedAt: string };
type SavedProgress = { pageKey: string; studiedOn: string; completedAt: string };
type StudyState = { responses: SavedResponse[]; progress: SavedProgress[]; totalPages: number };

type WorkbookProps = {
  lessonNumber: number;
  pages: MarkdownLessonPage[];
  endpoint: string;
  startPage?: string;
};

function RichText({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g).filter(Boolean);
  return <>{parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) return <strong key={index}>{part.slice(2, -2)}</strong>;
    if (part.startsWith("*") && part.endsWith("*")) return <em key={index}>{part.slice(1, -1)}</em>;
    return <span key={index}>{part}</span>;
  })}</>;
}

function stripMarkdownLine(line: string) {
  return line.replace(/^>\s?/, "").replace(/^[-*]\s+/, "").trim();
}

function splitTableRow(line: string) {
  return line.trim().replace(/^\|/, "").replace(/\|$/, "").split("|").map((item) => item.trim());
}

export function MarkdownLessonWorkbook({ lessonNumber, pages, endpoint, startPage }: WorkbookProps) {
  const requestedIndex = startPage ? pages.findIndex((item) => item.key === startPage) : -1;
  const [pageIndex, setPageIndex] = useState(requestedIndex >= 0 ? requestedIndex : 0);
  const [data, setData] = useState<StudyState | null>(null);
  const [needsLogin, setNeedsLogin] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [notice, setNotice] = useState("");
  const contentRef = useRef<HTMLElement>(null);
  const page = pages[pageIndex];
  const progressKeys = useMemo(() => new Set((data?.progress ?? []).map((item) => item.pageKey)), [data]);
  const completed = progressKeys.size;
  const percent = Math.round((completed / pages.length) * 100);

  async function load() {
    const response = await fetch(endpoint, { cache: "no-store" });
    const result = await response.json() as StudyState & { error?: string };
    if (response.status === 401) {
      setNeedsLogin(true);
      setData({ responses: [], progress: [], totalPages: pages.length });
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
    const bounded = Math.max(0, Math.min(pages.length - 1, nextIndex));
    const nextPage = pages[bounded];
    setPageIndex(bounded);
    const url = new URL(window.location.href);
    url.searchParams.set("lesson", String(lessonNumber));
    url.searchParams.set("page", nextPage.key);
    url.hash = "study-content";
    window.history.pushState({ bibleStudyPage: nextPage.key }, "", url);
    window.requestAnimationFrame(() => {
      contentRef.current?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
      contentRef.current?.focus({ preventScroll: true });
    });
  }

  async function saveAnswer(questionKey: string, answer: string) {
    if (needsLogin) return;
    setAnswers((current) => ({ ...current, [`${page.key}:${questionKey}`]: answer }));
    const response = await fetch(endpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "answer", pageKey: page.key, questionKey, answer }) });
    setNotice(response.ok ? "답변을 저장했습니다." : "답변을 저장하지 못했습니다.");
    if (response.ok) await load();
  }

  async function completePage() {
    if (needsLogin) return;
    const response = await fetch(endpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "complete-page", pageKey: page.key }) });
    setNotice(response.ok ? "이 페이지의 공부 날짜와 완료 기록을 저장했습니다." : "완료 기록을 저장하지 못했습니다.");
    if (response.ok) await load();
  }

  function renderQuestion(prompt: string, questionKey: string) {
    const answerKey = `${page.key}:${questionKey}`;
    return <div className="web-study-questions" key={`question:${questionKey}`}><label><strong style={{ whiteSpace: "pre-line" }}><RichText text={prompt} /></strong><textarea rows={5} value={answers[answerKey] ?? ""} disabled={needsLogin} onChange={(event) => setAnswers((current) => ({ ...current, [answerKey]: event.target.value }))} onBlur={(event) => void saveAnswer(questionKey, event.target.value)} placeholder={needsLogin ? "로그인하면 이곳에 답을 기록할 수 있습니다." : "여기에 답을 적으면 자동 저장됩니다."} /></label></div>;
  }

  function renderMarkdown(markdown: string) {
    const lines = markdown.split(/\r?\n/);
    const rendered: React.ReactNode[] = [];
    let questionIndex = 0;
    let index = 0;
    while (index < lines.length) {
      const line = lines[index].trim();
      if (!line || line === "---") { index += 1; continue; }
      if (line.startsWith("|") && lines[index + 1]?.trim().startsWith("|") && lines[index + 1]?.includes("---")) {
        const headers = splitTableRow(line);
        const rows: string[][] = [];
        index += 2;
        while (index < lines.length && lines[index].trim().startsWith("|")) { rows.push(splitTableRow(lines[index])); index += 1; }
        rendered.push(<div key={`table:${index}`} style={{ overflowX: "auto", margin: "1.5rem 0" }}><table style={{ width: "100%", borderCollapse: "collapse" }}><thead><tr>{headers.map((header, headerIndex) => <th key={headerIndex} style={{ textAlign: "left", padding: "0.75rem", borderBottom: "1px solid currentColor" }}><RichText text={header} /></th>)}</tr></thead><tbody>{rows.map((row, rowIndex) => <tr key={rowIndex}>{row.map((cell, cellIndex) => <td key={cellIndex} style={{ verticalAlign: "top", padding: "0.75rem", borderBottom: "1px solid rgba(128,128,128,.25)" }}><RichText text={cell} /></td>)}</tr>)}</tbody></table></div>);
        continue;
      }
      if (line.startsWith("### ")) { rendered.push(<section className="web-study-section" key={index}><p className="web-study-section-label"><RichText text={line.slice(4)} /></p></section>); index += 1; continue; }
      if (line.startsWith("## ")) { rendered.push(<section className="web-study-section" key={index}><h3><RichText text={line.slice(3)} /></h3></section>); index += 1; continue; }
      if (line.startsWith(">")) {
        const body: string[] = [];
        while (index < lines.length && lines[index].trim().startsWith(">")) { const content = stripMarkdownLine(lines[index].trim()); if (content) body.push(content); index += 1; }
        rendered.push(<blockquote className="web-study-section" key={`quote:${index}`}>{body.map((paragraph, pIndex) => <p key={pIndex}><RichText text={paragraph} /></p>)}</blockquote>);
        continue;
      }
      const questionMatch = line.match(/^(\d+\))\s*(.+)/) ?? line.match(/^\*\*✍️\s*(.+?)\*\*$/);
      if (questionMatch) { questionIndex += 1; const prompt = questionMatch[2] ?? questionMatch[1]; rendered.push(renderQuestion(prompt, `l${lessonNumber}-${page.key}-q${questionIndex}`)); index += 1; continue; }
      if (/^[-*]\s+/.test(line)) {
        const items: string[] = [];
        while (index < lines.length && /^[-*]\s+/.test(lines[index].trim())) { items.push(lines[index].trim().replace(/^[-*]\s+/, "")); index += 1; }
        rendered.push(<section className="web-study-section" key={`list:${index}`}><ul>{items.map((item, itemIndex) => <li key={itemIndex}><RichText text={item} /></li>)}</ul></section>);
        continue;
      }
      rendered.push(<p key={index}><RichText text={line} /></p>);
      index += 1;
    }
    return rendered;
  }

  return <section className="web-study-shell"><aside className="web-study-sidebar" aria-label="교재 목차"><p className="section-kicker">분별에서 사랑으로</p><h2>{lessonNumber}과 학습 순서</h2><div className="web-study-progress"><span style={{ width: `${percent}%` }} /></div><strong>{needsLogin ? `총 ${pages.length}쪽 · 로그인 후 진도 저장` : `${completed}/${pages.length}쪽 완료 · ${percent}%`}</strong><ol>{pages.map((item, itemIndex) => <li key={item.key}><button type="button" className={itemIndex === pageIndex ? "is-active" : ""} aria-current={itemIndex === pageIndex ? "page" : undefined} onClick={() => selectPage(itemIndex)}><span>{itemIndex + 1}</span><em><small>{item.eyebrow}</small>{item.title}</em>{progressKeys.has(item.key) && <small>완료</small>}</button></li>)}</ol></aside><article className="web-study-page" id="study-content" ref={contentRef} tabIndex={-1}><div className="web-study-page-heading"><div><p className="section-kicker">{page.eyebrow}</p><h2>{page.title}</h2></div><b>{String(pageIndex + 1).padStart(2, "0")} / {String(pages.length).padStart(2, "0")}</b></div>{needsLogin && <div className="web-study-login-callout"><strong>읽기는 누구나 할 수 있습니다.</strong><p>답변 저장, 공부 날짜 기록, 진도 관리는 로그인한 교인에게 열립니다.</p><a className="primary-link" href={`/login?returnTo=${encodeURIComponent(`/bible-study/discernment-to-love?lesson=${lessonNumber}&page=${page.key}#study-content`)}`}>로그인하여 이 페이지부터 기록하기</a></div>}<div className="web-study-sections">{renderMarkdown(page.markdown)}</div>{notice && <p className="content-manager-notice" role="status">{notice}</p>}<div className="web-study-actions"><button type="button" className="text-action" disabled={pageIndex === 0} onClick={() => selectPage(pageIndex - 1)}>이전</button>{!needsLogin && <button type="button" className="primary-link" onClick={() => void completePage()}>{progressKeys.has(page.key) ? "완료 날짜 다시 저장" : "이 페이지 공부 완료"}</button>}<button type="button" className="text-action" disabled={pageIndex === pages.length - 1} onClick={() => selectPage(pageIndex + 1)}>다음</button></div></article></section>;
}
