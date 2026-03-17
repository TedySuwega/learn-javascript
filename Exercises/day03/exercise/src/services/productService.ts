// Business logic for users
import { Product, CreateProductInput } from "../types/product";

// Simulated database
let products: Product[] = [];
let nextId = 1;

export function createProduct(input: CreateProductInput): Product {
  const newProduct: Product = {
    id: nextId++,
    name: input.name,
    price: input.price,
    description: input.description,
    stock: input.stock,
    category: input.category,
    isActive: input.isActive,
    createdAt: new Date(),
  };
  products.push(newProduct);
  return newProduct;
}

export function getAllProducts(): Product[] {
  return products;
}

export function getProductById(id: number): Product | undefined {
  return products.find((product) => product.id === id);
}
