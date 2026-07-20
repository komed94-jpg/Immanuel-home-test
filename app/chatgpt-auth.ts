import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const ADMIN_COOKIE = "immanuel_admin_session";
const SESSION_SECONDS = 60 * 60 * 8;

function secret() {
  return process.env.IMMANUEL_ADMIN_SESSION_SECRET ?? "";
}

function signature(payload: string) {
  return createHmac("sha256", secret()).update(payload).digest("base64url");
}

function safeEqual(left: string, right: string) {
  const a = Buffer.from(left);
  const b = Buffer.from(right);
  return a.length === b.length && timingSafeEqual(a, b);
}

export function adminConfigured() {
  return Boolean(process.env.IMMANUEL_ADMIN_PASSWORD && secret().length >= 32);
}

export function verifyAdminPassword(password: string) {
  const expected = process.env.IMMANUEL_ADMIN_PASSWORD ?? "";
  return adminConfigured() && safeEqual(password, expected);
}

export function createAdminSession() {
  const expires = Math.floor(Date.now() / 1000) + SESSION_SECONDS;
  const payload = `admin.${expires}`;
  return `${payload}.${signature(payload)}`;
}

export function validAdminSession(value: string | undefined) {
  if (!adminConfigured() || !value) return false;
  const [role, expiresText, supplied] = value.split(".");
  if (role !== "admin" || !expiresText || !supplied) return false;
  const expires = Number(expiresText);
  if (!Number.isFinite(expires) || expires <= Math.floor(Date.now() / 1000)) return false;
  return safeEqual(supplied, signature(`${role}.${expiresText}`));
}

export function isImmanuelAdminRequest(request: Request) {
  const cookie = request.headers.get("cookie") ?? "";
  const value = cookie.split(";").map((item) => item.trim()).find((item) => item.startsWith(`${ADMIN_COOKIE}=`))?.slice(ADMIN_COOKIE.length + 1);
  return validAdminSession(value ? decodeURIComponent(value) : undefined);
}

export async function requireImmanuelAdmin(returnTo: string) {
  const store = await cookies();
  if (!validAdminSession(store.get(ADMIN_COOKIE)?.value)) {
    redirect(`/admin?returnTo=${encodeURIComponent(returnTo)}`);
  }
}

export async function hasAdminSession() {
  const store = await cookies();
  return validAdminSession(store.get(ADMIN_COOKIE)?.value);
}
