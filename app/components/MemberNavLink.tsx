"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export function MemberNavLink() {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  useEffect(() => {
    fetch("/api/member/session", { cache: "no-store" })
      .then((response) => response.json())
      .then((value: { authenticated?: boolean }) => setAuthenticated(Boolean(value.authenticated)))
      .catch(() => setAuthenticated(false));
  }, []);
  return <Link href={authenticated ? "/member" : "/login"}>{authenticated ? "내 정보" : "로그인"}</Link>;
}
