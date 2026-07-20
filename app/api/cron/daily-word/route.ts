import { ensureAutomaticWord } from "@/lib/daily-word-service";

export const dynamic = "force-dynamic";

function authorized(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || secret.length < 32) return false;
  return request.headers.get("authorization") === `Bearer ${secret}`;
}

export async function GET(request: Request) {
  if (!process.env.CRON_SECRET || process.env.CRON_SECRET.length < 32) {
    return Response.json({ error: "CRON_SECRET 설정이 필요합니다." }, { status: 503 });
  }
  if (!authorized(request)) {
    return Response.json({ error: "권한이 없습니다." }, { status: 401 });
  }

  const result = await ensureAutomaticWord();
  return Response.json({ ok: true, timeZone: "Asia/Seoul", scheduledFor: "04:30", ...result });
}
