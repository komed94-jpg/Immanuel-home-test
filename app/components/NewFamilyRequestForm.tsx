"use client";

import { FormEvent, useState } from "react";

type CardType = "visit" | "registration";
type SubmitState =
  | { status: "idle" }
  | { status: "submitting" }
  | { status: "success"; receipt: string }
  | { status: "error"; message: string };

type InitialMember = { name: string; birthDate: string; email: string; phone: string } | null;
export function NewFamilyRequestForm({ initialMember }: { initialMember: InitialMember }) {
  const [cardType, setCardType] = useState<CardType>("visit");
  const [faithStatus, setFaithStatus] = useState("");
  const [ordinanceType, setOrdinanceType] = useState("");
  const [submitState, setSubmitState] = useState<SubmitState>({ status: "idle" });

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitState({ status: "submitting" });
    const form = event.currentTarget;
    const formData = new FormData(form);
    const cardLabel = cardType === "visit" ? "방문카드" : "등록카드";
    const details = {
      cardType,
      birthDate: formData.get("birthDate"),
      address: formData.get("address"),
      email: formData.get("email"),
      occupation: formData.get("occupation"),
      familyInfo: formData.get("familyInfo"),
      referral: formData.get("referral"),
      guideName: formData.get("guideName"),
      guidePhone: formData.get("guidePhone"),
      guideRelation: formData.get("guideRelation"),
      faithStatus: formData.get("faithStatus"),
      previousChurchName: formData.get("previousChurchName"),
      faithHistory: formData.get("faithHistory"),
      faithYears: formData.get("faithYears"),
      churchPosition: formData.get("churchPosition"),
      serviceHistory: formData.get("serviceHistory"),
      ordinanceType: formData.get("ordinanceType"),
      ordinanceChurch: formData.get("ordinanceChurch"),
      participation: formData.getAll("participation")
    };

    try {
      const response = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requestType: "new-family",
          name: formData.get("name"),
          contact: formData.get("phone"),
          subject: `새가족 ${cardLabel}`,
          message: `${cardLabel}가 접수되었습니다.`,
          details,
          website: formData.get("website"),
          contactRequested: true,
          consented: formData.get("consented") === "on"
        })
      });
      const result = (await response.json()) as { error?: string; receipt?: string };
      if (!response.ok) throw new Error(result.error ?? "등록 중 오류가 발생했습니다.");
      form.reset();
      setCardType("visit");
      setFaithStatus("");
      setOrdinanceType("");
      setSubmitState({ status: "success", receipt: result.receipt ?? "received" });
    } catch (error) {
      setSubmitState({ status: "error", message: error instanceof Error ? error.message : "등록 중 오류가 발생했습니다." });
    }
  }

  return <form className="request-form new-family-form" onSubmit={handleSubmit}>
    <fieldset className="request-choice-group request-card-type">
      <legend>새가족 카드 구분</legend>
      <label className="request-radio"><input type="radio" name="cardType" value="visit" checked={cardType === "visit"} onChange={() => setCardType("visit")} /><span>방문카드</span></label>
      <label className="request-radio"><input type="radio" name="cardType" value="registration" checked={cardType === "registration"} onChange={() => setCardType("registration")} /><span>등록카드</span></label>
      <p className="request-card-help">방문카드는 처음 오신 분의 안내를 위한 기본 카드입니다. 등록카드는 임마누엘교회 공동체 등록과 목회적 연결을 위한 카드입니다.</p>
    </fieldset>

    <div className="request-form-grid">
      <label><span>성명</span><input name="name" type="text" maxLength={80} autoComplete="name" defaultValue={initialMember?.name ?? ""} required /></label>
      <label><span>생년월일</span><input name="birthDate" type="date" defaultValue={initialMember?.birthDate ?? ""} required /></label>
    </div>
    <label><span>주소</span><input name="address" type="text" maxLength={240} autoComplete="street-address" required /></label>
    <div className="request-form-grid">
      <label><span>이메일</span><input name="email" type="email" maxLength={120} autoComplete="email" defaultValue={initialMember?.email ?? ""} required /></label>
      <label><span>전화번호</span><input name="phone" type="tel" maxLength={40} autoComplete="tel" defaultValue={initialMember?.phone ?? ""} required /></label>
    </div>
    <label><span>직장 또는 하는 일</span><input name="occupation" type="text" maxLength={240} required /></label>
    <label><span>가족사항</span><textarea name="familyInfo" rows={3} maxLength={1000} required /></label>
    <label><span>임마누엘교회를 알게 된 경로</span><input name="referral" type="text" maxLength={500} required /></label>
    <fieldset className="new-family-registration-section">
      <legend>인도자 정보 <small>선택</small></legend>
      <div className="request-form-grid">
        <label><span>인도자 이름</span><input name="guideName" type="text" maxLength={80} /></label>
        <label><span>인도자 전화번호</span><input name="guidePhone" type="tel" maxLength={40} /></label>
      </div>
      <label><span>인도자와의 관계</span><input name="guideRelation" type="text" maxLength={160} /></label>
    </fieldset>

    {cardType === "registration" && <fieldset className="new-family-registration-section">
      <legend>등록카드 · 신앙 경력</legend>
      <fieldset className="request-choice-group"><legend>현재 신앙 상태</legend>
        <label className="request-radio"><input type="radio" name="faithStatus" value="교회가 처음" required checked={faithStatus === "교회가 처음"} onChange={(event) => setFaithStatus(event.target.value)} /><span>교회가 처음</span></label>
        <label className="request-radio"><input type="radio" name="faithStatus" value="신앙생활을 쉬다가 다시 시작" checked={faithStatus === "신앙생활을 쉬다가 다시 시작"} onChange={(event) => setFaithStatus(event.target.value)} /><span>신앙생활을 쉬다가 다시 시작</span></label>
        <label className="request-radio"><input type="radio" name="faithStatus" value="타 교회에서 이전" checked={faithStatus === "타 교회에서 이전"} onChange={(event) => setFaithStatus(event.target.value)} /><span>타 교회에서 이전</span></label>
      </fieldset>
      <fieldset className="request-choice-group"><legend>신앙 년수</legend>
        <label className="request-radio"><input type="radio" name="faithYears" value="처음" required /><span>처음</span></label>
        <label className="request-radio"><input type="radio" name="faithYears" value="2년 미만" /><span>2년 미만</span></label>
        <label className="request-radio"><input type="radio" name="faithYears" value="2년 이상 5년 이하" /><span>2년 이상 5년 이하</span></label>
        <label className="request-radio"><input type="radio" name="faithYears" value="5년 이상 10년 미만" /><span>5년 이상 10년 미만</span></label>
        <label className="request-radio"><input type="radio" name="faithYears" value="10년 이상" /><span>10년 이상</span></label>
        <label className="request-radio"><input type="radio" name="faithYears" value="모태신앙" /><span>모태신앙</span></label>
      </fieldset>
      {faithStatus && faithStatus !== "교회가 처음" && <>
        <label><span>이전 교회 이름</span><input name="previousChurchName" type="text" maxLength={240} required /></label>
        <label><span>이전 교회 및 신앙 경력</span><textarea name="faithHistory" rows={3} maxLength={1200} required /></label>
        <div className="request-form-grid">
          <label><span>이전 교회 직분</span><input name="churchPosition" type="text" maxLength={160} required /></label>
          <label><span>이전 교회 봉사 이력</span><input name="serviceHistory" type="text" maxLength={500} required /></label>
        </div>
      </>}
      <fieldset className="request-choice-group"><legend>세례·침례 여부</legend>
        <label className="request-radio"><input type="radio" name="ordinanceType" value="유아세례" required checked={ordinanceType === "유아세례"} onChange={(event) => setOrdinanceType(event.target.value)} /><span>유아세례</span></label>
        <label className="request-radio"><input type="radio" name="ordinanceType" value="성인세례" checked={ordinanceType === "성인세례"} onChange={(event) => setOrdinanceType(event.target.value)} /><span>성인세례</span></label>
        <label className="request-radio"><input type="radio" name="ordinanceType" value="침례" checked={ordinanceType === "침례"} onChange={(event) => setOrdinanceType(event.target.value)} /><span>침례</span></label>
        <label className="request-radio"><input type="radio" name="ordinanceType" value="받지 않음" checked={ordinanceType === "받지 않음"} onChange={(event) => setOrdinanceType(event.target.value)} /><span>받지 않음</span></label>
      </fieldset>
      {ordinanceType !== "받지 않음" && <label><span>세례·침례 집례 교회</span><input name="ordinanceChurch" type="text" maxLength={240} required={Boolean(ordinanceType)} /></label>}
      <fieldset className="request-choice-group"><legend>관심 있는 참여</legend>
        <label className="request-checkbox"><input type="checkbox" name="participation" value="봉사" /><span>봉사</span></label>
        <label className="request-checkbox"><input type="checkbox" name="participation" value="소그룹" /><span>소그룹</span></label>
      </fieldset>
    </fieldset>}

    <label className="request-form-honeypot" aria-hidden="true"><span>웹사이트</span><input name="website" type="text" tabIndex={-1} autoComplete="off" /></label>
    <div className="request-form-options"><label className="request-checkbox"><input name="consented" type="checkbox" required /><span>새가족 안내와 공동체 연결을 위해 필요한 정보만 사용하며, 외부에 제공하지 않음에 동의합니다.</span></label></div>
    <p className="request-form-privacy">{initialMember ? "로그인한 회원계정과 이 카드가 안전하게 연결됩니다. " : "회원가입 후 로그인하면 이름·연락처가 자동 입력되고 처리 상태를 확인할 수 있습니다. "}작성한 정보는 새가족 안내와 목회적 돌봄을 위해 비공개로 보관합니다.</p>
    <button className="primary-link request-submit" type="submit" disabled={submitState.status === "submitting"}>{submitState.status === "submitting" ? "접수 중…" : `${cardType === "visit" ? "방문카드" : "등록카드"} 보내기`}</button>
    <div className="request-form-status" role="status" aria-live="polite">
      {submitState.status === "success" && <p className="is-success">새가족 카드가 접수되었습니다. 접수번호는 {submitState.receipt}입니다.</p>}
      {submitState.status === "error" && <p className="is-error">{submitState.message}</p>}
    </div>
  </form>;
}
