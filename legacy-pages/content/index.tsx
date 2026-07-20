import Link from "next/link";
import { Layout } from "@/components/Layout";

const contentCards = [
  {
    title: "설교 아카이브",
    label: "WORD ARCHIVE",
    body: "지나간 말씀을 다시 붙들고 삶의 자리에서 들을 수 있도록 정리합니다.",
    href: "/services#archive"
  },
  {
    title: "오늘의 말씀",
    label: "DAILY WORD",
    body: "함께하시는 하나님의 음성을 듣고 하루의 방향을 다시 세우는 자리입니다.",
    href: "/services#word"
  },
  {
    title: "예배 기록",
    label: "WORSHIP",
    body: "예배 가운데 받은 은혜와 공동체의 고백을 이어 가는 공간입니다.",
    href: "/services#worship"
  },
  {
    title: "기도의 자리",
    label: "HONEST PRAYER",
    body: "숨김없이 하나님께 나아가는 기도 제목과 회복의 흐름을 연결합니다.",
    href: "/services#prayer"
  },
  {
    title: "공동체 이야기",
    label: "COMMUNITY",
    body: "사랑받은 사람들이 서로의 삶을 품고 함께 걸어가는 기록입니다.",
    href: "/services#community"
  },
  {
    title: "성장 자료",
    label: "GROWTH",
    body: "좋은 사람과 유능한 사람이 함께 자라도록 돕는 자료를 모읍니다.",
    href: "/services#growth"
  }
];

export default function ContentPage() {
  return (
    <Layout>
      <section className="page-hero compact content-hero">
        <div>
          <p className="eyebrow">Contents</p>
          <h1>콘텐츠</h1>
          <p>말씀과 예배, 공동체의 기록이 이곳에 연결됩니다.</p>
          <div className="hero-actions">
            <Link href="/way" className="primary-link">
              임마누엘의 길
            </Link>
            <Link href="/services" className="secondary-link">
              교회 서비스
            </Link>
          </div>
        </div>
      </section>

      <section className="content-section">
        <div className="home-wrap">
          <p className="section-kicker">Recorded Grace</p>
          <h2>말씀과 예배가 삶으로 이어지는 기록</h2>
          <div className="content-grid">
            {contentCards.map((card, index) => (
              <Link className="content-card" href={card.href} key={card.title}>
                <small>{String(index + 1).padStart(2, "0")} · {card.label}</small>
                <strong>{card.title}</strong>
                <p>{card.body}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
