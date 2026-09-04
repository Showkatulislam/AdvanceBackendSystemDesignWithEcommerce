import type { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/AppError.js";
import logger from "../shared/utils/logger.js";

const globalErrorHandler = (err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  if (err instanceof AppError) {
    logger.warn(err.message);
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }
  logger.error("Unexpected error occurred", err);

  return res.status(500).json({
    success: false,
    message: "Internal server error",
  });
};

export default globalErrorHandler;
