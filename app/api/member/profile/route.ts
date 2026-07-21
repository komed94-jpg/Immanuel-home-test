import { eq, or } from "drizzle-orm";
import { getDb } from "@/db";
import { members } from "@/db/schema";
import { getMemberFromRequest, normalizeEmail, normalizePhone, sameOrigin } from "@/lib/member-auth";

export async function PATCH(request: Request) {
  if (!sameOrigin(request)) return Response.json({ error: "올바르지 않은 요청입니다." }, { status: 403 });
  const current = await getMemberFromRequest(request);
  if (!current) return Response.json({ error: "로그인이 필요합니다." }, { status: 401 });
  const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
  const name = typeof body.name === "string" ? body.name.trim().slice(0, 80) : "";
  const email = normalizeEmail(body.email);
  const phone = normalizePhone(body.phone);
  if (!name || !email.includes("@") || phone.length < 10) return Response.json({ error: "회원 정보를 확인해 주세요." }, { status: 400 });
  const [duplicate] = await getDb().select({ id: members.id }).from(members).where(or(eq(members.email, email), eq(members.phone, phone))).limit(1);
  if (duplicate && duplicate.id !== current.id) return Response.json({ error: "이미 사용 중인 이메일 또는 전화번호입니다." }, { status: 409 });
  await getDb().update(members).set({ name, email, phone, updatedAt: new Date() }).where(eq(members.id, current.id));
  return Response.json({ ok: true });
}
