# Day 11: Service Layer Basics

## 📚 What to Learn Today
- **Read**: [LEARNING_MODULE.md](../../Modules/LEARNING_MODULE.md) - Module 6 (Lines 2188-2500)
- **Time**: ~35 minutes reading, ~25 minutes practice
- **Topics**: Business logic layer, UserService, validation

---

## 📖 Key Concepts

### 1. What is the Service Layer?

The **Service Layer** contains your application's **business logic** - the rules and processes that define how your application works.

```
Controller  →  Service  →  Repository  →  Database
(HTTP)         (Logic)     (Data)         (Storage)
```

**Repository**: "How do I get/save data?"
**Service**: "What are the rules for this operation?"

### 2. Why Separate Service from Repository?

```typescript
// ❌ BAD: Business logic in repository
class UserRepository {
    async createUser(data: CreateUserDTO) {
        // Validation here? NO!
        if (!data.email.includes("@")) throw new Error("Invalid email");
        // Password hashing here? NO!
        data.password = await bcrypt.hash(data.password, 10);
        // This is business logic, not data access!
        return db.query("INSERT INTO users...");
    }
}

// ✅ GOOD: Business logic in service
class UserService {
    async register(data: RegisterDTO) {
        // Validation - business rule
        if (!this.isValidEmail(data.email)) {
            throw new Error("Invalid email format");
        }
        
        // Check uniqueness - business rule
        const existing = await this.userRepository.findByEmail(data.email);
        if (existing) {
            throw new Error("Email already registered");
        }
        
        // Hash password - business rule
        const hashedPassword = await bcrypt.hash(data.password, 10);
        
        // Only then save to database
        return this.userRepository.create({
            ...data,
            password: hashedPassword
        });
    }
}
```

### 3. Service Layer Responsibilities

| Responsibility | Example |
|---------------|---------|
| Validation | Check email format, password strength |
| Business Rules | "Users must verify email before posting" |
| Data Transformation | Hash passwords, format dates |
| Orchestration | Coordinate multiple repositories |
| Error Handling | Throw meaningful business errors |

### 4. Basic UserService Structure

```typescript
import { IUserRepository } from "../repositories/userRepository";
import { User, CreateUserDTO } from "../types/user";

export class UserService {
    constructor(private userRepository: IUserRepository) {}
    
    async getAllUsers(): Promise<User[]> {
        return this.userRepository.findAll();
    }
    
    async getUserById(id: number): Promise<User> {
        const user = await this.userRepository.findById(id);
        if (!user) {
            throw new Error("User not found");
        }
        return user;
    }
    
    async register(data: RegisterDTO): Promise<User> {
        // Business logic here
        this.validateRegistration(data);
        
        // Check if email exists
        const existing = await this.userRepository.findByEmail(data.email);
        if (existing) {
            throw new Error("Email already registered");
        }
        
        // Create user
        return this.userRepository.create(data);
    }
    
    private validateRegistration(data: RegisterDTO): void {
        if (!data.name || data.name.length < 2) {
            throw new Error("Name must be at least 2 characters");
        }
        if (!data.email || !data.email.includes("@")) {
            throw new Error("Invalid email format");
        }
        if (!data.password || data.password.length < 6) {
            throw new Error("Password must be at least 6 characters");
        }
    }
}
```

### 5. Dependency Injection

Services receive their dependencies (like repositories) through the constructor:

```typescript
// The service doesn't create the repository - it receives it
class UserService {
    constructor(private userRepository: IUserRepository) {}
}

// This allows us to:
// 1. Use real repository in production
const realService = new UserService(new UserRepository());

// 2. Use mock repository in tests
const mockRepo = { findAll: jest.fn(), findById: jest.fn() };
const testService = new UserService(mockRepo);
```

### 6. Service vs Repository - Quick Comparison

```typescript
// Repository - Data operations only
class UserRepository {
    findById(id: number): Promise<User | null>
    findByEmail(email: string): Promise<User | null>
    create(data: CreateUserDTO): Promise<User>
    update(id: number, data: UpdateUserDTO): Promise<User | null>
    delete(id: number): Promise<boolean>
}

// Service - Business logic
class UserService {
    register(data: RegisterDTO): Promise<User>        // Validates + creates
    login(email: string, password: string): Promise<LoginResult>  // Verifies + returns token
    updateProfile(id: number, data: ProfileDTO): Promise<User>    // Validates + updates
    deactivateAccount(id: number): Promise<void>      // Business rules + soft delete
}
```

---

## 💻 Code to Type & Understand

