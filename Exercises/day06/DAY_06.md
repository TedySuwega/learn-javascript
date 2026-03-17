# Day 6: Database Connection & Error Handling

## 📚 What to Learn Today
- **Read**: [LEARNING_MODULE.md](../../Modules/LEARNING_MODULE.md) - Module 3 (Lines 851-1158)
- **Time**: ~35 minutes reading, ~25 minutes practice
- **Topics**: Database connection, dependency injection, error handling

---

## 📖 Key Concepts

### 1. Connecting to a Database
Before your app can store/retrieve data, it must connect to a database.

```typescript
// Typical database connection flow
async function connectDatabase() {
    try {
        await database.connect({
            host: "localhost",
            port: 5432,
            database: "myapp",
            username: "user",
            password: "secret"
        });
        console.log("✅ Database connected!");
    } catch (error) {
        console.error("❌ Database connection failed:", error);
        process.exit(1);  // Stop the app if DB fails
    }
}
```

### 2. Why Database Connection Can Fail
- Database server is not running
- Wrong credentials (username/password)
- Wrong host or port
- Network issues
- Database doesn't exist

**Always wrap database operations in try-catch!**

### 3. What is Dependency Injection?
**Dependency Injection (DI)** = Passing dependencies to a function/class instead of creating them inside.

```typescript
// ❌ Without DI - Hard to test, tightly coupled
class UserService {
    private db = new Database();  // Creates its own database
    
    getUsers() {
        return this.db.query("SELECT * FROM users");
    }
}

// ✅ With DI - Easy to test, loosely coupled
class UserService {
    constructor(private db: Database) {}  // Database is passed in
    
    getUsers() {
        return this.db.query("SELECT * FROM users");
    }
}

// Usage
const realDb = new Database();
const userService = new UserService(realDb);

// For testing - pass a fake database
const fakeDb = new FakeDatabase();
const testService = new UserService(fakeDb);
```

### 4. Benefits of Dependency Injection
1. **Testability** - Easy to mock dependencies
2. **Flexibility** - Swap implementations easily
3. **Decoupling** - Components don't depend on concrete implementations

### 5. Error Handling Best Practices

```typescript
// 1. Use try-catch for async operations
async function getUser(id: number) {
    try {
        const user = await database.findById(id);
        return user;
    } catch (error) {
        console.error("Error fetching user:", error);
        throw error;  // Re-throw or handle appropriately
    }
}

// 2. Create custom error classes
class NotFoundError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "NotFoundError";
    }
}

class ValidationError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "ValidationError";
    }
}

// 3. Use them in your code
function getUserById(id: number) {
    const user = users.find(u => u.id === id);
    if (!user) {
        throw new NotFoundError(`User with ID ${id} not found`);
    }
    return user;
}
```

### 6. Graceful Shutdown
When your server stops, you should close database connections properly.

```typescript
// Handle shutdown signals
process.on("SIGINT", async () => {
    console.log("Shutting down gracefully...");
    await database.close();
    process.exit(0);
});
```

---

## 💻 Code to Type & Understand

Create in `exercises/day06/`:

**src/database/connection.ts**:
```typescript
// Simulated database connection
interface DatabaseConfig {
    host: string;
    port: number;
    database: string;
    username: string;
    password: string;
}

interface DatabaseConnection {
    isConnected: boolean;
    config: DatabaseConfig | null;
}

// Simulated connection state
let connection: DatabaseConnection = {
    isConnected: false,
    config: null
};

// Simulate connection delay
function delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export async function connect(config: DatabaseConfig): Promise<void> {
    console.log(`🔌 Connecting to ${config.host}:${config.port}/${config.database}...`);
    
    // Simulate connection time
    await delay(1000);
    
    // Simulate connection failure for wrong credentials
    if (config.password === "wrong") {
        throw new Error("Authentication failed: Invalid password");
    }
    
    // Simulate connection failure for wrong host
    if (config.host === "invalid-host") {
        throw new Error("Connection refused: Host not found");
    }
    
    connection.isConnected = true;
    connection.config = config;
    console.log("✅ Database connected successfully!");
}

export async function disconnect(): Promise<void> {
    if (connection.isConnected) {
        console.log("🔌 Disconnecting from database...");
        await delay(500);
        connection.isConnected = false;
        connection.config = null;
        console.log("✅ Database disconnected");
    }
}

export function isConnected(): boolean {
    return connection.isConnected;
}

export function getConnection(): DatabaseConnection {
    return connection;
}
```

