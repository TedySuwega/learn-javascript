# Day 9: Repository Layer Basics

## 📚 What to Learn Today
- **Read**: [LEARNING_MODULE.md](../../Modules/LEARNING_MODULE.md) - Module 5 (Lines 1622-1900)
- **Time**: ~35 minutes reading, ~25 minutes practice
- **Topics**: Repository pattern, data access methods, findAll, findById

---

## 📖 Key Concepts

### 1. What is the Repository Pattern?
The **Repository Pattern** abstracts database operations into a separate layer. It acts as a middleman between your business logic and the database.

```
Service Layer
      ↓
Repository Layer  ←── You are here
      ↓
Database
```

### 2. Why Use Repositories?

| Benefit | Explanation |
|---------|-------------|
| **Separation of Concerns** | Database logic is isolated |
| **Testability** | Easy to mock for unit tests |
| **Maintainability** | Change database without affecting services |
| **Reusability** | Same methods used across services |
| **Consistency** | Standard interface for data access |

### 3. Repository Responsibilities
A repository should ONLY:
- Execute database queries
- Map database results to objects
- Handle database-specific errors

A repository should NOT:
- Contain business logic
- Handle HTTP requests/responses
- Validate business rules
- Hash passwords

### 4. Standard Repository Methods

```typescript
interface Repository<T> {
    findAll(): Promise<T[]>;           // Get all records
    findById(id: number): Promise<T>;  // Get one by ID
    create(data: CreateDTO): Promise<T>; // Create new
    update(id: number, data: UpdateDTO): Promise<T>; // Update existing
    delete(id: number): Promise<void>; // Remove record
}
```

### 5. findAll() - Get All Records

```typescript
async findAll(): Promise<User[]> {
    const result = await db.query("SELECT * FROM users");
    return result.rows;
}

// With filtering
async findAll(filters?: { isActive?: boolean }): Promise<User[]> {
    let query = "SELECT * FROM users";
    const params: any[] = [];
    
    if (filters?.isActive !== undefined) {
        query += " WHERE is_active = $1";
        params.push(filters.isActive);
    }
    
    const result = await db.query(query, params);
    return result.rows;
}
```

### 6. findById() - Get Single Record

```typescript
async findById(id: number): Promise<User | null> {
    const result = await db.query(
        "SELECT * FROM users WHERE id = $1",
        [id]
    );
    
    // Return null if not found, or the user
    return result.rows[0] || null;
}
```

### 7. Handling "Not Found"

Two approaches:
```typescript
// Approach 1: Return null (let caller handle)
async findById(id: number): Promise<User | null> {
    const result = await db.query("SELECT * FROM users WHERE id = $1", [id]);
    return result.rows[0] || null;
}

// Approach 2: Throw error (repository handles)
async findById(id: number): Promise<User> {
    const result = await db.query("SELECT * FROM users WHERE id = $1", [id]);
    if (!result.rows[0]) {
        throw new NotFoundError(`User with ID ${id} not found`);
    }
    return result.rows[0];
}
```

---

## 💻 Code to Type & Understand

Create in `exercises/day09/`:

**src/types/user.ts**:
```typescript
export interface User {
    id: number;
    name: string;
    email: string;
    password: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateUserDTO {
    name: string;
    email: string;
    password: string;
}

export interface UpdateUserDTO {
    name?: string;
    email?: string;
    isActive?: boolean;
}

export interface UserFilters {
    isActive?: boolean;
    search?: string;
}
```

