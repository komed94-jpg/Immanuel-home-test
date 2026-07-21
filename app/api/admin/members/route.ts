import { desc, eq, sql } from "drizzle-orm";
import { isImmanuelAdminRequest } from "@/app/chatgpt-auth";
import { getDb } from "@/db";
import { members, memberNumberCounters } from "@/db/schema";

const allowedRoles = new Set(["member", "leader", "staff"]);
const allowedStatuses = new Set(["nonmember", "pending", "active", "inactive"]);

export async function GET(request: Request) {
  if (!isImmanuelAdminRequest(request)) return Response.json({ error: "권한이 없습니다." }, { status: 403 });
  const rows = await getDb().select({
    id: members.id, name: members.name, email: members.email, phone: members.phone, birthDate: members.birthDate,
    accountStatus: members.accountStatus, membershipStatus: members.membershipStatus, role: members.role,
    memberNumber: members.memberNumber, registrationCategory: members.registrationCategory,
    approvedAt: members.approvedAt, createdAt: members.createdAt,
  }).from(members).orderBy(desc(members.createdAt), desc(members.id)).limit(500);
  return Response.json({ members: rows });
}

export async function PATCH(request: Request) {
  if (!isImmanuelAdminRequest(request)) return Response.json({ error: "권한이 없습니다." }, { status: 403 });
  const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
  const id = Number(body.id);
  const action = typeof body.action === "string" ? body.action : "";
  if (!Number.isInteger(id) || id < 1) return Response.json({ error: "회원을 확인해 주세요." }, { status: 400 });

  const db = getDb();
  const [current] = await db.select({ id: members.id, memberNumber: members.memberNumber }).from(members).where(eq(members.id, id)).limit(1);
  if (!current) return Response.json({ error: "회원을 찾지 못했습니다." }, { status: 404 });

  if (action === "approve") {
    const category = Number(body.category);
    if (![1, 2, 3].includes(category)) return Response.json({ error: "등록 구분을 선택해 주세요." }, { status: 400 });
    if (current.memberNumber) return Response.json({ error: "이미 교인번호가 발급된 회원입니다." }, { status: 409 });
    const year = Number(new Intl.DateTimeFormat("en", { timeZone: "Asia/Seoul", year: "numeric" }).format(new Date()));
    const [counter] = await db.insert(memberNumberCounters).values({ registrationYear: year, category, lastNumber: 1 })
      .onConflictDoUpdate({ target: [memberNumberCounters.registrationYear, memberNumberCounters.category], set: { lastNumber: sql`${memberNumberCounters.lastNumber} + 1` } })
      .returning({ lastNumber: memberNumberCounters.lastNumber });
    const memberNumber = `${year}-${category}-${String(counter.lastNumber).padStart(4, "0")}`;
    const [updated] = await db.update(members).set({ membershipStatus: "active", memberNumber, registrationCategory: category, approvedAt: new Date(), updatedAt: new Date() }).where(eq(members.id, id)).returning({ id: members.id, memberNumber: members.memberNumber });
    return Response.json({ member: updated });
  }

  if (action === "role") {
    const role = typeof body.role === "string" ? body.role : "";
    if (!allowedRoles.has(role)) return Response.json({ error: "권한을 확인해 주세요." }, { status: 400 });
    await db.update(members).set({ role, updatedAt: new Date() }).where(eq(members.id, id));
    return Response.json({ ok: true });
  }

  if (action === "status") {
    const status = typeof body.status === "string" ? body.status : "";
    if (!allowedStatuses.has(status)) return Response.json({ error: "교인 상태를 확인해 주세요." }, { status: 400 });
    if (status === "active" && !current.memberNumber) {
      return Response.json({ error: "교인 등록 승인 버튼으로 교인번호를 먼저 발급해 주세요." }, { status: 400 });
    }
    await db.update(members).set({ membershipStatus: status, updatedAt: new Date() }).where(eq(members.id, id));
    return Response.json({ ok: true });
  }

  if (action === "account") {
    const accountStatus = body.accountStatus === "suspended" ? "suspended" : body.accountStatus === "active" ? "active" : "";
    if (!accountStatus) return Response.json({ error: "계정 상태를 확인해 주세요." }, { status: 400 });
    await db.update(members).set({ accountStatus, updatedAt: new Date() }).where(eq(members.id, id));
    return Response.json({ ok: true });
  }

  return Response.json({ error: "처리할 작업을 확인해 주세요." }, { status: 400 });
}
