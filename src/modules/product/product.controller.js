import {
  createProductSchema,
  updateProductSchema,
} from "./product.validator.js";

import * as productService from "./product.service.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import {validate} from "../../middleware/validate.middleware.js";

export const createProduct = asyncHandler(async (req, res) => {
  const validation = createProductSchema.safeParse(req.body);

  if (!validation.success) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: validation.error.issues,
    });
  }

  const product = await productService.createProduct(validation.data);

  return res.status(201).json({
    success: true,
    message: "Product created successfully",
    data: product,
  });
});

export const getProducts = async (req, res) => {
  const result = await productService.getProducts(
    req.validate || req.query
  );

  return res.status(200).json({
    success: true,
    data: result.products,
    pagination: result.pagination,
  });
};

export const getProductById = asyncHandler(async (req, res) => {
  const product = await productService.getProductById(req.params.id);

  return res.status(200).json({
    success: true,
    data: product,
  });
});

export const updateProduct = asyncHandler(async (req, res) => {
  const validation = updateProductSchema.safeParse(req.body);

  if (!validation.success) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: validation.error.issues,
    });
  }

  const product = await productService.updateProduct(
    req.params.id,
    validation.data,
  );

  return res.status(200).json({
    success: true,
    message: "Product updated successfully",
    data: product,
  });
});

export const deleteProduct = asyncHandler(async (req, res) => {
  await productService.deleteProduct(req.params.id);

  return res.status(200).json({
    success: true,
    message: "Product deleted successfully",
  });
});
