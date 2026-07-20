import type { Metadata } from "next";
import Link from "next/link";
import { Layout } from "@/components/Layout";
import { wayArticles } from "@/data/immanuel";
import { SermonArchive } from "@/app/components/SermonArchive";

export const metadata: Metadata = { title: "설교 영상 아카이브 | 임마누엘교회" };
const article = wayArticles.find((item) => item.slug === "belief");

export default function SermonsPage() {
  return <Layout><div className="way-detail-page">
    <section className="article-hero" style={{ backgroundImage: `url(${article?.image.url})` }}>
      <div className="article-hero-overlay" /><div className="article-hero-content">
        <Link href="/services" className="back-link">교회 서비스</Link><h1>설교 영상 아카이브</h1>
        <p>지나간 말씀을 다시 붙들고 삶으로 듣는 자리</p><span>RECORDED GRACE</span>
      </div>
    </section>
    <SermonArchive />
  </div></Layout>;
}
