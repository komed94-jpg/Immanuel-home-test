import { and, eq, gt, isNull } from "drizzle-orm";
import { getDb } from "@/db";
import { memberPasswordResetTokens, memberSessions, members } from "@/db/schema";
import { hashPassword, sameOrigin, tokenHash, validPassword } from "@/lib/member-auth";

export async function POST(request: Request) {
  if (!sameOrigin(request)) return Response.json({ error: "올바르지 않은 요청입니다." }, { status: 403 });
  const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
  const token = typeof body.token === "string" ? body.token : ""; const password = typeof body.password === "string" ? body.password : "";
  if (token.length < 30 || !validPassword(password)) return Response.json({ error: "재설정 주소와 10자 이상 비밀번호를 확인해 주세요." }, { status: 400 });
  const db = getDb();
  const [reset] = await db.select({ id: memberPasswordResetTokens.id, memberId: memberPasswordResetTokens.memberId }).from(memberPasswordResetTokens).where(and(eq(memberPasswordResetTokens.tokenHash, tokenHash(token)), gt(memberPasswordResetTokens.expiresAt, new Date()), isNull(memberPasswordResetTokens.usedAt))).limit(1);
  if (!reset) return Response.json({ error: "재설정 주소가 만료되었거나 이미 사용되었습니다." }, { status: 410 });
  const now = new Date();
  await db.update(members).set({ passwordHash: hashPassword(password), updatedAt: now }).where(eq(members.id, reset.memberId));
  await db.update(memberPasswordResetTokens).set({ usedAt: now }).where(eq(memberPasswordResetTokens.id, reset.id));
  await db.delete(memberSessions).where(eq(memberSessions.memberId, reset.memberId));
  return Response.json({ ok: true });
}
