import { desc, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { attendanceEvents, attendanceRecords } from "@/db/schema";
import { getMemberFromRequest } from "@/lib/member-auth";

export async function GET(request: Request) {
  const member = await getMemberFromRequest(request);
  if (!member) return Response.json({ error: "로그인이 필요합니다." }, { status: 401 });
  const rows = await getDb().select({ id: attendanceRecords.id, status: attendanceRecords.status, checkedInAt: attendanceRecords.checkedInAt, title: attendanceEvents.title, eventType: attendanceEvents.eventType, heldOn: attendanceEvents.heldOn }).from(attendanceRecords).innerJoin(attendanceEvents, eq(attendanceRecords.eventId, attendanceEvents.id)).where(eq(attendanceRecords.memberId, member.id)).orderBy(desc(attendanceEvents.heldOn), desc(attendanceRecords.id)).limit(100);
  return Response.json({ records: rows });
}
