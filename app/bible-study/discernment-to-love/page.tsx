import type { Metadata } from "next";
import Link from "next/link";
import { Layout } from "@/components/Layout";
import { DiscernmentWorkbook } from "./DiscernmentWorkbook";
import { DiscernmentLessonTwoWorkbook } from "./DiscernmentLessonTwoWorkbook";
import { DiscernmentLessonThreeWorkbook } from "./DiscernmentLessonThreeWorkbook";

export const metadata: Metadata = {
  title: "분별에서 사랑으로 | 임마누엘교회",
  description: "분별은 정죄가 아니라 자유를 위한 것이다 · 영적 분별 성경공부",
  robots: { index: false, follow: false }
};

export default async function DiscernmentToLovePage({
  searchParams
}: {
  searchParams: Promise<{ lesson?: string; page?: string }>
}) {
  const { lesson, page } = await searchParams;
  const currentLesson = lesson === "3" || page?.startsWith("l3-")
    ? 3
    : lesson === "2" || page?.startsWith("l2-")
      ? 2
      : 1;

  return <Layout>
    <section className="web-study-hero">
      <div>
        <Link href="/bible-study" className="back-link">성경공부</Link>
        <p className="section-kicker">DISCERNMENT TO LOVE</p>
        <h1>분별에서 사랑으로</h1>
        <p>영적 분별은 사람을 정죄하는 기술이 아니라, 잘못된 잣대에서 자유로워져 다시 사랑하기 위한 여정입니다.</p>
      </div>
    </section>

    <section className="study-section" aria-labelledby="discernment-lessons-title">
      <div className="study-section-heading">
        <p className="section-kicker">LESSONS</p>
        <h2 id="discernment-lessons-title">과를 선택하십시오</h2>
        <p>각 과의 학습자용 원문을 줄이지 않고 웹 교재로 제공합니다.</p>
      </div>
      <div className="study-material-grid">
        <article className="study-material-card">
          <small>1과</small>
          <h3>분별은 정죄가 아니라 자유를 위한 것이다</h3>
          <p>우리가 무엇으로 판단하는지 살피고, 잘못된 잣대에서 자유로워져 사랑으로 나아갑니다.</p>
          <Link href="/bible-study/discernment-to-love?lesson=1&page=opening#study-content" className={currentLesson === 1 ? "primary-link" : "text-action"}>1과 열기</Link>
        </article>
        <article className="study-material-card">
          <small>2과</small>
          <h3>체험으로 판단할 수 없습니다</h3>
          <p>소극적 표지 전반 여섯 항목을 성경의 두 장면씩 나란히 놓고 살펴봅니다.</p>
          <Link href="/bible-study/discernment-to-love?lesson=2&page=l2-opening#study-content" className={currentLesson === 2 ? "primary-link" : "text-action"}>2과 열기</Link>
        </article>
        <article className="study-material-card">
          <small>3과</small>
          <h3>신앙생활의 모양으로 판단할 수 없습니다</h3>
          <p>신앙의 말, 회심 과정, 열심, 찬양, 확신, 간증을 영적 등급표로 사용할 수 없는 이유를 살펴봅니다.</p>
          <Link href="/bible-study/discernment-to-love?lesson=3&page=l3-opening#study-content" className={currentLesson === 3 ? "primary-link" : "text-action"}>3과 열기</Link>
        </article>
      </div>
    </section>

    {currentLesson === 3
      ? <DiscernmentLessonThreeWorkbook key={page ?? "l3-opening"} startPage={page} />
      : currentLesson === 2
        ? <DiscernmentLessonTwoWorkbook key={page ?? "l2-opening"} startPage={page} />
        : <DiscernmentWorkbook key={page ?? "opening"} startPage={page} />}

    <section className="study-section" aria-label="관련 성경공부">
      <div className="study-section-heading">
        <p className="section-kicker">CONTINUE THE JOURNEY</p>
        <h2>변화와 사랑의 여정으로 이어갑니다</h2>
        <p>분별의 목적은 더 정교한 판정이 아니라 자유와 사랑입니다. 제자훈련 과정에서 이 흐름을 더 깊이 살펴보세요.</p>
      </div>
      <div className="study-material-grid">
        <article className="study-material-card">
          <small>제자훈련</small>
          <h3>사람이 어떻게 변화되는가</h3>
          <p>말씀과 성령 안에서 삶 전체가 새로워지는 변화의 흐름을 배웁니다.</p>
          <Link href="/discipleship" className="text-action">제자훈련 보기</Link>
        </article>
      </div>
    </section>
  </Layout>;
}
