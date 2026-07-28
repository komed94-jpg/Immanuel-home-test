"use client";
import { useEffect, useMemo, useRef, useState } from "react";

type SavedResponse={pageKey:string;questionKey:string;answer:string;studiedOn:string;updatedAt:string};
type SavedProgress={pageKey:string;studiedOn:string;completedAt:string};
type StudyState={responses:SavedResponse[];progress:SavedProgress[];totalPages:number};
type Question={key:string;label:string;prompt:string};
type StudyPage={key:string;title:string;eyebrow:string;questions:Question[]};
type Block=
|{type:"heading";text:string}
|{type:"paragraphs";body:string[]}
|{type:"scripture";label?:string;refs:string[]}
|{type:"question";key:string}
|{type:"callout";title:string;body:string[]}
|{type:"quote";body:string[]}
|{type:"list";ordered?:boolean;items:string[]}
|{type:"note";text:string};

const course={slug:"discernment-to-love",lessonSlug:"discernment-lesson-4",title:"4과 · 새 언약 — 하나님은 왜 마음에 새기셨는가",pages:[{"key":"l4-opening","eyebrow":"LESSON 04 · OPENING","title":"새 언약 — 하나님은 왜 마음에 새기셨는가","questions":[{"key":"l4-q0","label":"✍️ 시작 질문","prompt":"지난 과를 마치고 손이 비었다면, 지금 그 자리에 무엇이 있으면 좋겠습니까. 한 문장으로 적어 두십시오."}]},{"key":"l4-part-1","eyebrow":"LESSON 04 · PART 01","title":"옛 언약의 표지는 어디에 있었습니까","questions":[{"key":"l4-q1","label":"1번","prompt":"하나님께서 아브라함과 그의 후손에게 언약의 표징으로 주신 것은 무엇입니까."},{"key":"l4-q2","label":"2번","prompt":"그 표징은 몸의 어디에 새겨졌습니까."},{"key":"l4-q3","label":"3번","prompt":"안식일은 하나님과 이스라엘 사이에 무엇이 된다고 말합니까."},{"key":"l4-q4","label":"4번","prompt":"안식일을 지키는지 지키지 않는지는 다른 사람이 볼 수 있습니까, 볼 수 없습니까."}]},{"key":"l4-part-2","eyebrow":"LESSON 04 · PART 02","title":"옛 언약은 왜 깨졌습니까","questions":[{"key":"l4-q5","label":"5번","prompt":"하나님께서 세우시겠다고 하신 언약은 어떤 언약이라고 부르십니까."},{"key":"l4-q6","label":"6번","prompt":"32절에서, 그 언약은 언제 맺은 언약과 같지 않다고 하십니까."},{"key":"l4-q7","label":"7번","prompt":"32절 후반부에서, 옛 언약은 어떻게 되었습니까. 누가 그렇게 했습니까."},{"key":"l4-q8","label":"8번","prompt":"그 일이 일어나던 때에 하나님께서는 자신을 무엇이라고 부르십니까."}]},{"key":"l4-part-3","eyebrow":"LESSON 04 · PART 03","title":"새 언약의 표지는 어디에 있습니까","questions":[{"key":"l4-q9","label":"9번","prompt":"하나님께서 자신의 법을 어디에 두시겠다고 하십니까. 두 군데를 적으십시오."},{"key":"l4-q10","label":"10번","prompt":"33절과 34절에서 \"내가\"로 시작하는 표현을 찾아 모두 적어 보십시오."},{"key":"l4-q11","label":"11번","prompt":"34절에서, 사람들이 서로에게 더 이상 하지 않게 될 말은 무엇입니까."},{"key":"l4-q12","label":"12번","prompt":"34절 마지막에서 하나님께서 다시는 하지 않으시겠다고 한 것은 무엇입니까."},{"key":"l4-q13","label":"13번","prompt":"하나님께서 주시겠다고 한 것을 모두 적어 보십시오."},{"key":"l4-q14","label":"14번","prompt":"27절에서, 우리가 하나님의 율례를 행하게 되는 것은 누구의 일하심 때문입니까."},{"key":"l4-q15","label":"15번","prompt":"이 편지는 무엇으로 쓴 것이 아니라고 합니까. 그리고 어디에 쓴 것이라고 합니까."},{"key":"l4-q16","label":"16번","prompt":"옛 언약의 표지와 새 언약의 표지가 놓인 자리를 각각 한 단어로 적어 보십시오.\n\n옛 언약 : ____________  새 언약 : ____________"}]},{"key":"l4-part-4","eyebrow":"LESSON 04 · PART 04","title":"그러면 하나님께서 멀어지신 것입니까","questions":[{"key":"l4-q17","label":"17번","prompt":"에스겔 36:27에서 하나님께서 우리 속에 두시겠다고 한 것은 무엇입니까."},{"key":"l4-q18","label":"18번","prompt":"마태복음 1:23에서 임마누엘은 무슨 뜻이라고 합니까."}]},{"key":"l4-part-5","eyebrow":"LESSON 04 · PART 05","title":"새 언약을 한 글자로 줄이면","questions":[{"key":"l4-q19","label":"19번","prompt":"예수님께서 잔을 주시며 그 잔을 무엇이라고 하셨습니까."},{"key":"l4-q20","label":"20번","prompt":"같은 밤에 예수님께서 주신 계명은 무엇입니까."},{"key":"l4-q21","label":"21번","prompt":"그 계명은 무엇을 본으로 삼으라고 합니까."},{"key":"l4-q22","label":"22번","prompt":"성령으로 말미암아 우리 마음에 부은 바 된 것은 무엇입니까."},{"key":"l4-q23","label":"23번","prompt":"같은 밤에 새 **언약**과 새 **계명**이 함께 주어졌습니다. 그리고 성령께서 마음에 부으시는 것이 무엇인지 로마서가 말합니다. 그렇다면 마음에 새겨지는 것을 한 단어로 말하면 무엇이겠습니까."}]},{"key":"l4-part-6","eyebrow":"LESSON 04 · PART 06","title":"새 언약 다음에 또 다른 언약은 없습니다","questions":[{"key":"l4-q24","label":"24번","prompt":"그리스도께서 성소에 들어가신 것은 몇 번입니까. 그리고 무엇으로 들어가셨습니까."},{"key":"l4-q25","label":"25번","prompt":"그 결과 이루신 속죄는 어떤 속죄라고 합니까."},{"key":"l4-q26","label":"26번","prompt":"히브리서 10:14에서, 한 번의 제사로 거룩하게 된 자들이 어떻게 되었다고 합니까."}]},{"key":"l4-part-7","eyebrow":"LESSON 04 · PART 07","title":"분별이 재앙이 될 때","questions":[{"key":"l4-q27","label":"27번","prompt":"이 이야기에서 누가 옳았는지 판정하지 마십시오. 대신 이렇게 물어 보십시오. **왜 이 문제는 이토록 풀기 어려웠겠습니까.**"}]},{"key":"l4-closing","eyebrow":"LESSON 04 · CLOSING","title":"내 삶을 봅니다 · 핵심 정리 · 나눔 · 기도","questions":[{"key":"l4-q28","label":"28번","prompt":"이 과를 시작할 때 적어 두신 문장을 다시 보십시오. 지금 그 자리에 무엇이 놓였습니까.\n\n처음에 적은 것 : _________________________________\n지금 : _________________________________"},{"key":"l4-q29","label":"29번","prompt":"\"새 언약은 내가 지켜야 할 조건의 목록이 아니라 하나님께서 하시겠다고 하신 일의 목록이다.\" 이 문장이 지금 나에게 어떻게 들립니까."},{"key":"l4-q30","label":"30번","prompt":"내가 누군가를 향해 마음속으로 \"저 사람은 아직 아닌 것 같다\"고 판단한 적이 있습니까. 오늘 배운 것 앞에서 그 판단을 어떻게 하시겠습니까."},{"key":"l4-share-1","label":"나눔 질문 1","prompt":"\"표지가 밖에서 안으로 옮겨졌다\"는 말을 듣고 가장 먼저 든 생각은 무엇이었습니까."},{"key":"l4-share-2","label":"나눔 질문 2","prompt":"예레미야 31장의 \"내가\"들을 적어 보셨습니다. 그 목록을 보면서 어떤 마음이 들었습니까."},{"key":"l4-share-3","label":"나눔 질문 3","prompt":"에드워즈가 성찬 문제로 교회에서 나가게 된 이야기가 우리 목장에 주는 교훈이 있다면 무엇이겠습니까."},{"key":"l4-share-4","label":"나눔 질문 4","prompt":"\"우리가 깨뜨려도 그분이 붙드시는 언약\"이라는 말이 지금 나에게 위로가 됩니까, 아니면 다르게 들립니까."}]}] satisfies StudyPage[]};
const pageBlocks:Record<string,Block[]>={"l4-opening":[{"type":"paragraphs","body":["지난 두 과에서 우리는 열두 가지를 내려놓았습니다."]},{"type":"paragraphs","body":["감정도, 몸의 반응도, 밖에서 온 것 같은 느낌도, 떠오른 성경 구절도, 사랑처럼 보이는 것도, 여러 감정이 함께 나타나는 것도. 그리고 유창한 신앙의 말도, 분명한 회심의 과정도, 종교생활의 열심도, 넘치는 찬양도, 강한 확신도, 사람을 감동시킨 간증도."]},{"type":"paragraphs","body":["그러면 반드시 이 질문이 남습니다."]},{"type":"quote","body":["**하나님은 왜 확인할 수 있는 표지를 주지 않으셨습니까.**"]},{"type":"paragraphs","body":["이 과의 답을 먼저 말씀드리겠습니다."]},{"type":"quote","body":["**하나님께서 표지를 없애신 것이 아닙니다.**","**표지를 밖에서 안으로 옮기셨습니다.**"]},{"type":"paragraphs","body":["우리가 열두 가지를 붙잡았던 것은 어리석어서가 아닙니다. 사람은 볼 수 있는 것을 붙잡게 되어 있습니다. 다만 새 언약의 표지는 처음부터 볼 수 없는 자리에 놓였습니다."]},{"type":"paragraphs","body":["이 과에서 그것이 어디로 옮겨졌는지, 왜 옮겨졌는지, 그리고 그 결과가 무엇인지를 봅니다."]},{"type":"question","key":"l4-q0"}],"l4-part-1":[{"type":"heading","text":"읽기 ①"},{"type":"scripture","refs":["창세기 17:9-11"]},{"type":"question","key":"l4-q1"},{"type":"question","key":"l4-q2"},{"type":"heading","text":"읽기 ②"},{"type":"scripture","refs":["출애굽기 31:16-17"]},{"type":"question","key":"l4-q3"},{"type":"question","key":"l4-q4"},{"type":"heading","text":"짚어 봅니다"},{"type":"paragraphs","body":["옛 언약의 표지는 전부 **밖에 있었습니다.**"]},{"type":"paragraphs","body":["할례는 몸에 새겨졌습니다. 안식일은 일정으로 확인되었습니다. 절기도, 정결법도, 제사도 마찬가지였습니다. 눈으로 볼 수 있고, 셀 수 있고, 확인할 수 있었습니다."]},{"type":"paragraphs","body":["이것은 나쁜 제도가 아니었습니다. 오히려 명확했습니다. 누가 언약 백성인지가 분명했습니다."]},{"type":"paragraphs","body":["그런데 이 명확함에는 한 가지 한계가 있었습니다. **밖에 있는 표는 안에 무엇이 있는지를 말해 주지 않습니다.** 할례받은 몸이 할례받은 마음을 뜻하지는 않았습니다."]}],"l4-part-2":[{"type":"heading","text":"읽기"},{"type":"scripture","refs":["예레미야 31:31-32"]},{"type":"question","key":"l4-q5"},{"type":"question","key":"l4-q6"},{"type":"question","key":"l4-q7"},{"type":"question","key":"l4-q8"},{"type":"heading","text":"짚어 봅니다"},{"type":"paragraphs","body":["여기서 잠깐 멈춰서 보아야 할 것이 있습니다."]},{"type":"paragraphs","body":["**옛 언약은 하나님께서 깨뜨리신 것이 아닙니다.** 사람이 깨뜨렸습니다. 본문은 그것을 숨기지 않습니다."]},{"type":"paragraphs","body":["그리고 하나님께서는 그 일을 말씀하시면서 자신을 **남편**이라고 부르십니다. 계약의 상대방이 아니라 남편입니다. 깨진 것은 조항이 아니라 관계였다는 뜻입니다."]},{"type":"paragraphs","body":["여기서 우리는 1과에서 보았던 것을 다시 만납니다. 하나님께서는 사람에게 자유를 주셨고, 자유를 주셨다는 것은 **배신당할 수 있는 자리로 내려오셨다**는 뜻입니다. 배신할 수 없는 상대와는 언약을 맺을 필요가 없습니다."]},{"type":"paragraphs","body":["표지가 밖에 있어서 언약이 깨진 것은 아닙니다. 다만 밖에 있는 표지로는 그 깨짐을 막을 수 없었습니다. 몸에 새긴 표가 마음을 지켜 주지는 못했습니다."]}],"l4-part-3":[{"type":"heading","text":"읽기 ①"},{"type":"scripture","refs":["예레미야 31:33-34"]},{"type":"question","key":"l4-q9"},{"type":"question","key":"l4-q10"},{"type":"question","key":"l4-q11"},{"type":"question","key":"l4-q12"},{"type":"heading","text":"읽기 ②"},{"type":"scripture","refs":["에스겔 36:26-27"]},{"type":"question","key":"l4-q13"},{"type":"question","key":"l4-q14"},{"type":"heading","text":"읽기 ③"},{"type":"scripture","refs":["고린도후서 3:3"]},{"type":"question","key":"l4-q15"},{"type":"heading","text":"나란히 놓고 봅니다"},{"type":"question","key":"l4-q16"},{"type":"heading","text":"짚어 봅니다"},{"type":"paragraphs","body":["돌판에서 마음판으로 옮겨졌습니다."]},{"type":"paragraphs","body":["이것이 지난 두 과의 답입니다. **새 언약의 실재는 처음부터 눈에 보이지 않는 자리에 놓였습니다.** 그래서 우리는 자꾸 볼 수 있는 것을 표지로 삼으려 했던 것입니다. 눈물을, 뜨거움을, 열심을, 확신을."]},{"type":"paragraphs","body":["에드워즈가 그 열두 가지를 \"있어도 증명하지 못하고 없어도 부정하지 못하는 것\"이라고 부른 이유가 여기 있습니다. 그가 까다로워서가 아닙니다. **언약의 성격 자체가 그렇기 때문입니다.**"]},{"type":"paragraphs","body":["한 가지 더 눈여겨보십시오. 10번에서 찾으신 \"내가\"들입니다. 법을 두는 것도, 마음에 기록하는 것도, 하나님이 되시는 것도, 죄를 사하는 것도, 다시는 기억하지 않으시는 것도 전부 주어가 하나님입니다. **새 언약은 우리가 지켜야 할 조건의 목록이 아니라, 하나님께서 하시겠다고 하신 일의 목록입니다.**"]},{"type":"paragraphs","body":["그리고 11번을 보십시오. 작은 자로부터 큰 자까지 다 하나님을 알기 때문에, 이제 서로에게 \"너는 여호와를 알라\"고 말하지 않게 됩니다. 하나님과 나 사이에 반드시 끼어야 할 사람이 없어졌다는 뜻입니다. 이 구절은 나중에 7과에서 다시 만나게 됩니다."]},{"type":"callout","title":"잠깐 멈춥니다","body":["마음에 새기신다는 말이 무겁게 들리실 수 있습니다. 내 마음을 들여다보니 새겨진 것이 잘 보이지 않기 때문입니다.","그런데 다시 보십시오. 새기는 분이 누구입니까. 내가 새기는 것이 아닙니다.","지금 보이지 않는다고 해서 새겨지지 않은 것이 아닙니다. 돌판은 다 새긴 뒤에 확인할 수 있지만, 마음판은 새기는 중에도 잘 보이지 않습니다."]}],"l4-part-4":[{"type":"paragraphs","body":["표지가 안으로 들어갔다는 말을 이렇게 들으실 수도 있습니다. *이제 확인할 방법이 없으니, 하나님은 더 멀어지신 것 아닌가.*"]},{"type":"paragraphs","body":["정반대입니다."]},{"type":"heading","text":"읽기"},{"type":"scripture","refs":["에스겔 36:27","마태복음 1:23"]},{"type":"question","key":"l4-q17"},{"type":"question","key":"l4-q18"},{"type":"heading","text":"짚어 봅니다"},{"type":"paragraphs","body":["몸에 표를 새기는 것으로는 부족하셨습니다. 그래서 **직접 들어오셨습니다.**"]},{"type":"paragraphs","body":["새 언약에서 하나님께서 우리 속에 두신 것은 규정이 아니라 **당신의 영**입니다. 표지가 안으로 옮겨졌다는 것은 하나님께서 멀어지셨다는 뜻이 아니라, 밖에 표를 붙이는 것으로 만족하지 않으시고 안으로 들어오셨다는 뜻입니다."]},{"type":"paragraphs","body":["**임마누엘입니다. 하나님이 우리와 함께 계십니다.**"]},{"type":"paragraphs","body":["1과에서 우리는 이렇게 배웠습니다. 나는 나이고 그는 그이지만, 따로 선다는 것이 홀로 버려진다는 뜻은 아니라고. 그 말의 근거가 여기 있습니다. 하나님께서는 우리를 각각 당신 앞에 세우시면서, 동시에 우리 안에 들어오셨습니다."]},{"type":"paragraphs","body":["**거리를 두시는 것이 아니라 자유를 주시는 것이고, 자유를 주시면서도 떠나지 않으십니다.**"]}],"l4-part-5":[{"type":"heading","text":"읽기 ①"},{"type":"scripture","refs":["누가복음 22:20"]},{"type":"question","key":"l4-q19"},{"type":"heading","text":"읽기 ②"},{"type":"scripture","refs":["요한복음 13:34"]},{"type":"question","key":"l4-q20"},{"type":"question","key":"l4-q21"},{"type":"heading","text":"읽기 ③"},{"type":"scripture","refs":["로마서 5:5"]},{"type":"question","key":"l4-q22"},{"type":"heading","text":"나란히 놓고 봅니다"},{"type":"question","key":"l4-q23"},{"type":"heading","text":"짚어 봅니다"},{"type":"paragraphs","body":["같은 밤이었습니다."]},{"type":"paragraphs","body":["잔을 드시며 \"이 잔은 내 피로 세우는 새 언약\"이라 하신 그 밤에, \"새 계명을 너희에게 주노니 서로 사랑하라\"고 하셨습니다. 새 언약과 새 계명은 다른 두 가지가 아닙니다. **새 계명은 새 언약의 계명입니다.**"]},{"type":"paragraphs","body":["그리고 언약의 인침이 성령이신데, 그 성령께서 우리 마음에 부으시는 것이 하나님의 사랑이라고 로마서는 말합니다."]},{"type":"paragraphs","body":["그러니 새 언약의 내용을 한 글자로 줄이면 **사랑**입니다."]},{"type":"paragraphs","body":["이것은 감상적인 정리가 아닙니다. 앞으로 배울 다섯 가지 기준 가운데 마지막이 \"사랑의 열매를 맺는가\"인데, 그것이 다섯 중 하나가 아니라 **언약이 실제로 체결되었는지를 보여 주는 표지**인 이유가 여기서 나옵니다."]},{"type":"paragraphs","body":["돌판에 새겨진 것은 법이었습니다. 마음판에 새겨진 것은 사랑입니다."]}],"l4-part-6":[{"type":"heading","text":"읽기"},{"type":"scripture","refs":["히브리서 9:11-12","히브리서 10:14"]},{"type":"question","key":"l4-q24"},{"type":"question","key":"l4-q25"},{"type":"question","key":"l4-q26"},{"type":"heading","text":"짚어 봅니다"},{"type":"paragraphs","body":["여기서 한 가지를 분명히 못 박고 갑니다."]},{"type":"paragraphs","body":["**새 언약의 \"새\"는 \"최신\"이라는 뜻이 아닙니다.** 다음에 더 새로운 것이 나올 수 있다는 뜻이 아니라, **질적으로 다르다**는 뜻입니다. 돌판이 아니라 마음판이고, 짐승의 피가 아니라 자기 피입니다."]},{"type":"paragraphs","body":["그리고 히브리서는 이것을 **단번**이라고 말합니다. 한 번, 영원히, 온전히. 반복될 필요가 없고 갱신될 필요도 없습니다."]},{"type":"paragraphs","body":["**그러므로 새 언약 이후에 또 다른 언약은 없습니다.**"]},{"type":"paragraphs","body":["이 한 문장을 기억해 두십시오. 나중에 \"계시록에 감추어진 또 하나의 새로운 약속이 있다\"고 말하는 사람들을 만나게 될 것입니다. 그때 이 문장이 답이 됩니다."]}],"l4-part-7":[{"type":"paragraphs","body":["이 과의 마지막으로, 우리 자신에게 향하는 이야기를 하나 하겠습니다."]},{"type":"paragraphs","body":["조나단 에드워즈는 매사추세츠 노샘프턴 교회에서 20년 넘게 목회했습니다. 그의 외조부가 그 자리의 전임자였습니다. 그리고 그는 그 교회에서 **쫓겨났습니다.**"]},{"type":"paragraphs","body":["이유는 성찬이었습니다."]},{"type":"paragraphs","body":["전임자는 성찬의 문을 넓게 열어 두었습니다. 신앙을 고백하지 못하는 사람도 참여할 수 있었고, 성찬이 오히려 그를 회심으로 이끄는 통로가 될 수 있다고 보았습니다."]},{"type":"paragraphs","body":["에드워즈는 그것을 바꾸려 했습니다. 성찬은 언약 백성의 식탁이니, 참여하는 사람은 자신의 믿음을 고백할 수 있어야 한다고 보았습니다."]},{"type":"paragraphs","body":["이것은 사소한 절차 논쟁이 아니었습니다. 근본에 있는 질문은 이것이었습니다."]},{"type":"quote","body":["**새 언약의 표지를 누가 받았다고 볼 수 있는가.**"]},{"type":"paragraphs","body":["교회가 갈라졌고, 결국 교인들은 그를 내보냈습니다."]},{"type":"heading","text":"짚어 봅니다"},{"type":"question","key":"l4-q27"},{"type":"paragraphs","body":["풀기 어려웠던 이유는 이 과에서 배운 것 안에 있습니다."]},{"type":"paragraphs","body":["**표지가 안으로 들어갔기 때문입니다.**"]},{"type":"paragraphs","body":["마음판에 새겨진 것을 밖에서 확인하려는 모든 시도는 반드시 어려움을 만납니다. 너무 넓게 열면 언약의 표지가 무의미해지고, 너무 좁게 닫으면 하나님께서 이미 받으신 사람을 사람이 밀어냅니다."]},{"type":"paragraphs","body":["열두 가지를 정리한 바로 그 사람이, 자기 교회에서 그 문제로 무너졌습니다. **분별을 가장 깊이 연구한 사람도 여기서 어려웠습니다.**"]},{"type":"paragraphs","body":["그러니 이 교재를 읽는 우리는 더욱 조심해야 합니다. 우리는 지금 분별을 배우고 있고, 배운 것을 곧바로 쓰고 싶어질 것입니다. 그때 이 이야기를 기억하십시오."]},{"type":"paragraphs","body":["**분별은 사람을 걸러 내는 능력이 아닙니다.** 그렇게 쓰기 시작하면, 아무리 정확한 분별이라도 목양의 재앙이 됩니다."]}],"l4-closing":[{"type":"heading","text":"내 삶을 봅니다"},{"type":"question","key":"l4-q28"},{"type":"question","key":"l4-q29"},{"type":"question","key":"l4-q30"},{"type":"callout","title":"잠깐 멈춥니다","body":["이 과를 읽으면서 이런 생각이 드셨을 수 있습니다.","*마음에 새겨진 것이 사랑이라면, 내 마음에는 사랑이 별로 없는데. 그러면 나는 새 언약 밖에 있는 것인가.*","예레미야 31장을 다시 보십시오.","32절은 옛 언약이 **사람의 배신으로** 깨졌다고 말합니다. 그리고 34절은 새 언약에서 하나님께서 **다시는 그 죄를 기억하지 않으시겠다**고 말씀하십니다.","순서를 보십시오. 하나님께서는 사람이 배신할 수 있다는 것을 아신 채로 이 언약을 세우셨습니다. 그리고 배신했을 때 언약이 무효가 되지 않도록, **당신 홀로 지키시는 방식으로** 세우셨습니다.","그래서 이 언약은 우리가 잘 지켜서 유지되는 언약이 아닙니다. 우리가 깨뜨려도 그분이 붙드시는 언약입니다.","마음에 새겨진 것이 오늘 잘 보이지 않아도, 새기고 계신 분은 오늘도 일하고 계십니다.","**그럼에도 불구하고, 하나님은 우리를 사랑하십니다.**"]},{"type":"heading","text":"핵심 정리"},{"type":"list","ordered":true,"items":["옛 언약의 표지는 전부 밖에 있었습니다. 할례도, 안식일도, 절기도 눈으로 확인할 수 있었습니다.","옛 언약은 사람이 깨뜨렸습니다. 밖에 있는 표는 안에 있는 마음을 지켜 주지 못했습니다.","새 언약에서 하나님께서는 법을 마음에 기록하시고 당신의 영을 우리 속에 두셨습니다. 돌판에서 마음판으로 옮겨졌습니다.","그래서 열두 가지로 판정할 수 없었던 것입니다. 에드워즈가 까다로워서가 아니라 언약의 성격이 그렇기 때문입니다.","예레미야 31장의 주어는 거의 전부 하나님이십니다. 새 언약은 우리의 조건 목록이 아니라 하나님께서 하시겠다는 일의 목록입니다.","표지가 안으로 들어간 것은 하나님이 멀어지신 것이 아니라 안으로 들어오신 것입니다. 임마누엘입니다.","새 언약과 새 계명은 같은 밤에 주어졌고, 성령께서 마음에 부으시는 것은 하나님의 사랑입니다. 새 언약을 한 글자로 줄이면 사랑입니다.","새 언약의 \"새\"는 최신이 아니라 질적으로 다르다는 뜻이고, 히브리서는 이것을 단번이라고 말합니다. 이후에 또 다른 언약은 없습니다.","마음판에 새겨진 것을 밖에서 확인하려는 시도는 반드시 어렵습니다. 분별을 사람 거르는 데 쓰면 목양의 재앙이 됩니다.","이 언약은 우리가 지켜서 유지되는 것이 아니라 하나님께서 홀로 붙드시는 언약입니다."]},{"type":"heading","text":"나눔 질문"},{"type":"note","text":"*28~30번에 적으신 것 중 나누고 싶은 것만 나누십시오.*"},{"type":"question","key":"l4-share-1"},{"type":"question","key":"l4-share-2"},{"type":"question","key":"l4-share-3"},{"type":"question","key":"l4-share-4"},{"type":"heading","text":"기도"},{"type":"paragraphs","body":["주님, 저는 확인할 수 있는 표를 원했습니다. 눈에 보이는 것으로 저를 안심시키려 했고, 같은 것으로 곁에 있는 사람을 가늠했습니다."]},{"type":"paragraphs","body":["주께서는 표를 없애신 것이 아니라 제 안으로 들어오셨음을 오늘 배웠습니다. 돌판이 아니라 마음판에 쓰시려고 직접 오셨음을 알게 하셨습니다."]},{"type":"paragraphs","body":["제 마음에 새겨진 것이 오늘 잘 보이지 않아도 새기고 계신 분이 계심을 믿게 하시고, 제가 깨뜨려도 주께서 붙드시는 언약임을 잊지 않게 하여 주십시오."]},{"type":"paragraphs","body":["배운 것을 사람을 거르는 데 쓰지 않게 하시고, 주께서 저를 대하신 그 방식으로 사람을 대하게 하여 주십시오."]},{"type":"paragraphs","body":["예수님의 이름으로 기도합니다. 아멘."]}]};

