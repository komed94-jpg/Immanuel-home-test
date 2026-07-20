import type { Metadata } from "next";
import Link from "next/link";
import { Layout } from "@/components/Layout";
import { PrayerRequestForm } from "@/app/components/PrayerRequestForm";
import { wayArticles } from "@/data/immanuel";

export const metadata: Metadata = {
  title: "기도 요청 | 임마누엘교회",
  description: "숨김없이 하나님께 나아가는 정직한 기도 요청"
};

const prayerArticle = wayArticles.find((article) => article.slug === "prayer");

export default function PrayerRequestPage() {
  return (
    <Layout>
      <section
        className="article-hero request-hero"
        style={{ backgroundImage: `url(${prayerArticle?.image.url})` }}
      >
        <div className="article-hero-overlay" />
        <div className="article-hero-content">
          <Link href="/services" className="back-link">
            교회 서비스
          </Link>
          <h1>기도 요청</h1>
          <p>숨김없이 하나님께 나아가는 Honest Prayer</p>
          <span>정직한 기도 · 비공개 접수</span>
        </div>
      </section>

      <section className="request-section">
        <div className="request-intro">
          <p className="section-kicker">HONEST PRAYER</p>
          <h2>함께 기도하겠습니다.</h2>
          <p>
            기도는 하나님과의 가장 깊고도 사적인 만남입니다. 혼자 짊어지지
            않고, 하나님 앞에 진실하게 가지고 나오도록 공동체가 함께
            기도하겠습니다.
          </p>
        </div>
        <PrayerRequestForm />
      </section>
    </Layout>
  );
}
