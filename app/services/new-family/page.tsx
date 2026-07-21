import type { Metadata } from "next";
import Link from "next/link";
import { Layout } from "@/components/Layout";
import { NewFamilyRequestForm } from "@/app/components/NewFamilyRequestForm";
import { wayArticles } from "@/data/immanuel";
import { getCurrentMember } from "@/lib/member-auth";

export const metadata: Metadata = { title: "새가족 등록 | 임마누엘교회" };
const article = wayArticles.find((item) => item.slug === "community");

export default async function NewFamilyPage() {
  const member = await getCurrentMember();
  return <Layout>
    <section className="article-hero request-hero" style={{ backgroundImage: `url(${article?.image.url})` }}>
      <div className="article-hero-overlay" /><div className="article-hero-content">
        <Link href="/services" className="back-link">교회 서비스</Link><h1>새가족 등록</h1>
        <p>우리는 혼자 신앙생활하지 않습니다.</p><span>환대 · 공동체 연결</span>
      </div>
    </section>
    <section className="request-section"><div className="request-intro">
      <p className="section-kicker">NEW FAMILY</p><h2>함께 걸어가겠습니다.</h2>
      <p>함께 웃고, 함께 울고, 함께 기도하며, 함께 짐을 나눕니다.</p>
    </div><NewFamilyRequestForm initialMember={member ? { name: member.name, birthDate: member.birthDate, email: member.email, phone: member.phone } : null} /></section>
  </Layout>;
}
