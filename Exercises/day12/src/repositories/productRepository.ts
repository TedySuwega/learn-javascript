// PRODUCT REPOSITORY - Database access layer
import { db } from "../database/fakeDb";
import {
  Product,
  CreateProductDTO,
  UpdateProductDTO,
  ProductFilters,
} from "../types/product";

export interface IProductRepository {
    findAll(optional?: {filters?: ProductFilters}): Promise<Product[]>;
    findById(id: number): Promise<Product | null>;
    findByCategory(category: string): Promise<Product | null>;
    create(data: CreateProductDTO): Promise<Product>;
    update(id: number, data: UpdateProductDTO): Promise<Product | null>;
    // delete(id: number): Promise<boolean>;
    // validate(data: CreateProductDTO): void;
}

export class ProductRepository implements IProductRepository {
  async findAll(optional?: {
    filters?: ProductFilters;
  }): Promise<Product[]> {
    console.log("\n[Repository] findAll called");
    console.log("[Repository] Optional:", optional);

    let sql = "SELECT * FROM products";
    const params: any[] = [];

    const f = optional?.filters;
    if (f?.name !== undefined) {
      sql = "SELECT * FROM products WHERE name = $1";
      params.push(f.name);
    } else if (f?.price !== undefined) {
      sql = "SELECT * FROM products WHERE price = $1";
      params.push(f.price);
    } else if (f?.stock !== undefined) {
      sql = "SELECT * FROM products WHERE stock = $1";
      params.push(f.stock);
    } else if (f?.category !== undefined) {
      sql = "SELECT * FROM products WHERE category = $1";
      params.push(f.category);
    }

    const result = await db.query(sql, params);
    console.log(`[Repository] Found ${result.rows.length} products`);

    return result.rows;
  }

  async findById(id: number): Promise<Product | null> {
    console.log(`\n[Repository] findById called with id: ${id}`);

    const result = await db.query("SELECT * FROM products WHERE id = $1", [id]);

    const product = result.rows[0] || null;
    console.log(`[Repository] Product ${product ? "found" : "not found"}`);

    return product;
  }

  async findByCategory(category: string): Promise<Product | null> {
    console.log(
      `\n[Repository] findByCategory called with category: ${category}`,
    );

    const result = await db.query(
      "SELECT * FROM products WHERE category = $1",
      [category],
    );

    const product = result.rows[0] || null;
    console.log(`[Repository] Product ${product ? "found" : "not found"}`);

    return product;
  }

  async create(data: CreateProductDTO): Promise<Product> {
    console.log("[Repository] create");
    const result = await db.query(
      `INSERT INTO products (name, price, stock, category) VALUES ($1, $2, $3, $4) RETURNING *`,
      [data.name, data.price, data.stock, data.category],
    );
    return result.rows[0];
  }

  async update(id: number, data: UpdateProductDTO): Promise<Product | null> {
    console.log(`[Repository] update: ${id}`);
    const existing = await this.findById(id);
    if (!existing) {
      return null;
    }

    const updates: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (data.name !== undefined) {
      updates.push(`name = $${paramIndex++}`);
      values.push(data.name);
    }
    if (data.price !== undefined) {
      updates.push(`price = $${paramIndex++}`);
      values.push(data.price);
    }
    if (data.stock !== undefined) {
      updates.push(`stock = $${paramIndex++}`);
      values.push(data.stock);
    }
    if (data.category !== undefined) {
      updates.push(`category = $${paramIndex++}`);
      values.push(data.category);
    }

    if (updates.length === 0) {
      return existing;
    }

    values.push(id);
    const result = await db.query(
      `UPDATE products SET ${updates.join(", ")} WHERE id = $${paramIndex} RETURNING *`,
      values,
    );
    return result.rows[0] ?? null;
  }

  async count(filters?: ProductFilters): Promise<number> {
    const products = await this.findAll({ filters });
    return products.length;
  }
}

// Export singleton instance
export const productRepository = new ProductRepository();
