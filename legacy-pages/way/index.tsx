import Link from "next/link";
import { Layout } from "@/components/Layout";
import { wayArticles } from "@/data/immanuel";

export default function WayPage() {
  return (
    <Layout>
      <section className="way-grid-section">
        <div className="home-wrap">
          <h1 className="way-title">임마누엘의 길</h1>
          <p className="way-lead">
            11개의 길은 단순한 메뉴가 아니라, 임마누엘교회가 믿고 예배하고
            기도하고 성장하며 세상으로 나아가는 신앙의 고백입니다.
          </p>
          <div className="way-study-callout">
            <div>
              <p className="section-kicker">WEB BIBLE STUDY</p>
              <h2>11개의 길을 성경으로 공부합니다.</h2>
              <p>핵심 본문과 참조 말씀을 먼저 읽고, 본문 관찰·성경적 해설·분별·실천·기도로 이어 갑니다. 로그인하면 답변·공부 날짜·진도와 수료를 기록할 수 있습니다.</p>
            </div>
            <div className="way-study-actions">
              <Link className="primary-link" href="/bible-study/immanuel-way">임마누엘의 길 11과 시작</Link>
              <Link className="primary-link" href="/bible-study/immanuel-basic">1권 성경공부 열기</Link>
              <Link className="primary-link" href="/bible-study/immanuel-basic-2">2권 성경공부 열기</Link>
            </div>
          </div>
          <div className="poster-grid">
            {wayArticles.map((article, index) => (
              <Link
                className="poster-card"
                href={`/way/${article.slug}`}
                key={article.slug}
                style={{ backgroundImage: `url(${article.image.url})` }}
              >
                <span className="poster-overlay" />
                <span className="poster-content">
                  <small>{String(index + 1).padStart(2, "0")}</small>
                  <strong>{article.title}</strong>
                  <em>{article.quote}</em>
                  <span>{article.keywords.join(" · ")}</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
