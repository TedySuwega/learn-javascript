// SERVICE LAYER - Business logic
import { productRepository } from "../repositories/productRepository";
import { CreateProductDTO, ProductResponse } from "../types/product";


export const productService = {
  // Register a new product
  register(data: CreateProductDTO): ProductResponse {
    console.log("[Service] Processing registration");

    // Business logic: Check if product already exists
    const existingProduct = productRepository.findByName(data.name);
    if (existingProduct) {
      throw new Error("Product already exists");
    }

    // Call repository to save
    const product = productRepository.create({
      name: data.name,
      price: data.price,
      description: data.description,
      stock: data.stock,
      category: data.category,
      isActive: data.isActive,
    });

    // Return product
    return {
      id: product.id,
      name: product.name,
      price: product.price,
      description: product.description,
      stock: product.stock,
      category: product.category,
      isActive: product.isActive,
      createdAt: product.createdAt,
    };
  },

  // Get product by ID
  getById(id: number): ProductResponse | null {
    console.log("[Service] Getting product by ID");
    const product = productRepository.findById(id);

    if (!product) {
      return null;
    }

    // Return product
    return {
      id: product.id,
      name: product.name,
      price: product.price,
      description: product.description,
      stock: product.stock,
      category: product.category,
      isActive: product.isActive,
      createdAt: product.createdAt,
    };
  },

  // Get all products
  getAll(): ProductResponse[] {
    console.log("[Service] Getting all products");
    const products = productRepository.findAll();

    // Return products
    return products.map((product) => ({
      id: product.id,
      name: product.name,
      price: product.price,
      description: product.description,
      stock: product.stock,
      category: product.category,
      isActive: product.isActive,
      createdAt: product.createdAt,
    }));
  },
};
