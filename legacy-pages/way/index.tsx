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
