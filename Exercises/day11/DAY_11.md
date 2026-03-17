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

Create this structure in `exercises/day11/`:

```
exercises/day11/
├── src/
│   ├── types/
│   │   └── user.ts
│   ├── database/
│   │   └── fakeDb.ts
│   ├── repositories/
│   │   └── userRepository.ts
│   ├── services/
│   │   └── userService.ts
│   └── index.ts
└── package.json
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
}

export interface CreateUserDTO {
    name: string;
    email: string;
    password: string;
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
import { UserRepository, userRepository } from "./repositories/userRepository";
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


### Q2: Validation Location
Why should validation be in the Service layer, not the Repository layer?

**Your Answer**: 


### Q3: Password in Response
Why do we create a `toUserResponse()` method that excludes the password?

**Your Answer**: 


---

## 📝 Bonus Questions (Optional)

### B1: What is Dependency Injection and why is it useful?

**Your Answer**: 


### B2: What would happen if we put business logic in the Repository layer?

**Your Answer**: 


---

## ✅ Day 11 Checklist

- [ ] Read Module 6 (Lines 2188-2500)
- [ ] Understand what the Service layer does
- [ ] Understand the difference between Service and Repository
- [ ] Understand validation in the Service layer
- [ ] Understand Dependency Injection basics
- [ ] Type all code examples
- [ ] Complete Exercise 1 (Update profile)
- [ ] Complete Exercise 2 (Deactivate account)
- [ ] Complete Exercise 3 (ProductService)
- [ ] Answer all quiz questions
- [ ] Update Progress.md

---

## 🔗 Next Day Preview
Tomorrow you'll learn about **Service Layer Security** - password hashing with bcrypt, forgot password functionality, and proper error handling.
