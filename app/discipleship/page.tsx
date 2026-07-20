import type { Metadata } from "next";
import Link from "next/link";
import { Layout } from "@/components/Layout";
import { wayArticles } from "@/data/immanuel";
import { DiscipleshipRequestForm } from "@/app/components/DiscipleshipRequestForm";
import { DiscipleshipPrograms } from "@/app/components/DiscipleshipPrograms";

export const metadata: Metadata = {
  title: "사람이 어떻게 변화되는가 I | 임마누엘교회",
  description: "임마누엘 운동 핵심 문서"
};

const article = wayArticles.find((item) => item.slug === "growth");
const transformationFlow = ["인식", "직면", "회개", "치유", "재해석", "훈련", "관계 변화", "사명 회복"];

export default function DiscipleshipPage() {
  return <Layout><div className="way-detail-page">
    <section className="article-hero" style={{ backgroundImage: `url(${article?.image.url})` }}>
      <div className="article-hero-overlay" /><div className="article-hero-content">
        <Link href="/services" className="back-link">교회 서비스</Link>
        <h1>사람이 어떻게 변화되는가 I</h1><p>임마누엘 운동 핵심 문서</p>
        <span>제자훈련 프로그램</span>
      </div>
    </section>
    <section className="article-body" aria-label="제자훈련 프로그램">
      {article?.content.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
    </section>
    <section className="discipleship-flow" aria-labelledby="discipleship-flow-title">
      <p className="section-kicker">TRANSFORMATION JOURNEY</p>
      <h2 id="discipleship-flow-title">변화는 삶 전체를 새롭게 합니다.</h2>
      <ol>{transformationFlow.map((step, index) => <li key={step}><small>{String(index + 1).padStart(2, "0")}</small><span>{step}</span></li>)}</ol>
    </section>
    <DiscipleshipPrograms />
    <section className="discipleship-apply">
      <div className="request-intro"><p className="section-kicker">DISCIPLESHIP APPLICATION</p><h2>제자훈련 신청</h2><p>「사람이 어떻게 변화되는가 I」 훈련 참여를 신청합니다.</p></div>
      <DiscipleshipRequestForm />
    </section>
  </div></Layout>;
}
