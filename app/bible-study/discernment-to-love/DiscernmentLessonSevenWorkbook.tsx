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
  | { type: "table"; headers: string[]; rows: string[][] }
  | { type: "note"; text: string };

const course = {
  slug: "discernment-to-love",
  lessonSlug: "discernment-lesson-7",
  title: "7과 · 성경은 왜 절대적인 기준인가",
  pages: [
    {
      key: "l7-opening",
      eyebrow: "LESSON 07 · OPENING",
      title: "성경은 왜 절대적인 기준인가",
      questions: [
        { key: "l7-q0", label: "✍️ 시작 질문", prompt: "새로운 가르침을 들었을 때, 나는 무엇 때문에 그것을 쉽게 믿습니까. 말하는 사람의 확신, 성경 인용의 양, 신비한 체험, 좋은 결과, 공동체의 인정 가운데 하나를 적어 보십시오. 과를 마치고 다시 보겠습니다." }
      ]
    },
    {
      key: "l7-part-1",
      eyebrow: "LESSON 07 · PART 01",
      title: "말씀이라고 부르면 다 하나님의 말씀 아닌가요?",
      questions: [
        { key: "l7-q1", label: "1번", prompt: "여호와의 율법과 증거는 영혼과 지혜에 어떤 일을 합니까. (7절)" },
        { key: "l7-q2", label: "2번", prompt: "여호와의 교훈과 계명은 마음과 눈에 어떤 일을 합니까. (8절)" },
        { key: "l7-q3", label: "3번", prompt: "시편 기자는 하나님의 말씀을 금과 꿀에 비해 어떻게 평가합니까. (10절)" },
        { key: "l7-q4", label: "4번", prompt: "하나님의 종은 말씀을 통해 무엇을 받으며, 그것을 지킬 때 무엇이 있다고 합니까. (11절)" },
        { key: "l7-q5", label: "5번", prompt: "베드로는 성도들에게 무엇을 주의하라고 권합니까. (19절)" },
        { key: "l7-q6", label: "6번", prompt: "성경의 예언은 누구의 뜻으로 낸 것이 아니며, 사람들이 누구에게 감동되어 말한 것입니까. (20-21절)" },
        { key: "l7-q7", label: "7번 · 나란히 놓고 봅니다", prompt: "두 본문에서 성경의 권위는 유명한 사람의 지위와 말솜씨에서 나옵니까, 아니면 성령께서 주신 기록이라는 사실에서 나옵니까." }
      ]
    },
    {
      key: "l7-part-2",
      eyebrow: "LESSON 07 · PART 02",
      title: "성경 구절을 많이 인용하면 성경적인 것 아닌가요?",
      questions: [
        { key: "l7-q8", label: "8번", prompt: "바울의 편지에는 어떤 것이 있으며, 무식한 사람들과 굳세지 못한 사람들은 그것을 어떻게 합니까. (16절)" },
        { key: "l7-q9", label: "9번", prompt: "성도는 미혹에 이끌려 굳센 데서 떨어지지 않기 위해 무엇을 해야 합니까. (17-18절)" },
        { key: "l7-q10", label: "10번", prompt: "사두개인들은 어떤 성경의 규정을 근거로 부활에 관한 질문을 만들었습니까. (24절)" },
        { key: "l7-q11", label: "11번", prompt: "예수님은 그들이 무엇을 알지 못하여 오해했다고 말씀하십니까. (29절)" },
        { key: "l7-q12", label: "12번", prompt: "예수님은 출애굽기의 ‘아브라함의 하나님, 이삭의 하나님, 야곱의 하나님’이라는 말씀을 통해 부활에 관해 무엇을 밝히십니까. (31-32절)" },
        { key: "l7-q13", label: "13번 · 나란히 놓고 봅니다", prompt: "두 본문에서 사람들은 성경을 버리지 않고도 성경을 억지로 풀거나 잘못된 전제에 맞추어 오해할 수 있습니까." }
      ]
    },
    {
      key: "l7-part-3",
      eyebrow: "LESSON 07 · PART 03",
      title: "한 사람만 성경의 비밀을 풀 수 있다면 더 확실하지 않나요?",
      questions: [
        { key: "l7-q14", label: "14번", prompt: "베뢰아 사람들은 말씀을 어떤 마음으로 받았습니까." },
        { key: "l7-q15", label: "15번", prompt: "그들은 바울의 말이 그러한가 하여 날마다 무엇을 살폈습니까." },
        { key: "l7-q16", label: "16번", prompt: "누가는 그들의 확인하는 태도를 불신앙이라고 합니까, 너그럽고 고상한 태도라고 합니까." },
        { key: "l7-q17", label: "17번", prompt: "바울은 갈라디아 성도들이 무엇으로 옮겨 가는 것을 이상하게 여겼습니까." },
        { key: "l7-q18", label: "18번", prompt: "바울 자신이나 하늘에서 온 천사라도 이미 전한 복음과 다른 것을 전하면 어떻게 하라고 합니까." },
        { key: "l7-q19", label: "19번 · 나란히 놓고 봅니다", prompt: "베뢰아 사람들은 사도 바울의 말도 성경으로 확인했습니다. 갈라디아서는 사도와 천사의 말도 복음 아래 둡니다. 그렇다면 어떤 지도자나 조직이 성경의 검토를 면제받을 수 있습니까." },
        { key: "l7-q20", label: "20번 · 현장의 장면", prompt: "상대방이 나와 같은 성경 단어를 사용하더라도, 그 단어의 뜻과 전제를 다시 확인해야 하는 이유는 무엇입니까." }
      ]
    },
    {
      key: "l7-part-4",
      eyebrow: "LESSON 07 · PART 04",
      title: "비유와 암호를 많이 풀수록 더 깊은 성경 해석 아닌가요?",
      questions: [
        { key: "l7-q21", label: "21번", prompt: "예수님은 모세와 모든 선지자의 글에서 누구에 관한 것을 설명하셨습니까. (27절)" },
        { key: "l7-q22", label: "22번", prompt: "예수님은 율법과 선지자와 시편에 기록된 것이 어떻게 되어야 한다고 말씀하셨습니까. (44절)" },
        { key: "l7-q23", label: "23번", prompt: "성경이 증언하는 복음의 중심 사건과 선포는 무엇입니까. (46-47절)" },
        { key: "l7-q24", label: "24번", prompt: "바울은 부끄러워 숨은 일을 버리고 무엇을 하지 않는다고 말합니까. (2절)" },
        { key: "l7-q25", label: "25번", prompt: "바울은 무엇을 나타내어 각 사람의 양심에 자신을 추천합니까. (2절)" },
        { key: "l7-q26", label: "26번", prompt: "바울이 전한 중심은 자기 자신입니까, 주 되신 예수 그리스도입니까. (5절)" },
        { key: "l7-q27", label: "27번", prompt: "레위 사람들은 백성에게 율법을 어떻게 읽고 그 뜻을 어떻게 알게 했습니까." },
        { key: "l7-q28", label: "28번 · 나란히 놓고 봅니다", prompt: "세 본문이 보여 주는 성경 해석은 특정 지도자의 비밀 암호를 드러내는 데 중심이 있습니까. 성경의 뜻을 분명히 밝히고 그리스도와 복음으로 이끄는 데 중심이 있습니까." }
      ]
    },
    {
      key: "l7-part-5",
      eyebrow: "LESSON 07 · PART 05",
      title: "성령께서 직접 알려 주셨다면 다른 사람이 검토하면 안 되는 것 아닌가요?",
      questions: [
        { key: "l7-q29", label: "29번", prompt: "성도는 성령과 예언에 대해 각각 무엇을 하지 말아야 합니까. (19-20절)" },
        { key: "l7-q30", label: "30번", prompt: "모든 것을 어떻게 한 뒤 무엇을 붙들어야 합니까. (21절)" },
        { key: "l7-q31", label: "31번", prompt: "악은 어떤 모양이라도 어떻게 해야 합니까. (22절)" },
        { key: "l7-q32", label: "32번", prompt: "예언하는 사람 둘이나 셋이 말할 때 다른 사람들은 무엇을 해야 합니까. (29절)" },
        { key: "l7-q33", label: "33번", prompt: "하나님은 무질서의 하나님이 아니라 어떤 분이십니까. (33절)" },
        { key: "l7-q34", label: "34번", prompt: "점치는 영에 사로잡힌 여종은 바울과 동역자들에 대해 어떤 말을 외쳤습니까. (17절)" },
        { key: "l7-q35", label: "35번", prompt: "그 말은 내용만 보면 참되게 들렸지만, 바울은 그 말의 배후에 있는 영을 어떻게 대했습니까. (18절)" },
        { key: "l7-q36", label: "36번 · 나란히 놓고 봅니다", prompt: "성경은 성령의 역사를 막지 말라고 하면서 동시에 시험하고 분별하라고 합니다. 이 두 명령은 서로 반대됩니까, 함께 지켜야 합니까." }
      ]
    },
    {
      key: "l7-part-6",
      eyebrow: "LESSON 07 · PART 06",
      title: "성경을 많이 알면 영적으로 성숙한 것 아닌가요?",
      questions: [
        { key: "l7-q37", label: "37번", prompt: "사람들은 성경에서 무엇을 얻는다고 생각하여 성경을 연구했습니까." },
        { key: "l7-q38", label: "38번", prompt: "예수님은 성경이 누구에 대해 증언한다고 말씀하십니까." },
        { key: "l7-q39", label: "39번", prompt: "그들은 생명을 얻기 위해 누구에게 오기를 원하지 않았습니까." },
        { key: "l7-q40", label: "40번", prompt: "성도는 마음에 심어진 말씀을 어떤 태도로 받아야 합니까. (21절)" },
        { key: "l7-q41", label: "41번", prompt: "말씀을 듣기만 하고 행하지 않으면 누구를 속이는 것입니까. (22절)" },
        { key: "l7-q42", label: "42번", prompt: "자유롭게 하는 온전한 율법을 들여다보고 행하는 사람은 어떤 복을 받습니까. (25절)" },
        { key: "l7-q43", label: "43번", prompt: "예수님은 자신을 ‘주여 주여’라고 부르면서 무엇을 행하지 않는 사람에게 질문하십니까. (46절)" },
        { key: "l7-q44", label: "44번", prompt: "예수님의 말을 듣고 행하는 사람과 듣고도 행하지 않는 사람은 각각 어떤 집을 세운 사람과 같습니까. (47-49절)" },
        { key: "l7-q45", label: "45번 · 나란히 놓고 봅니다", prompt: "세 본문에서 성경 지식의 목적은 정보를 많이 쌓는 데 있습니까. 그리스도께 나아가 생명을 얻고, 자신을 속이지 않으며, 실제로 순종하는 데 있습니까." }
      ]
    },
    {
      key: "l7-closing",
      eyebrow: "LESSON 07 · CLOSING",
      title: "내 삶을 봅니다 · 핵심 정리 · 나눔 · 기도",
      questions: [
        { key: "l7-q46", label: "46번", prompt: "이 과를 시작할 때 적은 답을 다시 보십시오. 나는 무엇 때문에 새로운 가르침을 쉽게 믿어 왔습니까.\n\n처음에 적은 것 : _________________________________\n지금 다시 쓴다면 : _________________________________" },
        { key: "l7-q47", label: "47번", prompt: "나는 성경을 내 생각과 선택을 정당화하는 데 사용한 적이 있습니까. 그때 어떤 구절이나 방식으로 사용했습니까." },
        { key: "l7-q48", label: "48번", prompt: "내가 가장 검토하기 어려워하는 권위는 무엇입니까. 목회자, 유명 설교자, 가족, 교단, 정치적 신념, 나의 체험 가운데 하나를 적어 보십시오." },
        { key: "l7-q49", label: "49번", prompt: "성경의 문맥보다 특정 사람의 해석을 먼저 받아들인 경험이 있습니까. 그 이유는 무엇이었습니까." },
        { key: "l7-q50", label: "50번", prompt: "‘하나님이 말씀하셨다’는 표현으로 나의 뜻을 다른 사람에게 강요하거나, 반대로 다른 사람의 요구를 거절하지 못한 적이 있습니까." },
        { key: "l7-q51", label: "51번", prompt: "지금 다시 성경 앞에서 검토해야 할 가르침이나 선택이 있다면 무엇입니까." },
        { key: "l7-q52", label: "52번", prompt: "이번 주에 읽고 문맥을 살피며 순종할 성경 본문 한 곳을 정하십시오.\n\n본문 : _________________________________\n내가 순종할 한 가지 : _________________________________" },
        { key: "l7-share-1", label: "나눔 질문 1", prompt: "‘말씀’과 ‘기록된 성경’을 구분해야 한다는 설명이 왜 필요하다고 느꼈습니까." },
        { key: "l7-share-2", label: "나눔 질문 2", prompt: "성경 구절을 많이 사용하는 것과 성경의 권위 아래 사는 것은 어떻게 다릅니까." },
        { key: "l7-share-3", label: "나눔 질문 3", prompt: "내가 가장 검토하기 어려운 사람이나 체험의 권위는 무엇입니까." },
        { key: "l7-share-4", label: "나눔 질문 4", prompt: "질문하는 것을 불신앙처럼 느꼈던 경험이 있습니까. 그때 무엇이 두려웠습니까." },
        { key: "l7-share-5", label: "나눔 질문 5", prompt: "건강한 성경 해석과 사람을 통제하는 해석을 구별하는 기준 가운데 가장 중요하게 다가온 것은 무엇입니까." },
        { key: "l7-share-6", label: "나눔 질문 6", prompt: "‘성령을 존중하기 때문에 검증합니다’라는 문장이 나에게 어떻게 들립니까." },
        { key: "l7-share-7", label: "나눔 질문 7", prompt: "이번 주에 성경 앞에서 다시 검토하고 싶은 한 가지 가르침이나 선택은 무엇입니까." }
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
const T = (headers: string[], rows: string[][]): Block => ({ type: "table", headers, rows });
const N = (text: string): Block => ({ type: "note", text });

const pageBlocks: Record<string, Block[]> = {
  "l7-opening": [
    H("시작하며"),
    P("5과에서 우리는 성령의 역사를 분별하는 다섯 기준을 살펴보았습니다."),
    P("성령의 역사는"),
    OL(
      "예수 그리스도를 높이고,",
      "죄와 사탄의 왕국을 약화시키며,",
      "**성경을** 더 귀하게 여기고 순종하게 하고,",
      "거짓에서 나와 진리를 사랑하게 하며,",
      "하나님과 사람을 향한 사랑을 자라게 합니다."
    ),
    P("6과에서는 그 다섯 번째 기준인 사랑을 더 깊이 살펴보았습니다. 사랑은 하나님께 먼저 받은 은혜에서 시작되고, 그리스도의 자기 내어 주심을 닮으며, 가까운 관계와 실제 행동에서 열매를 맺습니다."),
    P("그러나 사랑이라는 말도 잘못 사용될 수 있습니다."),
    P("폭력을 참으라고 요구하면서 사랑이라고 부를 수 있습니다. 진실을 숨기면서 공동체를 사랑하기 때문이라고 말할 수 있습니다. 사람을 통제하면서 영혼을 위하는 일이라고 주장할 수 있습니다. 친절과 유익이 나타났다는 이유로 그 근원까지 선하다고 판단할 수도 있습니다."),
    P("그렇다면 우리는 무엇으로 사랑과 진리와 영적 체험을 분별해야 합니까?"),
    B(
      "**우리의 느낌도, 지도자의 권위도, 공동체의 분위기도 최종 기준이 아닙니다.**",
      "**기록된 성경이 우리의 체험과 해석과 가르침을 판단하는 기준입니다.**"
    ),
    P("여기서 먼저 용어를 분명히 해야 합니다."),
    P("교회에서는 설교를 ‘말씀’이라고 부릅니다. 지도자의 가르침도 ‘말씀’이라고 부를 수 있습니다. 성경 구절이 떠오른 일도 ‘말씀을 받았다’고 표현합니다. 이런 표현 자체가 모두 잘못이라는 뜻은 아닙니다."),
    P("그러나 영적 분별의 기준을 말할 때는 막연한 ‘말씀’이 아니라 **기록된 성경**이라고 분명히 해야 합니다. 설교도 해석도 예언도 체험도 성경 아래에 놓여야 하기 때문입니다. 이 과정에서 ‘성경’은 개신교회가 정경으로 받아온 구약 39권과 신약 27권, 곧 66권을 가리킵니다."),
    P("이 과의 질문은 이것입니다."),
    B(
      "**나는 성경을 내 생각을 증명하는 재료로 사용하고 있습니까?**",
      "**아니면 성경 앞에서 내 생각과 체험과 삶을 고치고 있습니까?**"
    ),
    Q("l7-q0")
  ],
  "l7-part-1": [
    N("**― 막연한 종교 언어가 아니라 기록된 성경을 기준으로 삼음**"),
    H("읽기 ①"),
    S("시편 19:7-11"),
    Q("l7-q1"), Q("l7-q2"), Q("l7-q3"), Q("l7-q4"),
    H("읽기 ②"),
    S("베드로후서 1:19-21"),
    Q("l7-q5"), Q("l7-q6"),
    H("나란히 놓고 봅니다"),
    Q("l7-q7"),
    H("짚어 봅니다"),
    P("성경은 우리를 구원하는 마술책이 아닙니다. 5과에서 읽은 디모데후서는 성경이 **그리스도 예수 안에 있는 믿음으로 말미암아 구원에 이르는 지혜**를 준다고 말했습니다. 시편 19편은 성경이 영혼을 소성시키고, 지혜롭게 하며, 마음을 기쁘게 하고, 눈을 밝히며, 삶을 경고하고 인도한다고 증언합니다. 성경은 자신을 높이는 책이 아니라 예수 그리스도를 증언하고, 그리스도 안에서 우리를 살리는 책입니다."),
    P("성육신하신 하나님의 말씀은 예수 그리스도이십니다. 기록된 성경은 그리스도를 신실하게 증언하며, 하나님의 뜻을 가르치고 책망하고 바르게 하고 의로 교육하는 하나님의 말씀입니다."),
    P("따라서 ‘말씀’이라는 단어가 사용되었다는 사실만으로 그 말이 하나님의 권위를 갖는 것은 아닙니다."),
    B(
      "**교황의 말도, 이만희의 말도, 특정 지도자의 가르침도 그를 따르는 사람들에게는 ‘말씀’이라고 불릴 수 있습니다.**",
      "**그러므로 분별의 기준은 막연한 ‘말씀’이 아니라 기록된 성경입니다.**"
    ),
    P("이 문장은 교황의 발언과 이만희의 가르침을 같은 종류의 종교 현상이라고 단순하게 동일시하려는 말이 아닙니다. **‘말씀’이라는 단어가 얼마나 넓고 모호하게 사용될 수 있는지**를 지적하는 것입니다. 어떤 사람의 말이든, 어떤 교회의 전통이든, 어떤 새로운 해석이든 성경과 같은 자리에 놓일 수 없습니다."),
    P("성경을 절대 기준이라고 말하는 것은 책이라는 물건을 하나님처럼 숭배한다는 뜻도 아닙니다. 성경의 권위는 성경이 살아 계신 하나님과 예수 그리스도를 신실하게 증언하며, 성령께서 그 기록을 통해 교회를 가르치시기 때문에 중요합니다."),
    B("**설교자는 성경 위에 서지 않습니다.**", "**설교자도 성경 아래에 섭니다.**"),
    B("**체험이 성경의 뜻을 결정하지 않습니다.**", "**성경이 체험의 의미를 분별하게 합니다.**")
  ],
  "l7-part-2": [
    N("**― 인용의 양보다 문맥과 전체 증언과 순종을 살핌**"),
    H("읽기 ①"),
    S("베드로후서 3:15-18"),
    Q("l7-q8"), Q("l7-q9"),
    H("읽기 ②"),
    S("마태복음 22:23-33"),
    Q("l7-q10"), Q("l7-q11"), Q("l7-q12"),
    H("한 가지 더"),
    P("2과에서 우리는 광야의 마귀도 시편을 정확히 인용했다는 사실을 확인했습니다. 성경 구절이 입에 있다는 사실과, 그 성경의 뜻 아래 자신을 복종시키는 것은 같은 일이 아닙니다."),
    H("나란히 놓고 봅니다"),
    Q("l7-q13"),
    H("짚어 봅니다"),
    P("성경을 인용하는 것은 귀한 일입니다. 설교와 기도와 상담과 교육에서 성경을 충분히 사용해야 합니다. 그러나 **성경 인용의 양이 성경적 해석을 자동으로 보증하지는 않습니다.**"),
    P("베드로는 사람들이 성경을 모르는 것만 경고하지 않았습니다. 성경을 **억지로 풀고 왜곡하는 일**도 경고했습니다. 사두개인들은 모세의 율법을 근거로 논리적인 질문을 만들었지만, 예수님은 그들이 성경과 하나님의 능력을 알지 못하여 오해했다고 말씀하셨습니다. 성경 구절을 사용해 논리를 세웠어도, 부활을 부정하는 기본 전제가 잘못되었기 때문에 결론도 왜곡되었습니다."),
    P("성경을 바르게 읽기 위해서는 적어도 다음을 살펴야 합니다."),
    L(
      "한 구절의 앞뒤 문맥을 읽습니다.",
      "누가 누구에게, 어떤 상황에서 말했는지 살핍니다.",
      "문학의 종류를 구분합니다. 역사, 시, 비유, 예언, 편지를 같은 방식으로 읽지 않습니다.",
      "성경의 한 구절을 다른 성경 전체의 증언과 분리하지 않습니다.",
      "예수 그리스도와 복음에서 벗어난 비밀 체계를 만들지 않습니다.",
      "해석이 나의 욕망과 지도자의 권력을 정당화하는 데 사용되는지 살핍니다.",
      "이해한 내용을 실제 삶에서 순종하고 있는지 봅니다."
    ),
    B("**구절을 내 편으로 데려오는 것이 성경 읽기가 아닙니다.**", "**성경 앞에 내가 서서 교정받는 것이 성경 읽기입니다.**"),
    P("다만 모든 해석의 차이를 곧바로 이단이나 거짓 영의 증거로 만들지는 마십시오. 신실한 그리스도인들도 세례, 교회정치, 종말의 세부 순서와 같은 문제에서 다르게 이해할 수 있습니다. 분별은 모든 차이를 제거하는 일이 아니라, **복음의 중심을 훼손하고 성경의 권위를 특정 인물과 조직에 넘기는 해석을 구별하는 일**입니다."),
    C(
      "잠깐 멈춥니다",
      "성경을 바르게 읽는다는 말이 어렵게 느껴질 수 있습니다.",
      "‘나는 신학을 많이 모르는데 어떻게 분별하지?’",
      "‘전문가가 아니면 결국 누군가의 해석을 따라야 하지 않나?’",
      "성경은 지적 능력이 뛰어난 사람만을 위해 주어진 책이 아닙니다. 하나님께서는 교회에 목회자와 교사를 주셨고, 성도들이 함께 읽고 배우도록 하셨습니다. 동시에 어떤 지도자도 성경을 독점하도록 허락하지 않으셨습니다.",
      "모든 것을 혼자 알아내야 한다는 뜻도 아니고, 아무 생각 없이 지도자의 말을 받아들이라는 뜻도 아닙니다.",
      "**성령께 도움을 구하고, 성경 전체를 읽고, 믿음의 공동체 안에서 질문하고 확인하십시오.**",
      "**질문하는 것은 불신앙이 아니라 진리를 사랑하는 태도일 수 있습니다.**"
    )
  ],
  "l7-part-3": [
    N("**― 사도와 천사와 지도자의 말까지 성경의 복음으로 검토함**"),
    H("읽기 ①"),
    S("사도행전 17:10-12"),
    Q("l7-q14"), Q("l7-q15"), Q("l7-q16"),
    H("읽기 ②"),
    S("갈라디아서 1:6-9"),
    Q("l7-q17"), Q("l7-q18"),
    H("나란히 놓고 봅니다"),
    Q("l7-q19"),
    H("현장의 장면 · ‘무슨 영을 받으셨습니까?’"),
    B("원강의에서 목사님은 신천지 구성원들과 대화할 때 ‘무슨 영을 받으셨습니까?’라는 질문을 받은 경험을 말합니다. 같은 ‘하나님의 영’, ‘이긴 자’, ‘영생’이라는 단어를 사용해도 그 말 아래 깔린 교리적 전제가 서로 달랐습니다. 목사님의 대답이 그들에게 충격을 준 이유는 말의 크기 때문이 아니라, 그들이 당연하다고 여겨 온 전제와 충돌했기 때문입니다."),
    Q("l7-q20"),
    H("시대의 사례 · 성경을 많이 사용하는 이단"),
    P("신천지는 성경을 버리라고 말하며 접근하는 단체가 아닙니다. 오히려 성경을 더 정확하게 풀어 주고, 요한계시록의 예언이 오늘날 특정한 사건과 인물을 통해 ‘실상’으로 이루어졌다고 가르칩니다. 그 체계에서 이만희는 계시록의 실상을 보고 들은 ‘약속의 목자’와 ‘이긴 자’로 제시됩니다."),
    P("문제는 성경을 사용하느냐 사용하지 않느냐만이 아닙니다. **특정 인물의 해석 체계가 성경 전체를 여는 유일한 열쇠가 되고, 그 해석자가 사실상 성경의 뜻을 결정하는 자리에 서는 것**이 문제입니다."),
    H("짚어 봅니다"),
    P("베뢰아 사람들은 바울을 무시하지 않았습니다. 말씀을 간절히 받았습니다. 그러나 바울이 사도라는 이유만으로 확인을 포기하지 않았습니다. 바울의 가르침이 성경과 일치하는지 날마다 살폈습니다."),
    P("갈라디아서의 기준은 더 강합니다. 바울 자신도, 하늘에서 온 천사도 복음 위에 설 수 없습니다. 전달자의 신비로움과 권위가 내용을 참되게 만드는 것이 아닙니다."),
    P("따라서 다음과 같은 가르침은 반드시 멈추어 살펴야 합니다."),
    L(
      "‘이 시대에는 오직 이 사람만 성경의 참뜻을 안다.’",
      "‘우리 조직 밖에서는 성경을 바르게 이해할 수 없다.’",
      "‘질문하는 것은 하나님께 반역하는 것이다.’",
      "‘지도자를 의심하는 것은 성령을 훼방하는 것이다.’",
      "‘성경보다 실상과 계시와 새 해석이 더 중요하다.’",
      "‘구원은 예수 그리스도를 믿는 것에 더하여 이 인물과 조직에 속해야 완성된다.’"
    ),
    B("**참된 교사는 사람을 자기에게 묶지 않고 성경과 그리스도께 보냅니다.**", "**거짓 권위는 성경을 사용하여 사람을 해석자와 조직에 묶습니다.**"),
    P("이단에 빠진 사람을 어리석다고 조롱하지 마십시오. 많은 사람은 성경을 더 알고 싶고, 분명한 답을 얻고 싶고, 하나님께 충성하고 싶어서 잘못된 체계에 들어갑니다. 수치와 비난은 그 사람이 질문하고 돌아올 길을 더 막을 수 있습니다. 진리를 분명히 말하되, 사람을 존중하며 안전하게 대화해야 합니다.")
  ],
  "l7-part-4": [
    N("**― 본문이 허락하는 상징은 읽되, 비밀 암호로 지도자의 체계를 만들지 않음**"),
    H("읽기 ①"),
    S("누가복음 24:25-27", "누가복음 24:44-47"),
    Q("l7-q21"), Q("l7-q22"), Q("l7-q23"),
    H("읽기 ②"),
    S("고린도후서 4:1-5"),
    Q("l7-q24"), Q("l7-q25"), Q("l7-q26"),
    H("읽기 ③"),
    S("느헤미야 8:7-8"),
    Q("l7-q27"),
    H("나란히 놓고 봅니다"),
    Q("l7-q28"),
    H("짚어 봅니다"),
    P("성경에는 비유와 상징과 묵시가 있습니다. 그러므로 모든 문장을 문자적으로만 읽어야 한다는 뜻은 아닙니다. 시편의 시적 표현, 예수님의 비유, 다니엘과 요한계시록의 상징은 각각 그 문학적 성격에 맞게 읽어야 합니다."),
    P("문제는 상징을 읽는 것 자체가 아닙니다. **본문이 확인해 주지 않는 비밀 암호를 만들어 모든 구절을 특정한 현대 인물과 조직에 대입하는 방식**이 문제입니다."),
    P("건강한 성경 해석은 다음 방향을 가집니다."),
    T(
      ["건강한 해석", "통제하는 해석"],
      [
        ["본문의 문맥과 장르를 공개적으로 살핍니다", "비밀 열쇠를 가진 사람만 뜻을 안다고 합니다"],
        ["성경 전체와 그리스도의 복음 안에서 읽습니다", "모든 성경을 특정 지도자와 조직으로 향하게 합니다"],
        ["질문과 검토를 허용합니다", "질문을 불순종과 배신으로 규정합니다"],
        ["해석자도 잘못할 수 있음을 인정합니다", "해석자의 권위를 사실상 오류 없는 것으로 만듭니다"],
        ["성도를 성숙한 독자로 세웁니다", "성도를 해석자에게 계속 의존하게 합니다"],
        ["회개·믿음·사랑·순종으로 이끕니다", "비밀 지식과 소속감으로 우월감을 만듭니다"]
      ]
    ),
    P("예수님은 성경 전체가 자신을 증언하고, 자신의 죽음과 부활과 죄 사함의 복음으로 이어진다고 가르치셨습니다. 성경의 모든 구절을 억지로 예수님이라는 단어 하나에 맞춘다는 뜻이 아닙니다. 성경의 큰 이야기가 하나님의 창조, 인간의 죄, 언약, 구속, 그리스도, 성령과 새 창조로 이어진다는 뜻입니다."),
    B("**깊은 해석은 남들이 모르는 암호를 많이 아는 것이 아닙니다.**", "**성경이 증언하는 그리스도를 더 분명히 알고, 그 복음 앞에서 더 정직하게 순종하는 것입니다.**"),
    C(
      "잠깐 멈춥니다",
      "지금까지 특정 지도자와 이단의 문제를 살펴보았습니다. 그러나 이 과를 ‘저 사람들은 잘못됐고 우리는 안전하다’는 결론으로 끝내면 안 됩니다.",
      "성경보다 설교자의 말을 더 신뢰하는 일은 어느 교회에서도 일어날 수 있습니다.",
      "내가 좋아하는 유튜브 설교와 신학자의 문장을 성경보다 앞세울 수도 있습니다.",
      "내 체험과 정치적 신념과 공동체의 전통에 맞는 구절만 선택할 수도 있습니다.",
      "**이 과의 첫 대상은 이단에 속한 다른 사람이 아니라 성경 앞에 선 나 자신입니다.**",
      "그러나 이것도 자기정죄의 새 저울로 만들지 마십시오.",
      "성경을 완벽하게 해석해야 하나님께 받아들여지는 것이 아닙니다. 우리는 이미 그리스도 안에서 은혜를 받았고, 성령께서 교회와 함께 우리를 진리로 인도하십니다. 잘못 읽은 것을 깨달으면 숨지 않고 고치면 됩니다."
    )
  ],
  "l7-part-5": [
    N("**― 성령의 역사를 존중하기 때문에 모든 영적 주장을 분별함**"),
    H("읽기 ①"),
    S("데살로니가전서 5:19-22"),
    Q("l7-q29"), Q("l7-q30"), Q("l7-q31"),
    H("읽기 ②"),
    S("고린도전서 14:26-33"),
    Q("l7-q32"), Q("l7-q33"),
    H("읽기 ③"),
    S("사도행전 16:16-18"),
    Q("l7-q34"), Q("l7-q35"),
    H("나란히 놓고 봅니다"),
    Q("l7-q36"),
    H("짚어 봅니다"),
    P("성령의 역사를 귀하게 여기는 것과 검증 없이 받아들이는 것은 같은 일이 아닙니다."),
    P("데살로니가전서는 ‘예언을 멸시하지 말라’고 한 직후 ‘범사에 헤아려 좋은 것을 취하라’고 말합니다. 고린도전서는 예언이 선포되는 공동체 안에서도 다른 사람들이 분별하도록 합니다. 사도행전의 점치는 영은 바울과 동역자들을 ‘지극히 높은 하나님의 종’이며 ‘구원의 길을 전하는 자’라고 불렀습니다. 말의 표면만 보면 틀리지 않았지만, 바울은 그 말의 내용만 듣고 그 영을 받아들이지 않았습니다."),
    B("**성령을 의심하기 때문에 검증하는 것이 아닙니다.**", "**성령께서 거짓을 분별하라고 하셨기 때문에 검증합니다.**"),
    P("성령께서 주시는 깨달음은 성경과 경쟁하지 않습니다. 성령께서는 자신이 감동하여 기록하게 하신 성경을 폐기하거나, 성경과 반대되는 새 복음을 주지 않으십니다."),
    P("개인적인 인도와 감동은 있을 수 있습니다. 그러나 개인적 감동과 모든 사람에게 적용되는 하나님의 명령을 구분해야 합니다."),
    L(
      "‘기도 중에 이 선택이 마음에 떠올랐습니다’라고 겸손히 말할 수 있습니다.",
      "‘하나님이 말씀하셨으니 당신은 반드시 내 말에 순종해야 합니다’라고 타인을 통제해서는 안 됩니다.",
      "결혼, 헌금, 진로, 이사, 치료 중단과 같은 중대한 결정을 지도자의 개인 계시 하나로 강요해서는 안 됩니다.",
      "폭력과 착취를 참으라는 지시를 ‘하나님의 뜻’이라고 확정해서는 안 됩니다.",
      "공동체의 명예를 위해 피해 사실을 숨기는 일을 ‘성령의 하나 됨’이라고 부르지 않습니다."
    ),
    H("영적 권위와 안전"),
    B("**‘하나님이 내게 말씀하셨다’는 문장은 다른 사람의 질문과 자유와 안전을 제거하는 면허가 아닙니다.**"),
    P("누군가가 하나님의 이름으로 성적 접촉, 돈, 비밀 유지, 가족과의 단절, 치료 중단, 지도자에 대한 절대복종을 요구한다면 혼자 감당하지 마십시오. 신뢰할 수 있는 목회자와 가족, 전문기관과 공적 보호 체계에 도움을 요청해야 합니다."),
    P("이것은 성령을 거역하는 일이 아닙니다. 거짓과 폭력에서 사람을 보호하는 것은 진리와 사랑의 영에 순종하는 일입니다.")
  ],
  "l7-part-6": [
    N("**― 성경 지식이 그리스도께 나아가고 순종하는 삶으로 이어지는지 살핌**"),
    H("읽기 ①"),
    S("요한복음 5:39-40"),
    Q("l7-q37"), Q("l7-q38"), Q("l7-q39"),
    H("읽기 ②"),
    S("야고보서 1:21-25"),
    Q("l7-q40"), Q("l7-q41"), Q("l7-q42"),
    H("읽기 ③"),
    S("누가복음 6:46-49"),
    Q("l7-q43"), Q("l7-q44"),
    H("나란히 놓고 봅니다"),
    Q("l7-q45"),
    H("짚어 봅니다"),
    P("성경 지식은 귀합니다. 성도는 평생 성경을 배우고 묵상하고 연구해야 합니다. 교회는 성경을 깊이 가르쳐야 하며, 어려운 질문을 피하지 말아야 합니다."),
    P("그러나 성경을 많이 안다는 사실이 자동으로 영적 성숙을 보증하지는 않습니다. 예수님 시대의 종교 지도자들은 성경을 연구했지만, 성경이 증언하는 예수님께 오기를 거부했습니다. 야고보는 말씀을 듣고도 행하지 않으면 다른 사람보다 먼저 **자기 자신을 속인다**고 말합니다."),
    P("성경을 존중한다는 것은 다음과 같이 드러납니다."),
    L(
      "성경이 그리스도를 증언할 때 그분께 나아갑니다.",
      "성경이 죄를 드러낼 때 변명만 하지 않고 회개합니다.",
      "성경이 약한 사람을 보호하라고 할 때 공동체의 체면보다 사람을 지킵니다.",
      "성경이 원수를 사랑하라고 할 때 미움을 의로 포장하지 않습니다.",
      "성경이 진실을 말하라고 할 때 유익을 위해 거짓말을 정당화하지 않습니다.",
      "성경이 책망할 때 지도자와 공동체도 교정받습니다.",
      "알지 못하는 부분은 겸손히 질문하고 다시 배웁니다."
    ),
    B("**성경을 존중한다는 것은 성경을 높이 들고 다른 사람을 치는 것이 아닙니다.**", "**성경 앞에서 먼저 내가 읽히고, 밝혀지고, 고쳐지는 것입니다.**"),
    P("그리고 여기서도 순서를 잊지 마십시오."),
    P("우리가 성경에 완벽하게 순종해서 하나님께 사랑받는 것이 아닙니다. 하나님이 먼저 우리를 사랑하시고, 그리스도께서 우리를 구원하시며, 성령께서 새 언약의 말씀을 마음에 새기시기 때문에 순종을 배우기 시작합니다."),
    B("**성경 읽기와 순종은 사랑받기 위한 시험이 아닙니다.**", "**이미 사랑받은 사람이 임마누엘의 하나님과 함께 살아가는 길입니다.**"),
    H("성경은 누구의 손에 있습니까"),
    P("성경은 특정 지도자의 소유물이 아닙니다. 고립된 개인이 자기 마음대로 뜻을 정하는 책도 아닙니다. 하나님께서 교회 전체에 주신 선물입니다."),
    L(
      "성부 하나님께서는 선지자와 사도를 통해 자신의 뜻을 기록하게 하셨습니다.",
      "성자 예수 그리스도께서는 성경을 성취하시고 성경의 중심이 되셨습니다.",
      "성령 하나님께서는 성경을 기록하게 하셨고, 교회가 그 뜻을 깨닫고 순종하도록 비추십니다.",
      "교회는 여러 세대의 성도와 함께 성경을 읽고 가르치며, 서로의 해석을 점검합니다."
    ),
    P("이것이 **임마누엘 통합 지점**입니다."),
    P("성경은 하나님이 멀리서 던져 주신 규칙집이 아닙니다. 우리와 함께하시는 하나님께서 그리스도 안에서 자신을 알리시고, 성령으로 우리 가운데 말씀하시며, 교회를 진리와 사랑으로 세우시는 언약의 선물입니다."),
    P("따라서 성경의 권위는 사람을 지배하기 위한 권력이 아니라, 사람을 거짓에서 자유롭게 하고 그리스도께로 이끄는 하나님의 선한 권위입니다."),
    B("**성경은 지도자를 높이는 사다리가 아니라, 지도자와 성도를 함께 그리스도 앞에 세우는 빛입니다.**"),
    C(
      "잠깐 멈춥니다",
      "이번 과를 마치며 성경을 또 하나의 저울로 만들지 마십시오.",
      "성경을 많이 읽는 사람과 적게 읽는 사람을 등급화하지 마십시오.",
      "어려운 본문을 이해하지 못한다고 자신을 정죄하지 마십시오.",
      "성경 지식이 적은 사람을 무시하지 마십시오.",
      "동시에 ‘나는 잘 모르니까’ 하며 모든 분별을 지도자에게 넘기지도 마십시오.",
      "오늘의 한 걸음은 완벽한 해석자가 되는 것이 아닙니다.",
      "**성경을 열고, 문맥을 읽고, 질문하고, 그리스도께 나아가며, 깨달은 한 가지에 순종하는 것입니다.**"
    )
  ],
  "l7-closing": [
    H("내 삶을 봅니다"),
    Q("l7-q46"), Q("l7-q47"), Q("l7-q48"), Q("l7-q49"), Q("l7-q50"), Q("l7-q51"), Q("l7-q52"),
    H("핵심 정리"),
    OL(
      "영적 분별의 기준은 막연한 ‘말씀’이 아니라 기록된 성경입니다.",
      "성육신하신 말씀은 예수 그리스도이시며, 기록된 성경은 그리스도를 증언하고 구원과 성숙으로 이끄는 하나님의 말씀입니다.",
      "설교자와 지도자와 공동체의 전통과 개인의 체험은 모두 성경 아래에서 검토받아야 합니다.",
      "성경 구절을 많이 인용하는 것과 성경의 문맥과 뜻 아래 순종하는 것은 같지 않습니다.",
      "성경은 왜곡될 수 있으므로 앞뒤 문맥, 문학의 종류, 성경 전체의 증언과 복음의 중심을 함께 살펴야 합니다.",
      "사도 바울의 말과 천사의 말도 복음 아래에서 검토됩니다. 어떤 지도자도 성경의 검증을 면제받지 않습니다.",
      "특정 인물만 성경의 비밀을 풀 수 있고 그 해석을 통해서만 구원에 이를 수 있다는 주장은 심각하게 분별해야 합니다.",
      "성경의 비유와 상징은 문맥과 장르에 따라 읽되, 모든 구절을 특정 현대 인물과 조직에 맞추는 비밀 암호로 만들지 않습니다.",
      "성령의 역사를 존중하기 때문에 예언과 감동과 영적 주장을 시험합니다.",
      "‘하나님이 말씀하셨다’는 표현은 다른 사람을 통제하거나 안전을 침해하는 면허가 아닙니다.",
      "성경 지식의 목적은 지적 우월감이 아니라 그리스도께 나아가고, 회개하며, 진리와 사랑 안에서 순종하는 것입니다.",
      "성경 읽기와 순종은 하나님께 사랑받기 위한 시험이 아니라, 이미 사랑받은 사람이 임마누엘의 하나님과 함께 살아가는 길입니다.",
      "성경은 특정 지도자의 소유도 고립된 개인의 소유도 아니며, 성령께서 교회 전체에 주신 언약의 선물입니다.",
      "성경을 또 하나의 등급표로 만들지 않고, 성경 앞에서 지도자와 공동체와 나 자신이 함께 교정받습니다."
    ),
    H("나눔 질문"),
    N("*46~52번에 적으신 것 중 나누고 싶은 것만 나누십시오.*"),
    Q("l7-share-1"), Q("l7-share-2"), Q("l7-share-3"), Q("l7-share-4"), Q("l7-share-5"), Q("l7-share-6"), Q("l7-share-7"),
    H("기도"),
    B(
      "진리의 성령님,",
      "저는 성경보다",
      "사람의 확신과 말솜씨를 더 크게 보았고,",
      "성경 구절이 많이 인용되면",
      "그 가르침이 참되다고 쉽게 믿었습니다.",
      "제가 좋아하는 체험과 전통과 생각을 지키기 위해",
      "성경을 제 편으로 끌어오기도 했습니다.",
      "주님, 저를 용서하여 주십시오.",
      "성경을 내 뜻을 증명하는 도구로 사용하지 않고,",
      "성경 앞에서 제 생각과 욕망과 삶을",
      "정직하게 살피게 하십시오.",
      "어떤 지도자와 조직도",
      "그리스도와 복음 위에 놓지 않게 하시며,",
      "신비한 말과 비밀 지식보다",
      "기록된 성경의 밝은 진리를 사랑하게 하십시오.",
      "성령의 역사를 멸시하지 않되",
      "모든 것을 분별하게 하시고,",
      "좋은 것을 붙들며",
      "거짓과 폭력과 통제에서 사람을 보호하게 하십시오.",
      "성경 지식으로 교만해지지 않고,",
      "성경이 증언하는 예수님께 나아가",
      "생명을 얻고 순종하게 하십시오.",
      "아버지께서 주신 성경을 통해",
      "아들 예수 그리스도를 더 알고,",
      "성령의 도우심으로",
      "진리와 사랑 안에서 살아가게 하십시오.",
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

export function DiscernmentLessonSevenWorkbook({ startPage }: { startPage?: string }) {
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
    const response = await fetch("/api/member/study/discernment-lesson-seven", { cache: "no-store" });
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
    url.searchParams.set("lesson", "7");
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
    const response = await fetch("/api/member/study/discernment-lesson-seven", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "answer", pageKey: page.key, questionKey, answer })
    });
    setNotice(response.ok ? "답변을 저장했습니다." : "답변을 저장하지 못했습니다.");
    if (response.ok) await load();
  }

  async function completePage() {
    if (needsLogin) return;
    const response = await fetch("/api/member/study/discernment-lesson-seven", {
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
    if (block.type === "table") return <div key={index} style={{ overflowX: "auto", margin: "1.5rem 0" }}><table style={{ width: "100%", borderCollapse: "collapse" }}><thead><tr>{block.headers.map((header, headerIndex) => <th key={headerIndex} style={{ textAlign: "left", padding: "0.75rem", borderBottom: "1px solid currentColor" }}><RichText text={header} /></th>)}</tr></thead><tbody>{block.rows.map((row, rowIndex) => <tr key={rowIndex}>{row.map((cell, cellIndex) => <td key={cellIndex} style={{ verticalAlign: "top", padding: "0.75rem", borderBottom: "1px solid rgba(128,128,128,.25)" }}><RichText text={cell} /></td>)}</tr>)}</tbody></table></div>;
    return <p key={index}><RichText text={block.text} /></p>;
  }

  return <section className="web-study-shell">
    <aside className="web-study-sidebar" aria-label="교재 목차">
      <p className="section-kicker">분별에서 사랑으로</p>
      <h2>7과 학습 순서</h2>
      <div className="web-study-progress"><span style={{ width: `${percent}%` }} /></div>
      <strong>{needsLogin ? `총 ${course.pages.length}쪽 · 로그인 후 진도 저장` : `${completed}/${course.pages.length}쪽 완료 · ${percent}%`}</strong>
      <ol>{course.pages.map((item, index) => <li key={item.key}><button type="button" className={index === pageIndex ? "is-active" : ""} aria-current={index === pageIndex ? "page" : undefined} onClick={() => selectPage(index)}><span>{index + 1}</span><em><small>{item.eyebrow}</small>{item.title}</em>{progressKeys.has(item.key) && <small>완료</small>}</button></li>)}</ol>
    </aside>
    <article className="web-study-page" id="study-content" ref={contentRef} tabIndex={-1}>
      <div className="web-study-page-heading"><div><p className="section-kicker">{page.eyebrow}</p><h2>{page.title}</h2></div><b>{String(pageIndex + 1).padStart(2, "0")} / {String(course.pages.length).padStart(2, "0")}</b></div>
      {needsLogin && <div className="web-study-login-callout"><strong>읽기는 누구나 할 수 있습니다.</strong><p>답변 저장, 공부 날짜 기록, 진도 관리는 로그인한 교인에게 열립니다.</p><a className="primary-link" href={`/login?returnTo=${encodeURIComponent(`/bible-study/${course.slug}?lesson=7&page=${page.key}#study-content`)}`}>로그인하여 이 페이지부터 기록하기</a></div>}
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