**src/database/fakeDb.ts**:
```typescript
// Simulated database for learning
import { User } from "../types/user";

// In-memory storage
let users: User[] = [
    {
        id: 1,
        name: "Alice Johnson",
        email: "alice@example.com",
        password: "hashed_password_1",
        isActive: true,
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-01")
    },
    {
        id: 2,
        name: "Bob Smith",
        email: "bob@example.com",
        password: "hashed_password_2",
        isActive: true,
        createdAt: new Date("2024-01-02"),
        updatedAt: new Date("2024-01-02")
    },
    {
        id: 3,
        name: "Charlie Brown",
        email: "charlie@example.com",
        password: "hashed_password_3",
        isActive: false,
        createdAt: new Date("2024-01-03"),
        updatedAt: new Date("2024-01-03")
    }
];

let nextId = 4;

// Simulate async database operations
function delay(ms: number = 100): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Simulated query function
export const db = {
    async query(sql: string, params: any[] = []): Promise<{ rows: any[] }> {
        await delay();
        console.log(`[DB] Executing: ${sql}`);
        console.log(`[DB] Params: ${JSON.stringify(params)}`);
        
        // Parse and execute simple queries
        if (sql.startsWith("SELECT * FROM users WHERE id =")) {
            const id = params[0];
            const user = users.find(u => u.id === id);
            return { rows: user ? [user] : [] };
        }
        
        if (sql.startsWith("SELECT * FROM users WHERE email =")) {
            const email = params[0];
            const user = users.find(u => u.email === email);
            return { rows: user ? [user] : [] };
        }
        
        if (sql.startsWith("SELECT * FROM users WHERE is_active =")) {
            const isActive = params[0];
            return { rows: users.filter(u => u.isActive === isActive) };
        }
        
        if (sql === "SELECT * FROM users") {
            return { rows: [...users] };
        }
        
        if (sql.startsWith("INSERT INTO users")) {
            const newUser: User = {
                id: nextId++,
                name: params[0],
                email: params[1],
                password: params[2],
                isActive: true,
                createdAt: new Date(),
                updatedAt: new Date()
            };
            users.push(newUser);
            return { rows: [newUser] };
        }
        
        if (sql.startsWith("UPDATE users SET")) {
            const id = params[params.length - 1];
            const userIndex = users.findIndex(u => u.id === id);
            if (userIndex === -1) {
                return { rows: [] };
            }
            // Simple update simulation
            users[userIndex] = {
                ...users[userIndex],
                updatedAt: new Date()
            };
            return { rows: [users[userIndex]] };
        }
        
        if (sql.startsWith("DELETE FROM users")) {
            const id = params[0];
            const userIndex = users.findIndex(u => u.id === id);
            if (userIndex === -1) {
                return { rows: [] };
            }
            const deleted = users.splice(userIndex, 1);
            return { rows: deleted };
        }
        
        return { rows: [] };
    }
};
```

**src/repositories/userRepository.ts**:
```typescript
// USER REPOSITORY - Database access layer
import { db } from "../database/fakeDb";
import { User, CreateUserDTO, UpdateUserDTO, UserFilters } from "../types/user";

export class UserRepository {
    /**
     * Get all users from database
     * @param filters Optional filters for the query
     */
    async findAll(filters?: UserFilters): Promise<User[]> {
        console.log("\n[Repository] findAll called");
        
        let sql = "SELECT * FROM users";
        const params: any[] = [];
        
        // Apply filters if provided
        if (filters?.isActive !== undefined) {
            sql = "SELECT * FROM users WHERE is_active = $1";
            params.push(filters.isActive);
        }
        
        const result = await db.query(sql, params);
        console.log(`[Repository] Found ${result.rows.length} users`);
        
        return result.rows;
    }
    
    /**
     * Find a single user by ID
     * @param id User ID to find
     * @returns User or null if not found
     */
    async findById(id: number): Promise<User | null> {
        console.log(`\n[Repository] findById called with id: ${id}`);
        
        const result = await db.query(
            "SELECT * FROM users WHERE id = $1",
            [id]
        );
        
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
        
        const result = await db.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );
        
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
        const users = await this.findAll(filters);
        return users.length;
    }
}

// Export singleton instance
export const userRepository = new UserRepository();
```

**src/index.ts**:
```typescript
// Test Repository Layer
import { userRepository } from "./repositories/userRepository";

async function main() {
    console.log("=== Day 09: Repository Layer Basics ===");
    
    // Test 1: findAll
    console.log("\n" + "=".repeat(50));
    console.log("TEST 1: Find All Users");
    console.log("=".repeat(50));
    
    const allUsers = await userRepository.findAll();
    console.log("\nResult:");
    allUsers.forEach(user => {
        console.log(`  - ${user.id}: ${user.name} (${user.email})`);
    });
    
    // Test 2: findAll with filter
    console.log("\n" + "=".repeat(50));
    console.log("TEST 2: Find Active Users Only");
    console.log("=".repeat(50));
    
    const activeUsers = await userRepository.findAll({ isActive: true });
    console.log("\nResult:");
    activeUsers.forEach(user => {
        console.log(`  - ${user.id}: ${user.name} (active: ${user.isActive})`);
    });
    
    // Test 3: findById - existing user
    console.log("\n" + "=".repeat(50));
    console.log("TEST 3: Find User by ID (exists)");
    console.log("=".repeat(50));
    
    const user1 = await userRepository.findById(1);
    console.log("\nResult:", user1);
    
    // Test 4: findById - non-existing user
    console.log("\n" + "=".repeat(50));
    console.log("TEST 4: Find User by ID (not exists)");
    console.log("=".repeat(50));
    
    const user999 = await userRepository.findById(999);
    console.log("\nResult:", user999);
    
    // Test 5: findByEmail
    console.log("\n" + "=".repeat(50));
    console.log("TEST 5: Find User by Email");
    console.log("=".repeat(50));
    
    const userByEmail = await userRepository.findByEmail("alice@example.com");
    console.log("\nResult:", userByEmail?.name);
    
    // Test 6: emailExists
    console.log("\n" + "=".repeat(50));
    console.log("TEST 6: Check Email Exists");
    console.log("=".repeat(50));
    
    const exists1 = await userRepository.emailExists("alice@example.com");
    const exists2 = await userRepository.emailExists("nobody@example.com");
    console.log("\nalice@example.com exists:", exists1);
    console.log("nobody@example.com exists:", exists2);
    
    // Test 7: count
    console.log("\n" + "=".repeat(50));
    console.log("TEST 7: Count Users");
    console.log("=".repeat(50));
    
    const totalCount = await userRepository.count();
    const activeCount = await userRepository.count({ isActive: true });
    console.log("\nTotal users:", totalCount);
    console.log("Active users:", activeCount);
    
    console.log("\n" + "=".repeat(50));
    console.log("All tests completed!");
    console.log("=".repeat(50));
}

main().catch(console.error);
```

