import { string } from "zod";
import { prisma } from "../../lib/prisma.js";
import type { RefreshToken, User } from "../../prisma/client.js";
import type { AuthInterface } from "./auth.interface.js";

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

  async createUser(data: { name: string; email: string; password: string }): Promise<User | null> {
    return prisma.user.create({
      data,
    });
  }

  async findRefreshTokenByHash(token: string): Promise<RefreshToken | null> {
    return prisma.refreshToken.findFirst({
      where: {
        token,
      },
    });
  }
  async createRefreshToken(data: {
    token: string;
    userId: string;
    expiresAt: Date;
  }): Promise<RefreshToken | null> {
    return prisma.refreshToken.create({
      data,
    });
  }

  async revokeRefreshToken(id: string) {
    return prisma.refreshToken.update({
      where: {
        id,
      },
      data: {
        revokedAt: new Date(),
      },
    });
  }
  async rotateRefreshToken(data: { oldTokenId: string; newTokenHash: string; userId: string; expiresAt: Date; }): Promise<RefreshToken | null> {
    return prisma.$transaction(async(tx)=>{

      await tx.refreshToken.update({
        where:{
          id:data.oldTokenId
        },
        data:{
          revokedAt:new Date
        }
      })

      const newToken = await tx.refreshToken.create({
        data:{
          token:data.newTokenHash,
          userId:data.userId,
          expiresAt:data.expiresAt
        }
      })
      return newToken
    })
  }
}

export const auhtRepository = new AuthRepository();
