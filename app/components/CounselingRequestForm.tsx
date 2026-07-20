import { MinistryRequestForm } from "@/app/components/MinistryRequestForm";

export function CounselingRequestForm() {
  return (
    <MinistryRequestForm
      requestType="counseling"
      subjectLabel="상담 주제"
      messageLabel="상담 요청 내용"
      submitLabel="상담 요청 보내기"
      privacyMessage="접수된 상담 내용은 비공개로 다루며, 상담 일정 조율과 목회적 돌봄을 위해서만 사용합니다."
      nameRequired
      contactRequired
    />
  );
}
