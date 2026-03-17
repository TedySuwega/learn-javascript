// Repository with dependency injection
import { isConnected } from "../database/connection";
import { DatabaseError, NotFoundError } from "../errors/customErrors";

interface Product {
    id: number;
    name: string;
    price: number;
    description: string;
    stock: number;
    category: string;
    isActive: boolean;
    createdAt: Date;
}

// Simulated database storage
let products: Product[] = [
    { id: 1, name: "Product 1", price: 100, description: "Product 1 description", stock: 100, category: "Category 1", isActive: true, createdAt: new Date() },
    { id: 2, name: "Product 2", price: 200, description: "Product 2 description", stock: 200, category: "Category 2", isActive: true, createdAt: new Date() },
];

// Repository class with DI-ready structure
export class ProductRepository {
    // In real app, database connection would be injected here
    
    private checkConnection(): void {
        if (!isConnected()) {
            throw new DatabaseError("Not connected to database");
        }
    }
    
    async findAll(): Promise<Product[]> {
        this.checkConnection();
        console.log("[Repository] Finding all products");
        return products;
    }
    
    async findById(id: number): Promise<Product> {
        this.checkConnection();
        console.log(`[Repository] Finding product with ID: ${id}`);
        
        const product = products.find(p => p.id === id);
        if (!product) {
            throw new NotFoundError(`Product with ID ${id}`);
        }
        return product;
    }
    
    async create(data: Omit<Product, "id">): Promise<Product> {
        this.checkConnection();
        console.log("[Repository] Creating new product");
        const newProduct: Product = {
            id: products.length + 1,
            ...data
        };
        products.push(newProduct);
        return newProduct;
    }
    async delete(id: number): Promise<void> {
        this.checkConnection();
        console.log(`[Repository] Deleting product with ID: ${id}`);
        const index = products.findIndex(p => p.id === id);
        if (index === -1) {
            throw new NotFoundError(`Product with ID ${id}`);
        }
        products.splice(index, 1);
    }
}