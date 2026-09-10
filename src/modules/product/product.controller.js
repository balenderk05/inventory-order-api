import * as productService from "./product.service.js";

import { asyncHandler } from "../../utils/asyncHandler.js";

export const createProduct = asyncHandler(async (req, res) => {
  const product = await productService.createProduct(
    req.validatedBody
  );

  return res.status(201).json({
    success: true,
    message: "Product created successfully",
    data: product,
  });
});

export const getProducts = asyncHandler(async (req, res) => {
  const result = await productService.getProducts(
    req.validatedQuery
  );

  return res.status(200).json({
    success: true,
    data: result.products,
    pagination: result.pagination,
  });
});

export const getProductById = asyncHandler(async (req, res) => {
  const product = await productService.getProductById(
    req.params.id
  );

  return res.status(200).json({
    success: true,
    data: product,
  });
});

export const updateProduct = asyncHandler(async (req, res) => {
  const product = await productService.updateProduct(
    req.params.id,
    req.validatedBody
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