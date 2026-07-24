import { and, desc, eq } from "drizzle-orm";
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
import { normalizePhone, sameOrigin } from "@/lib/member-auth";
import {
  FirstContactTone,
  generateFirstContactDraft,
  getApprovedAlimtalkDraft,
  MessageChannel,
  sendFirstContactMessage,
} from "@/lib/new-family-message";

const tones = new Set<FirstContactTone>(["warm", "concise", "pastoral"]);
const channels = new Set<MessageChannel>(["sms", "alimtalk"]);

function clean(value: unknown, max: number) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function koreaToday() {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Seoul", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
}

async function getRecipient(journeyId: number) {
  const [row] = await getDb().select({
    id: newFamilyJourneys.id,
    requestId: newFamilyRegistrations.requestId,
    stage: newFamilyJourneys.stage,
    assignee: newFamilyJourneys.assignee,
    firstVisitedOn: newFamilyJourneys.firstVisitedOn,
    contact: ministryRequests.contact,
    requestName: ministryRequests.name,
    memberName: members.name,
  }).from(newFamilyJourneys)
    .innerJoin(newFamilyRegistrations, eq(newFamilyJourneys.registrationId, newFamilyRegistrations.id))
    .innerJoin(ministryRequests, eq(newFamilyRegistrations.requestId, ministryRequests.id))
    .leftJoin(members, eq(newFamilyJourneys.memberId, members.id))
    .where(eq(newFamilyJourneys.id, journeyId))
    .limit(1);
  return row;
}

export async function POST(request: Request) {
  if (!await isImmanuelAdminRequest(request)) return Response.json({ error: "권한이 없습니다." }, { status: 403 });
  if (!sameOrigin(request)) return Response.json({ error: "올바르지 않은 요청입니다." }, { status: 403 });
  const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
  const action = clean(body.action, 20);
  const journeyId = Number(body.journeyId);
  if (!Number.isInteger(journeyId)) return Response.json({ error: "새가족 정보를 확인해 주세요." }, { status: 400 });
  const recipient = await getRecipient(journeyId);
  if (!recipient) return Response.json({ error: "새가족 정착 기록을 찾지 못했습니다." }, { status: 404 });

  if (action === "save-recipient") {
    const phone = normalizePhone(body.phone);
    if (!/^01\d{8,9}$/.test(phone)) {
      return Response.json({ error: "010-1234-5678 형식의 휴대전화 번호를 입력해 주세요." }, { status: 400 });
    }
    await getDb().update(ministryRequests)
      .set({ contact: phone })
      .where(eq(ministryRequests.id, recipient.requestId));
    return Response.json({ ok: true, phone });
  }

  if (action === "generate") {
    const tone = clean(body.tone, 20) as FirstContactTone;
    const channel = clean(body.channel, 20) as MessageChannel;
    if (!tones.has(tone)) return Response.json({ error: "문안 유형을 확인해 주세요." }, { status: 400 });
    if (!channels.has(channel)) return Response.json({ error: "발송 채널을 확인해 주세요." }, { status: 400 });
    const draftInput = {
      name: recipient.memberName || recipient.requestName || "새가족",
      firstVisitedOn: recipient.firstVisitedOn,
      assignee: clean(body.assignee, 80) || recipient.assignee,
      tone,
    };
    if (channel === "alimtalk") {
      const content = getApprovedAlimtalkDraft(draftInput);
      if (!content) {
        return Response.json({ error: "카카오에서 승인된 알림톡 문안 설정이 필요합니다." }, { status: 503 });
      }
      return Response.json({ ok: true, content, source: "alimtalk_template", model: null });
    }
    try {
      const draft = await generateFirstContactDraft(draftInput);
      return Response.json({ ok: true, ...draft });
    } catch (error) {
      return Response.json({ error: error instanceof Error ? error.message : "AI 문안 생성에 실패했습니다." }, { status: 502 });
    }
  }

  if (action !== "send") return Response.json({ error: "요청 내용을 확인해 주세요." }, { status: 400 });
  const channel = clean(body.channel, 20) as MessageChannel;
  const content = clean(body.content, 2000);
  const phone = normalizePhone(clean(body.recipient, 30) || recipient.contact);
  if (!channels.has(channel) || !content || body.confirmed !== true) {
    return Response.json({ error: "발송 채널과 문안을 확인하고 최종 확인에 체크해 주세요." }, { status: 400 });
  }
  if (!/^01\d{8,9}$/.test(phone)) return Response.json({ error: "수신자의 휴대전화 번호를 확인해 주세요." }, { status: 400 });
  if (phone !== normalizePhone(recipient.contact)) {
    await getDb().update(ministryRequests)
      .set({ contact: phone })
      .where(eq(ministryRequests.id, recipient.requestId));
  }
  if (channel === "alimtalk") {
    const approvedContent = getApprovedAlimtalkDraft({
      name: recipient.memberName || recipient.requestName || "새가족",
      firstVisitedOn: recipient.firstVisitedOn,
      assignee: recipient.assignee,
      tone: "warm",
    });
    if (!approvedContent) {
      return Response.json({ error: "카카오에서 승인된 알림톡 문안 설정이 필요합니다." }, { status: 503 });
    }
    if (content !== approvedContent) {
      return Response.json({ error: "알림톡은 승인된 문안만 보낼 수 있습니다. 승인 문안을 다시 불러와 주세요." }, { status: 400 });
    }
  }

  const db = getDb();
  const [lastMessage] = await db.select().from(newFamilyMessages)
    .where(and(eq(newFamilyMessages.journeyId, journeyId), eq(newFamilyMessages.channel, channel)))
    .orderBy(desc(newFamilyMessages.createdAt))
    .limit(1);
  if (lastMessage?.status === "sent" && lastMessage.content === content && Date.now() - lastMessage.createdAt.getTime() < 5 * 60 * 1000) {
    return Response.json({ error: "같은 문안이 최근 5분 안에 발송되었습니다. 중복 발송하지 않았습니다." }, { status: 409 });
  }

  const delivery = await sendFirstContactMessage({ channel, recipient: phone, content });
  const now = new Date();
  const [messageLog] = await db.insert(newFamilyMessages).values({
    journeyId,
    channel,
    recipient: phone,
    content,
    status: delivery.sent ? "sent" : delivery.configured ? "failed" : "not_configured",
    providerMessageId: delivery.providerMessageId,
    errorMessage: delivery.error,
    sentAt: delivery.sent ? now : null,
  }).returning({ id: newFamilyMessages.id });

  if (!delivery.sent) {
    return Response.json({
      error: delivery.error || "메시지를 발송하지 못했습니다.",
      configured: delivery.configured,
      messageLogId: messageLog.id,
    }, { status: delivery.configured ? 502 : 503 });
  }

  const today = koreaToday();
  await db.insert(newFamilyFollowups).values({
    journeyId,
    actionType: "message",
    happenedOn: today,
    result: channel === "alimtalk" ? "AI 첫 연락 알림톡 발송" : "AI 첫 연락 문자 발송",
    note: content,
  });
  await db.update(newFamilyJourneys).set({
    stage: ["received", "assigned"].includes(recipient.stage) ? "contacted" : recipient.stage,
    lastContactOn: today,
    lastContactResult: channel === "alimtalk" ? "알림톡 발송 완료" : "문자 발송 완료",
    updatedAt: now,
  }).where(eq(newFamilyJourneys.id, journeyId));
  return Response.json({ ok: true, messageLogId: messageLog.id });
}
