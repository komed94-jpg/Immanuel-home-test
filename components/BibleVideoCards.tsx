import Image from "next/image";
import Link from "next/link";
import { bibleVideos } from "@/data/bible-videos";

export function BibleVideoCards() {
  return (
    <div className="bible-video-grid">
      {bibleVideos.map((video) => (
        <Link className="bible-video-card" href={`/content/bible-study/${video.slug}`} key={video.slug}>
          <div className="bible-video-cover">
            <Image src={video.poster} alt={video.title + (video.category ? " 영상 표지" : video.slug.endsWith("-terrain") ? " 지형 지도" : " 복원 장면")} fill sizes="(max-width: 700px) 100vw, 50vw" />
            <span className="bible-video-play" aria-hidden="true">▶</span>
            <span className="bible-video-duration">{video.duration}</span>
          </div>
          <div className="bible-video-copy">
            <small>{video.category ?? "성경 공부 영상 · 한국어 해설"}</small>
            <h3>{video.title}</h3>
            <p>{video.description}</p>
            <span className="bible-video-watch">영상으로 공부하기 →</span>
          </div>
        </Link>
      ))}
    </div>
  );
}