---

## ✍️ Exercises

### Exercise 1: Add Pagination
Add pagination support to findAll:
```typescript
async findAll(options?: {
    filters?: UserFilters;
    page?: number;
    limit?: number;
}): Promise<{ users: User[]; total: number; page: number; totalPages: number }>
```

### Exercise 2: Create ProductRepository
Create a complete ProductRepository with:
- findAll (with optional category filter)
- findById
- findByCategory
- count

### Exercise 3: Add Search
Add a search method that finds users by name (partial match):
```typescript
async search(query: string): Promise<User[]>
```

---

## ❓ Quiz Questions

### Q1: Repository Responsibility
What is the single responsibility of a repository?

**Your Answer**: 
A repository should ONLY:
- Execute database queries
- Map database results to objects
- Handle database-specific errors

A repository should NOT:
- Contain business logic
- Handle HTTP requests/responses
- Validate business rules
- Hash passwords

**✅ Correct!** Excellent and comprehensive answer. You've correctly identified both what a repository should do (database operations only) and what it should NOT do (business logic, HTTP handling, validation, password hashing). This shows clear understanding of the Single Responsibility Principle applied to the repository layer.

### Q2: Why Not Controllers?
Why don't we put SQL queries directly in controllers?

**Your Answer**: 
We don’t put SQL in controllers because:
- Separation of concerns
- Maintainability
- Testability
- Scalability
- Clean architecture principles
- Reusability

so controller is for handle request like receptionist, and reposiroty like worker who talk to database

**✅ Correct!** Great answer with all the key reasons. Your analogy is spot on - the controller is like a receptionist (handles incoming requests, routes them appropriately) while the repository is like a worker who specializes in database communication. This separation makes code easier to test, maintain, and scale.

### Q3: Return Value
What does `findById` return if no record is found?

**Your Answer**: 
Based on this :
### 6. findById() - Get Single Record

