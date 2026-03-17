// REPOSITORY LAYER - Talks to database
import { Product, CreateProductDTO } from "../types/product";

// Simulated database
let products: Product[] = [];
let nextId = 1;

export const productRepository = {
  // Create a new product in database
  create(data: CreateProductDTO): Product {
    const newProduct: Product = {
      id: nextId++,
      name: data.name,
      price: data.price,
      description: data.description,
      stock: data.stock,
      category: data.category,
      isActive: data.isActive,
      createdAt: new Date(),
    };
    products.push(newProduct);
    console.log("[Repository] Product saved to database");
    return newProduct;
  },

  // Find product by name
  findByName(name: string): Product | undefined {
    console.log("[Repository] Searching for name:", name);
    return products.find((product) => product.name === name);
  },

  // Find product by ID
  findById(id: number): Product | undefined {
    console.log("[Repository] Searching for ID:", id);
    return products.find((product) => product.id === id);
  },

  // Get all products
  findAll(): Product[] {
    console.log("[Repository] Getting all products");
    return products;
  },
};
