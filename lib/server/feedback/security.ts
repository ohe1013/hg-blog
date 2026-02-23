import { createHash } from "crypto";

function requiredSalt(): string {
  return process.env.FEEDBACK_PASSWORD_SALT ?? "change-this-password-salt";
}

export function hashGuestbookPassword(rawPassword: string): string {
  const salt = requiredSalt();
  return createHash("sha256")
    .update(`${salt}:${rawPassword}`)
    .digest("hex");
}
