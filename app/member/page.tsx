import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Layout } from "@/components/Layout";
import { getCurrentMember } from "@/lib/member-auth";
import { MemberLogoutButton } from "@/app/components/MemberLogoutButton";
import { MemberProfileForm } from "@/app/components/MemberProfileForm";
import { MemberAttendance } from "@/app/components/MemberAttendance";
import { PasswordChangeForm } from "@/app/components/PasswordChangeForm";
import { MemberRegistrySummary } from "@/app/components/MemberRegistrySummary";

export const metadata: Metadata = { title: "내 정보 | 임마누엘교회", robots: { index: false, follow: false } };

const membershipLabels: Record<string, string> = { nonmember: "비멤버", pending: "교인 승인 대기", active: "등록 교인", inactive: "비활성 교인", long_absent: "장기 미출석", transferred: "이명", withdrawn: "탈퇴", deceased: "별세" };

export default async function MemberPage({ searchParams }: { searchParams: Promise<{ notice?: string }> }) {
  const member = await getCurrentMember();
  if (!member) redirect("/login?returnTo=/member");
  const notice = (await searchParams).notice;
  return <Layout><section className="member-dashboard"><div className="member-dashboard-heading"><div><p className="section-kicker">MY IMMANUEL</p><h1>{member.name}님</h1><p>{membershipLabels[member.membershipStatus] ?? member.membershipStatus}</p></div><MemberLogoutButton /></div>
    {notice && <p className="content-manager-notice">{notice}</p>}
    <div className="member-summary-grid"><article><small>교인번호</small><strong>{member.memberNumber ?? "승인 후 발급"}</strong></article><article><small>회원 권한</small><strong>{member.role === "leader" ? "리더" : member.role === "staff" ? "사역자" : "일반 회원"}</strong></article><article><small>제자훈련</small><strong>{member.membershipStatus === "active" ? "신청 가능" : "승인 후 이용"}</strong></article></div>
    {member.membershipStatus !== "active" && <section className="member-approval-note"><h2>교인 등록 승인 전입니다.</h2><p>회원가입 계정은 정상적으로 만들어졌습니다. 새가족 등록카드를 제출하고 관리자가 교인 등록을 승인하면 교인번호와 멤버 전용 기능이 활성화됩니다.</p><Link className="primary-link" href="/services/new-family">새가족 등록카드 작성</Link></section>}
    <section className="member-dashboard-section"><h2>교인 등록과 가족</h2><MemberRegistrySummary /></section>
    <section className="member-dashboard-section"><h2>회원 정보</h2><MemberProfileForm name={member.name} email={member.email} phone={member.phone} /></section>
    <section className="member-dashboard-section"><h2>비밀번호 변경</h2><PasswordChangeForm /></section>
    <section className="member-dashboard-section"><h2>내 출석 기록</h2><MemberAttendance /></section>
  </section></Layout>;
}
