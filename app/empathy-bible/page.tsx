import type { Metadata } from "next";
import Link from "next/link";
import { Layout } from "@/components/Layout";

export const metadata: Metadata = { title: "공감성경 | 임마누엘교회", description: "말씀을 오늘의 내 삶과 연결하는 공감성경" };

export default function EmpathyBiblePage() {
  return <Layout><section className="bible-app-hero"><div><Link href="/bible-study" className="back-link">성경공부</Link><p className="section-kicker">EMPATHY BIBLE</p><h1>말씀이 오늘의<br />내 삶에 닿도록</h1><p>공감성경은 말씀을 읽고, 마음을 돌아보고, 삶의 자리에서 하나님께 응답하도록 돕습니다.</p></div></section><section className="bible-app-intro"><div className="bible-app-intro-copy"><p className="section-kicker">PERSONAL DEVOTION</p><h2>오늘 마음의 자리에서<br />말씀을 만나세요.</h2><p>한 구절을 붙들고, 그 말씀이 내 삶에 무엇을 비추는지 천천히 돌아봅니다. 공감성경은 말씀을 읽는 시간을 정직한 기도와 작은 순종으로 이어 줍니다.</p><a href="https://gongam-bible.vercel.app/" className="primary-link">공감성경 시작하기</a></div><div className="bible-app-steps" aria-label="공감성경 사용 방법"><span>01</span><h3>말씀을 읽습니다</h3><p>오늘의 본문을 천천히 읽으며 마음에 머무는 말씀을 찾습니다.</p><span>02</span><h3>마음을 돌아봅니다</h3><p>말씀 앞에서 내 삶과 감정을 솔직히 기록합니다.</p><span>03</span><h3>삶으로 응답합니다</h3><p>기도와 작은 순종으로 오늘의 하루를 살아갑니다.</p></div></section></Layout>;
}
