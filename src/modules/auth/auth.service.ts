import { AppError } from "../../errors/AppError.js";
import { generateAccessToken } from "../../shared/utils/jwt.js";
import { hashPassword, verifyPassword } from "../../shared/utils/password.helper.js";
import { generateRefreshToken, getDate, hashRefreshtoken } from "../../shared/utils/refresh-token.js";
import type { AuthInterface } from "./auth.interface.js";
import { auhtRepository } from "./auth.repository.js";
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
      id: user?.id,
      name: user?.name,
      email: user?.email,
      role: user?.role,
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
      throw new AppError(404, "Invalid email or passwrod.");
    }

    if (!user.isActive) {
      throw new AppError(403, "Your account is inactive.");
    }
    const accessToken = generateAccessToken({
      sub: user.id,
      role: user.role,
    });

    const refreshToken = generateRefreshToken()

    const refreshTokenHash = hashRefreshtoken(refreshToken);

    const expiresAt = getDate(7);

    const resf=await this.repo.createRefreshToken({
        token:refreshTokenHash,
        userId:user.id,
        expiresAt
    })
    console.log(resf)


    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      accessToken,
      refreshToken
    };
  };
  refreshAccessToken=async(refreshToken:string)=>{
    const tokenHash = hashRefreshtoken(refreshToken);

    const storeToken = await this.repo.findRefreshTokenByHash(tokenHash);

    if(!storeToken){
        throw new AppError(401,"Invalid refresh token.")
    }

    if(storeToken.revokedAt){
        throw new AppError(401,"Refresh token has been revoked.")
    }

    if(storeToken.expiresAt<=new Date()){
        throw new AppError(401,"Refresh token has expired.")
    }

    const user = await this.repo.findUserById(storeToken.userId)

    if(!user){
        throw new AppError(401,"User no longer exists.")
    }

    if(!user.isActive){
        throw new AppError(403,"Your account is inactive.")
    }

    const newRefreshtoken = generateRefreshToken()
    const newRefreshTokenHash = hashRefreshtoken(newRefreshtoken);

    const expiresAt = getDate(7);

    await this.repo.rotateRefreshToken({
        oldTokenId:storeToken.id,
        newTokenHash:newRefreshTokenHash,
        userId:user.id,
        expiresAt
    })

    const accessToken = generateAccessToken({
        sub:user.id,
        role:user.role
    })

    return {
        accessToken,
        refreshToken:newRefreshtoken
    }

  }
}

export const authService = new AuthService(auhtRepository);
