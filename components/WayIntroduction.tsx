"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import type { WayArticle } from "@/data/immanuel";
import { wayIntroEmphasis } from "@/lib/way-intro-emphasis";
import styles from "./WayIntroduction.module.css";

type Circle = { x: number; y: number; width: number; height: number };

function circlePath({ x, y, width, height }: Circle, secondPass = false) {
  const left = x - 7 + (secondPass ? 1 : 0);
  const top = y - 4 + (secondPass ? 1 : 0);
  const right = x + width + 7;
  const bottom = y + height + 4;
  const cx = (left + right) / 2;
  const cy = (top + bottom) / 2;
  const rx = (right - left) / 2;
  const ry = (bottom - top) / 2;
  return `M ${cx} ${top} C ${cx + rx * .7} ${top - 1}, ${right + 1} ${cy - ry * .45}, ${right} ${cy} C ${right - 1} ${cy + ry * .65}, ${cx + rx * .6} ${bottom + 1}, ${cx} ${bottom} C ${cx - rx * .7} ${bottom}, ${left - 1} ${cy + ry * .5}, ${left} ${cy} C ${left + 1} ${cy - ry * .65}, ${cx - rx * .55} ${top + 1}, ${cx} ${top}`;
}

export function WayIntroduction({ article }: { article: WayArticle }) {
  const rootRef = useRef<HTMLElement>(null);
  const [circles, setCircles] = useState<Circle[]>([]);
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
        const next = Array.from(root.querySelectorAll<HTMLElement>("[data-intro-circle]"))
          .flatMap((element) => Array.from(element.getClientRects()))
          .filter((rect) => rect.width > 0 && rect.height > 0)
          .map((rect) => ({
            x: rect.left - origin.left,
            y: rect.top - origin.top,
            width: rect.width,
            height: rect.height
          }));
        setCircles((previous) => previous.length === next.length && previous.every((rect, i) =>
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
      parts.push(
        <strong key={match.start} data-intro-circle={match.phrase === emphasis.circle ? "true" : undefined}>
          {paragraph.slice(match.start, match.end)}
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
      {circles.length > 0 && (
        <svg className={styles.annotations} aria-hidden="true" focusable="false">
          {circles.map((circle, index) => (
            <g key={index}>
              <path d={circlePath(circle)} className={styles.circle} />
              <path d={circlePath(circle, true)} className={styles.circleSecond} />
            </g>
          ))}
        </svg>
      )}
    </section>
  );
}
