import { string } from "zod";
import type { RefreshToken, User, PasswordResetToken } from "../../prisma/client.js";
import type { createPasswordResetTokenDTO, RotateRefreshTokenResult } from "./auth.types.js";

export interface AuthInterface {
  findUserByEmail(email: string): Promise<User | null>;
  findUserById(id: string): Promise<User | null>;
  createUser(data: { name: string; email: string; password: string }): Promise<User>;
  findRefreshTokenByHash(token: string): Promise<RefreshToken | null>;
  createRefreshToken(data: {
    token: string;
    userId: string;
    familyId: string;
    expiresAt: Date;
  }): Promise<RefreshToken>;
  revokeRefreshToken(id: string): Promise<RefreshToken>;
  rotateRefreshToken(data: {
    oldTokenId: string;
    newTokenHash: string;
    userId: string;
    familyId: string;
    expiresAt: Date;
  }): Promise<RotateRefreshTokenResult>;
  revokeTokenFamily(familyId: string): Promise<{ count: number }>;
  revokeAllRefreshTokens(userId: string): Promise<{ count: number }>;

  createPasswordResetToken(data: createPasswordResetTokenDTO): Promise<PasswordResetToken | null>;
  findPasswordResetTokenById(tokenId: string): Promise<PasswordResetToken | null>;

  invalidatePasswordResetToken(userId: string): Promise<void>;

  markPasswordResetTokenUsed(tokenId: string): Promise<void>;

  updatePassword(userId: string, passwordHash: string): Promise<void>;

  completePasswordReset(userId: string, tokenId: string, passwordHash: string): Promise<void>;

  getUserPasswordHash(userId: string): Promise<string | null>;
  changePassword(userId: string, passwordHash: string): Promise<void>;
}
