import type { Metadata } from "next";
import Link from "next/link";
import { Layout } from "@/components/Layout";

export const metadata: Metadata = {
  title: "DISC 3과 관계 교육 | 임마누엘교회",
  description: "자기이해에서 사랑의 섬김으로 이어지는 90분 3과 DISC 교육"
};

const lessons = [
  {
    number: "01",
    title: "내 행동을 정직하게 봅니다",
    subtitle: "유형을 붙이기 전에 내가 반복해서 사용하는 행동을 발견합니다.",
    objectives: [
      "D·I·S·C를 성격의 네 상자가 아니라 네 가지 행동 경향으로 설명할 수 있다.",
      "내 1·2순위 경향의 강점과 지나칠 때 나타나는 그림자를 함께 말할 수 있다.",
      "‘나는 원래 이래’라는 변명 대신 한 가지 조절 행동을 정한다."
    ],
    sessions: [
      ["10분", "열기", "최근 관계에서 ‘왜 저렇게 행동하지?’라고 느꼈던 장면을 판단 없이 적습니다."],
      ["20분", "개념", "DISC의 네 경향, 상황에 따른 변화, 사람을 한 글자로 규정하지 않는 원칙을 배웁니다."],
      ["25분", "결과 읽기", "개인 결과의 1·2순위, 네 점수의 간격, 강점과 그림자를 문장으로 바꿉니다."],
      ["25분", "짝 대화", "내가 편할 때와 압박받을 때의 행동을 실제 사례로 나누고 상대는 질문만 합니다."],
      ["10분", "정리", "이번 주에 멈출 행동 하나와 새로 시도할 행동 하나를 기록하고 기도합니다."]
    ],
    blocks: [
      {
        label: "핵심 개념",
        title: "결과는 정체성이 아니라 행동의 지도입니다",
        body: "DISC는 ‘누가 더 좋은 사람인가’를 가리지 않습니다. 빠른 결정, 활발한 표현, 꾸준한 지원, 정확한 검토는 모두 공동체에 필요한 선물입니다. 같은 사람도 역할, 관계, 압박의 정도에 따라 다른 경향을 사용할 수 있습니다."
      },
      {
        label: "강의 포인트",
        title: "강점의 반대편에 그림자가 있습니다",
        body: "추진은 독단으로, 활력은 산만함으로, 배려는 회피로, 정확성은 완벽주의로 기울 수 있습니다. 그림자는 나쁜 유형의 증거가 아니라 좋은 힘을 조절하지 못했을 때 나타나는 관계의 비용입니다."
      },
      {
        label: "실습",
        title: "행동 거울 대화",
        body: "‘나는 ___할 때 힘이 난다’, ‘압박을 받으면 ___하는 경향이 있다’, ‘그 행동이 다른 사람에게 ___로 느껴질 수 있다’의 세 문장을 완성합니다. 짝은 해석하거나 조언하지 않고 들은 내용을 다시 말해 줍니다."
      },
      {
        label: "공동체 적용",
        title: "유형 언어를 별명으로 쓰지 않습니다",
        body: "‘D라서 독단적이야’가 아니라 ‘결정을 빠르게 밀어붙일 때 내 의견을 말하기 어려웠어’처럼 관찰 가능한 행동을 말합니다. 유형은 사람을 공격하는 무기가 아니라 대화를 시작하는 공통 언어입니다."
      }
    ],
    practice: "한 주 동안 중요한 대화 세 번을 기록합니다. 내가 먼저 사용한 행동, 상대의 반응, 다시 한다면 조절할 행동을 각각 한 문장으로 적습니다."
  },
  {
    number: "02",
    title: "타인을 이해하고 존중합니다",
    subtitle: "나와 다른 속도와 표현을 틀림이 아닌 필요의 차이로 읽습니다.",
    objectives: [
      "네 경향이 중요하게 여기는 목표, 관계, 안정, 기준의 차이를 구분한다.",
      "상대 행동을 의도까지 추측하지 않고 관찰과 질문으로 확인한다.",
      "같은 요청을 네 경향에 맞게 다르게 전달하는 연습을 한다."
    ],
    sessions: [
      ["10분", "복습", "지난주 조절 행동을 시도한 장면과 그때 달라진 상대의 반응을 나눕니다."],
      ["20분", "개념", "행동 아래에 있는 네 가지 필요—결과, 인정과 연결, 안정, 정확성—를 배웁니다."],
      ["25분", "사례 분석", "같은 회의와 갈등 장면을 네 관점에서 읽고 오해가 생기는 지점을 찾습니다."],
      ["25분", "말 바꾸기", "한 가지 사역 요청을 D·I·S·C 각각에게 전달하는 네 문장으로 바꿉니다."],
      ["10분", "정리", "가까운 한 사람을 정하고 그 사람에게 필요한 존중의 행동을 계획합니다."]
    ],
    blocks: [
      {
        label: "핵심 개념",
        title: "행동은 같아도 해석은 다를 수 있습니다",
        body: "말이 짧은 사람을 무례하다고, 말이 많은 사람을 가볍다고, 결정을 미루는 사람을 소극적이라고, 질문이 많은 사람을 비판적이라고 단정하기 쉽습니다. 그러나 관찰한 행동과 내가 붙인 해석을 분리하면 상대를 새롭게 볼 여지가 생깁니다."
      },
      {
        label: "대화 도구",
        title: "관찰 → 영향 → 질문의 순서",
        body: "‘오늘 회의에서 세 번 결론을 먼저 정했어요(관찰). 저는 충분히 검토하지 못했다고 느꼈어요(영향). 다음에는 어떤 자료를 먼저 보면 좋을까요?(질문)’처럼 말합니다. 유형을 추측하기보다 실제 행동을 다룹니다."
      },
      {
        label: "실습",
        title: "한 요청, 네 가지 전달 방식",
        body: "D에게는 목표와 결정권, I에게는 의미와 사람의 반응, S에게는 과정과 지원, C에게는 기준과 자료를 먼저 제공합니다. 상대를 조종하기 위한 기술이 아니라 불필요한 장벽을 낮추는 배려로 사용합니다."
      },
      {
        label: "주의",
        title: "상대의 유형을 몰래 판정하지 않습니다",
        body: "행동 몇 가지를 보고 ‘당신은 C야’라고 확정하지 않습니다. ‘어떤 방식으로 설명을 들을 때 편하세요?’, ‘결정 전에 무엇이 더 필요하세요?’라고 직접 물어보는 것이 가장 정확하고 존중하는 태도입니다."
      }
    ],
    practice: "가족·목장·사역팀에서 한 사람을 선택합니다. 평소 방식대로 요청한 문장과 그 사람의 필요를 고려해 다시 쓴 문장을 비교한 뒤 실제로 사용해 봅니다."
  },
  {
    number: "03",
    title: "사랑으로 섬깁니다",
    subtitle: "이해한 차이를 실제 섬김과 공동체의 새로운 습관으로 바꿉니다.",
    objectives: [
      "상대에게 닿는 사랑은 내 의도뿐 아니라 전달 방식까지 포함함을 설명한다.",
      "갈등 상황에서 내 자동 반응을 멈추고 다른 행동을 선택한다.",
      "가정·목장·사역팀에서 실행할 관계 언약을 함께 만든다."
    ],
    sessions: [
      ["10분", "복습", "다르게 전달했을 때 관계와 결과가 어떻게 달라졌는지 짧게 나눕니다."],
      ["20분", "개념", "사랑은 상대를 내 방식에 맞추는 일이 아니라 유익을 위해 내 자유를 조절하는 것임을 배웁니다."],
      ["25분", "갈등 연습", "압박받을 때 나타나는 각 경향의 자동 반응을 멈춤·질문·요청의 순서로 바꿉니다."],
      ["25분", "팀 언약", "의사결정, 피드백, 변화 안내, 갈등 해결에 관한 공동체 약속을 작성합니다."],
      ["10분", "파송", "한 사람을 더 잘 섬기기 위한 30일 행동 약속을 나누고 서로를 위해 기도합니다."]
    ],
    blocks: [
      {
        label: "핵심 개념",
        title: "의도가 사랑이어도 방식은 훈련해야 합니다",
        body: "빠른 해결이 필요한 사람에게 긴 위로만 건네거나, 충분한 준비가 필요한 사람에게 즉시 결정을 요구하면 좋은 의도가 제대로 전달되지 않을 수 있습니다. 사랑은 진실을 포기하지 않으면서도 상대가 들을 수 있는 속도와 언어를 선택합니다."
      },
      {
        label: "갈등 도구",
        title: "멈춤 → 질문 → 요청",
        body: "자동 반응이 올라올 때 먼저 속도를 늦춥니다. 다음으로 ‘지금 가장 중요하게 생각하는 것은 무엇인가요?’라고 묻습니다. 마지막으로 비난 대신 구체적으로 관찰 가능한 행동을 요청합니다."
      },
      {
        label: "팀 실습",
        title: "우리 공동체의 관계 언약",
        body: "‘긴급하지 않은 결정은 검토 시간을 알린다’, ‘회의에서 말하지 않은 사람의 의견을 한 번 묻는다’, ‘격려는 공개적으로, 교정은 안전한 자리에서 한다’처럼 실제로 지킬 수 있는 문장 네 개를 만듭니다."
      },
      {
        label: "삶의 확장",
        title: "교회 밖에서도 같은 사랑을 연습합니다",
        body: "배우자, 자녀, 부모, 시댁과 처가, 직장 동료, 전도 대상자에게 같은 원리를 적용합니다. 유형을 설명하는 것보다 먼저 상대가 존중받았다고 느낄 행동을 선택합니다."
      }
    ],
    practice: "30일 동안 한 사람에게 적용할 행동을 ‘언제, 어떤 상황에서, 무엇을 다르게 할지’의 문장으로 씁니다. 2주 후 서로 확인하고, 30일 후 관계의 변화를 구체적인 사례로 나눕니다."
  }
];

