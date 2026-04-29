import { IProductRepository } from "../repositories/productRepository";
import {
  CreateProductDTO,
  Product,
  ProductResponse,
} from "../types/product";

export class ProductService {
  constructor(private productRepository: IProductRepository) {
    console.log("[Service] ProductService initialized");
  }

  async getAllProducts(): Promise<ProductResponse[]> {
    console.log("[Service] getAllProducts");
    const rows = await this.productRepository.findAll();
    return rows.map((p) => this.toProductResponse(p));
  }

  async getProductById(id: number): Promise<ProductResponse> {
    console.log(`[Service] getProductById: ${id}`);

    if (Number.isNaN(id) || id <= 0) {
      throw new Error("Invalid product ID");
    }

    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new Error("Product not found");
    }

    return this.toProductResponse(product);
  }

  async createProduct(data: CreateProductDTO): Promise<ProductResponse> {
    console.log("[Service] createProduct");
    this.validateCreate(data);

    const product = await this.productRepository.create(data);
    return this.toProductResponse(product);
  }

  private toProductResponse(product: Product): ProductResponse {
    return {
      id: product.id,
      name: product.name,
      price: product.price,
      stock: product.stock,
      category: product.category,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };
  }

  private validateCreate(data: CreateProductDTO): void {
    if (!data.name || data.name.trim().length < 2) {
      throw new Error("Product name is required and must be at least 2 characters");
    }
    if (data.price === undefined || data.price <= 0) {
      throw new Error("Product price must be greater than 0");
    }
    if (data.stock === undefined || data.stock < 0) {
      throw new Error("Product stock must be 0 or greater");
    }
    if (!data.category || data.category.trim().length < 2) {
      throw new Error("Product category is required and must be at least 2 characters");
    }
  }
}