Create this project next to this file under [`Exercises/day11/`](./) (same folder as `DAY_11.md`). You can **reuse from Day 10** ([`Exercises/day10/exercise/`](../day10/exercise/)): copy `package.json` (rename the `"name"` field), `tsconfig.json`, `src/database/fakeDb.ts`, `src/repositories/userRepository.ts`, and `src/types/product.ts` / `src/types/book.ts` (the fake DB imports them). Then add or merge the `user.ts` additions below and create `userService.ts` and `index.ts` as shown.

```
Exercises/day11/
├── package.json
├── tsconfig.json
├── src/
│   ├── types/
│   │   ├── user.ts
│   │   ├── product.ts   ← from Day 10 (for fakeDb)
│   │   └── book.ts      ← from Day 10 (for fakeDb)
│   ├── database/
│   │   └── fakeDb.ts    ← from Day 10
│   ├── repositories/
│   │   └── userRepository.ts  ← from Day 10
│   ├── services/
│   │   └── userService.ts
│   └── index.ts
```

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
    deletedAt: Date | null;
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

export interface RegisterDTO {
    name: string;
    email: string;
    password: string;
}

export interface LoginDTO {
    email: string;
    password: string;
}

export interface UserResponse {
    id: number;
    name: string;
    email: string;
    isActive: boolean;
    createdAt: Date;
}
```

**src/services/userService.ts**:
```typescript
import { IUserRepository } from "../repositories/userRepository";
import { User, RegisterDTO, UserResponse } from "../types/user";

export class UserService {
    constructor(private userRepository: IUserRepository) {
        console.log("[Service] UserService initialized");
    }
    
    // ============ READ OPERATIONS ============
    
    async getAllUsers(): Promise<UserResponse[]> {
        console.log("[Service] getAllUsers");
        
        const users = await this.userRepository.findAll();
        
        // Transform: Remove passwords from response
        return users.map(user => this.toUserResponse(user));
    }
    
    async getUserById(id: number): Promise<UserResponse> {
        console.log(`[Service] getUserById: ${id}`);
        
        // Validation
        if (id <= 0) {
            throw new Error("Invalid user ID");
        }
        
        const user = await this.userRepository.findById(id);
        
        if (!user) {
            throw new Error("User not found");
        }
        
        return this.toUserResponse(user);
    }
    
    // ============ WRITE OPERATIONS ============
    
    async register(data: RegisterDTO): Promise<UserResponse> {
        console.log("[Service] register");
        console.log("[Service] Data:", JSON.stringify({ ...data, password: "***" }));
        
        // Step 1: Validate input
        this.validateRegistration(data);
        
        // Step 2: Check if email already exists
        const existingUser = await this.userRepository.findByEmail(data.email);
        if (existingUser) {
            throw new Error("Email already registered");
        }
        
        // Step 3: Create user (password hashing will be added in Day 12)
        const newUser = await this.userRepository.create({
            name: data.name.trim(),
            email: data.email.toLowerCase().trim(),
            password: data.password  // Will hash in Day 12
        });
        
        console.log("[Service] User registered successfully");
        return this.toUserResponse(newUser);
    }
    
    // ============ VALIDATION ============
    
    private validateRegistration(data: RegisterDTO): void {
        console.log("[Service] Validating registration data");
        
        // Name validation
        if (!data.name || data.name.trim().length < 2) {
            throw new Error("Name must be at least 2 characters");
        }
        
        if (data.name.length > 100) {
            throw new Error("Name must be less than 100 characters");
        }
        
        // Email validation
        if (!data.email) {
            throw new Error("Email is required");
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            throw new Error("Invalid email format");
        }
        
        // Password validation
        if (!data.password) {
            throw new Error("Password is required");
        }
        
        if (data.password.length < 6) {
            throw new Error("Password must be at least 6 characters");
        }
        
        if (data.password.length > 100) {
            throw new Error("Password must be less than 100 characters");
        }
        
        console.log("[Service] Validation passed");
    }
    
    // ============ HELPERS ============
    
    private toUserResponse(user: User): UserResponse {
        // Never return password!
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            isActive: user.isActive,
            createdAt: user.createdAt
        };
    }
}
```

**src/index.ts**:
```typescript
// Test Service Layer
import { userRepository } from "./repositories/userRepository";
import { UserService } from "./services/userService";

