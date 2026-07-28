import type { Metadata } from "next";
import Link from "next/link";
import { Layout } from "@/components/Layout";
import { discernmentToLoveCourse } from "@/lib/bible-study-discernment-to-love";
import { StudyWorkbook } from "../immanuel-basic/StudyWorkbook";

export const metadata: Metadata = {
  title: "분별에서 사랑으로 | 임마누엘교회",
  description: "영적 분별에서 자유와 사랑으로 나아가는 웹 성경공부",
  robots: { index: false, follow: false }
};

export default async function DiscernmentToLoveStudyPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const { page } = await searchParams;
  const startPageKey = page && discernmentToLoveCourse.pages.some((item) => item.key === page) ? page : undefined;

  return <Layout>
    <section className="web-study-hero">
      <div>
        <Link href="/bible-study" className="back-link">성경공부</Link>
        <p className="section-kicker">DISCERNMENT TO LOVE · PREVIEW</p>
        <h1>{discernmentToLoveCourse.title}</h1>
        <p>{discernmentToLoveCourse.subtitle}<br />{discernmentToLoveCourse.overview}</p>
      </div>
    </section>
    <section className="study-preview-notice" aria-label="미리보기 안내">
      <strong>검토용 미리보기입니다.</strong>
      <p>운영 홈페이지에는 반영되지 않았습니다. 현재 업로드된 1과만 웹 교재 형식으로 구성했습니다.</p>
    </section>
    <StudyWorkbook key={startPageKey ?? "default"} course={discernmentToLoveCourse} startPageKey={startPageKey} />
  </Layout>;
}
