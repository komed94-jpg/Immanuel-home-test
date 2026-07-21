# Immanuel-home-test

임마누엘교회 홈페이지의 기능 검증용 저장소입니다. 운영 저장소와 분리하여 Vercel과 Neon에서 관리자 입력, 콘텐츠 관리, 사역 신청 기능을 먼저 검증합니다.

## 환경변수

- `DATABASE_URL`: Vercel Neon 연결 문자열
- `IMMANUEL_ADMIN_PASSWORD`: 관리자 비밀번호
- `IMMANUEL_ADMIN_SESSION_SECRET`: 32자 이상의 세션 서명 비밀값
- `CRON_SECRET`: 32자 이상의 Vercel Cron 인증 비밀값
- `RESEND_API_KEY`: 비밀번호 재설정 메일 발송용 Resend API 키
- `MEMBER_EMAIL_FROM`: 인증된 발신 주소(예: `임마누엘교회 <member@example.org>`)

`vercel.json`의 Cron은 매일 `19:30 UTC`, 한국시간으로 다음 날 오전 `04:30`에
`/api/cron/daily-word`를 호출합니다. Vercel은 `CRON_SECRET`을 Bearer 인증값으로
전달하며, 해당 값이 없거나 32자 미만이면 자동 게시 API는 실행되지 않습니다.

홈페이지 왼쪽 위 배포 배지는 빌드 시각을 자동으로 한국시간으로 변환해 표시합니다.

운영 저장소에는 테스트 검수와 승인 전 반영하지 않습니다.
