import type { Metadata } from "next";
import Link from "next/link";
import { Layout } from "@/components/Layout";
import { DiscernmentWorkbook } from "./DiscernmentWorkbook";

export const metadata: Metadata = {
  title: "분별에서 사랑으로 | 임마누엘교회",
  description: "분별은 정죄가 아니라 자유를 위한 것이다 · 영적 분별 성경공부",
  robots: { index: false, follow: false }
};

export default async function DiscernmentToLovePage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const { page } = await searchParams;
  return <Layout>
    <section className="web-study-hero">
      <div>
        <Link href="/bible-study" className="back-link">성경공부</Link>
        <p className="section-kicker">DISCERNMENT TO LOVE</p>
        <h1>분별에서 사랑으로</h1>
        <p>영적 분별은 사람을 정죄하는 기술이 아니라, 잘못된 잣대에서 자유로워져 다시 사랑하기 위한 여정입니다.</p>
      </div>
    </section>
    <DiscernmentWorkbook key={page ?? "opening"} startPage={page} />
    <section className="study-section" aria-label="관련 성경공부">
      <div className="study-section-heading"><p className="section-kicker">CONTINUE THE JOURNEY</p><h2>변화와 사랑의 여정으로 이어갑니다</h2><p>분별의 목적은 더 정교한 판정이 아니라 자유와 사랑입니다. 제자훈련 과정에서 이 흐름을 더 깊이 살펴보세요.</p></div>
      <div className="study-material-grid"><article className="study-material-card"><small>제자훈련</small><h3>사람이 어떻게 변화되는가</h3><p>말씀과 성령 안에서 삶 전체가 새로워지는 변화의 흐름을 배웁니다.</p><Link href="/discipleship" className="text-action">제자훈련 보기</Link></article></div>
    </section>
  </Layout>;
}
