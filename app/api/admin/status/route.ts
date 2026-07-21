import { isImmanuelAdminRequest } from "@/app/chatgpt-auth";

export async function GET(request: Request) {
  return Response.json({ authenticated: await isImmanuelAdminRequest(request) });
}
