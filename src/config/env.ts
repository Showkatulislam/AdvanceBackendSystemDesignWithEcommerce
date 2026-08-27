import "dotenv/config";
import { z } from "zod";
import logger from "../utils/logger.js";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),

  PORT: z.coerce.number().int().positive().default(5000),

  DATABASE_URL: z.string().min(1),

  JWT_ACCESS_SECRET: z.string().min(5),
  JWT_ACCESS_EXPIRES_IN: z.string().min(1),

  JWT_REFRESH_SECRET: z.string().min(5),
  JWT_REFRESH_EXPIRES_IN: z.string().min(1),

  CORS_ORIGIN: z.string().min(1),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  logger.error("❌ Invalid environment variables:");
  logger.error(`${parsedEnv.error.flatten().fieldErrors}`);

  process.exit(1);
}

export const env = {
  nodeEnv: parsedEnv.data.NODE_ENV,

  port: parsedEnv.data.PORT,

  database: {
    url: parsedEnv.data.DATABASE_URL,
  },

  jwt: {
    accessSecret: parsedEnv.data.JWT_ACCESS_SECRET,
    accessExpiresIn: parsedEnv.data.JWT_ACCESS_EXPIRES_IN,

    refreshSecret: parsedEnv.data.JWT_REFRESH_SECRET,
    refreshExpiresIn: parsedEnv.data.JWT_REFRESH_EXPIRES_IN,
  },

  cors: {
    origin: parsedEnv.data.CORS_ORIGIN,
  },
};
