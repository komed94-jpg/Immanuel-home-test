import type { Metadata } from "next";
import Link from "next/link";
import { Layout } from "@/components/Layout";
import { requireImmanuelAdmin } from "@/app/chatgpt-auth";
import { RequestInbox } from "@/app/admin/requests/RequestInbox";

export const metadata: Metadata = {
  title: "비공개 요청함 | 임마누엘교회",
  robots: { index: false, follow: false }
};

export default async function RequestAdminPage() {
  await requireImmanuelAdmin("/admin/requests");

  return (
    <Layout>
      <section className="admin-hero">
        <div>
          <Link href="/services" className="back-link">교회 서비스</Link>
          <p className="section-kicker">PRIVATE INBOX</p>
          <h1>비공개 요청함</h1>
          <p>사역 요청과 훈련 신청, 공동체 연결 접수 내용을 확인합니다.</p>
        </div>
      </section>
      <RequestInbox />
    </Layout>
  );
}
