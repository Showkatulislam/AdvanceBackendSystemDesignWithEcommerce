import crypto from "node:crypto";
import { number } from "zod";

export const generateRefreshToken = (): string => {
  return crypto.randomBytes(64).toString();
};

export const hashRefreshtoken = (token: string): string => {
  return crypto.createHash("sha256").update(token).digest("hex");
};

export const getDate = (day: string) => {
  const dayInNumber = Number(day);
  return new Date(Date.now() + dayInNumber * 24 * 60 * 60 * 1000);
};
