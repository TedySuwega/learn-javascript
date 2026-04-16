import { IProductRepository } from "../repositories/productRepository";
import { CreateProductDTO, Product, ProductResponse } from "../types/product";

export class ProductService {
  constructor(private productRepository: IProductRepository) {
    console.log("[Service] ProductService initialized");
  }
    
    // ============ READ OPERATIONS ============
    async getAllProducts(): Promise<ProductResponse[]> {
        console.log("[Service] getAllProducts");

        const products = await this.productRepository.findAll();

        return products.map((product) => this.toProductResponse(product));
    }

    async getProductById(id: number): Promise<ProductResponse> {
        console.log(`[Service] getProductById: ${id}`);

        // Validation
        if (id <= 0) {
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
        console.log("[Service] Data:", JSON.stringify(data));

        // Validation
        this.validateProduct(data);

        const product = await this.productRepository.create(data);

        return this.toProductResponse(product);
    }


    // ============ HELPERS ============
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

    private validateProduct(data: CreateProductDTO): void {
        if (!data.name) {
            throw new Error("Product name is required");
        }
        if (data.name.length < 3) {
            throw new Error("Product name must be at least 3 characters");
        }
        if (data.price <= 0) {
            throw new Error("Product price must be greater than 0");
        }
        if (data.stock <= 0) {
            throw new Error("Product stock must be greater than 0");
        }
        if (data.category.length < 3) {
            throw new Error("Product category must be at least 3 characters");
        }
        if (data.category.length > 100) {
            throw new Error("Product category must be less than 100 characters");
        }
        if (data.category.length > 100) {
            throw new Error("Product category must be less than 100 characters");
        }
        if (data.category.length > 100) {
            throw new Error("Product category must be less than 100 characters");
        }
    }
}