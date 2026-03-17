# Day 19: Error Handling & Data Transformation

## 📚 What to Learn Today
- **Read**: [LEARNING_MODULE.md](../../Modules/LEARNING_MODULE.md) - Module 9 (Lines 4601-4928)
- **Time**: ~35 minutes reading, ~25 minutes practice
- **Topics**: Error propagation, data transformation, security

---

## 📖 Key Concepts

### 1. Types of Errors

```typescript
// 1. Validation Errors (400)
throw new Error("Email is required");
throw new Error("Password must be at least 6 characters");

// 2. Authentication Errors (401)
throw new Error("Invalid email or password");
throw new Error("Token has expired");

// 3. Authorization Errors (403)
throw new Error("Insufficient permissions");
throw new Error("Access denied");

// 4. Not Found Errors (404)
throw new Error("User not found");
throw new Error("Resource does not exist");

// 5. Conflict Errors (409)
throw new Error("Email already registered");
throw new Error("Username is taken");

// 6. Internal Errors (500)
throw new Error("Database connection failed");
throw new Error("Unexpected error occurred");
```

### 2. Custom Error Classes

```typescript
// Base application error
export class AppError extends Error {
    constructor(
        public message: string,
        public statusCode: number,
        public code: string
    ) {
        super(message);
        this.name = "AppError";
    }
}

// Specific error types
export class ValidationError extends AppError {
    constructor(message: string) {
        super(message, 400, "VALIDATION_ERROR");
        this.name = "ValidationError";
    }
}

export class AuthenticationError extends AppError {
    constructor(message: string = "Authentication required") {
        super(message, 401, "AUTHENTICATION_ERROR");
        this.name = "AuthenticationError";
    }
}

export class AuthorizationError extends AppError {
    constructor(message: string = "Insufficient permissions") {
        super(message, 403, "AUTHORIZATION_ERROR");
        this.name = "AuthorizationError";
    }
}

export class NotFoundError extends AppError {
    constructor(resource: string) {
        super(`${resource} not found`, 404, "NOT_FOUND");
        this.name = "NotFoundError";
    }
}

export class ConflictError extends AppError {
    constructor(message: string) {
        super(message, 409, "CONFLICT");
        this.name = "ConflictError";
    }
}
```

### 3. Global Error Handler

```typescript
import { FastifyError, FastifyReply, FastifyRequest } from "fastify";

export function globalErrorHandler(
    error: FastifyError,
    request: FastifyRequest,
    reply: FastifyReply
) {
    console.error("[Error Handler]", {
        name: error.name,
        message: error.message,
        stack: error.stack,
        url: request.url,
        method: request.method
    });
    
    // Handle known error types
    if (error instanceof AppError) {
        return reply.status(error.statusCode).send({
            success: false,
            error: {
                code: error.code,
                message: error.message
            }
        });
    }
    
    // Handle Fastify validation errors
    if (error.validation) {
        return reply.status(400).send({
            success: false,
            error: {
                code: "VALIDATION_ERROR",
                message: "Invalid request data",
                details: error.validation
            }
        });
    }
    
    // Handle unknown errors (don't expose details)
    return reply.status(500).send({
        success: false,
        error: {
            code: "INTERNAL_ERROR",
            message: "An unexpected error occurred"
        }
    });
}

// Register in Fastify
app.setErrorHandler(globalErrorHandler);
```

### 4. Error Response Format

```typescript
// Consistent error response structure
interface ErrorResponse {
    success: false;
    error: {
        code: string;        // Machine-readable code
        message: string;     // Human-readable message
        details?: any;       // Optional additional info
        field?: string;      // For validation errors
    };
    requestId?: string;      // For tracking
    timestamp?: string;      // When error occurred
}

// Examples
{
    success: false,
    error: {
        code: "VALIDATION_ERROR",
        message: "Email is required",
        field: "email"
    }
}

{
    success: false,
    error: {
        code: "NOT_FOUND",
        message: "User not found"
    },
    requestId: "abc-123",
    timestamp: "2024-01-01T00:00:00Z"
}
```

### 5. Data Transformation - Security

