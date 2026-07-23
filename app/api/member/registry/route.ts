import { desc, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { householdMembers, households, members, newFamilyJourneys, newFamilyRegistrations } from "@/db/schema";
import { getMemberFromRequest } from "@/lib/member-auth";
export async function GET(request: Request) {
  const current = await getMemberFromRequest(request); if (!current) return Response.json({ error: "로그인이 필요합니다." }, { status: 401 }); const db = getDb();
  const [registration] = await db.select({ id: newFamilyRegistrations.id, cardType: newFamilyRegistrations.cardType, reviewStatus: newFamilyRegistrations.reviewStatus, reviewNote: newFamilyRegistrations.reviewNote, createdAt: newFamilyRegistrations.createdAt, reviewedAt: newFamilyRegistrations.reviewedAt, journeyStage: newFamilyJourneys.stage, journeyStatus: newFamilyJourneys.journeyStatus, assignee: newFamilyJourneys.assignee, nextActionOn: newFamilyJourneys.nextActionOn, smallGroupName: newFamilyJourneys.smallGroupName, educationProgress: newFamilyJourneys.educationProgress }).from(newFamilyRegistrations).leftJoin(newFamilyJourneys, eq(newFamilyJourneys.registrationId, newFamilyRegistrations.id)).where(eq(newFamilyRegistrations.memberId, current.id)).orderBy(desc(newFamilyRegistrations.createdAt)).limit(1);
  const [link] = await db.select({ householdId: householdMembers.householdId }).from(householdMembers).where(eq(householdMembers.memberId, current.id)).limit(1);
  const family = link ? await db.select({ id: members.id, name: members.name, memberNumber: members.memberNumber, relationship: householdMembers.relationship, householdName: households.name }).from(householdMembers).innerJoin(members, eq(householdMembers.memberId, members.id)).innerJoin(households, eq(householdMembers.householdId, households.id)).where(eq(householdMembers.householdId, link.householdId)).orderBy(members.name) : [];
  return Response.json({ registration: registration ?? null, family });
}
