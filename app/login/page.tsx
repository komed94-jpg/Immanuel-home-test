import type { Metadata } from "next";
import { Layout } from "@/components/Layout";
import { MemberAuthForm } from "@/app/components/MemberAuthForm";

export const metadata: Metadata = { title: "로그인 | 임마누엘교회", robots: { index: false, follow: false } };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ returnTo?: string }> }) {
  const requested = (await searchParams).returnTo;
  const returnTo = requested?.startsWith("/") && !requested.startsWith("//") ? requested : "/member";
  return <Layout><section className="member-auth-page"><div className="request-intro"><p className="section-kicker">IMMANUEL MEMBER</p><h1>로그인</h1><p>임마누엘 공동체의 신청과 출석 기록을 확인합니다.</p></div><MemberAuthForm mode="login" returnTo={returnTo} /></section></Layout>;
}