```typescript
// NEVER expose sensitive data
interface User {
    id: number;
    email: string;
    password: string;      // NEVER return this!
    passwordResetToken: string;  // NEVER return this!
    role: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    lastLoginIp: string;   // Maybe don't return this
}

// Safe user response
interface UserResponse {
    id: number;
    email: string;
    role: string;
    isActive: boolean;
    createdAt: Date;
}

// Transformer function
function toUserResponse(user: User): UserResponse {
    return {
        id: user.id,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt
    };
}
```

### 6. Data Transformation Patterns

```typescript
// 1. Input Sanitization
function sanitizeInput(data: any): any {
    return {
        name: data.name?.trim(),
        email: data.email?.toLowerCase().trim(),
        // Don't trim password - spaces might be intentional
        password: data.password
    };
}

// 2. Output Transformation
function transformUserList(users: User[]): UserResponse[] {
    return users.map(user => toUserResponse(user));
}

// 3. Date Formatting
function formatDates(data: any): any {
    return {
        ...data,
        createdAt: data.createdAt?.toISOString(),
        updatedAt: data.updatedAt?.toISOString()
    };
}

// 4. Nested Object Transformation
function transformPost(post: Post): PostResponse {
    return {
        id: post.id,
        title: post.title,
        content: post.content,
        author: toUserResponse(post.author),  // Transform nested user
        createdAt: post.createdAt.toISOString()
    };
}
```

### 7. Handling Null and Undefined

```typescript
// Defensive transformation
function toUserResponse(user: User | null | undefined): UserResponse | null {
    if (!user) return null;
    
    return {
        id: user.id,
        email: user.email ?? "",
        role: user.role ?? "user",
        isActive: user.isActive ?? true,
        createdAt: user.createdAt ?? new Date()
    };
}

// Array with potential nulls
function transformUsers(users: (User | null)[]): UserResponse[] {
    return users
        .filter((user): user is User => user !== null)
        .map(toUserResponse);
}
```

### 8. Error Logging Best Practices

```typescript
// What to log
function logError(error: Error, context: any) {
    console.error({
        // Error info
        name: error.name,
        message: error.message,
        stack: error.stack,
        
        // Request context
        requestId: context.requestId,
        userId: context.userId,
        url: context.url,
        method: context.method,
        
        // Timing
        timestamp: new Date().toISOString(),
        
        // Environment
        environment: process.env.NODE_ENV
    });
}

// What NOT to log
// - Passwords (even hashed)
// - Full credit card numbers
// - API keys or secrets
// - Personal identification numbers
```

---

## 💻 Code to Type & Understand

Create this structure in `exercises/day19/`:

```
exercises/day19/
├── src/
│   ├── errors/
│   │   └── index.ts
│   ├── transformers/
│   │   └── userTransformer.ts
│   ├── middleware/
│   │   └── errorHandler.ts
│   ├── services/
│   │   └── userService.ts
│   ├── controllers/
│   │   └── userController.ts
│   └── index.ts
└── package.json
```

**src/errors/index.ts**:
```typescript
// Base application error
export class AppError extends Error {
    public readonly statusCode: number;
    public readonly code: string;
    public readonly isOperational: boolean;
    
    constructor(message: string, statusCode: number, code: string) {
        super(message);
        this.statusCode = statusCode;
        this.code = code;
        this.isOperational = true;  // Expected errors
        
        Error.captureStackTrace(this, this.constructor);
    }
}

// Validation Error (400)
export class ValidationError extends AppError {
    public readonly field?: string;
    
    constructor(message: string, field?: string) {
        super(message, 400, "VALIDATION_ERROR");
        this.field = field;
        this.name = "ValidationError";
    }
}

// Authentication Error (401)
export class AuthenticationError extends AppError {
    constructor(message: string = "Authentication required") {
        super(message, 401, "AUTHENTICATION_ERROR");
        this.name = "AuthenticationError";
    }
}

// Authorization Error (403)
export class AuthorizationError extends AppError {
    constructor(message: string = "Insufficient permissions") {
        super(message, 403, "AUTHORIZATION_ERROR");
        this.name = "AuthorizationError";
    }
}

// Not Found Error (404)
export class NotFoundError extends AppError {
    constructor(resource: string = "Resource") {
        super(`${resource} not found`, 404, "NOT_FOUND");
        this.name = "NotFoundError";
    }
}

// Conflict Error (409)
export class ConflictError extends AppError {
    constructor(message: string) {
        super(message, 409, "CONFLICT");
        this.name = "ConflictError";
    }
}

// Internal Error (500)
export class InternalError extends AppError {
    constructor(message: string = "An unexpected error occurred") {
        super(message, 500, "INTERNAL_ERROR");
        this.name = "InternalError";
    }
}
```

