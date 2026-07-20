import type { Metadata } from "next";
import Link from "next/link";
import { Layout } from "@/components/Layout";
import { CounselingRequestForm } from "@/app/components/CounselingRequestForm";
import { wayArticles } from "@/data/immanuel";

export const metadata: Metadata = {
  title: "상담 요청 | 임마누엘교회",
  description: "혼자 짊어지지 않고 함께 걸어가는 목회 상담 요청"
};

const communityArticle = wayArticles.find((article) => article.slug === "community");

export default function CounselingRequestPage() {
  return (
    <Layout>
      <section
        className="article-hero request-hero"
        style={{ backgroundImage: `url(${communityArticle?.image.url})` }}
      >
        <div className="article-hero-overlay" />
        <div className="article-hero-content">
          <Link href="/services" className="back-link">교회 서비스</Link>
          <h1>상담 요청</h1>
          <p>우리는 혼자 신앙생활하지 않습니다.</p>
          <span>목회적 돌봄 · 비공개 접수</span>
        </div>
      </section>

      <section className="request-section">
        <div className="request-intro">
          <p className="section-kicker">PASTORAL CARE</p>
          <h2>함께 걸어가겠습니다.</h2>
          <p>
            함께 웃고, 함께 울고, 함께 기도하며, 함께 짐을 나눕니다.
            지친 자리에서 혼자 머물지 않도록 상담 요청을 남겨 주세요.
          </p>
        </div>
        <CounselingRequestForm />
      </section>
    </Layout>
  );
}
