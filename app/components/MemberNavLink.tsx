"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export function MemberNavLink() {
  const [session, setSession] = useState<{ authenticated: boolean; isAdmin: boolean } | null>(null);
  useEffect(() => {
    fetch("/api/member/session", { cache: "no-store" })
      .then((response) => response.json())
      .then((value: { authenticated?: boolean; isAdmin?: boolean }) => setSession({ authenticated: Boolean(value.authenticated), isAdmin: Boolean(value.isAdmin) }))
      .catch(() => setSession({ authenticated: false, isAdmin: false }));
  }, []);
  const authenticated = Boolean(session?.authenticated);
  return <>{session?.isAdmin && <Link href="/admin">관리자</Link>}<Link href={authenticated ? "/member" : "/login"}>{authenticated ? "내 정보" : "로그인"}</Link></>;
}