**src/errors/customErrors.ts**:
```typescript
// Custom error classes for better error handling

export class AppError extends Error {
    constructor(
        message: string,
        public statusCode: number = 500
    ) {
        super(message);
        this.name = "AppError";
    }
}

export class NotFoundError extends AppError {
    constructor(resource: string) {
        super(`${resource} not found`, 404);
        this.name = "NotFoundError";
    }
}

export class ValidationError extends AppError {
    constructor(message: string) {
        super(message, 400);
        this.name = "ValidationError";
    }
}

export class DatabaseError extends AppError {
    constructor(message: string) {
        super(`Database error: ${message}`, 500);
        this.name = "DatabaseError";
    }
}

export class AuthenticationError extends AppError {
    constructor(message: string = "Authentication failed") {
        super(message, 401);
        this.name = "AuthenticationError";
    }
}
```

**src/repositories/userRepository.ts**:
```typescript
// Repository with dependency injection
import { isConnected } from "../database/connection";
import { DatabaseError, NotFoundError } from "../errors/customErrors";

interface User {
    id: number;
    name: string;
    email: string;
}

// Simulated database storage
let users: User[] = [
    { id: 1, name: "Alice", email: "alice@example.com" },
    { id: 2, name: "Bob", email: "bob@example.com" }
];

// Repository class with DI-ready structure
export class UserRepository {
    // In real app, database connection would be injected here
    
    private checkConnection(): void {
        if (!isConnected()) {
            throw new DatabaseError("Not connected to database");
        }
    }
    
    async findAll(): Promise<User[]> {
        this.checkConnection();
        console.log("[Repository] Finding all users");
        return users;
    }
    
    async findById(id: number): Promise<User> {
        this.checkConnection();
        console.log(`[Repository] Finding user with ID: ${id}`);
        
        const user = users.find(u => u.id === id);
        if (!user) {
            throw new NotFoundError(`User with ID ${id}`);
        }
        return user;
    }
    
    async create(data: Omit<User, "id">): Promise<User> {
        this.checkConnection();
        console.log("[Repository] Creating new user");
        
        const newUser: User = {
            id: users.length + 1,
            ...data
        };
        users.push(newUser);
        return newUser;
    }
    
    async delete(id: number): Promise<void> {
        this.checkConnection();
        console.log(`[Repository] Deleting user with ID: ${id}`);
        
        const index = users.findIndex(u => u.id === id);
        if (index === -1) {
            throw new NotFoundError(`User with ID ${id}`);
        }
        users.splice(index, 1);
    }
}
```

**src/index.ts**:
```typescript
// Entry point with proper error handling
import { connect, disconnect, isConnected } from "./database/connection";
import { UserRepository } from "./repositories/userRepository";
import { NotFoundError, DatabaseError } from "./errors/customErrors";

const userRepository = new UserRepository();

async function main() {
    console.log("=== Day 06: Database Connection & Error Handling ===\n");
    
    // Test 1: Try to use repository before connecting
    console.log("--- Test 1: Before Connection ---");
    try {
        await userRepository.findAll();
    } catch (error) {
        if (error instanceof DatabaseError) {
            console.log("Caught DatabaseError:", error.message);
        }
    }
    
    // Test 2: Connect with wrong password
    console.log("\n--- Test 2: Wrong Password ---");
    try {
        await connect({
            host: "localhost",
            port: 5432,
            database: "myapp",
            username: "admin",
            password: "wrong"
        });
    } catch (error) {
        console.log("Caught connection error:", (error as Error).message);
    }
    
    // Test 3: Connect successfully
    console.log("\n--- Test 3: Successful Connection ---");
    try {
        await connect({
            host: "localhost",
            port: 5432,
            database: "myapp",
            username: "admin",
            password: "correct"
        });
    } catch (error) {
        console.log("Connection failed:", error);
        process.exit(1);
    }
    
    // Test 4: Use repository after connecting
    console.log("\n--- Test 4: Repository Operations ---");
    try {
        const users = await userRepository.findAll();
        console.log("All users:", users);
        
        const user = await userRepository.findById(1);
        console.log("User 1:", user);
    } catch (error) {
        console.log("Error:", error);
    }
    
    // Test 5: Handle NotFoundError
    console.log("\n--- Test 5: User Not Found ---");
    try {
        await userRepository.findById(999);
    } catch (error) {
        if (error instanceof NotFoundError) {
            console.log("Caught NotFoundError:", error.message);
            console.log("Status code:", error.statusCode);
        }
    }
    
    // Test 6: Graceful shutdown
    console.log("\n--- Test 6: Graceful Shutdown ---");
    await disconnect();
    
    console.log("\n=== All tests completed ===");
}

// Handle unexpected errors
process.on("uncaughtException", (error) => {
    console.error("Uncaught Exception:", error);
    process.exit(1);
});

process.on("unhandledRejection", (reason) => {
    console.error("Unhandled Rejection:", reason);
    process.exit(1);
});

// Run
main();
```

