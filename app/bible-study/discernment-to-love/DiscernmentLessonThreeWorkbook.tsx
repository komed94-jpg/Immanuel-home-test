"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type SavedResponse = { pageKey: string; questionKey: string; answer: string; studiedOn: string; updatedAt: string };
type SavedProgress = { pageKey: string; studiedOn: string; completedAt: string };
type StudyState = { responses: SavedResponse[]; progress: SavedProgress[]; totalPages: number };

type Question = { key: string; label: string; prompt: string };
type StudyPage = { key: string; title: string; eyebrow: string; questions: Question[] };

type Block =
  | { type: "heading"; text: string }
  | { type: "paragraphs"; body: string[] }
  | { type: "scripture"; refs: string[] }
  | { type: "question"; key: string }
  | { type: "callout"; title: string; body: string[] }
  | { type: "quote"; body: string[] }
  | { type: "list"; ordered?: boolean; items: string[] }
  | { type: "note"; text: string };

const H = (text: string): Block => ({ type: "heading", text });
const P = (...body: string[]): Block => ({ type: "paragraphs", body });
const S = (...refs: string[]): Block => ({ type: "scripture", refs });
const Q = (key: string): Block => ({ type: "question", key });
const C = (title: string, ...body: string[]): Block => ({ type: "callout", title, body });
const BQ = (...body: string[]): Block => ({ type: "quote", body });
const L = (items: string[], ordered = false): Block => ({ type: "list", items, ordered });
const N = (text: string): Block => ({ type: "note", text });