**src/transformers/userTransformer.ts**:
```typescript
// Full user from database
export interface User {
    id: number;
    name: string;
    email: string;
    password: string;
    passwordResetToken?: string;
    role: "user" | "admin" | "moderator";
    isActive: boolean;
    lastLoginAt?: Date;
    lastLoginIp?: string;
    createdAt: Date;
    updatedAt: Date;
}

// Safe user response (public)
export interface UserResponse {
    id: number;
    name: string;
    email: string;
    role: string;
    isActive: boolean;
    createdAt: string;
}

// Admin user response (more details)
export interface AdminUserResponse extends UserResponse {
    lastLoginAt?: string;
    updatedAt: string;
}

// User list response
export interface UserListResponse {
    users: UserResponse[];
    total: number;
}

export class UserTransformer {
    // Transform single user for public response
    static toPublicResponse(user: User): UserResponse {
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            isActive: user.isActive,
            createdAt: user.createdAt.toISOString()
        };
    }
    
    // Transform single user for admin response
    static toAdminResponse(user: User): AdminUserResponse {
        return {
            ...this.toPublicResponse(user),
            lastLoginAt: user.lastLoginAt?.toISOString(),
            updatedAt: user.updatedAt.toISOString()
        };
    }
    
    // Transform user list
    static toListResponse(users: User[], isAdmin: boolean = false): UserListResponse {
        const transformer = isAdmin 
            ? this.toAdminResponse.bind(this)
            : this.toPublicResponse.bind(this);
            
        return {
            users: users.map(transformer),
            total: users.length
        };
    }
    
    // Sanitize input data
    static sanitizeInput(data: any): Partial<User> {
        const sanitized: any = {};
        
        if (data.name !== undefined) {
            sanitized.name = String(data.name).trim();
        }
        
        if (data.email !== undefined) {
            sanitized.email = String(data.email).toLowerCase().trim();
        }
        
        if (data.password !== undefined) {
            // Don't trim password - spaces might be intentional
            sanitized.password = String(data.password);
        }
        
        if (data.role !== undefined) {
            const validRoles = ["user", "admin", "moderator"];
            if (validRoles.includes(data.role)) {
                sanitized.role = data.role;
            }
        }
        
        return sanitized;
    }
    
    // Remove sensitive fields from any object
    static removeSensitiveFields<T extends object>(obj: T): Partial<T> {
        const sensitiveFields = ["password", "passwordResetToken", "lastLoginIp"];
        const result = { ...obj };
        
        for (const field of sensitiveFields) {
            delete (result as any)[field];
        }
        
        return result;
    }
}
```

