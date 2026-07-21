"use client";

import { FormEvent, useState } from "react";

export function MemberProfileForm({ name, email, phone }: { name: string; email: string; phone: string }) {
  const [notice, setNotice] = useState("");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const response = await fetch("/api/member/profile", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(Object.fromEntries(new FormData(event.currentTarget))) });
    const result = (await response.json()) as { error?: string };
    setNotice(response.ok ? "회원 정보를 수정했습니다." : result.error ?? "수정하지 못했습니다.");
  }
  return <form className="request-form member-profile-form" onSubmit={submit}><div className="request-form-grid"><label><span>이름</span><input name="name" defaultValue={name} required /></label><label><span>전화번호</span><input name="phone" defaultValue={phone} required /></label></div><label><span>이메일</span><input name="email" type="email" defaultValue={email} required /></label><button className="primary-link request-submit" type="submit">회원 정보 수정</button>{notice && <p className="member-auth-notice" role="status">{notice}</p>}</form>;
}
