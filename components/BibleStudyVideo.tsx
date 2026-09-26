"use client";
import Link from "next/link";
import { useRef, useState } from "react";
import { Layout } from "@/components/Layout";
import { type BibleVideo } from "@/data/bible-videos";

export default function BibleStudyVideo({ video }: { video: BibleVideo }) {
  const player = useRef<HTMLVideoElement>(null);
  const pendingSeek = useRef<number | null>(null);
  const [error, setError] = useState(false);
  const seek = (seconds: number) => {
    const element = player.current;
    if (!element) return;
    if (element.readyState >= 1) {
      element.currentTime = seconds;
      void element.play().catch(() => {});
    } else {
      pendingSeek.current = seconds;
      element.load();
    }
  };
  return (
    <Layout>
      <article className="bible-study-page home-wrap">
        <Link className="bible-back" href="/bible-study#bible-videos">← 성경 공부 영상 목록</Link>
        <p className="section-kicker">Bible Study</p>
        <h1>{video.title}</h1>
        <p className="bible-study-intro">{video.description}</p>
        <p className="bible-study-meta">{video.duration} · 한국어 해설 · 1080p</p>
        <video ref={player} className="bible-study-player" controls playsInline preload="metadata" poster={video.poster} aria-label={video.title}
          onError={() => setError(true)} onLoadedMetadata={() => {
            setError(false);
            if (pendingSeek.current !== null && player.current) {
              player.current.currentTime = pendingSeek.current;
              pendingSeek.current = null;
              void player.current.play().catch(() => {});
            }
          }}>
          <source src={video.src} type="video/mp4" />
          <track kind="captions" src={video.captions} srcLang="ko" label="한국어 해설" />
          이 브라우저에서는 영상을 재생할 수 없습니다. 아래에서 영상을 내려받아 주세요.
        </video>
        {error && <p role="alert">영상을 불러오지 못했습니다. 페이지를 새로고침하거나 아래의 다운로드를 이용해 주세요.</p>}
        <div className="bible-player-links"><a href={video.src} download>영상 다운로드</a><a href={video.captions} download>한국어 자막 다운로드</a></div>
        <p className="bible-reconstruction-note">성경 기록에 기초한 AI 복원 상상도입니다. 세부 형태·장식·조명은 추정이며, 실사풍 동영상과 정지 이미지의 이동 효과를 함께 사용했습니다. 기구의 위치와 수는 성경 본문 및 도식을 기준으로 확인해 주세요.</p>
        <section className="bible-chapters" aria-labelledby="chapter-heading">
          <h2 id="chapter-heading">장면을 골라 공부하기</h2>
          <ol>{video.chapters.map((chapter) => <li key={chapter.start}>
            <button type="button" onClick={() => seek(chapter.start)}><span>{Math.floor(chapter.start / 60)}:{String(Math.floor(chapter.start % 60)).padStart(2, "0")}</span><strong>{chapter.title}</strong><small>{chapter.ref}</small></button>
          </li>)}</ol>
        </section>
        <section className="bible-questions"><h2>함께 나눌 질문</h2><ol>{video.questions.map((question) => <li key={question}>{question}</li>)}</ol></section>
        <Link className="secondary-link" href="/bible-study#bible-videos">다른 성경 공부 영상 보기</Link>
      </article>
    </Layout>
  );
}
