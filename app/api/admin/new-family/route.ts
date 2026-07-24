import { asc, desc, eq } from "drizzle-orm";
import { isImmanuelAdminRequest } from "@/app/chatgpt-auth";
import { getDb } from "@/db";
import {
  members,
  ministryRequests,
  newFamilyFollowups,
  newFamilyJourneys,
  newFamilyMessages,
  newFamilyRegistrations,
} from "@/db/schema";
import { sameOrigin } from "@/lib/member-auth";

const stages = new Set(["received", "assigned", "contacted", "consulted", "approved", "connected", "education", "settled"]);
const journeyStatuses = new Set(["active", "on_hold", "completed"]);
const followupTypes = new Set(["call", "message", "visit", "consultation", "group", "education", "note"]);

function clean(value: unknown, max: number) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export async function GET(request: Request) {
  if (!await isImmanuelAdminRequest(request)) return Response.json({ error: "권한이 없습니다." }, { status: 403 });
  const db = getDb();
  const [journeys, followups, messages] = await Promise.all([
    db.select({
      id: newFamilyJourneys.id,
      registrationId: newFamilyJourneys.registrationId,
      memberId: newFamilyJourneys.memberId,
      stage: newFamilyJourneys.stage,
      journeyStatus: newFamilyJourneys.journeyStatus,
      assignee: newFamilyJourneys.assignee,
      firstVisitedOn: newFamilyJourneys.firstVisitedOn,
      visitCount: newFamilyJourneys.visitCount,
      lastContactOn: newFamilyJourneys.lastContactOn,
      lastContactResult: newFamilyJourneys.lastContactResult,
      nextActionOn: newFamilyJourneys.nextActionOn,
      consultationNote: newFamilyJourneys.consultationNote,
      smallGroupName: newFamilyJourneys.smallGroupName,
      educationProgress: newFamilyJourneys.educationProgress,
      settledAt: newFamilyJourneys.settledAt,
      createdAt: newFamilyJourneys.createdAt,
      updatedAt: newFamilyJourneys.updatedAt,
      cardType: newFamilyRegistrations.cardType,
      reviewStatus: newFamilyRegistrations.reviewStatus,
      familyInfo: newFamilyRegistrations.familyInfo,
      participation: newFamilyRegistrations.participation,
      name: ministryRequests.name,
      contact: ministryRequests.contact,
      submittedAt: ministryRequests.submittedAt,
      memberName: members.name,
      memberNumber: members.memberNumber,
    }).from(newFamilyJourneys)
      .innerJoin(newFamilyRegistrations, eq(newFamilyJourneys.registrationId, newFamilyRegistrations.id))
      .innerJoin(ministryRequests, eq(newFamilyRegistrations.requestId, ministryRequests.id))
      .leftJoin(members, eq(newFamilyJourneys.memberId, members.id))
      .orderBy(asc(newFamilyJourneys.nextActionOn), desc(newFamilyJourneys.updatedAt))
      .limit(1500),
    db.select().from(newFamilyFollowups).orderBy(desc(newFamilyFollowups.happenedOn), desc(newFamilyFollowups.createdAt)).limit(6000),
    db.select().from(newFamilyMessages).orderBy(desc(newFamilyMessages.createdAt)).limit(3000),
  ]);
  return Response.json({
    journeys,
    followups,
    messages,
    messageCapabilities: {
      aiConfigured: Boolean(process.env.OPENAI_API_KEY),
      smsConfigured: Boolean(process.env.SOLAPI_API_KEY && process.env.SOLAPI_API_SECRET && process.env.SOLAPI_SENDER_NUMBER),
      alimtalkConfigured: Boolean(process.env.SOLAPI_API_KEY && process.env.SOLAPI_API_SECRET && process.env.SOLAPI_SENDER_NUMBER && process.env.SOLAPI_KAKAO_PF_ID && process.env.SOLAPI_KAKAO_TEMPLATE_ID),
    },
  });
}

