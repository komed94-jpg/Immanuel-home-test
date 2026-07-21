import type { Metadata } from "next";
import { Layout } from "@/components/Layout";
import { MemberAuthForm } from "@/app/components/MemberAuthForm";

export const metadata: Metadata = { title: "회원가입 | 임마누엘교회", robots: { index: false, follow: false } };

export default function SignupPage() {
  return <Layout><section className="member-auth-page"><div className="request-intro"><p className="section-kicker">CREATE ACCOUNT</p><h1>회원가입</h1><p>먼저 홈페이지 계정을 만듭니다. 교인 등록은 별도 승인 절차로 진행됩니다.</p></div><MemberAuthForm mode="signup" /></section></Layout>;
}