const course = {
  slug: "discernment-to-love",
  lessonSlug: "discernment-lesson-3",
  title: "3과 · 신앙생활의 모양으로 판단할 수 없습니다",
  pages: [
    {
      key: "l3-opening",
      eyebrow: "LESSON 03 · OPENING",
      title: "신앙생활의 모양으로 판단할 수 없습니다",
      questions: [
        { key: "l3-q0", label: "✍️ 시작 질문", prompt: "나는 누군가를 ‘믿음이 좋다’고 판단할 때 어떤 모습을 가장 먼저 봅니까. 한 가지만 적어 두십시오." }
      ]
    },
    {
      key: "l3-sign-1",
      eyebrow: "LESSON 03 · SIGN 01",
      title: "“신앙 이야기를 저렇게 잘하는데, 믿음이 깊은 사람 아닌가요?”",
      questions: [
        { key: "l3-q1", label: "1번", prompt: "성도들은 하나님께 무엇을 구했습니까." },
        { key: "l3-q2", label: "2번", prompt: "성령으로 충만해진 뒤에 그들은 무엇을 했습니까." },
        { key: "l3-q3", label: "3번", prompt: "사랑이 없어도 사람이 할 수 있다고 기록된 일들을 찾아 적어 보십시오." },
        { key: "l3-q4", label: "4번", prompt: "사랑 없이 사람의 방언과 천사의 말을 한다면 무엇과 같다고 합니까." },
        { key: "l3-q5", label: "5번 · 나란히 놓고 봅니다", prompt: "성령으로 충만한 사람도 담대하게 말하고, 사랑이 없는 사람도 놀라운 종교적 언어를 사용할 수 있습니다. 그렇다면 말의 유창함과 열정만으로 무엇을 판정할 수 있습니까." }
      ]
    },
    {
      key: "l3-sign-2",
      eyebrow: "LESSON 03 · SIGN 02",
      title: "“회개하고 위로받고 확신까지 왔어요. 과정이 분명해요”",
      questions: [
        { key: "l3-q6", label: "6번", prompt: "간수는 바울과 실라 앞에 어떤 모습으로 나왔습니까." },
        { key: "l3-q7", label: "7번", prompt: "간수는 무엇을 물었고, 바울과 실라는 무엇이라고 대답했습니까." },
        { key: "l3-q8", label: "8번", prompt: "말씀을 들은 뒤 간수와 그의 집에 어떤 일들이 이어졌습니까. 세 가지 이상 적어 보십시오." },
        { key: "l3-q9", label: "9번", prompt: "시몬에게 어떤 순서의 일들이 나타났습니까. 13절을 따라 적어 보십시오." },
        { key: "l3-q10", label: "10번", prompt: "베드로는 시몬의 마음을 어떻게 진단했습니까. (21-23절)" },
        { key: "l3-q11", label: "11번 · 나란히 놓고 봅니다", prompt: "두 사람에게 믿음의 고백, 세례, 뒤따르는 행동이 나타났습니다. 그렇다면 겉으로 확인되는 과정의 순서만으로 마음의 상태까지 판정할 수 있습니까." }
      ]
    },
    {
      key: "l3-sign-3",
      eyebrow: "LESSON 03 · SIGN 03",
      title: "“예배와 기도에 저렇게 열심인데, 믿음이 없을 수 있나요?”",
      questions: [
        { key: "l3-q12", label: "12번", prompt: "안나는 성전을 떠나지 않고 무엇으로 하나님을 섬겼습니까." },
        { key: "l3-q13", label: "13번", prompt: "아기 예수님을 만난 뒤 안나는 무엇을 했습니까." },
        { key: "l3-q14", label: "14번", prompt: "바리새인은 자신이 실천한 종교생활을 어떻게 말했습니까." },
        { key: "l3-q15", label: "15번", prompt: "그는 누구를 믿었고, 다른 사람을 어떻게 여겼습니까. (9절)" },
        { key: "l3-q16", label: "16번", prompt: "예수님은 바리새인과 세리 가운데 누가 의롭다 하심을 받고 내려갔다고 하셨습니까." },
        { key: "l3-q17", label: "17번 · 나란히 놓고 봅니다", prompt: "안나와 바리새인 모두 기도하고 금식했습니다. 그러나 안나는 누구를 기다리고 누구를 높였으며, 바리새인은 누구를 믿고 다른 사람을 어떻게 바라보았습니까. 두 사람을 갈라놓은 것은 열심의 양입니까, 열심의 중심과 방향입니까." }
      ]
    },
    {
      key: "l3-sign-4",
      eyebrow: "LESSON 03 · SIGN 04",
      title: "“입만 열면 하나님께 감사하고 찬양하잖아요”",
      questions: [
        { key: "l3-q18", label: "18번", prompt: "다윗은 언제 여호와를 송축하겠다고 합니까." },
        { key: "l3-q19", label: "19번", prompt: "다윗은 다른 사람들에게 무엇을 함께하자고 권합니까." },
        { key: "l3-q20", label: "20번", prompt: "이 백성은 입과 입술로 하나님께 어떻게 했습니까." },
        { key: "l3-q21", label: "21번", prompt: "그들의 마음은 하나님에게서 어떠했으며, 하나님을 경외하는 일은 무엇으로 가르침을 받았습니까." },
        { key: "l3-q22", label: "22번 · 나란히 놓고 봅니다", prompt: "다윗의 입에도 찬양이 있었고, 마음이 하나님에게서 먼 백성의 입에도 하나님을 높이는 말이 있었습니다. 그렇다면 찬양의 말이 많다는 사실만으로 무엇을 판정할 수 있습니까." }
      ]
    },
    {
      key: "l3-sign-5",
      eyebrow: "LESSON 03 · SIGN 05",
      title: "“본인이 저렇게 확신하는데, 잘못된 체험일 수 있나요?”",
      questions: [
        { key: "l3-q23", label: "23번", prompt: "바울은 자신이 누구를 믿는다고 말합니까." },
        { key: "l3-q24", label: "24번", prompt: "바울이 부끄러워하지 않는 이유는 무엇입니까." },
        { key: "l3-q25", label: "25번", prompt: "‘주여 주여’라고 말한 사람들은 자신들이 주의 이름으로 무엇을 했다고 주장합니까." },
        { key: "l3-q26", label: "26번", prompt: "예수님은 그들에게 무엇이라고 말씀하십니까." },
        { key: "l3-q27", label: "27번 · 나란히 놓고 봅니다", prompt: "두 본문 모두 강한 확신의 언어를 보여 줍니다. 확신의 강도만으로 두 경우를 구별할 수 있습니까. 확신의 크기 외에 무엇을 더 살펴야 합니까." }
      ]
    },
    {
      key: "l3-sign-6",
      eyebrow: "LESSON 03 · SIGN 06",
      title: "“그 간증을 듣고 다들 울었어요. 정말 하나님이 하신 일 아닌가요?”",
      questions: [
        { key: "l3-q28", label: "28번", prompt: "안디옥에 도착한 바나바는 무엇을 보고 어떻게 반응했습니까." },
        { key: "l3-q29", label: "29번", prompt: "성경은 바나바를 어떤 사람이라고 설명합니까." },
        { key: "l3-q30", label: "30번", prompt: "사무엘은 엘리압을 보고 속으로 어떻게 판단했습니까." },
        { key: "l3-q31", label: "31번", prompt: "하나님은 사무엘에게 사람과 하나님이 보는 것이 어떻게 다르다고 말씀하셨습니까." },
        { key: "l3-q32", label: "32번 · 나란히 놓고 봅니다", prompt: "경건한 바나바는 하나님의 은혜를 알아보고 기뻐했고, 경건한 사무엘은 눈앞의 사람을 처음에는 잘못 판단했습니다. 이 두 장면은 다른 사람의 영적 판단에 대해 무엇을 가르쳐 줍니까." }
      ]
    },
    {
      key: "l3-closing",
      eyebrow: "LESSON 03 · CLOSING",
      title: "내 삶을 봅니다 · 열두 가지 · 핵심 정리 · 나눔 · 기도",
      questions: [
        { key: "l3-q33", label: "33번", prompt: "이번 과의 여섯 가지를 다시 훑어보십시오. 그중 내가 나의 믿음을 확인하기 위해 가장 많이 사용한 것은 무엇입니까." },
        { key: "l3-q34", label: "34번", prompt: "그것이 잘될 때 나는 나를 높였습니까. 잘되지 않을 때는 나를 정죄했습니까." },
        { key: "l3-q35", label: "35번", prompt: "나는 다른 사람의 말, 열심, 찬양, 확신, 간증을 보고 그 사람의 믿음을 너무 빨리 판정한 적이 있습니까." },
        { key: "l3-q36", label: "36번", prompt: "이 과를 시작할 때 적어 둔 내용을 다시 보십시오. 지금 그것을 어떻게 다시 쓰시겠습니까.\n\n처음에 적은 것 :\n지금 다시 쓴다면 :" },
        { key: "l3-share-1", label: "나눔 질문 1", prompt: "이번 과의 여섯 가지 가운데 저울로 사용해 왔다는 사실을 가장 인정하기 어려운 것은 무엇입니까." },
        { key: "l3-share-2", label: "나눔 질문 2", prompt: "말, 열심, 찬양, 확신, 간증 가운데 하나가 약해졌을 때 자신을 정죄했던 경험이 있습니까." },
        { key: "l3-share-3", label: "나눔 질문 3", prompt: "‘공동체의 판단은 중요하지만 최종적이지 않다’는 말이 나에게 위로가 됩니까, 불편하게 들립니까. 그 이유는 무엇입니까." },
        { key: "l3-share-4", label: "나눔 질문 4", prompt: "‘열두 개가 무너져도 당신은 무너지지 않습니다’라는 말이 지난 과와 지금 어떻게 다르게 들립니까." }
      ]
    }
  ] satisfies StudyPage[]
};

