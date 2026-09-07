import { env } from "../../config/env.js";
import { AppError } from "../../errors/AppError.js";
import { familyIdGen, PasswordResetToken } from "../../shared/utils/familyIdGen.js";
import { generateAccessToken } from "../../shared/utils/jwt.js";
import { hashPassword, verifyPassword } from "../../shared/utils/password.helper.js";
import {
  generateRefreshToken,
  getDate,
  hashRefreshtoken,
} from "../../shared/utils/refresh-token.js";
import type { AuthInterface } from "./auth.interface.js";
import { authRepository } from "./auth.repository.js";
import type { LoginInput, RegisterInput } from "./auth.types.js";

class AuthService {
  constructor(private repo: AuthInterface) {}

  register = async (data: RegisterInput) => {
    const email = data.email.toLowerCase().trim();

    const existingUser = await this.repo.findUserByEmail(email);

    if (existingUser) {
      throw new AppError(409, "Email is already Register.");
    }

    const passwordHash = await hashPassword(data.password);

    const user = await this.repo.createUser({
      name: data.name,
      email,
      password: passwordHash,
    });

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
  };
  login = async (data: LoginInput) => {
    const email = data.email.toLowerCase().trim();
    const password = data.password;

    const user = await this.repo.findUserByEmail(email);

    if (!user) {
      throw new AppError(404, "Invalid email or password.");
    }

    const isPasswordValid = await verifyPassword(password, user.password);

    if (!isPasswordValid) {
      throw new AppError(404, "Invalid email or password.");
    }

    if (!user.isActive) {
      throw new AppError(403, "Your account is inactive.");
    }
    const accessToken = generateAccessToken({
      sub: user.id,
      role: user.role,
    });

    const refreshToken = generateRefreshToken();

    const refreshTokenHash = hashRefreshtoken(refreshToken);

    const expiresAt = getDate(env.jwt.refreshExpiresIn);
    const familyId = familyIdGen();

    const resf = await this.repo.createRefreshToken({
      token: refreshTokenHash,
      userId: user.id,
      familyId,
      expiresAt,
    });
    console.log(resf);

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      accessToken,
      refreshToken,
    };
  };

  // forgot password
  forgotPassword = async (email: string): Promise<void> => {
    const user = await this.repo.findUserByEmail(email);

    if (!user) {
      return;
    }

    await authRepository.invalidatePasswordResetToken(user.id);

    const Token = PasswordResetToken;
    const tokenHash = await hashPassword(Token);
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000);

    const resetToken = await this.repo.createPasswordResetToken({
      userId: user.id,
      token: tokenHash,
      expiresAt,
    });
    const token = `${resetToken?.id}.${Token}`;
  };

  //Reset Password Service

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const [tokenId, rawToken] = token.split(".");

    if (!tokenId || !rawToken) {
      throw new AppError(400, "Invalid password reset token.");
    }

    const resetToken = await authRepository.findPasswordResetTokenById(tokenId);

    if (!resetToken) {
      throw new AppError(400, "Invalid password reset token.");
    }
    /*
     * Token already used.
     */
    if (resetToken.usedAt) {
      throw new AppError(400, "Password reset token has already been used");
    }
    /*
     * Token expired.
     */
    if (resetToken.expiresAt.getTime() < Date.now()) {
      throw new AppError(400, "Password reset token has expired");
    }

    const isValid = await verifyPassword(rawToken, resetToken.token);
    if (!isValid) {
      throw new AppError(400, "Invalid password reset token");
    }

    const passwordHash = await hashPassword(newPassword);
    /*
     * Update password,
     * consume token,
     * revoke all sessions
     * inside one transaction.
     */

    await authRepository.completePasswordReset(resetToken.userId, resetToken.id, passwordHash);
  }

  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string,
  ): Promise<void> {
    const user = await authRepository.findUserById(userId);

    if (!user) {
      throw new AppError(404, "User not found.");
    }

    const isOk = await verifyPassword(currentPassword, user.password);

    if (!isOk) {
      throw new AppError(401, "current password is incorrect.");
    }

    const isSame = await verifyPassword(newPassword, user.password);

    if (!isSame) {
      throw new AppError(400, "New Password must be different from current password.");
    }

    const newPasswordHash = await hashPassword(newPassword);

    await authRepository.changePassword(userId, newPasswordHash);

    await authRepository.revokeAllRefreshTokens(userId);
  }

  refreshAccessToken = async (refreshToken: string) => {
    const tokenHash = hashRefreshtoken(refreshToken);

    const storeToken = await this.repo.findRefreshTokenByHash(tokenHash);

    if (!storeToken) {
      throw new AppError(401, "Invalid refresh token.");
    }

    if (storeToken.revokedAt) {
      await this.repo.revokeTokenFamily(storeToken.familyId);
      throw new AppError(401, "Refresh token has been revoked.");
    }

    if (storeToken.expiresAt <= new Date()) {
      throw new AppError(401, "Refresh token has expired.");
    }

    const user = await this.repo.findUserById(storeToken.userId);

    if (!user) {
      throw new AppError(401, "User no longer exists.");
    }

    if (!user.isActive) {
      throw new AppError(403, "Your account is inactive.");
    }

    const newRefreshtoken = generateRefreshToken();
    const newRefreshTokenHash = hashRefreshtoken(newRefreshtoken);

    const expiresAt = getDate(env.jwt.refreshExpiresIn);

    const rotation = await this.repo.rotateRefreshToken({
      oldTokenId: storeToken.id,
      newTokenHash: newRefreshTokenHash,
      userId: user.id,
      familyId: storeToken.familyId,
      expiresAt,
    });

    if (!rotation.consumed) {
      await this.repo.revokeTokenFamily(storeToken.familyId);
      throw new AppError(401, "Refresh token reuse detected.");
    }

    const accessToken = generateAccessToken({
      sub: user.id,
      role: user.role,
    });

    return {
      accessToken,
      refreshToken: newRefreshtoken,
    };
  };
  logout = async (refreshToken: string) => {
    const tokenHash = hashRefreshtoken(refreshToken);

    const storedToken = await this.repo.findRefreshTokenByHash(tokenHash);
    if (!storedToken) {
      return;
    }

    if (storedToken.revokedAt) {
      return;
    }
    await this.repo.revokeRefreshToken(storedToken.id);
  };

  logoutAll = async (userId: string): Promise<void> => {
    await this.repo.revokeAllRefreshTokens(userId);
  };
}

export const authService = new AuthService(authRepository);
