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
  },
  {
    "slug": "day-of-atonement",
    "title": "대제사장의 대속죄일",
    "description": "세마포 옷과 분향, 피 뿌림과 두 염소의 절차를 따라 레위기 16장과 히브리서 9장을 읽습니다.",
    "duration": "4분 32초",
    "src": "/videos/day-of-atonement.mp4",
    "poster": "/videos/day-of-atonement.jpg",
    "captions": "/videos/day-of-atonement.ko.vtt",
    "guide": "/videos/day-of-atonement-study.md",
    "note": "성경 기록을 토대로 만든 AI 복원 상상도입니다. 인물과 건축 세부는 추정입니다. 실사풍 정지 이미지의 이동·확대 효과와 학습 지도·도식을 사용했습니다. 지도는 주요 지점과 진행 순서를 설명하며 실제 도로·항로를 재현하지 않습니다.",
    "chapters": [
      {
        "title": "아무 때나 들어가지 말라",
        "start": 0,
        "duration": 40.583,
        "ref": "레위기 16:1–5"
      },
      {
        "title": "몸을 씻고 세마포 옷을 입다",
        "start": 40.583,
        "duration": 43.833,
        "ref": "레위기 16:4, 6, 11"
      },
      {
        "title": "향연이 속죄소를 가리다",
        "start": 84.417,
        "duration": 43.167,
        "ref": "레위기 16:12–17"
      },
      {
        "title": "두 염소, 서로 다른 역할",
        "start": 127.583,
        "duration": 47.542,
        "ref": "레위기 16:7–10, 15, 20–22"
      },
      {
        "title": "공동체 전체가 자신을 낮추다",
        "start": 175.125,
        "duration": 42.958,
        "ref": "레위기 16:23–34"
      },
      {
        "title": "히브리서와 함께 읽기",
        "start": 218.083,
        "duration": 43.417,
        "ref": "히브리서 9:7–14, 24–28"
      },
      {
        "title": "함께 나눌 질문",
        "start": 261.5,
        "duration": 10,
        "ref": "본문과 삶을 연결하기"
      }
    ],
    "questions": [
      "대속죄일에 대제사장 자신을 위한 속죄도 필요한 이유는 무엇인가요?",
      "두 염소는 각각 어떤 역할을 맡으며, 본문에서 어떤 순서로 등장하나요?",
      "히브리서가 말하는 그리스도의 단번의 제사는 반복되는 의식과 어떻게 다른가요?"
    ]
  },
  {
    "slug": "wedding-at-cana",
    "title": "가나 혼인잔치와 첫 표적",
    "description": "잔치의 위기와 돌항아리 여섯, 종들의 행동을 따라 예수님의 영광을 드러낸 첫 표적을 공부합니다.",
    "duration": "4분 38초",
    "src": "/videos/wedding-at-cana.mp4",
    "poster": "/videos/wedding-at-cana.jpg",
    "captions": "/videos/wedding-at-cana.ko.vtt",
    "guide": "/videos/wedding-at-cana-study.md",
    "note": "성경 기록을 토대로 만든 AI 복원 상상도입니다. 인물과 건축 세부는 추정입니다. 실사풍 정지 이미지의 이동·확대 효과와 학습 지도·도식을 사용했습니다. 지도는 주요 지점과 진행 순서를 설명하며 실제 도로·항로를 재현하지 않습니다.",
    "chapters": [
      {
        "title": "갈릴리의 한 혼인잔치",
        "start": 0,
        "duration": 45.833,
        "ref": "요한복음 2:1–3"
      },
      {
        "title": "아직 이르지 않은 때",
        "start": 45.833,
        "duration": 44.333,
        "ref": "요한복음 2:3–5"
      },
      {
        "title": "정결 예식용 돌항아리 여섯",
        "start": 90.167,
        "duration": 43.042,
        "ref": "요한복음 2:6"
      },
      {
        "title": "물을 가득 채우고 떠서 가져가다",
        "start": 133.208,
        "duration": 44.667,
        "ref": "요한복음 2:7–9"
      },
      {
        "title": "연회장이 맛본 좋은 포도주",
        "start": 177.875,
        "duration": 45.167,
        "ref": "요한복음 2:9–10"
      },
      {
        "title": "표적이 가리키는 분을 보다",
        "start": 223.042,
        "duration": 44.792,
        "ref": "요한복음 2:11–12"
      },
      {
        "title": "함께 나눌 질문",
        "start": 267.833,
        "duration": 10,
        "ref": "본문과 삶을 연결하기"
      }
    ],
    "questions": [
      "요한복음이 돌항아리의 재료와 용도, 수를 설명하는 이유를 어떻게 생각하나요?",
      "종들과 연회장은 각각 무엇을 알고, 무엇을 모르고 있었나요?",
      "11절은 이 사건의 의미와 제자들의 반응을 어떻게 정리하나요?"
    ]
  },
  {
    "slug": "new-testament-terrain",
    "title": "이스라엘의 신약 지형",
    "description": "실제 고도 자료로 갈릴리·사마리아·유대와 요단 골짜기를 살피고 복음서의 이동 표현을 이해합니다.",
    "duration": "4분 36초",
    "src": "/videos/new-testament-terrain.mp4",
    "poster": "/videos/new-testament-terrain.jpg",
    "captions": "/videos/new-testament-terrain.ko.vtt",
    "guide": "/videos/new-testament-terrain-study.md",
    "note": "현대 NOAA ETOPO 2022 고도 자료와 Natural Earth 해안·호수 자료에 성경 시대의 주요 지명을 표시한 학습 지도입니다. 색상은 고도이며 음영은 강조했습니다. 고대의 국경·호안·도로를 정밀 복원한 것이 아닙니다. 강과 연결선은 개략적입니다.",
    "chapters": [
      {
        "title": "복음서를 읽는 땅의 뼈대",
        "start": 0,
        "duration": 45.792,
        "ref": "마가복음 1장 · 요한복음 4장"
      },
      {
        "title": "갈릴리 산지와 낮은 호수",
        "start": 45.792,
        "duration": 44.792,
        "ref": "마가복음 1:16–21; 4:35–41"
      },
      {
        "title": "사마리아를 지나가는 길",
        "start": 90.583,
        "duration": 45.958,
        "ref": "요한복음 4:3–7, 20–24"
      },
      {
        "title": "예루살렘으로 올라가다",
        "start": 136.542,
        "duration": 42.417,
        "ref": "누가복음 10:30–37; 19:1–28"
      },
      {
        "title": "요단강과 사해, 동쪽 고원",
        "start": 178.958,
        "duration": 43.208,
        "ref": "마가복음 1:5, 9; 10:1"
      },
      {
        "title": "해안과 항구로 넓어지는 이야기",
        "start": 222.167,
        "duration": 43.5,
        "ref": "사도행전 9:36–10:48"
      },
      {
        "title": "함께 나눌 질문",
        "start": 265.667,
        "duration": 10,
        "ref": "본문과 삶을 연결하기"
      }
    ],
    "questions": [
      "갈릴리·사마리아·유대의 남북 순서를 지도 없이 설명할 수 있나요?",
      "예루살렘에서 여리고로 내려간다는 표현은 지형과 어떻게 연결되나요?",
      "지형을 아는 것과 예수님의 모든 이동 경로를 확정하는 것은 왜 다른가요?"
    ]
  },
  {
    "slug": "old-testament-terrain",
    "title": "이스라엘의 구약 지형",
    "description": "해안 평야·중앙 산지·요단 골짜기·네게브를 살피며 족장과 사사, 왕국 시대의 본문을 연결합니다.",
    "duration": "4분 42초",
    "src": "/videos/old-testament-terrain.mp4",
    "poster": "/videos/old-testament-terrain.jpg",
    "captions": "/videos/old-testament-terrain.ko.vtt",
    "guide": "/videos/old-testament-terrain-study.md",
    "note": "현대 NOAA ETOPO 2022 고도 자료와 Natural Earth 해안·호수 자료에 성경 시대의 주요 지명을 표시한 학습 지도입니다. 색상은 고도이며 음영은 강조했습니다. 고대의 국경·호안·도로를 정밀 복원한 것이 아닙니다. 강과 연결선은 개략적입니다.",
    "chapters": [
      {
        "title": "시대가 달라도 남아 있는 지형",
        "start": 0,
        "duration": 47.708,
        "ref": "신명기 11:10–12"
      },
      {
        "title": "세겜에서 벧엘, 남쪽 네게브로",
        "start": 47.708,
        "duration": 43.875,
        "ref": "창세기 12:6–9; 13:18"
      },
      {
        "title": "해안 평야와 세펠라의 골짜기",
        "start": 91.583,
        "duration": 42.833,
        "ref": "사무엘상 17:1–3"
      },
      {
        "title": "북쪽의 이스르엘 평야와 갈멜",
        "start": 134.417,
        "duration": 46.0,
        "ref": "사사기 4:6–16 · 열왕기상 18장"
      },
      {
        "title": "요단을 건너고 광야를 지나며",
        "start": 180.417,
        "duration": 44.458,
        "ref": "여호수아 3장 · 사무엘상 24장"
      },
      {
        "title": "산지의 도시와 달라지는 시대",
        "start": 224.875,
        "duration": 46.833,
        "ref": "열왕기상 12장; 16:24"
      },
      {
        "title": "함께 나눌 질문",
        "start": 271.708,
        "duration": 10,
        "ref": "본문과 삶을 연결하기"
      }
    ],
    "questions": [
      "해안 평야와 중앙 산지 사이에서 세펠라는 어떤 위치에 있나요?",
      "아브라함 이야기와 사사 시대 이야기에 등장하는 장소들을 지도에서 찾을 수 있나요?",
      "구약의 서로 다른 시대를 하나의 고정된 국경으로 그리면 어떤 문제가 생기나요?"
    ]
  }
];
