import { asc, eq } from "drizzle-orm";
import { isImmanuelAdminRequest } from "@/app/chatgpt-auth";
import { getDb } from "@/db";
import { discipleshipPrograms } from "@/db/schema";

function clean(value: unknown, max: number) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

const statuses = new Set(["recruiting", "ongoing", "closed"]);

export async function GET() {
  const programs = await getDb().select().from(discipleshipPrograms).orderBy(asc(discipleshipPrograms.sortOrder), asc(discipleshipPrograms.id)).limit(50);
  return Response.json({ programs });
}

export async function POST(request: Request) {
  if (!isImmanuelAdminRequest(request)) return Response.json({ error: "권한이 없습니다." }, { status: 403 });
  const body = (await request.json()) as Record<string, unknown>;
  const title = clean(body.title, 200);
  const summary = clean(body.summary, 2000);
  const status = clean(body.status, 30) || "recruiting";
  if (!title || !summary || !statuses.has(status)) return Response.json({ error: "과정 정보를 확인해 주세요." }, { status: 400 });
  const [program] = await getDb().insert(discipleshipPrograms).values({
    title,
    summary,
    schedule: clean(body.schedule, 240) || null,
    location: clean(body.location, 240) || null,
    capacity: clean(body.capacity, 80) || null,
    status,
    sortOrder: Number.isFinite(Number(body.sortOrder)) ? Number(body.sortOrder) : 0
  }).returning();
  return Response.json({ program }, { status: 201 });
}

export async function PATCH(request: Request) {
  if (!isImmanuelAdminRequest(request)) return Response.json({ error: "권한이 없습니다." }, { status: 403 });
  const body = (await request.json()) as Record<string, unknown>;
  const id = Number(body.id);
  const title = clean(body.title, 200);
  const summary = clean(body.summary, 2000);
  const status = clean(body.status, 30);
  if (!Number.isInteger(id) || id < 1 || !title || !summary || !statuses.has(status)) return Response.json({ error: "과정 정보를 확인해 주세요." }, { status: 400 });
  const [program] = await getDb().update(discipleshipPrograms).set({
    title,
    summary,
    schedule: clean(body.schedule, 240) || null,
    location: clean(body.location, 240) || null,
    capacity: clean(body.capacity, 80) || null,
    status,
    sortOrder: Number.isFinite(Number(body.sortOrder)) ? Number(body.sortOrder) : 0
  }).where(eq(discipleshipPrograms.id, id)).returning();
  if (!program) return Response.json({ error: "과정을 찾지 못했습니다." }, { status: 404 });
  return Response.json({ program });
}

export async function DELETE(request: Request) {
  if (!isImmanuelAdminRequest(request)) return Response.json({ error: "권한이 없습니다." }, { status: 403 });
  const id = Number(new URL(request.url).searchParams.get("id"));
  if (!Number.isInteger(id) || id < 1) return Response.json({ error: "대상을 확인해 주세요." }, { status: 400 });
  await getDb().delete(discipleshipPrograms).where(eq(discipleshipPrograms.id, id));
  return Response.json({ ok: true });
}
