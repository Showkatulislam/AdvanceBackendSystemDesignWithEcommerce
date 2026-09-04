import crypto from "node:crypto";

export const generateRefreshToken = (): string => {
  return crypto.randomBytes(64).toString();
};

export const hashRefreshtoken = (token: string): string => {
  return crypto.createHash("sha256").update(token).digest("hex");
};

export const getDate = (day: number) => {
  return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
};
