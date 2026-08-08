"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type DiscKey = "D" | "I" | "S" | "C";

type Question = {
  id: number;
  type: DiscKey;
  text: string;
};

type TypeProfile = {
  name: string;
  short: string;
  summary: string;
  strength: string;
  shadow: string;
  communication: string;
  practice: string;
};

const STORAGE_KEY = "immanuel-disc-assessment-v1";

const questions: Question[] = [
  { id: 1, type: "D", text: "결정이 지연되면 필요한 정보를 빠르게 모아 방향을 정하는 편입니다." },
  { id: 2, type: "I", text: "낯선 모임에서도 먼저 인사를 건네며 분위기를 여는 편입니다." },
  { id: 3, type: "S", text: "주변 사람이 편안하도록 상대의 속도에 맞추어 대화하는 편입니다." },
  { id: 4, type: "C", text: "일을 시작하기 전에 기준과 오류 가능성을 꼼꼼히 확인하는 편입니다." },
  { id: 5, type: "I", text: "아이디어를 혼자 다듬기보다 사람들과 말하며 발전시키는 편입니다." },
  { id: 6, type: "C", text: "중요한 판단을 할 때 느낌보다 근거와 사실을 먼저 살피는 편입니다." },
  { id: 7, type: "D", text: "어려운 목표를 만나면 부담보다 도전 의식이 먼저 생기는 편입니다." },
  { id: 8, type: "S", text: "갑작스러운 변화보다 준비할 시간과 예측 가능한 흐름을 선호합니다." },
  { id: 9, type: "S", text: "공동체에서 눈에 띄지 않는 일도 꾸준히 맡아 돕는 편입니다." },
  { id: 10, type: "D", text: "회의에서는 배경 설명보다 핵심과 다음 행동을 분명히 말하는 편입니다." },
  { id: 11, type: "C", text: "말이나 문서의 표현이 정확한지 다시 확인하는 편입니다." },
  { id: 12, type: "I", text: "사람의 좋은 점을 발견하면 말로 표현하고 격려하는 편입니다." },
  { id: 13, type: "C", text: "시간이 조금 더 걸리더라도 결과의 완성도를 지키고 싶어 합니다." },
  { id: 14, type: "S", text: "의견이 부딪힐 때 양쪽 이야기를 듣고 관계를 잇는 편입니다." },
  { id: 15, type: "I", text: "사례와 이야기, 유머를 사용해 생각을 전달하는 편입니다." },
  { id: 16, type: "D", text: "책임과 결정 권한이 주어질 때 더 집중하고 활력이 생깁니다." },
  { id: 17, type: "D", text: "비효율적인 방식이 보이면 더 나은 방법을 바로 제안하는 편입니다." },
  { id: 18, type: "S", text: "내 의견을 말하기 전에 상대의 말을 충분히 듣는 편입니다." },
  { id: 19, type: "I", text: "여럿이 함께 움직이고 반응을 주고받을 때 에너지를 얻습니다." },
  { id: 20, type: "C", text: "약속한 절차와 기준이 일관되게 지켜지는 것을 중요하게 생각합니다." },
  { id: 21, type: "S", text: "사람들의 표정과 말투 변화를 살피며 필요한 도움을 알아차리는 편입니다." },
  { id: 22, type: "C", text: "나중에 다시 확인할 수 있도록 자료와 과정을 정리해 두는 편입니다." },
  { id: 23, type: "D", text: "의견이 달라도 필요하다고 판단하면 내 입장을 분명히 말하는 편입니다." },
  { id: 24, type: "I", text: "새로운 사람이나 가능성을 만날 때 기대와 감정을 빠르게 표현합니다." }
];

const profiles: Record<DiscKey, TypeProfile> = {
  D: {
    name: "주도 경향",
    short: "방향을 정하고 움직입니다",
    summary: "목표와 결과를 빠르게 보고 결정을 이끄는 힘이 큽니다.",
    strength: "결단, 추진, 책임, 도전",
    shadow: "속도가 앞서면 다른 사람의 과정과 감정을 놓칠 수 있습니다.",
    communication: "핵심·목표·기한을 먼저 말하고 선택 가능한 대안을 제시해 주세요.",
    practice: "한 번 더 듣고, 결정 전에 조용한 사람의 의견을 먼저 묻습니다."
  },
  I: {
    name: "관계 경향",
    short: "사람과 가능성을 연결합니다",
    summary: "표현과 격려로 분위기를 열고 사람을 움직이게 하는 힘이 큽니다.",
    strength: "소통, 낙관, 격려, 연결",
    shadow: "관계의 즐거움이 앞서면 세부 사항과 약속을 놓칠 수 있습니다.",
    communication: "먼저 관계를 열고 큰 그림과 기대되는 변화를 생생하게 나누어 주세요.",
    practice: "좋은 의도를 구체적인 일정과 후속 행동으로 기록해 끝까지 책임집니다."
  },
  S: {
    name: "안정 경향",
    short: "사람의 곁을 꾸준히 지킵니다",
    summary: "경청과 인내로 관계를 안정시키고 공동체를 지속하게 하는 힘이 큽니다.",
    strength: "경청, 배려, 인내, 협력",
    shadow: "평화를 지키려다 필요한 반대나 변화 요청을 미룰 수 있습니다.",
    communication: "충분한 시간을 주고 변화의 이유와 과정을 차분히 설명해 주세요.",
    practice: "사랑을 침묵으로만 표현하지 않고 필요한 진실을 부드럽고 분명하게 말합니다."
  },
  C: {
    name: "신중 경향",
    short: "기준과 완성도를 지킵니다",
    summary: "사실과 기준을 살피며 오류를 줄이고 신뢰할 만한 결과를 만드는 힘이 큽니다.",
    strength: "분석, 정확성, 기준, 품질",
    shadow: "완벽한 답을 찾다가 결정이 늦어지거나 사람보다 오류가 먼저 보일 수 있습니다.",
    communication: "근거·기준·범위를 구체적으로 제시하고 검토할 시간을 주세요.",
    practice: "정답을 말하기 전에 사람의 수고를 인정하고, 충분히 좋은 시점을 받아들입니다."
  }
};

