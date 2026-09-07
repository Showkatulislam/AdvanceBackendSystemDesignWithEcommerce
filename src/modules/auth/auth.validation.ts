import { z } from "zod";

export const registerSchema = z.object({
  body: z.object({
    name: z
      .string()
      .trim()
      .min(2, "Name must be at least 2 characters.")
      .max(100, "Name can't exceed 100 characters"),
    email: z.string().trim().email("Invalid email address.").toLowerCase(),
    password: z.string().min(8, "Password must be at least 8 characters."),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().trim().email("Invalid email address.").toLowerCase(),
    password: z.string().min(1, "Password is required."),
  }),
});

export const forgotPasswordSchema = z.object({
  body: z.object({
    email: z.email("Invalid email address."),
  }),
});

export const resetPasswordSchema = z.object({
  body: z.object({
    token: z.string().min(1, "Reset token is required."),
    newPassword: z.string().min(8, "Password must be least 8 characters."),
  }),
});

export const changePasswordSchema = z.object({
  body: z.object({
    currentPassword: z.string().min(1, "Current password is required."),
    newPassword: z.string().min(8, "new password in required."),
  }),
});
