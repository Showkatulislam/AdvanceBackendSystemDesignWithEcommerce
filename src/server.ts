import app from "./app.js";
import { env } from "./config/env.js";
import { prisma } from "./lib/prisma.js";
import logger from "./shared/utils/logger.js";
const startServer = async () => {
  try {
    await prisma.$connect();
    logger.info("Database connected successfully.");

    const server = app.listen(env.port, () => {
      logger.info(`Sever running on port ${env.port}`);
    });

    const shutdown = async (signal: string) => {
      logger.info(`${signal} recieved. shutting down ...`);
      server.close(async () => {
        await prisma.$disconnect();
        logger.info(`Database disconnected.`);
        logger.info("Server closed.");
        process.exit(0);
      });
    };
    process.on("SIGTERM", () => shutdown("SIGTERM"));
    process.on("SIGINT", () => shutdown("SIGINT"));
  } catch (error) {
    logger.error("Application startup failed:", error);
    await prisma.$disconnect();
    process.exit(1);
  }
};

startServer();
