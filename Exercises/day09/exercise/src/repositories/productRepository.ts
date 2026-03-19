// PRODUCT REPOSITORY - Database access layer
import { db } from "../database/fakeDb";
import { Product, CreateProductDTO, UpdateProductDTO, ProductFilters } from "../types/product";

export class ProductRepository {
    async findAll(optional?: {
        filters?: ProductFilters;
        page?: number;
        limit?: number
    }): Promise<{ products: Product[]; total: number; page: number; totalPages: number }> {
        console.log("\n[Repository] findAll called");
        console.log("[Repository] Optional:", optional);

        let sql = "SELECT * FROM products";
        const params: any[] = [];

        if (optional?.filters?.name !== undefined) {
            sql = "SELECT * FROM products WHERE name = $1";
            params.push(optional.filters.name);
        }

        if (optional?.filters?.price !== undefined) {
            sql = "SELECT * FROM products WHERE price = $1";
            params.push(optional.filters.price);
        }

        if (optional?.filters?.stock !== undefined) {
            sql = "SELECT * FROM products WHERE stock = $1";
            params.push(optional.filters.stock);
        }

        if (optional?.page !== undefined && optional?.limit !== undefined) {
            sql += " LIMIT $2 OFFSET $3";
            params.push(optional.limit, (optional.page - 1) * optional.limit);
        }

        const result = await db.query(sql, params);
        console.log(`[Repository] Found ${result.rows.length} products`);

        return { products: result.rows, total: result.rows.length, page: optional?.page ?? 1, totalPages: Math.ceil(result.rows.length / (optional?.limit ?? 10)) };
    }

    async findById(id: number): Promise<Product | null> {
        console.log(`\n[Repository] findById called with id: ${id}`);

        const result = await db.query("SELECT * FROM products WHERE id = $1", [id]);

        const product = result.rows[0] || null;
        console.log(`[Repository] Product ${product ? "found" : "not found"}`);

        return product;
    }

    async findByCategory(category: string): Promise<Product | null> {
        console.log(`\n[Repository] findByCategory called with category: ${category}`);

        const result = await db.query("SELECT * FROM products WHERE category = $1", [category]);

        const product = result.rows[0] || null;
        console.log(`[Repository] Product ${product ? "found" : "not found"}`);

        return product;
    }

    async count(filters?: ProductFilters): Promise<number> {
        const products = await this.findAll({ filters: filters });
        return products.total;
    }
}

// Export singleton instance
export const productRepository = new ProductRepository();