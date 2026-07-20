import type { Metadata } from "next";
import Link from "next/link";
import { Layout } from "@/components/Layout";
import { BibleConferenceRequestForm } from "@/app/components/BibleConferenceRequestForm";
import { wayArticles } from "@/data/immanuel";

export const metadata: Metadata = { title: "사경회 요청 | 임마누엘교회" };
const article = wayArticles.find((item) => item.slug === "belief");

export default function BibleConferencePage() {
  return <Layout>
    <section className="article-hero request-hero" style={{ backgroundImage: `url(${article?.image.url})` }}>
      <div className="article-hero-overlay" /><div className="article-hero-content">
        <Link href="/services" className="back-link">교회 서비스</Link><h1>사경회 요청</h1>
        <p>{article?.quote}</p><span>말씀 · 일정 협의</span>
      </div>
    </section>
    <section className="request-section"><div className="request-intro">
      <p className="section-kicker">BIBLE CONFERENCE</p><h2>말씀 앞에 함께 서겠습니다.</h2>
      <p>{article?.content[0]}</p>
    </div><BibleConferenceRequestForm /></section>
  </Layout>;
}
