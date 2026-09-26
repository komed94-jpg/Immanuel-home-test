export type BibleVideo = { slug: string; title: string; description: string; duration: string; src: string; poster: string; captions: string; chapters: {title: string; start: number; duration: number; ref: string}[]; questions: string[]; guide?: string; note?: string };

export const bibleVideos: BibleVideo[] = [
  {
    "slug": "tabernacle",
    "title": "성막, 뜰에서 지성소까지",
    "description": "번제단과 물두멍을 지나 성소와 지성소까지. 기구의 위치와 역할을 성경 본문과 함께 살펴봅니다.",
    "duration": "4분 11초",
    "src": "https://immanuel-home.vercel.app/videos/tabernacle.mp4",
    "poster": "/videos/tabernacle.jpg",
    "captions": "/videos/tabernacle.ko.vtt",
    "chapters": [
      {
        "title": "성막, 하나님이 함께하시는 자리",
        "start": 0,
        "duration": 28.542,
        "ref": "출애굽기 25:8–9; 40:34–38"
      },
      {
        "title": "한눈에 보는 성막의 구조",
        "start": 28.542,
        "duration": 32.833,
        "ref": "출애굽기 26:33–35; 27:9–18; 40:22–30"
      },
      {
        "title": "번제단",
        "start": 61.375,
        "duration": 31.583,
        "ref": "출애굽기 27:1–8"
      },
      {
        "title": "물두멍",
        "start": 92.958,
        "duration": 26.5,
        "ref": "출애굽기 30:17–21; 38:8"
      },
      {
        "title": "성소의 상과 등잔대",
        "start": 119.458,
        "duration": 32.667,
        "ref": "출애굽기 25:23–40; 26:35 · 레위기 24:5–9"
      },
      {
        "title": "분향단",
        "start": 152.125,
        "duration": 31.083,
        "ref": "출애굽기 30:1–10"
      },
      {
        "title": "휘장",
        "start": 183.208,
        "duration": 31.125,
        "ref": "출애굽기 26:31–34 · 레위기 16:2, 29–34"
      },
      {
        "title": "지성소와 언약궤",
        "start": 214.333,
        "duration": 36.375,
        "ref": "출애굽기 25:10–22; 40:20–21"
      }
    ],
    "questions": [
      "번제단과 분향단은 위치와 용도가 어떻게 다른가요?",
      "성소의 세 기구는 각각 어디에 놓였나요?",
      "하나님이 백성 가운데 함께하신다는 약속은 오늘 우리의 예배와 어떻게 이어질까요?"
    ]
  },
  {
    "slug": "leviticus-offerings",
    "title": "레위기의 다섯 가지 제사",
    "description": "번제·소제·화목제·속죄제·속건제의 차이를 배우고, 예배와 회복의 의미를 살펴봅니다.",
    "duration": "4분 48초",
    "src": "/videos/leviticus-offerings.mp4",
    "poster": "/videos/leviticus-offerings.jpg",
    "captions": "/videos/leviticus-offerings.ko.vtt",
    "guide": "/videos/leviticus-offerings-study.md",
    "note": "성경 기록을 토대로 만든 AI 복원 상상도입니다. 인물과 건축 세부는 추정입니다. 실사풍 정지 이미지의 이동·확대 효과와 학습 지도·도식을 사용했습니다. 지도는 주요 지점과 진행 순서를 설명하며 실제 도로·항로를 재현하지 않습니다. 번제단 장면에는 기존 성막 동영상도 활용했습니다.",
    "chapters": [
      {
        "title": "거룩하신 하나님께 나아가는 길",
        "start": 0,
        "duration": 44.833,
        "ref": "레위기 1:1–2; 7:37–38"
      },
      {
        "title": "번제 — 제단 위에 올려 드림",
        "start": 44.833,
        "duration": 37.125,
        "ref": "레위기 1:3–17; 7:8"
      },
      {
        "title": "소제 — 곡식으로 드리는 예물",
        "start": 81.958,
        "duration": 41.083,
        "ref": "레위기 2:1–16"
      },
      {
        "title": "화목제 — 감사와 함께 나눔",
        "start": 123.042,
        "duration": 37.833,
        "ref": "레위기 3:1–17; 7:11–21, 28–34"
      },
      {
        "title": "속죄제 — 죄와 부정의 문제",
        "start": 160.875,
        "duration": 37.333,
        "ref": "레위기 4:1–5:13"
      },
      {
        "title": "속건제 — 책임과 배상",
        "start": 198.208,
        "duration": 38.458,
        "ref": "레위기 5:14–6:7; 7:1–7"
      },
      {
        "title": "비교하며 읽고, 삶으로 응답하기",
        "start": 236.667,
        "duration": 41.625,
        "ref": "레위기 1–7장 · 히브리서 10:1–14"
      },
      {
        "title": "함께 나눌 질문",
        "start": 278.292,
        "duration": 10,
        "ref": "본문과 삶을 연결하기"
      }
    ],
    "questions": [
      "번제와 화목제는 제물을 나누는 방식에서 어떻게 다른가요?",
      "소제의 재료와 속건제의 배상 규정은 우리의 일상과 어떤 관련이 있나요?",
      "다섯 제사를 한 단어로만 외우면 놓치기 쉬운 내용은 무엇인가요?"
    ]
  },
  {
    "slug": "jerusalem-jesus",
    "title": "예수님 시대 예루살렘과 성전",
    "description": "헤롯이 확장한 제2성전과 감람산의 위치를 살피며 마가복음 11–13장을 읽습니다.",
    "duration": "4분 19초",
    "src": "/videos/jerusalem-jesus.mp4",
    "poster": "/videos/jerusalem-jesus.jpg",
    "captions": "/videos/jerusalem-jesus.ko.vtt",
    "guide": "/videos/jerusalem-jesus-study.md",
    "note": "성경 기록을 토대로 만든 AI 복원 상상도입니다. 인물과 건축 세부는 추정입니다. 실사풍 정지 이미지의 이동·확대 효과와 학습 지도·도식을 사용했습니다. 지도는 주요 지점과 진행 순서를 설명하며 실제 도로·항로를 재현하지 않습니다.",
    "chapters": [
      {
        "title": "솔로몬 성전과 다른 시대",
        "start": 0,
        "duration": 41.667,
        "ref": "마가복음 11:11; 13:1–2"
      },
      {
        "title": "성전과 감람산 사이",
        "start": 41.667,
        "duration": 40.958,
        "ref": "마가복음 11:1, 11–12; 13:3"
      },
      {
        "title": "뜰과 성소를 구별하기",
        "start": 82.625,
        "duration": 41.0,
        "ref": "마가복음 11:15–16 · 성전 경계 비문"
      },
      {
        "title": "만민이 기도하는 집",
        "start": 123.625,
        "duration": 40.583,
        "ref": "마가복음 11:15–19 · 이사야 56:7"
      },
      {
        "title": "과부의 헌금 앞에서",
        "start": 164.208,
        "duration": 41.5,
        "ref": "마가복음 12:38–44"
      },
      {
        "title": "성전을 바라보며 깨어 있으라",
        "start": 205.708,
        "duration": 43.25,
        "ref": "마가복음 13:1–4, 32–37"
      },
      {
        "title": "함께 나눌 질문",
        "start": 248.958,
        "duration": 10,
        "ref": "본문과 삶을 연결하기"
      }
    ],
    "questions": [
      "솔로몬의 성전과 예수님 시대 성전을 구별해야 하는 이유는 무엇인가요?",
      "성전에서 예수님이 강조하신 기도와 과부의 헌금 이야기는 어떤 질문을 던지나요?",
      "마가복음 13장은 건물에 대한 자부심을 어떻게 돌아보게 하나요?"
    ]
  },
  {
    "slug": "galilee-ministry",
    "title": "갈릴리를 따라가는 예수님 사역",
    "description": "호숫가·가버나움·나사렛을 연결하며 마가복음 1–6장의 부르심과 가르침을 공부합니다.",
    "duration": "5분 3초",
    "src": "/videos/galilee-ministry.mp4",
    "poster": "/videos/galilee-ministry.jpg",
    "captions": "/videos/galilee-ministry.ko.vtt",
    "guide": "/videos/galilee-ministry-study.md",
    "note": "성경 기록을 토대로 만든 AI 복원 상상도입니다. 인물과 건축 세부는 추정입니다. 실사풍 정지 이미지의 이동·확대 효과와 학습 지도·도식을 사용했습니다. 지도는 주요 지점과 진행 순서를 설명하며 실제 도로·항로를 재현하지 않습니다.",
    "chapters": [
      {
        "title": "갈릴리, 복음이 들려온 일상",
        "start": 0,
        "duration": 42.417,
        "ref": "마가복음 1:9, 14–15, 21"
      },
      {
        "title": "호숫가에서 부르신 제자들",
        "start": 42.417,
        "duration": 40.542,
        "ref": "마가복음 1:16–20"
      },
      {
        "title": "가버나움, 회당과 집",
        "start": 82.958,
        "duration": 41.458,
        "ref": "마가복음 1:21–39; 2:1–12"
      },
      {
        "title": "배에서 가르치신 비유",
        "start": 124.417,
        "duration": 43.083,
        "ref": "마가복음 4:1–20, 26–34"
      },
      {
        "title": "호수를 건너며 드러난 두려움",
        "start": 167.5,
        "duration": 39.542,
        "ref": "마가복음 4:35–5:20"
      },
      {
        "title": "나사렛의 거절과 제자들의 파송",
        "start": 207.042,
        "duration": 42.333,
        "ref": "마가복음 6:1–13"
      },
      {
        "title": "오병이어, 무리를 불쌍히 여기심",
        "start": 249.375,
        "duration": 43.458,
        "ref": "마가복음 6:30–44, 53–56"
      },
      {
        "title": "함께 나눌 질문",
        "start": 292.833,
        "duration": 10,
        "ref": "본문과 삶을 연결하기"
      }
    ],
    "questions": [
      "갈릴리 호숫가와 가버나움은 예수님의 사역에서 어떤 역할을 하나요?",
      "비유와 풍랑 이야기는 제자들에게 어떤 반응을 요청하나요?",
      "오병이어에서 제자들은 군중을 어떻게 바라보도록 초대받나요?"
    ]
  },
  {
    "slug": "paul-journeys",
    "title": "지도로 보는 바울의 선교여행",
    "description": "세 차례 선교여행과 로마 압송 여정을 구별하며, 교회를 세우고 돌본 발걸음을 따라갑니다.",
    "duration": "4분 53초",
    "src": "/videos/paul-journeys.mp4",
    "poster": "/videos/paul-journeys.jpg",
    "captions": "/videos/paul-journeys.ko.vtt",
    "guide": "/videos/paul-journeys-study.md",
    "note": "성경 기록을 토대로 만든 AI 복원 상상도입니다. 인물과 건축 세부는 추정입니다. 실사풍 정지 이미지의 이동·확대 효과와 학습 지도·도식을 사용했습니다. 지도는 주요 지점과 진행 순서를 설명하며 실제 도로·항로를 재현하지 않습니다.",
    "chapters": [
      {
        "title": "교회가 보내고, 교회가 자라다",
        "start": 0,
        "duration": 36.667,
        "ref": "사도행전 13:1–4; 14:26–28"
      },
      {
        "title": "1차 — 구브로와 소아시아",
        "start": 36.667,
        "duration": 37.833,
        "ref": "사도행전 13–14장"
      },
      {
        "title": "2차 — 마게도냐와 아가야로",
        "start": 74.5,
        "duration": 42.75,
        "ref": "사도행전 15:36–18:22"
      },
      {
        "title": "3차 — 제자를 굳게 하는 여정",
        "start": 117.25,
        "duration": 40.875,
        "ref": "사도행전 18:23–21:17"
      },
      {
        "title": "에베소 — 말씀이 삶을 바꾸다",
        "start": 158.125,
        "duration": 43.75,
        "ref": "사도행전 19:8–20, 23–41"
      },
      {
        "title": "로마행 — 죄수의 신분으로",
        "start": 201.875,
        "duration": 42.458,
        "ref": "사도행전 27:1–28:16"
      },
      {
        "title": "매인 바울, 계속 전해지는 복음",
        "start": 244.333,
        "duration": 38.833,
        "ref": "사도행전 28:16, 23–31"
      },
      {
        "title": "함께 나눌 질문",
        "start": 283.167,
        "duration": 10,
        "ref": "본문과 삶을 연결하기"
      }
    ],
    "questions": [
      "수리아 안디옥과 비시디아 안디옥은 어떻게 구별하나요?",
      "바울이 이미 방문한 교회로 돌아간 이유는 무엇인가요?",
      "세 차례 선교여행과 로마로 가는 여정의 성격은 어떻게 다른가요?"
    ]
  },
  {
    "slug": "solomons-temple",
    "title": "솔로몬의 성전, 안과 밖",
    "description": "성전의 외부 전경부터 성소와 지성소까지. 열왕기상과 역대하의 기록을 바탕으로 공부합니다.",
    "duration": "2분 1초",
    "src": "https://immanuel-home.vercel.app/videos/solomons-temple.mp4",
    "poster": "/videos/solomons-temple.jpg",
    "captions": "/videos/solomons-temple.ko.vtt",
    "chapters": [
      {
        "title": "솔로몬의 성전",
        "start": 0,
        "duration": 19.799002,
        "ref": "열왕기상 6:2–10"
      },
      {
        "title": "뜰의 기구",
        "start": 19.799,
        "duration": 18.458333,
        "ref": "열왕기상 7:23–39 · 역대하 4:1–6"
      },
      {
        "title": "성전의 입구",
        "start": 38.257,
        "duration": 19.146009,
        "ref": "열왕기상 7:15–22"
      },
      {
        "title": "성소",
        "start": 57.403,
        "duration": 21.81,
        "ref": "열왕기상 7:48–49 · 역대하 4:7–8"
      },
      {
        "title": "금으로 덮인 내부",
        "start": 79.213,
        "duration": 20.687007,
        "ref": "열왕기상 6:15–18, 29–30"
      },
      {
        "title": "지성소",
        "start": 99.9,
        "duration": 21.25,
        "ref": "열왕기상 6:19–28; 8:6–9, 27"
      }
    ],
    "questions": [
      "성막과 솔로몬 성전의 공통점과 차이점은 무엇인가요?",
      "성소와 지성소에는 각각 어떤 기구가 있었나요?",
      "솔로몬은 왜 하나님을 성전 안에 가둘 수 없다고 고백했을까요?"
    ]
  }
];
