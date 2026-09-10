import * as orderService from "./order.service.js";

import { asyncHandler } from "../../utils/asyncHandler.js";

export const createOrder = asyncHandler(async (req, res) => {
  const order = await orderService.createOrder(
    req.user._id,
    req.validatedBody
  );

  return res.status(201).json({
    success: true,
    message: "Order created successfully",
    data: order,
  });
});

export const getOrders = asyncHandler(async (req, res) => {
  const orders = await orderService.getOrders(
    req.user._id
  );

  return res.status(200).json({
    success: true,
    count: orders.length,
    data: orders,
  });
});

export const getOrderById = asyncHandler(async (req, res) => {
  const order = await orderService.getOrderById(
    req.user._id,
    req.params.id
  );

  return res.status(200).json({
    success: true,
    data: order,
  });
});