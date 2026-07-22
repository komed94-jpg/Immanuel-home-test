export type BibleStudyQuestion = {
  key: string;
  label: string;
  prompt: string;
};

export type BibleStudyPage = {
  key: string;
  title: string;
  eyebrow: string;
  scripture?: string;
  body: string[];
  questions: BibleStudyQuestion[];
};

export type BibleStudyCourse = {
  slug: string;
  title: string;
  subtitle: string;
  lessonSlug: string;
  lessonTitle: string;
  pages: BibleStudyPage[];
};

export const immanuelBasicCourse: BibleStudyCourse = {
  slug: "immanuel-basic",
  title: "임마누엘 베이직",
  subtitle: "복음과 교회 생활의 기초를 배우는 새가족 성경공부",
  lessonSlug: "lesson-1",
  lessonTitle: "1과. 그럼에도 불구하고, 하나님은 나를 사랑하신다",
  pages: [
    {
      key: "opening",
      eyebrow: "OPENING",
      title: "하나님 사랑에서 다시 시작합니다",
      scripture: "이사야 43:4",
      body: [
        "성경공부의 출발점은 내가 얼마나 괜찮은 사람인지 증명하는 데 있지 않습니다. 하나님이 나를 어떻게 보고 계시는지 다시 듣는 데 있습니다.",
        "신앙은 부끄러움을 감추는 기술이 아니라, 아버지의 시선 안에서 나를 새롭게 해석하는 길입니다."
      ],
      questions: [
        { key: "heart", label: "마음 열기", prompt: "지금 내 마음에 가장 크게 남아 있는 감정은 무엇입니까?" },
        { key: "expectation", label: "기대", prompt: "이번 성경공부를 통해 하나님 앞에서 어떤 변화가 있기를 기대합니까?" }
      ]
    },
    {
      key: "observe",
      eyebrow: "OBSERVE",
      title: "말씀 안에서 나를 봅니다",
      scripture: "누가복음 15:20",
      body: [
        "탕자의 회복은 아들이 완벽한 대답을 준비했기 때문에 시작된 것이 아닙니다. 아버지가 먼저 보고, 불쌍히 여기고, 달려갔기 때문에 시작되었습니다.",
        "말씀은 나를 정죄하기 위해 비추는 조명이 아니라, 아버지께 돌아갈 길을 보여 주는 빛입니다."
      ],
      questions: [
        { key: "text", label: "말씀 관찰", prompt: "본문에서 아버지가 먼저 행한 일은 무엇입니까?" },
        { key: "image", label: "하나님 이미지", prompt: "이 말씀은 내가 가진 하나님 이미지와 어떻게 같거나 다릅니까?" }
      ]
    },
    {
      key: "interpret",
      eyebrow: "INTERPRET",
      title: "부끄러움이 아니라 사랑으로 해석합니다",
      scripture: "로마서 5:8",
      body: [
        "복음은 내가 변화되었기 때문에 사랑받는다는 소식이 아닙니다. 아직 연약하고 죄인 되었을 때 그리스도께서 나를 위해 죽으셨다는 소식입니다.",
        "그래서 회개는 자기혐오가 아닙니다. 사랑받는 자녀가 아버지께 돌아가는 실제적인 방향 전환입니다."
      ],
      questions: [
        { key: "old-story", label: "이전 해석", prompt: "나는 내 실패나 상처를 주로 어떤 말로 해석해 왔습니까?" },
        { key: "gospel-story", label: "복음의 재해석", prompt: "복음 안에서 그 이야기는 어떻게 다시 해석될 수 있습니까?" }
      ]
    },
    {
      key: "apply",
      eyebrow: "APPLY",
      title: "오늘의 작은 순종을 정합니다",
      scripture: "요한일서 4:19",
      body: [
        "하나님의 사랑을 배웠다면, 그 사랑은 오늘의 삶에서 작은 순종으로 이어져야 합니다.",
        "이번 주에는 내가 나를 대하는 방식, 가족과 이웃을 대하는 방식, 하나님께 기도하는 방식 중 하나를 새롭게 선택해 봅니다."
      ],
      questions: [
        { key: "practice", label: "실천", prompt: "이번 주에 실천할 작은 순종 한 가지는 무엇입니까?" },
        { key: "prayer", label: "기도", prompt: "오늘 하나님께 드리고 싶은 기도를 적어 보세요." }
      ]
    }
  ]
};

export const bibleStudyCourses = [immanuelBasicCourse];

export function getBibleStudyCourse(slug: string) {
  return bibleStudyCourses.find((course) => course.slug === slug) ?? null;
}

export function totalPages(course: BibleStudyCourse) {
  return course.pages.length;
}
