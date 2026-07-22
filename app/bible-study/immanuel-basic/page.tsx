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
  </Layout>;
}
