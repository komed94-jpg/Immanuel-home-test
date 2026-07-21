import { getMemberFromRequest, isAdminMember } from "@/lib/member-auth";

export async function GET(request: Request) {
  const member = await getMemberFromRequest(request);
  return Response.json({ authenticated: Boolean(member), isAdmin: isAdminMember(member), member });
}
