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
- DTO (Data Transfer Obejct) so it will contain the data that need to create like name, type, or neceesary config setting

**✅ Correct!** A `create` method typically takes a DTO (for example `CreateUserDTO`) with only the fields the client is allowed to set—no generated `id` or DB-only columns. That keeps the API clear and matches what you described.

### Q2: Testability
How does separating repository help with testing?

**Your Answer**: 
- it can be usefull and easy to test by mocking the repository like 
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

**✅ Correct!** Injecting `IUserRepository` lets tests substitute a mock so `UserService` never hits a real database. Your example matches the pattern from the lesson (constructor injection + `jest.fn()`).

### Q3: Delete Return
What should a `delete` method return and why?

**Your Answer**: 
- we use RETURNING * to show the actual data processed or to confirm deleted data, so we do not need check if record exists or already deleted

**⚠️ Partial.** `RETURNING` (e.g. `RETURNING id` or `RETURNING *`) is how the **query** can tell you whether a row was deleted (`rows.length` or `rowCount`). The **repository method** in this course still usually returns **`Promise<boolean>`** (or a count)—a simple signal for callers—not the deleted row itself. Separating “SQL clause” vs “TypeScript return type” helps.

---

## 📝 Bonus Questions (Optional)

### B1: What is the difference between soft delete and hard delete? When would you use each?

**Your Answer**: 
- Soft delete delete the data but save the record , so its like falgging data or mark data like is_deleted = true, so it can be easy to restored
- Hard delete is permanently delete data and the record data 

**✅ Correct!** Soft delete keeps the row and marks it (e.g. `deleted_at`); hard delete removes it. Restoration/auditing favors soft delete; true removal and simpler queries favor hard delete when policy allows.

### B2: Why do we use `RETURNING *` in INSERT/UPDATE queries?

**Your Answer**: 
- we use RETURNING * to show the actual data processed or to confirm deleted data, so we do not need check if record exists or already deleted

**⚠️ Partial.** For **INSERT** and **UPDATE**, `RETURNING *` is mainly used to read back the **full row after the write**—especially **generated values** (`id`, timestamps, defaults)—so your app does not need a second `SELECT`. The “confirm delete” angle applies more to **DELETE** than to INSERT/UPDATE.

---

## 📊 Quiz Results: Day 10

| Question | Result | Notes |
|----------|--------|-------|
| Q1: Create Parameters | ✅ Correct | DTO / fields needed for insert |
| Q2: Testability | ✅ Correct | DI + mock repository pattern |
| Q3: Delete Return | ⚠️ Partial | Clarify SQL `RETURNING` vs method return (`boolean` / count) |
| B1: Soft vs Hard Delete | ✅ Correct | Keep row vs remove; restore/audit vs simplicity |
| B2: RETURNING on INSERT/UPDATE | ⚠️ Partial | Emphasis on generated columns + final row, not delete confirmation |

**Score: 4/5 (80%)**

---

## 📁 Exercise Review

Work lives under [`Exercises/day10/exercise/`](exercise/) (the doc’s “`exercises/day10/`” path is the same folder with different casing).

### Exercise 1: Soft delete
- **Types**: [`src/types/user.ts`](exercise/src/types/user.ts) — `deletedAt: Date | null`
- **Repository**: [`src/repositories/userRepository.ts`](exercise/src/repositories/userRepository.ts) — `findAll` excludes soft-deleted rows, `findAllIncludingDeleted`, `softDelete`
- **Simulator**: [`src/database/fakeDb.ts`](exercise/src/database/fakeDb.ts) — branches for `deleted_at IS NULL` / `NOT NULL`, combined `is_active` + `deleted_at`, `INSERT` sets `deletedAt: null`, `UPDATE` supports `deleted_at` / `NOW()`

### Exercise 2: Bulk operations
- **Location**: [`src/repositories/userRepository.ts`](exercise/src/repositories/userRepository.ts) — `createMany`, `deleteMany`
- **Note**: Bulk SQL must stay in sync with `fakeDb` string handlers (or delegate to per-row `create` / `delete`).

