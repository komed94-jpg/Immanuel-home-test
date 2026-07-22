import type { Metadata } from "next";
import Link from "next/link";
import { Layout } from "@/components/Layout";

export const metadata: Metadata = {
  title: "성경공부 | 임마누엘교회",
  description: "임마누엘교회의 성경공부 교재와 말씀 도구"
};

const materials = [
  { category: "핵심과정 · 11과", title: "임마누엘의 길", description: "11개 신앙고백을 핵심 본문과 참조 말씀으로 확인하고, 본문 관찰·해설·분별·실천·기도로 이어 가는 웹 성경공부입니다.", href: "/bible-study/immanuel-way", status: "11과 성경공부 시작" },
  { category: "제자훈련 · 1권", title: "그럼에도 불구하고, 여전히 하나님은 나를 사랑하신다", description: "행위가 아니라 사랑 위에 서는 법. 8과와 부록을 웹에서 읽고, 로그인하면 답변·공부 날짜·진도·수료를 기록할 수 있습니다.", href: "/bible-study/immanuel-basic", status: "1권 웹 교재 열기" },
  { category: "제자훈련 · 2권", title: "그럼에도 불구하고, 여전히 하나님은 나를 사랑하신다 Ⅱ", description: "부끄러움이 아니라 아버지의 시선으로 나를 보는 법. 8과·26쪽의 웹 교재와 인도자 가이드를 함께 제공합니다.", href: "/bible-study/immanuel-basic-2", status: "2권 웹 교재 열기" },
  { category: "성장", title: "사람이 어떻게 변화되는가", description: "말씀과 성령 안에서 삶 전체가 새로워지는 변화의 흐름을 배우는 훈련 자료입니다.", href: "/discipleship", status: "훈련 보기" }
];

export default function BibleStudyPage() {
  return <Layout>
    <section className="study-hero">
      <div>
        <p className="section-kicker">BIBLE STUDY</p>
        <h1>말씀을 배우고,<br />삶으로 살아냅니다.</h1>
        <p>성경공부 교재와 개인 묵상, 목장 나눔 도구를 한 흐름 안에서 만날 수 있습니다.</p>
      </div>
    </section>
    <section className="study-section" aria-labelledby="study-materials-title">
      <div className="study-section-heading"><p className="section-kicker">STUDY MATERIALS</p><h2 id="study-materials-title">성경공부 교재</h2><p>교재는 웹에서 누구나 읽을 수 있습니다. 로그인한 교인은 답변과 공부 날짜를 남기고, 과정을 모두 마치면 수료 관리로 이어집니다.</p></div>
      <div className="study-material-grid">
        {materials.map((item) => <article className="study-material-card" key={item.title}>
          <small>{item.category}</small><h3>{item.title}</h3><p>{item.description}</p>
          {item.href ? <Link href={item.href} className="text-action">{item.status}</Link> : <span className="study-coming">{item.status}</span>}
        </article>)}
      </div>
    </section>
    <section className="study-tools" aria-labelledby="study-tools-title">
      <div className="study-section-heading"><p className="section-kicker">BIBLE TOOLS</p><h2 id="study-tools-title">말씀을 내 삶과 공동체에 연결하는 두 도구</h2></div>
      <div className="study-tool-grid">
        <article><span>01</span><h3>공감성경</h3><p>개인의 말씀 읽기가 오늘의 마음과 삶으로 이어지도록 돕는 묵상 도구입니다.</p><Link href="/empathy-bible" className="primary-link">공감성경 열기</Link></article>
        <article><span>02</span><h3>목자성경</h3><p>목자와 리더가 본문을 준비하고, 목장 안에서 말씀을 함께 나누도록 돕는 인도 도구입니다.</p><Link href="/shepherd-bible" className="primary-link">목자성경 열기</Link></article>
      </div>
    </section>
  </Layout>;
}
