import { adminConfigured, isImmanuelAdminRequest } from "@/app/chatgpt-auth";

export async function GET(request: Request) {
  return Response.json({ configured: adminConfigured(), authenticated: isImmanuelAdminRequest(request) });
}
