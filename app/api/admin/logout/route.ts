export async function POST() {
  return Response.json({ error: "회원 로그아웃을 이용해 주세요." }, { status: 410 });
}
