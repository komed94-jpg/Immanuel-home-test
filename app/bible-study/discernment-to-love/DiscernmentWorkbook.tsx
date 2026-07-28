"use client";

import { useEffect, useMemo, useState } from "react";

type Question = { n: number; prompt: string };
type StudyPage = { key: string; eyebrow: string; title: string; scripture?: string; body: string[]; questions: Question[] };

const pages: StudyPage[] = [
  {
    key: "opening",
    eyebrow: "LESSON 01 · OPENING",
    title: "분별은 정죄가 아니라 자유를 위한 것이다",
    body: [
      "목장 모임이 끝나고 돌아오는 길이었습니다. 한 자매는 기도하다가 울었고, 다른 형제는 처음부터 끝까지 조용히 앉아 있었습니다. 목자는 마음속으로 이미 판정을 내렸습니다. 저 자매는 은혜를 받았고, 저 형제는 메말랐다고 말입니다.",
      "이 과의 질문은 두 가지입니다. 우리는 무엇으로 판단하고 있습니까. 그리고 그 판단은 우리를 어디로 데려가고 있습니까."
    ],
    questions: [{ n: 0, prompt: "이 목자는 무엇을 근거로 판정했습니까. 한 단어로 적어 보십시오." }]
  },
  {
    key: "deception",
    eyebrow: "LESSON 01 · PART 01",
    title: "미혹의 시대",
    scripture: "마태복음 24:4-5, 23-24 · 마가복음 10:18 · 마태복음 6:24",
    body: [
      "예수님께서 마지막 때에 관해 가장 먼저 경고하신 것은 전쟁도 기근도 지진도 아니라 미혹이었습니다. 큰 표적과 기사처럼 대단해 보이는 것이 사람을 끌어가며, 미혹당할 뻔한 대상도 택하신 자들입니다.",
      "‘내가 그리스도라’는 주장은 종교의 언어로만 오지 않습니다. 산업과 경제와 정치와 지식의 영역에서도 어떤 사람이나 집단이 인간의 근원적인 문제를 다 풀어 줄 것처럼 보일 때가 있습니다. 그들이 스스로 그리스도라고 말할 필요는 없습니다. 우리가 그 자리에 그들을 앉히기 때문입니다.",
      "도움을 받는 것과 구원자로 삼는 것은 다릅니다. 의사와 전문가와 앞서간 사람에게 배우는 것은 은혜입니다. 그러나 내 인생의 근원적인 안전이 그 사람에게 걸려 있다면 자리가 바뀐 것입니다.",
      "고백과 실제가 오래 갈라진 채로 지나면 신앙은 종교로 남습니다. 말은 남고 관계는 비게 됩니다. 그러나 이 갈라짐을 발견한 것은 실패의 증거가 아니라 은혜의 시작입니다. 인식도 은혜입니다."
    ],
    questions: [
      { n: 1, prompt: "예수님께서 마지막 때에 관해 가장 먼저 하신 경고는 무엇입니까?" },
      { n: 2, prompt: "마태복음 24장 24절에서 거짓 그리스도와 거짓 선지자가 사용하는 수단은 무엇입니까?" },
      { n: 3, prompt: "미혹당할 뻔한 대상은 누구입니까?" },
      { n: 4, prompt: "예수님은 ‘선한 선생님’이라는 호칭에 어떻게 반응하셨습니까?" },
      { n: 5, prompt: "마태복음 6장 24절에서 겸하여 섬기지 못한다고 하신 이유는 무엇입니까?" },
      { n: 6, prompt: "지난 몇 해 동안 내 문제를 실제로 풀어 준 이들의 이름을 세 사람 정도 적어 보십시오." },
      { n: 7, prompt: "나는 하나님을 어떤 분이라고 고백합니까? 한 문장으로 적어 보십시오." },
      { n: 8, prompt: "6번의 목록과 7번의 고백 사이에 거리가 느껴집니까? 그 거리를 무엇이라고 부르겠습니까?" }
    ]
  },
  {
    key: "measure",
    eyebrow: "LESSON 01 · PART 02",
    title: "우리는 무엇으로 판단합니까",
    scripture: "로마서 14:1-13 · 마태복음 7:1-2",
    body: [
      "판단의 기준만 떼어 놓고 보면, 사람은 보이는 것과 들리는 것을 근거로 믿습니다. 둘의 공통점은 외적인 것이라는 데 있습니다.",
      "로마 교회의 다툼은 신앙을 표현하는 방식의 차이에서 시작되었습니다. 바울은 누가 옳은가보다 누가 판단석에 앉을 수 있는가를 묻습니다. 남의 하인을 판단하는 너는 누구냐고 말합니다.",
      "우리는 저마다 신앙을 재는 잣대를 들고 삽니다. 내가 나를 재는 잣대는 반드시 남을 재는 잣대가 됩니다. 두 개를 따로 가질 수는 없습니다.",
      "사물과 상황과 사건은 헤아려야 합니다. 그러나 인격은 헤아리지 않습니다. 어떤 행동이 옳은지 그른지는 말할 수 있지만, 그 행동을 근거로 그 사람이 어떤 존재인지 판정할 수는 없습니다. 하나는 분별이고 다른 하나는 재판입니다.",
      "잘못된 기준은 체계가 되어 저절로 돌아갑니다. 목자의 체계는 목자 한 사람에게서 끝나지 않으며, 부모와 선배와 오래된 성도를 통해 다음 사람에게 전달됩니다."
    ],
    questions: [
      { n: 9, prompt: "사기를 당한 사람은 상대의 무엇을 보고 믿었겠습니까? 두 가지를 적어 보십시오." },
      { n: 10, prompt: "그 두 가지의 공통점은 무엇입니까?" },
      { n: 11, prompt: "로마서 14장에 나오는 두 부류는 무엇이 다릅니까?" },
      { n: 12, prompt: "3절에서 두 부류가 서로를 대하는 방식은 무엇입니까?" },
      { n: 13, prompt: "4절에서 판단하지 말아야 할 이유를 무엇이라고 말합니까?" },
      { n: 14, prompt: "10절과 13절에서 반복되는 권면은 무엇입니까?" },
      { n: 15, prompt: "두 부류는 상대의 무엇을 보고 판단합니까? 그 근거는 겉에 있습니까, 안에 있습니까?" },
      { n: 16, prompt: "판단의 권한을 누구에게 돌립니까? 우리가 남을 판단할 때 실제로 무엇을 하고 있는 것입니까?" },
      { n: 17, prompt: "최근 누군가의 신앙을 마음속에서 평가한 적이 있습니까? 무엇을 보고 그렇게 생각했습니까?" },
      { n: 18, prompt: "최근 나 자신의 신앙 상태를 평가한 적이 있습니까? 무엇을 근거로 평가했습니까?" },
      { n: 19, prompt: "17번과 18번의 ‘내가 본 것’을 나란히 놓고 보십시오. 무엇이 보입니까?" },
      { n: 20, prompt: "마태복음 7장 2절에서 내가 헤아린 그 헤아림은 결국 누구에게 돌아옵니까?" }
    ]
  },
  {
    key: "immanuel",
    eyebrow: "LESSON 01 · PART 03",
    title: "나는 나이고, 그는 그입니다. 그러나 임마누엘입니다",
    scripture: "로마서 14:4, 12 · 고린도전서 13:4-7 · 로마서 8:35-39",
    body: [
      "사람은 각각 하나의 인격입니다. 나는 나이고 그는 그입니다. 심리학에서는 이것을 분화라고 부릅니다.",
      "분화되지 않으면 내가 그를 돕는다고 말하면서 실제로는 내가 괴로워서 그를 바꾸려 합니다. 그가 자유로워지도록 섬기는 것이 아니라 내 불편이 사라지도록 움직이려는 것입니다.",
      "사랑은 오래 참고 무례히 행하지 않으며 자기의 유익을 구하지 않습니다. 오래 참는다는 것은 시간을 준다는 뜻이고, 견딘다는 것은 결과가 오지 않은 동안에도 곁에 있는다는 뜻입니다.",
      "하나님은 즉각적인 심판도, 인격과 자유의 회수도 선택하지 않으셨습니다. 대신 오래 참으시고 돌보시고 성화의 길로 인도하셨습니다. 그것이 사랑입니다.",
      "우리는 각각 하나님 앞에 따로 서지만 홀로 버려지지 않습니다. 하나님은 임마누엘이십니다. 자유를 주시면서도 곁에 계십니다.",
      "우리가 넉넉히 이기는 근거는 결단의 힘이 아니라 우리를 사랑하시는 이입니다. 넘어지는 일이 없어서가 아니라 넘어짐도 우리를 그 사랑에서 떼어 낼 수 없기 때문입니다."
    ],
    questions: [
      { n: 21, prompt: "각 사람이 누구 앞에 서고 누구에게 답하게 된다고 말합니까?" },
      { n: 22, prompt: "고린도전서 13장에서 사랑이 하지 않는 것들을 찾아 적어 보십시오." },
      { n: 23, prompt: "사랑이 시간을 어떻게 다루는지 보여 주는 표현은 무엇입니까?" },
      { n: 24, prompt: "가족이나 목장 식구 중 ‘저 사람이 좀 바뀌었으면’ 하는 사람을 한 명 떠올려 보십시오." },
      { n: 25, prompt: "그가 바뀌지 않을 때 내 안에서 올라오는 감정을 그대로 적어 보십시오." },
      { n: 26, prompt: "그 감정은 그의 자유를 위한 안타까움입니까, 나의 불편입니까? 섞여 있다면 비율로 적어 보십시오." },
      { n: 27, prompt: "로마서 8장 38-39절에서 우리를 하나님의 사랑에서 끊을 수 없다고 열거된 것들을 적어 보십시오." },
      { n: 28, prompt: "우리가 넉넉히 이기는 것은 누구로 말미암아서라고 말합니까?" }
    ]
  },
  {
    key: "commandment",
    eyebrow: "LESSON 01 · PART 04",
    title: "가장 이상한 일",
    scripture: "마태복음 22:37-40 · 누가복음 18:11-12",
    body: [
      "바리새인이 말한 것은 거짓말이 아니었습니다. 그는 실제로 금식했고 십일조를 드렸습니다. 문제는 지킬 수 있는 것을 지켰다는 근거로 지키지 못한 것을 덮고, 그 안도를 근거로 곁의 사람을 판단했다는 데 있습니다.",
      "우리도 첫째 계명을 온전히 지키지 못한 채로 삽니다. 그런데 작은 것을 지켰다는 근거로 안심하고, 그 안도를 근거로 다른 사람을 판단합니다.",
      "작은 것을 지켰다는 근거로 큰 것을 어기고, 그렇게 남을 정죄하는 행위로 다시 첫째 계명을 어깁니다. 하나님 사랑과 이웃 사랑은 떨어져 있지 않습니다.",
      "이 고리를 스스로 끊을 수 있는 사람은 없습니다. 우리가 하나님 앞에 설 수 있는 이유는 우리 대신 계명을 완전히 지키신 그리스도 때문입니다."
    ],
    questions: [
      { n: 29, prompt: "가장 크고 첫째 되는 계명은 무엇입니까?" },
      { n: 30, prompt: "둘째 계명은 첫째 계명과 어떤 관계에 있습니까?" },
      { n: 31, prompt: "누가복음 18장의 바리새인은 자기가 무엇을 했다고 말합니까?" },
      { n: 32, prompt: "그 바리새인의 기도는 무엇으로 시작해서 누구에게로 향합니까?" }
    ]
  },
  {
    key: "freedom",
    eyebrow: "LESSON 01 · PART 05",
    title: "그러면 왜 분별합니까",
    scripture: "요한복음 8:31-32",
    body: [
      "분별의 목적은 자유입니다. 사람을 가려내는 능력을 얻기 위한 것이 아니라 잘못된 잣대로부터 놓여나기 위한 것입니다.",
      "기준이 없으면 내 감정과 남의 시선과 내가 나에게 내리는 판정에 흔들립니다. 그것이 부자유입니다.",
      "바른 기준을 배우면 나를 재판하는 일을 그만두게 되고, 남을 재판하는 일도 그만두게 됩니다. 그 자리가 비면 사랑이 들어옵니다.",
      "‘기준이 아니다’는 ‘거짓이다’가 아닙니다. 눈물과 뜨거움과 부르짖음과 간증은 하나님께로부터 올 수 있습니다. 다만 그것만으로 판정할 수 없다는 뜻입니다.",
      "분별은 남을 향해 겨누는 칼이 아니라 내가 딛고 선 땅을 확인하는 일입니다."
    ],
    questions: [
      { n: 33, prompt: "진리를 알게 되는 조건으로 예수님은 무엇을 말씀하십니까?" },
      { n: 34, prompt: "진리를 알면 어떤 일이 일어난다고 하십니까?" },
      { n: 35, prompt: "여는 이야기의 목자가 자유로워지려면 판별하는 능력입니까, 다른 무엇입니까?" }
    ]
  },
  {
    key: "summary",
    eyebrow: "LESSON 01 · SUMMARY",
    title: "핵심 정리와 기도",
    body: [
      "마지막 때에 예수님이 가장 먼저 경고하신 것은 미혹이었습니다.",
      "도움을 받는 것과 구원자로 삼는 것은 다릅니다.",
      "판단의 기준이 외적인 것이 될 때 사람은 속게 됩니다.",
      "내가 나를 재는 잣대는 반드시 남을 재는 잣대가 됩니다.",
      "잘못된 기준은 체계가 되어 공동체에 전달됩니다.",
      "각 사람은 하나님 앞에 따로 서며, 분화되지 않은 도움은 사랑의 이름으로 관계를 괴롭게 만듭니다.",
      "분별의 목적은 판별력이 아니라 자유이고, 자유의 자리에 들어오는 것은 사랑입니다.",
      "기도: 주님, 제 감정으로 저를 재판하고 같은 잣대로 곁의 사람을 재었던 일을 보게 하소서. 보게 하신 것을 자기를 벌하는 데 쓰지 않고 돌이킴의 자리로 삼게 하소서. 제가 서 있는 땅이 저의 뜨거움이 아니라 저를 위해 다 이루신 그리스도이심을 붙들고, 그 자유 안에서 사람을 다시 사랑하게 하소서. 아멘."
    ],
    questions: []
  }
];

