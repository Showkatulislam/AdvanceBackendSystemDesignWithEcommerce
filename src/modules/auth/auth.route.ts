import { Router } from "express";
import { validate } from "../../middlewares/validate.middleware.js";
import { loginSchema, registerSchema } from "./auth.validation.js";
import { authController } from "./auth.controller.js";
import catchAsync from "../../shared/utils/catchAsync.js";
const router = Router();

router.post("/register", validate(registerSchema), catchAsync(authController.register));

router.post("/login", validate(loginSchema), catchAsync(authController.login));

router.post("/refresh",catchAsync(authController.refreshAccessToken))


export default router;
