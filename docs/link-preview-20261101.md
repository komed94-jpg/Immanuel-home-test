# 홈페이지 링크 미리보기

- 대상: `komed94-jpg/Immanuel-home-test`, `https://immanuelway.church/`.
- 기준 커밋: `ca73ddcceeb21fa731d7c04b0afa05dadf756482`.
- 원인: 홈의 초기 HTML에 Open Graph 이미지/제목/설명 태그가 없었음.
- 수정: 홈에 정적 Open Graph 및 Twitter 메타데이터와 절대 HTTPS 이미지 주소를 설정.
- 이미지: 기존 `public/images/hero-city-cross-original.webp`를 시각적 변경 없이 JPEG로 변환한 `public/images/immanuel-share-20261101.jpg` (2048 × 1365). 기존 PNG 사본은 손상되어 사용하지 않음.
- 범위: 홈 공유 카드만 변경. 기존 본문, 디자인, 학습 데이터, 인증, DB 스키마는 변경하지 않음.
- 빌드: 로컬에서는 DB 환경변수 없이 `next build`로 검증. 기존 배포 빌드의 마이그레이션 스크립트는 변경하지 않으며, 테스트 프로젝트에서만 배포.
- 검증: Next.js 빌드 및 TypeScript 검사 통과. 생성된 홈 HTML에서 `og:image`, `og:title`, `og:description`, `og:url`, `twitter:card`를 확인. JPEG 파일 디코딩 및 5MB 미만(276,419바이트)을 확인.
- 롤백: 이 변경의 커밋을 되돌려 홈 메타데이터와 추가 이미지/문서를 제거.
- 카카오가 이전 정보를 저장한 경우 https://developers.kakao.com/tool/clear/og 에서 해당 URL의 OG 캐시를 초기화한 뒤 새 메시지로 재공유해야 함. 이미 보낸 메시지의 갱신은 보장하지 않음.
