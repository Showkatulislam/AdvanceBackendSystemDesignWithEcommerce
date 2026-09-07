import type { NextFunction, Request } from "express";
import type { Role } from "../../generated/prisma/client.js";
import { AppError } from "../errors/AppError.js";
import httpStatus from "http-status";

export const authorize = (...allowedRoles: Role[]) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw new AppError(httpStatus.UNAUTHORIZED, "Authentication required.");
    }
    if (!allowedRoles.includes(req.user.role)) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        "You do not have permission to perform this action.",
      );
    }
    next();
  };
};
