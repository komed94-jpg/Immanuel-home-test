import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Layout } from "@/components/Layout";

export const metadata: Metadata = {
  title: "목자성경 | 임마누엘교회",
  description: "목장 말씀 나눔을 준비하는 목자성경",
};

const features = [
  {
    number: "01",
    eyebrow: "ASK",
    title: "목양의 질문을 말씀으로 풀어갑니다.",
    description:
      "목원을 섬기며 생긴 질문을 입력하면, 관련 성경 구절을 중심으로 목양에 필요한 답변을 정리해 줍니다.",
    images: [
      {
        src: "/images/shepherd-bible/ask.png",
        alt: "목자성경 질문 입력 화면",
        width: 798,
        height: 487,
      },
    ],
  },
  {
    number: "02",
    eyebrow: "STUDY",
    title: "성경 근거부터 실제 설명까지 준비합니다.",
    description:
      "관련 본문과 핵심 해설을 살피고, 목원에게 바로 전할 수 있는 말과 이해하기 쉬운 비유까지 함께 준비합니다.",
    images: [
      {
        src: "/images/shepherd-bible/scripture.png",
        alt: "목자성경의 성경 구절과 해설 화면",
        width: 848,
        height: 1130,
      },
      {
        src: "/images/shepherd-bible/guide.png",
        alt: "목자성경의 설명, 비유, 예상 질문 화면",
        width: 817,
        height: 1087,
      },
    ],
  },
  {
    number: "03",
    eyebrow: "CARE",
    title: "말씀을 삶과 기도로 이어 줍니다.",
    description:
      "하나님의 약속과 실제 예화, 이번 주 도전, 목자 팁과 기도 제목을 통해 목양의 다음 걸음을 구체화합니다.",
    images: [
      {
        src: "/images/shepherd-bible/blessing.png",
        alt: "목자성경의 블레싱, 예화, 목자 팁과 기도 제목 화면",
        width: 805,
        height: 903,
      },
    ],
  },
  {
    number: "04",
    eyebrow: "SHARE",
    title: "필요한 내용을 모아 목원에게 전합니다.",
    description:
      "답변에서 필요한 부분만 목자 메모에 담고, 전송 전 내용을 확인한 뒤 카카오톡으로 간편하게 나눌 수 있습니다.",
    images: [
      {
        src: "/images/shepherd-bible/memo.png",
        alt: "목자성경 목자 메모 화면",
        width: 802,
        height: 852,
      },
      {
        src: "/images/shepherd-bible/share.png",
        alt: "목자성경 카카오톡 전송 미리보기 화면",
        width: 781,
        height: 1131,
      },
    ],
  },
];

export default function ShepherdBiblePage() {
  return (
    <Layout>
      <section className="bible-app-hero shepherd-app-hero">
        <div>
          <Link href="/bible-study" className="back-link">
            성경공부
          </Link>
          <p className="section-kicker">SHEPHERD BIBLE</p>
          <h1>
            목장을 위한 말씀,
            <br />
            함께 준비합니다.
          </h1>
          <p>
            목자성경은 목자가 본문을 먼저 묵상하고, 목장 식구들이 삶을
            나누도록 돕는 인도 도구입니다.
          </p>
        </div>
      </section>

      <section className="bible-app-intro">
        <div className="bible-app-intro-copy">
          <p className="section-kicker">SMALL GROUP LEADERS</p>
          <h2>
            목원을 만나기 전,
            <br />
            말씀과 질문으로 준비하세요.
          </h2>
          <p>
            목자성경은 본문의 중심을 붙들고, 목장 식구들의 실제 삶을
            살피며, 함께 나눌 질문을 준비하도록 돕습니다.
          </p>
          <a href="https://mokja-bible.vercel.app/" className="primary-link">
            목자성경 열기
          </a>
        </div>
        <div className="bible-app-steps" aria-label="목자성경 사용 방법">
          <span>01</span>
          <h3>본문을 먼저 묵상합니다</h3>
          <p>중심 메시지와 목장에 필요한 질문을 차분히 살핍니다.</p>
          <span>02</span>
          <h3>나눔을 준비합니다</h3>
          <p>말씀 앞에서 먼저 내 삶을 돌아보고 솔직한 나눔을 준비합니다.</p>
          <span>03</span>
          <h3>서로를 말씀으로 세웁니다</h3>
          <p>목원들이 삶을 나누고 서로 격려하도록 인도합니다.</p>
        </div>
      </section>

      <section className="shepherd-features" aria-labelledby="shepherd-features-title">
        <header className="shepherd-features-heading">
          <p className="section-kicker">HOW IT HELPS</p>
          <h2 id="shepherd-features-title">목양의 질문에서 나눔까지</h2>
          <p>
            질문 하나를 성경에 비추어 살피고, 목원에게 전할 말과 기도까지
            한 흐름 안에서 준비할 수 있습니다.
          </p>
        </header>

        <div className="shepherd-feature-list">
          {features.map((feature) => (
            <article className="shepherd-feature" key={feature.number}>
              <div className="shepherd-feature-copy">
                <span className="shepherd-feature-number">{feature.number}</span>
                <p className="section-kicker">{feature.eyebrow}</p>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
              <div
                className={`shepherd-feature-images ${
                  feature.images.length > 1 ? "is-pair" : ""
                }`}
              >
                {feature.images.map((image) => (
                  <a href={image.src} target="_blank" rel="noreferrer" key={image.src}>
                    <Image
                      src={image.src}
                      alt={image.alt}
                      width={image.width}
                      height={image.height}
                      sizes={feature.images.length > 1 ? "(max-width: 800px) 92vw, 33vw" : "(max-width: 800px) 92vw, 58vw"}
                    />
                  </a>
                ))}
              </div>
            </article>
          ))}
        </div>

        <div className="shepherd-feature-cta">
          <p>목원을 떠올리며, 지금 필요한 말씀부터 준비해 보세요.</p>
          <a href="https://mokja-bible.vercel.app/" className="primary-link">
            목자성경 시작하기
          </a>
        </div>
      </section>
    </Layout>
  );
}
