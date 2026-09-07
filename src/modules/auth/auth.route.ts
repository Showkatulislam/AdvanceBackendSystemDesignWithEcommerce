import { Router } from "express";
import { validate } from "../../middlewares/validate.middleware.js";
import {
  changePasswordSchema,
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
} from "./auth.validation.js";
import { authController } from "./auth.controller.js";
import catchAsync from "../../shared/utils/catchAsync.js";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { authRateLimiter, loginRateLimiter, passwordResetRateLimiter } from "../../middlewares/rateLimiter.js";
const router = Router();

router.post("/register",authRateLimiter ,validate(registerSchema), catchAsync(authController.register));

router.post("/login",loginRateLimiter ,validate(loginSchema), catchAsync(authController.login));

router.post("/refresh", authRateLimiter,catchAsync(authController.refreshAccessToken));

router.post(
  "/forgot-password",
  passwordResetRateLimiter
  ,
  validate(forgotPasswordSchema),
  catchAsync(authController.forgotPassword),
);

router.post(
  "/reset-password",
  passwordResetRateLimiter,
  validate(resetPasswordSchema),
  catchAsync(authController.resetPassword),
);

router.post(
  "/change-password",
  authenticate,
  authRateLimiter,
  validate(changePasswordSchema),
  authController.changePassword,
);

router.post("/logout", catchAsync(authController.logout));
router.post("/logout-all", authenticate, catchAsync(authController.logoutAll));

export default router;
