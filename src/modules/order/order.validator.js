import { z } from "zod";

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

export const createOrderSchema = z.object({
  products: z
    .array(
      z.object({
        productId: z
          .string()
          .regex(objectIdRegex, "Invalid product ID"),

        quantity: z
          .number()
          .int("Quantity must be an integer")
          .min(1, "Quantity must be at least 1"),
      })
    )
    .min(1, "Order must contain at least one product")
    .superRefine((products, ctx) => {
      const productIds = products.map(
        (item) => item.productId
      );

      const uniqueProductIds = new Set(productIds);

      if (uniqueProductIds.size !== productIds.length) {
        ctx.addIssue({
          code: "custom",
          message: "Duplicate products are not allowed",
          path: ["products"],
        });
      }
    }),
});