import type { Metadata } from "next";
import Link from "next/link";
import { Layout } from "@/components/Layout";
import { BibleAppEmbed } from "@/app/components/BibleAppEmbed";

export const metadata: Metadata = { title: "공감성경 | 임마누엘교회", description: "말씀을 오늘의 내 삶과 연결하는 공감성경" };

export default function EmpathyBiblePage() {
  return <Layout><section className="bible-app-hero"><div><Link href="/bible-study" className="back-link">성경공부</Link><p className="section-kicker">EMPATHY BIBLE</p><h1>말씀이 오늘의<br />내 삶에 닿도록</h1><p>공감성경은 말씀을 읽고, 마음을 돌아보고, 삶의 자리에서 하나님께 응답하도록 돕습니다.</p></div></section><BibleAppEmbed appName="공감성경" appUrl="https://gongam-bible.vercel.app/" description="개인의 묵상과 기록을 돕는" /><section className="bible-app-note"><h2>이렇게 사용해 보세요.</h2><ol><li>오늘의 본문을 천천히 읽습니다.</li><li>마음에 머무는 말씀과 삶의 이야기를 기록합니다.</li><li>기도와 작은 순종으로 하루를 이어 갑니다.</li></ol></section></Layout>;
}
