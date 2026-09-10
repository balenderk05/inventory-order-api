import mongoose from "mongoose";

import Product from "./product.model.js";

export const createProduct = async (productData) => {
  return await Product.create(productData);
};

export const getProducts = async ({
  search,
  category,
  inStock,
  page = 1,
  limit = 10,
}) => {
  // Safety: page and limit ko valid numbers ensure karo
  page = Number(page) || 1;
  limit = Number(limit) || 10;

  const filter = {
    isDeleted: false,
  };

  // Search by product name
  if (search) {
    const escapedSearch = search.replace(
      /[.*+?^${}()|[\]\\]/g,
      "\\$&"
    );

    filter.name = {
      $regex: escapedSearch,
      $options: "i",
    };
  }

  // Category filter
  if (category) {
    filter.category = category.toLowerCase();
  }

  // Stock filter
  if (inStock === "true" || inStock === true) {
    filter.stockQuantity = {
      $gt: 0,
    };
  }

  if (inStock === "false" || inStock === false) {
    filter.stockQuantity = 0;
  }

  const skip = (page - 1) * limit;

  const [products, total] = await Promise.all([
    Product.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),

    Product.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    products,

    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
  };
};

export const getProductById = async (productId) => {
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    const error = new Error("Invalid product ID");
    error.statusCode = 400;
    throw error;
  }

  const product = await Product.findOne({
    _id: productId,
    isDeleted: false,
  });

  if (!product) {
    const error = new Error("Product not found");
    error.statusCode = 404;
    throw error;
  }

  return product;
};
export const updateProduct = async (
  productId,
  productData
) => {
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    const error = new Error("Invalid product ID");
    error.statusCode = 400;
    throw error;
  }

  const product = await Product.findOneAndUpdate(
    {
      _id: productId,
      isDeleted: false,
    },
    productData,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!product) {
    const error = new Error("Product not found");
    error.statusCode = 404;
    throw error;
  }

  return product;
};

export const deleteProduct = async (productId) => {
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    const error = new Error("Invalid product ID");
    error.statusCode = 400;
    throw error;
  }

  const product = await Product.findOneAndUpdate(
    {
      _id: productId,
      isDeleted: false,
    },
    {
      isDeleted: true,
    },
    {
      new: true,
    }
  );

  if (!product) {
    const error = new Error("Product not found");
    error.statusCode = 404;
    throw error;
  }

  return product;
};