### Exercise 3: BookRepository
- **Repository**: [`src/repositories/bookRepository.ts`](exercise/src/repositories/bookRepository.ts) — CRUD + `findByAuthor`, `findByIsbn`, filters
- **Types**: [`src/types/book.ts`](exercise/src/types/book.ts)
- **Simulator**: book queries in [`src/database/fakeDb.ts`](exercise/src/database/fakeDb.ts)

---

## 💬 Q&A Session Notes

### Q: Should Day 10 code live in Day 9’s folder or Day 10’s?

**A:** The lesson asks you to **extend Day 9 in `Exercises/day10/exercise/`** so each day keeps its own snapshot. Copy shared pieces (`fakeDb`, types) from Day 9, then add CRUD and extras in Day 10. You *can* use one folder only if you accept mixing milestones.

---

### Q: What is `filters?.isActive` in `findAll`?

**A:** Optional chaining: if `filters` is `undefined`, the expression short-circuits to `undefined` instead of throwing. Then `!== undefined` checks whether the caller passed an `isActive` filter.

```typescript
if (filters?.isActive !== undefined) {
  // only runs when filters exists and isActive was provided
}
```

---

### Q: What does `paramIndex` do in `update`?

**A:** It numbers SQL placeholders (`$1`, `$2`, …) so each dynamic column gets a unique parameter, and the **user `id` is appended last** for `WHERE id = $N`. The `values` array must stay in the same order as those placeholders.

---

### Q: Why `is_active` in SQL but `isActive` in TypeScript?

**A:** SQL often uses `snake_case` columns; JavaScript/TypeScript often uses `camelCase`. The repository maps between them in query strings vs object properties. The database layer speaks snake_case; your domain types speak camelCase.

---

### Q: Why does `findAll` return zero rows after I added `WHERE deleted_at IS NULL`?

**A:** `fakeDb` does not parse real SQL—it **matches string prefixes**. If there is no branch for your exact `SELECT`, it falls through to `{ rows: [] }`. Add a handler for that string (and combine conditions in the right order so a generic `WHERE is_active` does not swallow a more specific query).

---

### Q: `deletedAt === null` vs missing property—why did a new user disappear from `findAll`?

**A:** **`undefined !== null`.** Seed users had `deletedAt: null`; `INSERT` omitted `deletedAt`, so it was **`undefined`** and failed a strict `=== null` filter. Fix: set **`deletedAt: null` on insert** in `fakeDb`, or filter with **`== null`**, or treat both in the simulator.

---

### Q: Are `createMany` / `deleteMany` with one SQL string and array params correct?

**A:** `VALUES ($1,$2,$3)` expects **three scalars** for one row, not three arrays. For many rows, use **dynamic `VALUES` with a flat param list**, loop **`create`**, or teach `fakeDb` to consume N×3 params. `DELETE ... id = $1` with `[ids]` is wrong—use **`IN (...)`** or repeated deletes plus matching `fakeDb` logic.

---

### Q: Should `forEach` use `(b: any)`?

**A:** If `findAll()` returns **`Promise<Book[]>`**, TypeScript infers **`Book`** for the callback parameter. Prefer **no annotation** or **`(b: Book)`**; avoid **`any`** so typos are caught.

---

## ✅ Day 10 Checklist

- [x] Read Module 5 (Lines 1901-2187)
- [x] Understand create method
- [x] Understand update method (partial updates)
- [x] Understand delete method
- [x] Understand soft delete vs hard delete
- [x] Understand how repositories improve testability
- [x] Type all code examples
- [x] Complete Exercise 1 (Soft delete)
- [x] Complete Exercise 2 (Bulk operations)
- [x] Complete Exercise 3 (BookRepository)
- [x] Answer all quiz questions
- [x] Update Progress.md

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
