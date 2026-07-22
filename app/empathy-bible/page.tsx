import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Layout } from "@/components/Layout";

export const metadata: Metadata = {
  title: "공감성경 | 임마누엘교회",
  description: "말씀을 오늘의 내 삶과 연결하는 공감성경",
};

const features = [
  {
    number: "01",
    eyebrow: "LISTEN",
    title: "지금 마음을 있는 그대로 나눕니다.",
    description:
      "마음의 상황을 직접 적거나 빠른 선택에서 고르면, 지금 내게 필요한 말씀을 찾는 여정이 시작됩니다.",
    image: {
      src: "/images/empathy-bible/home.png",
      alt: "공감성경에서 마음의 상황을 입력하고 선택하는 화면",
      width: 696,
      height: 1452,
    },
  },
  {
    number: "02",
    eyebrow: "KEEP & SHARE",
    title: "받은 말씀을 간직하고 나눕니다.",
    description:
      "마음에 닿은 말씀은 이미지 카드로 저장할 수 있고, 필요한 사람에게 SNS로 바로 나눌 수 있습니다.",
    image: {
      src: "/images/empathy-bible/share.png",
      alt: "공감성경 말씀 이미지를 저장하고 SNS로 공유하는 화면",
      width: 425,
      height: 572,
    },
  },
];

export default function EmpathyBiblePage() {
  return (
    <Layout>
      <section className="bible-app-hero">
        <div>
          <Link href="/bible-study" className="back-link">
            성경공부
          </Link>
          <p className="section-kicker">EMPATHY BIBLE</p>
          <h1>
            말씀이 오늘의
            <br />내 삶에 닿도록
          </h1>
          <p>
            공감성경은 말씀을 읽고, 마음을 돌아보고, 삶의 자리에서 하나님께
            응답하도록 돕습니다.
          </p>
        </div>
      </section>

      <section className="bible-app-intro">
        <div className="bible-app-intro-copy">
          <p className="section-kicker">PERSONAL DEVOTION</p>
          <h2>
            오늘 마음의 자리에서
            <br />말씀을 만나세요.
          </h2>
          <p>
            한 구절을 붙들고, 그 말씀이 내 삶에 무엇을 비추는지 천천히
            돌아봅니다. 공감성경은 말씀을 읽는 시간을 정직한 기도와 작은
            순종으로 이어 줍니다.
          </p>
          <a href="https://gongam-bible.vercel.app/" className="primary-link">
            공감성경 시작하기
          </a>
        </div>
        <div className="bible-app-steps" aria-label="공감성경 사용 방법">
          <span>01</span>
          <h3>말씀을 읽습니다</h3>
          <p>오늘의 본문을 천천히 읽으며 마음에 머무는 말씀을 찾습니다.</p>
          <span>02</span>
          <h3>마음을 돌아봅니다</h3>
          <p>말씀 앞에서 내 삶과 감정을 솔직히 기록합니다.</p>
          <span>03</span>
          <h3>삶으로 응답합니다</h3>
          <p>기도와 작은 순종으로 오늘의 하루를 살아갑니다.</p>
        </div>
      </section>

      <section className="empathy-features" aria-labelledby="empathy-features-title">
        <header className="shepherd-features-heading">
          <p className="section-kicker">HOW IT WORKS</p>
          <h2 id="empathy-features-title">마음에서 말씀으로</h2>
          <p>
            지금의 마음을 솔직하게 나누면, 그 자리에 필요한 말씀을 만나고
            오래 간직할 수 있습니다.
          </p>
        </header>

        <div className="empathy-feature-list">
          {features.map((feature) => (
            <article className="empathy-feature" key={feature.number}>
              <div className="shepherd-feature-copy">
                <span className="shepherd-feature-number">{feature.number}</span>
                <p className="section-kicker">{feature.eyebrow}</p>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
              <a
                className="empathy-feature-image"
                href={feature.image.src}
                target="_blank"
                rel="noreferrer"
              >
                <Image
                  src={feature.image.src}
                  alt={feature.image.alt}
                  width={feature.image.width}
                  height={feature.image.height}
                  sizes="(max-width: 800px) 88vw, 42vw"
                />
              </a>
            </article>
          ))}
        </div>

        <div className="shepherd-feature-cta">
          <p>지금 마음을 하나님 앞에 솔직히 꺼내 놓아 보세요.</p>
          <a href="https://gongam-bible.vercel.app/" className="primary-link">
            공감성경 시작하기
          </a>
        </div>
      </section>
    </Layout>
  );
}
