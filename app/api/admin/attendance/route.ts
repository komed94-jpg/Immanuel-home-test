import { desc, eq } from "drizzle-orm";
import { isImmanuelAdminRequest } from "@/app/chatgpt-auth";
import { getDb } from "@/db";
import { attendanceEvents, attendanceRecords, members } from "@/db/schema";

const eventTypes = new Set(["sunday", "dawn", "friday", "small-group", "discipleship", "special", "event"]);
const attendanceStatuses = new Set(["present", "late", "excused", "absent"]);
function clean(value: unknown, max: number) { return typeof value === "string" ? value.trim().slice(0, max) : ""; }

export async function GET(request: Request) {
  if (!isImmanuelAdminRequest(request)) return Response.json({ error: "권한이 없습니다." }, { status: 403 });
  const eventId = Number(new URL(request.url).searchParams.get("eventId"));
  const db = getDb();
  const events = await db.select().from(attendanceEvents).orderBy(desc(attendanceEvents.heldOn), desc(attendanceEvents.id)).limit(200);
  const activeMembers = await db.select({ id: members.id, name: members.name, memberNumber: members.memberNumber }).from(members).where(eq(members.membershipStatus, "active")).orderBy(members.name).limit(1000);
  const records = Number.isInteger(eventId) && eventId > 0
    ? await db.select({ id: attendanceRecords.id, memberId: attendanceRecords.memberId, status: attendanceRecords.status, method: attendanceRecords.method, note: attendanceRecords.note, checkedInAt: attendanceRecords.checkedInAt }).from(attendanceRecords).where(eq(attendanceRecords.eventId, eventId))
    : [];
  return Response.json({ events, members: activeMembers, records });
}

export async function POST(request: Request) {
  if (!isImmanuelAdminRequest(request)) return Response.json({ error: "권한이 없습니다." }, { status: 403 });
  const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
  const action = clean(body.action, 30);
  const db = getDb();
  if (action === "create-event") {
    const title = clean(body.title, 200);
    const eventType = clean(body.eventType, 40);
    const heldOn = clean(body.heldOn, 20);
    const startsAt = clean(body.startsAt, 30);
    if (!title || !eventTypes.has(eventType) || !/^\d{4}-\d{2}-\d{2}$/.test(heldOn)) return Response.json({ error: "출석 모임 정보를 확인해 주세요." }, { status: 400 });
    const [saved] = await db.insert(attendanceEvents).values({ title, eventType, heldOn, startsAt: startsAt || null }).returning();
    return Response.json({ event: saved }, { status: 201 });
  }
  if (action === "mark") {
    const eventId = Number(body.eventId);
    const memberId = Number(body.memberId);
    const status = clean(body.status, 20);
    const note = clean(body.note, 500);
    if (!Number.isInteger(eventId) || !Number.isInteger(memberId) || !attendanceStatuses.has(status)) return Response.json({ error: "출석 정보를 확인해 주세요." }, { status: 400 });
    const [saved] = await db.insert(attendanceRecords).values({ eventId, memberId, status, method: "manual", note: note || null, checkedInAt: new Date() })
      .onConflictDoUpdate({ target: [attendanceRecords.eventId, attendanceRecords.memberId], set: { status, note: note || null, method: "manual", checkedInAt: new Date() } }).returning();
    return Response.json({ record: saved });
  }
  return Response.json({ error: "처리할 작업을 확인해 주세요." }, { status: 400 });
}

export async function DELETE(request: Request) {
  if (!isImmanuelAdminRequest(request)) return Response.json({ error: "권한이 없습니다." }, { status: 403 });
  const id = Number(new URL(request.url).searchParams.get("id"));
  if (!Number.isInteger(id) || id < 1) return Response.json({ error: "모임을 확인해 주세요." }, { status: 400 });
  await getDb().delete(attendanceEvents).where(eq(attendanceEvents.id, id));
  return Response.json({ ok: true });
}
