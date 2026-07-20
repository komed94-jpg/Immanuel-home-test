import { MinistryRequestForm } from "@/app/components/MinistryRequestForm";

export function BibleConferenceRequestForm() {
  return (
    <MinistryRequestForm
      requestType="bible-conference"
      subjectLabel="사경회 요청"
      fixedSubject="사경회 요청"
      messageLabel="요청 내용"
      submitLabel="사경회 요청 보내기"
      privacyMessage="접수 내용은 사경회 안내와 일정 협의를 위해서만 사용합니다."
      nameRequired
      contactRequired
    />
  );
}
