# Day 10: Repository Layer Advanced

## 📚 What to Learn Today
- **Read**: [LEARNING_MODULE.md](../../Modules/LEARNING_MODULE.md) - Module 5 (Lines 1901-2187)
- **Time**: ~35 minutes reading, ~25 minutes practice
- **Topics**: create, update, delete methods, testability

---

## 📖 Key Concepts

### 1. The Complete Repository Interface

```typescript
interface IUserRepository {
    // Read operations (Day 9)
    findAll(filters?: UserFilters): Promise<User[]>;
    findById(id: number): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
    
    // Write operations (Today)
    create(data: CreateUserDTO): Promise<User>;
    update(id: number, data: UpdateUserDTO): Promise<User | null>;
    delete(id: number): Promise<boolean>;
}
```

### 2. create() - Insert New Record

```typescript
async create(data: CreateUserDTO): Promise<User> {
    const result = await db.query(
        `INSERT INTO users (name, email, password, created_at, updated_at)
         VALUES ($1, $2, $3, NOW(), NOW())
         RETURNING *`,
        [data.name, data.email, data.password]
    );
    
    return result.rows[0];
}
```

**Key points:**
- Returns the created record (with generated ID)
- Uses `RETURNING *` to get the inserted row
- Does NOT validate business rules (that's service layer's job)

### 3. update() - Modify Existing Record

```typescript
async update(id: number, data: UpdateUserDTO): Promise<User | null> {
    // Build dynamic update query
    const fields: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;
    
    if (data.name !== undefined) {
        fields.push(`name = $${paramIndex++}`);
        values.push(data.name);
    }
    if (data.email !== undefined) {
        fields.push(`email = $${paramIndex++}`);
        values.push(data.email);
    }
    
    // Always update updated_at
    fields.push(`updated_at = NOW()`);
    
    // Add ID as last parameter
    values.push(id);
    
    const result = await db.query(
        `UPDATE users SET ${fields.join(", ")} 
         WHERE id = $${paramIndex} 
         RETURNING *`,
        values
    );
    
    return result.rows[0] || null;
}
```

**Key points:**
- Only updates provided fields (partial update)
- Returns updated record or null if not found
- Updates `updated_at` timestamp

### 4. delete() - Remove Record

```typescript
async delete(id: number): Promise<boolean> {
    const result = await db.query(
        "DELETE FROM users WHERE id = $1 RETURNING id",
        [id]
    );
    
    // Returns true if a row was deleted
    return result.rows.length > 0;
}
```

**Key points:**
- Returns boolean indicating success
- Uses `RETURNING` to confirm deletion
- Does NOT check if record exists first (let SQL handle it)

### 5. Soft Delete vs Hard Delete

```typescript
// Hard Delete - Actually removes the record
async delete(id: number): Promise<boolean> {
    const result = await db.query(
        "DELETE FROM users WHERE id = $1",
        [id]
    );
    return result.rowCount > 0;
}

// Soft Delete - Marks as deleted but keeps the record
async softDelete(id: number): Promise<boolean> {
    const result = await db.query(
        "UPDATE users SET deleted_at = NOW() WHERE id = $1",
        [id]
    );
    return result.rowCount > 0;
}

// Find all (excluding soft-deleted)
async findAll(): Promise<User[]> {
    const result = await db.query(
        "SELECT * FROM users WHERE deleted_at IS NULL"
    );
    return result.rows;
}
```

### 6. Why Repositories Improve Testability

```typescript
// Without repository - Hard to test
class UserService {
    async createUser(data: CreateUserDTO) {
        // Direct database call - can't mock easily
        const result = await db.query("INSERT INTO users...");
        return result.rows[0];
    }
}

// With repository - Easy to test
class UserService {
    constructor(private userRepository: IUserRepository) {}
    
    async createUser(data: CreateUserDTO) {
        // Uses repository - can inject mock for testing
        return this.userRepository.create(data);
    }
}

// In tests:
const mockRepository = {
    create: jest.fn().mockResolvedValue({ id: 1, name: "Test" })
};
const service = new UserService(mockRepository);
```

---

## 💻 Code to Type & Understand

Extend your Day 9 code in `exercises/day10/`:

**src/repositories/userRepository.ts** (complete version):
```typescript
import { db } from "../database/fakeDb";
import { User, CreateUserDTO, UpdateUserDTO, UserFilters } from "../types/user";

export interface IUserRepository {
    findAll(filters?: UserFilters): Promise<User[]>;
    findById(id: number): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
    create(data: CreateUserDTO): Promise<User>;
    update(id: number, data: UpdateUserDTO): Promise<User | null>;
    delete(id: number): Promise<boolean>;
}

export class UserRepository implements IUserRepository {
    // ============ READ OPERATIONS ============
    
    async findAll(filters?: UserFilters): Promise<User[]> {
        console.log("[Repository] findAll");
        
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
```

