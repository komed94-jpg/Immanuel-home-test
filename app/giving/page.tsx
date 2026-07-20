import type { Metadata } from "next";
import Link from "next/link";
import { Layout } from "@/components/Layout";
import { wayArticles } from "@/data/immanuel";
import { GivingInformation } from "@/app/components/GivingInformation";

export const metadata: Metadata = { title: "온라인 헌금 안내 | 임마누엘교회" };
const article = wayArticles.find((item) => item.slug === "giving");

export default function GivingPage() {
  return <Layout><div className="way-detail-page">
    <section className="article-hero" style={{ backgroundImage: `url(${article?.image.url})` }}>
      <div className="article-hero-overlay" /><div className="article-hero-content">
        <Link href="/services" className="back-link">교회 서비스</Link><h1>온라인 헌금 안내</h1>
        <p>{article?.quote}</p><span>감사 · 신뢰 · 예배</span>
      </div>
    </section>
    <section className="article-body" aria-label="헌금 안내">
      {article?.content.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
    </section>
    <GivingInformation />
  </div></Layout>;
}
