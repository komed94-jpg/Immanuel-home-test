"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import type { WayArticle } from "@/data/immanuel";
import { WayIntroduction } from "@/components/WayIntroduction";
import styles from "./PrayerPrototype.module.css";

type Props = {
  article: WayArticle;
  children: ReactNode;
  navigation: ReactNode;
  startStudy?: boolean;
};

export function PrayerPrototype({ article, children, navigation, startStudy = false }: Props) {
  const root = useRef<HTMLElement>(null);
  const noteField = useRef<HTMLTextAreaElement>(null);
  const [note, setNote] = useState("");
  const [copyStatus, setCopyStatus] = useState("");
  const [studyOpen, setStudyOpen] = useState(startStudy);

  useEffect(() => {
    const sections = root.current?.querySelectorAll<HTMLElement>("[data-prayer-reveal]");
    if (!sections) return;
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
    function revealLinkedStudy() {
      if (["#study-content", "#prayer-study"].includes(window.location.hash)) setStudyOpen(true);
    }
    revealLinkedStudy();
    window.addEventListener("hashchange", revealLinkedStudy);
    return () => window.removeEventListener("hashchange", revealLinkedStudy);
  }, []);

  useEffect(() => {
    if (!studyOpen || !["#study-content", "#prayer-study"].includes(window.location.hash)) return;
    document.getElementById(window.location.hash.slice(1))?.scrollIntoView({ block: "start" });
  }, [studyOpen]);

  async function copyPrayer() {
    if (!note.trim()) return;
    try {
      await navigator.clipboard.writeText(`주님, 지금 제 마음은…\n\n${note.trim()}`);
      setCopyStatus("기도를 복사했어요.");
    } catch {
      noteField.current?.focus();
      noteField.current?.select();
      setCopyStatus("문장을 선택했어요. 기기의 복사 기능으로 복사해 주세요.");
    }
  }

  return (
    <article ref={root} className={styles.page}>
      <header className={styles.hero} style={{ backgroundImage: `url(${article.image.url})` }}>
        <div className={styles.heroInner} data-prayer-reveal>
          <Link className={styles.back} href="/way">← 임마누엘의 길</Link>
          <p className={styles.eyebrow}>03 · 우리가 기도하는 방식</p>
          <h1>기도가 막막한 날에도,<br />{" "}<span className={styles.mark}>하나님께 나아갑니다.
            <svg viewBox="0 0 600 22" preserveAspectRatio="none" aria-hidden="true" focusable="false"><path pathLength="1" d="M4 15 C130 6 332 8 590 11 M42 20 C201 11 378 16 548 12" /></svg>
          </span></h1>
          <p className={styles.heroLead}>무슨 말을 해야 할지 모르겠는 날이 있습니다.<br />{" "}정리되지 않은 마음도 하나님께 가져가 보세요.</p>
          <a className={styles.primary} href="#prayer-moment">잠시 기도하기 <span aria-hidden="true">↓</span></a>
          <p className={styles.heroFoot}>먼저, 아래의 짧은 글을 천천히 읽어도 좋습니다.</p>
        </div>
      </header>

      <section className={styles.reading} aria-labelledby="prayer-welcome" data-prayer-reveal>
        <p className={styles.sectionLabel}>지금의 마음으로</p>
        <h2 id="prayer-welcome">말이 잘 나오지 않아도<br />{" "}기도를 시작할 수 있습니다.</h2>
        <div className={styles.prose}>
          <p>기도하려고 앉았는데 피곤하고, 마음이 복잡하고, 같은 부탁을 반복하는 자신이 답답할 수 있습니다. 그 마음을 숨기지 않아도 됩니다.</p>
          <p>우리가 하나님께 나아갈 수 있는 것은 <strong>예수 그리스도께서 은혜의 길을 열어 주셨기 때문</strong>입니다. 잘 정리된 말이나 뜨거운 감정을 먼저 갖추어야 하는 것은 아닙니다.</p>
        </div>
        <aside className={styles.scripture} aria-label="함께 기억할 말씀">
          <span className={styles.scriptureRef}>히브리서 4:14–16</span>
          <p>우리의 연약함을 아시는 예수님을 의지하여,<br className={styles.desktopBreak} />{" "} 은혜의 보좌 앞에 담대히 나아가도록 초대합니다.</p>
          <span className={styles.scriptureNote}>본문의 뜻을 풀어 쓴 안내입니다.</span>
        </aside>
      </section>

      <section className={styles.journey} aria-labelledby="prayer-journey" data-prayer-reveal>
        <div className={styles.journeyInner}>
          <p className={styles.sectionLabel}>기도가 삶으로 이어지도록</p>
          <h2 id="prayer-journey">은혜를 의지하고,<br className={styles.mobileBreak} />{" "} 사랑으로 응답합니다.</h2>
          <ol className={styles.flow}>
            <li><span className={styles.dot} aria-hidden="true" /><span className={styles.flowLabel}>먼저 주신 은혜</span><p>예수님을 의지하여<br />{" "}하나님께 나아갑니다.</p></li>
            <li><span className={styles.dot} aria-hidden="true" /><span className={styles.flowLabel}>숨김없는 기도</span><p>감사와 두려움, 잘못까지<br />{" "}정직하게 아룁니다.</p></li>
            <li><span className={styles.dot} aria-hidden="true" /><span className={styles.flowLabel}>사랑으로 걷는 삶</span><p>말씀에 귀 기울이며<br />{" "}오늘의 작은 순종을 구합니다.</p></li>
          </ol>
          <p className={styles.journeyNote}>성령께 우리의 마음을 새롭게 해 달라고 구해 보세요.<br />{" "}느낌이 바로 달라지지 않는 날에도, 말씀을 의지하며 하나님과 동행할 수 있습니다.</p>
        </div>
      </section>

      <section id="prayer-moment" className={styles.moment} aria-labelledby="prayer-moment-title" data-prayer-reveal>
        <div className={styles.momentInner}>
          <p className={styles.sectionLabel}>이제, 나의 말로</p>
          <h2 id="prayer-moment-title">“주님, 지금 제 마음은…”</h2>
          <p className={styles.momentLead}>이 한마디로 시작해 보세요.<br />{" "}마음에 있는 이야기를 하나님께 천천히 이어가 보세요.</p>
          <details className={styles.example}>
            <summary>말이 떠오르지 않을 때</summary>
            <p>주님, 제 마음이 복잡해서 무슨 말을 해야 할지 모르겠습니다. 저를 아시는 주님께 이 마음을 드립니다. 예수님의 은혜를 의지하게 하시고, 말씀 앞에서 제 마음을 새롭게 해 주세요. 오늘 제가 사랑으로 응답할 길을 보여 주세요. 예수님의 이름으로 기도합니다. 아멘.</p>
            <p className={styles.exampleNote}>이 기도문에서 시작해, 자신의 이야기로 이어가셔도 좋습니다.</p>
          </details>
          <div className={styles.noteArea}>
            <label htmlFor="prayer-note">한 문장 적어도 좋습니다 <span>(선택)</span></label>
            <textarea ref={noteField} id="prayer-note" rows={3} value={note} onChange={(event) => { setNote(event.target.value); setCopyStatus(""); }} placeholder="오늘 하나님께 드리고 싶은 마음…" aria-describedby="prayer-note-help" />
            <div className={styles.noteFooter}>
              <p id="prayer-note-help">적은 내용은 전송·저장되지 않습니다.<br />{" "}남겨 두고 싶다면 떠나기 전에 복사해 주세요.</p>
              <button type="button" onClick={copyPrayer} disabled={!note.trim()}>내 기도 복사</button>
            </div>
            <p className={styles.copyStatus} role="status" aria-live="polite">{copyStatus}</p>
          </div>
          <div className={styles.today}>
            <span>기도 후, 오늘의 한 걸음</span>
            <p>기도 중에 떠오른 한 사람에게<br />{" "}<strong>따뜻한 안부를 전해 보면 어떨까요?</strong></p>
          </div>
        </div>
      </section>

      <section className={styles.more} aria-label="기도에 대해 더 읽기">
        <p className={styles.sectionLabel}>조금 더 머물고 싶다면</p>
        <details className={styles.original}>
          <summary><span>교회의 기도에 대한 고백 읽기<small>우리가 기도하는 방식 · 원문</small></span></summary>
          <WayIntroduction article={article} />
        </details>
        <details id="prayer-study" className={styles.study} open={studyOpen} onToggle={(event) => setStudyOpen(event.currentTarget.open)}>
          <summary><span>기도 성경공부 이어가기<small>마태복음 6:5–13 · 임마누엘의 길 03과</small></span></summary>
          <div className={styles.studyContent}>{children}</div>
        </details>
      </section>
      <div className={styles.navigation}>{navigation}</div>
    </article>
  );
}
