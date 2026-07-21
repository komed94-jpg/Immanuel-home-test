import { and, desc, eq, gt } from "drizzle-orm";
import { getDb } from "@/db";
import { memberPasswordResetTokens, members } from "@/db/schema";
import { createOpaqueToken, normalizeEmail, sameOrigin, tokenHash } from "@/lib/member-auth";
import { sendPasswordResetEmail } from "@/lib/member-email";

const GENERIC_MESSAGE = "가입된 이메일이라면 비밀번호 재설정 안내를 보냈습니다.";
export async function POST(request: Request) {
  if (!sameOrigin(request)) return Response.json({ error: "올바르지 않은 요청입니다." }, { status: 403 });
  const body = (await request.json().catch(() => ({}))) as Record<string, unknown>; const email = normalizeEmail(body.email);
  if (!email.includes("@")) return Response.json({ error: "이메일을 확인해 주세요." }, { status: 400 });
  const db = getDb();
  const [member] = await db.select({ id: members.id, name: members.name, email: members.email, accountStatus: members.accountStatus }).from(members).where(eq(members.email, email)).limit(1);
  if (!member || member.accountStatus !== "active") return Response.json({ ok: true, message: GENERIC_MESSAGE });
  const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
  const [recent] = await db.select({ id: memberPasswordResetTokens.id }).from(memberPasswordResetTokens).where(and(eq(memberPasswordResetTokens.memberId, member.id), gt(memberPasswordResetTokens.createdAt, tenMinutesAgo))).orderBy(desc(memberPasswordResetTokens.createdAt)).limit(1);
  if (recent) return Response.json({ ok: true, message: GENERIC_MESSAGE });
  const token = createOpaqueToken();
  await db.insert(memberPasswordResetTokens).values({ memberId: member.id, tokenHash: tokenHash(token), expiresAt: new Date(Date.now() + 30 * 60 * 1000) });
  const resetUrl = `${new URL(request.url).origin}/reset-password?token=${encodeURIComponent(token)}`;
  const delivery = await sendPasswordResetEmail({ email: member.email, name: member.name, resetUrl }).catch(() => ({ configured: true, sent: false }));
  return Response.json({ ok: true, message: GENERIC_MESSAGE, emailConfigured: delivery.configured });
}
