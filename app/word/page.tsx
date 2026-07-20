import type { Metadata } from "next";
import Link from "next/link";
import { Layout } from "@/components/Layout";
import { wayArticles } from "@/data/immanuel";
import { DailyWordArchive } from "@/app/components/DailyWordArchive";

export const metadata: Metadata = {
  title: "오늘의 말씀 | 임마누엘교회",
  description: "하루를 말씀으로 시작하고 삶의 방향을 하나님 앞에서 다시 세웁니다."
};

const article = wayArticles.find((item) => item.slug === "belief");

export default function DailyWordPage() {
  return <Layout><div className="way-detail-page daily-word-page">
    <section className="article-hero" style={{ backgroundImage: `url(${article?.image.url})` }}>
      <div className="article-hero-overlay" /><div className="article-hero-content">
        <Link href="/services" className="back-link">교회 서비스</Link><h1>오늘의 말씀</h1>
        <p>하루를 말씀으로 시작하고 삶의 방향을 하나님 앞에서 다시 세웁니다.</p><span>WORD FOR TODAY</span>
      </div>
    </section>
    <DailyWordArchive />
  </div></Layout>;
}
