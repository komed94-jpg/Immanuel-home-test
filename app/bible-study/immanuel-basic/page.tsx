import type { Metadata } from "next";
import Link from "next/link";
import { Layout } from "@/components/Layout";
import { immanuelBasicCourse } from "@/lib/bible-study";
import { StudyWorkbook } from "./StudyWorkbook";

export const metadata: Metadata = { title: "임마누엘 베이직 | 임마누엘교회", robots: { index: false, follow: false } };

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
