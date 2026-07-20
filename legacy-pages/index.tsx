import Link from "next/link";
import { Layout } from "@/components/Layout";
import { DeploymentBadge } from "@/components/DeploymentBadge";
import { services, wayArticles } from "@/data/immanuel";

const serviceIcons = [
  <svg key="word" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M5 5.5A3.5 3.5 0 0 1 8.5 2H20v17H8.5A3.5 3.5 0 0 0 5 22V5.5Z" />
    <path d="M5 5.5A3.5 3.5 0 0 0 1.5 2H1v17h.5A3.5 3.5 0 0 1 5 22V5.5Z" />
  </svg>,
  <svg key="worship" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 2v20" />
    <path d="M7 7h10" />
    <path d="M5 22h14" />
    <path d="M8 22c0-4 1.5-7 4-7s4 3 4 7" />
  </svg>,
  <svg key="prayer" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M8.5 3.5 12 11l3.5-7.5" />
    <path d="M12 11v10" />
    <path d="M7 21h10" />
    <path d="M4 12c2.5 0 5 1.8 8 9" />
    <path d="M20 12c-2.5 0-5 1.8-8 9" />
  </svg>,
  <svg key="spirit" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 3c4 3 6 6 6 10a6 6 0 0 1-12 0c0-4 2-7 6-10Z" />
    <path d="M9 14c1.6 1.6 4.4 1.6 6 0" />
  </svg>,
  <svg key="growth" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M4 19c6-1 10-5 12-13" />
    <path d="M8 18c0-4 2-7 6-9" />
    <path d="M15 6h5v5" />
  </svg>
];

export default function Home() {
  return (
    <Layout>
      <section className="home-hero">
        <DeploymentBadge />
        <div className="home-hero-inner">
          <p className="eyebrow">WORD · WORSHIP · GROWTH · SENDING</p>
          <h1>
            <span>하나님은 사랑이십니다.</span>
            <span>하나님은 우리와</span>
            <span className="gold-line">함께하십니다.</span>
          </h1>
          <p className="home-hero-copy">
            말씀 위에 세워지고, 예배로 충만해지며, 성장으로 성숙해지고,
            세상으로 파송되는 공동체입니다.
          </p>
          <div className="hero-actions">
            <Link className="primary-link" href="/way">
              임마누엘의 길
            </Link>
            <Link className="secondary-link" href="/services">
              교회 서비스
            </Link>
          </div>
        </div>
      </section>

      <section className="home-service-dock" aria-label="주요 교회 서비스">
        <div className="home-service-card">
          {services.slice(0, 5).map((service, index) => (
            <Link href={service.href} className="home-service-item" key={service.title}>
              <span className="home-service-icon">{serviceIcons[index]}</span>
              <strong>{service.title}</strong>
              <em>{service.description}</em>
            </Link>
          ))}
        </div>
      </section>

      <section className="home-way-preview">
        <div className="home-wrap">
          <h2>임마누엘의 길</h2>
          <p>
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

      <section className="home-impact">
        <div className="home-wrap">
          <h2>세상을 이롭게 하는 사람</h2>
          <p>
            우리는 자기 삶의 자리에서 가정과 조직과 교회와 사회를 이롭게 하는
            제자를 세웁니다.
          </p>
        </div>
      </section>

      <footer className="home-footer">
        <strong>IMMANUEL CHURCH</strong>
        <p>God is love. God is with us.</p>
      </footer>
    </Layout>
  );
}
