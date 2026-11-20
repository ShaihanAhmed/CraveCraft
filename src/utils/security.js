// Demonstration only: normalize and limit plain-text input.
// Do not treat this as a complete XSS defense. React escapes text rendered in JSX.
export function cleanPlainText(value, maxLength = 80) {
  return String(value ?? "")
    .normalize("NFKC")
    .replace(/[<>]/g, "")
    .replace(/[\u0000-\u001F\u007F]/g, "")
    .trim()
    .slice(0, maxLength);
}

export function containsSuspiciousMarkup(value) {
  return /<\s*script|javascript\s*:|onerror\s*=|onload\s*=/i.test(
    String(value ?? ""),
  );
}
