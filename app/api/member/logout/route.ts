import { memberTokenFromRequest, MEMBER_COOKIE, removeMemberSession, sameOrigin } from "@/lib/member-auth";

export async function POST(request: Request) {
  if (!sameOrigin(request)) return Response.json({ error: "올바르지 않은 요청입니다." }, { status: 403 });
  await removeMemberSession(memberTokenFromRequest(request));
  const response = Response.json({ ok: true });
  response.headers.append("Set-Cookie", `${MEMBER_COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`);
  return response;
}
