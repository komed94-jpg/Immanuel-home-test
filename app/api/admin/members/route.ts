import { and, desc, eq, isNull, sql } from "drizzle-orm";
import { isImmanuelAdminRequest } from "@/app/chatgpt-auth";
import { getDb } from "@/db";
import { householdMembers, households, memberApprovalLogs, memberNumberCounters, memberSessions, members, ministryRequests, newFamilyRegistrations } from "@/db/schema";
import { sameOrigin } from "@/lib/member-auth";

const allowedRoles = new Set(["member", "leader", "staff"]);
const allowedStatuses = new Set(["nonmember", "pending", "active", "inactive", "long_absent", "transferred", "withdrawn", "deceased"]);
const allowedReviewStatuses = new Set(["received", "reviewing", "needs_update", "on_hold", "rejected", "approved"]);
const allowedRelationships = new Set(["본인", "배우자", "자녀", "부모", "형제자매", "기타"]);
function clean(value: unknown, max: number) { return typeof value === "string" ? value.trim().slice(0, max) : ""; }

export async function GET(request: Request) {
  if (!await isImmanuelAdminRequest(request)) return Response.json({ error: "권한이 없습니다." }, { status: 403 });
  const db = getDb();
  const [rows, registrations, familyRows, logs, unlinked] = await Promise.all([
    db.select({ id: members.id, name: members.name, email: members.email, phone: members.phone, birthDate: members.birthDate, accountStatus: members.accountStatus, membershipStatus: members.membershipStatus, role: members.role, memberNumber: members.memberNumber, registrationCategory: members.registrationCategory, address: members.address, occupation: members.occupation, currentDepartment: members.currentDepartment, faithYears: members.faithYears, baptismType: members.baptismType, baptismChurch: members.baptismChurch, previousChurchName: members.previousChurchName, previousChurchPosition: members.previousChurchPosition, serviceHistory: members.serviceHistory, pastoralNote: members.pastoralNote, approvedAt: members.approvedAt, createdAt: members.createdAt }).from(members).orderBy(desc(members.createdAt), desc(members.id)).limit(1000),
    db.select().from(newFamilyRegistrations).orderBy(desc(newFamilyRegistrations.createdAt), desc(newFamilyRegistrations.id)).limit(1500),
    db.select({ linkId: householdMembers.id, householdId: households.id, householdName: households.name, memberId: householdMembers.memberId, relationship: householdMembers.relationship, isPrimary: householdMembers.isPrimary, memberName: members.name, memberNumber: members.memberNumber }).from(householdMembers).innerJoin(households, eq(householdMembers.householdId, households.id)).innerJoin(members, eq(householdMembers.memberId, members.id)).orderBy(households.id, desc(householdMembers.isPrimary), members.name),
    db.select().from(memberApprovalLogs).orderBy(desc(memberApprovalLogs.createdAt), desc(memberApprovalLogs.id)).limit(2000),
    db.select({ id: newFamilyRegistrations.id, requestId: newFamilyRegistrations.requestId, cardType: newFamilyRegistrations.cardType, reviewStatus: newFamilyRegistrations.reviewStatus, createdAt: newFamilyRegistrations.createdAt, name: ministryRequests.name, contact: ministryRequests.contact, email: newFamilyRegistrations.email }).from(newFamilyRegistrations).innerJoin(ministryRequests, eq(newFamilyRegistrations.requestId, ministryRequests.id)).where(sql`${newFamilyRegistrations.memberId} is null`).orderBy(desc(newFamilyRegistrations.createdAt)).limit(100),
  ]);
  const registrationMap = new Map<number, typeof registrations[number]>();
  for (const item of registrations) { if (!item.memberId) continue; const current = registrationMap.get(item.memberId); if (!current || (current.cardType !== "registration" && item.cardType === "registration")) registrationMap.set(item.memberId, item); }
  const familyByMember = new Map<number, typeof familyRows>(); const familyByHousehold = new Map<number, typeof familyRows>();
  for (const item of familyRows) { const group = familyByHousehold.get(item.householdId) ?? []; group.push(item); familyByHousehold.set(item.householdId, group); }
  for (const item of familyRows) familyByMember.set(item.memberId, familyByHousehold.get(item.householdId) ?? []);
  const logMap = new Map<number, typeof logs[number]>(); for (const item of logs) if (!logMap.has(item.memberId)) logMap.set(item.memberId, item);
  return Response.json({ members: rows.map((item) => ({ ...item, registration: registrationMap.get(item.id) ?? null, family: familyByMember.get(item.id) ?? [], latestLog: logMap.get(item.id) ?? null })), unlinkedRegistrations: unlinked });
}

