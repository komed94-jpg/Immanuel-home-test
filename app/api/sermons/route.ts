import { desc, eq } from "drizzle-orm";
import { isImmanuelAdminRequest } from "@/app/chatgpt-auth";
import { getDb } from "@/db";
import { sermons } from "@/db/schema";

function clean(value: unknown, max: number) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function validVideoUrl(value: string) {
  try {
    const url = new URL(value);
    return ["youtube.com", "www.youtube.com", "youtu.be", "www.youtu.be"].includes(url.hostname);
  } catch {
    return false;
  }
}

export async function GET() {
  const rows = await getDb().select().from(sermons).orderBy(desc(sermons.preachedOn), desc(sermons.id)).limit(100);
  return Response.json({ sermons: rows });
}

export async function POST(request: Request) {
  if (!await isImmanuelAdminRequest(request)) return Response.json({ error: "권한이 없습니다." }, { status: 403 });
  const body = (await request.json()) as Record<string, unknown>;
  const title = clean(body.title, 200);
  const scripture = clean(body.scripture, 160);
  const preacher = clean(body.preacher, 120);
  const videoUrl = clean(body.videoUrl, 500);
  const description = clean(body.description, 2000);
  const preachedOn = clean(body.preachedOn, 20);
  if (!title || !videoUrl || !preachedOn || !validVideoUrl(videoUrl)) {
    return Response.json({ error: "제목, 설교일, 올바른 YouTube 주소를 확인해 주세요." }, { status: 400 });
  }
  const [saved] = await getDb().insert(sermons).values({ title, scripture: scripture || null, preacher: preacher || null, videoUrl, description: description || null, preachedOn }).returning();
  return Response.json({ sermon: saved }, { status: 201 });
}

export async function PATCH(request: Request) {
  if (!await isImmanuelAdminRequest(request)) return Response.json({ error: "권한이 없습니다." }, { status: 403 });
  const body = (await request.json()) as Record<string, unknown>;
  const id = Number(body.id);
  const title = clean(body.title, 200);
  const scripture = clean(body.scripture, 160);
  const preacher = clean(body.preacher, 120);
  const videoUrl = clean(body.videoUrl, 500);
  const description = clean(body.description, 2000);
  const preachedOn = clean(body.preachedOn, 20);
  if (!Number.isInteger(id) || id < 1 || !title || !videoUrl || !preachedOn || !validVideoUrl(videoUrl)) {
    return Response.json({ error: "설교 정보를 확인해 주세요." }, { status: 400 });
  }
  const [saved] = await getDb().update(sermons).set({ title, scripture: scripture || null, preacher: preacher || null, videoUrl, description: description || null, preachedOn }).where(eq(sermons.id, id)).returning();
  if (!saved) return Response.json({ error: "설교를 찾지 못했습니다." }, { status: 404 });
  return Response.json({ sermon: saved });
}

export async function DELETE(request: Request) {
  if (!await isImmanuelAdminRequest(request)) return Response.json({ error: "권한이 없습니다." }, { status: 403 });
  const id = Number(new URL(request.url).searchParams.get("id"));
  if (!Number.isInteger(id) || id < 1) return Response.json({ error: "대상을 확인해 주세요." }, { status: 400 });
  await getDb().delete(sermons).where(eq(sermons.id, id));
  return Response.json({ ok: true });
}