---

## ✍️ Exercises

### Exercise 1: Add Connection Retry
Modify the connect function to retry 3 times before failing:
```typescript
async function connectWithRetry(config, maxRetries = 3) {
    // Your implementation
}
```

### Exercise 2: Create ProductRepository
Create a ProductRepository class with:
- findAll, findById, create, delete methods
- Proper error handling
- Connection check before operations

### Exercise 3: Error Handler Function
Create a function that handles different error types:
```typescript
function handleError(error: Error): { status: number; message: string } {
    // Return appropriate status and message based on error type
}
```

### Mini Exercise

Look at this code and answer:

```typescript
const app = Fastify({ logger: true })
await app.listen({ port: 4000, host: '0.0.0.0' })
```

1. What does `logger: true` do?
- to record or log any error or event
**✅ Correct!**

2. What port will the server listen on?
- 4000
**✅ Correct!**

3. What URL would you use to access this server?
- 0.0.0.0 or localhost
**⚠️ Partial** — `0.0.0.0` is the "bind address" (meaning "listen on all network interfaces"), not the URL you'd use. The actual URL would be `http://localhost:4000` or `http://127.0.0.1:4000`.

---

## ❓ Quiz Questions

### Q1: Dependency Injection
What is dependency injection and why is it useful?

**Your Answer**: 
passing dependencies to function/class insted of creating them inside,  its useful because:
-Testability - Easy to mock dependencies
-Flexibility - Swap implementations easily
-Decoupling - Components don’t depend on concrete implementations
-Clarity - Clear what each class depends on

**✅ Correct!** Excellent definition and comprehensive list of benefits. You've captured the essence of DI perfectly.

### Q2: Try-Catch
Why do we wrap database connection in try-catch?

**Your Answer**: 
To make sure the logic works and if not works it will stop and throw error, try-catch must create for code that need works so the app will not use wrong state or value for next step or code.
-Preventing Crashes: Without try-catch, an unexpected DB error (like a wrong password or a timeout) will "crash" the entire application.
-Graceful Recovery: It allows you to tell the user, "Hey, we're having trouble reaching the server," instead of the app just disappearing or showing a scary white screen.
-Resource Cleanup: This is the big one. We often use try-catch-finally to ensure that even if the code fails, we close the connection. If you don't close it, you might "leak" connections until the database refuses to talk to anyone.

**✅ Correct!** Great understanding of error handling. You covered all the key reasons: crash prevention, graceful recovery, and resource cleanup.

### Q3: Connection Failure
What happens if database connection fails and we don't handle the error?

**Your Answer**: 
the app will not run corectly it can be crash or go to zombie stete that specific request fail but the app still alive in broken state

**✅ Correct!** Good understanding. The "zombie state" concept is exactly right — the app may continue running but in a broken, unpredictable state.

---

## 📝 Bonus Questions (Optional)

### B1: What is the difference between `throw error` and `console.log(error)`?

**Your Answer**: 
throw error - it will stop the program and throw error to make sure program or app not continue with wrong state
console.log(error) it not stop the program, just print the error, usualy use for diagnostic or debug

**✅ Correct!** Key difference: `throw` propagates the error up the call stack (can be caught), while `console.log` just prints and continues execution.

### B2: Why should we call `process.exit(1)` when database connection fails at startup?

**Your Answer**: 
process.exit(1) for stom the application, 1 - Exit code indicating an error (0 = success, 1+ = error), usually use in db conection to make sure if the connection fail, we stop the app cz we cannot run app wihtout database

**✅ Correct!** Exit code 1 signals failure to the OS/process manager. Essential for startup failures where the app cannot function without the database.

---

## 📊 Quiz Results: Day 6

| Question | Result | Notes |
|----------|--------|-------|
| Mini Q1 (logger) | ✅ Correct | Records/logs events |
| Mini Q2 (port) | ✅ Correct | Port 4000 |
| Mini Q3 (URL) | ⚠️ Partial | 0.0.0.0 is bind address, not URL |
| Q1 (DI) | ✅ Correct | Excellent definition and benefits |
| Q2 (try-catch) | ✅ Correct | Great understanding of error handling |
| Q3 (connection failure) | ✅ Correct | Good "zombie state" concept |
| B1 (throw vs console.log) | ✅ Correct | Key difference understood |
| B2 (process.exit) | ✅ Correct | Exit codes explained well |

