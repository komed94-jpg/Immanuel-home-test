import type { Metadata } from "next";
import Link from "next/link";
import { Layout } from "@/components/Layout";
import { wayArticles } from "@/data/immanuel";
import { DiscipleshipPrograms } from "@/app/components/DiscipleshipPrograms";
import { getCurrentMember } from "@/lib/member-auth";

export const metadata: Metadata = {
  title: "사람이 어떻게 변화되는가 I | 임마누엘교회",
  description: "임마누엘 운동 핵심 문서"
};

const article = wayArticles.find((item) => item.slug === "growth");
const transformationFlow = ["인식", "직면", "회개", "치유", "재해석", "훈련", "관계 변화", "사명 회복"];

export default async function DiscipleshipPage() {
  const member = await getCurrentMember();
  const activeMember = member?.membershipStatus === "active";
  return <Layout><div className="way-detail-page">
    <section className="article-hero" style={{ backgroundImage: `url(${article?.image.url})` }}>
      <div className="article-hero-overlay" /><div className="article-hero-content">
        <Link href="/services" className="back-link">교회 서비스</Link>
        <h1>사람이 어떻게 변화되는가 I</h1><p>임마누엘 운동 핵심 문서</p>
        <span>제자훈련 프로그램</span>
      </div>
    </section>
    <section className="article-body" aria-label="제자훈련 프로그램">
      {article?.content.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
    </section>
    <section className="discipleship-flow" aria-labelledby="discipleship-flow-title">
      <p className="section-kicker">TRANSFORMATION JOURNEY</p>
      <h2 id="discipleship-flow-title">변화는 삶 전체를 새롭게 합니다.</h2>
      <ol>{transformationFlow.map((step, index) => <li key={step}><small>{String(index + 1).padStart(2, "0")}</small><span>{step}</span></li>)}</ol>
    </section>
    <section className="discipleship-study-bridge" aria-labelledby="discipleship-study-title">
      <div>
        <p className="section-kicker">STUDY TOOLS</p>
        <h2 id="discipleship-study-title">훈련의 말씀은 성경공부에서 이어집니다.</h2>
        <p>임마누엘의 길에서 교회의 신앙고백을 성경으로 확인하고, 「분별에서 사랑으로」에서 잘못된 잣대로부터 자유로워지는 분별을 배우며, 1권과 2권에서 사랑과 회복의 여정을 더 깊이 배웁니다.</p>
      </div>
      <div className="discipleship-study-actions">
        <Link className="primary-link" href="/disc">DISC 관계 교육</Link>
        <Link className="primary-link" href="/bible-study/immanuel-way#study-content">임마누엘의 길 11과</Link>
        <Link className="primary-link" href="/bible-study/discernment-to-love#study-content">분별에서 사랑으로</Link>
        <Link className="primary-link" href="/bible-study/immanuel-basic#study-content">1권 성경공부 시작</Link>
        <Link className="primary-link" href="/bible-study/immanuel-basic-2#study-content">2권 성경공부 시작</Link>
        <Link className="text-action" href="/bible-study">전체 교재 보기</Link>
        <Link className="text-action" href="/empathy-bible">공감성경</Link>
        <Link className="text-action" href="/shepherd-bible">목자성경</Link>
      </div>
    </section>
    <DiscipleshipPrograms canApply={activeMember} loggedIn={Boolean(member)} />
  </div></Layout>;
}
