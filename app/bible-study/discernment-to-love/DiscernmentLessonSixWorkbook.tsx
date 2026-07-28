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
  | { type: "scripture"; label?: string; refs: string[] }
  | { type: "question"; key: string }
  | { type: "callout"; title: string; body: string[] }
  | { type: "quote"; body: string[] }
  | { type: "list"; ordered?: boolean; items: string[] }
  | { type: "note"; text: string };

const course = {
  slug: "discernment-to-love",
  lessonSlug: "discernment-lesson-6",
  title: "6과 · 사랑은 왜 마지막 기준이며 중심인가",
  pages: [
    {
      key: "l6-opening",
      eyebrow: "LESSON 06 · OPENING",
      title: "사랑은 왜 마지막 기준이며 중심인가",
      questions: [
        { key: "l6-q0", label: "✍️ 시작 질문", prompt: "‘저 사람은 사랑이 많다’고 생각한 사람이 있습니까. 무엇을 보고 그렇게 생각했습니까." }
      ]
    },
    {
      key: "l6-part-1",
      eyebrow: "LESSON 06 · PART 01",
      title: "사랑은 감정이 아닙니다. 그런데 여기 함정이 있습니다",
      questions: [
        { key: "l6-q1", label: "1번", prompt: "16절에서 우리는 무엇으로 사랑을 알게 되었습니까." },
        { key: "l6-q2", label: "2번", prompt: "17절에서 요한이 문제 삼는 사람은 어떤 사람입니까." },
        { key: "l6-q3", label: "3번", prompt: "18절에서 사랑을 무엇으로 하지 말고 무엇으로 하라고 합니까." },
        { key: "l6-q4", label: "4번", prompt: "‘유익은 사랑의 열매이지, 사랑의 증거가 아닙니다.’ 이 문장을 나의 말로 다시 써 보십시오." }
      ]
    },
    {
      key: "l6-part-2",
      eyebrow: "LESSON 06 · PART 02",
      title: "그러면 무엇이 사랑을 사랑이게 합니까",
      questions: [
        { key: "l6-q5", label: "5번", prompt: "바울이 여기 나열한 것들을 모두 찾아 적어 보십시오." },
        { key: "l6-q6", label: "6번", prompt: "5번에 적은 것들은 쓸모없는 일입니까, 대단히 유익한 일입니까." },
        { key: "l6-q7", label: "7번", prompt: "3절 마지막에서, 그 모든 것을 하고도 사랑이 없으면 어떻게 된다고 합니까." },
        { key: "l6-q8", label: "8번", prompt: "사랑이 ‘하지 않는’ 것들을 모두 찾아 적어 보십시오." },
        { key: "l6-q9", label: "9번", prompt: "그중에서 사랑이 무엇을 구하지 아니한다고 합니까." },
        { key: "l6-q10", label: "10번 · 나란히 놓고 봅니다", prompt: "재산을 다 나누어 주고 자기 몸을 내어 주는 것보다 더 큰 유익이 있겠습니까. 그런데도 사랑이 아닐 수 있다면, 두 경우를 갈라놓는 것은 무엇이겠습니까." }
      ]
    },
    {
      key: "l6-part-3",
      eyebrow: "LESSON 06 · PART 03",
      title: "그러면 나는 왜 전도합니까",
      questions: [
        { key: "l6-q11", label: "11번", prompt: "바울은 자기 마음에 무엇이 있다고 말합니까. (2절)" },
        { key: "l6-q12", label: "12번", prompt: "3절에서 바울이 자기 형제들을 위해 할 수 있다고 말한 것은 무엇입니까." },
        { key: "l6-q13", label: "13번", prompt: "모세는 백성의 죄를 아뢴 뒤에 무엇을 구합니까." },
        { key: "l6-q14", label: "14번 · 나란히 놓고 봅니다", prompt: "두 사람이 각각 무엇을 걸었습니까. 그들이 그것을 걸 수 있었던 이유는 무엇이겠습니까." },
        { key: "l6-q15", label: "15번 · 내 삶을 봅니다", prompt: "최근에 누군가에게 신앙을 권해 본 적이 있습니까. 그때 내 마음의 중심에 있던 것을 정직하게 적어 보십시오." },
        { key: "l6-q16", label: "16번 · 내 삶을 봅니다", prompt: "그 사람이 거절했을 때 어떤 마음이 들었습니까. 혹은 들 것 같습니까." },
        { key: "l6-q17", label: "17번 · 내 삶을 봅니다", prompt: "그 마음은 그를 위한 것이었습니까, 나를 위한 것이었습니까. 섞여 있다면 섞여 있다고 적으십시오." }
      ]
    },
    {
      key: "l6-part-4",
      eyebrow: "LESSON 06 · PART 04",
      title: "사랑의 반대말은 미움이 아닙니다",
      questions: [
        { key: "l6-q18", label: "18번", prompt: "3절에서 무엇으로 하지 말라고 합니까. 그리고 무엇으로 여기라고 합니까." },
        { key: "l6-q19", label: "19번", prompt: "4절에서 각각 누구의 일을 돌보아야 한다고 합니까." },
        { key: "l6-q20", label: "20번", prompt: "5절 이하에서, 그리스도 예수께서 자기를 어떻게 하셨습니까. 세 가지 이상 적어 보십시오." },
        { key: "l6-q21", label: "21번", prompt: "내가 최근에 한 친절한 일 하나를 떠올려 보십시오. 그 일에서 내가 얻은 것이 있다면 무엇입니까." }
      ]
    },
    {
      key: "l6-part-5",
      eyebrow: "LESSON 06 · PART 05",
      title: "사랑이 마지막이자 중심인 이유",
      questions: [
        { key: "l6-q22", label: "22번", prompt: "하나님은 무엇이시라고 16절은 말합니까." },
        { key: "l6-q23", label: "23번", prompt: "20절에서, 하나님을 사랑한다고 하면서 형제를 미워하는 사람을 요한은 무엇이라고 부릅니까." },
        { key: "l6-q24", label: "24번", prompt: "20절 후반부에서 요한이 대는 이유는 무엇입니까." },
        { key: "l6-q25", label: "25번", prompt: "사람들이 우리를 예수님의 제자로 알아보게 되는 것은 무엇을 통해서입니까." }
      ]
    },
    {
      key: "l6-part-6",
      eyebrow: "LESSON 06 · PART 06",
      title: "그리고 남는 질문 하나",
      questions: [
        { key: "l6-q26", label: "26번", prompt: "언제나 친절하고, 절대 화내지 않고, 24시간 응답하고, 내가 무엇을 필요로 하는지 나보다 먼저 알아차리는 무엇인가가 있다면 무엇을 물어야 하겠습니까. 지금 떠오르는 것이 있습니까." }
      ]
    },
    {
      key: "l6-closing",
      eyebrow: "LESSON 06 · CLOSING",
      title: "내 삶을 봅니다 · 핵심 정리 · 나눔 · 기도",
      questions: [
        { key: "l6-q27", label: "27번", prompt: "이 과를 시작할 때 적으신 것을 다시 보십시오. 내가 ‘사랑이 많다’고 판단한 근거는 무엇이었습니까. 지금 다시 쓴다면 어떻게 쓰시겠습니까.\n\n처음에 적은 것 : _________________________________\n지금 : _________________________________" },
        { key: "l6-q28", label: "28번", prompt: "지금 내 곁에 있는 한 사람을 떠올려 보십시오. 그 사람에게 지금 필요한 것은 무엇입니까. 내가 주고 싶은 것과 같습니까, 다릅니까." },
        { key: "l6-q29", label: "29번", prompt: "사랑하지 못한 일 가운데 합리화하지 않고 하나님 앞에 인정해야 할 것이 있다면 무엇입니까." },
        { key: "l6-share-1", label: "나눔 질문 1", prompt: "‘유익은 사랑의 열매이지 사랑의 증거가 아니다’라는 문장이 나에게 어떻게 들립니까." },
        { key: "l6-share-2", label: "나눔 질문 2", prompt: "전도의 동기를 정직하게 들여다본 적이 있습니까. 오늘 무엇이 보였습니까." },
        { key: "l6-share-3", label: "나눔 질문 3", prompt: "‘친절한 자기중심성’이라는 말이 떠올리게 하는 장면이 있습니까. 남의 장면이 아니라 내 장면으로 떠올려 보십시오." },
        { key: "l6-share-4", label: "나눔 질문 4", prompt: "우리 목장에서 사랑이 실제로 자라고 있다고 느끼는 지점이 있다면 어디입니까." }
      ]
    }
  ] satisfies StudyPage[]
};

