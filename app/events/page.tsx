import type { Metadata } from "next";
import Link from "next/link";
import { Layout } from "@/components/Layout";
import { wayArticles } from "@/data/immanuel";
import { EventCalendar } from "@/app/components/EventCalendar";
import { getCurrentMember } from "@/lib/member-auth";

export const metadata: Metadata = { title: "행사 및 캘린더 | 임마누엘교회" };
const article = wayArticles.find((item) => item.slug === "community");

export default async function EventsPage() {
  const member = await getCurrentMember();
  return <Layout><div className="way-detail-page">
    <section className="article-hero" style={{ backgroundImage: `url(${article?.image.url})` }}>
      <div className="article-hero-overlay" /><div className="article-hero-content">
        <Link href="/services" className="back-link">교회 서비스</Link><h1>행사 및 캘린더</h1>
        <p>공동체의 예배와 모임을 함께 확인하는 자리</p><span>WORSHIP · COMMUNITY · TRAINING</span>
      </div>
    </section>
    <EventCalendar loggedIn={!!member} />
  </div></Layout>;
}
