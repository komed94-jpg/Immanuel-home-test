"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { discernmentToLoveCourse } from "@/lib/bible-study-discernment";

type SavedResponse = { pageKey: string; questionKey: string; answer: string; studiedOn: string; updatedAt: string };
type SavedProgress = { pageKey: string; studiedOn: string; completedAt: string };
type StudyState = { responses: SavedResponse[]; progress: SavedProgress[]; completion: { status: string; certifiedAt: string | null } | null; totalPages: number };

type Block =
  | { type: "heading"; text: string }
  | { type: "paragraphs"; body: string[] }
  | { type: "scripture"; label?: string; refs: string[] }
  | { type: "question"; key: string }
  | { type: "callout"; title: string; body: string[] }
  | { type: "quote"; body: string[] }
  | { type: "list"; ordered?: boolean; items: string[] }
  | { type: "note"; text: string };

const pageBlocks: Record<string, Block[]> = {
  opening: [
    { type: "heading", text: "여는 이야기" },
    { type: "paragraphs", body: [
      "목장 모임이 끝나고 돌아오는 길이었습니다.",
      "그날 한 자매가 기도하다가 울었습니다. 다른 형제는 처음부터 끝까지 조용히 앉아만 있었습니다. 차를 몰고 오면서 목자의 마음에 이런 생각이 스쳤습니다.",
      "*저 자매는 은혜를 받는구나. 그런데 저 형제는 왜 저렇게 메말랐을까.*",
      "그다음 주, 목자는 그 형제에게 평소보다 조금 덜 말을 걸었습니다. 일부러 그런 것은 아니었습니다. 그저 마음이 덜 갔을 뿐입니다. 아무도 모르는 사이에, 마음속에서는 이미 판정이 끝나 있었습니다."
    ] },
    { type: "question", key: "q0" },
    { type: "note", text: "*이 이야기는 5부에서 다시 만나게 됩니다.*" },
    { type: "heading", text: "이 과의 질문" },
    { type: "paragraphs", body: [
      "우리는 무엇으로 판단하고 있습니까.",
      "그리고 그 판단은 우리를 어디로 데려가고 있습니까."
    ] }
  ],
  "part-1": [
    { type: "heading", text: "읽기" },
    { type: "scripture", refs: ["마태복음 24:4-5", "마태복음 24:23-24"] },
    { type: "heading", text: "관찰" },
    { type: "question", key: "q1" },
    { type: "question", key: "q2" },
    { type: "question", key: "q3" },
    { type: "heading", text: "짚어 봅니다" },
    { type: "paragraphs", body: [
      "경고의 첫 자리에 놓인 것은 전쟁도 기근도 지진도 아니었습니다. **미혹**이었습니다. 속는다는 것입니다.",
      "그리고 그들이 쓰는 수단이 큰 표적과 기사입니다. 초라한 것이 아니라 대단해 보이는 것으로 사람을 끌어갑니다. 미혹당할 뻔한 대상도 바깥에 있는 사람이 아니라 **택하신 자들**입니다."
    ] },
    { type: "heading", text: "계속 읽기" },
    { type: "scripture", refs: ["마가복음 10:18", "마태복음 6:24"] },
    { type: "heading", text: "관찰" },
    { type: "question", key: "q4" },
    { type: "question", key: "q5" },
    { type: "heading", text: "짚어 봅니다" },
    { type: "paragraphs", body: [
      "‘내가 그리스도라’는 주장은 종교의 언어로만 오지 않습니다. 사이비 교주만 그 자리에 앉는 것이 아닙니다. 산업과 경제와 정치와 지식의 영역에서도, 어떤 사람이나 어떤 집단이 인간의 근원적인 문제를 다 풀어 줄 것처럼 보일 때가 있습니다. 그들이 스스로 그리스도라고 말하지는 않습니다. 그럴 필요가 없습니다. 우리가 그 자리에 그들을 앉히기 때문입니다.",
      "그들에게 나쁜 의도가 있는지 없는지는 여기서 중요하지 않습니다. 의도가 없는 사람도 많을 것입니다. 문제는 그들이 아니라 우리 마음이 그 자리에 무엇을 두는가입니다.",
      "**도움을 받는 것과 구원자로 삼는 것은 다릅니다.** 의사에게 치료를 받고, 전문가에게 조언을 구하고, 앞서간 사람에게 배우는 것은 하나님께서 이 세상에 두신 은혜입니다. 거절할 이유가 없습니다. 그러나 내 인생의 근원적인 안전이 그 사람에게 걸려 있다면, 자리가 바뀐 것입니다.",
      "예수님을 보십시오. 우상이 되실 리 없는 분이, 실제로 하나님이시기에 그 자리에 계셔도 되는 유일한 분이, 오히려 사람에게 경계를 주셨습니다."
    ] },
    { type: "heading", text: "내 삶을 봅니다" },
    { type: "question", key: "q6" },
    { type: "question", key: "q7" },
    { type: "question", key: "q8" },
    { type: "heading", text: "짚어 봅니다" },
    { type: "paragraphs", body: [
      "6번에 적힌 분들은 고마운 분들입니다. 그분들에게 마음이 쌓이는 것은 인지상정입니다.",
      "다만 고백과 실제가 오래 갈라진 채로 지나면, 신앙은 **종교**로 남습니다. 말은 남고 관계는 비는 것입니다."
    ] },
    { type: "callout", title: "잠깐 멈춥니다", body: [
      "지금 이 대목에서 자기를 정죄하지 마십시오.",
      "이 갈라짐을 발견한 것은 실패의 증거가 아니라 은혜의 시작입니다. 보이지 않던 것이 보이게 되는 일은 사람이 스스로 하는 일이 아닙니다. **인식도 은혜입니다.** 하나님께서 지금 당신에게 무엇인가를 보여 주고 계신 것입니다.",
      "발견은 정죄를 위한 것이 아니라 돌이킴을 위한 것입니다."
    ] }
  ],
  "part-2": [
    { type: "heading", text: "생각해 봅니다" },
    { type: "paragraphs", body: [
      "사람이 사기를 당하는 이유는 여러 가지입니다. 상대가 능숙하기도 하고, 마음이 급하기도 합니다.",
      "그런데 **판단의 기준**만 떼어 놓고 보면 이렇게 됩니다."
    ] },
    { type: "question", key: "q9" },
    { type: "question", key: "q10" },
    { type: "heading", text: "읽기" },
    { type: "scripture", refs: ["로마서 14:1-13"] },
    { type: "heading", text: "관찰" },
    { type: "question", key: "q11" },
    { type: "question", key: "q12" },
    { type: "question", key: "q13" },
    { type: "question", key: "q14" },
    { type: "heading", text: "해석" },
    { type: "question", key: "q15" },
    { type: "question", key: "q16" },
    { type: "heading", text: "짚어 봅니다" },
    { type: "paragraphs", body: [
      "로마 교회의 다툼은 교리 다툼이 아니었습니다. 신앙을 표현하는 방식이 서로 달랐을 뿐입니다. 그런데 그 차이가 곧바로 판단으로 넘어갔습니다.",
      "바울은 ‘누가 옳은가’를 가려 주지 않습니다. 대신 자리를 짚습니다. 남의 하인을 판단하는 너는 누구냐. 판단석에 앉을 수 있는 분은 한 분뿐인데, 우리가 그 자리에 올라간 것입니다."
    ] },
    { type: "heading", text: "내 삶을 봅니다" },
    { type: "note", text: "*아래 두 칸을 각각 채운 뒤에 나란히 놓고 보십시오.*" },
    { type: "question", key: "q17" },
    { type: "question", key: "q18" },
    { type: "question", key: "q19" },
    { type: "heading", text: "짚어 봅니다" },
    { type: "paragraphs", body: [
      "대부분의 경우, 두 칸에는 비슷한 것이 적힙니다.",
      "눈물, 뜨거움, 참석, 봉사, 말투, 표정.",
      "여기서 **잣대**라는 말을 쓰겠습니다. 잣대는 무엇을 재는 기준입니다. 우리는 저마다 신앙을 재는 잣대를 하나씩 들고 삽니다. 대개는 그런 것을 들고 있다는 사실조차 모른 채로 들고 다닙니다.",
      "17번에서 남을 재는 데 쓴 것과 18번에서 나를 재는 데 쓴 것을 나란히 놓아 보십시오. 대부분 **같은 잣대**입니다. 눈금이 하나뿐인 자를 들고, 그것을 안으로 한 번 밖으로 한 번 들이대고 있었던 것입니다.",
      "이것은 우연이 아닙니다. **내가 나를 재는 잣대는 반드시 남을 재는 잣대가 됩니다.** 두 개를 따로 가질 수는 없습니다."
    ] },
    { type: "heading", text: "읽기" },
    { type: "scripture", refs: ["마태복음 7:1-2"] },
    { type: "heading", text: "관찰" },
    { type: "question", key: "q20" },
    { type: "heading", text: "원어를 봅니다" },
    { type: "quote", body: [
      "**헤아리다 · μετρέω** *(metreō, 메트레오)* — 재다, 측량하다",
      "**헤아림 · μέτρον** *(metron, 메트론)* — 재는 기준, 재는 그릇",
      "마태복음 7장 2절 본문에는 μετρεῖτε *(메트레이테, 너희가 재는)*와 μέτρῳ *(메트로, 그 재는 기준으로)*로 나옵니다.",
      "**μέτρον은 마음이나 태도를 가리키는 말이 아닙니다.** 재는 도구, 재는 기준을 가리킵니다. 곡식을 담아 양을 재던 **되**를 부르던 말이기도 합니다. 오늘 우리가 쓰는 길이 단위 미터(meter)가 이 말에서 나왔습니다.",
      "그러니까 예수님께서 하신 말씀은 이런 뜻입니다.",
      "**너희가 손에 들고 있는 그 되로, 너희도 되어 받는다.**"
    ] },
    { type: "paragraphs", body: [
      "우리가 방금 17번과 18번에서 확인한 것을, 예수님께서 두 절로 말씀해 두셨습니다."
    ] },
    { type: "heading", text: "무엇을 헤아리고, 무엇을 헤아리지 않습니까" },
    { type: "paragraphs", body: [
      "이 말씀은 아무것도 판단하지 말라는 뜻이 아닙니다. 바로 몇 절 뒤에서 예수님은 거룩한 것을 개에게 주지 말라 하시고(마 7:6), 그 열매로 그들을 알리라 하십니다(마 7:16). 분별하지 않으면 지킬 수 없는 말씀들입니다.",
      "경계는 여기에 있습니다.",
      "**사물과 상황과 사건은 헤아립니다.** 이것이 옳은 일인가 그른 일인가, 이 가르침이 성경에 맞는가, 이 선택이 지혜로운가 어리석은가. 헤아리고 생각하고 판단해야 합니다. 헤아리지 않는 것은 겸손이 아니라 게으름입니다. 이 교재가 열 과에 걸쳐 하려는 일도 바로 그것입니다.",
      "**그러나 인격은 헤아리지 않습니다.**",
      "저 사람이 구원받았는가. 저 사람이 참된 신앙인인가. 저 사람이 하나님께 속했는가. 이것은 우리에게 맡겨진 일이 아닙니다. 그 자리에 앉는 것은 판단의 실수가 아니라 **죄**입니다. 재판석은 하나뿐이고, 그 자리에는 이미 앉으신 분이 계시기 때문입니다.",
      "그러니 이렇게 정리해 두십시오."
    ] },
    { type: "quote", body: [
      "어떤 행동이 옳은지 그른지는 말할 수 있습니다.",
      "그러나 그 행동을 근거로 **그 사람이 어떤 존재인지**를 판정할 수는 없습니다.",
      "하나는 분별이고, 다른 하나는 재판입니다."
    ] },
    { type: "paragraphs", body: [
      "앞에서 읽은 로마서 14장 4절이 같은 말을 합니다. 남의 하인을 판단하는 너는 누구냐. 그는 자기 주인에게 서기도 하고 넘어지기도 합니다."
    ] },
    { type: "callout", title: "죄라고 부르는 이유", body: [
      "**죄라고 부르는 이유는 정죄하기 위해서가 아닙니다.** 죄라고 이름이 붙은 것은 자백할 수 있고 용서받을 수 있습니다. 이 대목에서 떠오르는 얼굴이 있다면, 그것을 짐으로 지고 가지 마시고 하나님 앞에 내려놓으십시오. 그러라고 알려 주신 것입니다."
    ] },
    { type: "paragraphs", body: [
      "내 안에서 작동하던 것이 밖으로 나오면 이런 말이 됩니다."
    ] },
    { type: "list", items: [
      "저 사람은 왜 나만큼 뜨겁지 않을까",
      "이런 자리에서 어떻게 저렇게 무표정할 수 있을까",
      "저 사람은 참된 신앙인이 아닌 것 같다"
    ] },
    { type: "paragraphs", body: [
      "그리고 이 판정은 **입 밖으로 나오지 않아도 전달됩니다.** 눈빛으로, 앉는 자리로, 기도 제목을 물어보는 횟수로, 목장에서 누구에게 먼저 말을 거는가로 전달됩니다. 받는 사람은 압니다. 무엇 때문인지는 몰라도, 누군가가 자기를 재고 있다는 것은 압니다.",
      "여기서 한 단어를 쓰겠습니다. **체계**입니다.",
      "잘못된 기준은 하나의 생각으로 머물지 않고 체계가 됩니다. 체계의 특징은 저절로 돌아간다는 것입니다. 내가 의식하지 않아도 작동합니다. 그리고 반드시 영향력을 발휘합니다. 나에게 미치고, 내 곁에 있는 사람에게 미칩니다.",
      "목자에게 이것이 무거운 이유가 여기 있습니다. **목자의 체계는 목자 한 사람에게서 끝나지 않습니다.**",
      "목자가 아니어도 다르지 않습니다. 사람은 누구나 자기 곁에 있는 사람에게 자기 잣대를 물려줍니다. 부모가 자녀에게, 선배가 후배에게, 오래된 성도가 새로 온 사람에게 그렇게 전해집니다."
    ] }
  ],
  "part-3-a": [
    { type: "heading", text: "읽기" },
    { type: "scripture", refs: ["로마서 14:4", "로마서 14:12"] },
    { type: "heading", text: "관찰" },
    { type: "question", key: "q21" },
    { type: "heading", text: "짚어 봅니다" },
    { type: "paragraphs", body: [
      "사람은 각각 하나의 인격입니다. 나는 나이고 그는 그입니다. 각 사람이 하나님 앞에 따로 섭니다.",
      "부모와 자식 사이에도 그렇고, 남편과 아내 사이에도 그렇습니다. 자녀가 자라 어느 시점이 지나면 부모는 이것을 받아들여야 합니다. 심리학에서는 이것을 **분화**라고 부릅니다.",
      "이것이 되어 있지 않으면 이상한 일이 일어납니다.",
      "내가 그를 돕는다고 말하는데, 실제로는 **내가 괴로워서** 그를 바꾸려는 것입니다. 그가 자유로워지도록 섬기는 것이 아니라, 내 불편이 사라지도록 그를 움직이려는 것입니다.",
      "그런데 이것도 사랑이라는 이름으로 전달됩니다. 말 자체는 틀리지 않습니다. ‘네가 잘되기를 바라서 하는 말이야’는 거짓말이 아닙니다. 실제로 그런 마음도 있습니다.",
      "다만 영혼은 압니다. 말은 맞는데 관계는 점점 괴로워집니다."
    ] },
    { type: "heading", text: "읽기" },
    { type: "scripture", refs: ["고린도전서 13:4-7"] },
    { type: "heading", text: "관찰" },
    { type: "question", key: "q22" },
    { type: "question", key: "q23" },
    { type: "heading", text: "짚어 봅니다" },
    { type: "paragraphs", body: [
      "사랑은 오래 참습니다. 무례히 행하지 않습니다. 자기의 유익을 구하지 않습니다. 모든 것을 견딥니다.",
      "여기서 눈여겨볼 것은 **시간**입니다. 오래 참는다는 것은 시간을 준다는 뜻이고, 견딘다는 것은 결과가 아직 오지 않은 동안에도 곁에 있는다는 뜻입니다.",
      "곁에 있는 사람을 지금 당장 바꾸려는 조급함은, 그래서 사랑의 반대편에 있습니다. 그것은 열심이 아니라 **내가 견디지 못하는 것**입니다."
    ] },
    { type: "heading", text: "하나님은 우리를 어떻게 대하십니까" },
    { type: "paragraphs", body: [
      "만일 하나님께서 옳고 그름의 관점으로만 우리를 대하신다면, 길은 둘 중 하나일 것입니다.",
      "하나는 **즉각적인 심판**입니다. 우리가 오늘 하루 지은 것만으로도 우리는 그분 앞에 설 수 없습니다.",
      "다른 하나는 **우리에게서 인격을 거두어 가시는 것**입니다. 주셨던 자유를 회수하시고, 죄지을 수 없는 모양으로 우리를 만드시는 것입니다. 그러면 문제는 즉시 해결됩니다.",
      "두 길 다 빠르고 확실합니다. 그리고 하나님께서는 두 길 어느 쪽도 가지 않으셨습니다.",
      "대신 오래 참으셨습니다. 돌보셨습니다. 성화의 길로 계속 인도하셨습니다. 우리가 스스로 원하여 그 길을 가겠다고 결단하기까지 기다리셨고, 결단하고도 스스로는 되지 않아 주권적 은혜를 구할 때 그 은혜를 부어 주셨습니다.",
      "**그것이 사랑입니다.** 고린도전서 13장이 말하는 오래 참음이 바로 그것입니다.",
      "그리고 그 결단조차 우리가 스스로 낸 것이 아닙니다. 결단하고 싶은 마음이 생긴 것부터가 이미 은혜였습니다."
    ] },
    { type: "heading", text: "그러나 임마누엘입니다" },
    { type: "paragraphs", body: [
      "우리는 각각 하나님 앞에 따로 섭니다. 나는 나이고 그는 그입니다.",
      "그러나 **따로 선다는 것이 홀로 버려진다는 뜻은 아닙니다.**",
      "하나님은 사랑이시고, 하나님은 **함께** 계십니다. 임마누엘입니다. 그분은 우리를 당신의 연장으로 쓰지 않으시고, 우리를 당신 앞에 선 한 사람으로 세우시며, 그러면서도 떠나지 않으십니다.",
      "거리를 두시는 것이 아니라 자유를 주시는 것이고, 자유를 주시면서도 곁에 계십니다.",
      "**우리는 그런 하나님을 닮아 갑니다.**",
      "곁에 있는 사람을 내 속도로 끌고 가려는 마음이 올라올 때, 하나님께서 나를 얼마나 오래 참으셨는지를 떠올리는 것. 그리고 그 사람 곁에 계신 분이 나만이 아니라는 것을 기억하는 것. 그것이 이 과가 말하려는 자유의 실제 모습입니다."
    ] },
    { type: "heading", text: "내 삶을 봅니다" },
    { type: "question", key: "q24" },
    { type: "question", key: "q25" },
    { type: "question", key: "q26" },
    { type: "callout", title: "잠깐 멈춥니다", body: [
      "26번에서 정답을 요구하지 않았습니다. 대부분의 경우 둘 다 섞여 있고, 섞여 있는 것이 정상입니다.",
      "다만 섞여 있다는 것을 아는 사람과 모르는 사람의 목양은 다릅니다. 그리고 이것은 노력으로 순수해지는 문제가 아닙니다. 내가 사랑받고 있다는 것이 실제가 되는 만큼, 사람을 내 필요로 붙드는 힘이 줄어듭니다.",
      "분화는 손을 놓는 것이 아닙니다. 그를 내 연장이 아니라 하나님 앞에 선 한 사람으로 대하는 것입니다."
    ] }
  ],
  "part-3-b": [
    { type: "heading", text: "읽기" },
    { type: "scripture", refs: ["로마서 8:35-39"] },
    { type: "heading", text: "관찰" },
    { type: "question", key: "q27" },
    { type: "question", key: "q28" },
    { type: "heading", text: "짚어 봅니다" },
    { type: "heading", text: "그래도 우리는 넘어집니다" },
    { type: "paragraphs", body: [
      "은혜를 구하고, 은혜를 받고, 그러고도 우리는 넘어집니다. 이것은 예외적인 사고가 아니라 우리가 어떤 존재인지에 관한 사실입니다.",
      "그러면 무엇으로 다시 일어섭니까.",
      "다시 결단하는 것으로 일어서려는 사람은 곧 지칩니다. 결단의 힘은 몇 번 쓰면 바닥나기 때문입니다.",
      "바울은 다른 근거를 댑니다. 우리가 이기는 것은 **우리를 사랑하시는 이로 말미암아**입니다. 근거가 내 안에 있지 않습니다."
    ] },
    { type: "heading", text: "근거가 어디에 있습니까" },
    { type: "paragraphs", body: [
      "**내가 나 된 것이 근거가 아닙니다.** 하나님께서 궁극의 사랑이시라는 것이 근거입니다.",
      "그리고 그 사랑에서 우리를 끊을 수 있는 것은 하나도 없습니다. 사망도 생명도, 현재 일도 장래 일도, 높음도 깊음도, 그 어떤 피조물도 그렇습니다. 방금 27번에 손으로 적으신 그 목록이 바로 그것입니다.",
      "그래서 바울은 우리가 넘어지지 않는다고 말하지 않았습니다. **넉넉히 이긴다**고 말했습니다. 넘어지는 일이 없어서가 아니라, 넘어지는 것이 우리를 그 사랑에서 떼어 낼 수 없기 때문입니다."
    ] },
    { type: "heading", text: "이 승리는 누구의 것입니까" },
    { type: "paragraphs", body: [
      "**이 승리는 우리가 만들어 낸 것이 아닙니다.** 전적으로 하나님의 은혜이고, 자녀에게 주어진 특권입니다.",
      "같은 장 앞부분에서 바울은 우리가 양자의 영을 받아 아빠 아버지라 부르며, 자녀이면 또한 상속자라고 말했습니다(롬 8:15-17). 특권은 자격을 갖춘 사람이 얻어 낸 것이 아니라 자녀에게 주어지는 것입니다."
    ] },
    { type: "heading", text: "그러므로 다시, 임마누엘입니다" },
    { type: "paragraphs", body: [
      "나는 나이고 그는 그입니다. 그러나 하나님은 함께 계십니다.",
      "하나님께서 나를 그렇게 대하셨습니다. 옳고 그름으로만 재지 않으시고, 오래 참으시고, 넘어져도 끊어지지 않는 사랑으로 붙드셨습니다. **우리는 그런 하나님을 닮아 갑니다.**",
      "그리고 한 가지를 더 기억하십시오. 내가 그 사랑에서 끊어지지 않는 것처럼, **내 곁의 그 사람도 그렇습니다.** 그를 놓아도 되는 이유가 여기 있습니다. 내가 붙들지 않아도 그를 붙들고 계신 분이 있습니다."
    ] }
  ],
  "part-4": [
    { type: "heading", text: "읽기" },
    { type: "scripture", refs: ["마태복음 22:37-40", "누가복음 18:11-12"] },
    { type: "heading", text: "관찰" },
    { type: "question", key: "q29" },
    { type: "question", key: "q30" },
    { type: "question", key: "q31" },
    { type: "question", key: "q32" },
    { type: "heading", text: "짚어 봅니다" },
    { type: "paragraphs", body: [
      "바리새인이 말한 것은 거짓말이 아니었습니다. 그는 실제로 이레에 두 번 금식했고 실제로 십일조를 드렸습니다.",
      "문제는 그가 **지킬 수 있는 것을 지켰다는 근거로, 지키지 못한 것을 덮었다**는 데 있습니다. 그리고 그 안도를 근거로 곁에 있는 사람을 판단했습니다.",
      "여기서 고리가 닫힙니다.",
      "우리도 첫째 계명을 온전히 지키지 못한 채로 삽니다. 마음을 다하고 목숨을 다하고 뜻을 다하여 하나님을 사랑하라는 그 계명입니다. 정직하게 말하면, 우리 중 누구도 이것을 지켰다고 말할 수 없습니다.",
      "그런데 우리는 십일조를 드렸다는 이유로 안심하고, 도둑질하지 않았다는 이유로 안도합니다. 그리고 그 안도를 근거로 다른 사람을 판단합니다.",
      "**작은 것을 지켰다는 근거로 큰 것을 어기고, 그렇게 남을 정죄하는 그 행위로 다시 첫째 계명을 어깁니다.** 하나님을 사랑하라는 계명과 이웃을 사랑하라는 계명은 떨어져 있지 않기 때문입니다."
    ] },
    { type: "callout", title: "잠깐 멈춥니다", body: [
      "이 대목을 읽고 마음이 무거우셨다면, 그 무거움을 하나님 앞에 그대로 가지고 가십시오. 자기를 벌하는 데 쓰지 마십시오.",
      "이 고리를 스스로 끊을 수 있는 사람은 없습니다. 우리가 첫째 계명을 온전히 지키지 못한 채로도 하나님 앞에 설 수 있는 이유는, 우리 대신 그것을 완전히 지키신 분이 계시기 때문입니다.",
      "이 교재는 당신이 더 잘 지키게 만들려고 쓰인 것이 아닙니다. 당신이 무엇을 근거로 서 있는지를 다시 보게 하려고 쓰였습니다."
    ] }
  ],
  "part-5": [
    { type: "heading", text: "읽기" },
    { type: "scripture", refs: ["요한복음 8:31-32"] },
    { type: "heading", text: "관찰" },
    { type: "question", key: "q33" },
    { type: "question", key: "q34" },
    { type: "heading", text: "여는 이야기로 돌아갑니다" },
    { type: "paragraphs", body: [
      "앞에서 읽은 목자의 이야기를 다시 보십시오.",
      "그 목자는 같은 잣대를 자기에게도 들이대고 있다는 것은 알지 못했습니다. 은혜가 느껴진 주일 저녁에는 안심했고, 아무 감동 없이 끝난 수요일 새벽에는 마음 한구석이 불안했습니다."
    ] },
    { type: "question", key: "q35" },
    { type: "heading", text: "짚어 봅니다" },
    { type: "paragraphs", body: [
      "분별의 목적은 **자유**입니다.",
      "사람을 가려내는 능력을 얻기 위한 것이 아닙니다. 잘못된 잣대로부터 놓여나기 위한 것입니다.",
      "기준이 없으면 우리는 흔들립니다. 내 감정에 흔들리고, 남의 시선에 흔들리고, 무엇보다 내가 나에게 내리는 판정에 흔들립니다. 그것이 부자유입니다.",
      "그리고 부자유한 사람에게는 반드시 이런 일이 생깁니다. 인정받고 싶은 마음이 커집니다. 그 마음은 하나님 아니면 사람을 향하는데, 외적인 것에 빨리 반응하는 사람일수록 중심이 사람 쪽으로 옮겨 갑니다. 어떤 사람은 눌려서 위축되고, 어떤 사람은 더 많이 인정받으려고 애를 씁니다. 방향은 반대인데 뿌리는 같습니다.",
      "바른 기준을 배우면 반대의 일이 일어납니다.",
      "나를 재판하는 일을 그만두게 됩니다. 그러면 남을 재판하는 일도 그만두게 됩니다. 그 자리가 비면 무엇이 들어옵니까.",
      "**사랑이 들어옵니다.**",
      "이것이 이 교재가 가려는 방향입니다. 앞으로 여러 과에 걸쳐 무엇이 기준이 될 수 없는지를 하나씩 살펴보게 될 것입니다. 그 끝에 놓여 있는 것은 더 정교한 판별법이 아니라 사랑입니다."
    ] }
  ],
  closing: [
    { type: "heading", text: "이 교재를 시작하며 — 두 가지 약속" },
    { type: "paragraphs", body: [
      "앞으로 ‘이것은 기준이 될 수 없습니다’라는 말을 여러 번 듣게 되실 것입니다. 특히 2과와 3과에서 그 말이 집중됩니다. 시작하면서 두 가지를 함께 정해 두고 싶습니다.",
      "**첫째, ‘기준이 아니다’는 ‘거짓이다’가 아닙니다.**",
      "눈물도, 뜨거움도, 부르짖음도, 간증도 하나님께로부터 올 수 있습니다. 그런 일이 성경에 많이 있습니다. 우리가 배우려는 것은 그것들이 가짜라는 것이 아니라, 그것들만으로는 판정할 수 없다는 것입니다. 있다고 해서 참인 것도 아니고, 없다고 해서 거짓인 것도 아닙니다. 이 두 방향을 끝까지 함께 붙드십시오.",
      "**둘째, 이 배움을 남을 판정하는 도구로 쓰지 않기로 합시다.**",
      "이 교재를 읽고 나서 어떤 사람을 보며 ‘저 사람은 외적인 것에 속고 있구나’ 하는 생각이 먼저 든다면, 그것은 이 교재를 정확히 반대로 읽은 것입니다.",
      "분별은 남을 향해 겨누는 칼이 아니라, 내가 딛고 선 땅을 확인하는 일입니다."
    ] },
    { type: "heading", text: "핵심 정리" },
    { type: "list", ordered: true, items: [
      "마지막 때에 관해 예수님이 가장 먼저 경고하신 것은 미혹이었고, 미혹당할 뻔한 대상은 택하신 자들이었습니다.",
      "도움을 받는 것과 구원자로 삼는 것은 다릅니다.",
      "판단의 기준이 외적인 것이 될 때 사람은 속게 되어 있습니다.",
      "내가 나를 재는 잣대는 반드시 남을 재는 잣대가 됩니다. 두 개를 따로 가질 수 없습니다.",
      "잘못된 기준은 체계가 되어 저절로 돌아가며, 목자의 체계는 목자에게서 끝나지 않습니다.",
      "각 사람은 하나님 앞에 따로 섭니다. 분화되지 않은 도움은 사랑의 이름으로 전달되지만 관계를 괴롭게 만듭니다.",
      "분별의 목적은 판별력이 아니라 자유이고, 자유의 자리에 들어오는 것은 사랑입니다."
    ] },
    { type: "heading", text: "나눔 질문" },
    { type: "note", text: "*17~19번, 25~26번에 적으신 것 중 나누고 싶은 것만 나누십시오. 서로에게 답을 요구하지 않습니다.*" },
    { type: "question", key: "share-1" },
    { type: "question", key: "share-2" },
    { type: "question", key: "share-3" },
    { type: "question", key: "share-4" },
    { type: "heading", text: "기도" },
    { type: "quote", body: [
      "주님,",
      "저는 제가 무엇으로 판단하며 살아왔는지 잘 몰랐습니다.",
      "제 감정으로 저를 재판했고, 같은 잣대로 곁에 있는 사람을 재었습니다.",
      "사랑이라 부르며 사실은 제 불편을 덜려고 했던 일들을 이제 봅니다.",
      "보게 하신 것이 은혜인 줄 압니다.",
      "이 발견을 저를 벌하는 데 쓰지 않게 하시고,",
      "돌이키는 자리로 삼게 하여 주십시오.",
      "제가 서 있는 땅이 저의 뜨거움이 아니라",
      "저를 위해 다 이루신 그리스도이심을 다시 붙들게 하시고,",
      "그 자유 안에서 사람을 다시 사랑하게 하여 주십시오.",
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

export function DiscernmentWorkbook({ startPage }: { startPage?: string }) {
  const course = discernmentToLoveCourse;
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
    const response = await fetch(`/api/member/study?course=${course.slug}`, { cache: "no-store" });
    const result = await response.json() as StudyState & { error?: string };
    if (response.status === 401) {
      setNeedsLogin(true);
      setData({ responses: [], progress: [], completion: null, totalPages: course.pages.length });
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
    const response = await fetch("/api/member/study", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "answer", courseSlug: course.slug, lessonSlug: course.lessonSlug, pageKey: page.key, questionKey, answer })
    });
    setNotice(response.ok ? "답변을 저장했습니다." : "답변을 저장하지 못했습니다.");
    if (response.ok) await load();
  }

  async function completePage() {
    if (needsLogin) return;
    const response = await fetch("/api/member/study", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "complete-page", courseSlug: course.slug, lessonSlug: course.lessonSlug, pageKey: page.key })
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
    <aside className="web-study-sidebar" aria-label="교재 목차">
      <p className="section-kicker">분별에서 사랑으로</p>
      <h2>1과 학습 순서</h2>
      <div className="web-study-progress"><span style={{ width: `${percent}%` }} /></div>
      <strong>{needsLogin ? `총 ${course.pages.length}쪽 · 로그인 후 진도 저장` : `${completed}/${course.pages.length}쪽 완료 · ${percent}%`}</strong>
      <ol>{course.pages.map((item, index) => <li key={item.key}><button type="button" className={index === pageIndex ? "is-active" : ""} aria-current={index === pageIndex ? "page" : undefined} onClick={() => selectPage(index)}><span>{index + 1}</span><em><small>{item.lesson}</small>{item.title}</em>{progressKeys.has(item.key) && <small>완료</small>}</button></li>)}</ol>
    </aside>
    <article className="web-study-page" id="study-content" ref={contentRef} tabIndex={-1}>
      <div className="web-study-page-heading"><div><p className="section-kicker">{page.eyebrow}</p><h2>{page.title}</h2></div><b>{String(pageIndex + 1).padStart(2, "0")} / {String(course.pages.length).padStart(2, "0")}</b></div>
      {needsLogin && <div className="web-study-login-callout"><strong>읽기는 누구나 할 수 있습니다.</strong><p>답변 저장, 공부 날짜 기록, 진도와 수료 관리는 로그인한 교인에게 열립니다.</p><a className="primary-link" href={`/login?returnTo=${encodeURIComponent(`/bible-study/${course.slug}?page=${page.key}#study-content`)}`}>로그인하여 이 페이지부터 기록하기</a></div>}
      <div className="web-study-sections">{blocks.map(renderBlock)}</div>
      {notice && <p className="content-manager-notice" role="status">{notice}</p>}
      <div className="web-study-actions">
        <button type="button" className="text-action" disabled={pageIndex === 0} onClick={() => selectPage(pageIndex - 1)}>이전</button>
        {!needsLogin && <button type="button" className="primary-link" onClick={() => void completePage()}>{progressKeys.has(page.key) ? "완료 날짜 다시 저장" : "이 페이지 공부 완료"}</button>}
        <button type="button" className="text-action" disabled={pageIndex === course.pages.length - 1} onClick={() => selectPage(pageIndex + 1)}>다음</button>
      </div>
      {data?.completion && <p className="web-study-completion">{data.completion.status === "certified" ? "관리자가 수료 처리했습니다." : "전체 학습 완료 상태입니다. 관리자 확인 후 수료 처리됩니다."}</p>}
    </article>
  </section>;
}
