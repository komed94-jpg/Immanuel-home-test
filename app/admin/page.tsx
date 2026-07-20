import type { Metadata } from "next";
import Link from "next/link";
import { Layout } from "@/components/Layout";
import { adminConfigured, hasAdminSession } from "@/app/chatgpt-auth";
import { AdminLogin } from "@/app/admin/AdminLogin";
import { LogoutButton } from "@/app/admin/LogoutButton";

export const metadata: Metadata = { title: "관리자 | 임마누엘교회", robots: { index: false, follow: false } };

export default async function AdminPage({ searchParams }: { searchParams: Promise<{ returnTo?: string }> }) {
  const authenticated = await hasAdminSession();
  const requested = (await searchParams).returnTo;
  const returnTo = requested?.startsWith("/admin") ? requested : "/admin";
  return <Layout>
    <section className="admin-hero"><div><Link href="/services" className="back-link">교회 서비스</Link><p className="section-kicker">PRIVATE ADMIN</p><h1>관리자</h1><p>접수 내용과 홈페이지의 실제 정보를 관리합니다.</p></div></section>
    {!authenticated && <section className="admin-panel"><AdminLogin configured={adminConfigured()} returnTo={returnTo} /></section>}
    {authenticated && <><section className="admin-session-bar"><span>관리자 모드로 접속했습니다.</span><LogoutButton /></section><section className="admin-home-grid">
      <Link href="/admin/requests"><small>MINISTRY REQUESTS</small><h2>비공개 요청함</h2><p>기도·상담·새가족·성령사역·사경회·제자훈련·공동체 연결 신청의 처리 상태를 관리합니다.</p></Link>
      <Link href="/admin/content"><small>CONTENT MANAGER</small><h2>말씀·설교·행사·헌금 관리</h2><p>오늘의 말씀, 실제 설교 영상, 행사 일정, 온라인 헌금 정보를 등록합니다.</p></Link>
    </section></>}
  </Layout>;
}
