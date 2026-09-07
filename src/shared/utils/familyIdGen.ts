import crypto from "node:crypto";

export const familyIdGen = () => {
  return crypto.randomUUID();
};
export const PasswordResetToken = crypto.randomBytes(32).toString("hex");
