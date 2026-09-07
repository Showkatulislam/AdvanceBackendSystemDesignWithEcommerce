import { prisma } from "../../lib/prisma.js";
import type { PasswordResetToken, RefreshToken, User } from "../../prisma/client.js";
import type { AuthInterface } from "./auth.interface.js";
import type { createPasswordResetTokenDTO, RotateRefreshTokenResult } from "./auth.types.js";

class AuthRepository implements AuthInterface {
  async findUserByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: {
        email,
      },
    });
  }
  async findUserById(id: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: {
        id,
      },
    });
  }

  async createUser(data: { name: string; email: string; password: string }): Promise<User> {
    return prisma.user.create({
      data,
    });
  }

  async findRefreshTokenByHash(token: string): Promise<RefreshToken | null> {
    return prisma.refreshToken.findUnique({
      where: {
        token,
      },
    });
  }
  async createRefreshToken(data: {
    token: string;
    userId: string;
    familyId: string;
    expiresAt: Date;
  }): Promise<RefreshToken> {
    return prisma.refreshToken.create({
      data,
    });
  }

  async revokeRefreshToken(id: string): Promise<RefreshToken> {
    return prisma.refreshToken.update({
      where: {
        id,
      },
      data: {
        revokedAt: new Date(),
      },
    });
  }
  async rotateRefreshToken(data: {
    oldTokenId: string;
    newTokenHash: string;
    userId: string;
    familyId: string;
    expiresAt: Date;
  }): Promise<RotateRefreshTokenResult> {
    return prisma.$transaction(async (tx) => {
      const result = await tx.refreshToken.updateMany({
        where: {
          id: data.oldTokenId,
          revokedAt: null,
        },
        data: {
          revokedAt: new Date(),
        },
      });

      if (result.count === 0) {
        return {
          token: null as never,
          consumed: false,
        };
      }

      const newToken = await tx.refreshToken.create({
        data: {
          token: data.newTokenHash,
          userId: data.userId,
          familyId: data.familyId,
          expiresAt: data.expiresAt,
        },
      });
      return {
        token: newToken,
        consumed: true,
      };
    });
  }
  async revokeTokenFamily(familyId: string): Promise<{ count: number }> {
    return prisma.refreshToken.updateMany({
      where: {
        familyId,
        revokedAt: null,
      },
      data: {
        revokedAt: new Date(),
      },
    });
  }

  async revokeAllRefreshTokens(userId: string): Promise<{ count: number }> {
    return prisma.refreshToken.updateMany({
      where: {
        userId,
        revokedAt: null,
      },
      data: {
        revokedAt: new Date(),
      },
    });
  }

  async createPasswordResetToken(
    data: createPasswordResetTokenDTO,
  ): Promise<PasswordResetToken | null> {
    return prisma.passwordResetToken.create({
      data,
    });
  }

  async findPasswordResetTokenById(tokenId: string): Promise<PasswordResetToken | null> {
    return await prisma.passwordResetToken.findUnique({
      where: {
        id: tokenId,
      },
    });
  }

  async invalidatePasswordResetToken(userId: string): Promise<void> {
    await prisma.passwordResetToken.updateMany({
      where: {
        userId,
        usedAt: null,
      },
      data: {
        usedAt: new Date(),
      },
    });
  }

  async markPasswordResetTokenUsed(tokenId: string): Promise<void> {
    await prisma.passwordResetToken.update({
      where: {
        id: tokenId,
      },
      data: {
        usedAt: new Date(),
      },
    });
  }

  async updatePassword(userId: string, passwordHash: string): Promise<void> {
    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        password: passwordHash,
      },
    });
  }
  async completePasswordReset(
    userId: string,
    tokenId: string,
    passwordHash: string,
  ): Promise<void> {
    await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: {
          id: userId,
        },
        data: {
          password: passwordHash,
        },
      });

      await tx.passwordResetToken.update({
        where: {
          id: tokenId,
        },
        data: {
          usedAt: new Date(),
        },
      });

      await tx.refreshToken.updateMany({
        where: {
          userId,
          revokedAt: null,
        },
        data: {
          revokedAt: new Date(),
        },
      });
    });
  }

  async getUserPasswordHash(userId: string): Promise<string | null> {
    const result = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        password: true,
      },
    });
    return result?.password ?? null;
  }

  async changePassword(userId: string, passwordHash: string): Promise<void> {
    await prisma.user.update({
      where: { id: userId },
      data: { password: passwordHash },
    });
  }
}

export const authRepository = new AuthRepository();
