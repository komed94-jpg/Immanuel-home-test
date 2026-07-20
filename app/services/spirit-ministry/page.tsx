import type { Metadata } from "next";
import Link from "next/link";
import { Layout } from "@/components/Layout";
import { SpiritMinistryRequestForm } from "@/app/components/SpiritMinistryRequestForm";
import { wayArticles } from "@/data/immanuel";

export const metadata: Metadata = { title: "성령사역 요청 | 임마누엘교회" };
const article = wayArticles.find((item) => item.slug === "spirit");

export default function SpiritMinistryPage() {
  return <Layout>
    <section className="article-hero request-hero" style={{ backgroundImage: `url(${article?.image.url})` }}>
      <div className="article-hero-overlay" /><div className="article-hero-content">
        <Link href="/services" className="back-link">교회 서비스</Link><h1>성령사역 요청</h1>
        <p>{article?.quote}</p><span>임재 · 회복 · 비공개 접수</span>
      </div>
    </section>
    <section className="request-section"><div className="request-intro">
      <p className="section-kicker">HOLY SPIRIT MINISTRY</p><h2>함께 기도하겠습니다.</h2>
      <p>{article?.content[0]}</p>
    </div><SpiritMinistryRequestForm /></section>
  </Layout>;
}