const H = (text: string): Block => ({ type: "heading", text });
const P = (...body: string[]): Block => ({ type: "paragraphs", body });
const S = (...refs: string[]): Block => ({ type: "scripture", refs });
const Q = (key: string): Block => ({ type: "question", key });
const C = (title: string, ...body: string[]): Block => ({ type: "callout", title, body });
const B = (...body: string[]): Block => ({ type: "quote", body });
const L = (...items: string[]): Block => ({ type: "list", items });
const OL = (...items: string[]): Block => ({ type: "list", ordered: true, items });
const N = (text: string): Block => ({ type: "note", text });

const pageBlocks: Record<string, Block[]> = {
  "l6-opening": [
    H("시작하며"),
    P("**다섯 번째 기준으로 돌아갑니다.**"),
    P("지난 과에서 우리는 다섯을 보았습니다. 그리스도를 높이는가, 사탄의 왕국이 무너지는가, 성경을 귀하게 여기고 순종하게 하는가, 진리의 영으로 이끄는가, 그리고 사랑의 열매를 맺는가."),
    P("다섯 중 하나를 위해 한 과를 따로 쓰는 데는 두 가지 이유가 있습니다."),
    P("**첫째, 사랑은 다섯 중 하나가 아니기 때문입니다.**"),
    P("4과를 기억하십니까. 새 언약에서 하나님께서 마음에 새기시는 것이 무엇이었습니까. 잔을 드시며 ‘이 잔은 내 피로 세우는 새 언약’이라 하신 그 밤에, ‘서로 사랑하라’는 새 계명이 함께 주어졌습니다. 성령께서 마음에 부으시는 것이 하나님의 사랑이라고 로마서는 말합니다."),
    P("그렇다면 사랑은 다섯 개의 항목 중 다섯 번째가 아니라, **앞의 넷이 실제로 일어났는지가 드러나는 자리**입니다."),
    P("**둘째, 사랑이 가장 흉내 내기 쉽기 때문입니다.**"),
    P("2과에서 우리는 이미 보았습니다. 유다의 말은 그 자리에서 사랑처럼 들렸습니다. 사랑처럼 보이는 것은 사랑의 증거가 아니었습니다."),
    P("그래서 이 과는 조심스럽게 갑니다. 사랑을 열세 번째 저울로 만들지 않으면서, 사랑이 왜 중심인지를 봅니다."),
    Q("l6-q0")
  ],
  "l6-part-1": [
    P("먼저 분명히 하고 시작합니다."),
    B("**사랑은 따뜻한 감정이 아니라, 실제 유익을 만들어 내는 힘입니다.**"),
    P("사랑은 대충 하지 않습니다. 더 나은 것을 만들려 합니다. 힘을 자기만을 위해 쓰지 않고 남을 살리는 데 씁니다. 무너진 것을 다시 세우고, 상한 것을 만지고, 사람이 자기답게 피어나게 합니다."),
    P("그러니 사랑에는 반드시 결과가 따릅니다. 마음만 있고 아무 일도 일어나지 않는 것을 사랑이라 부를 수 없습니다."),
    H("읽기"),
    S("요한일서 3:16-18"),
    Q("l6-q1"), Q("l6-q2"), Q("l6-q3"),
    H("짚어 봅니다"),
    P("요한은 사랑을 마음속에 두지 않습니다. 형제의 궁핍함을 보고도 마음을 닫는 사람에게, 어떻게 하나님의 사랑이 그 안에 거하겠느냐고 묻습니다. 말과 혀로만 하지 말고 행함과 진실함으로 하라고 합니다."),
    P("여기까지는 분명합니다. **사랑은 유익을 만들어 냅니다.**"),
    H("그런데 뒤집으면 성립하지 않습니다"),
    P("여기서 우리는 아주 조심해야 합니다."),
    P("사랑이 유익을 만들어 낸다고 해서, **유익을 만들어 내는 모든 것이 사랑인 것은 아닙니다.**"),
    P("1과에서 우리는 사기 이야기를 했습니다. 사기꾼이 어떻게 사기를 칩니까. 잘해 줍니다. 친절하고, 세심하고, 필요한 것을 알아서 챙겨 줍니다. 잘해 주지 않으면 사기가 성립하지 않습니다."),
    P("받는 사람 입장에서는 실제로 유익합니다. 기분이 좋아지고, 도움을 받고, 이해받는다고 느낍니다. 그 유익은 가짜가 아닙니다. 진짜로 유익합니다."),
    P("그러니 이렇게 정리해야 합니다."),
    B("**유익은 사랑의 열매이지, 사랑의 증거가 아닙니다.**"),
    Q("l6-q4")
  ],
  "l6-part-2": [
    H("읽기 ①"),
    S("고린도전서 13:1-3"),
    Q("l6-q5"), Q("l6-q6"), Q("l6-q7"),
    H("읽기 ②"),
    S("고린도전서 13:4-7"),
    Q("l6-q8"), Q("l6-q9"),
    H("나란히 놓고 봅니다"),
    Q("l6-q10"),
    H("짚어 봅니다"),
    P("3절을 다시 보십시오."),
    P("바울이 나열한 것은 초라한 일들이 아닙니다. 천사의 말, 예언, 모든 비밀과 지식, 산을 옮기는 믿음, 모든 재산을 나누어 주는 것, 자기 몸을 내어 주는 것. **유익의 극한입니다.** 이보다 더 큰 유익을 만들어 낼 방법이 없습니다."),
    P("그런데 바울은 사랑이 없으면 ‘내게 아무 유익이 없느니라’고 말합니다."),
    P("그러면 무엇이 갈라놓습니까. 4절에서 7절 사이에 답이 있습니다."),
    B("**사랑은 자기의 유익을 구하지 아니하며**"),
    P("축은 여기입니다. **얼마나 주었는가가 아니라 누구를 위해 주었는가입니다.**"),
    P("같은 행동이 두 방향으로 설 수 있습니다. 재산을 나누어 주는 일도 상대를 살리려고 할 수 있고, 내가 그런 사람이 되고 싶어서 할 수 있습니다. 몸을 내어 주는 일도 사랑에서 나올 수 있고, 인정받고 싶은 마음에서 나올 수 있습니다."),
    P("받는 사람은 대개 구별하지 못합니다. 결과가 같기 때문입니다.")
  ],
  "l6-part-3": [
    P("여기가 이 과에서 가장 아픈 자리입니다."),
    H("읽기 ①"),
    S("로마서 9:1-3"),
    Q("l6-q11"), Q("l6-q12"),
    H("읽기 ②"),
    S("출애굽기 32:31-32"),
    Q("l6-q13"),
    H("나란히 놓고 봅니다"),
    Q("l6-q14"),
    H("짚어 봅니다"),
    P("바울과 모세는 자기 구원을 걸었습니다."),
    P("이것이 실제로 가능한 일인지를 따지려는 것이 아닙니다. 두 사람의 마음이 어디에 있었는지가 보이면 충분합니다. **그들의 관심의 중심에 자기 자신이 없었습니다.**"),
    P("이제 반대편을 보겠습니다."),
    P("전도할 수 있는 다른 이유들이 있습니다. 전도하면 상급이 있다고 배웠기 때문일 수 있습니다. 하지 않으면 책임을 묻는 눈치가 있어서일 수 있습니다. 교회에서 인정받고 싶어서일 수 있습니다. 열매가 있어야 내 신앙이 증명될 것 같아서일 수 있습니다."),
    P("이 이유들이 전부 악한 것은 아닙니다. 상급은 성경이 실제로 말하는 것입니다."),
    P("다만 물어야 할 것이 있습니다."),
    B("**내가 전하려는 것이 그 사람의 자유입니까, 나의 확인입니까.**"),
    P("이것은 사소한 차이가 아닙니다. 전도의 동기가 내 쪽으로 기울면, 사람은 대상이 됩니다. 그가 믿어야 내가 안심하기 때문에 그를 설득하는 것입니다. 그러면 그가 거절할 때 서운해집니다. 서운함은 그를 위한 것이 아니라 나를 위한 감정입니다."),
    H("내 삶을 봅니다"),
    Q("l6-q15"), Q("l6-q16"), Q("l6-q17"),
    C("잠깐 멈춥니다",
      "17번에서 비율을 재라고 하지 않았습니다. 일부러 그랬습니다.",
      "내 동기가 몇 퍼센트나 순수한지를 재기 시작하면, 그것이 곧 열세 번째 잣대가 됩니다. 우리는 지금까지 열두 개를 내려놓았는데, 여기서 새 저울을 손에 쥐게 됩니다.",
      "그리고 정직하게 말씀드리면, 동기가 순수한 사람은 없습니다. 바울과 모세도 그 자리에 하루아침에 선 것이 아닙니다.",
      "**동기는 노력해서 정화되는 것이 아닙니다.** 1과에서 배운 것을 기억하십시오. 내가 사랑받고 있다는 것이 실제가 되는 만큼, 사람을 내 필요로 붙드는 힘이 줄어듭니다. 순서가 그렇습니다.",
      "그러니 지금 물을 것은 ‘내 동기가 순수한가’가 아니라 **‘내 동기가 어느 쪽으로 옮겨 가고 있는가’**입니다."
    )
  ],
  "l6-part-4": [
    P("사랑을 이야기하던 자리에서 이런 장면을 본 적이 있습니다."),
    P("한참 사랑에 대해 말하던 사람이, 잠깐 쉬는 사이에 곁에 있던 자기 어머니에게 짜증을 냈습니다. 말은 그대로였는데, 그 한순간에 다른 것이 보였습니다."),
    P("그를 나쁜 사람이라고 말하려는 것이 아닙니다. 우리 모두 그렇습니다. 다만 사랑의 반대편에 있는 것이 무엇인지가 그 장면에 드러났습니다."),
    P("**미움이 아니었습니다.**"),
    H("읽기"),
    S("빌립보서 2:3-8"),
    Q("l6-q18"), Q("l6-q19"), Q("l6-q20"),
    H("짚어 봅니다"),
    P("바울이 사랑의 반대편에 놓은 것은 미움이 아니라 **다툼과 허영**입니다. 그리고 그 뿌리는 하나입니다. **자기 자신**입니다."),
    P("미움도 그 뿌리에서 나오는 여러 형태 중 하나일 뿐입니다. 그래서 이런 일이 가능합니다. 미워하지 않으면서도 사랑하지 않을 수 있습니다. **친절한 자기중심성**이라는 것이 있습니다."),
    P("이것이 사랑을 흉내 내기 쉬운 이유입니다. 미움은 감추기 어렵지만 자기중심성은 얼마든지 따뜻해 보일 수 있습니다."),
    P("그리고 그리스도께서 하신 일을 보십시오. 자기를 비우시고, 종의 형체를 가지시고, 자기를 낮추시고, 죽기까지 복종하셨습니다. 그리스도의 사랑에서 반복되는 동사는 전부 **자기를 향한 것**입니다. 자기를 비우고 자기를 낮추셨습니다."),
    B("**사랑은 자기를 내어 주는 것이고, 그 반대는 자기를 채우는 것입니다.**"),
    Q("l6-q21"),
    N("*이 질문은 그 친절이 가짜였다고 말하려는 것이 아닙니다. 얻은 것이 있어도 사랑일 수 있습니다. 다만 얻은 것이 있었다는 사실 자체를 아는 사람과 모르는 사람은 다릅니다.*")
  ],
  "l6-part-5": [
    H("읽기 ①"),
    S("요한일서 4:16-21"),
    Q("l6-q22"), Q("l6-q23"), Q("l6-q24"),
    H("읽기 ②"),
    S("요한복음 13:34-35"),
    Q("l6-q25"),
    H("짚어 봅니다"),
    P("요한의 논리는 단순합니다. 보이는 형제를 사랑하지 않는 사람이 보이지 않는 하나님을 사랑할 수는 없다는 것입니다."),
    P("그래서 사랑은 다섯 중 마지막에 놓이면서 동시에 중심이 됩니다. **앞의 넷이 진짜로 일어났다면 여기서 보이기 때문입니다.**"),
    L(
      "그리스도를 진짜로 높이게 되었다면, 그분이 자기를 내어 주신 방식이 내 안에서 자랍니다.",
      "죄의 지배가 진짜로 약해졌다면, 사람을 이용하던 습관이 흔들립니다.",
      "성경을 진짜로 순종하게 되었다면, 서로 사랑하라는 계명을 건너뛸 수 없습니다.",
      "진리의 영이 진짜로 이끄셨다면, 불의를 사랑이라 부르지 않게 됩니다."
    ),
    P("그리고 다섯 번째가 다시 첫 번째로 돌아갑니다. 우리가 서로 사랑할 때, 사람들이 그것을 보고 **그리스도의 제자인 줄 알게** 되기 때문입니다."),
    B(
      "그리스도를 높임 → 죄가 약해짐 → 성경에 순종함 → 진리로 인도받음 → 사랑의 열매가 자람",
      "→ **그 사랑이 다시 그리스도를 드러냄**"
    ),
    P("다섯은 줄이 아니라 원입니다. 점수를 매기는 항목이 아니라, 한 분 성령께서 하시는 한 가지 일의 다섯 방향입니다.")
  ],
  "l6-part-6": [
    P("이 과에서 우리는 이것을 확인했습니다."),
    B("유익은 사랑의 열매이지 사랑의 증거가 아니다."),
    P("그렇다면 한 가지 질문이 남습니다."),
    P("**유익을 아주 잘 만들어 내는 것이 나타난다면, 우리는 무엇을 물어야 합니까.**"),
    P("언제나 친절하고, 절대 화내지 않고, 24시간 응답하고, 내가 무엇을 필요로 하는지 나보다 먼저 알아차리는 무엇인가가 있다면 말입니다."),
    Q("l6-q26"),
    P("이 질문은 8과와 9과에서 다룹니다.")
  ],
  "l6-closing": [
    H("내 삶을 봅니다"),
    Q("l6-q27"), Q("l6-q28"), Q("l6-q29"),
    C("잠깐 멈춥니다",
      "이 과를 읽으면서 이런 결론에 도달하셨을 수 있습니다.",
      "*내 사랑에는 늘 내가 섞여 있다. 그러면 내 사랑은 전부 가짜인가.*",
      "요한일서 4장 19절을 보십시오.",
      "**우리가 사랑함은 그가 먼저 우리를 사랑하셨음이라.**",
      "순서가 이렇습니다. 우리가 잘 사랑해서 하나님께 받아들여지는 것이 아닙니다. 먼저 사랑받았기 때문에 사랑을 배우기 시작하는 것입니다.",
      "4과에서 본 것을 기억하십시오. 새 언약은 우리가 지켜서 유지되는 언약이 아니라, 우리가 깨뜨려도 그분이 붙드시는 언약입니다. 마음에 사랑을 새기시는 분도 우리가 아닙니다.",
      "오늘 내 사랑이 초라해 보인다면, 그것은 내가 언약 밖에 있다는 뜻이 아니라 **아직 새겨지는 중**이라는 뜻입니다.",
      "사랑은 은혜의 값이 아니라 은혜의 열매입니다."
    ),
    H("핵심 정리"),
    OL(
      "사랑은 감정이 아니라 실제 유익을 만들어 내는 힘입니다. 마음만 있고 아무 일도 일어나지 않는 것을 사랑이라 부를 수 없습니다.",
      "그러나 뒤집으면 성립하지 않습니다. 유익은 사랑의 열매이지 사랑의 증거가 아닙니다.",
      "사기꾼도 잘해 줍니다. 받는 사람이 느끼는 유익은 진짜입니다.",
      "고린도전서 13장 3절은 유익의 극한을 나열하고도 사랑이 없을 수 있다고 말합니다.",
      "두 경우를 갈라놓는 것은 크기가 아니라 방향입니다. 사랑은 자기의 유익을 구하지 아니합니다.",
      "바울과 모세는 자기 구원을 걸었습니다. 그들의 관심의 중심에 자기가 없었습니다.",
      "전도의 동기가 내 쪽으로 기울면 사람은 대상이 됩니다.",
      "동기는 노력으로 정화되지 않습니다. 사랑받은 만큼 옮겨 갑니다.",
      "사랑의 반대말은 미움이 아니라 자기중심성입니다. 친절한 자기중심성이 있습니다.",
      "그리스도의 사랑에서 반복되는 동사는 자기를 비우고 자기를 낮추는 것입니다.",
      "사랑은 다섯 중 마지막이면서 중심입니다. 앞의 넷이 진짜라면 여기서 보입니다.",
      "다섯은 줄이 아니라 원입니다. 사랑이 다시 그리스도를 드러냅니다.",
      "우리가 사랑함은 그가 먼저 우리를 사랑하셨기 때문입니다."
    ),
    H("나눔 질문"),
    N("*15~17번, 27~29번에 적으신 것 중 나누고 싶은 것만 나누십시오.*"),
    Q("l6-share-1"), Q("l6-share-2"), Q("l6-share-3"), Q("l6-share-4"),
    H("기도"),
    B(
      "주님,",
      "저는 사랑을 잘하는 사람이 되고 싶었습니다.",
      "그런데 그 마음의 상당 부분이",
      "저를 위한 것이었음을 오늘 봅니다.",
      "잘해 주면서도 저를 채웠고,",
      "사람을 살린다고 하면서",
      "제 불안을 덜었습니다.",
      "주께서는 자기를 비우셨습니다.",
      "자기를 낮추시고 죽기까지 복종하셨습니다.",
      "저는 그 반대 방향으로 살아왔습니다.",
      "이 발견을 저를 벌하는 데 쓰지 않게 하시고,",
      "제 동기를 재는 새 저울로 만들지 않게 하십시오.",
      "제가 사랑받고 있다는 것이 실제가 되게 하시고,",
      "그만큼 사람을 제 필요로 붙드는 힘이 줄어들게 하십시오.",
      "우리가 사랑함은 주께서 먼저 사랑하셨기 때문입니다.",
      "오늘 제 사랑이 초라해 보여도",
      "새기고 계신 분이 계심을 믿습니다.",
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

export function DiscernmentLessonSixWorkbook({ startPage }: { startPage?: string }) {
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
    const response = await fetch("/api/member/study/discernment-lesson-six", { cache: "no-store" });
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
    url.searchParams.set("lesson", "6");
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
    const response = await fetch("/api/member/study/discernment-lesson-six", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "answer", pageKey: page.key, questionKey, answer })
    });
    setNotice(response.ok ? "답변을 저장했습니다." : "답변을 저장하지 못했습니다.");
    if (response.ok) await load();
  }

  async function completePage() {
    if (needsLogin) return;
    const response = await fetch("/api/member/study/discernment-lesson-six", {
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
      <strong style={{ whiteSpace: "pre-line" }}><RichText text={question.prompt} /></strong>
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
    if (block.type === "paragraphs") return <div className="web-study-body" key={index}>{block.body.map((paragraph, paragraphIndex) => <p key={paragraphIndex}><RichText text={paragraph} /></p>)}</div>;
    if (block.type === "scripture") return <blockquote className="web-study-section" key={index}><p className="web-study-section-label">{block.label ?? "본문"}</p>{block.refs.map((reference) => <p key={reference}><strong>[본문] {reference}</strong></p>)}</blockquote>;
    if (block.type === "question") return renderQuestion(block.key);
    if (block.type === "callout") return <aside className="web-study-login-callout" key={index}><strong>{block.title}</strong>{block.body.map((paragraph, paragraphIndex) => <p key={paragraphIndex}><RichText text={paragraph} /></p>)}</aside>;
    if (block.type === "quote") return <blockquote className="web-study-section" key={index}>{block.body.map((paragraph, paragraphIndex) => <p key={paragraphIndex}><RichText text={paragraph} /></p>)}</blockquote>;
    if (block.type === "list") {
      const ListTag = block.ordered ? "ol" : "ul";
      return <section className="web-study-section" key={index}><ListTag>{block.items.map((item, itemIndex) => <li key={itemIndex}><RichText text={item} /></li>)}</ListTag></section>;
    }
    return <p key={index}><RichText text={block.text} /></p>;
  }

  return <section className="web-study-shell">
    <aside className="web-study-sidebar" aria-label="교재 목차">
      <p className="section-kicker">분별에서 사랑으로</p>
      <h2>6과 학습 순서</h2>
      <div className="web-study-progress"><span style={{ width: `${percent}%` }} /></div>
      <strong>{needsLogin ? `총 ${course.pages.length}쪽 · 로그인 후 진도 저장` : `${completed}/${course.pages.length}쪽 완료 · ${percent}%`}</strong>
      <ol>{course.pages.map((item, index) => <li key={item.key}><button type="button" className={index === pageIndex ? "is-active" : ""} aria-current={index === pageIndex ? "page" : undefined} onClick={() => selectPage(index)}><span>{index + 1}</span><em><small>{item.eyebrow}</small>{item.title}</em>{progressKeys.has(item.key) && <small>완료</small>}</button></li>)}</ol>
    </aside>
    <article className="web-study-page" id="study-content" ref={contentRef} tabIndex={-1}>
      <div className="web-study-page-heading"><div><p className="section-kicker">{page.eyebrow}</p><h2>{page.title}</h2></div><b>{String(pageIndex + 1).padStart(2, "0")} / {String(course.pages.length).padStart(2, "0")}</b></div>
      {needsLogin && <div className="web-study-login-callout"><strong>읽기는 누구나 할 수 있습니다.</strong><p>답변 저장, 공부 날짜 기록, 진도 관리는 로그인한 교인에게 열립니다.</p><a className="primary-link" href={`/login?returnTo=${encodeURIComponent(`/bible-study/${course.slug}?lesson=6&page=${page.key}#study-content`)}`}>로그인하여 이 페이지부터 기록하기</a></div>}
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
