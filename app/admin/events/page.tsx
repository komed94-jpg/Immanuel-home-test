import type { Metadata } from "next";
import Link from "next/link";
import { Layout } from "@/components/Layout";
import { requireImmanuelAdmin } from "@/app/chatgpt-auth";
import { EventManager } from "./EventManager";

export const metadata: Metadata = { title: "행사 신청 관리 | 임마누엘교회", robots: { index: false, follow: false } };
export default async function AdminEventsPage() { await requireImmanuelAdmin("/admin/events"); return <Layout><section className="admin-hero"><div><Link href="/admin" className="back-link">관리자</Link><p className="section-kicker">EVENT REGISTRATION</p><h1>행사 신청 관리</h1><p>공개 범위부터 신청·대기·출석·참가 이력까지 한곳에서 관리합니다.</p></div></section><section className="admin-session-bar"><span>관리자 모드로 접속했습니다.</span><Link href="/events">행사 페이지 보기</Link></section><EventManager /></Layout>; }
