import { desc, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { churchEvents, eventApplications } from "@/db/schema";
import { getMemberFromRequest } from "@/lib/member-auth";

export async function GET(request: Request) {
  const member = await getMemberFromRequest(request); if (!member) return Response.json({ error: "로그인이 필요합니다." }, { status: 401 });
  const applications = await getDb().select({ id: eventApplications.id, eventId: eventApplications.eventId, status: eventApplications.status, attendanceStatus: eventApplications.attendanceStatus, appliedAt: eventApplications.appliedAt, title: churchEvents.title, startsAt: churchEvents.startsAt }).from(eventApplications).innerJoin(churchEvents, eq(eventApplications.eventId, churchEvents.id)).where(eq(eventApplications.memberId, member.id)).orderBy(desc(eventApplications.appliedAt)).limit(300);
  return Response.json({ applications });
}
