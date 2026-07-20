import { ADMIN_COOKIE, adminConfigured, createAdminSession, verifyAdminPassword } from "@/app/chatgpt-auth";

export async function POST(request: Request) {
  if (!adminConfigured()) return Response.json({ error: "관리자 환경변수 설정이 필요합니다." }, { status: 503 });
  const body = (await request.json().catch(() => ({}))) as { password?: string };
  if (!verifyAdminPassword(String(body.password ?? ""))) return Response.json({ error: "비밀번호가 올바르지 않습니다." }, { status: 401 });
  const response = Response.json({ ok: true });
  response.headers.append("Set-Cookie", `${ADMIN_COOKIE}=${encodeURIComponent(createAdminSession())}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=28800`);
  return response;
}