export async function PATCH(request: Request) {
  if (!await isImmanuelAdminRequest(request)) return Response.json({ error: "권한이 없습니다." }, { status: 403 });
  if (!sameOrigin(request)) return Response.json({ error: "올바르지 않은 요청입니다." }, { status: 403 });
  const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
  const id = Number(body.id);
  const stage = clean(body.stage, 30);
  const journeyStatus = clean(body.journeyStatus, 30);
  const educationProgress = Math.max(0, Math.min(100, Number(body.educationProgress) || 0));
  const visitCount = Math.max(1, Math.min(999, Number(body.visitCount) || 1));
  if (!Number.isInteger(id) || !stages.has(stage) || !journeyStatuses.has(journeyStatus)) {
    return Response.json({ error: "정착 단계와 상태를 확인해 주세요." }, { status: 400 });
  }
  const settled = stage === "settled" || journeyStatus === "completed";
  const [updated] = await getDb().update(newFamilyJourneys).set({
    stage: settled ? "settled" : stage,
    journeyStatus: settled ? "completed" : journeyStatus,
    assignee: clean(body.assignee, 80) || null,
    firstVisitedOn: clean(body.firstVisitedOn, 20) || null,
    visitCount,
    nextActionOn: settled ? null : clean(body.nextActionOn, 20) || null,
    consultationNote: clean(body.consultationNote, 3000) || null,
    smallGroupName: clean(body.smallGroupName, 120) || null,
    educationProgress: settled ? 100 : educationProgress,
    settledAt: settled ? new Date() : null,
    updatedAt: new Date(),
  }).where(eq(newFamilyJourneys.id, id)).returning({ id: newFamilyJourneys.id });
  if (!updated) return Response.json({ error: "새가족 정착 기록을 찾지 못했습니다." }, { status: 404 });
  return Response.json({ ok: true });
}

export async function POST(request: Request) {
  if (!await isImmanuelAdminRequest(request)) return Response.json({ error: "권한이 없습니다." }, { status: 403 });
  if (!sameOrigin(request)) return Response.json({ error: "올바르지 않은 요청입니다." }, { status: 403 });
  const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
  const journeyId = Number(body.journeyId);
  const actionType = clean(body.actionType, 30);
  const happenedOn = clean(body.happenedOn, 20);
  const result = clean(body.result, 500);
  const nextActionOn = clean(body.nextActionOn, 20);
  const note = clean(body.note, 2000);
  if (!Number.isInteger(journeyId) || !followupTypes.has(actionType) || !happenedOn || !result) {
    return Response.json({ error: "후속 조치 날짜, 유형과 결과를 확인해 주세요." }, { status: 400 });
  }
  const db = getDb();
  const [journey] = await db.select({ id: newFamilyJourneys.id, stage: newFamilyJourneys.stage, nextActionOn: newFamilyJourneys.nextActionOn }).from(newFamilyJourneys).where(eq(newFamilyJourneys.id, journeyId)).limit(1);
  if (!journey) return Response.json({ error: "새가족 정착 기록을 찾지 못했습니다." }, { status: 404 });
  await db.insert(newFamilyFollowups).values({
    journeyId,
    actionType,
    happenedOn,
    result,
    nextActionOn: nextActionOn || null,
    note: note || null,
  });
  const contactStage = ["received", "assigned"].includes(journey.stage) && ["call", "message", "visit"].includes(actionType) ? "contacted" : journey.stage;
  const isContact = ["call", "message", "visit", "consultation"].includes(actionType);
  await db.update(newFamilyJourneys).set({
    stage: contactStage,
    ...(isContact ? { lastContactOn: happenedOn, lastContactResult: result } : {}),
    nextActionOn: nextActionOn || journey.nextActionOn,
    updatedAt: new Date(),
  }).where(eq(newFamilyJourneys.id, journeyId));
  return Response.json({ ok: true });
}
