import { PrismaPg } from "@prisma/adapter-pg";
import { env } from "../config/env.js";
import { PrismaClient } from "../../generated/prisma/client.js";
const adapter = new PrismaPg({
  connectionString: env.database.url,
});

export const prisma = new PrismaClient({
  adapter,
  log: env.nodeEnv === "development" ? ["query", "info", "warn", "error"] : ["warn", "error"],
});