export default function DiscCoursePage() {
  return (
    <Layout>
      <div className="disc-page disc-course-page">
        <section className="disc-course-hero">
          <Link href="/disc">← DISC 소개와 검사</Link>
          <p className="disc-kicker">ORIGINAL 3-LESSON CURRICULUM</p>
          <h1>서로를 세우는<br />DISC 관계 교육</h1>
          <p>자기이해에 머물지 않고 타인을 존중하며 사랑으로 섬기는 실제 행동까지 훈련하는 90분 × 3과 과정입니다.</p>
        </section>

        <nav className="disc-course-summary" aria-label="DISC 강의 목차">
          {lessons.map((lesson) => (
            <a href={`#lesson-${lesson.number}`} key={lesson.number}>
              <small>{lesson.number}과 · 90분</small>
              <strong>{lesson.title}</strong>
              <span>{lesson.subtitle}</span>
            </a>
          ))}
        </nav>

        {lessons.map((lesson) => (
          <section className="disc-lesson" id={`lesson-${lesson.number}`} key={lesson.number}>
            <div className="disc-lesson-heading">
              <span className="disc-lesson-number">{lesson.number}</span>
              <div>
                <p className="disc-kicker">LESSON {lesson.number} · 90 MINUTES</p>
                <h2>{lesson.title}</h2>
                <p>{lesson.subtitle}</p>
              </div>
            </div>

            <ul className="disc-objectives" aria-label={`${lesson.number}과 학습 목표`}>
              {lesson.objectives.map((objective) => <li key={objective}>{objective}</li>)}
            </ul>

            <div className="disc-session-table" aria-label={`${lesson.number}과 시간 구성`}>
              {lesson.sessions.map(([time, stage, content]) => (
                <div className="disc-session-row" key={`${time}-${stage}`}>
                  <b>{time}</b><strong>{stage}</strong><span>{content}</span>
                </div>
              ))}
            </div>

            <div className="disc-lesson-content">
              {lesson.blocks.map((block) => (
                <article key={block.title}>
                  <small>{block.label}</small><h3>{block.title}</h3><p>{block.body}</p>
                </article>
              ))}
            </div>

            <aside className="disc-week-practice">
              <small>한 주의 훈련</small><h3>배운 내용을 관계 안에서 실행합니다</h3><p>{lesson.practice}</p>
            </aside>
          </section>
        ))}

        <aside className="disc-course-note">
          <strong>콘텐츠 사용 원칙</strong><br />
          이 과정은 디모데성경연구원의 피플퍼즐 과정 구조와 공개된 DISC 교육 원칙, 검사 사용 지침을 개념적으로 교차 검토하되 문항·채점·강의문·활동을 복제하지 않고 임마누엘의 흐름인 ‘자기이해 → 타인이해와 존중 → 사랑의 섬김’에 맞추어 독자적으로 구성했습니다. 비진단형 관계 교육 자료이며 상용 DISC 인증 검사를 대체하지 않습니다.
        </aside>
      </div>
    </Layout>
  );
}
