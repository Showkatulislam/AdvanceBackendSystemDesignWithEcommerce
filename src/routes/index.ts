import { Router } from "express";
import { AppError } from "../errors/AppError.js";
import sendResponse from "../shared/utils/sendResponse.js";
import { prisma } from "../lib/prisma.js";
import productRouter from "./../modules/product/product.route.js";
import authrouter from "./../modules/auth/auth.route.js";

const router = Router();

router.use("/products", productRouter);
router.use("/auth", authrouter);

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

router.post("/user", async (req, res) => {
  const { name, email, password } = req.body;

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password,
    },
  });

  sendResponse(res, {
    statusCode: 200,
    message: "User create successfully.",
    success: true,
    data: user,
  });
});

export default router;
