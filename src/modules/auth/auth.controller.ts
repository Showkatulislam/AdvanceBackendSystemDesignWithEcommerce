import type { Request, Response } from "express";
import { authService } from "./auth.service.js";
import sendResponse from "../../shared/utils/sendResponse.js";
import { refreshTokenCookieOptions } from "../../config/cookie.js";
import { AppError } from "../../errors/AppError.js";
import httpStatus from "http-status";

const register = async (req: Request, res: Response) => {
  const result = await authService.register(req.body);

  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "User registered successfully.",
    data: result,
  });
};

const login = async (req: Request, res: Response) => {
  const result = await authService.login(req.body);

  res.cookie("refreshToken", result.refreshToken, refreshTokenCookieOptions);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Login successful",
    data: {
      user: result.user,
      accessToken: result.accessToken,
    },
  });
};

const refreshAccessToken = async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    throw new AppError(401, "Refresh token is required.");
  }

  const result = await authService.refreshAccessToken(refreshToken);

  res.cookie("refreshToken", result.refreshToken, refreshTokenCookieOptions);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Access token refreshed successfully.",
    data: {
      accessToken: result.accessToken,
    },
  });
};

const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  await authService.forgotPassword(req.body.email);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "If the email exists,a password reset link has been send.",
  });
};

const resetPassword = async (req: Request, res: Response): Promise<void> => {
  const { token, newPassword } = req.body;

  await authService.resetPassword(token, newPassword);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Password reset successfully",
    data: null,
  });
};

const logout = async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;
  if (refreshToken) {
    await authService.logout(refreshToken);
  }
  res.clearCookie("refreshToken", refreshTokenCookieOptions);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Logout successful",
    data: null,
  });
};

const logoutAll = async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError(401, "Authentication required.");
  }
  await authService.logoutAll(req.user?.id);

  res.clearCookie("refreshToken", refreshTokenCookieOptions);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Logged out from all devices",
    data: null,
  });
};

const changePassword = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    throw new AppError(401, "Unauthorized.");
  }

  const { currentPassword, newPassword } = req.body;

  await authService.changePassword(userId, currentPassword, newPassword);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Password changed successfully. Please login again.",
    data: null,
  });
};
export const authController = {
  register,
  login,
  refreshAccessToken,
  logout,
  logoutAll,
  forgotPassword,
  resetPassword,
  changePassword,
};
