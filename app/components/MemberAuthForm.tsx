"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

export function MemberAuthForm({ mode, returnTo = "/member" }: { mode: "login" | "signup"; returnTo?: string }) {
  const [notice, setNotice] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setNotice("");
    const form = event.currentTarget;
    const data = new FormData(form);
    const password = String(data.get("password") ?? "");
    if (mode === "signup" && password !== String(data.get("passwordConfirm") ?? "")) {
      setNotice("비밀번호 확인이 일치하지 않습니다.");
      setSubmitting(false);
      return;
    }
    const payload = mode === "login"
      ? { login: data.get("login"), password }
      : {
          name: data.get("name"), email: data.get("email"), phone: data.get("phone"),
          birthDate: data.get("birthDate"), password, consented: data.get("consented") === "on",
        };
    const response = await fetch(mode === "login" ? "/api/member/login" : "/api/member/register", {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload),
    });
    const result = (await response.json()) as { error?: string };
    if (!response.ok) {
      setNotice(result.error ?? "처리하지 못했습니다.");
      setSubmitting(false);
      return;
    }
    window.location.assign(returnTo.startsWith("/") && !returnTo.startsWith("//") ? returnTo : "/member");
  }

  return <form className="request-form member-auth-form" onSubmit={submit}>
    {mode === "signup" && <>
      <div className="request-form-grid">
        <label><span>이름</span><input name="name" type="text" maxLength={80} autoComplete="name" required /></label>
        <label><span>생년월일</span><input name="birthDate" type="date" required /></label>
      </div>
      <div className="request-form-grid">
        <label><span>이메일</span><input name="email" type="email" maxLength={200} autoComplete="email" required /></label>
        <label><span>전화번호</span><input name="phone" type="tel" maxLength={20} autoComplete="tel" required placeholder="010-0000-0000" /></label>
      </div>
    </>}
    {mode === "login" && <label><span>이메일 또는 전화번호</span><input name="login" type="text" autoComplete="username" required /></label>}
    <div className={mode === "signup" ? "request-form-grid" : ""}>
      <label><span>비밀번호</span><input name="password" type="password" minLength={10} maxLength={128} autoComplete={mode === "signup" ? "new-password" : "current-password"} required /></label>
      {mode === "signup" && <label><span>비밀번호 확인</span><input name="passwordConfirm" type="password" minLength={10} maxLength={128} autoComplete="new-password" required /></label>}
    </div>
    {mode === "signup" && <label className="request-checkbox member-consent"><input name="consented" type="checkbox" required /><span>회원 관리, 교인 승인, 출석 및 교육 이력 관리를 위한 개인정보 수집·이용에 동의합니다.</span></label>}
    <p className="request-form-privacy">회원가입 계정은 교인 등록과 별개입니다. 교인번호와 멤버 기능은 관리자 승인 후 활성화됩니다.</p>
    <button className="primary-link request-submit" type="submit" disabled={submitting}>{submitting ? "처리 중…" : mode === "login" ? "로그인" : "회원가입"}</button>
    {notice && <p className="member-auth-notice" role="alert">{notice}</p>}
    {mode === "login" && <p className="member-auth-switch"><Link href="/forgot-password">비밀번호를 잊으셨나요?</Link></p>}
    <p className="member-auth-switch">{mode === "login" ? <>계정이 없으신가요? <Link href="/signup">회원가입</Link></> : <>이미 계정이 있으신가요? <Link href="/login">로그인</Link></>}</p>
  </form>;
}
