import type { Metadata } from "next";
import Link from "next/link";
import { Layout } from "@/components/Layout";
import content from "@/data/high-priest-lecture.json";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "대제사장의 복장과 영적 의미 | 임마누엘교회",
  description: "성경 본문을 대조한 대제사장 복장 강의 슬라이드 14장과 강의안. 출애굽기, 레위기, 히브리서를 함께 읽습니다."
};

export default function HighPriestLecturePage() {
  return <Layout><article className={styles.lecture}>
    <Link className="bible-back" href="/bible-world">← 영상으로 보는 성경 세계</Link>
    <p className="section-kicker">성경공부 강의 자료</p>
    <h1>대제사장의 복장과 영적 의미</h1>
    <p className={styles.intro}>옷에 새겨진 이름과 거룩함을 살펴보고, 그리스도의 중보와 단번의 제사로 이어지는 말씀을 함께 읽습니다.</p>
    <p className={styles.status}>현재 제공: 강의 슬라이드 14장 · 강사용 설명 · 본문과 참고 자료<br />영화 장면이 포함된 영상은 아직 게시되지 않았습니다.</p>
    <nav className={styles.downloads} aria-label="강의 자료 다운로드">
      <a href="/downloads/high-priest/High_Priest_Lecture_v1.pptx" download>강의 슬라이드 받기 (PPTX)</a>
      <a href="/downloads/high-priest/High_Priest_Study_Guide.md" download>강의안·출처 받기 (MD)</a>
    </nav>
    <p className={styles.caveat}>이미지는 성경 본문에 근거한 추정 복원입니다. 재단·색조·보석의 현대 광물명 등은 확정되지 않았습니다. 본문의 설명, 기독교적 해석, 오늘의 적용을 구분했습니다.</p>
    <h2>슬라이드와 강사용 설명</h2>
    <p>제목을 누르면 슬라이드와 설명이 펼쳐집니다. PPTX의 발표자 노트에도 설명과 출처가 들어 있습니다.</p>
    <div className={styles.slides}>{content.map((slide, index) => <details key={slide.title} open={index === 0}>
      <summary>{index + 1}. {slide.title}</summary>
      {/* Static lecture slide: preserve its exact 16:9 composition. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={`/downloads/high-priest/slide-${String(index + 1).padStart(2, "0")}.jpg`} width={1280} height={720} alt={`${index + 1}번 슬라이드: ${slide.title}`} loading={index === 0 ? "eager" : "lazy"} />
      <div className={styles.notes}><p>{slide.notes}</p><p className={styles.reference}>근거: {slide.ref}</p></div>
    </details>)}</div>
    <h2>함께 읽을 본문</h2>
    <ul className={styles.sources}>
      <li><a href="https://biblehub.com/kjv/exodus/28.htm">출애굽기 28장</a> · <a href="https://biblehub.com/kjv/exodus/39.htm">39장</a> — 복장의 규정과 제작</li>
      <li><a href="https://biblehub.com/kjv/leviticus/16.htm">레위기 16장</a> — 대속죄일의 세마포 옷과 속죄 의식</li>
      <li><a href="https://biblehub.com/kjv/hebrews/7.htm">히브리서 7장</a> · <a href="https://biblehub.com/kjv/hebrews/9.htm">9장</a> — 그리스도의 중보와 단번의 제사</li>
      <li><a href="https://www.mishnah.org/he/learn/yoma/7/5/">미슈나 요마 7:5</a> — 여덟 가지 복장을 분류한 후대 문헌</li>
      <li><a href="https://www.posenlibrary.com/entry/high-priests-garments">Posen Library</a> — 복장의 문헌적 복원</li>
      <li><a href="https://www.jewishbible.org/articles/gems-in-the-high-priests-breastplate/">Susan V. Meschel, 보석 명칭 연구 (2018)</a> — 고대 명칭의 현대 광물 식별 문제</li>
    </ul>
  </article></Layout>;
}
