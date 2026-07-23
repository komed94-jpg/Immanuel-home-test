import type { Metadata } from "next";
import Link from "next/link";
import { Layout } from "@/components/Layout";
import { requireImmanuelAdmin } from "@/app/chatgpt-auth";
import { NewFamilyManager } from "./NewFamilyManager";

export const metadata: Metadata = { title: "새가족 정착 관리 | 임마누엘교회", robots: { index: false, follow: false } };

export default async function NewFamilyAdminPage() {
  await requireImmanuelAdmin("/admin/new-family");
  return <Layout>
    <section className="admin-hero"><div><Link href="/admin" className="back-link">관리자</Link><p className="section-kicker">NEW FAMILY CARE</p><h1>새가족 정착 관리</h1><p>첫 방문부터 담당자 연결, 등록 상담, 목장과 교육, 정착 완료까지 한 흐름으로 돌봅니다.</p></div></section>
    <NewFamilyManager />
  </Layout>;
}
