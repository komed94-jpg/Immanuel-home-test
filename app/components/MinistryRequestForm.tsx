"use client";

import { FormEvent, useState } from "react";

type SubmitState =
  | { status: "idle" }
  | { status: "submitting" }
  | { status: "success"; receipt: string }
  | { status: "error"; message: string };

type MinistryRequestFormProps = {
  requestType: "prayer" | "counseling" | "new-family" | "spirit-ministry" | "bible-conference" | "discipleship" | "community" | "event";
  subjectLabel: string;
  messageLabel: string;
  submitLabel: string;
  privacyMessage: string;
  nameRequired?: boolean;
  contactRequired?: boolean;
  showContactRequest?: boolean;
  fixedSubject?: string;
};

export function MinistryRequestForm({
  requestType,
  subjectLabel,
  messageLabel,
  submitLabel,
  privacyMessage,
  nameRequired = false,
  contactRequired = false,
  showContactRequest = false,
  fixedSubject
}: MinistryRequestFormProps) {
  const [submitState, setSubmitState] = useState<SubmitState>({ status: "idle" });

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitState({ status: "submitting" });

    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = {
      requestType,
      name: formData.get("name"),
      contact: formData.get("contact"),
      subject: fixedSubject ?? formData.get("subject"),
      message: formData.get("message"),
      website: formData.get("website"),
      contactRequested: contactRequired || formData.get("contactRequested") === "on",
      consented: formData.get("consented") === "on"
    };

    try {
      const response = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const result = (await response.json()) as { error?: string; receipt?: string };

      if (!response.ok) {
        throw new Error(result.error ?? "접수 중 오류가 발생했습니다.");
      }

      form.reset();
      setSubmitState({ status: "success", receipt: result.receipt ?? "received" });
    } catch (error) {
      setSubmitState({
        status: "error",
        message: error instanceof Error ? error.message : "접수 중 오류가 발생했습니다."
      });
    }
  }

  return (
    <form className="request-form" onSubmit={handleSubmit}>
      <div className="request-form-grid">
        <label>
          <span>이름 {!nameRequired && <small>선택</small>}</span>
          <input name="name" type="text" maxLength={80} autoComplete="name" required={nameRequired} />
        </label>
        <label>
          <span>연락처 {!contactRequired && <small>선택</small>}</span>
          <input
            name="contact"
            type="text"
            maxLength={120}
            autoComplete="tel"
            placeholder="전화번호 또는 이메일"
            required={contactRequired}
          />
        </label>
      </div>

      {!fixedSubject && (
        <label>
          <span>{subjectLabel}</span>
          <input name="subject" type="text" maxLength={160} required />
        </label>
      )}

      <label>
        <span>{messageLabel}</span>
        <textarea name="message" rows={8} maxLength={5000} required />
      </label>

      <label className="request-form-honeypot" aria-hidden="true">
        <span>웹사이트</span>
        <input name="website" type="text" tabIndex={-1} autoComplete="off" />
      </label>

      <div className="request-form-options">
        {showContactRequest && (
          <label className="request-checkbox">
            <input name="contactRequested" type="checkbox" />
            <span>목회자의 연락을 원합니다.</span>
          </label>
        )}
        <label className="request-checkbox">
          <input name="consented" type="checkbox" required />
          <span>요청 접수를 위한 개인정보 수집·이용에 동의합니다.</span>
        </label>
      </div>

      <p className="request-form-privacy">{privacyMessage}</p>

      <button
        className="primary-link request-submit"
        type="submit"
        disabled={submitState.status === "submitting"}
      >
        {submitState.status === "submitting" ? "접수 중…" : submitLabel}
      </button>

      <div className="request-form-status" role="status" aria-live="polite">
        {submitState.status === "success" && (
          <p className="is-success">
            요청이 접수되었습니다. 접수번호는 {submitState.receipt}입니다.
          </p>
        )}
        {submitState.status === "error" && <p className="is-error">{submitState.message}</p>}
      </div>
    </form>
  );
}