const scale = [
  { value: 1, label: "거의 아니다" },
  { value: 2, label: "별로 아니다" },
  { value: 3, label: "보통이다" },
  { value: 4, label: "그런 편이다" },
  { value: 5, label: "매우 그렇다" }
];

const typeOrder: DiscKey[] = ["D", "I", "S", "C"];
const questionsPerStep = 4;
const stepCount = Math.ceil(questions.length / questionsPerStep);

function getScores(answers: Record<number, number>) {
  return typeOrder.map((type) => {
    const matching = questions.filter((question) => question.type === type);
    const raw = matching.reduce((total, question) => total + (answers[question.id] ?? 0), 0);
    const score = Math.round(((raw - matching.length) / (matching.length * 4)) * 100);
    return { type, score: Math.max(0, score) };
  }).sort((a, b) => b.score - a.score);
}

export function DiscAssessment() {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [step, setStep] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [restored, setRestored] = useState(false);

  useEffect(() => {
    queueMicrotask(() => {
      try {
        const saved = window.localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved) as { answers?: Record<number, number>; showResult?: boolean };
          setAnswers(parsed.answers ?? {});
          setShowResult(Boolean(parsed.showResult) && Object.keys(parsed.answers ?? {}).length === questions.length);
        }
      } catch {
        window.localStorage.removeItem(STORAGE_KEY);
      }
      setRestored(true);
    });
  }, []);

  useEffect(() => {
    if (!restored) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ answers, showResult }));
  }, [answers, showResult, restored]);

  const currentQuestions = questions.slice(step * questionsPerStep, (step + 1) * questionsPerStep);
  const currentComplete = currentQuestions.every((question) => answers[question.id]);
  const answeredCount = Object.keys(answers).length;
  const progress = Math.round((answeredCount / questions.length) * 100);
  const scores = useMemo(() => getScores(answers), [answers]);
  const primary = scores[0];
  const secondary = scores[1];
  const closeBlend = primary && secondary ? primary.score - secondary.score <= 5 : false;
  const balancedAll = scores.length === 4 ? scores[0].score - scores[3].score <= 8 : false;

  function answer(questionId: number, value: number) {
    setAnswers((current) => ({ ...current, [questionId]: value }));
  }

  function move(nextStep: number) {
    setStep(nextStep);
    document.getElementById("disc-check")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function finish() {
    if (answeredCount !== questions.length) return;
    setShowResult(true);
    window.setTimeout(() => document.getElementById("disc-result")?.scrollIntoView({ behavior: "smooth" }), 0);
  }

  function restart() {
    if (!window.confirm("현재 답변과 결과를 지우고 처음부터 다시 시작할까요?")) return;
    window.localStorage.removeItem(STORAGE_KEY);
    setAnswers({});
    setStep(0);
    setShowResult(false);
    document.getElementById("disc-check")?.scrollIntoView({ behavior: "smooth" });
  }

  if (showResult && primary && secondary) {
    return (
      <section className="disc-assessment disc-result" id="disc-result" aria-labelledby="disc-result-title">
        <div className="disc-result-heading">
          <p className="disc-kicker">MY BEHAVIOR MAP</p>
          <span>응답 완료 · 24문항</span>
          <h2 id="disc-result-title">
            {balancedAll ? "네 경향이 고르게 나타납니다" : closeBlend ? "두 경향이 고르게 나타납니다" : `${primary.type} 경향이 가장 선명합니다`}
          </h2>
          {balancedAll ? (
            <p>현재 응답에서는 특정 하나보다 네 경향이 비교적 고르게 나타납니다. 아래 점수의 작은 차이까지 서열로 해석하지 말고, 상황에 맞추어 여러 행동을 사용하는 유연성으로 읽어 보세요.</p>
          ) : (
            <p>현재 응답에서는 <strong>{profiles[primary.type].name}</strong>과(와) <strong>{profiles[secondary.type].name}</strong>이 함께 두드러집니다. 사람을 한 글자로 규정하지 않고, 상황에 따라 나타나는 네 가지 행동 경향을 함께 읽어 보세요.</p>
          )}
        </div>

        <div className="disc-score-grid" aria-label="DISC 결과 점수">
          {scores.map(({ type, score }) => (
            <article className={`disc-score-card disc-type-${type.toLowerCase()}`} key={type}>
              <div><b>{type}</b><span>{profiles[type].name}</span><strong>{score}</strong></div>
              <div className="disc-score-track" aria-label={`${profiles[type].name} ${score}점`}>
                <span style={{ width: `${score}%` }} />
              </div>
              <p>{profiles[type].short}</p>
            </article>
          ))}
        </div>

        <div className="disc-blend-card">
          <span>{balancedAll ? "BALANCE" : `${primary.type} + ${secondary.type}`}</span>
          <div>
            <h3>{balancedAll ? "상황에 맞추어 여러 행동을 사용할 수 있습니다" : "두 강점을 함께 사용할 수 있습니다"}</h3>
            <p>{profiles[primary.type].summary} 동시에 {profiles[secondary.type].summary}</p>
          </div>
        </div>

        <div className="disc-result-details">
          {[primary.type, secondary.type].map((type, index) => (
            <article key={type}>
              <header><b>{index === 0 ? "1순위" : "2순위"}</b><span>{type}</span><h3>{profiles[type].name}</h3></header>
              <dl>
                <div><dt>강점</dt><dd>{profiles[type].strength}</dd></div>
                <div><dt>놓치기 쉬운 점</dt><dd>{profiles[type].shadow}</dd></div>
                <div><dt>이 경향과 대화할 때</dt><dd>{profiles[type].communication}</dd></div>
                <div><dt>사랑으로 섬기는 훈련</dt><dd>{profiles[type].practice}</dd></div>
              </dl>
            </article>
          ))}
        </div>

        <aside className="disc-result-note">
          <strong>이 결과를 이렇게 사용하세요.</strong>
          <p>“나는 원래 이런 사람이야”라는 변명이 아니라, 내가 편하게 사용하는 방식과 상대가 필요로 하는 방식 사이의 거리를 발견하는 자료로 사용합니다.</p>
        </aside>

        <div className="disc-result-actions">
          <Link className="disc-button is-primary" href="/disc/course">3과 교육 시작하기</Link>
          <button className="disc-button" type="button" onClick={() => window.print()}>결과 인쇄</button>
          <button className="disc-button is-quiet" type="button" onClick={restart}>다시 알아보기</button>
        </div>
      </section>
    );
  }

  return (
    <section className="disc-assessment" id="disc-check" aria-labelledby="disc-check-title">
      <div className="disc-assessment-intro">
        <div>
          <p className="disc-kicker">24 QUESTIONS · ABOUT 5 MINUTES</p>
          <h2 id="disc-check-title">내 행동 알아보기</h2>
          <p>되고 싶은 모습이 아니라, 평소 여러 관계에서 반복해서 보이는 내 행동에 답해 주세요.</p>
        </div>
        <div className="disc-privacy-badge"><span aria-hidden="true">⌁</span><strong>기기 안에만 저장</strong><small>답변은 서버나 관리자에게 전송되지 않습니다.</small></div>
      </div>

      <div className="disc-progress" aria-label={`검사 진행률 ${progress}%`}>
        <div><span>{step + 1} / {stepCount} 단계</span><strong>{progress}%</strong></div>
        <div className="disc-progress-track"><span style={{ width: `${progress}%` }} /></div>
      </div>

      <div className="disc-question-list">
        {currentQuestions.map((question, index) => (
          <fieldset className="disc-question" key={question.id}>
            <legend><small>{String(step * questionsPerStep + index + 1).padStart(2, "0")}</small>{question.text}</legend>
            <div className="disc-scale">
              {scale.map((item) => (
                <label className={answers[question.id] === item.value ? "is-selected" : ""} key={item.value}>
                  <input
                    type="radio"
                    name={`question-${question.id}`}
                    value={item.value}
                    checked={answers[question.id] === item.value}
                    onChange={() => answer(question.id, item.value)}
                  />
                  <b>{item.value}</b><span>{item.label}</span>
                </label>
              ))}
            </div>
          </fieldset>
        ))}
      </div>

      <div className="disc-assessment-actions">
        <button className="disc-button is-quiet" type="button" disabled={step === 0} onClick={() => move(step - 1)}>이전</button>
        {step < stepCount - 1 ? (
          <button className="disc-button is-primary" type="button" disabled={!currentComplete} onClick={() => move(step + 1)}>다음 단계</button>
        ) : (
          <button className="disc-button is-primary" type="button" disabled={!currentComplete || answeredCount !== questions.length} onClick={finish}>내 행동 지도 보기</button>
        )}
      </div>
      {!currentComplete && <p className="disc-answer-hint" aria-live="polite">이 단계의 네 문항에 모두 답하면 다음으로 이동할 수 있습니다.</p>}
    </section>
  );
}
