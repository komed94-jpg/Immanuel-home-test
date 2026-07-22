import type { Metadata } from "next";
import Link from "next/link";
import { Layout } from "@/components/Layout";
import { immanuelBasicBookTwoCourse } from "@/lib/bible-study";
import { StudyWorkbook } from "../immanuel-basic/StudyWorkbook";

export const metadata: Metadata = {
  title: "그럼에도 불구하고, 여전히 하나님은 나를 사랑하신다 Ⅱ | 임마누엘교회",
  description: "부끄러움이 아니라 아버지의 시선으로 나를 보는 법 · 임마누엘의 길 02 웹 성경공부",
  robots: { index: false, follow: false }
};

export default function ImmanuelBasicBookTwoStudyPage() {
  return <Layout>
    <section className="web-study-hero">
      <div>
        <Link href="/bible-study" className="back-link">성경공부</Link>
        <p className="section-kicker">IMMANUEL WAY · BOOK 02</p>
        <h1>{immanuelBasicBookTwoCourse.title}</h1>
        <p>{immanuelBasicBookTwoCourse.subtitle}<br />{immanuelBasicBookTwoCourse.overview}</p>
      </div>
    </section>
    <StudyWorkbook course={immanuelBasicBookTwoCourse} />
    <section className="study-section" aria-label="이전 성경공부">
      <div className="study-section-heading"><p className="section-kicker">THE FIRST JOURNEY</p><h2>1권과 함께 보기</h2><p>하나님이 어떤 분이신지, 행위가 아니라 사랑 위에 서는 복음의 기초부터 다시 살펴볼 수 있습니다.</p></div>
      <div className="study-material-grid"><article className="study-material-card"><small>임마누엘의 길 01</small><h3>그럼에도 불구하고, 여전히 하나님은 나를 사랑하신다</h3><p>행위가 아니라 사랑 위에 서는 법</p><Link href="/bible-study/immanuel-basic" className="text-action">1권 웹 교재 열기</Link></article></div>
    </section>
  </Layout>;
}
