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


### Q2: Why Not Controllers?
Why don't we put SQL queries directly in controllers?

**Your Answer**: 


### Q3: Return Value
What does `findById` return if no record is found?

**Your Answer**: 


---

## 📝 Bonus Questions (Optional)

### B1: Should a repository validate that an email format is correct? Why or why not?

**Your Answer**: 


### B2: What's the benefit of returning `null` vs throwing an error when a record isn't found?

**Your Answer**: 


---

## ✅ Day 9 Checklist

- [ ] Read Module 5 (Lines 1622-1900)
- [ ] Understand the repository pattern
- [ ] Understand repository responsibilities
- [ ] Understand findAll method
- [ ] Understand findById method
- [ ] Understand handling "not found" cases
- [ ] Type all code examples
- [ ] Complete Exercise 1 (Pagination)
- [ ] Complete Exercise 2 (ProductRepository)
- [ ] Complete Exercise 3 (Search)
- [ ] Answer all quiz questions
- [ ] Update Progress.md

---

## 🔗 Next Day Preview
Tomorrow you'll learn about **Repository Layer Advanced** - create, update, delete methods and how they complete the CRUD operations.