const pageBlocks: Record<string, Block[]> = {
  "l3-opening": [
    H("시작하며"),
    P(
      "지난 과에서 우리는 신앙의 체험에 나타나는 여섯 가지를 살펴보았습니다.",
      "감정이 매우 뜨거울 수 있습니다.\n몸에 큰 반응이 나타날 수 있습니다.\n내가 만든 것이 아니라 밖에서 온 것처럼 느껴질 수 있습니다.\n성경 구절이 갑자기 떠오를 수 있습니다.\n사랑처럼 보이는 말과 행동이 나타날 수 있습니다.\n여러 종류의 종교적 감정이 한꺼번에 일어날 수 있습니다.",
      "그 일들은 모두 실제로 일어날 수 있고, 하나님께로부터 올 수도 있습니다. 그러나 **그것만으로는 판정할 수 없었습니다.**",
      "이번 과에서 살펴볼 여섯 가지는 조금 더 익숙합니다. 어쩌면 지난 과보다 더 아플 수 있습니다.",
      "신앙 이야기를 잘하는 것, 회심의 과정이 분명한 것, 예배와 기도에 열심을 내는 것, 하나님을 많이 찬양하는 것, 자신의 구원을 확신하는 것, 감동적인 간증으로 사람들의 마음을 얻는 것입니다.",
      "이것들은 버려야 할 나쁜 것이 아닙니다. 오히려 모두 귀하게 사용될 수 있습니다.",
      "우리가 내려놓으려는 것은 **신앙생활 자체가 아니라, 그것을 저울로 사용하는 습관**입니다."
    ),
    BQ(
      "**‘기준이 아니다’는 ‘하지 않아도 된다’는 뜻이 아닙니다.**",
      "**‘판정할 수 없다’는 ‘아무것도 분별할 수 없다’는 뜻도 아닙니다.**"
    ),
    P("이번에도 우리가 확인하려는 것은 하나입니다.", "**이것만으로는 나와 다른 사람의 믿음을 판정할 수 없다.**"),
    H("조나단 에드워즈는 왜 이 열두 가지를 정리했습니까?"),
    P(
      "조나단 에드워즈는 부흥을 멀리서 비판한 사람이 아니었습니다. 그는 18세기 대각성의 한복판에서 부흥을 경험하고 목회한 사람이었습니다. 강렬한 감정과 눈물, 신체의 반응, 성경 말씀이 떠오르는 체험, 열정적인 기도와 찬양, 분명한 확신과 감동적인 간증이 교회 안에 실제로 나타나는 것을 보았습니다.",
      "그러나 같은 현상을 두고 서로 반대되는 판단이 일어났습니다. 어떤 사람들은 강렬한 체험이 나타나기만 하면 모두 성령의 역사라고 여겼고, 다른 사람들은 낯선 현상이나 지나친 감정이 보이면 부흥 전체를 거짓이라고 판단했습니다. 에드워즈는 두 판단 모두 성급하다고 보았습니다.",
      "그래서 『신앙감정론』 2부에서 **참된 신앙을 확정해 주지도 못하고, 거짓 신앙이라고 확정해 주지도 못하는 열두 가지 표지**를 정리했습니다. 오늘 우리가 ‘소극적 표지’라고 부르는 것들입니다. 여기서 ‘소극적’이라는 말은 가치가 없거나 하지 말아야 한다는 뜻이 아닙니다. 감정, 기도, 찬양, 성경 말씀, 확신, 간증은 모두 하나님의 은혜와 함께 나타날 수 있고, 어떤 것은 성도가 마땅히 힘써야 할 신앙생활입니다.",
      "다만 에드워즈의 요점은 분명합니다."
    ),
    BQ(
      "**그 현상이 있다는 사실만으로 구원에 이르는 참된 은혜를 증명할 수 없고,**",
      "**그 현상이 없다는 사실만으로 참된 은혜가 없다고 판단할 수도 없습니다.**"
    ),
    P(
      "왜냐하면 겉으로 비슷한 현상이 서로 다른 뿌리에서 나올 수 있기 때문입니다. 성령의 은혜에서 나올 수도 있고, 사람의 기질과 상상, 배운 종교 언어, 집단의 분위기, 일시적인 감동이나 자기 확신에서 나올 수도 있습니다. 겉으로 드러난 모양만으로는 그 뿌리를 다 볼 수 없습니다.",
      "에드워즈가 이 열두 가지를 정리한 목적은 신앙의 감정과 체험을 없애기 위해서가 아닙니다. **부흥을 냉소하지 않으면서도, 현상에 속지 않도록 보호하기 위해서였습니다.** 그는 신앙의 크기와 화려함이 아니라, 그 신앙이 무엇을 보고 사랑하게 하며 삶을 어떤 방향으로 변화시키는지를 살펴야 한다고 보았습니다. 그 긍정적인 기준은 다음 과들에서 이어서 공부합니다."
    ),
    Q("l3-q0")
  ],
  "l3-sign-1": [
    N("**― 종교에 관해 유창하고 열정적으로 말함**"),
    H("읽기 ①"), S("사도행전 4:29-31"), Q("l3-q1"), Q("l3-q2"),
    H("읽기 ②"), S("고린도전서 13:1-3"), Q("l3-q3"), Q("l3-q4"),
    H("나란히 놓고 봅니다"), Q("l3-q5"),
    H("짚어 봅니다"),
    P(
      "신앙을 말하는 것은 귀한 일입니다. 복음을 증언하고, 말씀을 가르치고, 하나님께서 하신 일을 나누는 것은 교회가 해야 할 일입니다. 성령께서는 두려워하던 사람에게 담대함을 주시고 입을 열어 말씀을 전하게 하십니다.",
      "**신앙의 표현을 하지 말라는 뜻이 아닙니다. 오히려 적극 권장합니다.** 복음을 전하고, 하나님께서 하신 일을 간증하고, 말씀을 서로 가르치며 권면하는 일은 교회가 마땅히 힘써야 할 일입니다.",
      "그러나 신앙을 표현하는 능력과 그 사람의 영적 상태는 같은 것이 아닙니다. 종교적인 말을 잘하는 능력은 여러 곳에서 올 수 있습니다. 말하는 은사가 있을 수 있고, 성격이 적극적일 수도 있고, 교회생활을 오래 하면서 익숙한 표현을 많이 배웠을 수도 있습니다. 성경 지식과 신학적 어휘를 정확하게 사용할 수도 있습니다.",
      "바울은 사람의 방언과 천사의 말을 할지라도 사랑이 없으면 소리 나는 구리와 울리는 꽹과리와 같을 수 있다고 했습니다. 말이 틀렸다는 뜻이 아닙니다. **옳고 놀라운 말을 할 수 있다는 사실만으로 그 말이 나온 마음의 뿌리까지 알 수는 없다는 뜻입니다.**",
      "말을 잘하는 사람이 반드시 거짓된 것도 아닙니다. 반대로 말이 서툴고 자신의 체험을 설명하지 못하는 사람이 믿음이 얕은 것도 아닙니다."
    ),
    BQ(
      "**신앙 이야기를 유창하게 한다고 해서 그것만으로 성령의 역사라고 판정할 수 없고,**",
      "**말이 서툴다고 해서 성령의 역사가 아니라고 판정할 수도 없습니다.**"
    )
  ],
  "l3-sign-2": [
    N("**― 각성과 위로가 일정한 순서로 나타남**"),
    H("읽기 ①"), S("사도행전 16:29-34"), Q("l3-q6"), Q("l3-q7"), Q("l3-q8"),
    H("읽기 ②"), S("사도행전 8:13, 18-24"), Q("l3-q9"), Q("l3-q10"),
    H("나란히 놓고 봅니다"), Q("l3-q11"),
    H("짚어 봅니다"),
    P(
      "하나님께서 사람을 깨우실 때 양심의 찔림이 올 수 있습니다. 죄를 깨닫고 복음을 들은 뒤 위로와 기쁨을 얻을 수도 있습니다. 빌립보의 간수에게는 두려움, 질문, 말씀을 들음, 세례, 기쁨이 이어졌습니다. 이러한 과정은 귀하고 실제적입니다.",
      "**회심에 과정이 없다는 말이 아닙니다.**",
      "그러나 모든 사람이 똑같은 순서와 속도로 하나님께 나아오는 것은 아닙니다. 어떤 사람은 자신의 변화를 분명한 날짜와 사건으로 설명할 수 있지만, 어떤 사람은 오랜 시간에 걸쳐 복음을 깨닫고 믿음으로 자라기도 합니다.",
      "시몬도 믿었고 세례를 받았으며 빌립을 따라다녔습니다. 겉으로 확인할 수 있는 과정은 분명했습니다. 그러나 베드로는 그의 마음이 하나님 앞에서 바르지 않다고 말했습니다.",
      "이 본문으로 시몬의 최종 운명을 판정하려는 것이 아닙니다. 본문이 보여 주는 것은 더 제한적이고 분명합니다. **겉으로 드러난 과정이 정확해 보여도 그것만으로 마음의 뿌리를 보증할 수는 없습니다.**",
      "반대로 자신의 회심 과정을 매끄럽게 설명하지 못한다고 해서 그 사람의 믿음을 부정해서도 안 됩니다."
    ),
    BQ(
      "**회심의 과정이 분명하고 질서 있게 보인다고 해서 그것만으로 참된 믿음이라고 판정할 수 없고,**",
      "**그 과정을 정확히 설명하지 못한다고 해서 참된 믿음이 아니라고 판정할 수도 없습니다.**"
    )
  ],
  "l3-sign-3": [
    N("**― 종교생활과 예배의 의무에 많은 시간과 열심을 보임**"),
    H("읽기 ①"), S("누가복음 2:36-38"), Q("l3-q12"), Q("l3-q13"),
    H("읽기 ②"), S("누가복음 18:9-14"), Q("l3-q14"), Q("l3-q15"), Q("l3-q16"),
    H("나란히 놓고 봅니다"), Q("l3-q17"),
    H("짚어 봅니다"),
    P(
      "안나는 선지자였고, 오랜 세월 성전을 떠나지 않으며 밤낮으로 금식하고 기도하여 하나님을 섬겼습니다. 그의 열심은 잠시 분위기에 휩쓸린 열심이 아니었습니다. 남편을 잃은 뒤 긴 세월 동안 하나님을 기다리며 살아온 지속적인 신앙이었습니다.",
      "그리고 그의 신앙이 어디를 향하고 있었는지는 예수님을 만났을 때 드러났습니다. 안나는 자신의 오랜 기도와 금식을 자랑하지 않았습니다. 하나님께 감사했고, 예루살렘의 구속을 기다리던 사람들에게 아기 예수님에 관하여 말했습니다. **안나의 열심은 자신을 증명하는 데 머물지 않고, 그리스도를 알아보고 하나님을 높이며 다른 사람에게 구원의 소식을 전하는 데로 나아갔습니다.**",
      "기도, 예배, 금식, 봉사, 성경 읽기는 하나님께서 우리를 훈련하시고 은혜를 누리게 하시는 귀한 통로입니다. 안나의 삶은 이러한 경건의 훈련이 얼마나 아름다운 열매를 맺을 수 있는지를 보여 줍니다.",
      "**열심을 내지 말라는 뜻이 아닙니다.**",
      "그러나 바리새인도 기도했고 일주일에 두 번 금식했으며 십일조를 드렸습니다. 겉으로 드러난 종교생활만 보면 그의 열심도 대단했습니다. 문제는 그 행위 자체가 아니라 그 열심의 중심과 방향이었습니다. 그는 하나님을 기다리기보다 자기의 의로움을 믿었고, 하나님을 높이기보다 자신의 행위를 늘어놓았으며, 다른 사람을 품기보다 멸시했습니다. 하나님께 나아가도록 주어진 경건의 행위가 자신을 높이고 다른 사람을 재는 저울이 되었습니다.",
      "두 사람의 차이는 분명합니다."
    ),
    BQ(
      "**안나의 열심은 하나님을 기다리다가 그리스도를 알아보고, 하나님께 감사하며, 구원의 소식을 전하게 했습니다.**",
      "**바리새인의 열심은 자신을 의롭다고 믿게 하고, 자신의 행위를 자랑하며, 다른 사람을 멸시하게 했습니다.**"
    ),
    P(
      "같은 기도와 금식이었지만 중심이 달랐고, 향하는 방향이 달랐으며, 맺은 열매도 달랐습니다. 그러므로 열심의 양만 보아서는 참된 신앙을 판정할 수 없습니다. 그 열심이 누구를 의지하게 하고, 누구를 높이며, 어떤 열매로 이어지는지를 함께 보아야 합니다.",
      "몸이 아프거나 누군가를 돌보는 사람은 긴 시간의 예배와 봉사를 감당하지 못할 수 있습니다. 믿음이 깊어도 말없이 버티는 시기가 있을 수 있습니다. 반대로 많은 시간을 드린다는 이유만으로 하나님 앞에서 자신의 상태를 보증할 수는 없습니다."
    ),
    BQ(
      "**기도와 예배에 많은 시간을 드린다고 해서 그것만으로 참된 믿음이라고 판정할 수 없고,**",
      "**많은 시간을 드리지 못한다고 해서 참된 믿음이 아니라고 판정할 수도 없습니다.**"
    ),
    C(
      "잠깐 멈춥니다",
      "지금 내려놓고 있는 것은 신앙의 말도, 회심의 과정도, 기도와 예배의 열심도 아닙니다.",
      "신앙을 말하지 말라는 것이 아닙니다.\n회심의 과정을 소중히 여기지 말라는 것도 아닙니다.\n기도와 예배에 힘쓰지 말라는 것은 더더욱 아닙니다.",
      "우리가 내려놓는 것은 그것을 **저울로 사용하는 습관**입니다.",
      "말을 잘하니 믿음이 깊고,\n체험의 순서가 정확하니 구원이 확실하고,\n많은 시간을 드리니 하나님께 더 가까운 사람이라고 판정하던 저울입니다.",
      "열심은 귀합니다. 그러나 열심이 당신을 하나님께 받아들여지게 만드는 근거는 아닙니다.",
      "지금 빠지고 있는 것은 신앙생활이 아니라 **등급표**입니다."
    )
  ],
  "l3-sign-4": [
    N("**― 입으로 하나님을 자주 찬양하고 높임**"),
    H("읽기 ①"), S("시편 34:1-3"), Q("l3-q18"), Q("l3-q19"),
    H("읽기 ②"), S("이사야 29:13"), Q("l3-q20"), Q("l3-q21"),
    H("나란히 놓고 봅니다"), Q("l3-q22"),
    H("짚어 봅니다"),
    P(
      "하나님은 찬양받기에 합당하신 분입니다. 성경은 성도에게 하나님을 높이고 그분이 하신 일을 선포하라고 합니다. 다윗은 어려움 속에서도 여호와를 항상 송축하겠다고 고백했습니다.",
      "**찬양을 의심하거나 줄이라는 뜻이 아닙니다.**",
      "그러나 이사야 시대의 백성도 입으로 하나님께 가까이하고 입술로 그분을 공경했습니다. 문제는 그들의 마음이 하나님에게서 멀리 떠나 있었다는 것입니다. 익숙한 찬양과 신앙의 표현은 진실한 마음에서 나올 수도 있고, 마음보다 먼저 움직이는 습관이 될 수도 있습니다.",
      "그렇다고 누군가 찬양할 때마다 속마음을 의심하라는 뜻은 아닙니다. 우리는 다른 사람의 마음을 함부로 판정할 수 없습니다. 바로 그 이유 때문에 찬양의 양을 저울로 사용해서도 안 됩니다.",
      "또한 탄식이 많은 사람을 믿음이 없는 사람으로 여기지 마십시오. 시편에는 찬양뿐 아니라 질문과 눈물과 탄식도 들어 있습니다. 하나님께 아픔을 정직하게 말하면서도 그분을 놓지 않는 믿음이 있습니다."
    ),
    BQ(
      "**하나님을 자주 찬양한다고 해서 그것만으로 참된 믿음이라고 판정할 수 없고,**",
      "**찬양의 표현이 적거나 탄식이 많다고 해서 참된 믿음이 아니라고 판정할 수도 없습니다.**"
    )
  ],
  "l3-sign-5": [
    N("**― 자신의 체험이 하나님께로부터 왔고 자신이 구원받았다고 강하게 확신함**"),
    H("읽기 ①"), S("디모데후서 1:12"), Q("l3-q23"), Q("l3-q24"),
    H("읽기 ②"), S("마태복음 7:21-23"), Q("l3-q25"), Q("l3-q26"),
    H("나란히 놓고 봅니다"), Q("l3-q27"),
    H("짚어 봅니다"),
    P(
      "구원의 확신은 귀한 선물입니다. 바울은 ‘내가 믿는 자를 내가 안다’고 고백했습니다. 성경은 성도가 언제까지나 불안과 의심 속에만 머물러야 한다고 말하지 않습니다.",
      "**확신을 갖지 말라는 뜻이 아닙니다.**",
      "그러나 강하게 확신한다는 사실이 그 확신의 내용을 자동으로 참되게 만들지는 않습니다. 마태복음 7장의 사람들도 예수님을 ‘주여 주여’라고 불렀고, 자신들이 주의 이름으로 행한 일들을 확신 있게 제시했습니다.",
      "사람은 거짓말을 하지 않으면서도 잘못 확신할 수 있습니다. 자신의 체험을 진심으로 믿으면서도 그 체험을 잘못 해석할 수 있습니다.",
      "그러므로 ‘얼마나 확실하게 느끼는가’만 물어서는 충분하지 않습니다. **그 확신이 누구를 붙들고 있는지, 무엇을 근거로 삼고 있는지, 그리고 그 믿음이 삶에서 어떤 방향으로 나타나는지를 더 살펴야 합니다.** 이 질문은 다음 과들에서 다시 다루게 됩니다.",
      "반대로 확신이 흔들리는 날이 있다고 해서 곧 믿음이 사라진 것은 아닙니다. 연약한 믿음도 그리스도를 붙들 수 있습니다."
    ),
    BQ(
      "**자신의 구원을 강하게 확신한다고 해서 그 확신만으로 참된 믿음이라고 판정할 수 없고,**",
      "**확신이 약하거나 흔들린다고 해서 참된 믿음이 아니라고 판정할 수도 없습니다.**"
    )
  ],
  "l3-sign-6": [
    N("**― 체험의 외적 모습과 간증이 경건한 사람들에게도 깊은 감동과 호감을 줌**"),
    H("읽기 ①"), S("사도행전 11:22-24"), Q("l3-q28"), Q("l3-q29"),
    H("읽기 ②"), S("사무엘상 16:6-7"), Q("l3-q30"), Q("l3-q31"),
    H("나란히 놓고 봅니다"), Q("l3-q32"),
    H("짚어 봅니다"),
    P(
      "하나님께서 한 사람에게 행하신 일을 듣고 함께 기뻐하는 것은 귀한 일입니다. 바나바는 안디옥에서 하나님의 은혜를 보고 기뻐했습니다. 교회는 서로의 삶에서 나타나는 은혜를 확인하고 격려해야 합니다.",
      "**간증을 나누지 말거나 공동체의 분별을 무시하라는 뜻이 아닙니다.**",
      "그러나 경건한 사람의 판단도 하나님의 판단과 같지는 않습니다. 사무엘은 하나님께서 보내신 선지자였지만 엘리압의 외모를 보고 그가 여호와의 기름부음 받은 사람이라고 생각했습니다. 하나님은 사람은 외모를 보지만 여호와는 중심을 보신다고 말씀하셨습니다.",
      "감동적인 이야기는 사람의 마음을 움직입니다. 눈물, 극적인 변화, 정리된 서사, 익숙한 신앙 언어는 선한 사람들의 마음도 얻을 수 있습니다. 그 감동이 거짓이라는 뜻은 아닙니다. 다만 **우리의 감동과 호감은 하나님의 최종 판정이 아닙니다.**",
      "교회의 인정과 지도자의 판단은 중요합니다. 그러나 누구도 오류가 없는 심판자는 아닙니다. 그러므로 사람들이 나의 체험을 인정했다고 해서 그것을 최종 근거로 삼아서는 안 되고, 사람들이 나를 충분히 이해하지 못했다고 해서 하나님께서 나를 버리셨다고 생각해서도 안 됩니다."
    ),
    BQ(
      "**감동적인 간증이 경건한 사람들의 마음을 얻었다고 해서 그것만으로 참된 믿음이라고 판정할 수 없고,**",
      "**사람들에게 인정받지 못했다고 해서 참된 믿음이 아니라고 판정할 수도 없습니다.**"
    )
  ],
  "l3-closing": [
    H("내 삶을 봅니다"), Q("l3-q33"), Q("l3-q34"), Q("l3-q35"), Q("l3-q36"),
    H("열두 가지를 모두 보았습니다"),
    P(
      "지난 과와 이번 과에서 우리는 모두 열두 가지를 살펴보았습니다.",
      "뜨거운 감정, 몸의 반응, 밖에서 온 것 같은 느낌, 갑자기 떠오른 성경 구절, 사랑처럼 보이는 말과 행동, 여러 종교적 감정이 함께 나타나는 것.",
      "그리고 신앙을 유창하게 말하는 것, 회심의 과정이 분명한 것, 종교생활에 열심을 내는 것, 하나님을 많이 찬양하는 것, 자신의 상태를 강하게 확신하는 것, 감동적인 간증으로 경건한 사람들의 마음을 얻는 것.",
      "조나단 에드워즈는 이것들을 **참과 거짓을 어느 한쪽으로 확정할 수 없는 표지**로 다루었습니다. 흔히 ‘소극적 표지’라고 부르지만, 여기서 소극적이라는 말은 나쁘거나 거짓이라는 뜻이 아닙니다.",
      "에드워즈는 이 열두 가지가 참된 신앙에도 나타날 수 있고, 참된 구원의 은혜가 없는 상태에서도 비슷하게 나타날 수 있다고 설명했습니다. 그러므로 어떤 현상이 나타났다는 이유만으로 ‘참되다’고 서둘러 판정해서도 안 되고, 그 현상이 없다는 이유만으로 ‘거짓이다’라고 판정해서도 안 됩니다.",
      "이 열두 가지는 실제로 하나님의 역사와 함께 나타날 수 있습니다. 어떤 것은 성도가 마땅히 구하고 훈련해야 할 일이기도 합니다. 그러나 에드워즈가 묻고자 한 것은 현상의 유무나 크기가 아니라, **그 체험이 무엇을 보게 하고 무엇을 사랑하게 하며 삶의 성향과 방향을 어떻게 바꾸는가**였습니다.",
      "따라서 어느 하나도 그 자체로 나와 다른 사람의 영적 상태를 최종 판정하는 저울이 될 수는 없습니다.",
      "이 사실은 우리를 냉소로 이끌지 않습니다. 오히려 함부로 자신을 높이고, 함부로 자신을 버리고, 함부로 다른 사람을 판정하던 자리에서 내려오게 합니다."
    ),
    BQ(
      "**분별은 사람을 의심하는 기술이 아닙니다.**",
      "**분별은 내가 가진 저울의 한계를 알고, 하나님의 진실 앞에 겸손히 서는 일입니다.**"
    ),
    P(
      "성경이 아무 기준도 주지 않는 것은 아닙니다. 다음 과부터는 체험의 크기나 신앙생활의 모양이 아니라, 성령께서 사람 안에 어떤 새로운 시선과 성향과 삶을 이루시는지를 살펴볼 것입니다.",
      "지금까지는 손을 펴는 시간이었습니다. 이제 무엇을 붙들어야 하는지 보게 될 것입니다."
    ),
    C(
      "잠깐 멈춥니다",
      "우리가 내려놓은 것은 신앙의 감정과 표현이 아닙니다.\n그것들로 나와 다른 사람을 재던 **열두 개의 저울**입니다.",
      "당신이 서는 근거는 체험의 모양이 아니라\n당신을 위해 다 이루신 그리스도에게 있습니다.",
      "**열두 개가 무너져도 당신은 무너지지 않습니다.**\n무너지는 것은 등급표입니다."
    ),
    H("핵심 정리"),
    L([
      "신앙을 유창하고 열정적으로 말하는 것은 귀할 수 있지만, 말의 능력만으로 마음의 뿌리를 알 수는 없습니다.",
      "양심의 찔림, 복음을 들음, 위로와 기쁨이 일정한 순서로 나타날 수 있습니다. 그러나 그 순서만으로 참된 믿음을 보증할 수는 없습니다.",
      "기도와 예배와 금식은 귀한 은혜의 통로입니다. 그러나 종교생활의 양이 하나님 앞에서의 신분을 결정하지 않습니다.",
      "하나님을 찬양하는 말이 많아도 마음은 멀 수 있습니다. 반대로 탄식이 많다고 해서 믿음이 없는 것은 아닙니다.",
      "구원의 확신은 귀하지만, 확신의 강도는 확신의 진실성을 스스로 증명하지 못합니다.",
      "경건한 사람들은 다른 사람에게 나타난 은혜를 알아볼 수 있습니다. 그러나 경건한 사람의 판단도 하나님의 판단과 동일하지는 않습니다.",
      "열두 가지는 가짜의 목록이 아니라, 그것만으로 참과 거짓을 확정할 수 없는 목록입니다.",
      "우리는 신앙생활을 버리는 것이 아니라, 그것으로 자신과 다른 사람을 등급화하던 습관을 내려놓습니다.",
      "우리의 최종 근거는 체험과 종교생활의 모양이 아니라 우리를 위해 다 이루신 그리스도입니다."
    ], true),
    H("나눔 질문"),
    N("*33~36번에 적으신 것 중 나누고 싶은 것만 나누십시오.*"),
    Q("l3-share-1"), Q("l3-share-2"), Q("l3-share-3"), Q("l3-share-4"),
    H("기도"),
    BQ(
      "주님,",
      "저는 신앙을 말하는 능력과",
      "분명하게 정리된 체험과",
      "기도와 예배의 열심과",
      "찬양과 확신과",
      "사람들의 인정으로",
      "저의 믿음을 증명하려 했습니다.",
      "그것들이 잘될 때는 저를 높였고,",
      "그것들이 약해질 때는 저를 의심하고 정죄했습니다.",
      "같은 저울을 곁에 있는 사람에게도 들이댔습니다.",
      "오늘 신앙의 말과 기도와 찬양을 버리는 것이 아니라,",
      "그것으로 저와 다른 사람을 재던 습관을 내려놓습니다.",
      "말이 막히는 날에도,",
      "열심이 약해지는 날에도,",
      "확신이 흔들리는 날에도",
      "저를 붙드시는 그리스도는 흔들리지 않음을 믿게 하여 주십시오.",
      "은사가 빛나고 열심이 넘치는 날에는",
      "그것으로 저를 높이지 않게 하시고,",
      "모든 것이 은혜임을 기억하게 하여 주십시오.",
      "사람을 쉽게 판정하지 않게 하시며,",
      "진리와 사랑 안에서 겸손히 분별하게 하여 주십시오.",
      "예수님의 이름으로 기도합니다. 아멘."
    )
  ]
};

