# Day 13: Controller Layer Basics

## 📚 What to Learn Today
- **Read**: [LEARNING_MODULE.md](../../Modules/LEARNING_MODULE.md) - Module 7 (Lines 2922-3200)
- **Time**: ~35 minutes reading, ~25 minutes practice
- **Topics**: HTTP requests/responses, status codes, request handling

---

## 📖 Key Concepts

### 1. What is the Controller Layer?

The **Controller Layer** is the entry point for HTTP requests. It:
- Receives HTTP requests
- Extracts data from requests (params, body, query)
- Calls the appropriate service method
- Returns HTTP responses with proper status codes

```
HTTP Request → Controller → Service → Repository → Database
                   ↓
HTTP Response ← Controller ← Service ← Repository ← Database
```

### 2. Controller Responsibilities

| Responsibility | Example |
|---------------|---------|
| Parse request data | Extract `id` from `/users/:id` |
| Call service methods | `userService.getUserById(id)` |
| Handle errors | Catch exceptions, return error responses |
| Set status codes | 200, 201, 400, 404, 500 |
| Format responses | Return JSON with consistent structure |

**What controllers should NOT do:**
- Business logic (that's the service's job)
- Database queries (that's the repository's job)
- Complex validation (service handles this)

### 3. HTTP Status Codes

| Code | Name | When to Use |
|------|------|-------------|
| 200 | OK | Successful GET, PUT, PATCH |
| 201 | Created | Successful POST (resource created) |
| 204 | No Content | Successful DELETE |
| 400 | Bad Request | Invalid input data |
| 401 | Unauthorized | Not logged in |
| 403 | Forbidden | Logged in but not allowed |
| 404 | Not Found | Resource doesn't exist |
| 500 | Internal Server Error | Server-side error |

```typescript
// Examples
reply.status(200).send({ user });      // OK
reply.status(201).send({ user });      // Created
reply.status(204).send();              // No Content
reply.status(400).send({ error });     // Bad Request
reply.status(404).send({ error });     // Not Found
```

### 4. Request Data Sources

```typescript
// URL Parameters - /users/:id
app.get("/users/:id", async (request) => {
    const id = request.params.id;  // "123" from /users/123
});

// Query String - /users?active=true&limit=10
app.get("/users", async (request) => {
    const active = request.query.active;  // "true"
    const limit = request.query.limit;    // "10"
});

// Request Body - POST/PUT data
app.post("/users", async (request) => {
    const { name, email } = request.body;
});

// Headers
app.get("/users", async (request) => {
    const token = request.headers.authorization;
});
```

### 5. Basic Controller Structure

```typescript
import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { UserService } from "../services/userService";

export class UserController {
    constructor(private userService: UserService) {}
    
    // GET /users
    async getAll(request: FastifyRequest, reply: FastifyReply) {
        try {
            const users = await this.userService.getAllUsers();
            return reply.status(200).send({ users });
        } catch (error: any) {
            return reply.status(500).send({ error: error.message });
        }
    }
    
    // GET /users/:id
    async getById(
        request: FastifyRequest<{ Params: { id: string } }>,
        reply: FastifyReply
    ) {
        try {
            const id = parseInt(request.params.id);
            const user = await this.userService.getUserById(id);
            return reply.status(200).send({ user });
        } catch (error: any) {
            if (error.message === "User not found") {
                return reply.status(404).send({ error: error.message });
            }
            return reply.status(500).send({ error: error.message });
        }
    }
    
    // POST /users
    async create(
        request: FastifyRequest<{ Body: { name: string; email: string; password: string } }>,
        reply: FastifyReply
    ) {
        try {
            const user = await this.userService.register(request.body);
            return reply.status(201).send({ user });
        } catch (error: any) {
            if (error.message.includes("already registered")) {
                return reply.status(400).send({ error: error.message });
            }
            return reply.status(500).send({ error: error.message });
        }
    }
}
```