```typescript
async findById(id: number): Promise<User | null> {
    const result = await db.query(
        "SELECT * FROM users WHERE id = $1",
        [id]
    );
    
    // Return null if not found, or the user
    return result.rows[0] || null;
}

it will return null if no record found

**✅ Correct!** The `findById` method returns `null` when no record is found, using the pattern `result.rows[0] || null`. This allows the caller to check for null and handle the "not found" case appropriately.

---

## 📝 Bonus Questions (Optional)

### B1: Should a repository validate that an email format is correct? Why or why not?

**Your Answer**: 
No, a repository should not validate email format because:
- It breaks separation of concerns
- Validation belongs in controller/service layer
- Repository should focus only on database interaction

**✅ Correct!** Email format validation is business logic/input validation, which belongs in the controller or service layer. The repository's job is purely database interaction - it should trust that the data it receives has already been validated.

### B2: What's the benefit of returning `null` vs throwing an error when a record isn't found?

**Your Answer**: 
Returning null is better when “not found” is expected and part of normal logic.
Throwing an error is better when “not found” indicates a problem and should stop execution.


**✅ Correct!** Great understanding of when to use each approach. For example, checking if an email exists before registration - null is expected. But fetching a user by ID from a URL parameter - if not found, it is likely an error condition worth throwing.

---

## 📊 Quiz Results: Day 09

| Question | Result | Notes |
|----------|--------|-------|
| Q1: Repository Responsibility | ✅ Correct | Comprehensive list of responsibilities and non-responsibilities |
| Q2: Why Not Controllers | ✅ Correct | Great analogy: receptionist vs worker |
| Q3: Return Value | ✅ Correct | Correctly identified null return |
| B1: Email Validation | ✅ Correct | Validation belongs in controller/service |
| B2: null vs Error | ✅ Correct | Good understanding of when to use each |

**Score: 5/5 (100%)**

---

## 📁 Exercise Review

All exercises completed in `Exercises/day09/exercise/`:

### Exercise 1: Pagination ✅
- **Location**: `src/repositories/userRepository.ts` (lines 10-34)
- **Implementation**: `findAll()` accepts `{ filters, page, limit }` options
- **Returns**: `{ users, total, page, totalPages }` object

### Exercise 2: ProductRepository ✅
- **Location**: `src/repositories/productRepository.ts`
- **Methods**: `findAll`, `findById`, `findByCategory`, `count`
- **Types**: Defined in `src/types/product.ts`
- **DB Handlers**: Added in `src/database/fakeDb.ts`

### Exercise 3: Search ✅
- **Location**: `src/repositories/userRepository.ts` (lines 89-92)
- **Implementation**: Uses `LIKE` query with `%query%` pattern
- **Note**: Required adding LIKE handler in `fakeDb.ts` with `%` wildcard stripping

---

## 💬 Q&A Session Notes

### Q: Why is `params[0]` used in fakeDb.ts?

**A:** The `db.query()` function signature is `query(sql: string, params: any[] = [])`. The `params` array holds all the values that replace placeholders like `$1`, `$2` in SQL queries. So `params[0]` corresponds to `$1`, `params[1]` to `$2`, etc.

```typescript
// Example: SELECT * FROM users WHERE id = $1
// params = [1]
// params[0] = 1 (the id value)
```

---

### Q: Why does `search()` return empty results?

**A:** The `fakeDb.ts` needed a specific handler for `LIKE` queries. Additionally, SQL's `%` wildcard doesn't work with JavaScript's `includes()` method - you need to strip the `%` characters first:

```typescript
// Wrong - includes() treats % as literal character
const query = params[0]; // "%Alice%"
users.filter(u => u.name.includes(query)); // Never matches!

// Correct - strip % wildcards first
const pattern = String(params[0]).replace(/%/g, "").toLowerCase();
users.filter(u => u.name.toLowerCase().includes(pattern)); // Works!
```

---

### Q: What's the difference between `find` and `filter`?

**A:** 
- `find()` returns the **first** matching element (or `undefined` if none found)
- `filter()` returns **all** matching elements as an array (empty array if none found)

```typescript
const products = [
  { id: 1, category: "Electronics" },
  { id: 2, category: "Electronics" },
  { id: 3, category: "Books" }
];

products.find(p => p.category === "Electronics");
// Returns: { id: 1, category: "Electronics" }

products.filter(p => p.category === "Electronics");
// Returns: [{ id: 1, ... }, { id: 2, ... }]
```

---

### Q: Why do product queries return null/undefined?

**A:** Two issues were identified:

1. **Missing handlers**: The `fakeDb.ts` initially had no `if` blocks for product queries - they fell through to `return { rows: [] }`

2. **Order of if statements matters**: Specific queries must come BEFORE generic ones:

```typescript
// Wrong order - generic catches everything
if (sql.startsWith("SELECT * FROM products")) { ... }
if (sql.startsWith("SELECT * FROM products WHERE stock =")) { ... } // Never reached!

// Correct order - specific first
if (sql.startsWith("SELECT * FROM products WHERE stock =")) { ... }
if (sql.startsWith("SELECT * FROM products")) { ... } // Fallback
```

---

## ✅ Day 9 Checklist

- [x] Read Module 5 (Lines 1622-1900)
- [x] Understand the repository pattern
- [x] Understand repository responsibilities
- [x] Understand findAll method
- [x] Understand findById method
- [x] Understand handling "not found" cases
- [x] Type all code examples
- [x] Complete Exercise 1 (Pagination)
- [x] Complete Exercise 2 (ProductRepository)
- [x] Complete Exercise 3 (Search)
- [x] Answer all quiz questions
- [x] Update Progress.md

---

## 🔗 Next Day Preview
Tomorrow you'll learn about **Repository Layer Advanced** - create, update, delete methods and how they complete the CRUD operations.