const storageKey = "immanuel:discernment-to-love:l1";

export function DiscernmentWorkbook({ startPage }: { startPage?: string }) {
  const requested = pages.findIndex((page) => page.key === startPage);
  const [pageIndex, setPageIndex] = useState(requested >= 0 ? requested : 0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [completed, setCompleted] = useState<string[]>([]);

  useEffect(() => {
    const saved = window.localStorage.getItem(storageKey);
    if (!saved) return;
    try {
      const parsed = JSON.parse(saved) as { answers?: Record<string, string>; completed?: string[] };
      setAnswers(parsed.answers ?? {});
      setCompleted(parsed.completed ?? []);
    } catch {}
  }, []);

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify({ answers, completed }));
  }, [answers, completed]);

  const page = pages[pageIndex];
  const percent = useMemo(() => Math.round((completed.length / pages.length) * 100), [completed.length]);

  function selectPage(index: number) {
    const next = Math.max(0, Math.min(pages.length - 1, index));
    setPageIndex(next);
    const url = new URL(window.location.href);
    url.searchParams.set("page", pages[next].key);
    url.hash = "study-content";
    window.history.pushState({}, "", url);
    window.requestAnimationFrame(() => document.getElementById("study-content")?.scrollIntoView({ behavior: "smooth", block: "start" }));
  }

  function completePage() {
    setCompleted((current) => current.includes(page.key) ? current : [...current, page.key]);
  }

  return <section className="web-study-shell">
    <aside className="web-study-sidebar">
      <p className="section-kicker">분별에서 사랑으로</p>
      <h2>1과 학습 순서</h2>
      <div className="web-study-progress"><span style={{ width: `${percent}%` }} /></div>
      <strong>{completed.length}/{pages.length}쪽 완료 · {percent}%</strong>
      <ol>{pages.map((item, index) => <li key={item.key}><button type="button" className={index === pageIndex ? "is-active" : ""} aria-current={index === pageIndex ? "page" : undefined} onClick={() => selectPage(index)}><span>{index + 1}</span><em><small>1과</small>{item.title}</em>{completed.includes(item.key) && <small>완료</small>}</button></li>)}</ol>
    </aside>
    <article className="web-study-page" id="study-content" tabIndex={-1}>
      <div className="web-study-page-heading"><div><p className="section-kicker">{page.eyebrow}</p><h2>{page.title}</h2>{page.scripture && <span>{page.scripture}</span>}</div><b>{String(pageIndex + 1).padStart(2, "0")} / {String(pages.length).padStart(2, "0")}</b></div>
      <div className="web-study-body">{page.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
      {page.questions.length > 0 && <div className="web-study-questions">{page.questions.map((question) => {
        const key = `${page.key}:${question.n}`;
        return <label key={key}><span>{question.n ? `${question.n}번` : "여는 질문"}</span><strong>{question.prompt}</strong><textarea rows={5} value={answers[key] ?? ""} onChange={(event) => setAnswers((current) => ({ ...current, [key]: event.target.value }))} placeholder="여기에 답을 적으면 이 기기에 자동 저장됩니다." /></label>;
      })}</div>}
      <div className="web-study-actions"><button type="button" className="text-action" disabled={pageIndex === 0} onClick={() => selectPage(pageIndex - 1)}>이전</button><button type="button" className="primary-link" onClick={completePage}>{completed.includes(page.key) ? "완료됨" : "이 페이지 공부 완료"}</button><button type="button" className="text-action" disabled={pageIndex === pages.length - 1} onClick={() => selectPage(pageIndex + 1)}>다음</button></div>
    </article>
  </section>;
}