### 6. Consistent Response Format

```typescript
// ✅ GOOD - Consistent structure
// Success responses
{ "user": { ... } }
{ "users": [ ... ] }
{ "message": "Success" }

// Error responses
{ "error": "User not found" }
{ "error": "Invalid email format" }

// ❌ BAD - Inconsistent
{ "data": { ... } }      // Sometimes "data"
{ "result": { ... } }    // Sometimes "result"
{ "msg": "error" }       // Sometimes "msg"
```

### 7. Error Mapping

```typescript
// Map service errors to HTTP status codes
function mapErrorToStatus(error: Error): number {
    const message = error.message.toLowerCase();
    
    if (message.includes("not found")) {
        return 404;
    }
    if (message.includes("already") || message.includes("invalid") || message.includes("required")) {
        return 400;
    }
    if (message.includes("unauthorized") || message.includes("invalid email or password")) {
        return 401;
    }
    if (message.includes("forbidden") || message.includes("not allowed")) {
        return 403;
    }
    
    return 500;  // Default to server error
}
```

---

## 💻 Code to Type & Understand

Create this structure in `exercises/day13/`:

```
exercises/day13/
├── src/
│   ├── types/
│   │   └── user.ts
│   ├── repositories/
│   │   └── userRepository.ts
│   ├── services/
│   │   └── userService.ts
│   ├── controllers/
│   │   └── userController.ts
│   ├── routes/
│   │   └── userRoutes.ts
│   └── index.ts
└── package.json
```

**src/controllers/userController.ts**:
```typescript
import { FastifyRequest, FastifyReply } from "fastify";
import { UserService } from "../services/userService";

// Type definitions for request parameters
interface GetByIdParams {
    id: string;
}

interface CreateUserBody {
    name: string;
    email: string;
    password: string;
}

interface LoginBody {
    email: string;
    password: string;
}

export class UserController {
    constructor(private userService: UserService) {
        console.log("[Controller] UserController initialized");
    }
    
    // ============ GET /users ============
    async getAll(request: FastifyRequest, reply: FastifyReply) {
        console.log("[Controller] GET /users");
        
        try {
            const users = await this.userService.getAllUsers();
            
            return reply.status(200).send({
                success: true,
                data: { users },
                count: users.length
            });
        } catch (error: any) {
            console.log("[Controller] Error:", error.message);
            return reply.status(500).send({
                success: false,
                error: "Internal server error"
            });
        }
    }
    
    // ============ GET /users/:id ============
    async getById(
        request: FastifyRequest<{ Params: GetByIdParams }>,
        reply: FastifyReply
    ) {
        const { id } = request.params;
        console.log(`[Controller] GET /users/${id}`);
        
        try {
            // Parse and validate ID
            const userId = parseInt(id);
            if (isNaN(userId)) {
                return reply.status(400).send({
                    success: false,
                    error: "Invalid user ID format"
                });
            }
            
            const user = await this.userService.getUserById(userId);
            
            return reply.status(200).send({
                success: true,
                data: { user }
            });
        } catch (error: any) {
            console.log("[Controller] Error:", error.message);
            
            // Map error to appropriate status code
            const statusCode = this.mapErrorToStatus(error);
            return reply.status(statusCode).send({
                success: false,
                error: error.message
            });
        }
    }
    
    // ============ POST /users/register ============
    async register(
        request: FastifyRequest<{ Body: CreateUserBody }>,
        reply: FastifyReply
    ) {
        console.log("[Controller] POST /users/register");
        
        try {
            const { name, email, password } = request.body;
            
            // Basic presence check (detailed validation in service)
            if (!name || !email || !password) {
                return reply.status(400).send({
                    success: false,
                    error: "Name, email, and password are required"
                });
            }
            
            const user = await this.userService.register({ name, email, password });
            
            return reply.status(201).send({
                success: true,
                data: { user },
                message: "User registered successfully"
            });
        } catch (error: any) {
            console.log("[Controller] Error:", error.message);
            
            const statusCode = this.mapErrorToStatus(error);
            return reply.status(statusCode).send({
                success: false,
                error: error.message
            });
        }
    }
    
    // ============ POST /users/login ============
    async login(
        request: FastifyRequest<{ Body: LoginBody }>,
        reply: FastifyReply
    ) {
        console.log("[Controller] POST /users/login");
        
        try {
            const { email, password } = request.body;
            
            if (!email || !password) {
                return reply.status(400).send({
                    success: false,
                    error: "Email and password are required"
                });
            }
            
            const result = await this.userService.login({ email, password });
            
            return reply.status(200).send({
                success: true,
                data: result
            });
        } catch (error: any) {
            console.log("[Controller] Error:", error.message);
            
            // Login errors should be 401
            if (error.message.includes("Invalid email or password")) {
                return reply.status(401).send({
                    success: false,
                    error: error.message
                });
            }
            
            const statusCode = this.mapErrorToStatus(error);
            return reply.status(statusCode).send({
                success: false,
                error: error.message
            });
        }
    }
    
    // ============ HELPER: Error to Status Code ============
    private mapErrorToStatus(error: Error): number {
        const message = error.message.toLowerCase();
        
        if (message.includes("not found")) {
            return 404;
        }
        if (message.includes("already") || 
            message.includes("invalid") || 
            message.includes("required") ||
            message.includes("must be")) {
            return 400;
        }
        if (message.includes("unauthorized")) {
            return 401;
        }
        if (message.includes("forbidden")) {
            return 403;
        }
        
        return 500;
    }
}
```

