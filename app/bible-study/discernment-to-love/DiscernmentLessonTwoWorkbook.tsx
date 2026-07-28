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
  lessonSlug: "discernment-lesson-2",
  title: "2과 · 체험으로 판단할 수 없습니다",
  pages: [
    {
      key: "l2-opening",
      eyebrow: "LESSON 02 · OPENING",
      title: "체험으로 판단할 수 없습니다",
      questions: [
        { key: "l2-q0", label: "✍️ 시작 질문", prompt: "이 과를 시작하며, 내가 지금 기대고 있는 신앙의 증거가 있다면 무엇입니까. 한 가지만 적어 두십시오. 과를 마치고 다시 볼 것입니다." }
      ]
    },
    {
      key: "l2-sign-1",
      eyebrow: "LESSON 02 · SIGN 01",
      title: "“그렇게 뜨거운 걸 보면 은혜받은 거지요”",
      questions: [
        { key: "l2-q1", label: "1번", prompt: "다윗은 어떤 모습으로 여호와 앞에서 춤을 추었습니까." },
        { key: "l2-q2", label: "2번", prompt: "미갈은 그 모습을 보고 마음에 어떻게 반응했습니까." },
        { key: "l2-q3", label: "3번", prompt: "돌밭에 뿌려진 씨는 말씀을 어떤 태도로 받습니까." },
        { key: "l2-q4", label: "4번", prompt: "그가 오래 견디지 못한 이유는 무엇입니까." },
        { key: "l2-q5", label: "5번 · 나란히 놓고 봅니다", prompt: "다윗과 돌밭의 사람에게 공통으로 나타난 것은 무엇입니까. 그리고 그 공통점만 보고 두 사람을 구별할 수 있습니까." }
      ]
    },
    {
      key: "l2-sign-2",
      eyebrow: "LESSON 02 · SIGN 02",
      title: "“다들 울고 쓰러지고, 그날 은혜가 정말 컸어요”",
      questions: [
        { key: "l2-q6", label: "6번", prompt: "다니엘의 몸에 어떤 일이 일어났습니까. 세 가지 이상 적어 보십시오." },
        { key: "l2-q7", label: "7번", prompt: "바알의 선지자들은 무엇을 했습니까. 몸으로 한 일을 모두 적어 보십시오." },
        { key: "l2-q8", label: "8번", prompt: "그렇게 한 결과가 어떠했다고 29절은 말합니까." },
        { key: "l2-q9", label: "9번 · 나란히 놓고 봅니다", prompt: "두 장면에서 몸에 나타난 격렬함의 크기를 비교하면 어느 쪽이 더 큽니까. 그 크기가 무엇을 증명했습니까." }
      ]
    },
    {
      key: "l2-sign-3",
      eyebrow: "LESSON 02 · SIGN 03",
      title: "“제가 지어낸 게 아니에요. 위에서 딱 내려온 거예요”",
      questions: [
        { key: "l2-q10", label: "10번", prompt: "베드로의 고백에 대해 예수님은 그것이 어디에서 온 것이라고 하셨습니까." },
        { key: "l2-q11", label: "11번", prompt: "아합의 선지자들 입에 들어간 것은 무엇이었습니까. (22-23절)" },
        { key: "l2-q12", label: "12번", prompt: "그것은 그들 안에서 나온 것입니까, 밖에서 들어온 것입니까." },
        { key: "l2-q13", label: "13번 · 나란히 놓고 봅니다", prompt: "두 경우 모두 “내가 만든 것이 아니라 밖에서 왔다”는 점은 같습니다. 그렇다면 무엇을 더 물어야 합니까." }
      ]
    },
    {
      key: "l2-sign-4",
      eyebrow: "LESSON 02 · SIGN 04",
      title: "“기도하는데 그 말씀이 갑자기 확 떠올랐어요”",
      questions: [
        { key: "l2-q14", label: "14번", prompt: "예수님께서 시험을 물리치실 때 사용하신 것은 무엇입니까." },
        { key: "l2-q15", label: "15번", prompt: "6절에서 마귀가 사용한 것은 무엇입니까. 어느 책의 말씀입니까." },
        { key: "l2-q16", label: "16번", prompt: "그 인용은 정확했습니까, 부정확했습니까." },
        { key: "l2-q17", label: "17번 · 나란히 놓고 봅니다", prompt: "한 장면 안에서 같은 성경이 양쪽 모두에게 사용되었습니다. 그렇다면 성경 구절이 떠올랐다는 사실 자체는 무엇을 증명합니까." }
      ]
    },
    {
      key: "l2-sign-5",
      eyebrow: "LESSON 02 · SIGN 05",
      title: "“그 사람 참 사랑이 많아요”",
      questions: [
        { key: "l2-q18", label: "18번", prompt: "마리아는 무엇을 했습니까. (3절)" },
        { key: "l2-q19", label: "19번", prompt: "유다는 그 일을 두고 무엇이라고 말했습니까. (5절)" },
        { key: "l2-q20", label: "20번", prompt: "유다의 말은 내용상 옳은 말입니까, 틀린 말입니까." },
        { key: "l2-q21", label: "21번", prompt: "6절은 그가 그렇게 말한 진짜 이유를 무엇이라고 밝힙니까." },
        { key: "l2-q22", label: "22번 · 나란히 놓고 봅니다", prompt: "그 자리에 있던 사람들이 유다의 말만 듣고 그의 속을 알 수 있었겠습니까. 그의 말은 사랑처럼 들렸습니까, 아니었습니까." }
      ]
    },
    {
      key: "l2-sign-6",
      eyebrow: "LESSON 02 · SIGN 06",
      title: "“그때는 감사도 넘치고 열심도 나고, 다 있었어요”",
      questions: [
        { key: "l2-q23", label: "23번", prompt: "초대교회에 함께 나타난 것들을 찾아 적어 보십시오. 네 가지 이상 적어 보십시오." },
        { key: "l2-q24", label: "24번", prompt: "12절에서 이스라엘은 무엇을 했습니까." },
        { key: "l2-q25", label: "25번", prompt: "13절에서 그다음에 무슨 일이 일어났습니까. 얼마 만에 일어났습니까." },
        { key: "l2-q26", label: "26번 · 나란히 놓고 봅니다", prompt: "홍해를 건넌 이스라엘에게도 믿음과 찬양과 감사가 함께 있었습니다. 그렇다면 여러 감정이 한꺼번에 나타난다는 사실은 무엇을 증명합니까." }
      ]
    },
    {
      key: "l2-closing",
      eyebrow: "LESSON 02 · CLOSING",
      title: "내 삶을 봅니다 · 핵심 정리 · 나눔 · 기도",
      questions: [
        { key: "l2-q27", label: "27번", prompt: "여섯 가지를 다시 훑어보십시오. 그중 내가 가장 자주 기대어 온 것은 무엇입니까." },
        { key: "l2-q28", label: "28번", prompt: "나는 그것을 나를 확인하는 데 써 왔습니까, 남을 확인하는 데 써 왔습니까. 아니면 둘 다입니까." },
        { key: "l2-q29", label: "29번", prompt: "이 과를 시작할 때 적어 두셨던 것을 다시 보십시오. 지금 그것을 어떻게 다시 쓰시겠습니까.\n\n처음에 적은 것 :\n지금 다시 쓴다면 :" },
        { key: "l2-share-1", label: "나눔 질문 1", prompt: "여섯 가지 중 나에게 가장 낯설게 다가온 것은 무엇이었습니까. 왜 그랬다고 생각하십니까." },
        { key: "l2-share-2", label: "나눔 질문 2", prompt: "29번에서 처음에 적은 것과 지금 다시 쓴 것 사이에 변화가 있었습니까." },
        { key: "l2-share-3", label: "나눔 질문 3", prompt: "이 여섯 가지가 우리 목장이나 교회 안에서 어떻게 쓰이고 있다고 느끼십니까." },
        { key: "l2-share-4", label: "나눔 질문 4", prompt: "“여섯이 무너져도 당신은 무너지지 않습니다”라는 말이 지금 나에게 어떻게 들립니까." }
      ]
    }
  ] satisfies StudyPage[]
};

