import { MinistryRequestForm } from "@/app/components/MinistryRequestForm";

export function CommunityRequestForm() {
  return (
    <MinistryRequestForm
      requestType="community"
      subjectLabel="공동체 연결 요청"
      fixedSubject="목장·소그룹 연결 요청"
      messageLabel="거주 지역, 연령대, 가능한 요일과 연결을 위해 전하고 싶은 내용"
      submitLabel="공동체 연결 요청 보내기"
      privacyMessage="작성한 정보는 적합한 목장·소그룹 안내와 목회적 연락을 위해서만 비공개로 사용합니다."
      nameRequired
      contactRequired
    />
  );
}
