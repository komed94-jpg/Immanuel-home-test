import { MinistryRequestForm } from "@/app/components/MinistryRequestForm";

export function PrayerRequestForm() {
  return (
    <MinistryRequestForm
      requestType="prayer"
      subjectLabel="기도 제목"
      messageLabel="기도 요청 내용"
      submitLabel="기도 요청 보내기"
      privacyMessage="접수된 기도 제목은 비공개로 다루며, 기도와 목회적 연락을 위해서만 사용합니다."
      showContactRequest
    />
  );
}
