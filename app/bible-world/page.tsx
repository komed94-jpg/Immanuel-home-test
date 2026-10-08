import type { Metadata } from "next";
import { Layout } from "@/components/Layout";
import { BibleVideoCards } from "@/components/BibleVideoCards";
import { bibleVideos } from "@/data/bible-videos";

export const metadata: Metadata = {
  title: "영상으로 보는 성경 세계 | 임마누엘교회",
  description: "성막과 성전, 제사와 혼인잔치, 구약·신약의 지형과 바울의 선교여행과 AI 시대의 신앙을 한국어 해설 영상으로 공부하세요."
};

export default function BibleWorldPage() {
  return <Layout>
    <section className="bible-world-hero">
      <div className="home-wrap">
        <p className="section-kicker">BIBLE WORLD</p>
        <h1>영상으로 보는 성경 세계</h1>
        <p>성경 속 공간과 사건부터 AI 시대의 신앙까지 함께 배웁니다.<br />보고 싶은 영상을 골라 개인 묵상과 함께하는 성경공부에 활용하세요.</p>
        <span>전체 {bibleVideos.length}편 · 한국어 해설 · 학습 질문</span>
      </div>
    </section>
    <section className="bible-video-section" id="bible-videos" aria-labelledby="bible-video-heading">
      <div className="home-wrap">
        <h2 id="bible-video-heading">전체 영상</h2>
        <p className="bible-section-intro">영상을 선택하면 주제별 바로가기와 나눔 질문을 함께 볼 수 있습니다.</p>
        <BibleVideoCards />
      </div>
    </section>
  </Layout>;
}
