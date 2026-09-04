import type { NextFunction, Request, Response } from "express";
import type { ZodObject } from "zod";

export const validate = (schema: ZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await schema.safeParseAsync({
        body: req.body,
        params: req.params,
        query: req.query,
      });

      if (!result.success) {
        return res.status(400).json({
          message: "Validation Error",
          errors: result.error.flatten(),
        });
      }

      if (result.data.body) req.body = result.data.body;
      if (result.data.query) Object.assign(req.query, result.data.query);
      if (result.data.params) Object.assign(req.params, result.data.params);

      return next();
    } catch (error) {
      return next(error);
    }
  };
};
