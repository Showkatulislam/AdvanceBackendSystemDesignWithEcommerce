import app from "./app.js";
import { env } from "./config/env.js";
import logger from "./utils/logger.js";

const port = process.env.PORT || 5000;

const server = app.listen(env.port, () => {
  logger.info(`Server is running on port ${env.port}`);
});

export default server;
