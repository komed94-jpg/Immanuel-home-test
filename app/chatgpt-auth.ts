import { redirect } from "next/navigation";
import { getCurrentMember, getMemberFromRequest, isAdminMember } from "@/lib/member-auth";

export async function isImmanuelAdminRequest(request: Request) {
  return isAdminMember(await getMemberFromRequest(request));
}

export async function requireImmanuelAdmin(returnTo: string) {
  const member = await getCurrentMember();
  if (!member) redirect(`/login?returnTo=${encodeURIComponent(returnTo)}`);
  if (!isAdminMember(member)) redirect("/member?notice=관리자만%20접근할%20수%20있습니다.");
  return member;
}

export async function hasAdminSession() {
  return isAdminMember(await getCurrentMember());
}
