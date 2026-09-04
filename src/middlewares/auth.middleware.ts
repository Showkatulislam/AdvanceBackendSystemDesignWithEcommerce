import type { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/AppError.js";
import { verifyAccessToken } from "../shared/utils/jwt.js";

export const authenticate = (req: Request, _res: Response, next: NextFunction) => {
  const autherization = req.headers.authorization;

  if (!autherization) {
    throw new AppError(401, "Authentication required.");
  }
  const [schema, token] = autherization.split(" ");

  if (schema !== "Bearer" || !token) {
    throw new AppError(401, "Invalid authorization header");
  }

  try {
    const payload = verifyAccessToken(token);
    req.user = {
      id: payload.sub,
      role: payload.role,
    };
    next();
  } catch (error) {
    throw new AppError(401, "Invalid or expired access token");
  }
};
