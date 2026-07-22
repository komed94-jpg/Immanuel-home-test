import Link from "next/link";
import { MemberNavLink } from "@/app/components/MemberNavLink";

const navItems = [
  { href: "/", label: "홈" },
  { href: "/why-immanuel", label: "왜 임마누엘인가" },
  { href: "/way", label: "임마누엘의 길" },
  { href: "/bible-study", label: "성경공부" },
  { href: "/services", label: "교회 서비스" },
  { href: "/content", label: "콘텐츠" },
  { href: "/about", label: "소개" }
];

export function Nav() {
  return (
    <header className="site-header">
      <Link href="/" className="brand" aria-label="Immanuel church home">
        <span className="brand-mark">Im</span>
        <span className="brand-copy">
          IMMANUEL
          <small>CHURCH</small>
        </span>
      </Link>
      <nav className="nav-links" aria-label="주요 메뉴">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href}>
            {item.label}
          </Link>
        ))}
        <MemberNavLink />
      </nav>
      <div className="member-nav-mobile"><MemberNavLink /></div>
    </header>
  );
}
