import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { memberSessions, members } from "@/db/schema";
import { createMemberSession, getMemberFromRequest, hashPassword, MEMBER_COOKIE, sameOrigin, validPassword, verifyPassword } from "@/lib/member-auth";

export async function PATCH(request: Request) {
  if (!sameOrigin(request)) return Response.json({ error: "올바르지 않은 요청입니다." }, { status: 403 });
  const current = await getMemberFromRequest(request);
  if (!current) return Response.json({ error: "로그인이 필요합니다." }, { status: 401 });
  const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
  const currentPassword = typeof body.currentPassword === "string" ? body.currentPassword : "";
  const newPassword = typeof body.newPassword === "string" ? body.newPassword : "";
  if (!validPassword(newPassword) || currentPassword === newPassword) return Response.json({ error: "새 비밀번호는 기존과 다르게 10자 이상 입력해 주세요." }, { status: 400 });
  const db = getDb();
  const [member] = await db.select({ passwordHash: members.passwordHash }).from(members).where(eq(members.id, current.id)).limit(1);
  if (!member || !verifyPassword(currentPassword, member.passwordHash)) return Response.json({ error: "현재 비밀번호가 일치하지 않습니다." }, { status: 401 });
  await db.update(members).set({ passwordHash: hashPassword(newPassword), updatedAt: new Date() }).where(eq(members.id, current.id));
  await db.delete(memberSessions).where(eq(memberSessions.memberId, current.id));
  const session = await createMemberSession(current.id);
  const response = Response.json({ ok: true });
  response.headers.append("Set-Cookie", `${MEMBER_COOKIE}=${encodeURIComponent(session.token)}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${session.maxAge}`);
  return response;
}