**src/routes/userRoutes.ts**:
```typescript
import { FastifyInstance } from "fastify";
import { UserController } from "../controllers/userController";
import { UserService } from "../services/userService";
import { userRepository } from "../repositories/userRepository";

export async function userRoutes(app: FastifyInstance) {
    // Create dependencies
    const userService = new UserService(userRepository);
    const userController = new UserController(userService);
    
    // Register routes
    app.get("/users", (req, reply) => userController.getAll(req, reply));
    app.get("/users/:id", (req, reply) => userController.getById(req, reply));
    app.post("/users/register", (req, reply) => userController.register(req, reply));
    app.post("/users/login", (req, reply) => userController.login(req, reply));
    
    console.log("[Routes] User routes registered");
}
```

**src/index.ts**:
```typescript
import Fastify from "fastify";
import { userRoutes } from "./routes/userRoutes";

const app = Fastify({ logger: false });
const PORT = 3000;

async function main() {
    console.log("=== Day 13: Controller Layer Basics ===\n");
    
    // Register routes
    await app.register(userRoutes);
    
    // Health check
    app.get("/health", async () => ({ status: "ok" }));
    
    // Start server
    await app.listen({ port: PORT });
    console.log(`Server running at http://localhost:${PORT}`);
    
    // Simulate HTTP requests for testing
    console.log("\n--- Simulating HTTP Requests ---\n");
    
    // Test GET /users
    console.log("1. GET /users");
    const getAllResponse = await app.inject({
        method: "GET",
        url: "/users"
    });
    console.log(`   Status: ${getAllResponse.statusCode}`);
    console.log(`   Body: ${getAllResponse.body}\n`);
    
    // Test GET /users/1
    console.log("2. GET /users/1");
    const getByIdResponse = await app.inject({
        method: "GET",
        url: "/users/1"
    });
    console.log(`   Status: ${getByIdResponse.statusCode}`);
    console.log(`   Body: ${getByIdResponse.body}\n`);
    
    // Test GET /users/999 (not found)
    console.log("3. GET /users/999 (not found)");
    const notFoundResponse = await app.inject({
        method: "GET",
        url: "/users/999"
    });
    console.log(`   Status: ${notFoundResponse.statusCode}`);
    console.log(`   Body: ${notFoundResponse.body}\n`);
    
    // Test POST /users/register
    console.log("4. POST /users/register");
    const registerResponse = await app.inject({
        method: "POST",
        url: "/users/register",
        payload: {
            name: "Clark Kent",
            email: "clark@dailyplanet.com",
            password: "superman123"
        }
    });
    console.log(`   Status: ${registerResponse.statusCode}`);
    console.log(`   Body: ${registerResponse.body}\n`);
    
    // Test POST /users/login
    console.log("5. POST /users/login");
    const loginResponse = await app.inject({
        method: "POST",
        url: "/users/login",
        payload: {
            email: "clark@dailyplanet.com",
            password: "superman123"
        }
    });
    console.log(`   Status: ${loginResponse.statusCode}`);
    console.log(`   Body: ${loginResponse.body}\n`);
    
    // Test POST /users/login (wrong password)
    console.log("6. POST /users/login (wrong password)");
    const wrongLoginResponse = await app.inject({
        method: "POST",
        url: "/users/login",
        payload: {
            email: "clark@dailyplanet.com",
            password: "wrongpassword"
        }
    });
    console.log(`   Status: ${wrongLoginResponse.statusCode}`);
    console.log(`   Body: ${wrongLoginResponse.body}\n`);
    
    // Test invalid ID format
    console.log("7. GET /users/abc (invalid ID)");
    const invalidIdResponse = await app.inject({
        method: "GET",
        url: "/users/abc"
    });
    console.log(`   Status: ${invalidIdResponse.statusCode}`);
    console.log(`   Body: ${invalidIdResponse.body}\n`);
    
    console.log("=== All Tests Completed ===");
    
    // Close server
    await app.close();
}

