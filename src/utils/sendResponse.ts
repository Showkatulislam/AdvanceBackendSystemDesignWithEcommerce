import type { Response } from "express";
import type { ApiResponse } from "../types/response.js";

const sendResponse = <T>(res: Response, response: ApiResponse<T>) => {
  return res.status(response.statusCode).json(response);
};

export default sendResponse;
