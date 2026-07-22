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
          <p>
            질병과 경제적 어려움, 관계의 상처와 삶의 무게처럼 믿음으로 견디고
            통과해야 할 문제들이 있습니다. 이런 문제는 우리를 무너뜨리기 위해서만
            오는 것이 아니라, 때로는 우리를 더 깊게 빚고 성숙하게 하시는 하나님의
            과정이 되기도 합니다.
          </p>
          <p>
            그러므로 우리는 쉽게 도망하거나 포기하지 않습니다. 하나님을 의지하며
            믿음으로 견디고, 그 길을 지나 극복하기를 선택합니다.
          </p>
        </div>
        <div>
          <span>02</span>
          <h2>피할 유혹</h2>
          <p>피할 유혹은 분별하여 멀리합니다.</p>
          <p>
            욕망과 탐욕, 정욕과 교만, 무분별한 성공욕과 권력욕, 돈에 대한 지나친
            사랑처럼 우리의 영혼을 무너뜨리는 유혹들이 있습니다. 이것들은 분별하고
            멀리해야 할 위험입니다.
          </p>
          <p>
            죄와 유혹 가까이에 머무는 것은 지혜가 아닙니다. 우리는 끊어낼 것은
            단호하게 끊고, 내려놓아야 할 것은 미련 없이 내려놓습니다.
          </p>
        </div>
      </section>
    </Layout>
  );
}
