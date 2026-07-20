import { ADMIN_COOKIE } from "@/app/chatgpt-auth";

export async function POST() {
  const response = Response.json({ ok: true });
  response.headers.append("Set-Cookie", `${ADMIN_COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`);
  return response;
}