**src/middleware/errorHandler.ts**:
```typescript
import { FastifyError, FastifyReply, FastifyRequest } from "fastify";
import { AppError, ValidationError } from "../errors";

interface ErrorResponse {
    success: false;
    error: {
        code: string;
        message: string;
        field?: string;
        details?: any;
    };
    requestId?: string;
    timestamp: string;
}

export function globalErrorHandler(
    error: FastifyError | Error,
    request: FastifyRequest,
    reply: FastifyReply
) {
    const requestId = request.headers["x-request-id"] as string || "unknown";
    const timestamp = new Date().toISOString();
    
    // Log error (in production, use proper logging service)
    console.error("[Error Handler]", {
        requestId,
        timestamp,
        name: error.name,
        message: error.message,
        url: request.url,
        method: request.method,
        // Don't log stack in production
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined
    });
    
    // Build error response
    const response: ErrorResponse = {
        success: false,
        error: {
            code: "INTERNAL_ERROR",
            message: "An unexpected error occurred"
        },
        requestId,
        timestamp
    };
    
    let statusCode = 500;
    
    // Handle our custom errors
    if (error instanceof AppError) {
        statusCode = error.statusCode;
        response.error.code = error.code;
        response.error.message = error.message;
        
        if (error instanceof ValidationError && error.field) {
            response.error.field = error.field;
        }
    }
    // Handle Fastify validation errors
    else if ("validation" in error && error.validation) {
        statusCode = 400;
        response.error.code = "VALIDATION_ERROR";
        response.error.message = "Invalid request data";
        response.error.details = error.validation;
    }
    // Handle JWT errors
    else if (error.name === "JsonWebTokenError") {
        statusCode = 401;
        response.error.code = "INVALID_TOKEN";
        response.error.message = "Invalid authentication token";
    }
    else if (error.name === "TokenExpiredError") {
        statusCode = 401;
        response.error.code = "TOKEN_EXPIRED";
        response.error.message = "Authentication token has expired";
    }
    // Unknown errors - don't expose details
    else {
        // In development, show actual error
        if (process.env.NODE_ENV === "development") {
            response.error.message = error.message;
        }
    }
    
    return reply.status(statusCode).send(response);
}

// Not found handler for undefined routes
export function notFoundHandler(
    request: FastifyRequest,
    reply: FastifyReply
) {
    return reply.status(404).send({
        success: false,
        error: {
            code: "ROUTE_NOT_FOUND",
            message: `Route ${request.method} ${request.url} not found`
        },
        timestamp: new Date().toISOString()
    });
}
```

**src/services/userService.ts**:
```typescript
import { 
    ValidationError, 
    NotFoundError, 
    ConflictError,
    AuthenticationError 
} from "../errors";
import { User, UserTransformer, UserResponse } from "../transformers/userTransformer";

// Simulated database
const users: User[] = [
    {
        id: 1,
        name: "Admin User",
        email: "admin@example.com",
        password: "$2b$10$hashedpassword",
        role: "admin",
        isActive: true,
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-01")
    },
    {
        id: 2,
        name: "Regular User",
        email: "user@example.com",
        password: "$2b$10$hashedpassword",
        role: "user",
        isActive: true,
        createdAt: new Date("2024-01-02"),
        updatedAt: new Date("2024-01-02")
    }
];

export class UserService {
    async getAllUsers(): Promise<UserResponse[]> {
        // Transform before returning
        return users.map(user => UserTransformer.toPublicResponse(user));
    }
    
    async getUserById(id: number): Promise<UserResponse> {
        // Validate input
        if (!id || id <= 0) {
            throw new ValidationError("Invalid user ID", "id");
        }
        
        const user = users.find(u => u.id === id);
        
        if (!user) {
            throw new NotFoundError("User");
        }
        
        return UserTransformer.toPublicResponse(user);
    }
    
    async createUser(data: any): Promise<UserResponse> {
        // Sanitize input
        const sanitized = UserTransformer.sanitizeInput(data);
        
        // Validate
        if (!sanitized.name || sanitized.name.length < 2) {
            throw new ValidationError("Name must be at least 2 characters", "name");
        }
        
        if (!sanitized.email) {
            throw new ValidationError("Email is required", "email");
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(sanitized.email)) {
            throw new ValidationError("Invalid email format", "email");
        }
        
        if (!sanitized.password || sanitized.password.length < 6) {
            throw new ValidationError("Password must be at least 6 characters", "password");
        }
        
        // Check uniqueness
        const existing = users.find(u => u.email === sanitized.email);
        if (existing) {
            throw new ConflictError("Email already registered");
        }
        
        // Create user
        const newUser: User = {
            id: users.length + 1,
            name: sanitized.name!,
            email: sanitized.email!,
            password: `$2b$10$hashed_${sanitized.password}`,  // Simulated hash
            role: "user",
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        
        users.push(newUser);
        
        // Return transformed (safe) response
        return UserTransformer.toPublicResponse(newUser);
    }
    
    async updateUser(id: number, data: any): Promise<UserResponse> {
        // Validate ID
        if (!id || id <= 0) {
            throw new ValidationError("Invalid user ID", "id");
        }
        
        const userIndex = users.findIndex(u => u.id === id);
        
        if (userIndex === -1) {
            throw new NotFoundError("User");
        }
        
        // Sanitize input
        const sanitized = UserTransformer.sanitizeInput(data);
        
        // Validate if provided
        if (sanitized.name !== undefined && sanitized.name.length < 2) {
            throw new ValidationError("Name must be at least 2 characters", "name");
        }
        
        if (sanitized.email !== undefined) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(sanitized.email)) {
                throw new ValidationError("Invalid email format", "email");
            }
            
            // Check email uniqueness (excluding current user)
            const existing = users.find(u => u.email === sanitized.email && u.id !== id);
            if (existing) {
                throw new ConflictError("Email already in use");
            }
        }
        
        // Update
        users[userIndex] = {
            ...users[userIndex],
            ...sanitized,
            updatedAt: new Date()
        };
        
        return UserTransformer.toPublicResponse(users[userIndex]);
    }
    
    async deleteUser(id: number): Promise<void> {
        if (!id || id <= 0) {
            throw new ValidationError("Invalid user ID", "id");
        }
        
        const userIndex = users.findIndex(u => u.id === id);
        
        if (userIndex === -1) {
            throw new NotFoundError("User");
        }
        
        users.splice(userIndex, 1);
    }
}

export const userService = new UserService();
```

