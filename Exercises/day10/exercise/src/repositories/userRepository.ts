import { db } from "../database/fakeDb";
import { User, CreateUserDTO, UpdateUserDTO, UserFilters } from "../types/user";

export interface IUserRepository {
    findAll(filters?: UserFilters): Promise<User[]>;
    findById(id: number): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
    create(data: CreateUserDTO): Promise<User>;
    update(id: number, data: UpdateUserDTO): Promise<User | null>;
    delete(id: number): Promise<boolean>;
    softDelete(id: number): Promise<boolean>;
    createMany(data: CreateUserDTO[]): Promise<User[]>;
    deleteMany(ids: number[]): Promise<number>;
}

export class UserRepository implements IUserRepository {
    // ============ READ OPERATIONS ============
    
    async findAll(filters?: UserFilters): Promise<User[]> {
        console.log("[Repository] findAll");
        
        let sql = "SELECT * FROM users WHERE deleted_at IS NULL";
        const params: any[] = [];
        
        if (filters?.isActive !== undefined) {
            sql = "SELECT * FROM users WHERE is_active = $1 AND deleted_at IS NULL";
            params.push(filters.isActive);
        }
        
        const result = await db.query(sql, params);
        return result.rows;
    }

    async findAllIncludingDeleted(filters?: UserFilters): Promise<User[]> {
        console.log("[Repository] findAllIncludingDeleted");
        
        let sql = "SELECT * FROM users";
        const params: any[] = [];
        
        if (filters?.isActive !== undefined) {
            sql = "SELECT * FROM users WHERE is_active = $1";
            params.push(filters.isActive);
        }
        
        const result = await db.query(sql, params);
        return result.rows;
    }
    
    async findById(id: number): Promise<User | null> {
        console.log(`[Repository] findById: ${id}`);
        
        const result = await db.query(
            "SELECT * FROM users WHERE id = $1",
            [id]
        );
        
        return result.rows[0] || null;
    }
    
    async findByEmail(email: string): Promise<User | null> {
        console.log(`[Repository] findByEmail: ${email}`);
        
        const result = await db.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );
        
        return result.rows[0] || null;
    }
    
    // ============ WRITE OPERATIONS ============
    
    async create(data: CreateUserDTO): Promise<User> {
        console.log("[Repository] create");
        console.log("[Repository] Data:", JSON.stringify(data));
        
        const result = await db.query(
            `INSERT INTO users (name, email, password)
             VALUES ($1, $2, $3)
             RETURNING *`,
            [data.name, data.email, data.password]
        );
        
        const createdUser = result.rows[0];
        console.log("[Repository] Created user with ID:", createdUser.id);
        
        return createdUser;
    }
    
    async update(id: number, data: UpdateUserDTO): Promise<User | null> {
        console.log(`[Repository] update: ${id}`);
        console.log("[Repository] Data:", JSON.stringify(data));
        
        // Check if user exists first
        const existingUser = await this.findById(id);
        if (!existingUser) {
            console.log("[Repository] User not found");
            return null;
        }
        
        // Build update fields
        const updates: string[] = [];
        const values: any[] = [];
        let paramIndex = 1;
        
        if (data.name !== undefined) {
            updates.push(`name = $${paramIndex++}`);
            values.push(data.name);
        }
        
        if (data.email !== undefined) {
            updates.push(`email = $${paramIndex++}`);
            values.push(data.email);
        }
        
        if (data.isActive !== undefined) {
            updates.push(`is_active = $${paramIndex++}`);
            values.push(data.isActive);
        }
        
        // If no updates, return existing user
        if (updates.length === 0) {
            console.log("[Repository] No fields to update");
            return existingUser;
        }
        
        // Add ID as last parameter
        values.push(id);
        
        const result = await db.query(
            `UPDATE users SET ${updates.join(", ")} 
             WHERE id = $${paramIndex} 
             RETURNING *`,
            values
        );
        
        console.log("[Repository] User updated");
        return result.rows[0];
    }
    
    async delete(id: number): Promise<boolean> {
        console.log(`[Repository] delete: ${id}`);
        
        const result = await db.query(
            "DELETE FROM users WHERE id = $1 RETURNING *",
            [id]
        );
        
        const deleted = result.rows.length > 0;
        console.log(`[Repository] Deleted: ${deleted}`);
        
        return deleted;
    }

    async softDelete(id: number): Promise<boolean> {
        console.log(`[Repository] softDelete: ${id}`);
        
        const result = await db.query(
            "UPDATE users SET deleted_at = NOW() WHERE id = $1 RETURNING *",
            [id]
        );
        
        const softDeleted = result.rows.length > 0;
        console.log(`[Repository] Soft Deleted: ${softDeleted}`);
        
        return softDeleted;
    }

    async createMany(data: CreateUserDTO[]): Promise<User[]> {
        console.log("[Repository] createMany");
        console.log("[Repository] Data:", JSON.stringify(data));
        
        const created: User[] = [];
        for (const dto of data) {
          created.push(await this.create(dto));
        }
        return created;
    }

    async deleteMany(ids: number[]): Promise<number> {
        console.log("[Repository] deleteMany");
        console.log("[Repository] Data:", JSON.stringify(ids));
        
        let deletedCount = 0;
        for (const id of ids) {
          const deleted = await this.delete(id);
          if (deleted) {
            deletedCount++;
          }
        }
        return deletedCount;
    }
    // ============ ADDITIONAL METHODS ============
    
    async count(): Promise<number> {
        const users = await this.findAll();
        return users.length;
    }
    
    async exists(id: number): Promise<boolean> {
        const user = await this.findById(id);
        return user !== null;
    }
}

// Export singleton
export const userRepository = new UserRepository();
