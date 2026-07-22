import type { Metadata } from "next";
import Link from "next/link";
import { Layout } from "@/components/Layout";
import { immanuelBasicCourse } from "@/lib/bible-study";
import { StudyWorkbook } from "./StudyWorkbook";

export const metadata: Metadata = {
  title: "그럼에도 불구하고, 여전히 하나님은 나를 사랑하신다 | 임마누엘교회",
  description: "행위가 아니라 사랑 위에 서는 법 · 임마누엘의 길 01 웹 성경공부",
  robots: { index: false, follow: false }
};

export default async function ImmanuelBasicStudyPage() {
  return <Layout>
    <section className="web-study-hero">
      <div>
        <Link href="/bible-study" className="back-link">성경공부</Link>
        <p className="section-kicker">IMMANUEL WAY · BOOK 01</p>
        <h1>{immanuelBasicCourse.title}</h1>
        <p>{immanuelBasicCourse.subtitle}<br />{immanuelBasicCourse.overview}</p>
      </div>
    </section>
    <StudyWorkbook course={immanuelBasicCourse} />
    <section className="study-section" aria-label="다음 성경공부">
      <div className="study-section-heading"><p className="section-kicker">CONTINUE THE JOURNEY</p><h2>2권으로 계속 공부하기</h2><p>행위가 아니라 사랑 위에 서는 법을 배웠다면, 이제 아버지의 시선으로 나와 과거를 다시 보는 여정으로 이어집니다.</p></div>
      <div className="study-material-grid"><article className="study-material-card"><small>임마누엘의 길 02</small><h3>그럼에도 불구하고, 여전히 하나님은 나를 사랑하신다 Ⅱ</h3><p>부끄러움이 아니라 아버지의 시선으로 나를 보는 법</p><Link href="/bible-study/immanuel-basic-2" className="text-action">2권 웹 교재 열기</Link></article></div>
    </section>
  </Layout>;
}
