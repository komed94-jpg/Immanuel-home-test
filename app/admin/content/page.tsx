import type { Metadata } from "next";
import Link from "next/link";
import { Layout } from "@/components/Layout";
import { requireImmanuelAdmin } from "@/app/chatgpt-auth";
import { ContentManager } from "@/app/admin/content/ContentManager";

export const metadata: Metadata = { title: "말씀·설교·행사 관리 | 임마누엘교회", robots: { index: false, follow: false } };

export default async function ContentAdminPage() {
  await requireImmanuelAdmin("/admin/content");
  return <Layout>
    <section className="admin-hero"><div><Link href="/services" className="back-link">교회 서비스</Link><p className="section-kicker">CONTENT MANAGER</p><h1>말씀·설교·행사 관리</h1><p>확정된 오늘의 말씀과 실제 설교 영상, 행사 일정만 등록합니다.</p></div></section>
    <ContentManager />
  </Layout>;
}