**src/index.ts**:
```typescript
import Fastify from "fastify";
import { globalErrorHandler, notFoundHandler } from "./middleware/errorHandler";
import { userService } from "./services/userService";
import { 
    ValidationError, 
    NotFoundError, 
    ConflictError,
    AuthenticationError,
    AuthorizationError 
} from "./errors";

const app = Fastify({ logger: false });
const PORT = 3000;

// Register error handlers
app.setErrorHandler(globalErrorHandler);
app.setNotFoundHandler(notFoundHandler);

// Routes
app.get("/users", async (request, reply) => {
    const users = await userService.getAllUsers();
    return { success: true, data: { users } };
});

app.get<{ Params: { id: string } }>("/users/:id", async (request, reply) => {
    const id = parseInt(request.params.id);
    const user = await userService.getUserById(id);
    return { success: true, data: { user } };
});

app.post("/users", async (request, reply) => {
    const user = await userService.createUser(request.body);
    return reply.status(201).send({ success: true, data: { user } });
});

app.put<{ Params: { id: string } }>("/users/:id", async (request, reply) => {
    const id = parseInt(request.params.id);
    const user = await userService.updateUser(id, request.body);
    return { success: true, data: { user } };
});

app.delete<{ Params: { id: string } }>("/users/:id", async (request, reply) => {
    const id = parseInt(request.params.id);
    await userService.deleteUser(id);
    return reply.status(204).send();
});

// Test error throwing
app.get("/test/validation", async () => {
    throw new ValidationError("Test validation error", "testField");
});

app.get("/test/notfound", async () => {
    throw new NotFoundError("TestResource");
});

app.get("/test/conflict", async () => {
    throw new ConflictError("Test conflict error");
});

app.get("/test/auth", async () => {
    throw new AuthenticationError("Test auth error");
});

app.get("/test/forbidden", async () => {
    throw new AuthorizationError("Test forbidden error");
});

app.get("/test/unknown", async () => {
    throw new Error("Unknown error for testing");
});

async function main() {
    console.log("=== Day 19: Error Handling & Data Transformation ===\n");
    
    await app.listen({ port: PORT });
    console.log(`Server running at http://localhost:${PORT}\n`);
    
    // Test scenarios
    console.log("--- Testing Error Handling ---\n");
    
    // 1. Successful request
    console.log("1. GET /users (success)");
    let res = await app.inject({ method: "GET", url: "/users" });
    console.log(`   Status: ${res.statusCode}`);
    console.log(`   Response: ${res.body.substring(0, 100)}...\n`);
    
    // 2. Validation error
    console.log("2. POST /users (validation error - missing name)");
    res = await app.inject({
        method: "POST",
        url: "/users",
        payload: { email: "test@test.com", password: "123456" }
    });
    console.log(`   Status: ${res.statusCode}`);
    console.log(`   Response: ${res.body}\n`);
    
    // 3. Not found error
    console.log("3. GET /users/999 (not found)");
    res = await app.inject({ method: "GET", url: "/users/999" });
    console.log(`   Status: ${res.statusCode}`);
    console.log(`   Response: ${res.body}\n`);
    
    // 4. Conflict error
    console.log("4. POST /users (conflict - duplicate email)");
    res = await app.inject({
        method: "POST",
        url: "/users",
        payload: { name: "Test", email: "admin@example.com", password: "123456" }
    });
    console.log(`   Status: ${res.statusCode}`);
    console.log(`   Response: ${res.body}\n`);
    
    // 5. Invalid ID format
    console.log("5. GET /users/abc (invalid ID)");
    res = await app.inject({ method: "GET", url: "/users/abc" });
    console.log(`   Status: ${res.statusCode}`);
    console.log(`   Response: ${res.body}\n`);
    
    // 6. Route not found
    console.log("6. GET /nonexistent (route not found)");
    res = await app.inject({ method: "GET", url: "/nonexistent" });
    console.log(`   Status: ${res.statusCode}`);
    console.log(`   Response: ${res.body}\n`);
    
    // 7. Test custom errors
    console.log("7. Testing custom error types:");
    
    const errorTests = [
        "/test/validation",
        "/test/notfound",
        "/test/conflict",
        "/test/auth",
        "/test/forbidden",
        "/test/unknown"
    ];
    
    for (const url of errorTests) {
        res = await app.inject({ method: "GET", url });
        const body = JSON.parse(res.body);
        console.log(`   ${url}: ${res.statusCode} - ${body.error.code}`);
    }
    
    // 8. Successful create with transformation
    console.log("\n8. POST /users (success - check transformation)");
    res = await app.inject({
        method: "POST",
        url: "/users",
        payload: {
            name: "  John Doe  ",  // Will be trimmed
            email: "JOHN@EXAMPLE.COM",  // Will be lowercased
            password: "secret123"
        }
    });
    console.log(`   Status: ${res.statusCode}`);
    const created = JSON.parse(res.body);
    console.log(`   Name: "${created.data.user.name}" (trimmed)`);
    console.log(`   Email: "${created.data.user.email}" (lowercased)`);
    console.log(`   Has password field: ${"password" in created.data.user}`);
    
    console.log("\n=== All Tests Completed ===");
    await app.close();
}

