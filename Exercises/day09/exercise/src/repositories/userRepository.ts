// USER REPOSITORY - Database access layer
import { db } from "../database/fakeDb";
import { User, CreateUserDTO, UpdateUserDTO, UserFilters } from "../types/user";

export class UserRepository {
  /**
   * Get all users from database
   * @param filters Optional filters for the query
   */
    async findAll(optional?: {
        filters?: UserFilters; 
        page?: number; limit?: number
    }): Promise<{ users: User[]; total: number; page: number; totalPages: number }> {
        console.log("\n[Repository] findAll called");
        console.log("[Repository] Optional:", optional);

        let sql = "SELECT * FROM users";
        const params: any[] = [];

        if (optional?.filters?.isActive !== undefined) {
            sql = "SELECT * FROM users WHERE is_active = $1";
            params.push(optional.filters.isActive);
        }

        if (optional?.page !== undefined && optional?.limit !== undefined) {
            sql += " LIMIT $2 OFFSET $3";
            params.push(optional.limit, (optional.page - 1) * optional.limit);
        }

        const result = await db.query(sql, params);
        console.log(`[Repository] Found ${result.rows.length} users`);

        return { users: result.rows, total: result.rows.length, page: optional?.page ?? 1, totalPages: Math.ceil(result.rows.length / (optional?.limit ?? 10)) };
    }

  /**
   * Find a single user by ID
   * @param id User ID to find
   * @returns User or null if not found
   */
    async findById(id: number): Promise<User | null> {
        console.log(`\n[Repository] findById called with id: ${id}`);

        const result = await db.query("SELECT * FROM users WHERE id = $1", [id]);

        const user = result.rows[0] || null;
        console.log(`[Repository] User ${user ? "found" : "not found"}`);

        return user;
    }

  /**
   * Find a user by email address
   * @param email Email to search for
   * @returns User or null if not found
   */
    async findByEmail(email: string): Promise<User | null> {
        console.log(`\n[Repository] findByEmail called with: ${email}`);

        const result = await db.query("SELECT * FROM users WHERE email = $1", [
        email,
        ]);

        return result.rows[0] || null;
    }

  /**
   * Check if email already exists
   * @param email Email to check
   */
    async emailExists(email: string): Promise<boolean> {
        const user = await this.findByEmail(email);
        return user !== null;
    }

  /**
   * Count total users
   */
    async count(filters?: UserFilters): Promise<number> {
        const users = await this.findAll({ filters: filters });
        return users.total;
    }
    
  /**
   * Search users by name
   * @param query Search query
   * @returns Users matching the query
   */
    async search(query: string): Promise<User[]> {
        const result = await db.query("SELECT * FROM users WHERE name LIKE $1", [`%${query}%`]);
        return result.rows;
    }
}

// Export singleton instance
export const userRepository = new UserRepository();
