import express from "express";

import { authenticate } from "../../middleware/auth.middleware.js";
import { validate } from "../../middleware/validate.middleware.js";

import {
  createOrder,
  getOrders,
  getOrderById,
} from "./order.controller.js";

import { createOrderSchema } from "./order.validator.js";

const router = express.Router();

router.use(authenticate);

router.post(
  "/",
  validate(createOrderSchema),
  createOrder
);

router.get("/", getOrders);

router.get("/:id", getOrderById);

export default router;