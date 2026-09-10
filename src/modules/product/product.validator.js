import { z } from "zod";

export const createProductSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Product name must be at least 2 characters")
    .max(100, "Product name must not exceed 100 characters"),

  description: z
    .string()
    .trim()
    .min(1, "Description is required")
    .max(1000, "Description must not exceed 1000 characters"),

  price: z
    .number()
    .nonnegative("Price cannot be negative"),

  stockQuantity: z
    .number()
    .int("Stock quantity must be an integer")
    .nonnegative("Stock quantity cannot be negative"),

  category: z
    .string()
    .trim()
    .min(2, "Category is required")
    .max(50, "Category must not exceed 50 characters")
    .transform((value) => value.toLowerCase()),
});


export const productQuerySchema = z.object({
  search: z
    .string()
    .trim()
    .optional(),

  category: z
    .string()
    .trim()
    .transform((value) => value.toLowerCase())
    .optional(),

  inStock: z
    .enum(["true", "false"])
    .optional(),

  page: z
    .coerce
    .number()
    .int()
    .min(1)
    .default(1),

  limit: z
    .coerce
    .number()
    .int()
    .min(1)
    .max(100)
    .default(10),
});

export const updateProductSchema =
  createProductSchema.partial();