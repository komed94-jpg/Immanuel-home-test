import type { Metadata } from "next";
import Link from "next/link";
import { Layout } from "@/components/Layout";
import { immanuelWayCourse } from "@/lib/bible-study";
import { StudyWorkbook } from "../immanuel-basic/StudyWorkbook";

export const metadata: Metadata = {
  title: "임마누엘의 길 11과 웹 성경공부 | 임마누엘교회",
  description: "성경으로 배우고 삶으로 걷는 임마누엘의 길 11과 핵심과정",
  robots: { index: false, follow: false }
};

export default async function ImmanuelWayStudyPage({ searchParams }: { searchParams: Promise<{ lesson?: string }> }) {
  const { lesson } = await searchParams;
  const startPageKey = lesson && immanuelWayCourse.pages.some((page) => page.key === `${lesson}-scripture`) ? `${lesson}-scripture` : undefined;
  return <Layout>
    <section className="web-study-hero web-study-hero-way">
      <div>
        <Link href="/way" className="back-link">임마누엘의 길</Link>
        <p className="section-kicker">IMMANUEL WAY · 11 LESSONS</p>
        <h1>{immanuelWayCourse.title}</h1>
        <p>{immanuelWayCourse.subtitle}<br />{immanuelWayCourse.overview}</p>
      </div>
    </section>
    <section className="web-study-bible-principle" aria-label="성경공부 원칙">
      <strong>성경이 먼저입니다.</strong>
      <p>각 과는 설명보다 핵심 본문을 먼저 읽고, 참조 말씀으로 확인한 뒤 해설·분별·실천·기도로 이어집니다.</p>
    </section>
    <StudyWorkbook course={immanuelWayCourse} startPageKey={startPageKey} />
  </Layout>;
}
