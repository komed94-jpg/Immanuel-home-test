import { or, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { members } from "@/db/schema";
import { createMemberSession, hashPassword, MEMBER_COOKIE, normalizeEmail, normalizePhone, sameOrigin, validPassword } from "@/lib/member-auth";

function clean(value: unknown, max: number) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export async function POST(request: Request) {
  if (!sameOrigin(request)) return Response.json({ error: "올바르지 않은 요청입니다." }, { status: 403 });
  const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
  const name = clean(body.name, 80);
  const email = normalizeEmail(body.email);
  const phone = normalizePhone(body.phone);
  const birthDate = clean(body.birthDate, 20);
  const password = typeof body.password === "string" ? body.password : "";
  const consented = body.consented === true;

  if (!name || !email || !email.includes("@") || phone.length < 10 || !/^\d{4}-\d{2}-\d{2}$/.test(birthDate) || !validPassword(password) || !consented) {
    return Response.json({ error: "이름, 이메일, 전화번호, 생년월일, 10자 이상 비밀번호와 개인정보 동의를 확인해 주세요." }, { status: 400 });
  }

  const [duplicate] = await getDb().select({ id: members.id }).from(members).where(or(eq(members.email, email), eq(members.phone, phone))).limit(1);
  if (duplicate) return Response.json({ error: "이미 가입된 이메일 또는 전화번호입니다." }, { status: 409 });

  const [member] = await getDb().insert(members).values({ name, email, phone, birthDate, passwordHash: hashPassword(password) }).returning({ id: members.id });
  const session = await createMemberSession(member.id);
  const response = Response.json({ ok: true }, { status: 201 });
  response.headers.append("Set-Cookie", `${MEMBER_COOKIE}=${encodeURIComponent(session.token)}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${session.maxAge}`);
  return response;
}
