export function normalizePhone(value: unknown) {
  if (typeof value !== "string") return "";

  let digits = value.replace(/\D/g, "");

  // Convert Korean international numbers (+82 / 0082) back to domestic form.
  // +82 10 1234 5678 -> 01012345678
  if (digits.startsWith("0082") && digits.length > 4) {
    digits = digits.slice(4);
    if (!digits.startsWith("0")) digits = `0${digits}`;
  } else if (digits.startsWith("82") && digits.length > 10) {
    digits = digits.slice(2);
    if (!digits.startsWith("0")) digits = `0${digits}`;
  }

  return digits.slice(0, 20);
}

export function isKoreanMobile(value: unknown) {
  return /^01\d{8,9}$/.test(normalizePhone(value));
}

export function formatPhone(value: unknown) {
  const digits = normalizePhone(value);
  if (digits.length === 11 && digits.startsWith("01")) {
    return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
  }
  if (digits.length === 10 && digits.startsWith("01")) {
    return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  return digits;
}
