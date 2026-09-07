import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import routes from "./routes/index.js";
import globalErrorHandler from "./middlewares/globalErrorHandler.js";
import requestLogger from "./middlewares/requestLogger.js";
import { globalRateLimiter } from "./middlewares/rateLimiter.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieParser());

app.use(requestLogger);

app.use(globalRateLimiter)

app.use("/api/v1", routes);

app.use(globalErrorHandler);

export default app;
