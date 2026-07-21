import { createHash } from "node:crypto";
import { eq, or } from "drizzle-orm";
import { getDb } from "@/db";
import { memberLoginAttempts, members } from "@/db/schema";
import { createMemberSession, MEMBER_COOKIE, normalizeEmail, normalizePhone, sameOrigin, verifyPassword } from "@/lib/member-auth";

export async function POST(request: Request) {
  if (!sameOrigin(request)) return Response.json({ error: "올바르지 않은 요청입니다." }, { status: 403 });
  const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
  const login = typeof body.login === "string" ? body.login.trim() : "";
  const password = typeof body.password === "string" ? body.password : "";
  const email = normalizeEmail(login);
  const phone = normalizePhone(login);
  const identifierHash = createHash("sha256").update(email || phone).digest("hex");
  const db = getDb();
  const [attempt] = await db.select().from(memberLoginAttempts).where(eq(memberLoginAttempts.identifierHash, identifierHash)).limit(1);
  const now = new Date();
  if (attempt?.blockedUntil && attempt.blockedUntil > now) {
    return Response.json({ error: "로그인 시도가 많습니다. 15분 후 다시 시도해 주세요." }, { status: 429 });
  }

  const [member] = await db.select({ id: members.id, passwordHash: members.passwordHash, accountStatus: members.accountStatus }).from(members).where(or(eq(members.email, email), eq(members.phone, phone))).limit(1);
  if (!member || member.accountStatus !== "active" || !verifyPassword(password, member.passwordHash)) {
    const expiredWindow = !attempt || now.getTime() - attempt.windowStartedAt.getTime() > 15 * 60 * 1000;
    const attempts = expiredWindow ? 1 : attempt.attempts + 1;
    await db.insert(memberLoginAttempts).values({ identifierHash, attempts, windowStartedAt: expiredWindow ? now : attempt.windowStartedAt, blockedUntil: attempts >= 5 ? new Date(now.getTime() + 15 * 60 * 1000) : null, updatedAt: now })
      .onConflictDoUpdate({ target: memberLoginAttempts.identifierHash, set: { attempts, windowStartedAt: expiredWindow ? now : attempt.windowStartedAt, blockedUntil: attempts >= 5 ? new Date(now.getTime() + 15 * 60 * 1000) : null, updatedAt: now } });
    return Response.json({ error: "로그인 정보를 확인해 주세요." }, { status: 401 });
  }
  await db.delete(memberLoginAttempts).where(eq(memberLoginAttempts.identifierHash, identifierHash));
  const session = await createMemberSession(member.id);
  const response = Response.json({ ok: true });
  response.headers.append("Set-Cookie", `${MEMBER_COOKIE}=${encodeURIComponent(session.token)}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${session.maxAge}`);
  return response;
}
