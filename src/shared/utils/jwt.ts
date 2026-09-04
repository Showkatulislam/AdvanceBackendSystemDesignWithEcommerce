import jwt, { type SignOptions } from "jsonwebtoken";
import { env } from "../../config/env.js";

export interface AccessTokenPayload {
  sub: string;
  role: "USER" | "SELLER" | "ADMIN";
}

export const generateAccessToken = (payload: AccessTokenPayload): string => {
  const options: SignOptions = {
    expiresIn: env.jwt.accessExpiresIn as NonNullable<SignOptions["expiresIn"]>,
  };
  return jwt.sign(payload, env.jwt.accessSecret, options);
};

export const verifyAccessToken = (token: string): AccessTokenPayload => {
  return jwt.verify(token, env.jwt.accessSecret) as AccessTokenPayload;
};
