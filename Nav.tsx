import Link from "next/link";
export default function Nav(){
  return <header className="nav">
    <Link className="logo" href="/"><span className="logo-mark">Im</span><span className="logo-text">IMMANUEL<br/>CHURCH</span></Link>
    <nav className="nav-links">
      <Link href="/">홈</Link><Link href="/way">임마누엘의 길</Link><Link href="/services">교회 서비스</Link><Link href="/content">콘텐츠</Link><Link href="/about">소개</Link>
    </nav>
  </header>
}