function RichText({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g).filter(Boolean);
  return <>{parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) return <strong key={index}>{part.slice(2, -2)}</strong>;
    if (part.startsWith("*") && part.endsWith("*")) return <em key={index}>{part.slice(1, -1)}</em>;
    return <span key={index}>{part}</span>;
  })}</>;
}

export function DiscernmentLessonThreeWorkbook({ startPage }: { startPage?: string }) {
  const requestedIndex = startPage ? course.pages.findIndex((item) => item.key === startPage) : -1;
  const [pageIndex, setPageIndex] = useState(requestedIndex >= 0 ? requestedIndex : 0);
  const [data, setData] = useState<StudyState | null>(null);
  const [needsLogin, setNeedsLogin] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [notice, setNotice] = useState("");
  const contentRef = useRef<HTMLElement>(null);
  const page = course.pages[pageIndex];
  const blocks = pageBlocks[page.key] ?? [];
  const questionMap = useMemo(() => new Map(page.questions.map((question) => [question.key, question])), [page.questions]);
  const progressKeys = useMemo(() => new Set((data?.progress ?? []).map((item) => item.pageKey)), [data]);
  const completed = progressKeys.size;
  const percent = Math.round((completed / course.pages.length) * 100);

  async function load() {
    const response = await fetch("/api/member/study/discernment-lesson-three", { cache: "no-store" });
    const result = await response.json() as StudyState & { error?: string };
    if (response.status === 401) {
      setNeedsLogin(true);
      setData({ responses: [], progress: [], totalPages: course.pages.length });
      return;
    }
    if (!response.ok) {
      setNotice(result.error ?? "학습 기록을 불러오지 못했습니다.");
      return;
    }
    setNeedsLogin(false);
    setData(result);
    setAnswers(Object.fromEntries(result.responses.map((item) => [`${item.pageKey}:${item.questionKey}`, item.answer])));
  }

  useEffect(() => {
    void load().catch(() => setNotice("학습 기록을 불러오지 못했습니다."));
  }, []);

  function selectPage(nextIndex: number) {
    const boundedIndex = Math.max(0, Math.min(course.pages.length - 1, nextIndex));
    const nextPage = course.pages[boundedIndex];
    setPageIndex(boundedIndex);
    const url = new URL(window.location.href);
    url.searchParams.set("lesson", "3");
    url.searchParams.set("page", nextPage.key);
    url.hash = "study-content";
    window.history.pushState({ bibleStudyPage: nextPage.key }, "", url);
    window.requestAnimationFrame(() => {
      contentRef.current?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
      contentRef.current?.focus({ preventScroll: true });
    });
  }

  async function saveAnswer(questionKey: string, answer: string) {
    if (needsLogin) return;
    setAnswers((current) => ({ ...current, [`${page.key}:${questionKey}`]: answer }));
    const response = await fetch("/api/member/study/discernment-lesson-three", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "answer", pageKey: page.key, questionKey, answer })
    });
    setNotice(response.ok ? "답변을 저장했습니다." : "답변을 저장하지 못했습니다.");
    if (response.ok) await load();
  }

  async function completePage() {
    if (needsLogin) return;
    const response = await fetch("/api/member/study/discernment-lesson-three", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "complete-page", pageKey: page.key })
    });
    setNotice(response.ok ? "이 페이지의 공부 날짜와 완료 기록을 저장했습니다." : "완료 기록을 저장하지 못했습니다.");
    if (response.ok) await load();
  }

  function renderQuestion(questionKey: string) {
    const question = questionMap.get(questionKey);
    if (!question) return null;
    const answerKey = `${page.key}:${question.key}`;
    return <div className="web-study-questions" key={`question:${question.key}`}><label>
      <span>{question.label}</span>
      <strong style={{ whiteSpace: "pre-line" }}>{question.prompt}</strong>
      <textarea
        rows={5}
        value={answers[answerKey] ?? ""}
        disabled={needsLogin}
        onChange={(event) => setAnswers((current) => ({ ...current, [answerKey]: event.target.value }))}
        onBlur={(event) => void saveAnswer(question.key, event.target.value)}
        placeholder={needsLogin ? "로그인하면 이곳에 답을 기록할 수 있습니다." : "여기에 답을 적으면 자동 저장됩니다."}
      />
    </label></div>;
  }

  function renderBlock(block: Block, index: number) {
    if (block.type === "heading") return <section className="web-study-section" key={index}><h3>{block.text}</h3></section>;
    if (block.type === "paragraphs") return <div className="web-study-body" key={index}>{block.body.map((paragraph, paragraphIndex) => <p key={paragraphIndex} style={{ whiteSpace: "pre-line" }}><RichText text={paragraph} /></p>)}</div>;
    if (block.type === "scripture") return <blockquote className="web-study-section" key={index}>{block.refs.map((reference) => <p key={reference}><strong>[본문] {reference}</strong></p>)}</blockquote>;
    if (block.type === "question") return renderQuestion(block.key);
    if (block.type === "callout") return <aside className="web-study-login-callout" key={index}><strong>{block.title}</strong>{block.body.map((paragraph, paragraphIndex) => <p key={paragraphIndex} style={{ whiteSpace: "pre-line" }}><RichText text={paragraph} /></p>)}</aside>;
    if (block.type === "quote") return <blockquote className="web-study-section" key={index}>{block.body.map((paragraph, paragraphIndex) => <p key={paragraphIndex}><RichText text={paragraph} /></p>)}</blockquote>;
    if (block.type === "list") {
      const ListTag = block.ordered ? "ol" : "ul";
      return <section className="web-study-section" key={index}><ListTag>{block.items.map((item, itemIndex) => <li key={itemIndex}><RichText text={item} /></li>)}</ListTag></section>;
    }
    return <p key={index}><RichText text={block.text} /></p>;
  }

  return <section className="web-study-shell">
    <aside className="web-study-sidebar" aria-label="3과 교재 목차">
      <p className="section-kicker">분별에서 사랑으로</p>
      <h2>3과 학습 순서</h2>
      <div className="web-study-progress"><span style={{ width: `${percent}%` }} /></div>
      <strong>{needsLogin ? `총 ${course.pages.length}쪽 · 로그인 후 진도 저장` : `${completed}/${course.pages.length}쪽 완료 · ${percent}%`}</strong>
      <ol>{course.pages.map((item, index) => <li key={item.key}><button type="button" className={index === pageIndex ? "is-active" : ""} aria-current={index === pageIndex ? "page" : undefined} onClick={() => selectPage(index)}><span>{index + 1}</span><em><small>3과</small>{item.title}</em>{progressKeys.has(item.key) && <small>완료</small>}</button></li>)}</ol>
    </aside>
    <article className="web-study-page" id="study-content" ref={contentRef} tabIndex={-1}>
      <div className="web-study-page-heading"><div><p className="section-kicker">{page.eyebrow}</p><h2>{page.title}</h2></div><b>{String(pageIndex + 1).padStart(2, "0")} / {String(course.pages.length).padStart(2, "0")}</b></div>
      {needsLogin && <div className="web-study-login-callout"><strong>읽기는 누구나 할 수 있습니다.</strong><p>답변 저장과 공부 날짜 기록은 로그인한 교인에게 열립니다.</p><a className="primary-link" href={`/login?returnTo=${encodeURIComponent(`/bible-study/${course.slug}?lesson=3&page=${page.key}#study-content`)}`}>로그인하여 이 페이지부터 기록하기</a></div>}
      <div className="web-study-sections">{blocks.map(renderBlock)}</div>
      {notice && <p className="content-manager-notice" role="status">{notice}</p>}
      <div className="web-study-actions">
        <button type="button" className="text-action" disabled={pageIndex === 0} onClick={() => selectPage(pageIndex - 1)}>이전</button>
        {!needsLogin && <button type="button" className="primary-link" onClick={() => void completePage()}>{progressKeys.has(page.key) ? "완료 날짜 다시 저장" : "이 페이지 공부 완료"}</button>}
        <button type="button" className="text-action" disabled={pageIndex === course.pages.length - 1} onClick={() => selectPage(pageIndex + 1)}>다음</button>
      </div>
    </article>
  </section>;
}
