import type { Metadata } from "next";
import Link from "next/link";
import { Layout } from "@/components/Layout";
import { requireImmanuelAdmin } from "@/app/chatgpt-auth";
import { DiscipleshipManager } from "@/app/admin/discipleship/DiscipleshipManager";

export const metadata: Metadata = { title: "제자훈련 관리 | 임마누엘교회", robots: { index: false, follow: false } };

export default async function DiscipleshipAdminPage() {
  await requireImmanuelAdmin("/admin/discipleship");
  return <Layout><section className="admin-hero"><div><Link href="/admin" className="back-link">관리자</Link><p className="section-kicker">DISCIPLESHIP</p><h1>제자훈련 관리</h1><p>과정별 신청 승인부터 8단계 출석·진도·수료까지 관리합니다.</p></div></section><DiscipleshipManager /></Layout>;
}
