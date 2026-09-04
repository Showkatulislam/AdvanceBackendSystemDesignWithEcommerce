import { Router } from "express";
import { productController } from "./product.controller.js";

const router = Router();

router.post("/", productController.create);

router.get("/", productController.getAll);

router.get("/:id", productController.getById);

router.patch("/:id", productController.update);

router.delete("/:id", productController.remove);

export default router;