function RichText({text}:{text:string}){
  const parts=text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g).filter(Boolean);
  return <>{parts.map((part,index)=>{
    if(part.startsWith("**")&&part.endsWith("**"))return <strong key={index}>{part.slice(2,-2)}</strong>;
    if(part.startsWith("*")&&part.endsWith("*"))return <em key={index}>{part.slice(1,-1)}</em>;
    return <span key={index}>{part}</span>;
  })}</>;
}

export function DiscernmentLessonFourWorkbook({startPage}:{startPage?:string}){
  const requestedIndex=startPage?course.pages.findIndex((item)=>item.key===startPage):-1;
  const [pageIndex,setPageIndex]=useState(requestedIndex>=0?requestedIndex:0);
  const [data,setData]=useState<StudyState|null>(null);
  const [needsLogin,setNeedsLogin]=useState(false);
  const [answers,setAnswers]=useState<Record<string,string>>({});
  const [notice,setNotice]=useState("");
  const contentRef=useRef<HTMLElement>(null);
  const page=course.pages[pageIndex];
  const blocks=pageBlocks[page.key]??[];
  const questionMap=useMemo(()=>new Map(page.questions.map((question)=>[question.key,question])),[page.questions]);
  const progressKeys=useMemo(()=>new Set((data?.progress??[]).map((item)=>item.pageKey)),[data]);
  const completed=progressKeys.size;
  const percent=Math.round((completed/course.pages.length)*100);

  async function load(){
    const response=await fetch("/api/member/study/discernment-lesson-four",{cache:"no-store"});
    const result=await response.json() as StudyState&{error?:string};
    if(response.status===401){setNeedsLogin(true);setData({responses:[],progress:[],totalPages:course.pages.length});return;}
    if(!response.ok){setNotice(result.error??"학습 기록을 불러오지 못했습니다.");return;}
    setNeedsLogin(false);setData(result);
    setAnswers(Object.fromEntries(result.responses.map((item)=>[`${item.pageKey}:${item.questionKey}`,item.answer])));
  }

  useEffect(()=>{void load().catch(()=>setNotice("학습 기록을 불러오지 못했습니다."));},[]);

  function selectPage(nextIndex:number){
    const boundedIndex=Math.max(0,Math.min(course.pages.length-1,nextIndex));
    const nextPage=course.pages[boundedIndex];
    setPageIndex(boundedIndex);
    const url=new URL(window.location.href);
    url.searchParams.set("lesson","4");url.searchParams.set("page",nextPage.key);url.hash="study-content";
    window.history.pushState({bibleStudyPage:nextPage.key},"",url);
    window.requestAnimationFrame(()=>{
      contentRef.current?.scrollIntoView({behavior:window.matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth",block:"start"});
      contentRef.current?.focus({preventScroll:true});
    });
  }

  async function saveAnswer(questionKey:string,answer:string){
    if(needsLogin)return;
    setAnswers((current)=>({...current,[`${page.key}:${questionKey}`]:answer}));
    const response=await fetch("/api/member/study/discernment-lesson-four",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({action:"answer",pageKey:page.key,questionKey,answer})});
    setNotice(response.ok?"답변을 저장했습니다.":"답변을 저장하지 못했습니다.");
    if(response.ok)await load();
  }

  async function completePage(){
    if(needsLogin)return;
    const response=await fetch("/api/member/study/discernment-lesson-four",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({action:"complete-page",pageKey:page.key})});
    setNotice(response.ok?"이 페이지의 공부 날짜와 완료 기록을 저장했습니다.":"완료 기록을 저장하지 못했습니다.");
    if(response.ok)await load();
  }

  function renderQuestion(questionKey:string){
    const question=questionMap.get(questionKey);
    if(!question)return null;
    const answerKey=`${page.key}:${question.key}`;
    return <div className="web-study-questions" key={`question:${question.key}`}><label>
      <span>{question.label}</span>
      <strong style={{whiteSpace:"pre-line"}}>{question.prompt}</strong>
      <textarea rows={5} value={answers[answerKey]??""} disabled={needsLogin}
        onChange={(event)=>setAnswers((current)=>({...current,[answerKey]:event.target.value}))}
        onBlur={(event)=>void saveAnswer(question.key,event.target.value)}
        placeholder={needsLogin?"로그인하면 이곳에 답을 기록할 수 있습니다.":"여기에 답을 적으면 자동 저장됩니다."}/>
    </label></div>;
  }

  function renderBlock(block:Block,index:number){
    if(block.type==="heading")return <section className="web-study-section" key={index}><h3>{block.text}</h3></section>;
    if(block.type==="paragraphs")return <div className="web-study-body" key={index}>{block.body.map((paragraph,paragraphIndex)=><p key={paragraphIndex}><RichText text={paragraph}/></p>)}</div>;
    if(block.type==="scripture")return <blockquote className="web-study-section" key={index}><p className="web-study-section-label">{block.label??"본문"}</p>{block.refs.map((reference)=><p key={reference}><strong>[본문] {reference}</strong></p>)}</blockquote>;
    if(block.type==="question")return renderQuestion(block.key);
    if(block.type==="callout")return <aside className="web-study-login-callout" key={index}><strong>{block.title}</strong>{block.body.map((paragraph,paragraphIndex)=><p key={paragraphIndex}><RichText text={paragraph}/></p>)}</aside>;
    if(block.type==="quote")return <blockquote className="web-study-section" key={index}>{block.body.map((paragraph,paragraphIndex)=><p key={paragraphIndex}><RichText text={paragraph}/></p>)}</blockquote>;
    if(block.type==="list"){const ListTag=block.ordered?"ol":"ul";return <section className="web-study-section" key={index}><ListTag>{block.items.map((item,itemIndex)=><li key={itemIndex}><RichText text={item}/></li>)}</ListTag></section>;}
    return <p key={index}><RichText text={block.text}/></p>;
  }

  return <section className="web-study-shell">
    <aside className="web-study-sidebar" aria-label="교재 목차">
      <p className="section-kicker">분별에서 사랑으로</p><h2>4과 학습 순서</h2>
      <div className="web-study-progress"><span style={{width:`${percent}%`}}/></div>
      <strong>{needsLogin?`총 ${course.pages.length}쪽 · 로그인 후 진도 저장`:`${completed}/${course.pages.length}쪽 완료 · ${percent}%`}</strong>
      <ol>{course.pages.map((item,index)=><li key={item.key}><button type="button" className={index===pageIndex?"is-active":""} aria-current={index===pageIndex?"page":undefined} onClick={()=>selectPage(index)}><span>{index+1}</span><em><small>4과</small>{item.title}</em>{progressKeys.has(item.key)&&<small>완료</small>}</button></li>)}</ol>
    </aside>
    <article className="web-study-page" id="study-content" ref={contentRef} tabIndex={-1}>
      <div className="web-study-page-heading"><div><p className="section-kicker">{page.eyebrow}</p><h2>{page.title}</h2></div><b>{String(pageIndex+1).padStart(2,"0")} / {String(course.pages.length).padStart(2,"0")}</b></div>
      {needsLogin&&<div className="web-study-login-callout"><strong>읽기는 누구나 할 수 있습니다.</strong><p>답변 저장과 공부 날짜 기록은 로그인한 교인에게 열립니다.</p><a className="primary-link" href={`/login?returnTo=${encodeURIComponent(`/bible-study/${course.slug}?lesson=4&page=${page.key}#study-content`)}`}>로그인하여 기록하기</a></div>}
      <div className="web-study-sections">{blocks.map(renderBlock)}</div>
      {notice&&<p className="content-manager-notice" role="status">{notice}</p>}
      <div className="web-study-actions">
        <button type="button" className="text-action" disabled={pageIndex===0} onClick={()=>selectPage(pageIndex-1)}>이전</button>
        {!needsLogin&&<button type="button" className="primary-link" onClick={()=>void completePage()}>{progressKeys.has(page.key)?"완료 날짜 다시 저장":"이 페이지 공부 완료"}</button>}
        <button type="button" className="text-action" disabled={pageIndex===course.pages.length-1} onClick={()=>selectPage(pageIndex+1)}>다음</button>
      </div>
    </article>
  </section>;
}
