"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import Link from "next/link";
import type { WayArticle } from "@/data/immanuel";
import { WayIntroduction } from "@/components/WayIntroduction";
import styles from "./PrayerPrototype.module.css";
import worship from "./WorshipPrototype.module.css";

type Props = {
  article: WayArticle;
  children: ReactNode;
  navigation: ReactNode;
  startStudy?: boolean;
};

function subscribeToLocation(onChange: () => void) {
  window.addEventListener("hashchange", onChange);
  window.addEventListener("popstate", onChange);
  return () => {
    window.removeEventListener("hashchange", onChange);
    window.removeEventListener("popstate", onChange);
  };
}

function readHash() { return window.location.hash; }
function serverHash() { return ""; }

export function WorshipPrototype({ article, children, navigation, startStudy = false }: Props) {
  const root = useRef<HTMLElement>(null);
  const noteField = useRef<HTMLTextAreaElement>(null);
  const [note, setNote] = useState("");
  const [copyStatus, setCopyStatus] = useState("");
  const hash = useSyncExternalStore(subscribeToLocation, readHash, serverHash);
  const activeSection = ["#worship-study", "#study-content"].includes(hash)
    ? "study"
    : ["#worship-prepare", "#worship-moment"].includes(hash)
      ? "prepare"
      : !hash && startStudy ? "study" : null;

  useEffect(() => {
    const sections = root.current?.querySelectorAll<HTMLElement>("[data-worship-reveal]");
    if (!sections || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          (entry.target as HTMLElement).dataset.entered = "true";
          observer.unobserve(entry.target);
        }
      }
    }, { threshold: 0.18 });
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    // Reveal a linked panel before moving focus. The other panel stays mounted
    // so a visitor can return to an unfinished study or prayer without losing it.
    const frame = requestAnimationFrame(() => {
      const target = document.getElementById(hash.slice(1));
      if (!target || target.closest("[hidden]")) return;
      target.scrollIntoView({ block: "start" });
      target.focus({ preventScroll: true });
    });
    return () => cancelAnimationFrame(frame);
  }, [hash, activeSection]);

  async function copyPrayer() {
    if (!note.trim()) return;
    try {
      await navigator.clipboard.writeText(note.trim());
      setCopyStatus("내 기도를 복사했어요.");
    } catch {
      noteField.current?.focus();
      noteField.current?.select();
      setCopyStatus("문장을 선택했어요. 기기의 복사 기능으로 복사해 주세요.");
    }
  }

  return (
    <article ref={root} className={`${styles.page} ${worship.page}`}>
      <header className={styles.hero} style={{ backgroundImage: `url(${article.image.url})` }}>
        <div className={styles.heroInner}>
          <Link className={styles.back} href="/way">← 임마누엘의 길</Link>
          <p className={styles.eyebrow}>임마누엘의 길 02 · 예배</p>
          <h1>{article.title}</h1>
          <p className={`${styles.heroLead} ${worship.quote}`}>{article.quote}</p>
          <p className={styles.keywords}>{article.keywords.join(" · ")}</p>
          <a className={styles.primary} href="#worship-introduction">먼저 읽어 보세요 <span aria-hidden="true">↓</span></a>
        </div>
      </header>

      <div id="worship-introduction" className={styles.introduction} tabIndex={-1}>
        <WayIntroduction article={article} />
      </div>

      <section id="worship-next" className={styles.next} aria-labelledby="worship-next-title" tabIndex={-1}>
        <p className={styles.sectionLabel}>이제 함께 해 볼까요?</p>
        <h2 id="worship-next-title">읽은 말씀을<br className={styles.mobileBreak} />{" "}예배로 이어가 볼까요?</h2>
        <div className={styles.choices}>
          <a href="#worship-study" aria-controls="worship-study" aria-expanded={activeSection === "study"}>
            <strong>성경공부 <span aria-hidden="true">→</span></strong>
            <span>하나님이 기뻐하시는 예배를 성경에서 함께 살펴봐요.</span>
          </a>
          <a href="#worship-prepare" aria-controls="worship-prepare" aria-expanded={activeSection === "prepare"}>
            <strong>예배를 준비해요 <span aria-hidden="true">→</span></strong>
            <span>잠시 마음을 모으고, 나의 말로 하나님께 기도해요.</span>
          </a>
        </div>
      </section>

      <section id="worship-study" className={styles.study} hidden={activeSection !== "study"} aria-labelledby="worship-study-title" tabIndex={-1}>
        <header className={styles.studyHeading}>
          <p className={styles.sectionLabel}>성경공부 · 로마서 12:1–2</p>
          <h2 id="worship-study-title">하나님의 은혜에 응답하는 예배</h2>
          <a className={styles.returnLink} href="#worship-next">← 다시 선택하기</a>
        </header>
        <div className={styles.studyContent}>{children}</div>
        <div className={styles.studyEnd}>
          <a className={styles.primary} href="#worship-prepare">이제 예배를 준비해요 <span aria-hidden="true">→</span></a>
        </div>
      </section>

      <section id="worship-prepare" className={styles.practice} hidden={activeSection !== "prepare"} aria-labelledby="worship-prepare-title" tabIndex={-1}>
        <header className={`${styles.practiceHero} ${worship.prepareHero}`}>
          <div className={styles.heroInner} data-worship-reveal>
            <a className={styles.back} href="#worship-next">← 다시 선택하기</a>
            <p className={styles.eyebrow}>예배를 준비해요</p>
            <h2 id="worship-prepare-title">마음이 조용한 날에도,<br />{" "}<span className={styles.mark}>하나님을 예배합니다.
              <svg viewBox="0 0 600 22" preserveAspectRatio="none" aria-hidden="true" focusable="false"><path pathLength="1" d="M4 15 C130 6 332 8 590 11 M42 20 C201 11 378 16 548 12" /></svg>
            </span></h2>
            <p className={styles.heroLead}>뜨거운 감동이 있는 날도, 아무 느낌이 없는 날도 있습니다.<br />{" "}오늘은 하나님이 어떤 분이신지 함께 바라보세요.</p>
            <a className={styles.primary} href="#worship-moment">잠시 기도할까요? <span aria-hidden="true">↓</span></a>
            <p className={styles.heroFoot}>아래의 짧은 글을 먼저 읽어도 좋습니다.</p>
          </div>
        </header>

        <section className={styles.reading} aria-labelledby="worship-question">
          <p className={styles.sectionLabel}>이런 마음이 들 때</p>
          <h2 id="worship-question">감동이 없으면,<br />{" "}예배를 잘못 드린 걸까요?</h2>
          <div className={styles.prose}>
            <p>눈물이나 벅찬 마음은 소중한 경험입니다. 그러나 <strong>그 크기만으로 예배나 믿음의 진실함을 판단할 수는 없습니다.</strong> 지금의 마음을 하나님께 정직하게 드려 보세요.</p>
            <p>우리가 예배하는 이유는 하나님께서 거룩하고 선하시며, 예수 그리스도 안에서 우리에게 사랑과 은혜를 베푸셨기 때문입니다. 말씀을 통해 그분을 알아 가며, 성령께 마음을 열어 달라고 구해 보세요.</p>
          </div>
          <aside className={styles.scripture} aria-label="함께 기억할 말씀">
            <span className={styles.scriptureRef}>로마서 12:1–2</span>
            <p>하나님께 받은 자비를 기억하며,<br className={styles.desktopBreak} />{" "}우리의 몸과 삶을 하나님께 드립니다.</p>
            <span className={styles.scriptureNote}>본문의 뜻을 풀어 쓴 안내입니다.</span>
          </aside>
        </section>

        <section className={styles.journey} aria-labelledby="worship-journey" data-worship-reveal>
          <div className={styles.journeyInner}>
            <p className={styles.sectionLabel}>예배가 삶으로 이어지도록</p>
            <h2 id="worship-journey">받은 은혜에,<br className={styles.mobileBreak} />{" "}우리의 마음과 삶을 드려요.</h2>
            <ol className={styles.flow}>
              <li><span className={styles.dot} aria-hidden="true" /><span className={styles.flowLabel}>은혜를 기억해요</span><p>말씀 속에서 하나님의 성품과<br />{" "}예수님의 사랑을 바라봐요.</p></li>
              <li><span className={styles.dot} aria-hidden="true" /><span className={styles.flowLabel}>마음을 드려요</span><p>찬양과 기도에<br />{" "}감사와 정직한 마음을 담아요.</p></li>
              <li><span className={styles.dot} aria-hidden="true" /><span className={styles.flowLabel}>사랑하며 살아요</span><p>들은 말씀을 따라<br />{" "}곁에 있는 사람을 사랑해요.</p></li>
            </ol>
          </div>
        </section>

        <section id="worship-moment" className={styles.moment} aria-labelledby="worship-moment-title" tabIndex={-1}>
          <div className={styles.momentInner}>
            <p className={styles.sectionLabel}>이제, 나의 말로</p>
            <h2 id="worship-moment-title" className={worship.momentTitle}>이번 예배에서<br />{" "}하나님께 드리고 싶은 말이 있나요?</h2>
            <p className={styles.momentLead}>“하나님, 오늘 저는…”으로 시작해 보세요.<br />{" "}감사한 일도, 무거운 마음도 하나님께 아뢰어 보세요.</p>
            <details className={styles.example}>
              <summary>기도가 떠오르지 않을 때</summary>
              <p>하나님, 오늘 제 모습 그대로 주님 앞에 나아갑니다. 예수님 안에서 베푸신 은혜를 기억하게 해 주세요. 성령님, 말씀을 들을 귀와 주님을 사랑하는 마음을 열어 주세요. 오늘의 찬양과 기도에 제 마음을 담고, 들은 말씀을 삶에서 따르게 해 주세요. 예수님의 이름으로 기도합니다. 아멘.</p>
              <p className={styles.exampleNote}>이 문장에서 시작해, 자신의 이야기로 이어가셔도 좋습니다.</p>
            </details>
            <div className={styles.noteArea}>
              <label htmlFor="worship-note">한 문장 적어도 좋습니다 <span>(선택)</span></label>
              <textarea ref={noteField} id="worship-note" rows={3} value={note} onChange={(event) => { setNote(event.target.value); setCopyStatus(""); }} placeholder="하나님, 오늘 저는…" aria-describedby="worship-note-help" />
              <div className={styles.noteFooter}>
                <p id="worship-note-help">적은 내용은 전송·저장되지 않습니다.<br />{" "}남겨 두고 싶다면 떠나기 전에 복사해 주세요.</p>
                <button type="button" onClick={copyPrayer} disabled={!note.trim()}>내 기도 복사</button>
              </div>
              <p className={styles.copyStatus} role="status" aria-live="polite">{copyStatus}</p>
            </div>
            <div className={styles.today}>
              <span>예배 후, 오늘의 한 걸음</span>
              <p>오늘 들은 말씀을 따라,<br />{" "}<strong>가까운 한 사람에게 따뜻한 말 한마디를 건네 보세요.</strong></p>
            </div>
          </div>
        </section>

        <div className={styles.practiceEnd}>
          <a className={styles.returnLink} href="#worship-introduction">처음 글 다시 읽기</a>
          <a className={styles.returnLink} href="#worship-study">성경공부로 이어가기 →</a>
        </div>
      </section>
      <div className={styles.navigation}>{navigation}</div>
    </article>
  );
}
