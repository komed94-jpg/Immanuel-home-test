import source from "@/data/loving-jesus.json";
import type { BibleStudyCourse, BibleStudyPage, BibleStudyQuestion } from "@/lib/bible-study";

type SourceLesson = (typeof source.lessons)[number];

function question(key: string, label: string, prompt: string, visibility: "private" | "leader" = "private"): BibleStudyQuestion {
  return { key, label, prompt, visibility };
}

function lessonPages(lesson: SourceLesson): BibleStudyPage[] {
  const prefix = `week-${lesson.number}`;
  return [
    {
      key: `${prefix}-read`,
      unit: lesson.number,
      lesson: `${lesson.number}과 · ${lesson.kind}`,
      eyebrow: `WEEK ${String(lesson.number).padStart(2, "0")} · READ`,
      title: lesson.title,
      scripture: lesson.references.join(" · "),
      body: [lesson.opening],
      sections: [
        { label: "함께 읽기", title: "본문이 먼저 말하게 합니다", body: ["사용하는 성경 번역본으로 위 본문 전체를 천천히 읽으십시오. 반복되는 단어와 마음에 멈추는 문장에 표시해 보세요."] },
      ],
      questions: lesson.observe.map((item, index) => question(`observe-${index + 1}`, `본문 관찰 ${index + 1}`, item)),
    },
    {
      key: `${prefix}-learn`,
      unit: lesson.number,
      lesson: `${lesson.number}과 · ${lesson.kind}`,
      eyebrow: `WEEK ${String(lesson.number).padStart(2, "0")} · LEARN`,
      title: "말씀으로 예수님을 배웁니다",
      scripture: lesson.references.join(" · "),
      sections: [
        ...lesson.teaching.map((item, index) => ({ label: `말씀 배우기 ${String(index + 1).padStart(2, "0")}`, title: item.heading, body: item.paragraphs })),
        { label: "잠깐 멈추기", title: "나 자신을 말씀 앞에 세웁니다", body: [lesson.pause] },
      ],
      questions: [question("reflection", "말씀 앞의 기록", `${lesson.question}\n\n오늘 본문과 해설을 통해 발견한 것을 정직하게 적어 보세요.`)],
    },
    {
      key: `${prefix}-practice`,
      unit: lesson.number,
      lesson: `${lesson.number}과 · ${lesson.kind}`,
      eyebrow: `WEEK ${String(lesson.number).padStart(2, "0")} · PRACTICE`,
      title: "작은 순종으로 응답합니다",
      scripture: lesson.references.join(" · "),
      sections: [
        { label: "오늘의 핵심 진리", title: lesson.keyTruth, body: ["우리는 말씀에 순종하여 예수님의 사랑을 얻는 것이 아닙니다. 예수님이 먼저 우리를 사랑하셨기 때문에 그분의 말씀에 순종합니다."] },
        { label: "자기 점검", title: "타인이 아니라 나를 말씀 앞에 세웁니다", body: lesson.selfCheck.map((item, index) => `${index + 1}. ${item}`) },
        { label: "이번 주 훈련", title: "7일 동안 말씀 앞으로 돌아옵니다", body: lesson.days.map((item, index) => `${index + 1}일 · ${item}`) },
        { label: "한 가지 순종", title: "막연한 결심을 오늘의 행동으로 바꿉니다", body: [lesson.weeklyPractice] },
        { label: "기도", title: "말씀을 주신 분께 응답합니다", body: [lesson.prayer] },
      ],
      questions: [
        ...lesson.groupQuestions.map((item, index) => question(`share-${index + 1}`, `나눔 질문 ${index + 1}`, item)),
        question("obedience", "이번 주 한 가지 순종", "언제 · 어디서 · 누구에게 · 무엇을 할 것입니까? 말씀을 읽고, 묻고, 기록하고, 순종할 한 가지를 구체적으로 적어 보세요."),
      ],
    },
  ];
}

export const lovingJesusCourse: BibleStudyCourse = {
  slug: source.series.slug,
  title: source.series.title,
  subtitle: source.series.subtitle,
  lessonSlug: "loving-jesus-8-weeks",
  overview: source.series.description,
  totalLessons: source.lessons.length,
  pages: source.lessons.flatMap(lessonPages),
};

export const lovingJesusSeries = source.series;
export const lovingJesusLessons = source.lessons;
