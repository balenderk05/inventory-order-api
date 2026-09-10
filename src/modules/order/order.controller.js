import * as orderService from "./order.service.js";
import { createOrderSchema } from "./order.validator.js";

export const createOrder = async (req, res) => {
  const validation = createOrderSchema.safeParse(req.body);

  if (!validation.success) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: validation.error.issues,
    });
  }

  const order = await orderService.createOrder(
    req.user._id,
    validation.data
  );

  return res.status(201).json({
    success: true,
    message: "Order created successfully",
    data: order,
  });
};


export const getOrders = async (req, res) => {
  const orders = await orderService.getOrders(
    req.user._id
  );

  return res.status(200).json({
    success: true,
    count: orders.length,
    data: orders,
  });
};

export const getOrderById = async (req, res) => {
  const order = await orderService.getOrderById(
    req.user._id,
    req.params.id
  );

  return res.status(200).json({
    success: true,
    data: order,
  });
};