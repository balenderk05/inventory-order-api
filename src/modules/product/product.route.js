import express from "express";

import { authenticate } from "../../middleware/auth.middleware.js";
import { validate } from "../../middleware/validate.middleware.js";

import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "./product.controller.js";

import {
  createProductSchema,
  updateProductSchema,
  productQuerySchema,
} from "./product.validator.js";

const router = express.Router();

// Get products
router.get(
  "/",
  validate(productQuerySchema, "query"),
  getProducts
);

// Get single product
router.get("/:id", getProductById);

// Create product
router.post(
  "/",
  authenticate,
  validate(createProductSchema),
  createProduct
);

// Update product
router.patch(
  "/:id",
  authenticate,
  validate(updateProductSchema),
  updateProduct
);

// Soft delete product
router.delete(
  "/:id",
  authenticate,
  deleteProduct
);

export default router;