import { asc, eq } from "drizzle-orm";
import { isImmanuelAdminRequest } from "@/app/chatgpt-auth";
import { getDb } from "@/db";
import { churchEvents } from "@/db/schema";

function clean(value: unknown, max: number) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export async function GET() {
  const rows = await getDb().select().from(churchEvents).orderBy(asc(churchEvents.startsAt), asc(churchEvents.id)).limit(200);
  return Response.json({ events: rows });
}

export async function POST(request: Request) {
  if (!isImmanuelAdminRequest(request)) return Response.json({ error: "권한이 없습니다." }, { status: 403 });
  const body = (await request.json()) as Record<string, unknown>;
  const title = clean(body.title, 200);
  const category = clean(body.category, 80);
  const startsAt = clean(body.startsAt, 30);
  const endsAt = clean(body.endsAt, 30);
  const location = clean(body.location, 240);
  const description = clean(body.description, 2000);
  if (!title || !startsAt || Number.isNaN(Date.parse(startsAt)) || (endsAt && Number.isNaN(Date.parse(endsAt)))) {
    return Response.json({ error: "행사명과 일시를 확인해 주세요." }, { status: 400 });
  }
  const [saved] = await getDb().insert(churchEvents).values({ title, category: category || null, startsAt, endsAt: endsAt || null, location: location || null, description: description || null }).returning();
  return Response.json({ event: saved }, { status: 201 });
}

export async function PATCH(request: Request) {
  if (!isImmanuelAdminRequest(request)) return Response.json({ error: "권한이 없습니다." }, { status: 403 });
  const body = (await request.json()) as Record<string, unknown>;
  const id = Number(body.id);
  const title = clean(body.title, 200);
  const category = clean(body.category, 80);
  const startsAt = clean(body.startsAt, 30);
  const endsAt = clean(body.endsAt, 30);
  const location = clean(body.location, 240);
  const description = clean(body.description, 2000);
  if (!Number.isInteger(id) || id < 1 || !title || !startsAt || Number.isNaN(Date.parse(startsAt)) || (endsAt && Number.isNaN(Date.parse(endsAt)))) {
    return Response.json({ error: "행사 정보를 확인해 주세요." }, { status: 400 });
  }
  const [saved] = await getDb().update(churchEvents).set({ title, category: category || null, startsAt, endsAt: endsAt || null, location: location || null, description: description || null }).where(eq(churchEvents.id, id)).returning();
  if (!saved) return Response.json({ error: "행사를 찾지 못했습니다." }, { status: 404 });
  return Response.json({ event: saved });
}

export async function DELETE(request: Request) {
  if (!isImmanuelAdminRequest(request)) return Response.json({ error: "권한이 없습니다." }, { status: 403 });
  const id = Number(new URL(request.url).searchParams.get("id"));
  if (!Number.isInteger(id) || id < 1) return Response.json({ error: "대상을 확인해 주세요." }, { status: 400 });
  await getDb().delete(churchEvents).where(eq(churchEvents.id, id));
  return Response.json({ ok: true });
}
