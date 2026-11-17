# 우리가 믿는 것 배경영상

- 기준: komed94-jpg/Immanuel-home-test main 8fbb8bb6a878960e15842d399ccf8accb3fc1b3e.
- 범위: /way/belief 및 기존 별칭 /way/what-we-believe 상단 배경만 변경. 신앙고백·성경공부·내비게이션·다른 11개 주제는 유지.
- 원본: 기존 Unsplash photo-1500530855697-b586d89ba3ee 붉은 협곡과 길.
- 제작: seedance_2_5 1080p 무음 8초, 오른쪽으로 느린 팬. 작업 ID 57b979b6-b61d-44c3-bef0-eddde58edc01. 새 영상에 글자를 생성하지 않고 기존 HTML 문구를 위 레이어로 유지.
- 반복: 양 끝을 감속한 정방향/역방향 13.958초 루프, H.264/yuv420p/faststart. 파일 무결성은 manifest의 SHA-256으로 검증.
- 재생: 자동 무음 반복, 재생·멈춤 버튼, 탭 비활성화 시 정지. 줄어든 움직임 설정 시 정지 포스터 및 수동 재생. 재생 실패 시 포스터 유지.
- 검증: 대상 ESLint 및 Next 프로덕션 빌드 통과(117개 정적 페이지), 영상 전체 디코딩 통과. 미리보기 브라우저 검증 결과는 PR에 기록. 실제 iOS Safari 기기 검증은 별도.
- 배포: 기능 브랜치 미리보기. 운영 main 병합·배포는 별도 승인 후 진행.
- 복구: 해당 변경 커밋을 revert하거나 이전 배포 dpl_AxYkbFwUiAc1uJGdSmddFpBusypJ 복원. DB·권한·외부 메시지 영향 없음.
