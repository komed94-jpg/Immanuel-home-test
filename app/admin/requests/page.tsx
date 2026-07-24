import type { Metadata } from "next";
import Link from "next/link";
import { Layout } from "@/components/Layout";
import { requireImmanuelAdmin } from "@/app/chatgpt-auth";
import { RequestInbox } from "@/app/admin/requests/RequestInbox";

export const metadata: Metadata = {
  title: "비공개 요청함 | 임마누엘교회",
  robots: { index: false, follow: false }
};

const requestTypes = new Set(["prayer", "counseling", "new-family", "spirit-ministry", "bible-conference", "discipleship", "community", "event"]);

export default async function RequestAdminPage({ searchParams }: { searchParams: Promise<{ type?: string }> }) {
  await requireImmanuelAdmin("/admin/requests");
  const params = await searchParams;
  const initialType = requestTypes.has(params.type ?? "") ? params.type as "prayer" | "counseling" | "new-family" | "spirit-ministry" | "bible-conference" | "discipleship" | "community" | "event" : "prayer";
  const newFamilyMode = initialType === "new-family";

  return (
    <Layout>
      <section className="admin-hero">
        <div>
          <Link href={newFamilyMode ? "/admin/new-family" : "/admin"} className="back-link">{newFamilyMode ? "새가족 정착 관리" : "관리자"}</Link>
          <p className="section-kicker">{newFamilyMode ? "NEW FAMILY CARDS" : "PRIVATE INBOX"}</p>
          <h1>{newFamilyMode ? "새가족 접수 카드" : "비공개 요청함"}</h1>
          <p>{newFamilyMode ? "방문카드와 등록카드의 상세 내용을 검토하고 처리 상태를 관리합니다." : "사역 요청과 훈련 신청, 공동체 연결 접수 내용을 확인합니다."}</p>
        </div>
      </section>
      {newFamilyMode && <nav className="new-family-admin-links" aria-label="새가족 관리자 기능">
        <Link href="/admin/new-family"><small>CARE & MESSAGE</small><strong>정착 관리 · AI 첫 연락</strong></Link>
        <Link className="is-active" href="/admin/requests?type=new-family"><small>REGISTRATION CARDS</small><strong>새가족 접수 카드</strong></Link>
        <Link href="/admin/members"><small>MEMBER APPROVAL</small><strong>교인 승인 · 교인번호</strong></Link>
      </nav>}
      <RequestInbox initialType={initialType} />
    </Layout>
  );
}
