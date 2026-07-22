import type { Metadata } from "next";
import Link from "next/link";
import { Layout } from "@/components/Layout";
import { BibleAppEmbed } from "@/app/components/BibleAppEmbed";

export const metadata: Metadata = { title: "목자성경 | 임마누엘교회", description: "목장 말씀 나눔을 준비하는 목자성경" };

export default function ShepherdBiblePage() {
  return <Layout><section className="bible-app-hero shepherd-app-hero"><div><Link href="/bible-study" className="back-link">성경공부</Link><p className="section-kicker">SHEPHERD BIBLE</p><h1>목장을 위한 말씀,<br />함께 준비합니다.</h1><p>목자성경은 목자가 본문을 먼저 묵상하고, 목장 식구들이 삶을 나누도록 돕는 인도 도구입니다.</p></div></section><BibleAppEmbed appName="목자성경" appUrl={process.env.NEXT_PUBLIC_SHEPHERD_BIBLE_APP_URL} description="목장 나눔 준비와 인도를 돕는" /><section className="bible-app-note"><h2>목장 모임 전에 준비하세요.</h2><ol><li>본문의 중심 메시지와 목장에 필요한 질문을 살핍니다.</li><li>내 삶의 솔직한 나눔을 먼저 준비합니다.</li><li>목장 식구들이 서로 말씀으로 격려하도록 돕습니다.</li></ol></section></Layout>;
}
