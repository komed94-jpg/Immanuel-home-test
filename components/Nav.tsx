"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { MemberNavLink } from "@/app/components/MemberNavLink";
import styles from "./SiteNav.module.css";

const navItems = [
  { href: "/", label: "홈" },
  { href: "/why-immanuel", label: "왜 임마누엘인가" },
  { href: "/way", label: "임마누엘의 길" },
  { href: "/disc", label: "DISC" },
  { href: "/bible-study", label: "성경공부" },
  { href: "/bible-reading", label: "성경읽기" },
  { href: "/bible-world", label: "영상으로 보는 성경 세계" },
  { href: "/services", label: "교회 서비스" },
  { href: "/content", label: "콘텐츠" },
  { href: "/about", label: "소개" }
];

function NavigationLinks({ pathname }: { pathname: string }) {
  return <>
    <div className={styles.destinations}>
      {navItems.map(({ href, label }) => {
        const current = pathname === href ? "page" : pathname.startsWith(href + "/") ? "location" : undefined;
        return <Link key={href} href={href} aria-current={current}>{label}</Link>;
      })}
    </div>
    <div className={styles.account}><MemberNavLink /></div>
  </>;
}

export function Nav() {
  const pathname = usePathname() || "/";
  const menu = useRef<HTMLDetailsElement>(null);
  const toggle = useRef<HTMLElement>(null);

  useEffect(() => {
    const closeOutside = (event: Event) => {
      const details = menu.current;
      if (details?.open && event.target instanceof Node && !details.contains(event.target)) {
        details.open = false;
      }
    };
    document.addEventListener("pointerdown", closeOutside);
    document.addEventListener("focusin", closeOutside);
    return () => {
      document.removeEventListener("pointerdown", closeOutside);
      document.removeEventListener("focusin", closeOutside);
    };
  }, []);

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link href="/" className={styles.brand} aria-label="임마누엘교회 홈">
          <span className={styles.monogram} aria-hidden="true">Im</span>
          <span className={styles.wordmark} aria-hidden="true">IMMANUEL<small>CHURCH</small></span>
        </Link>
        <nav className={styles.desktop} aria-label="주요 메뉴">
          <NavigationLinks pathname={pathname} />
        </nav>
        <details ref={menu} className={styles.mobile} onKeyDown={(event) => {
          if (event.key === "Escape" && event.currentTarget.open) {
            event.preventDefault();
            event.currentTarget.open = false;
            toggle.current?.focus();
          }
        }}>
          <summary ref={toggle} className={styles.toggle}>
            <span className={styles.menuIcon} aria-hidden="true" />메뉴
          </summary>
          <nav className={styles.panel} aria-label="모바일 주요 메뉴" onClick={(event) => {
            if (menu.current && event.target instanceof Element && event.target.closest("a[href]")) {
              menu.current.open = false;
            }
          }}>
            <NavigationLinks pathname={pathname} />
          </nav>
        </details>
      </div>
    </header>
  );
}
