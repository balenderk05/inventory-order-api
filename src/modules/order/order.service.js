import mongoose from "mongoose";

import Order from "./order.model.js";
import Product from "../product/product.model.js";

export const createOrder = async (userId, orderData) => {
  const orderProducts = [];
  let totalAmount = 0;

  for (const item of orderData.products) {
    const { productId, quantity } = item;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      const error = new Error("Invalid product ID");
      error.statusCode = 400;
      throw error;
    }

    // DEBUG
    const beforeProduct = await Product.findById(productId);

    console.log("BEFORE STOCK CHECK:", {
      productId,
      quantity,
      stockQuantity: beforeProduct?.stockQuantity,
      isDeleted: beforeProduct?.isDeleted,
      name: beforeProduct?.name,
    });

    // Atomically check stock and reduce it
    const product = await Product.findOneAndUpdate(
      {
        _id: productId,
        isDeleted: false,
        stockQuantity: {
          $gte: quantity,
        },
      },
      {
        $inc: {
          stockQuantity: -quantity,
        },
      },
      {
        new: true,
      }
    );

    console.log("AFTER STOCK UPDATE:", product);

    if (!product) {
      const existingProduct = await Product.findById(productId);

      if (!existingProduct) {
        const error = new Error(
          `Product not found: ${productId}`
        );
        error.statusCode = 404;
        throw error;
      }

      if (existingProduct.isDeleted) {
        const error = new Error(
          `Product is no longer available: ${existingProduct.name}`
        );
        error.statusCode = 400;
        throw error;
      }

      const error = new Error(
        `Insufficient stock for product: ${existingProduct.name}`
      );
      error.statusCode = 400;
      throw error;
    }

    const subtotal = product.price * quantity;

    totalAmount += subtotal;

    orderProducts.push({
      product: product._id,
      quantity,
      price: product.price,
      subtotal,
    });
  }

  const order = await Order.create({
    user: userId,
    products: orderProducts,
    totalAmount,
    status: "CONFIRMED",
  });

  return await Order.findById(order._id).populate(
    "products.product",
    "name description price category"
  );
};

export const getOrders = async (userId) => {
  return await Order.find({
    user: userId,
  })
    .populate(
      "products.product",
      "name description price category"
    )
    .sort({ createdAt: -1 });
};

export const getOrderById = async (userId, orderId) => {
  if (!mongoose.Types.ObjectId.isValid(orderId)) {
    const error = new Error("Invalid order ID");
    error.statusCode = 400;
    throw error;
  }

  const order = await Order.findOne({
    _id: orderId,
    user: userId,
  }).populate(
    "products.product",
    "name description price category"
  );

  if (!order) {
    const error = new Error("Order not found");
    error.statusCode = 404;
    throw error;
  }

  return order;
};