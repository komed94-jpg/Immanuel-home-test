import Link from "next/link";
import { Layout } from "@/components/Layout";
import { services, wayArticles } from "@/data/immanuel";

const serviceIcons = [
  <svg key="word" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M5 5.5A3.5 3.5 0 0 1 8.5 2H20v17H8.5A3.5 3.5 0 0 0 5 22V5.5Z" />
    <path d="M5 5.5A3.5 3.5 0 0 0 1.5 2H1v17h.5A3.5 3.5 0 0 1 5 22V5.5Z" />
  </svg>,
  <svg key="study" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M5 4.5A3.5 3.5 0 0 1 8.5 2H20v17H8.5A3.5 3.5 0 0 0 5 22V4.5Z" />
    <path d="M8 7h8" />
    <path d="M8 11h8" />
    <path d="M8 15h5" />
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
            <Link className="secondary-link" href="/bible-study">
              성경공부 시작하기
            </Link>
            <Link className="secondary-link" href="/disc">
              DISC 행동 알아보기
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

      <section className="home-disc-preview" aria-labelledby="home-disc-title">
        <div className="home-disc-copy">
          <p className="section-kicker">DISC · RELATIONSHIP FORMATION</p>
          <h2 id="home-disc-title">상대를 파악하는 것을 넘어,<br />사랑하는 방식을 배웁니다.</h2>
          <p>24문항으로 내 행동을 살피고, 타인을 이해하고 존중하며, 사랑으로 섬기는 3과 관계 교육으로 이어집니다.</p>
          <div>
            <Link className="primary-link" href="/disc#disc-check">내 행동 알아보기</Link>
            <Link className="home-disc-text-link" href="/disc/course">3과 강의 보기 →</Link>
          </div>
        </div>
        <div className="home-disc-types" aria-label="DISC 네 행동 경향">
          <span className="is-d"><b>D</b><strong>주도</strong><small>결단과 추진</small></span>
          <span className="is-i"><b>I</b><strong>관계</strong><small>소통과 활력</small></span>
          <span className="is-s"><b>S</b><strong>안정</strong><small>배려와 협력</small></span>
          <span className="is-c"><b>C</b><strong>신중</strong><small>분석과 정확성</small></span>
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
                href={`/bible-study/immanuel-way?lesson=${article.slug}#study-content`}
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
