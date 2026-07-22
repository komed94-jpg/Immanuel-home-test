import type { Metadata } from "next";
import Link from "next/link";
import { Layout } from "@/components/Layout";

export const metadata: Metadata = { title: "목자성경 | 임마누엘교회", description: "목장 말씀 나눔을 준비하는 목자성경" };

export default function ShepherdBiblePage() {
  return <Layout><section className="bible-app-hero shepherd-app-hero"><div><Link href="/bible-study" className="back-link">성경공부</Link><p className="section-kicker">SHEPHERD BIBLE</p><h1>목장을 위한 말씀,<br />함께 준비합니다.</h1><p>목자성경은 목자가 본문을 먼저 묵상하고, 목장 식구들이 삶을 나누도록 돕는 인도 도구입니다.</p></div></section><section className="bible-app-intro"><div className="bible-app-intro-copy"><p className="section-kicker">SMALL GROUP LEADERS</p><h2>목원을 만나기 전,<br />말씀과 질문으로 준비하세요.</h2><p>목자성경은 본문의 중심을 붙들고, 목장 식구들의 실제 삶을 살피며, 함께 나눌 질문을 준비하도록 돕습니다.</p><a href="https://mokja-bible.vercel.app/" className="primary-link">목자성경 열기</a></div><div className="bible-app-steps" aria-label="목자성경 사용 방법"><span>01</span><h3>본문을 먼저 묵상합니다</h3><p>중심 메시지와 목장에 필요한 질문을 차분히 살핍니다.</p><span>02</span><h3>나눔을 준비합니다</h3><p>말씀 앞에서 먼저 내 삶을 돌아보고 솔직한 나눔을 준비합니다.</p><span>03</span><h3>서로를 말씀으로 세웁니다</h3><p>목원들이 삶을 나누고 서로 격려하도록 인도합니다.</p></div></section></Layout>;
}
