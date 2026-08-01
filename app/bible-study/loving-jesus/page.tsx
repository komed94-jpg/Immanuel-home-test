import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Layout } from "@/components/Layout";
import { StudyWorkbook } from "../immanuel-basic/StudyWorkbook";
import { lovingJesusCourse, lovingJesusLessons, lovingJesusSeries } from "@/lib/loving-jesus-course";

export const metadata: Metadata = {
  title: "예수님을 사랑한다고 말했다 | 임마누엘교회",
  description: "말씀으로 예수님과 교제하는 8주 습관 프로젝트",
};

export default async function LovingJesusStudyPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const { page } = await searchParams;
  const startPageKey = page && lovingJesusCourse.pages.some((item) => item.key === page) ? page : undefined;

  return <Layout>
    <section className="loving-jesus-hero">
      <Image src="/images/loving-jesus/open-bible.jpg" alt="빛이 비치는 자리 위에 펼쳐진 성경" fill priority sizes="100vw" />
      <div className="loving-jesus-hero-overlay" />
      <div className="loving-jesus-hero-copy">
        <Link href="/bible-study" className="back-link">성경공부</Link>
        <p className="section-kicker">8-WEEK HABIT PROJECT</p>
        <h1>예수님을 사랑한다고 말했다</h1>
        <p>{lovingJesusSeries.subtitle}. 예수님을 사랑한다는 고백을 말씀을 읽고, 묻고, 기록하고, 순종하는 생활로 옮겨 갑니다.</p>
        <div className="loving-jesus-loop">{lovingJesusSeries.habitLoop.map((item) => <span key={item}>{item}</span>)}</div>
      </div>
    </section>

    <section className="loving-jesus-intro" aria-label="과정 안내">
      <div>
        <p className="section-kicker">THE GOSPEL ORDER</p>
        <h2>순종은 사랑을 얻는 값이 아니라,<br />먼저 받은 사랑의 응답입니다.</h2>
      </div>
      <p>{lovingJesusSeries.gospelBalance}</p>
    </section>

    <section className="loving-history" aria-labelledby="loving-history-title">
      <div className="loving-history-heading">
        <p className="section-kicker">THE WORD CAME TO US</p>
        <h2 id="loving-history-title">우리가 오늘 성경을 펼칠 수 있기까지</h2>
        <p>말씀은 가볍게 우리 손에 주어진 책이 아닙니다. 평범한 사람이 성경을 읽도록 길을 열었고, 누군가는 그 일을 위해 박해와 죽음도 감당했습니다.</p>
      </div>
      <div className="loving-history-grid">
        <article className="loving-history-card feature">
          <Image src="/images/loving-jesus/wycliffe.jpg" alt="성경을 번역하는 존 위클리프를 표현한 이미지" width={900} height={1100} sizes="(max-width: 820px) 100vw, 50vw" />
          <div><small>성경 번역의 선구자 · 1320–1384</small><h3>존 위클리프</h3><p>라틴어 성경이 성직자와 학자의 영역에 머물던 때, 평범한 사람들이 하나님의 말씀을 읽도록 길을 열었습니다.</p></div>
        </article>
        <article className="loving-history-card feature">
          <Image src="/images/loving-jesus/tyndale.jpg" alt="성경을 영어로 번역하는 윌리엄 틴데일을 표현한 이미지" width={900} height={1100} sizes="(max-width: 820px) 100vw, 50vw" />
          <div><small>말씀을 평민의 언어로 · 1494–1536</small><h3>윌리엄 틴데일</h3><p>성경을 영어로 번역하고 보급했다는 이유로 박해받았지만, 말씀이 사람들의 손에 들리게 하는 일을 멈추지 않았습니다.</p></div>
        </article>
        <article className="loving-history-card compact"><Image src="/images/loving-jesus/wycliffe-exile.jpg" alt="박해 가운데 성경을 지키는 길을 표현한 이미지" width={1000} height={600} sizes="(max-width: 820px) 100vw, 50vw" /><p>말씀은 박해 속에서도 전해졌습니다.</p></article>
        <article className="loving-history-card compact"><Image src="/images/loving-jesus/tyndale-martyrdom.jpg" alt="박해받는 성경 번역자를 표현한 이미지" width={1000} height={600} sizes="(max-width: 820px) 100vw, 50vw" /><p>사랑은 말씀을 가볍게 여기지 않습니다.</p></article>
      </div>
    </section>

    <section className="study-section loving-course-lessons" aria-labelledby="loving-course-lessons-title">
      <div className="study-section-heading"><p className="section-kicker">EIGHT WEEKS</p><h2 id="loving-course-lessons-title">강의와 실습이 교차합니다.</h2><p>주 1회 70–90분 모임과 매일 10–20분 개인 훈련으로, 네 가지 습관을 한 단계씩 쌓습니다.</p></div>
      <div className="loving-lesson-grid">
        {lovingJesusLessons.map((lesson) => <Link href={`/bible-study/loving-jesus?page=week-${lesson.number}-read#study-content`} className="loving-lesson-card" key={lesson.number}>
          <span>{String(lesson.number).padStart(2, "0")}</span><small>{lesson.kind} · {lesson.duration}</small><h3>{lesson.title}</h3><p>{lesson.keyTruth}</p><strong>{lesson.kind === "강의" ? "말씀 배우기" : "말씀 실습하기"} →</strong>
        </Link>)}
      </div>
    </section>

    <StudyWorkbook key={startPageKey ?? "default"} course={lovingJesusCourse} startPageKey={startPageKey} />
  </Layout>;
}
