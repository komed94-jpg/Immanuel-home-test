import type { Metadata } from "next";
import Link from "next/link";
import { Layout } from "@/components/Layout";
import { requireImmanuelAdmin } from "@/app/chatgpt-auth";
import { MemberManager } from "@/app/admin/members/MemberManager";

export const metadata: Metadata = { title: "회원·교인 관리 | 임마누엘교회", robots: { index: false, follow: false } };

export default async function MembersAdminPage() {
  await requireImmanuelAdmin("/admin/members");
  return <Layout><section className="admin-hero"><div><Link href="/admin" className="back-link">관리자</Link><p className="section-kicker">MEMBERSHIP</p><h1>회원·교인 관리</h1><p>회원가입 계정과 교인 승인, 교인번호 및 권한을 관리합니다.</p></div></section><MemberManager /></Layout>;
}
