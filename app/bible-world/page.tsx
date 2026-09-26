import type { Metadata } from "next";
import Link from "next/link";
import { Layout } from "@/components/Layout";
import { BibleVideoCards } from "@/components/BibleVideoCards";
import { bibleVideos } from "@/data/bible-videos";

export const metadata: Metadata = {
  title: "영상으로 보는 성경 세계 | 임마누엘교회",
  description: "성막과 성전, 제사와 혼인잔치, 구약·신약의 지형과 바울의 선교여행을 한국어 해설 영상으로 공부하세요."
};

export default function BibleWorldPage() {
  return <Layout>
    <section className="bible-world-hero">
      <div className="home-wrap">
        <p className="section-kicker">BIBLE WORLD</p>
        <h1>영상으로 보는 성경 세계</h1>
        <p>성경 속 공간과 사건을 따라가며 말씀의 배경을 배웁니다.<br />보고 싶은 영상을 골라 개인 묵상과 함께하는 성경공부에 활용하세요.</p>
        <span>전체 {bibleVideos.length}편 · 한국어 해설 · 자막 · 학습 질문</span>
      </div>
    </section>
    <section className="bible-video-section" aria-labelledby="priest-lecture-heading">
      <div className="home-wrap">
        <p className="section-kicker">새 강의 자료 · 슬라이드 14장</p>
        <h2 id="priest-lecture-heading">대제사장의 복장과 영적 의미</h2>
        <p className="bible-section-intro">출애굽기의 예복과 대속죄일의 세마포 옷을 구분하고, 히브리서의 중보와 속죄를 함께 공부합니다. 강의 자료를 먼저 공개하며, 영화 장면이 포함된 영상은 아직 게시되지 않았습니다.</p>
        <Link className="primary-link" href="/bible-world/high-priest">슬라이드와 강의안 보기 →</Link>
      </div>
    </section>
    <section className="bible-video-section" id="bible-videos" aria-labelledby="bible-video-heading">
      <div className="home-wrap">
        <h2 id="bible-video-heading">전체 영상</h2>
        <p className="bible-section-intro">영상을 선택하면 장면별 성경 본문과 나눔 질문을 함께 볼 수 있습니다.</p>
        <BibleVideoCards />
      </div>
    </section>
  </Layout>;
}