main().catch(console.error);
```

---

## ✍️ Exercises

### Exercise 1: Add More Error Types
Create additional error classes:
- `RateLimitError` (429)
- `ServiceUnavailableError` (503)
- `BadGatewayError` (502)

### Exercise 2: Add Error Logging Service
Create an error logging service that:
- Logs to console in development
- Would log to external service in production
- Includes request context
- Sanitizes sensitive data

### Exercise 3: Add Response Transformer
Create a generic response transformer that:
- Wraps all responses in consistent format
- Adds metadata (timestamp, requestId)
- Handles pagination metadata
- Removes null/undefined fields

---

## ❓ Quiz Questions

### Q1: Error Types
What HTTP status code should each error type return?
- Validation error
- Not found
- Duplicate resource
- Unauthorized

**Your Answer**: 


### Q2: Sensitive Data
What data should NEVER be included in API responses?

**Your Answer**: 


### Q3: Error Messages
Why should production error messages be generic for 500 errors?

**Your Answer**: 


---

## 📝 Bonus Questions (Optional)

### B1: How would you implement error tracking in a production application?

**Your Answer**: 


### B2: What is the difference between operational errors and programmer errors?

**Your Answer**: 


---

## ✅ Day 19 Checklist

- [ ] Read Module 9 (Lines 4601-4928)
- [ ] Understand different error types
- [ ] Understand custom error classes
- [ ] Understand global error handling
- [ ] Understand data transformation for security
- [ ] Understand input sanitization
- [ ] Type all code examples
- [ ] Complete Exercise 1 (More error types)
- [ ] Complete Exercise 2 (Error logging)
- [ ] Complete Exercise 3 (Response transformer)
- [ ] Answer all quiz questions
- [ ] Update Progress.md

---

## 🔗 Next Day Preview
Tomorrow is **Hands-On Exercises Day** - you'll practice everything you've learned by completing comprehensive exercises from the module.
