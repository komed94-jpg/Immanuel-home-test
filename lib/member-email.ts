type ResetEmailResult = { configured: boolean; sent: boolean };

export async function sendPasswordResetEmail(input: { email: string; name: string; resetUrl: string }): Promise<ResetEmailResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.MEMBER_EMAIL_FROM;
  if (!apiKey || !from) return { configured: false, sent: false };
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from, to: [input.email], subject: "임마누엘교회 비밀번호 재설정",
      text: `${input.name}님, 아래 주소에서 비밀번호를 다시 설정해 주세요. 이 주소는 30분 동안 한 번만 사용할 수 있습니다.\n\n${input.resetUrl}\n\n본인이 요청하지 않았다면 이 메일을 무시해 주세요.`,
      html: `<p>${escapeHtml(input.name)}님, 임마누엘교회 홈페이지 비밀번호 재설정을 요청하셨습니다.</p><p><a href="${escapeHtml(input.resetUrl)}">비밀번호 다시 설정하기</a></p><p>이 주소는 30분 동안 한 번만 사용할 수 있습니다. 본인이 요청하지 않았다면 이 메일을 무시해 주세요.</p>`,
    }),
  });
  return { configured: true, sent: response.ok };
}

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character] ?? character);
}
