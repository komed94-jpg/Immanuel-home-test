import type { Metadata } from "next";
import Link from "next/link";
import { Layout } from "@/components/Layout";
import { requireImmanuelAdmin } from "@/app/chatgpt-auth";
import { AttendanceManager } from "@/app/admin/attendance/AttendanceManager";

export const metadata: Metadata = { title: "출석 관리 | 임마누엘교회", robots: { index: false, follow: false } };
export default async function AttendanceAdminPage() {
  await requireImmanuelAdmin("/admin/attendance");
  return <Layout><section className="admin-hero"><div><Link href="/admin" className="back-link">관리자</Link><p className="section-kicker">ATTENDANCE</p><h1>출석 관리</h1><p>예배·목장·제자훈련·행사의 출석을 등록합니다.</p></div></section><AttendanceManager /></Layout>;
}
