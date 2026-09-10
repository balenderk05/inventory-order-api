import express from "express";
import cors from "cors";

import authRoutes from "./modules/auth/auth.route.js";
import productRoutes from "./modules/product/product.route.js";
import { errorHandler } from "./middleware/error.middleware.js";
import orderRoutes from "./modules/order/order.route.js";
const app = express();

// CORS
app.use(cors());

// Parse JSON
app.use(express.json());

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Inventory Order API is running",
  });
});

app.use("/v1/api/auth", authRoutes);
app.use("/v1/api/products", productRoutes);
app.use("/v1/api/orders", orderRoutes);

app.use(errorHandler);

export default app;
