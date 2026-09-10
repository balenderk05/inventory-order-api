import express from "express";

import { authenticate } from "../../middleware/auth.middleware.js";

import {
  createOrder,
  getOrders,
  getOrderById,
} from "./order.controller.js";

const router = express.Router();

router.use(authenticate);

router.post("/", createOrder);

router.get("/", getOrders);

router.get("/:id", getOrderById);

export default router;