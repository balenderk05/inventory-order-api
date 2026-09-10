import express from "express";
import cors from "cors";

import authRoutes from "./modules/auth/auth.route.js";
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

app.use("/api/auth", authRoutes);

export default app;
