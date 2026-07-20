import { MinistryRequestForm } from "@/app/components/MinistryRequestForm";

export function DiscipleshipRequestForm() {
  return (
    <MinistryRequestForm
      requestType="discipleship"
      subjectLabel="제자훈련 신청"
      fixedSubject="사람이 어떻게 변화되는가 I 신청"
      messageLabel="신청 동기와 기대하는 변화"
      submitLabel="제자훈련 신청 보내기"
      privacyMessage="신청 내용은 훈련 안내와 목회적 연결을 위해서만 비공개로 사용합니다."
      nameRequired
      contactRequired
    />
  );
}
