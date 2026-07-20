import { desc } from "drizzle-orm";
import { isImmanuelAdminRequest } from "@/app/chatgpt-auth";
import { getDb } from "@/db";
import { givingInformation } from "@/db/schema";

const confirmedGivingInformation = {
  bank: "기업은행",
  accountNumber: "01072454295",
  accountHolder: "백승건",
  note: null
};

function clean(value: unknown, max: number) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export async function GET() {
  const [information] = await getDb().select().from(givingInformation).orderBy(desc(givingInformation.updatedAt), desc(givingInformation.id)).limit(1);
  return Response.json({ information: information ?? confirmedGivingInformation });
}

export async function POST(request: Request) {
  if (!isImmanuelAdminRequest(request)) return Response.json({ error: "권한이 없습니다." }, { status: 403 });
  const body = (await request.json()) as Record<string, unknown>;
  const bank = clean(body.bank, 100);
  const accountNumber = clean(body.accountNumber, 100);
  const accountHolder = clean(body.accountHolder, 100);
  const note = clean(body.note, 1200);
  if (!bank || !accountNumber || !accountHolder) return Response.json({ error: "은행, 계좌번호, 예금주를 입력해 주세요." }, { status: 400 });
  const [saved] = await getDb().insert(givingInformation).values({ bank, accountNumber, accountHolder, note: note || null }).returning();
  return Response.json({ information: saved }, { status: 201 });
}
