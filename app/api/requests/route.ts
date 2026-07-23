import { and, desc, eq, inArray } from "drizzle-orm";
import { isImmanuelAdminRequest } from "@/app/chatgpt-auth";
import { getDb } from "@/db";
import { churchEvents, members, ministryRequests, newFamilyJourneys, newFamilyRegistrations } from "@/db/schema";
import { getMemberFromRequest } from "@/lib/member-auth";

const allowedRequestTypes = new Set([
  "prayer",
  "counseling",
  "new-family",
  "spirit-ministry",
  "bible-conference",
  "discipleship",
  "community",
  "event"
]);

function cleanText(value: unknown, maxLength: number) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function koreaDate(date = new Date()) {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Seoul", year: "numeric", month: "2-digit", day: "2-digit" }).format(date);
}

function cleanDetails(value: unknown) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const details = value as Record<string, unknown>;
  const participation = Array.isArray(details.participation)
    ? details.participation.map((item) => cleanText(item, 40)).filter(Boolean).slice(0, 4)
    : [];

  return {
    cardType: cleanText(details.cardType, 30),
    birthDate: cleanText(details.birthDate, 20),
    address: cleanText(details.address, 240),
    email: cleanText(details.email, 120),
    occupation: cleanText(details.occupation, 240),
    familyInfo: cleanText(details.familyInfo, 1000),
    guideName: cleanText(details.guideName, 80),
    guidePhone: cleanText(details.guidePhone, 40),
    guideRelation: cleanText(details.guideRelation, 160),
    faithStatus: cleanText(details.faithStatus, 120),
    previousChurchName: cleanText(details.previousChurchName, 240),
    faithHistory: cleanText(details.faithHistory, 1200),
    faithYears: cleanText(details.faithYears, 80),
    churchPosition: cleanText(details.churchPosition, 160),
    serviceHistory: cleanText(details.serviceHistory, 500),
    ordinanceType: cleanText(details.ordinanceType, 80),
    ordinanceChurch: cleanText(details.ordinanceChurch, 240),
    referral: cleanText(details.referral, 500),
    participation
  };
}

