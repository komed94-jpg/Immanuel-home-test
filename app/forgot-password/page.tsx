import type { Metadata } from "next";
import { Layout } from "@/components/Layout";
import { PasswordResetRequestForm } from "@/app/components/PasswordResetForms";
export const metadata: Metadata = { title: "비밀번호 찾기 | 임마누엘교회", robots: { index: false, follow: false } };
export default function ForgotPasswordPage() { return <Layout><section className="member-auth-page"><div className="request-intro"><p className="section-kicker">PASSWORD RESET</p><h1>비밀번호 찾기</h1><p>가입한 이메일로 일회용 재설정 주소를 보내드립니다.</p></div><PasswordResetRequestForm /></section></Layout>; }