main().catch(console.error);
```

---

## ✍️ Exercises

### Exercise 1: Add DELETE Endpoint
Add a DELETE endpoint to the controller:
- Route: `DELETE /users/:id`
- Returns 204 on success
- Returns 404 if user not found
- Add corresponding service method if needed

### Exercise 2: Add Query Parameters
Modify `getAll` to support query parameters:
- `GET /users?active=true` - Filter by active status
- `GET /users?limit=10` - Limit results
- `GET /users?search=john` - Search by name

### Exercise 3: Create ProductController
Create a ProductController with:
- `GET /products` - Get all products
- `GET /products/:id` - Get product by ID
- `POST /products` - Create product
- Proper error handling and status codes

---

## ❓ Quiz Questions

### Q1: Controller Responsibility
What is the main responsibility of the Controller layer?

**Your Answer**: 
| Responsibility | Example |
|---------------|---------|
| Parse request data | Extract `id` from `/users/:id` |
| Call service methods | `userService.getUserById(id)` |
| Handle errors | Catch exceptions, return error responses |
| Set status codes | 200, 201, 400, 404, 500 |
| Format responses | Return JSON with consistent structure |

**✅ Correct!** Your table matches the controller’s role: parse input, call services, map errors to HTTP, set status codes, and return consistent JSON—the HTTP boundary for your app.

### Q2: Status Codes
What status code should you return when:
a) Successfully creating a new resource?
b) Resource not found?
c) Invalid input data?

**Your Answer**: 
a)201 Created
b) 404 Not Found
c) 400 Bad Request (or 422 Unprocessable Entity for semantic errors)

**✅ Correct!** Use **201 Created** for successful POST creation, **404** when the target resource does not exist, and **400** for invalid client input. Mentioning **422** for “valid JSON but business rules failed” is a good distinction.

### Q3: Request Data
What are the three main sources of data in an HTTP request?

**Your Answer**: 
- Request Body (JSON/XML data, usually for POST/PUT)
- Query Parameters (e.g., ?id=123&sort=asc)
- Path Variables/Parameters (e.g., /users/123)

**✅ Correct!** Those are the three sources this module emphasizes. In production you also often read **headers** (for example `Authorization`); worth remembering for interviews.

---

## 📝 Bonus Questions (Optional)

### B1: Why should business logic NOT be in the controller?

**Your Answer**: 
Keeping business logic out of the controller (and in the Service layer) promotes Separation of Concerns.
- Reusable: You can call the same logic from a CLI tool or a scheduled task without needing an HTTP request.
- Testable: It is much easier to unit test pure logic than it is to mock HTTP contexts.
- Maintainable: Controllers stay "thin," making the entry points of your API easy to read.

**✅ Correct!** Separation of concerns, reuse (CLI, jobs), easier unit testing without HTTP mocks, and thin route handlers are the standard reasons to keep rules out of controllers.

### B2: What is the difference between 401 Unauthorized and 403 Forbidden?

**Your Answer**: 
- 401 Unauthorized: "I don't know who you are." The user hasn't provided valid authentication credentials (they aren't logged in).
- 403 Forbidden: "I know who you are, but you aren't allowed here." The user is authenticated but lacks the necessary permissions (e.g., a "User" trying to access an "Admin" panel).

**✅ Correct!** **401** means authentication failed or credentials are missing; **403** means the caller is recognized but not permitted for this resource or action.

---

## 📊 Quiz Results: Day 13

| Question | Result | Notes |
|----------|--------|-------|
| Q1: Controller responsibility | ✅ Correct | Matches parse → service → errors → status → response shape |
| Q2: Status codes | ✅ Correct | 201 / 404 / 400 (+ optional 422 nuance) |
| Q3: Request data sources | ✅ Correct | Body, query, path; headers optional extra |
| B1: Logic not in controller | ✅ Correct | SoC, reuse, testing, thin controllers |
| B2: 401 vs 403 | ✅ Correct | Not authenticated vs not allowed |

**Score: 5/5 (100%)**

### Exercise review (`Exercises/day13/src/`)

- **Exercise 1:** [`routes/userRoutes.ts`](src/routes/userRoutes.ts) — `DELETE /users/:id`; [`controllers/userController.ts`](src/controllers/userController.ts) — `deleteUser`; [`services/userService.ts`](src/services/userService.ts) — `deleteUser`; [`repositories/userRepository.ts`](src/repositories/userRepository.ts) — soft delete; covered in [`index.ts`](src/index.ts) inject tests.
- **Exercise 2:** [`controllers/userController.ts`](src/controllers/userController.ts) — `getAll` parses `limit`, `search`, `active`; repository filtering in [`repositories/userRepository.ts`](src/repositories/userRepository.ts); types in [`types/user.ts`](src/types/user.ts).
- **Exercise 3:** [`controllers/productController.ts`](src/controllers/productController.ts), [`routes/productRoutes.ts`](src/routes/productRoutes.ts), registered in [`index.ts`](src/index.ts); shared [`utils/mapErrorToStatus.ts`](src/utils/mapErrorToStatus.ts).

---

## 💬 Q&A Session Notes

### Q: Is my `ProductController` implementation already correct?

**A:** Yes—for Exercise 3 it matches `ProductService` errors, `mapErrorToStatus`, and the same `{ success, data, error }` pattern as `UserController`. Optional polish: use `parseInt(id, 10)` and mirror spacing in JSON payloads; behavior is already sound.

---

## ✅ Day 13 Checklist

- [x] Read Module 7 (Lines 2922-3200)
- [x] Understand what the Controller layer does
- [x] Understand HTTP status codes
- [x] Understand request data sources (params, body, query)
- [x] Understand error mapping
- [x] Type all code examples
- [x] Complete Exercise 1 (DELETE endpoint)
- [x] Complete Exercise 2 (Query parameters)
- [x] Complete Exercise 3 (ProductController)
- [x] Answer all quiz questions
- [x] Update Progress.md

---

## 🔗 Next Day Preview
Tomorrow you'll learn about **Advanced Controller Patterns** - route handlers, request validation schemas, and handling different parameter types.
