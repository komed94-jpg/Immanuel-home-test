import type { Metadata } from "next";
import Link from "next/link";
import { Layout } from "@/components/Layout";
import { DiscAssessment } from "@/app/disc/DiscAssessment";

export const metadata: Metadata = {
  title: "서로를 세우는 DISC | 임마누엘교회",
  description: "내 행동을 알고 타인을 이해하며 사랑으로 섬기는 DISC 관계 교육"
};

const tendencies = [
  { key: "D", name: "주도 경향", copy: "목표를 보고 방향을 정하며 빠르게 움직입니다.", gift: "결단과 추진" },
  { key: "I", name: "관계 경향", copy: "표현과 격려로 사람과 가능성을 연결합니다.", gift: "소통과 활력" },
  { key: "S", name: "안정 경향", copy: "경청과 인내로 사람의 곁을 꾸준히 지킵니다.", gift: "배려와 협력" },
  { key: "C", name: "신중 경향", copy: "사실과 기준을 살피며 완성도를 높입니다.", gift: "분석과 정확성" }
];

const uses = ["새가족 정착", "목장 관계", "사역 팀워크", "부부와 가족", "부모와 자녀", "직장과 전도"];

export default function DiscPage() {
  return (
    <Layout>
      <div className="disc-page">
        <section className="disc-hero">
          <div className="disc-orbit disc-orbit-one" aria-hidden="true" />
          <div className="disc-orbit disc-orbit-two" aria-hidden="true" />
          <div className="disc-hero-inner">
            <p className="disc-kicker">DISC · RELATIONSHIP · FORMATION</p>
            <h1><span>사람을 파악하는 것을 넘어,</span><strong>사랑하는 방식을 배웁니다.</strong></h1>
            <p>내 행동을 정직하게 보고, 타인을 이해하고 존중하며, 상대에게 필요한 방식으로 사랑을 전하는 공동체 훈련입니다.</p>
            <div className="disc-hero-actions">
              <a className="disc-button is-primary" href="#disc-check">내 행동 알아보기</a>
              <Link className="disc-button" href="/disc/course">3과 강의 보기</Link>
            </div>
          </div>
          <div className="disc-type-ribbon" aria-label="DISC 네 행동 경향">
            {tendencies.map((type) => <span className={`disc-type-${type.key.toLowerCase()}`} key={type.key}><b>{type.key}</b>{type.name}</span>)}
          </div>
        </section>

        <section className="disc-purpose">
          <div className="disc-section-heading">
            <p className="disc-kicker">NOT A LABEL, A LENS</p>
            <h2>사람을 네 칸에 가두지 않고<br />네 가지 행동유형을 함께 봅니다.</h2>
            <p>누구에게나 D·I·S·C 경향이 모두 있습니다. 점수는 사람의 가치나 성숙도를 재는 것이 아니라, 관계에서 자주 사용하는 행동의 방향을 보여 줍니다.</p>
          </div>
          <div className="disc-tendency-grid">
            {tendencies.map((type) => (
              <article className={`disc-type-${type.key.toLowerCase()}`} key={type.key}>
                <header><b>{type.key}</b><span>{type.name}</span></header>
                <h3>{type.gift}</h3><p>{type.copy}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="disc-formation">
          <div className="disc-section-heading is-light">
            <p className="disc-kicker">FROM AWARENESS TO SERVICE</p>
            <h2>행동의 차이를 관계의 성숙으로 연결합니다.</h2>
          </div>
          <ol>
            <li><small>01</small><strong>내 행동을 정직하게 봅니다</strong><p>강점과 반복되는 그림자를 함께 인식합니다.</p></li>
            <li><small>02</small><strong>타인을 이해하고 존중합니다</strong><p>나와 다른 속도와 표현을 틀림이 아닌 차이로 읽습니다.</p></li>
            <li><small>03</small><strong>사랑으로 섬깁니다</strong><p>내가 편한 방식이 아니라 상대에게 닿는 방식으로 행동합니다.</p></li>
          </ol>
        </section>

        <DiscAssessment />

        <section className="disc-course-bridge">
          <div>
            <p className="disc-kicker">90 MINUTES × 3 LESSONS</p>
            <h2>검사에서 끝내지 않고 관계의 훈련으로 이어갑니다.</h2>
            <p>각 과는 개념 설명, 사례, 대화 실습, 공동체 적용, 한 주의 행동 약속으로 구성됩니다.</p>
          </div>
          <div className="disc-course-list">
            <span><b>1과</b> 내 행동을 정직하게 봅니다</span>
            <span><b>2과</b> 타인을 이해하고 존중합니다</span>
            <span><b>3과</b> 사랑으로 섬깁니다</span>
          </div>
          <Link className="disc-button is-primary" href="/disc/course">전체 강의안 보기</Link>
        </section>

        <section className="disc-uses">
          <div className="disc-section-heading">
            <p className="disc-kicker">WHERE IT SERVES</p>
            <h2>교회에서 시작해 삶의 모든 관계로 확장됩니다.</h2>
          </div>
          <div>{uses.map((item, index) => <span key={item}><small>{String(index + 1).padStart(2, "0")}</small>{item}</span>)}</div>
        </section>

        <section className="disc-principles">
          <div><p className="disc-kicker">SAFE USE</p><h2>사람을 살리는 세 가지 원칙</h2></div>
          <ul>
            <li><strong>유형보다 사람</strong><p>결과를 별명이나 낙인으로 사용하지 않습니다.</p></li>
            <li><strong>설명이지 진단이 아님</strong><p>성격장애, 신앙 수준, 능력을 판정하는 도구가 아닙니다.</p></li>
            <li><strong>변명의 끝, 훈련의 시작</strong><p>“원래 이래”가 아니라 사랑을 위해 행동을 조절합니다.</p></li>
          </ul>
        </section>

        <footer className="disc-footer">
          <strong>DISC · 서로를 세우는 관계 훈련</strong>
          <p>본 페이지의 문항·해석·강의안은 관계 성장을 위해 독자적으로 구성한 비진단형 교육 콘텐츠입니다.</p>
        </footer>
      </div>
    </Layout>
  );
}
