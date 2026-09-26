export type BibleVideo = { slug: string; title: string; description: string; duration: string; src: string; poster: string; captions: string; chapters: {title: string; start: number; duration: number; ref: string}[]; questions: string[] };

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
