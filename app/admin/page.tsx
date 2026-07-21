import type { Metadata } from "next";
import Link from "next/link";
import { Layout } from "@/components/Layout";
import { requireImmanuelAdmin } from "@/app/chatgpt-auth";

export const metadata: Metadata = { title: "관리자 | 임마누엘교회", robots: { index: false, follow: false } };

export default async function AdminPage() {
  await requireImmanuelAdmin("/admin");
  return <Layout>
    <section className="admin-hero"><div><Link href="/services" className="back-link">교회 서비스</Link><p className="section-kicker">PRIVATE ADMIN</p><h1>관리자</h1><p>접수 내용과 홈페이지의 실제 정보를 관리합니다.</p></div></section>
    <><section className="admin-session-bar"><span>관리자 모드로 접속했습니다.</span><Link href="/member">내 정보로 돌아가기</Link></section><section className="admin-home-grid">
      <Link href="/admin/requests"><small>MINISTRY REQUESTS</small><h2>비공개 요청함</h2><p>기도·상담·새가족·성령사역·사경회·제자훈련·공동체 연결 신청의 처리 상태를 관리합니다.</p></Link>
      <Link href="/admin/content"><small>CONTENT MANAGER</small><h2>말씀·설교·행사·헌금 관리</h2><p>오늘의 말씀, 실제 설교 영상, 행사 일정, 온라인 헌금 정보를 등록합니다.</p></Link>
      <Link href="/admin/members"><small>MEMBERSHIP</small><h2>회원·교인 관리</h2><p>가입 계정을 확인하고 교인 등록 승인과 교인번호, 리더 권한을 관리합니다.</p></Link>
      <Link href="/admin/attendance"><small>ATTENDANCE</small><h2>출석 관리</h2><p>예배·목장·제자훈련·행사의 출석을 등록하고 확인합니다.</p></Link>
      <Link href="/admin/discipleship"><small>DISCIPLESHIP</small><h2>제자훈련 관리</h2><p>과정별 신청 승인, 대기자, 8단계 출석·진도와 수료 이력을 관리합니다.</p></Link>
      <Link href="/admin/events"><small>EVENT REGISTRATION</small><h2>행사 신청 관리</h2><p>행사 공개 범위, 신청 기간·정원, 대기자, 출석과 참가 이력을 관리합니다.</p></Link>
    </section></>
  </Layout>;
}
