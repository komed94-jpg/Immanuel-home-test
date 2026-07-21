export async function POST() {
  return Response.json({ error: "회원 로그인으로 관리자 권한을 확인합니다." }, { status: 410 });
}