**src/index.ts**:
```typescript
// Test Complete Repository
import { userRepository } from "./repositories/userRepository";

async function main() {
    console.log("=== Day 10: Repository Layer Advanced ===\n");
    
    // Show initial state
    console.log("--- Initial Users ---");
    const initialUsers = await userRepository.findAll();
    console.log(`Total users: ${initialUsers.length}`);
    initialUsers.forEach(u => console.log(`  ${u.id}: ${u.name}`));
    
    // Test CREATE
    console.log("\n--- TEST: Create User ---");
    const newUser = await userRepository.create({
        name: "Diana Prince",
        email: "diana@example.com",
        password: "hashed_wonder_password"
    });
    console.log("Created:", newUser);
    
    // Verify creation
    console.log("\n--- Verify Creation ---");
    const afterCreate = await userRepository.findAll();
    console.log(`Total users now: ${afterCreate.length}`);
    
    // Test UPDATE
    console.log("\n--- TEST: Update User ---");
    const updatedUser = await userRepository.update(newUser.id, {
        name: "Diana Prince-Wayne",
        isActive: true
    });
    console.log("Updated:", updatedUser);
    
    // Test UPDATE non-existent
    console.log("\n--- TEST: Update Non-existent User ---");
    const notFound = await userRepository.update(999, { name: "Ghost" });
    console.log("Result:", notFound);
    
    // Test DELETE
    console.log("\n--- TEST: Delete User ---");
    const deleteResult = await userRepository.delete(newUser.id);
    console.log("Delete successful:", deleteResult);
    
    // Test DELETE non-existent
    console.log("\n--- TEST: Delete Non-existent User ---");
    const deleteNotFound = await userRepository.delete(999);
    console.log("Delete result:", deleteNotFound);
    
    // Final state
    console.log("\n--- Final Users ---");
    const finalUsers = await userRepository.findAll();
    console.log(`Total users: ${finalUsers.length}`);
    finalUsers.forEach(u => console.log(`  ${u.id}: ${u.name}`));
    
    // Test exists helper
    console.log("\n--- TEST: Exists Helper ---");
    console.log("User 1 exists:", await userRepository.exists(1));
    console.log("User 999 exists:", await userRepository.exists(999));
    
    console.log("\n=== All Tests Completed ===");
}

main().catch(console.error);
```

---

## ✍️ Exercises

### Exercise 1: Add Soft Delete
Modify the repository to support soft delete:
1. Add `deletedAt` field to User type
2. Create `softDelete(id)` method
3. Modify `findAll` to exclude soft-deleted users
4. Add `findAllIncludingDeleted()` method

### Exercise 2: Bulk Operations
Add these methods to the repository:
```typescript
async createMany(users: CreateUserDTO[]): Promise<User[]>
async deleteMany(ids: number[]): Promise<number>  // Returns count deleted
```

### Exercise 3: Complete BookRepository
Create a full BookRepository with all CRUD operations:
- findAll, findById, findByAuthor, findByISBN
- create, update, delete
- Include proper TypeScript interfaces

---

## ❓ Quiz Questions

### Q1: Create Parameters
What parameters does a `create` method typically need?

**Your Answer**: 


### Q2: Testability
How does separating repository help with testing?

**Your Answer**: 


### Q3: Delete Return
What should a `delete` method return and why?

**Your Answer**: 


---

## 📝 Bonus Questions (Optional)

### B1: What is the difference between soft delete and hard delete? When would you use each?

**Your Answer**: 


### B2: Why do we use `RETURNING *` in INSERT/UPDATE queries?

**Your Answer**: 


---

## ✅ Day 10 Checklist

- [ ] Read Module 5 (Lines 1901-2187)
- [ ] Understand create method
- [ ] Understand update method (partial updates)
- [ ] Understand delete method
- [ ] Understand soft delete vs hard delete
- [ ] Understand how repositories improve testability
- [ ] Type all code examples
- [ ] Complete Exercise 1 (Soft delete)
- [ ] Complete Exercise 2 (Bulk operations)
- [ ] Complete Exercise 3 (BookRepository)
- [ ] Answer all quiz questions
- [ ] Update Progress.md

---

## 🎉 Week 2 Complete!

Congratulations! You've finished Week 2. You now understand:
- Database connections and error handling
- Database fundamentals (tables, keys, relationships)
- SQL operations (SELECT, INSERT, UPDATE, DELETE)
- The complete Repository pattern

**Weekend Review**: Build a small repository for a domain of your choice (Products, Orders, etc.)

---

## 🔗 Next Day Preview
Next week starts with the **Service Layer** - where business logic lives, including validation, password hashing, and complex operations.
