import type { Metadata } from "next";
import Link from "next/link";
import { Layout } from "@/components/Layout";
import { requireImmanuelAdmin } from "@/app/chatgpt-auth";
import { StudyAdmin } from "./StudyAdmin";

export const metadata: Metadata = { title: "성경공부 관리 | 임마누엘교회", robots: { index: false, follow: false } };

export default async function StudyAdminPage() {
  await requireImmanuelAdmin("/admin/study");
  return <Layout>
    <section className="admin-hero"><div><Link href="/admin" className="back-link">관리자</Link><p className="section-kicker">WEB BIBLE STUDY</p><h1>성경공부 관리</h1><p>웹 교재 답변, 공부 날짜, 진도와 수료 상태를 확인합니다.</p></div></section>
    <StudyAdmin />
  </Layout>;
}
