import Link from "next/link";
import { Layout } from "@/components/Layout";

export default function WhyImmanuelPage() {
  return (
    <Layout>
      <section className="why-hero">
        <div className="why-visual" />
        <div className="why-copy">
          <p className="eyebrow">Preamble</p>
          <h1>왜 임마누엘인가</h1>
          <div className="creed">
            <p>하나님은 사랑이십니다.</p>
            <p>우리는 사랑받는 하나님의 자녀입니다.</p>
            <p>하나님은 우리와 함께하십니다.</p>
          </div>
          <Link href="/way" className="primary-link">
            임마누엘의 길 보기
          </Link>
        </div>
      </section>

      <section className="section philosophy-columns">
        <div>
          <p className="section-kicker">Human condition</p>
          <h2>인간의 가장 깊은 문제</h2>
        </div>
        <p>
          인간의 가장 깊은 문제는 하나님이 함께하신다는 것을 믿지 못하는 믿음의
          문제입니다.
        </p>
      </section>

      <section className="section split-principle">
        <div>
          <span>01</span>
          <h2>극복할 문제</h2>
          <p>극복할 문제는 믿음으로 통과합니다.</p>
        </div>
        <div>
          <span>02</span>
          <h2>피할 유혹</h2>
          <p>피할 유혹은 분별하여 멀리합니다.</p>
        </div>
      </section>
    </Layout>
  );
}
