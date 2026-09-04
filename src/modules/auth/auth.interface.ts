import type { RefreshToken, User } from "../../prisma/client.js";

export interface AuthInterface {
  findUserByEmail(email: string): Promise<User | null>;
  findUserById(id: string): Promise<User | null>;
  createUser(data: { name: string; email: string; password: string }): Promise<User | null>;
  findRefreshTokenByHash(token: string): Promise<RefreshToken | null>;
  createRefreshToken(data: {
    token: string;
    userId: string;
    expiresAt: Date;
  }): Promise<RefreshToken | null>;
  revokeRefreshToken(id: String): Promise<RefreshToken | null>;
  rotateRefreshToken(data:{oldTokenId:string,newTokenHash:string,userId:string,expiresAt:Date}):Promise<RefreshToken | null>
}