const pageBlocks: Record<string, Block[]> = {
  "l2-opening": [
    { type: "heading", text: "시작하며" },
    { type: "paragraphs", body: [
      "지난 과에서 우리는 두 가지를 함께 정했습니다. 이 과에 들어가기 전에 그중 첫째를 다시 읽고 가겠습니다."
    ] },
    { type: "quote", body: ["**“기준이 아니다”는 “거짓이다”가 아닙니다.**"] },
    { type: "paragraphs", body: [
      "이 과에서 여섯 가지를 살펴봅니다. 전부 신앙생활에서 실제로 일어나는 일들이고, 전부 하나님께로부터 올 수 있는 일들입니다. 가짜라고 말하려는 것이 아닙니다.",
      "우리가 확인하려는 것은 하나입니다. **이것만으로는 판정할 수 없다.**",
      "그리고 판정할 수 없다는 말에는 두 방향이 있습니다. 있다고 해서 참인 것도 아니고, 없다고 해서 거짓인 것도 아닙니다. 여섯 번 모두 이 두 방향을 함께 확인하게 될 것입니다."
    ] },
    { type: "question", key: "l2-q0" }
  ],
  "l2-sign-1": [
    { type: "note", text: "**― 감정이 매우 강렬함**" },
    { type: "heading", text: "읽기 (1)" },
    { type: "scripture", refs: ["사무엘하 6:14-16"] },
    { type: "question", key: "l2-q1" },
    { type: "question", key: "l2-q2" },
    { type: "heading", text: "읽기 (2)" },
    { type: "scripture", refs: ["마태복음 13:20-21"] },
    { type: "question", key: "l2-q3" },
    { type: "question", key: "l2-q4" },
    { type: "heading", text: "나란히 놓고 봅니다" },
    { type: "question", key: "l2-q5" },
    { type: "heading", text: "짚어 봅니다" },
    { type: "paragraphs", body: [
      "성경은 신앙의 감정을 감추지 않습니다. 오히려 대단히 풍부하게 담고 있습니다. 홍해를 건넌 이스라엘이 노래했고, 다윗이 힘을 다해 춤추었고, 시편은 탄식과 기쁨을 그대로 적어 두었습니다.",
      "**감정이 없어야 한다는 말이 아닙니다.** 신앙에는 반드시 감정이 묻어납니다. 감정 없는 신앙은 성경적이지 않습니다.",
      "다만 돌밭의 사람도 즉시 기쁨으로 받았습니다. 뜨거움의 강도만으로는 다윗과 그를 구별할 수 없습니다. 두 사람을 갈라놓은 것은 감정의 크기가 아니라 뿌리였고, 뿌리는 겉에서 보이지 않습니다."
    ] },
    { type: "quote", body: [
      "**뜨거움이 있다고 해서 성령의 역사인 것이 아니고,**",
      "**뜨거움이 없다고 해서 성령의 역사가 아닌 것도 아닙니다.**"
    ] }
  ],
  "l2-sign-2": [
    { type: "note", text: "**― 신체에 큰 영향을 미침**" },
    { type: "heading", text: "읽기 (1)" },
    { type: "scripture", refs: ["다니엘 10:7-9"] },
    { type: "question", key: "l2-q6" },
    { type: "heading", text: "읽기 (2)" },
    { type: "scripture", refs: ["열왕기상 18:26-29"] },
    { type: "question", key: "l2-q7" },
    { type: "question", key: "l2-q8" },
    { type: "heading", text: "나란히 놓고 봅니다" },
    { type: "question", key: "l2-q9" },
    { type: "heading", text: "한 가지 더" },
    { type: "quote", body: [
      "**[본문] 사무엘상 19:23-24**",
      "사울에게 하나님의 영이 임했고, 그는 예언했고, 옷을 벗고 밤새도록 누워 있었습니다. 신체 현상이 분명했고, **그 배후에 하나님의 영이 계셨던 것도 사실입니다.**",
      "그러나 그 일은 사울이 어떤 사람인지를 증명하지 않았습니다. 그때 사울은 다윗을 죽이러 가는 길이었습니다."
    ] },
    { type: "heading", text: "짚어 봅니다" },
    { type: "paragraphs", body: [
      "바알의 선지자들은 하루 종일 부르짖고 뛰놀고 몸을 상하게 했습니다. 격렬함으로 치면 다니엘보다 훨씬 컸습니다. 그리고 아무 소리도 없었습니다.",
      "사울의 경우는 더 조심스럽습니다. 그에게 임한 것은 실제로 하나님의 영이었습니다. 그러니 신체 현상 뒤에 하나님이 계셨다고 해도, 그것이 그 사람의 상태를 보증하지는 않는다는 뜻이 됩니다.",
      "몸은 여러 이유로 반응합니다. 하나님 앞에서 반응하기도 하고, 사람이 만들어 내기도 하고, 감정이나 분위기에 따라 반응하기도 합니다. 눈물이 나지 않는 사람이 메마른 것도 아니고, 눈물이 많은 사람이 깊은 것도 아닙니다."
    ] },
    { type: "quote", body: [
      "**몸의 반응이 있다고 해서 성령의 역사인 것이 아니고,**",
      "**몸의 반응이 없다고 해서 성령의 역사가 아닌 것도 아닙니다.**"
    ] }
  ],
  "l2-sign-3": [
    { type: "note", text: "**― 내가 만들어 낸 것이 아니라 밖에서 온 것처럼 느껴짐**" },
    { type: "heading", text: "읽기 (1)" },
    { type: "scripture", refs: ["마태복음 16:15-17"] },
    { type: "question", key: "l2-q10" },
    { type: "heading", text: "읽기 (2)" },
    { type: "scripture", refs: ["열왕기상 22:19-23"] },
    { type: "question", key: "l2-q11" },
    { type: "question", key: "l2-q12" },
    { type: "heading", text: "나란히 놓고 봅니다" },
    { type: "question", key: "l2-q13" },
    { type: "heading", text: "짚어 봅니다" },
    { type: "paragraphs", body: [
      "“이건 제 생각이 아니에요”라는 말은 흔히 강력한 증거로 여겨집니다. 내가 만들어 낸 것이 아니니 하나님께로부터 온 것이라는 논리입니다.",
      "그런데 아합의 선지자들에게 들어간 것도 밖에서 왔습니다. 그들 안에서 지어낸 것이 아니었습니다. 사백 명이 한목소리로 확신 있게 말했고, 그 확신은 진짜였습니다.",
      "**밖에서 왔다는 느낌이 사실이어도, 그 밖이 어디인지는 아직 남는 질문입니다.**"
    ] },
    { type: "quote", body: [
      "**밖에서 온 것 같은 느낌이 있다고 해서 성령의 역사인 것이 아니고,**",
      "**그런 느낌이 없다고 해서 성령의 역사가 아닌 것도 아닙니다.**"
    ] },
    { type: "callout", title: "잠깐 멈춥니다", body: [
      "여기까지 오면서 마음이 헐거워지셨을 수 있습니다. 기대고 있던 것이 하나씩 빠지는 느낌이 들 수 있습니다.",
      "지금 빠지고 있는 것은 **증거**이지 **사실**이 아닙니다. 하나님께서 당신을 만나 주신 일들이 취소되고 있는 것이 아닙니다. 그 일들을 근거로 등급을 매기던 습관이 빠지고 있는 것입니다.",
      "이 과가 끝날 때 당신이 손에 남기게 될 것이 무엇인지는 4과와 5과에서 다룹니다. 지금은 손을 펴는 중입니다."
    ] }
  ],
  "l2-sign-4": [
    { type: "note", text: "**― 성경 구절이 갑자기 마음에 떠오름**" },
    { type: "heading", text: "읽기" },
    { type: "scripture", refs: ["마태복음 4:1-11"] },
    { type: "question", key: "l2-q14" },
    { type: "question", key: "l2-q15" },
    { type: "question", key: "l2-q16" },
    { type: "heading", text: "나란히 놓고 봅니다" },
    { type: "question", key: "l2-q17" },
    { type: "heading", text: "짚어 봅니다" },
    { type: "paragraphs", body: [
      "광야의 장면에서 성경을 인용한 것은 예수님만이 아니었습니다. 마귀도 시편 91편을 인용했습니다. 그것도 정확하게 인용했습니다.",
      "성경 구절이 마음에 떠오르는 일은 귀한 일입니다. 성령께서 하시는 일 가운데 하나입니다. 그러나 구절이 떠올랐다는 사실 자체는, 그 구절이 지금 나에게 어떤 뜻으로 주어졌는지를 보증하지 않습니다. 떠오른 구절을 어떻게 읽을 것인가는 여전히 남는 문제입니다."
    ] },
    { type: "quote", body: [
      "**성경 구절이 떠올랐다고 해서 성령의 역사인 것이 아니고,**",
      "**떠오르지 않았다고 해서 성령의 역사가 아닌 것도 아닙니다.**"
    ] }
  ],
  "l2-sign-5": [
    { type: "note", text: "**― 사랑처럼 보이는 것이 나타남**" },
    { type: "heading", text: "읽기" },
    { type: "scripture", refs: ["요한복음 12:1-8"] },
    { type: "question", key: "l2-q18" },
    { type: "question", key: "l2-q19" },
    { type: "question", key: "l2-q20" },
    { type: "question", key: "l2-q21" },
    { type: "heading", text: "나란히 놓고 봅니다" },
    { type: "question", key: "l2-q22" },
    { type: "heading", text: "짚어 봅니다" },
    { type: "paragraphs", body: [
      "유다의 말은 틀린 말이 아니었습니다. 가난한 자를 생각하자는 말은 성경적입니다. 그 자리에서 들은 사람들에게 그 말은 사랑처럼 들렸을 것입니다.",
      "같은 방 안에서 진짜 사랑과 사랑처럼 보이는 말이 나란히 있었습니다. 그리고 겉으로 보면 유다 쪽이 더 합리적이고 더 이타적으로 들립니다.",
      "**사랑처럼 보이는 것은 사랑의 증거가 아닙니다.** 말이 사랑을 흉내 낼 수 있고, 행동도 흉내 낼 수 있습니다.",
      "이 항목은 나중에 다시 만나게 됩니다. 아주 정교하게 사랑을 흉내 내는 것이 우리 시대에 하나 더 생겼기 때문입니다."
    ] },
    { type: "quote", body: [
      "**사랑처럼 보이는 것이 있다고 해서 성령의 역사인 것이 아니고,**",
      "**사랑의 표현이 서툴다고 해서 성령의 역사가 아닌 것도 아닙니다.**"
    ] }
  ],
  "l2-sign-6": [
    { type: "note", text: "**― 여러 종류의 종교적 감정이 함께 나타남**" },
    { type: "heading", text: "읽기 (1)" },
    { type: "scripture", refs: ["사도행전 2:42-47"] },
    { type: "question", key: "l2-q23" },
    { type: "heading", text: "읽기 (2)" },
    { type: "scripture", refs: ["시편 106:12-13"] },
    { type: "question", key: "l2-q24" },
    { type: "question", key: "l2-q25" },
    { type: "heading", text: "나란히 놓고 봅니다" },
    { type: "question", key: "l2-q26" },
    { type: "heading", text: "짚어 봅니다" },
    { type: "paragraphs", body: [
      "한 가지 감정만 있으면 의심스러워도 여러 감정이 함께 있으면 진짜일 것 같습니다. 감사도 있고 열심도 있고 기쁨도 있고 눈물도 있으면 더 그렇습니다.",
      "홍해를 건넌 이스라엘에게 그 모든 것이 있었습니다. 그들은 하나님의 말씀을 믿었고 노래를 불렀습니다. 그리고 시편 기자는 그다음에 무슨 일이 있었는지를 한 절 안에 적어 두었습니다. **곧 잊었습니다.**",
      "여러 개가 함께 있다는 것은 그것들이 함께 왔다는 뜻이지, 그것들이 뿌리에서 나왔다는 뜻은 아닙니다."
    ] },
    { type: "quote", body: [
      "**여러 감정이 함께 있다고 해서 성령의 역사인 것이 아니고,**",
      "**한 가지 감정뿐이라고 해서 성령의 역사가 아닌 것도 아닙니다.**"
    ] }
  ],
  "l2-closing": [
    { type: "heading", text: "내 삶을 봅니다" },
    { type: "question", key: "l2-q27" },
    { type: "question", key: "l2-q28" },
    { type: "question", key: "l2-q29" },
    { type: "heading", text: "이 여섯을 정리한 사람" },
    { type: "paragraphs", body: [
      "지금 우리가 성경에서 확인한 것을, 약 250년 전에 같은 방식으로 정리한 사람이 있습니다. **조나단 에드워즈**입니다.",
      "그는 이런 것들을 **소극적 표지**라고 불렀습니다. 있어도 증명하지 못하고, 없어도 부정하지 못하는 것들이라는 뜻입니다. 그가 정리한 것은 모두 열두 가지이고, 우리는 그중 여섯을 보았습니다. 나머지 여섯은 다음 과에서 봅니다.",
      "여기서 반드시 알아야 할 것이 하나 있습니다.",
      "**에드워즈는 부흥을 공격하려고 이 목록을 만든 사람이 아닙니다.**",
      "그는 부흥의 한복판에 서 있던 목사였습니다. 그의 교회에서 부흥이 일어났고, 그 부흥을 두고 어떤 이들은 전부 참되다고 했고 어떤 이들은 전부 거짓이라고 했습니다. 그는 양쪽 다 아니라고 했습니다. 그리고 부흥을 지키기 위해 이 목록을 썼습니다.",
      "그러니 이 목록은 냉소가 아닙니다. **하나님이 하시는 일을 사람의 잣대로 재다가 놓치지 않으려고 만든 것입니다.**"
    ] },
    { type: "note", text: "*에드워즈에 관해서는 인도자 자료에서 더 다룹니다.*" },
    { type: "callout", title: "잠깐 멈춥니다", body: [
      "여섯 번에 걸쳐 “이것으로는 판정할 수 없다”를 확인했습니다. 손에 쥐고 있던 것이 여섯 개 빠진 셈입니다.",
      "그런데 빠진 것이 무엇이었는지 보십시오. **전부 저울이었습니다.** 나를 재고 남을 재던 도구들입니다. 나를 하나님 앞에 세워 주던 것이 아니라, 나를 등급 안에 세워 두던 것들입니다.",
      "하나님께서 당신을 받으시는 근거는 이 여섯 중 어느 것도 아닙니다. 그 근거는 당신 밖에 있고, 당신의 뜨거운 날과 마른 날 사이에서 흔들리지 않습니다.",
      "**여섯이 무너져도 당신은 무너지지 않습니다.** 무너지는 것은 등급표입니다."
    ] },
    { type: "heading", text: "핵심 정리" },
    { type: "list", ordered: true, items: [
      "이 여섯 가지는 모두 실제로 일어나는 일이고, 모두 하나님께로부터 올 수 있습니다. 가짜가 아닙니다.",
      "다윗도 뜨거웠고 돌밭의 사람도 즉시 기뻐했습니다. 강도로는 둘을 구별할 수 없습니다.",
      "바알의 선지자들이 다니엘보다 격렬했고, 사울에게는 실제로 하나님의 영이 임했습니다. 몸의 반응은 그 사람의 상태를 보증하지 않습니다.",
      "아합의 선지자들에게 들어간 것도 밖에서 왔습니다. 밖에서 왔다는 느낌이 사실이어도 그 밖이 어디인지는 남는 질문입니다.",
      "광야에서 성경을 인용한 것은 예수님만이 아니었습니다.",
      "유다의 말은 그 자리에서 사랑처럼 들렸습니다. 사랑처럼 보이는 것은 사랑의 증거가 아닙니다.",
      "홍해에서 이스라엘에게 모든 감정이 함께 있었고, 그들은 곧 잊었습니다.",
      "있다고 해서 참인 것이 아니고, 없다고 해서 거짓인 것도 아닙니다. 두 방향을 함께 붙듭니다."
    ] },
    { type: "heading", text: "나눔 질문" },
    { type: "note", text: "*27~29번에 적으신 것 중 나누고 싶은 것만 나누십시오.*" },
    { type: "question", key: "l2-share-1" },
    { type: "question", key: "l2-share-2" },
    { type: "question", key: "l2-share-3" },
    { type: "question", key: "l2-share-4" },
    { type: "heading", text: "기도" },
    { type: "quote", body: [
      "주님,",
      "저는 제 체험을 증거로 삼아 왔습니다.",
      "뜨거웠던 날을 근거로 안심했고,",
      "마른 날에는 저를 의심했습니다.",
      "그 잣대를 곁에 있는 사람에게도 들이댔습니다.",
      "오늘 그 여섯 가지를 손에서 내려놓습니다.",
      "주께서 저를 만나 주신 일들을 부인하는 것이 아니라,",
      "그것으로 저를 재던 습관을 내려놓습니다.",
      "제가 서는 자리가 저의 체험이 아니라",
      "저를 위해 다 이루신 그리스도이심을 알게 하시고,",
      "빈손이 두렵지 않게 하여 주십시오.",
      "예수님의 이름으로 기도합니다. 아멘."
    ] }
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

export function DiscernmentLessonTwoWorkbook({ startPage }: { startPage?: string }) {
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
    const response = await fetch("/api/member/study/discernment-lesson-two", { cache: "no-store" });
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
    url.searchParams.set("lesson", "2");
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
    const response = await fetch("/api/member/study/discernment-lesson-two", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "answer", pageKey: page.key, questionKey, answer })
    });
    setNotice(response.ok ? "답변을 저장했습니다." : "답변을 저장하지 못했습니다.");
    if (response.ok) await load();
  }

  async function completePage() {
    if (needsLogin) return;
    const response = await fetch("/api/member/study/discernment-lesson-two", {
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
    <aside className="web-study-sidebar" aria-label="2과 교재 목차">
      <p className="section-kicker">분별에서 사랑으로</p>
      <h2>2과 학습 순서</h2>
      <div className="web-study-progress"><span style={{ width: `${percent}%` }} /></div>
      <strong>{needsLogin ? `총 ${course.pages.length}쪽 · 로그인 후 진도 저장` : `${completed}/${course.pages.length}쪽 완료 · ${percent}%`}</strong>
      <ol>{course.pages.map((item, index) => <li key={item.key}><button type="button" className={index === pageIndex ? "is-active" : ""} aria-current={index === pageIndex ? "page" : undefined} onClick={() => selectPage(index)}><span>{index + 1}</span><em><small>2과</small>{item.title}</em>{progressKeys.has(item.key) && <small>완료</small>}</button></li>)}</ol>
    </aside>
    <article className="web-study-page" id="study-content" ref={contentRef} tabIndex={-1}>
      <div className="web-study-page-heading"><div><p className="section-kicker">{page.eyebrow}</p><h2>{page.title}</h2></div><b>{String(pageIndex + 1).padStart(2, "0")} / {String(course.pages.length).padStart(2, "0")}</b></div>
      {needsLogin && <div className="web-study-login-callout"><strong>읽기는 누구나 할 수 있습니다.</strong><p>답변 저장과 공부 날짜 기록은 로그인한 교인에게 열립니다.</p><a className="primary-link" href={`/login?returnTo=${encodeURIComponent(`/bible-study/discernment-to-love?lesson=2&page=${page.key}#study-content`)}`}>로그인하여 이 페이지부터 기록하기</a></div>}
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
