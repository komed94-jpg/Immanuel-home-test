import type { Metadata } from "next";
import Link from "next/link";
import { Layout } from "@/components/Layout";

export const metadata: Metadata = {
  title: "성경공부 | 임마누엘교회",
  description: "임마누엘교회의 성경공부 교재와 말씀 도구"
};

const materials = [
  { category: "새가족", title: "임마누엘 베이직", description: "처음 교회에 온 분이 복음과 교회 생활의 기초를 편안하게 알아 가는 성경공부입니다.", status: "교재 준비 중" },
  { category: "기초", title: "임마누엘의 길", description: "하나님의 사랑에서 시작해 회개·치유·훈련·사명으로 이어지는 변화의 여정을 함께 배웁니다.", href: "/way", status: "읽기" },
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
      <div className="study-section-heading"><p className="section-kicker">STUDY MATERIALS</p><h2 id="study-materials-title">성경공부 교재</h2><p>교재의 원본은 이곳에 모으고, 성장트랙과 제자훈련에서는 각 단계에 맞는 교재로 연결합니다.</p></div>
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
