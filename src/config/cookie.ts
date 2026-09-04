import type { CookieOptions } from "express";
import { env } from "./env.js";

export const refreshTokenCookieOptions:CookieOptions={
    httpOnly:true,
    secure:env.nodeEnv === "production",
    sameSite:"lax",
    path:"api/v1/auth",
    maxAge:7*60*60*24*1000,
}