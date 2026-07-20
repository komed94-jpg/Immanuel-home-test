"use client";

import { FormEvent, useState } from "react";

export function AdminLogin({ configured, returnTo }: { configured: boolean; returnTo: string }) {
  const [notice, setNotice] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    const form = event.currentTarget;
    const password = String(new FormData(form).get("password") ?? "");
    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    const result = (await response.json()) as { error?: string };
    if (!response.ok) {
      setNotice(result.error ?? "로그인하지 못했습니다.");
      setSubmitting(false);
      return;
    }
    window.location.assign(returnTo);
  }

  if (!configured) {
    return <div className="admin-setup"><strong>관리자 비밀번호 설정이 필요합니다.</strong><p>Vercel 환경변수에 아래 두 값을 등록하면 로그인 입력이 활성화됩니다.</p><code>IMMANUEL_ADMIN_PASSWORD</code><code>IMMANUEL_ADMIN_SESSION_SECRET</code></div>;
  }

  return <form className="admin-login" onSubmit={login}>
    <label><span>관리자 비밀번호</span><input name="password" type="password" autoComplete="current-password" required autoFocus /></label>
    <button type="submit" disabled={submitting}>{submitting ? "확인 중…" : "관리자 로그인"}</button>
    {notice && <p role="alert">{notice}</p>}
  </form>;
}
