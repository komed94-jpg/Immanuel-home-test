import { MinistryRequestForm } from "@/app/components/MinistryRequestForm";

export function SpiritMinistryRequestForm() {
  return (
    <MinistryRequestForm
      requestType="spirit-ministry"
      subjectLabel="성령사역 요청"
      fixedSubject="성령사역 요청"
      messageLabel="요청 내용"
      submitLabel="성령사역 요청 보내기"
      privacyMessage="접수 내용은 비공개로 다루며, 사역 안내와 목회적 연락을 위해서만 사용합니다."
      nameRequired
      contactRequired
    />
  );
}
