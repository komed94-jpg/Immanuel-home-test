import { and, asc, eq, inArray } from "drizzle-orm";
import { isImmanuelAdminRequest } from "@/app/chatgpt-auth";
import { getDb } from "@/db";
import { churchEvents, eventApplications } from "@/db/schema";
import { sameOrigin } from "@/lib/member-auth";

function clean(value: unknown, max: number) { return typeof value === "string" ? value.trim().slice(0, max) : ""; }
function validDate(value: string) { return !!value && !Number.isNaN(Date.parse(value)); }
function capacity(value: unknown) { const number = Number(value); return Number.isInteger(number) && number > 0 && number <= 100000 ? number : null; }

function eventValues(body: Record<string, unknown>) {
  const title = clean(body.title, 200); const category = clean(body.category, 80); const startsAt = clean(body.startsAt, 30); const endsAt = clean(body.endsAt, 30);
  const registrationStartsAt = clean(body.registrationStartsAt, 30); const registrationEndsAt = clean(body.registrationEndsAt, 30);
  if (!title || !validDate(startsAt) || (endsAt && !validDate(endsAt)) || (registrationStartsAt && !validDate(registrationStartsAt)) || (registrationEndsAt && !validDate(registrationEndsAt))) return null;
  if (endsAt && Date.parse(endsAt) < Date.parse(startsAt)) return null;
  if (registrationStartsAt && registrationEndsAt && Date.parse(registrationEndsAt) < Date.parse(registrationStartsAt)) return null;
  return { title, category: category || null, startsAt, endsAt: endsAt || null, location: clean(body.location, 240) || null, description: clean(body.description, 2000) || null,
    isPublic: body.isPublic !== false && body.isPublic !== "false", registrationOpen: body.registrationOpen === true || body.registrationOpen === "on" || body.registrationOpen === "true",
    registrationStartsAt: registrationStartsAt || null, registrationEndsAt: registrationEndsAt || null, capacity: capacity(body.capacity) };
}

export async function GET() {
  const events = await getDb().select().from(churchEvents).where(eq(churchEvents.isPublic, true)).orderBy(asc(churchEvents.startsAt), asc(churchEvents.id)).limit(200);
  const ids = events.map((item) => item.id);
  const applications = ids.length ? await getDb().select({ eventId: eventApplications.eventId, status: eventApplications.status }).from(eventApplications).where(and(inArray(eventApplications.eventId, ids), eq(eventApplications.status, "registered"))) : [];
  const counts = new Map<number, number>(); for (const item of applications) counts.set(item.eventId, (counts.get(item.eventId) ?? 0) + 1);
  const now = Date.now();
  return Response.json({ events: events.map((item) => ({ ...item, registeredCount: counts.get(item.id) ?? 0,
    registrationAvailable: item.registrationOpen && (!item.registrationStartsAt || Date.parse(item.registrationStartsAt) <= now) && (!item.registrationEndsAt || Date.parse(item.registrationEndsAt) >= now) })) });
}

export async function POST(request: Request) {
  if (!await isImmanuelAdminRequest(request)) return Response.json({ error: "권한이 없습니다." }, { status: 403 });
  if (!sameOrigin(request)) return Response.json({ error: "올바르지 않은 요청입니다." }, { status: 403 });
  const values = eventValues((await request.json().catch(() => ({}))) as Record<string, unknown>);
  if (!values) return Response.json({ error: "행사명·일시·신청 기간을 확인해 주세요." }, { status: 400 });
  const [event] = await getDb().insert(churchEvents).values(values).returning();
  return Response.json({ event }, { status: 201 });
}

export async function PATCH(request: Request) {
  if (!await isImmanuelAdminRequest(request)) return Response.json({ error: "권한이 없습니다." }, { status: 403 });
  if (!sameOrigin(request)) return Response.json({ error: "올바르지 않은 요청입니다." }, { status: 403 });
  const body = (await request.json().catch(() => ({}))) as Record<string, unknown>; const id = Number(body.id); const values = eventValues(body);
  if (!Number.isInteger(id) || id < 1 || !values) return Response.json({ error: "행사 정보를 확인해 주세요." }, { status: 400 });
  const [event] = await getDb().update(churchEvents).set(values).where(eq(churchEvents.id, id)).returning();
  if (!event) return Response.json({ error: "행사를 찾지 못했습니다." }, { status: 404 });
  return Response.json({ event });
}

export async function DELETE(request: Request) {
  if (!await isImmanuelAdminRequest(request)) return Response.json({ error: "권한이 없습니다." }, { status: 403 });
  if (!sameOrigin(request)) return Response.json({ error: "올바르지 않은 요청입니다." }, { status: 403 });
  const id = Number(new URL(request.url).searchParams.get("id")); if (!Number.isInteger(id) || id < 1) return Response.json({ error: "대상을 확인해 주세요." }, { status: 400 });
  await getDb().delete(churchEvents).where(eq(churchEvents.id, id)); return Response.json({ ok: true });
}