**Score: 7.5/8 (94%)**

### Exercise Review
- **Exercise 1 (Retry logic)**: ✅ Completed — `connectWithRetry` with password list in `connection.ts`
- **Exercise 2 (ProductRepository)**: ✅ Completed — Full CRUD in `productRepository.ts`
- **Exercise 3 (Error handler)**: ✅ Completed — `handleError` function in `customErrors.ts`

---

## 💬 Q&A Session Notes

### Q: What does `super` mean in class inheritance?

**A:** `super` is the way you access the parent class in inheritance:
- `super(message)` in constructor → calls the parent's constructor
- `super.methodName()` in a method → calls the parent's method

```typescript
class AppError extends Error {
    constructor(message: string, public statusCode: number = 500) {
        super(message);  // Calls Error's constructor, sets this.message
        this.name = "AppError";
    }
}
```

Without `super()`, the parent class never initializes, and `this` won't be set up properly.

---

### Q: How does the simulated connection know if it failed or succeeded?

**A:** It's just checking for specific "magic" values — not real authentication:

```typescript
if (config.password === "wrong") {
    throw new Error("Authentication failed");
}
if (config.host === "invalid-host") {
    throw new Error("Host not found");
}
// Anything else = success
```

This is a common pattern for **mocking** external services during learning/testing.

---

### Q: How to create `connectWithRetry` with different passwords each attempt?

**A:** Pass passwords as a separate array parameter:

```typescript
export async function connectWithRetry(
    config: Omit<DatabaseConfig, "password">,
    passwords: string[]
): Promise<void> {
    for (let i = 0; i < passwords.length; i++) {
        try {
            await connect({ ...config, password: passwords[i] });
            return;
        } catch (error) {
            console.log(`Try ${i + 1} failed:`, (error as Error).message);
        }
    }
    throw new Error(`Failed after ${passwords.length} attempts`);
}
```

---

### Q: What is `Omit<T, K>` utility type?

**A:** `Omit<DatabaseConfig, 'password'>` creates a new type with all properties **except** `password`:

```typescript
// Original
interface DatabaseConfig {
    host: string;
    port: number;
    database: string;
    username: string;
    password: string;
}

// Omit<DatabaseConfig, 'password'> becomes:
{ host: string; port: number; database: string; username: string; }
```

Other useful utility types: `Pick<T, K>`, `Partial<T>`, `Required<T>`.

---

### Q: What is `Math.min(maxRetries, passwords.length)` for?

**A:** It's a safety check to prevent accessing undefined array elements:

```typescript
// If maxRetries = 3 but passwords = ["a", "b"] (only 2)
// Without Math.min: passwords[2] = undefined → error
// With Math.min(3, 2) = 2: only tries 2 times
```

---

### Q: What is the `handleError` function concept called?

**A:** The `handleError` function implements **Centralized Error Handling** (also called Error Normalization or Error Mapping):

- **Error Normalization** — converting different error types into a uniform structure
- **Centralized Error Handling** — one place to handle all error types
- **Error Mapping** — mapping error classes to HTTP status codes

```typescript
// Instead of repeating this in every catch block:
catch (error) {
    if (error instanceof NotFoundError) { return { status: 404, ... }; }
    if (error instanceof ValidationError) { return { status: 400, ... }; }
}

// You call once:
catch (error) {
    const response = handleError(error as Error);
    // response = { status: 404, message: "User not found" }
}
```

In real APIs, this is often used as **global error middleware**:

```typescript
app.setErrorHandler((error, request, reply) => {
    const { status, message } = handleError(error);
    reply.status(status).send({ error: message });
});
```

---

## ✅ Day 6 Checklist

- [x] Read Module 3 (Lines 851-1158)
- [x] Understand database connection flow
- [x] Understand dependency injection concept
- [x] Understand custom error classes
- [x] Understand try-catch error handling
- [x] Type all code examples
- [x] Complete Exercise 1 (Retry logic)
- [x] Complete Exercise 2 (ProductRepository)
- [x] Complete Exercise 3 (Error handler)
- [x] Answer all quiz questions
- [x] Update Progress.md

---

## 🔗 Next Day Preview
Tomorrow you'll learn about **Database Fundamentals** - what databases are, SQL vs NoSQL, tables, and primary keys.