export async function PATCH(request: Request) {
  if (!await isImmanuelAdminRequest(request)) return Response.json({ error: "권한이 없습니다." }, { status: 403 });
  if (!sameOrigin(request)) return Response.json({ error: "올바르지 않은 요청입니다." }, { status: 403 });
  const body = (await request.json().catch(() => ({}))) as Record<string, unknown>; const id = Number(body.id); const action = clean(body.action, 40);
  if (!Number.isInteger(id) || id < 1) return Response.json({ error: "회원을 확인해 주세요." }, { status: 400 });
  const db = getDb();
  const [current] = await db.select({ id: members.id, name: members.name, memberNumber: members.memberNumber, membershipStatus: members.membershipStatus }).from(members).where(eq(members.id, id)).limit(1);
  if (!current) return Response.json({ error: "회원을 찾지 못했습니다." }, { status: 404 });

  if (action === "approve") {
    const category = Number(body.category); const approvalNote = clean(body.approvalNote, 500);
    if (![1, 2, 3].includes(category)) return Response.json({ error: "등록 구분을 선택해 주세요." }, { status: 400 });
    if (current.memberNumber) return Response.json({ error: "이미 교인번호가 발급된 회원입니다." }, { status: 409 });
    const [registration] = await db.select({ id: newFamilyRegistrations.id }).from(newFamilyRegistrations).where(and(eq(newFamilyRegistrations.memberId, id), eq(newFamilyRegistrations.cardType, "registration"))).orderBy(desc(newFamilyRegistrations.createdAt)).limit(1);
    if (!registration && approvalNote.length < 5) return Response.json({ error: "등록카드 없이 승인할 때는 기존 교인 확인 근거를 입력해 주세요." }, { status: 400 });
    const year = Number(new Intl.DateTimeFormat("en", { timeZone: "Asia/Seoul", year: "numeric" }).format(new Date()));
    const [counter] = await db.insert(memberNumberCounters).values({ registrationYear: year, category, lastNumber: 1 }).onConflictDoUpdate({ target: [memberNumberCounters.registrationYear, memberNumberCounters.category], set: { lastNumber: sql`${memberNumberCounters.lastNumber} + 1` } }).returning({ lastNumber: memberNumberCounters.lastNumber });
    const memberNumber = `${year}-${category}-${String(counter.lastNumber).padStart(4, "0")}`; const now = new Date();
    const [updated] = await db.update(members).set({ membershipStatus: "active", memberNumber, registrationCategory: category, approvedAt: now, updatedAt: now }).where(and(eq(members.id, id), isNull(members.memberNumber))).returning({ id: members.id, memberNumber: members.memberNumber });
    if (!updated) return Response.json({ error: "다른 요청에서 이미 교인번호가 발급되었습니다. 목록을 새로 확인해 주세요." }, { status: 409 });
    if (registration) await db.update(newFamilyRegistrations).set({ reviewStatus: "approved", reviewNote: approvalNote || null, reviewedAt: now, updatedAt: now }).where(eq(newFamilyRegistrations.id, registration.id));
    await db.insert(memberApprovalLogs).values({ memberId: id, action: "approve", previousValue: current.membershipStatus, newValue: `active:${memberNumber}`, note: approvalNote || null });
    return Response.json({ member: updated });
  }

  if (action === "link-registration") {
    const registrationId = Number(body.registrationId); if (!Number.isInteger(registrationId)) return Response.json({ error: "등록카드를 확인해 주세요." }, { status: 400 });
    const [registration] = await db.select({ memberId: newFamilyRegistrations.memberId, cardType: newFamilyRegistrations.cardType, requestId: newFamilyRegistrations.requestId, address: newFamilyRegistrations.address, occupation: newFamilyRegistrations.occupation, faithYears: newFamilyRegistrations.faithYears, ordinanceType: newFamilyRegistrations.ordinanceType, ordinanceChurch: newFamilyRegistrations.ordinanceChurch, previousChurchName: newFamilyRegistrations.previousChurchName, churchPosition: newFamilyRegistrations.churchPosition, serviceHistory: newFamilyRegistrations.serviceHistory }).from(newFamilyRegistrations).where(eq(newFamilyRegistrations.id, registrationId)).limit(1);
    if (!registration || registration.memberId) return Response.json({ error: "이미 연결되었거나 찾을 수 없는 등록카드입니다." }, { status: 409 });
    await db.update(newFamilyRegistrations).set({ memberId: id, updatedAt: new Date() }).where(eq(newFamilyRegistrations.id, registrationId)); await db.update(ministryRequests).set({ memberId: id }).where(eq(ministryRequests.id, registration.requestId));
    if (registration.cardType === "registration") await db.update(members).set({ membershipStatus: current.membershipStatus === "nonmember" ? "pending" : current.membershipStatus, address: registration.address, occupation: registration.occupation, faithYears: registration.faithYears, baptismType: registration.ordinanceType, baptismChurch: registration.ordinanceChurch, previousChurchName: registration.previousChurchName, previousChurchPosition: registration.churchPosition, serviceHistory: registration.serviceHistory, updatedAt: new Date() }).where(eq(members.id, id));
    await db.insert(memberApprovalLogs).values({ memberId: id, action: "link-registration", newValue: String(registrationId) }); return Response.json({ ok: true });
  }

  if (action === "registration-review") {
    const registrationId = Number(body.registrationId); const reviewStatus = clean(body.reviewStatus, 30); const reviewNote = clean(body.reviewNote, 1000);
    if (!Number.isInteger(registrationId) || !allowedReviewStatuses.has(reviewStatus)) return Response.json({ error: "등록카드 검토 상태를 확인해 주세요." }, { status: 400 });
    if (["needs_update", "on_hold", "rejected"].includes(reviewStatus) && reviewNote.length < 3) return Response.json({ error: "신청자에게 안내할 사유를 입력해 주세요." }, { status: 400 });
    const [updated] = await db.update(newFamilyRegistrations).set({ reviewStatus, reviewNote: reviewNote || null, reviewedAt: new Date(), updatedAt: new Date() }).where(and(eq(newFamilyRegistrations.id, registrationId), eq(newFamilyRegistrations.memberId, id))).returning({ id: newFamilyRegistrations.id });
    if (!updated) return Response.json({ error: "등록카드를 찾지 못했습니다." }, { status: 404 });
    if (reviewStatus === "rejected" && !current.memberNumber) await db.update(members).set({ membershipStatus: "nonmember", updatedAt: new Date() }).where(eq(members.id, id));
    await db.insert(memberApprovalLogs).values({ memberId: id, action: "registration-review", newValue: reviewStatus, note: reviewNote || null }); return Response.json({ ok: true });
  }

  if (action === "registry") {
    await db.update(members).set({ address: clean(body.address, 240) || null, occupation: clean(body.occupation, 200) || null, currentDepartment: clean(body.currentDepartment, 120) || null, faithYears: clean(body.faithYears, 80) || null, baptismType: clean(body.baptismType, 80) || null, baptismChurch: clean(body.baptismChurch, 200) || null, previousChurchName: clean(body.previousChurchName, 200) || null, previousChurchPosition: clean(body.previousChurchPosition, 120) || null, serviceHistory: clean(body.serviceHistory, 1000) || null, pastoralNote: clean(body.pastoralNote, 2000) || null, updatedAt: new Date() }).where(eq(members.id, id));
    await db.insert(memberApprovalLogs).values({ memberId: id, action: "registry-update", note: "교적 정보 수정" }); return Response.json({ ok: true });
  }

  if (action === "family-link") {
    const relatedMemberId = Number(body.relatedMemberId); const relationship = clean(body.relationship, 30);
    if (!Number.isInteger(relatedMemberId) || relatedMemberId === id || !allowedRelationships.has(relationship)) return Response.json({ error: "가족 구성원과 관계를 확인해 주세요." }, { status: 400 });
    const [primaryLink] = await db.select().from(householdMembers).where(eq(householdMembers.memberId, id)).limit(1); const [relatedLink] = await db.select().from(householdMembers).where(eq(householdMembers.memberId, relatedMemberId)).limit(1);
    if (relatedLink && relatedLink.householdId !== primaryLink?.householdId) return Response.json({ error: "선택한 교인은 이미 다른 가정에 연결되어 있습니다." }, { status: 409 });
    let householdId = primaryLink?.householdId;
    if (!householdId) { const [household] = await db.insert(households).values({ name: `${current.name} 가정` }).returning({ id: households.id }); householdId = household.id; await db.insert(householdMembers).values({ householdId, memberId: id, relationship: "본인", isPrimary: true }); }
    if (!relatedLink) await db.insert(householdMembers).values({ householdId, memberId: relatedMemberId, relationship }); else await db.update(householdMembers).set({ relationship }).where(eq(householdMembers.memberId, relatedMemberId));
    await db.insert(memberApprovalLogs).values({ memberId: id, action: "family-link", newValue: String(relatedMemberId), note: relationship }); return Response.json({ ok: true });
  }

  if (action === "family-remove") {
    const relatedMemberId = Number(body.relatedMemberId); const [link] = await db.select().from(householdMembers).where(eq(householdMembers.memberId, id)).limit(1); const [target] = await db.select().from(householdMembers).where(eq(householdMembers.memberId, relatedMemberId)).limit(1);
    if (!link || !target || link.householdId !== target.householdId || target.isPrimary) return Response.json({ error: "가족 연결을 확인해 주세요." }, { status: 400 });
    await db.delete(householdMembers).where(eq(householdMembers.memberId, relatedMemberId)); await db.insert(memberApprovalLogs).values({ memberId: id, action: "family-remove", previousValue: String(relatedMemberId) }); return Response.json({ ok: true });
  }

  if (action === "role") { const role = clean(body.role, 30); if (!allowedRoles.has(role)) return Response.json({ error: "권한을 확인해 주세요." }, { status: 400 }); await db.update(members).set({ role, updatedAt: new Date() }).where(eq(members.id, id)); await db.insert(memberApprovalLogs).values({ memberId: id, action: "role", newValue: role }); return Response.json({ ok: true }); }
  if (action === "status") { const status = clean(body.status, 30); if (!allowedStatuses.has(status)) return Response.json({ error: "교인 상태를 확인해 주세요." }, { status: 400 }); if (status === "active" && !current.memberNumber) return Response.json({ error: "교인 등록 승인 버튼으로 교인번호를 먼저 발급해 주세요." }, { status: 400 }); await db.update(members).set({ membershipStatus: status, updatedAt: new Date() }).where(eq(members.id, id)); await db.insert(memberApprovalLogs).values({ memberId: id, action: "status", previousValue: current.membershipStatus, newValue: status }); return Response.json({ ok: true }); }
  if (action === "account") { const accountStatus = body.accountStatus === "suspended" ? "suspended" : body.accountStatus === "active" ? "active" : ""; if (!accountStatus) return Response.json({ error: "계정 상태를 확인해 주세요." }, { status: 400 }); await db.update(members).set({ accountStatus, updatedAt: new Date() }).where(eq(members.id, id)); if (accountStatus === "suspended") await db.delete(memberSessions).where(eq(memberSessions.memberId, id)); await db.insert(memberApprovalLogs).values({ memberId: id, action: "account", newValue: accountStatus }); return Response.json({ ok: true }); }
  return Response.json({ error: "처리할 작업을 확인해 주세요." }, { status: 400 });
}