async function main() {
    console.log("=== Day 11: Service Layer Basics ===\n");
    
    // Create service with repository dependency
    const userService = new UserService(userRepository);
    
    // Test: Get all users
    console.log("--- TEST: Get All Users ---");
    const allUsers = await userService.getAllUsers();
    console.log("Users (without passwords):", allUsers);
    
    // Test: Get user by ID
    console.log("\n--- TEST: Get User By ID ---");
    try {
        const user = await userService.getUserById(1);
        console.log("Found user:", user);
    } catch (error: any) {
        console.log("Error:", error.message);
    }
    
    // Test: Get non-existent user
    console.log("\n--- TEST: Get Non-existent User ---");
    try {
        await userService.getUserById(999);
    } catch (error: any) {
        console.log("Expected error:", error.message);
    }
    
    // Test: Register new user
    console.log("\n--- TEST: Register New User ---");
    try {
        const newUser = await userService.register({
            name: "Diana Prince",
            email: "diana@example.com",
            password: "wonder123"
        });
        console.log("Registered:", newUser);
    } catch (error: any) {
        console.log("Error:", error.message);
    }
    
    // Test: Register with existing email
    console.log("\n--- TEST: Register Duplicate Email ---");
    try {
        await userService.register({
            name: "Another Alice",
            email: "alice@example.com",  // Already exists
            password: "password123"
        });
    } catch (error: any) {
        console.log("Expected error:", error.message);
    }
    
    // Test: Register with invalid data
    console.log("\n--- TEST: Register Invalid Data ---");
    const invalidCases = [
        { name: "A", email: "test@test.com", password: "123456" },  // Name too short
        { name: "Valid Name", email: "invalid-email", password: "123456" },  // Invalid email
        { name: "Valid Name", email: "test@test.com", password: "123" }  // Password too short
    ];
    
    for (const invalidData of invalidCases) {
        try {
            await userService.register(invalidData);
        } catch (error: any) {
            console.log(`Invalid [${JSON.stringify(invalidData)}]: ${error.message}`);
        }
    }
    
    // Show final state
    console.log("\n--- Final Users ---");
    const finalUsers = await userService.getAllUsers();
    finalUsers.forEach(u => console.log(`  ${u.id}: ${u.name} (${u.email})`));
    
    console.log("\n=== All Tests Completed ===");
}

