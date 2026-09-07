import type { RefreshToken } from "../../prisma/client.js";

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
}
export interface LoginInput {
  email: string;
  password: string;
}

export interface RotateRefreshTokenResult {
  token: RefreshToken;
  consumed: boolean;
}

export interface createPasswordResetTokenDTO {
  userId: string;
  token: string;
  expiresAt: Date;
}

export interface ResetPasswordDTO {
  token: string;
  newPassword: string;
}

export interface changePasswordDTO {
  userId: string;
  currentPassword: string;
  newPassword: string;
}
