"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import type { WayArticle } from "@/data/immanuel";
import { wayIntroEmphasis } from "@/lib/way-intro-emphasis";
import { introMarkPaths, introMarkStyle, type IntroMarkRect } from "@/lib/way-intro-marks";
import styles from "./WayIntroduction.module.css";

export function WayIntroduction({ article }: { article: WayArticle }) {
  const rootRef = useRef<HTMLElement>(null);
  const [marks, setMarks] = useState<IntroMarkRect[]>([]);
  const markStyle = introMarkStyle(article.slug);
  const emphasis = wayIntroEmphasis[article.slug];

  useEffect(() => {
    const root = rootRef.current;
    if (!root || !emphasis) return;
    let active = true;
    let frame = 0;

    const measure = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        if (!active) return;
        const origin = root.getBoundingClientRect();
        // An inline phrase may wrap: annotate each visible line, without forcing a new line.
        const next = Array.from(root.querySelectorAll<HTMLElement>("[data-intro-mark]"))
          .flatMap((element) => Array.from(element.getClientRects()))
          .filter((rect) => rect.width > 0 && rect.height > 0)
          .map((rect) => ({
            x: rect.left - origin.left,
            y: rect.top - origin.top,
            width: rect.width,
            height: rect.height
          }));
        setMarks((previous) => previous.length === next.length && previous.every((rect, i) =>
          Math.abs(rect.x - next[i].x) < .5 && Math.abs(rect.y - next[i].y) < .5 &&
          Math.abs(rect.width - next[i].width) < .5 && Math.abs(rect.height - next[i].height) < .5
        ) ? previous : next);
      });
    };

    const observer = new ResizeObserver(measure);
    observer.observe(root);
    measure();
    document.fonts.ready.then(() => { if (active) measure(); });
    return () => {
      active = false;
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [article.slug, emphasis]);

  function renderParagraph(paragraph: string): ReactNode {
    if (!emphasis) return paragraph;
    const matches = emphasis.phrases.flatMap((phrase) => {
      const start = paragraph.indexOf(phrase);
      return start >= 0 ? [{ start, end: start + phrase.length, phrase }] : [];
    }).sort((a, b) => a.start - b.start);
    const parts: ReactNode[] = [];
    let cursor = 0;
    for (const match of matches) {
      parts.push(paragraph.slice(cursor, match.start));
      const focusStart = match.phrase.indexOf(emphasis.mark);
      parts.push(
        <strong key={match.start}>
          {focusStart < 0 ? match.phrase : <>
            {match.phrase.slice(0, focusStart)}
            <span data-intro-mark={markStyle}>{emphasis.mark}</span>
            {match.phrase.slice(focusStart + emphasis.mark.length)}
          </>}
        </strong>
      );
      cursor = match.end;
    }
    parts.push(paragraph.slice(cursor));
    return parts;
  }

  return (
    <section ref={rootRef} className={`article-body ${styles.intro}`} aria-label={`${article.title} 원문`}>
      {article.content.map((paragraph, index) => (
        <p
          key={`${article.slug}-${index}`}
          className={index === 0 ? styles.opening : index === article.content.length - 1 ? styles.bracket : undefined}
        >
          {renderParagraph(paragraph)}
        </p>
      ))}
      {marks.length > 0 && (
        <svg className={styles.annotations} aria-hidden="true" focusable="false">
          {marks.map((rect, index) => (
            <g key={index} data-mark-style={markStyle}>
              {introMarkPaths(rect, markStyle, index).map((path, pass) => (
                <path key={pass} d={path} className={styles.pen} />
              ))}
            </g>
          ))}
        </svg>
      )}
    </section>
  );
}

