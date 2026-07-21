import type { Metadata } from "next";
import { Layout } from "@/components/Layout";
import { PasswordResetConfirmForm } from "@/app/components/PasswordResetForms";
export const metadata: Metadata = { title: "비밀번호 재설정 | 임마누엘교회", robots: { index: false, follow: false } };
export default async function ResetPasswordPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) { const token = (await searchParams).token ?? ""; return <Layout><section className="member-auth-page"><div className="request-intro"><p className="section-kicker">NEW PASSWORD</p><h1>새 비밀번호</h1><p>10자 이상의 새 비밀번호를 입력해 주세요.</p></div><PasswordResetConfirmForm token={token} /></section></Layout>; }
