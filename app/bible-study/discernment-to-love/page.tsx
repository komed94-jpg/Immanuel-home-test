import type { Metadata } from "next";
import Link from "next/link";
import { Layout } from "@/components/Layout";
import { DiscernmentWorkbook } from "./DiscernmentWorkbook";
import { DiscernmentLessonTwoWorkbook } from "./DiscernmentLessonTwoWorkbook";
import { DiscernmentLessonThreeWorkbook } from "./DiscernmentLessonThreeWorkbook";
import { DiscernmentLessonFourWorkbook } from "./DiscernmentLessonFourWorkbook";
import { DiscernmentLessonFiveWorkbook } from "./DiscernmentLessonFiveWorkbook";
import { DiscernmentLessonSixWorkbook } from "./DiscernmentLessonSixWorkbook";
import { DiscernmentLessonSevenWorkbook } from "./DiscernmentLessonSevenWorkbook";
import { DiscernmentLessonEightWorkbook } from "./DiscernmentLessonEightWorkbook";
import { DiscernmentLessonNineWorkbook } from "./DiscernmentLessonNineWorkbook";
import { DiscernmentLessonTenWorkbook } from "./DiscernmentLessonTenWorkbook";

export const metadata: Metadata = {
  title: "분별에서 사랑으로 | 임마누엘교회",
  description: "1과부터 10과까지 이어지는 영적 분별 웹 성경공부",
  robots: { index: false, follow: false }
};

export default async function DiscernmentToLovePage({
  searchParams
}: {
  searchParams: Promise<{ lesson?: string; page?: string }>
}) {
  const { lesson, page } = await searchParams;
  const currentLesson = lesson === "10" || page?.startsWith("l10-")
    ? 10
    : lesson === "9" || page?.startsWith("l9-")
      ? 9
      : lesson === "8" || page?.startsWith("l8-")
        ? 8
        : lesson === "7" || page?.startsWith("l7-")
          ? 7
          : lesson === "6" || page?.startsWith("l6-")
            ? 6
            : lesson === "5" || page?.startsWith("l5-")
              ? 5
              : lesson === "4" || page?.startsWith("l4-")
                ? 4
                : lesson === "3" || page?.startsWith("l3-")
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
        <article className="study-material-card">
          <small>4과</small>
          <h3>새 언약 — 하나님은 왜 마음에 새기셨는가</h3>
          <p>옛 언약의 표지가 밖에 있었다면, 새 언약의 표지는 왜 마음에 새겨졌는지 살펴봅니다.</p>
          <Link href="/bible-study/discernment-to-love?lesson=4&page=l4-opening#study-content" className={currentLesson === 4 ? "primary-link" : "text-action"}>4과 열기</Link>
        </article>
        <article className="study-material-card">
          <small>5과</small>
          <h3>하나님만 하실 수 있는 일</h3>
          <p>현상의 크기가 아니라 그리스도·회개·성경·진리·사랑으로 향하는 성령의 다섯 방향을 살펴봅니다.</p>
          <Link href="/bible-study/discernment-to-love?lesson=5&page=l5-opening#study-content" className={currentLesson === 5 ? "primary-link" : "text-action"}>5과 열기</Link>
        </article>
        <article className="study-material-card">
          <small>6과</small>
          <h3>사랑은 왜 마지막 기준이며 중심인가</h3>
          <p>사랑을 새 저울로 만들지 않으면서, 유익과 동기와 자기중심성, 그리고 성령의 다섯 방향이 사랑에서 어떻게 드러나는지 살펴봅니다.</p>
          <Link href="/bible-study/discernment-to-love?lesson=6&page=l6-opening#study-content" className={currentLesson === 6 ? "primary-link" : "text-action"}>6과 열기</Link>
        </article>
        <article className="study-material-card">
          <small>7과</small>
          <h3>성경은 왜 절대적인 기준인가</h3>
          <p>막연한 말씀, 지도자의 권위, 체험과 영적 음성을 기록된 성경 아래에서 분별하는 법을 배웁니다.</p>
          <Link href="/bible-study/discernment-to-love?lesson=7&page=l7-opening#study-content" className={currentLesson === 7 ? "primary-link" : "text-action"}>7과 열기</Link>
        </article>
        <article className="study-material-card">
          <small>8과</small>
          <h3>같은 말을 한다고 같은 진리는 아닙니다</h3>
          <p>같은 신앙 단어 안에 다른 전제와 구원 구조가 들어갈 수 있음을 살피고, 진리를 사랑하여 빛 가운데 걷는 법을 배웁니다.</p>
          <Link href="/bible-study/discernment-to-love?lesson=8&page=l8-opening#study-content" className={currentLesson === 8 ? "primary-link" : "text-action"}>8과 열기</Link>
        </article>
        <article className="study-material-card">
          <small>9과</small>
          <h3>AI는 언약의 당사자가 될 수 있는가</h3>
          <p>예측과 인격적 앎, 기억 복제와 몸의 부활, 유익과 사랑, 기능적 응답과 언약적 응답을 구분합니다.</p>
          <Link href="/bible-study/discernment-to-love?lesson=9&page=l9-opening#study-content" className={currentLesson === 9 ? "primary-link" : "text-action"}>9과 열기</Link>
        </article>
        <article className="study-material-card">
          <small>10과</small>
          <h3>AI를 어떻게 사용해야 하는가</h3>
          <p>성경 검증, 인간 책임, 공동체, 개인정보와 약자 보호, 교회의 투명한 사용 원칙을 실제 지침으로 정리합니다.</p>
          <Link href="/bible-study/discernment-to-love?lesson=10&page=l10-opening#study-content" className={currentLesson === 10 ? "primary-link" : "text-action"}>10과 열기</Link>
        </article>
      </div>
    </section>

    {currentLesson === 10
      ? <DiscernmentLessonTenWorkbook key={page ?? "l10-opening"} startPage={page} />
      : currentLesson === 9
        ? <DiscernmentLessonNineWorkbook key={page ?? "l9-opening"} startPage={page} />
        : currentLesson === 8
          ? <DiscernmentLessonEightWorkbook key={page ?? "l8-opening"} startPage={page} />
          : currentLesson === 7
            ? <DiscernmentLessonSevenWorkbook key={page ?? "l7-opening"} startPage={page} />
            : currentLesson === 6
              ? <DiscernmentLessonSixWorkbook key={page ?? "l6-opening"} startPage={page} />
              : currentLesson === 5
                ? <DiscernmentLessonFiveWorkbook key={page ?? "l5-opening"} startPage={page} />
                : currentLesson === 4
                  ? <DiscernmentLessonFourWorkbook key={page ?? "l4-opening"} startPage={page} />
                  : currentLesson === 3
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
