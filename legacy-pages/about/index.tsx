import Link from "next/link";
import { Layout } from "@/components/Layout";

export default function AboutPage() {
  return (
    <Layout>
      <section className="page-hero compact">
        <div>
          <p className="eyebrow">About</p>
          <h1>소개</h1>
          <p>임마누엘교회는 하나님이 우리와 함께하신다는 믿음 위에 세워지는 공동체입니다.</p>
          <div className="hero-actions">
            <Link href="/why-immanuel" className="primary-link">
              왜 임마누엘인가
            </Link>
            <Link href="/way" className="secondary-link">
              임마누엘의 길
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
