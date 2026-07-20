import Link from "next/link";
import Nav from "../../Nav";

const problems = [
  {
    href: "/problems/overcome",
    title: "극복할 문제",
    quote: "믿음으로 통과해야 할 삶의 자리",
    keywords: "믿음 · 통과 · 성숙",
    image: "/images/growth.jpg"
  },
  {
    href: "/problems/temptation",
    title: "피할 유혹",
    quote: "분별하여 멀리해야 할 영적 위험",
    keywords: "분별 · 지혜 · 거룩",
    image: "/images/discernment.jpg"
  }
];

export default function ProblemsPage() {
  return (
    <main>
      <Nav />
      <section className="way-hero">
        <div className="way-hero-inner">
          <p className="way-eyebrow">HUMAN CONDITION</p>
          <h1>삶의 두 갈래</h1>
          <p>
            극복할 문제는 믿음으로 통과하고,
            <br />
            피할 유혹은 분별하여 멀리합니다.
          </p>
        </div>
      </section>
      <section className="way-section">
        <div className="way-wrap">
          <div className="problem-grid">
            {problems.map((problem) => (
              <Link
                href={problem.href}
                className="problem-card"
                key={problem.href}
                style={{ backgroundImage: `url(${problem.image})` }}
              >
                <span className="way-poster-overlay" />
                <span className="way-poster-content">
                  <strong>{problem.title}</strong>
                  <em>{problem.quote}</em>
                  <span>{problem.keywords}</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
