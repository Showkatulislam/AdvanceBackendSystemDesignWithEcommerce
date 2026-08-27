import { Router } from "express";
import { AppError } from "../errors/AppError.js";
import sendResponse from "../utils/sendResponse.js";

const router = Router();

router.get("/health", (_req, res) => {
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "E-commerce API is healthy",
    data: null,
  });
});

router.get("/test-error", (_req, res) => {
  throw new AppError(404, "Test resource not found.");
});

export default router;
