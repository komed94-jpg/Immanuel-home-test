import type { Metadata } from "next";
import Link from "next/link";
import { Layout } from "@/components/Layout";
import { wayArticles } from "@/data/immanuel";

export const metadata: Metadata = {
  title: "예배 안내 | 임마누엘교회",
  description: "임마누엘교회 주일예배는 주일 오전 11시에 드립니다."
};

const worshipArticle = wayArticles.find((article) => article.slug === "worship");

export default function WorshipInfoPage() {
  return (
    <Layout>
      <section
        className="article-hero"
        style={{ backgroundImage: `url(${worshipArticle?.image.url})` }}
      >
        <div className="article-hero-overlay" />
        <div className="article-hero-content">
          <Link href="/services" className="back-link">
            교회 서비스
          </Link>
          <h1>예배 안내</h1>
          <p>가장 귀한 것을 가장 귀하신 하나님께 드립니다.</p>
          <span>주일예배 · 오전 11시</span>
          <div className="hero-actions">
            <Link href="/way/worship" className="primary-link">
              우리가 예배하는 이유
            </Link>
          </div>
        </div>
      </section>

      <section className="services-section" aria-label="주일예배 안내">
        <div className="services-grid">
          <div className="service-tile">
            <small>01 · 예배</small>
            <h2>주일예배</h2>
            <p>임마누엘 공동체가 함께 하나님께 나아갑니다.</p>
            <em>임마누엘교회는 예배를 공동체의 중심에 둡니다.</em>
          </div>

          <div className="service-tile">
            <small>02 · 시간</small>
            <h2>오전 11시</h2>
            <p>주일 오전 11시에 예배합니다.</p>
            <em>가장 먼저 구별한 시간을 하나님께 올려드립니다.</em>
          </div>

          <div className="service-tile">
            <small>03 · 고백</small>
            <h2>가장 귀하신 하나님께</h2>
            <p>마음과 시간과 삶을 올려드립니다.</p>
            <em>예배는 의무가 아니라 하나님을 사랑하는 마음의 표현입니다.</em>
          </div>
        </div>
      </section>
    </Layout>
  );
}