main().catch(console.error);
```

---

## ✍️ Exercises

### Exercise 1: Add Update Profile Method
Add a method to UserService:
```typescript
async updateProfile(id: number, data: { name?: string; email?: string }): Promise<UserResponse>
```
- Validate the new name (if provided)
- Validate the new email (if provided)
- Check email uniqueness (if changing email)
- Return updated user without password

### Exercise 2: Add Deactivate Account Method
Add a method to UserService:
```typescript
async deactivateAccount(id: number): Promise<void>
```
- Check if user exists
- Set `isActive` to false
- Throw error if user is already inactive

### Exercise 3: Create ProductService
Create a new ProductService with these methods:
- `getAllProducts()` - Returns all products
- `getProductById(id)` - Returns product or throws error
- `createProduct(data)` - Validates and creates product
- `validateProduct(data)` - Checks name, price > 0, stock >= 0

---

## ❓ Quiz Questions

### Q1: Service vs Repository
What is the main difference between Service and Repository layers?

**Your Answer**: 
Service Layer
- Handles business logic, rules, and workflows
- Orchestrates multiple operations (can call multiple repositories or other services)
- Represents “what the system should do”
 
Repository Layer
- Handles data access logic
- Responsible for CRUD operations (query, insert, update, delete)
- Represents “how data is stored/retrieved”
- Should NOT contain business rules

Layer	    |Responsibility
Service	    |Business decisions & use cases
Repository	|Data persistence & retrieval

**✅ Correct!** You captured separation of concerns clearly: the repository answers *how* data is stored and retrieved; the service answers *what* is allowed and how workflows run, including orchestration across multiple repositories.

### Q2: Validation Location
Why should validation be in the Service layer, not the Repository layer?

**Your Answer**: 
Validation should be in the Service layer because validation is part of business rules, not data access.

- The Service layer decides what is allowed in the system (e.g., valid email, unique username, password rules)
- The Repository layer should only focus on how to store and retrieve data

Key Reasons:
Separation of concerns → Repository stays clean (only DB logic)
Reusability → Same repository can be reused across different business rules
Flexibility → Business rules can change without touching database logic
Testability → Business logic is easier to test independently

**✅ Correct!** Validation encodes business rules (“is this input acceptable for this use case?”), not storage mechanics. Keeping it in the service keeps repositories reusable, easier to test in isolation, and avoids duplicating rules if several services share one repository.

### Q3: Password in Response
Why do we create a `toUserResponse()` method that excludes the password?

**Your Answer**: 
We exclude the password to ensure security and proper data exposure.

Reasons:
- Security → Passwords (even hashed) must never be exposed in API responses
- Data Privacy → Clients should only receive necessary data
- Encapsulation → Control what data leaves the system
- Prevent Accidental Leaks → Avoid exposing sensitive fields in logs or APIs
Concept:
This is often called:
- DTO (Data Transfer Object)
- Response Model

**✅ Correct!** `toUserResponse()` maps the internal `User` entity to a safe shape for callers (APIs, logs, clients): no password field, even if hashed—defense in depth and a clear contract (DTO / response model).

---

## 📝 Bonus Questions (Optional)

### B1: What is Dependency Injection and why is it useful?

**Your Answer**: 
- Dependency Injection is software patern that class recieve dependency (object or function) form other external source.
Why Dependency Injection is Useful:
- Improved Testability: Because dependencies are passed in, you can easily substitute real components with mock objects or stubs during unit testing.
- Loose Coupling: Classes are not tightly bound to specific implementations of their dependencies, making the code more flexible.
- Maintainability and Flexibility: Changes in one part of the system (e.g., swapping a database driver) do not require changes to the classes using that dependency.
- Code Reusability: Components become easier to reuse in different contexts because they don't manage their own dependencies.
- Simplified Boilerplate: Reduces the need to write code for creating and managing objects, leading to cleaner code

**✅ Correct!** You covered the main wins: testability (swap mocks), loose coupling, and easier changes to implementations. Small note: DI does not always remove boilerplate by itself—frameworks or manual “composition roots” still wire dependencies—but your reasoning is sound.

### B2: What would happen if we put business logic in the Repository layer?

**Your Answer**: 
- if we put business logic in the Repository Layer it will meesy with the logic, and the repository will not focused on database only, it will mix and it hard to maintenence

**✅ Correct!** Mixing rules into the repository blurs boundaries: harder to test business rules without a database, harder to reuse the same persistence for different workflows, and changes to policy force edits next to SQL-like code. You could also mention duplicated rules if multiple entry points call the repository directly.

---

## 📊 Quiz Results: Day 11

| Question | Result | Notes |
|----------|--------|-------|
| Q1: Service vs Repository | ✅ Correct | Clear responsibilities table; orchestration called out. |
| Q2: Validation location | ✅ Correct | Business rules vs data access, reuse and testability. |
| Q3: `toUserResponse` | ✅ Correct | Security, privacy, DTO / response model. |
| B1: Dependency Injection | ✅ Correct | Testability, coupling, flexibility; minor typos in prose only. |
| B2: Logic in Repository | ✅ Correct | Mixed concerns and maintenance; could add testing/reuse angle explicitly. |

**Score: 5/5 (100%)**

**Exercise review:** Runnable code lives in [`Exercises/day11/`](./) (`package.json`, `tsconfig.json`, `src/`). In addition to the typed walkthrough (`userService.ts`, `index.ts`), the folder includes `productRepository.ts`, `productService.ts`, and an expanded `userService` / `index.ts` aligned with Exercises 1–3.

---

## 💬 Q&A Session Notes

### Q: In the learning module, `UserService` has an empty constructor and `UserRepository` is created at module scope; Day 11 uses constructor injection. Is Day 11 correct? Is DI better?

**A:** Day 11’s constructor injection matches the usual pattern for services: dependencies are explicit and easy to replace (e.g. mocks in tests). A module-level `new UserRepository()` works for tiny demos but hides the dependency and couples the module to one implementation. Prefer DI for anything you plan to test or evolve.

---

### Q: Is the service layer split by actor or by “thing” (UserService, ProductService)? Is all user-related business logic in `UserService`? How does that compare to a “use case” from C# / mobile?

**A:** Commonly you split by **domain area** (user, product), not by actor; actors often affect **authorization**, not the main service split. `UserService` groups user-related workflows (register, profile, etc.). A **use case** is often **one class per flow** (e.g. `RegisterUserUseCase`); a **service** can bundle many such flows in one type. Same ideas, different granularity—use-case-per-class gives smaller units; `UserService` with many methods is one bucket for all user flows.

---

## ✅ Day 11 Checklist

- [x] Read Module 6 (Lines 2188-2500)
- [x] Understand what the Service layer does
- [x] Understand the difference between Service and Repository
- [x] Understand validation in the Service layer
- [x] Understand Dependency Injection basics
- [x] Type all code examples
- [x] Complete Exercise 1 (Update profile)
- [x] Complete Exercise 2 (Deactivate account)
- [x] Complete Exercise 3 (ProductService)
- [x] Answer all quiz questions
- [x] Update Progress.md

---

## 🔗 Next Day Preview
Tomorrow you'll learn about **Service Layer Security** - password hashing with bcrypt, forgot password functionality, and proper error handling.
