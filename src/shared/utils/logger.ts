import { env } from "../../config/env.js";

const logger = {
  info: (message: string, meta?: unknown) => {
    console.log(`[INFO] ${message},`, meta ?? "");
  },
  warn: (message: string, meta?: unknown) => {
    console.warn(`[WARN] ${message}`, meta ?? "");
  },

  error: (message: string, meta?: unknown) => {
    console.error(`[ERROR] ${message}`, meta ?? "");
  },

  debug: (message: string, meta?: unknown) => {
    if (env.nodeEnv === "development") {
      console.debug(`[DEBUG] ${message}`, meta ?? "");
    }
  },
};

export default logger;
