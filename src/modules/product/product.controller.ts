import type { Request, Response } from "express";
import sendResponse from "../../shared/utils/sendResponse.js";

const create = async (req: Request, res: Response) => {
  const data = req.body;

  sendResponse(res, {
    success: true,
    message: "Product is created",
    statusCode: 200,
  });
};

const getAll = async (req: Request, res: Response) => {
  sendResponse(res, {
    success: true,
    message: "Product retrieved.",
    statusCode: 200,
  });
};

const getById = async (req: Request, res: Response) => {
  const { id } = req.params;

  sendResponse(res, {
    success: true,
    message: "Product retrieved.",
    statusCode: 2000,
  });
};

const update = async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = req.body;

  sendResponse(res, {
    success: true,
    message: "Product update",
    statusCode: 200,
  });
};

const remove = async (req: Request, res: Response) => {
  const { id } = req.params;

  sendResponse(res, {
    success: true,
    message: "Product deleted",
    statusCode: 200,
  });
};

export const productController = {
  create,
  getAll,
  getById,
  update,
  remove,
};