export async function POST(request: Request) {
  try {
    const origin = request.headers.get("origin");
    if (origin && origin !== new URL(request.url).origin) {
      return Response.json({ error: "올바르지 않은 요청입니다." }, { status: 403 });
    }

    const payload = (await request.json()) as Record<string, unknown>;
    const requestType = cleanText(payload.requestType, 40);
    const name = cleanText(payload.name, 80);
    const contact = cleanText(payload.contact, 120);
    const subject = cleanText(payload.subject, 160);
    const message = cleanText(payload.message, 5000);
    const website = cleanText(payload.website, 200);
    const consented = payload.consented === true;
    const contactRequested = payload.contactRequested === true;
    const details = cleanDetails(payload.details);
    const currentMember = await getMemberFromRequest(request);

    if (website) {
      return Response.json({ ok: true, receipt: "received" }, { status: 201 });
    }
    if (!allowedRequestTypes.has(requestType)) {
      return Response.json({ error: "요청 유형을 확인해 주세요." }, { status: 400 });
    }
    if (requestType === "discipleship") {
      if (!currentMember || currentMember.membershipStatus !== "active") {
        return Response.json({ error: "제자훈련은 등록 교인만 신청할 수 있습니다." }, { status: 403 });
      }
    }
    if (!subject || !message) {
      return Response.json({ error: "제목과 요청 내용을 입력해 주세요." }, { status: 400 });
    }
    if (!consented) {
      return Response.json({ error: "개인정보 수집·이용 동의가 필요합니다." }, { status: 400 });
    }
    if (contactRequested && !contact) {
      return Response.json({ error: "연락을 원하시면 연락처를 입력해 주세요." }, { status: 400 });
    }
    if (requestType === "community" && (!name || !contact)) {
      return Response.json({ error: "공동체 연결을 위해 이름과 연락처를 입력해 주세요." }, { status: 400 });
    }
    if (requestType === "event") {
      const [openEvent] = await getDb().select({ id: churchEvents.id }).from(churchEvents).where(and(eq(churchEvents.title, subject), eq(churchEvents.registrationOpen, true))).limit(1);
      if (!openEvent) return Response.json({ error: "현재 신청을 받는 행사가 아닙니다." }, { status: 403 });
    }
    const previousChurchComplete = details?.faithStatus === "교회가 처음" || Boolean(
      details?.previousChurchName && details.faithHistory && details.churchPosition && details.serviceHistory
    );
    const ordinanceComplete = details?.ordinanceType === "받지 않음" || Boolean(details?.ordinanceChurch);
    const registrationComplete = details?.cardType !== "registration" || Boolean(
      details.faithStatus && details.faithYears && details.ordinanceType && ordinanceComplete && previousChurchComplete
    );
    if (requestType === "new-family" && (!name || !contact || !details?.cardType || !details.birthDate || !details.address || !details.email || !details.occupation || !details.familyInfo || !details.referral || !registrationComplete)) {
      return Response.json({ error: "새가족 등록 필수 항목을 확인해 주세요." }, { status: 400 });
    }

    const db = getDb();
    if (requestType === "new-family" && details?.cardType === "registration" && currentMember) {
      const [duplicate] = await db.select({ id: newFamilyRegistrations.id }).from(newFamilyRegistrations).where(and(eq(newFamilyRegistrations.memberId, currentMember.id), eq(newFamilyRegistrations.cardType, "registration"), inArray(newFamilyRegistrations.reviewStatus, ["received", "reviewing", "on_hold"]))).limit(1);
      if (duplicate) return Response.json({ error: "이미 검토 중인 등록카드가 있습니다. 관리자 확인 후 수정할 수 있습니다." }, { status: 409 });
    }
    const [saved] = await db
      .insert(ministryRequests)
      .values({
        requestType,
        memberId: currentMember?.id ?? null,
        name: name || null,
        contact: contact || null,
        subject,
        message,
        consented,
        options: JSON.stringify({ contactRequested, visibility: "private", details })
      })
      .returning({ id: ministryRequests.id });

    if (requestType === "new-family" && details) {
      const [registration] = await db.insert(newFamilyRegistrations).values({ requestId: saved.id, memberId: currentMember?.id ?? null, cardType: details.cardType, birthDate: details.birthDate, address: details.address, email: details.email, occupation: details.occupation, familyInfo: details.familyInfo, referral: details.referral, guideName: details.guideName || null, guidePhone: details.guidePhone || null, guideRelation: details.guideRelation || null, faithStatus: details.faithStatus || null, faithYears: details.faithYears || null, previousChurchName: details.previousChurchName || null, faithHistory: details.faithHistory || null, churchPosition: details.churchPosition || null, serviceHistory: details.serviceHistory || null, ordinanceType: details.ordinanceType || null, ordinanceChurch: details.ordinanceChurch || null, participation: details.participation.join(", ") || null }).returning({ id: newFamilyRegistrations.id });
      await db.insert(newFamilyJourneys).values({ registrationId: registration.id, memberId: currentMember?.id ?? null, firstVisitedOn: koreaDate() });
      if (details.cardType === "registration" && currentMember) {
        await db.update(members).set({ membershipStatus: currentMember.membershipStatus === "nonmember" ? "pending" : currentMember.membershipStatus, address: details.address, occupation: details.occupation, faithYears: details.faithYears || null, baptismType: details.ordinanceType || null, baptismChurch: details.ordinanceChurch || null, previousChurchName: details.previousChurchName || null, previousChurchPosition: details.churchPosition || null, serviceHistory: details.serviceHistory || null, updatedAt: new Date() }).where(eq(members.id, currentMember.id));
      }
    }

    const receiptPrefixes: Record<string, string> = {
      prayer: "PR",
      counseling: "CO",
      "new-family": "NF",
      "spirit-ministry": "SM",
      "bible-conference": "BC",
      discipleship: "DT",
      community: "CM",
      event: "EV"
    };
    const receiptPrefix = receiptPrefixes[requestType];
    return Response.json({ ok: true, receipt: `${receiptPrefix}-${saved.id}` }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error";
    const unavailable = message.includes("no such table") || message.includes("D1 binding");
    return Response.json(
      { error: unavailable ? "접수 시스템을 준비하고 있습니다. 잠시 후 다시 시도해 주세요." : "접수 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  if (!await isImmanuelAdminRequest(request)) {
    return Response.json({ error: "권한이 없습니다." }, { status: 403 });
  }

  const requestType = new URL(request.url).searchParams.get("type") ?? "prayer";
  if (!allowedRequestTypes.has(requestType)) {
    return Response.json({ error: "요청 유형을 확인해 주세요." }, { status: 400 });
  }
  const rows = await getDb()
    .select()
    .from(ministryRequests)
    .where(eq(ministryRequests.requestType, requestType))
    .orderBy(desc(ministryRequests.submittedAt), desc(ministryRequests.id))
    .limit(100);

  return Response.json({ requests: rows });
}

export async function PATCH(request: Request) {
  if (!await isImmanuelAdminRequest(request)) {
    return Response.json({ error: "권한이 없습니다." }, { status: 403 });
  }
  const body = (await request.json()) as Record<string, unknown>;
  const id = Number(body.id);
  const status = cleanText(body.status, 30);
  const adminNote = cleanText(body.adminNote, 3000);
  const allowedStatuses = new Set(["received", "reviewing", "completed"]);
  if (!Number.isInteger(id) || id < 1 || (status && !allowedStatuses.has(status))) {
    return Response.json({ error: "접수 상태를 확인해 주세요." }, { status: 400 });
  }
  const changes: { status?: string; adminNote?: string | null } = {};
  if (status) changes.status = status;
  if (Object.prototype.hasOwnProperty.call(body, "adminNote")) changes.adminNote = adminNote || null;
  if (!Object.keys(changes).length) return Response.json({ error: "변경할 내용을 확인해 주세요." }, { status: 400 });
  const [updated] = await getDb().update(ministryRequests).set(changes).where(eq(ministryRequests.id, id)).returning();
  if (!updated) return Response.json({ error: "접수 내용을 찾을 수 없습니다." }, { status: 404 });
  return Response.json({ request: updated });
}

export async function DELETE(request: Request) {
  if (!await isImmanuelAdminRequest(request)) {
    return Response.json({ error: "권한이 없습니다." }, { status: 403 });
  }
  const id = Number(new URL(request.url).searchParams.get("id"));
  if (!Number.isInteger(id) || id < 1) {
    return Response.json({ error: "삭제할 접수 내용을 확인해 주세요." }, { status: 400 });
  }
  const [removed] = await getDb()
    .delete(ministryRequests)
    .where(eq(ministryRequests.id, id))
    .returning({ id: ministryRequests.id });
  if (!removed) return Response.json({ error: "접수 내용을 찾을 수 없습니다." }, { status: 404 });
  return Response.json({ ok: true });
}
