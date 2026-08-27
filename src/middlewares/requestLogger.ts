import type { NextFunction, Request, Response } from "express";
import logger from "../utils/logger.js";

const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const startTime = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - startTime;
    logger.info(`${req.method} ${req.originalUrl} ${req.statusCode} - ${duration}ms`);
  });
  next();
};

export default requestLogger;
