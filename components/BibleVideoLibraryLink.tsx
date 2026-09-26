import Link from "next/link";
import { bibleVideos } from "@/data/bible-videos";

export function BibleVideoLibraryLink() {
  return <>
    <p className="section-kicker">BIBLE WORLD</p>
    <h2 id="bible-video-heading">영상으로 보는 성경 세계</h2>
    <p className="bible-section-intro">성막과 성전, 제사와 혼인잔치, 구약·신약의 지형과 선교여행까지. 한국어 해설 영상 {bibleVideos.length}편을 한곳에서 만나세요.</p>
    <Link className="primary-link" href="/bible-world">영상 {bibleVideos.length}편 모두 보기 →</Link>
  </>;
}
