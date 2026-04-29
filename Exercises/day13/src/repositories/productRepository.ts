import { Product, CreateProductDTO } from "../types/product";

export interface IProductRepository {
  findAll(): Promise<Product[]>;
  findById(id: number): Promise<Product | null>;
  create(data: CreateProductDTO): Promise<Product>;
}

function now(): Date {
  return new Date();
}

let nextId = 4;
let products: Product[] = [
  {
    id: 1,
    name: "Starter Keyboard",
    price: 49.99,
    stock: 25,
    category: "Electronics",
    createdAt: now(),
    updatedAt: now(),
  },
  {
    id: 2,
    name: "Desk Lamp",
    price: 29.5,
    stock: 40,
    category: "Home",
    createdAt: now(),
    updatedAt: now(),
  },
  {
    id: 3,
    name: "Notebook Set",
    price: 12,
    stock: 100,
    category: "Stationery",
    createdAt: now(),
    updatedAt: now(),
  },
];

export class ProductRepository implements IProductRepository {
  async findAll(): Promise<Product[]> {
    console.log("[Repository] product findAll");
    return [...products];
  }

  async findById(id: number): Promise<Product | null> {
    console.log(`[Repository] product findById: ${id}`);
    return products.find((p) => p.id === id) ?? null;
  }

  async create(data: CreateProductDTO): Promise<Product> {
    console.log("[Repository] product create");

    const created: Product = {
      id: nextId++,
      name: data.name.trim(),
      price: data.price,
      stock: data.stock,
      category: data.category.trim(),
      createdAt: now(),
      updatedAt: now(),
    };

    products = [...products, created];
    return created;
  }
}

export const productRepository = new ProductRepository();
