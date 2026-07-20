import type { Metadata } from "next";
import Link from "next/link";
import { Layout } from "@/components/Layout";
import { CommunityRequestForm } from "@/app/components/CommunityRequestForm";
import { wayArticles } from "@/data/immanuel";

export const metadata: Metadata = {
  title: "공동체 연결 | 임마누엘교회",
  description: "목장과 소그룹 공동체 연결 요청"
};

const article = wayArticles.find((item) => item.slug === "community");

export default function CommunityRequestPage() {
  return (
    <Layout>
      <section className="article-hero request-hero" style={{ backgroundImage: `url(${article?.image.url})` }}>
        <div className="article-hero-overlay" />
        <div className="article-hero-content">
          <Link href="/services" className="back-link">교회 서비스</Link>
          <h1>공동체 연결</h1>
          <p>우리는 혼자 신앙생활하지 않습니다.</p>
          <span>목장 · 소그룹 · 목회적 연결</span>
        </div>
      </section>

      <section className="request-section">
        <div className="request-intro">
          <p className="section-kicker">COMMUNITY CONNECTION</p>
          <h2>함께 자라는 공동체로 연결합니다.</h2>
          <p>큰 예배 안에서 은혜를 받고, 작은 공동체 안에서 삶을 나눕니다. 거주 지역과 가능한 시간을 남겨 주시면 적합한 목장과 소그룹을 안내하겠습니다.</p>
        </div>
        <CommunityRequestForm />
      </section>
    </Layout>
  );
}
