import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Layout } from "@/components/Layout";
import { StudyWorkbook } from "../immanuel-basic/StudyWorkbook";
import { sundayCourse, sundayLessons } from "@/lib/sunday-course";

export const metadata: Metadata = {
  title: "주일은 무엇을 하는 날인가 | 임마누엘교회",
  description: "말씀과 교제와 섬김을 배우는 5주 성경공부. 학생용 본문을 읽고 질문, 한 주의 순종과 7일 실천을 기록합니다.",
};

export default async function SundayStudyPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const { page } = await searchParams;
  const startPageKey = page && sundayCourse.pages.some((item) => item.key === page) ? page : undefined;

  return <Layout>
    <section className="loving-jesus-hero">
      <Image src="/images/sunday/1.jpg" alt="주일 성경공부 학생용 교재의 표지 사진" fill priority sizes="100vw" />
      <div className="loving-jesus-hero-overlay" />
      <div className="loving-jesus-hero-copy">
        <Link href="/bible-study" className="back-link">성경공부</Link>
        <p className="section-kicker">5-WEEK BIBLE STUDY · 학생용</p>
        <h1>{sundayCourse.title}</h1>
        <p>{sundayCourse.subtitle}</p>
        <div className="loving-jesus-loop"><span>말씀</span><span>교제</span><span>섬김</span><span>한 주의 실천</span></div>
        <p><Link href="/bible-study/sunday?page=introduction#study-content" className="primary-link">처음부터 공부하기</Link></p>
      </div>
    </section>
    <section className="study-section" aria-labelledby="sunday-lessons-title">
      <div className="study-section-heading">
        <p className="section-kicker">다섯 번의 만남과 한 주의 실천</p>
        <h2 id="sunday-lessons-title">다섯 과의 길</h2>
        <p>{sundayCourse.overview}</p>
        <p>본문은 누구나 읽을 수 있습니다. 로그인하면 답변·공부 날짜·진도를 저장하고 이어서 공부할 수 있습니다. 개인 기록은 본인에게만 보입니다.</p>
        <Link href="/bible-study/sunday?page=guide#study-content" className="text-action">교재 사용 안내 →</Link>
      </div>
      <div className="loving-lesson-grid">
        {sundayLessons.map((lesson) => <Link href={`/bible-study/sunday?page=${lesson.pageKey}#study-content`} className="loving-lesson-card" key={lesson.number}>
          <span>{String(lesson.number).padStart(2, "0")}</span><small>{lesson.number}과 · 학생용</small><h3>{lesson.title}</h3><p>{lesson.subtitle}</p><strong>이 과 공부하기 →</strong>
        </Link>)}
      </div>
    </section>
    <StudyWorkbook key={startPageKey ?? "default"} course={sundayCourse} startPageKey={startPageKey} />
  </Layout>;
}
