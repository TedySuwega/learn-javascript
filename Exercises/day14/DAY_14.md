# Day 14: Controller Layer Advanced

## 📚 What to Learn Today
- **Read**: [LEARNING_MODULE.md](../../Modules/LEARNING_MODULE.md) - Module 7 (Lines 3201-3648)
- **Time**: ~35 minutes reading, ~25 minutes practice
- **Topics**: Route handlers, request validation, params/body/query

---

## 📖 Key Concepts

### 1. Complete CRUD Controller

A full **CRUD** (Create, Read, Update, Delete) controller handles all basic operations:

```typescript
class UserController {
    // CREATE - POST /users
    async create(req, reply) { ... }
    
    // READ - GET /users and GET /users/:id
    async getAll(req, reply) { ... }
    async getById(req, reply) { ... }
    
    // UPDATE - PUT /users/:id or PATCH /users/:id
    async update(req, reply) { ... }
    
    // DELETE - DELETE /users/:id
    async delete(req, reply) { ... }
}
```

### 2. PUT vs PATCH

```typescript
// PUT - Replace entire resource
// Requires ALL fields
app.put("/users/:id", async (request, reply) => {
    const { name, email, age } = request.body;  // All fields required
    // Replaces the entire user object
});

// PATCH - Partial update
// Only provided fields are updated
app.patch("/users/:id", async (request, reply) => {
    const { name } = request.body;  // Only name provided
    // Only updates the name field
});
```

### 3. Request Validation with Schemas

```typescript
// Define validation schema
const createUserSchema = {
    body: {
        type: "object",
        required: ["name", "email", "password"],
        properties: {
            name: { type: "string", minLength: 2, maxLength: 100 },
            email: { type: "string", format: "email" },
            password: { type: "string", minLength: 6 }
        }
    }
};

// Apply schema to route
app.post("/users", {
    schema: createUserSchema,
    handler: async (request, reply) => {
        // If we reach here, validation passed
        const { name, email, password } = request.body;
        // ...
    }
});
```

### 4. Handling Different Parameter Types

```typescript
// URL Parameters (:id)
// /users/123
interface ParamsType {
    id: string;
}

// Query Parameters (?key=value)
// /users?active=true&page=1&limit=10
interface QueryType {
    active?: string;
    page?: string;
    limit?: string;
}

// Request Body (JSON payload)
interface BodyType {
    name: string;
    email: string;
    password: string;
}

// Combined in route handler
app.get<{
    Params: ParamsType;
    Querystring: QueryType;
    Body: BodyType;
}>("/users/:id", async (request, reply) => {
    const { id } = request.params;
    const { active, page } = request.query;
    const { name } = request.body;
});
```

### 5. Pagination Pattern

```typescript
interface PaginationQuery {
    page?: string;
    limit?: string;
    sortBy?: string;
    sortOrder?: string;
}

async getAll(
    request: FastifyRequest<{ Querystring: PaginationQuery }>,
    reply: FastifyReply
) {
    const page = parseInt(request.query.page || "1");
    const limit = parseInt(request.query.limit || "10");
    const sortBy = request.query.sortBy || "createdAt";
    const sortOrder = request.query.sortOrder || "desc";
    
    // Validate pagination
    const validPage = Math.max(1, page);
    const validLimit = Math.min(100, Math.max(1, limit));
    
    const result = await this.userService.getAllUsers({
        page: validPage,
        limit: validLimit,
        sortBy,
        sortOrder
    });
    
    return reply.status(200).send({
        success: true,
        data: result.users,
        pagination: {
            page: validPage,
            limit: validLimit,
            total: result.total,
            totalPages: Math.ceil(result.total / validLimit)
        }
    });
}
```

### 6. Search and Filter Pattern

```typescript
interface SearchQuery {
    search?: string;
    status?: string;
    role?: string;
    createdAfter?: string;
    createdBefore?: string;
}

async search(
    request: FastifyRequest<{ Querystring: SearchQuery }>,
    reply: FastifyReply
) {
    const filters: UserFilters = {};
    
    if (request.query.search) {
        filters.search = request.query.search;
    }
    
    if (request.query.status) {
        filters.isActive = request.query.status === "active";
    }
    
    if (request.query.role) {
        filters.role = request.query.role;
    }
    
    if (request.query.createdAfter) {
        filters.createdAfter = new Date(request.query.createdAfter);
    }
    
    const users = await this.userService.searchUsers(filters);
    
    return reply.status(200).send({
        success: true,
        data: { users },
        filters: request.query
    });
}
```

### 7. Complete Controller with All Methods

```typescript
export class UserController {
    constructor(private userService: UserService) {}
    
    // GET /users
    async getAll(req: FastifyRequest, reply: FastifyReply) {
        const users = await this.userService.getAllUsers();
        return reply.status(200).send({ users });
    }
    
    // GET /users/:id
    async getById(
        req: FastifyRequest<{ Params: { id: string } }>,
        reply: FastifyReply
    ) {
        const id = parseInt(req.params.id);
        const user = await this.userService.getUserById(id);
        return reply.status(200).send({ user });
    }
    
    // POST /users
    async create(
        req: FastifyRequest<{ Body: CreateUserDTO }>,
        reply: FastifyReply
    ) {
        const user = await this.userService.register(req.body);
        return reply.status(201).send({ user });
    }
    
    // PUT /users/:id (full update)
    async update(
        req: FastifyRequest<{ Params: { id: string }; Body: UpdateUserDTO }>,
        reply: FastifyReply
    ) {
        const id = parseInt(req.params.id);
        const user = await this.userService.updateUser(id, req.body);
        return reply.status(200).send({ user });
    }
    
    // PATCH /users/:id (partial update)
    async partialUpdate(
        req: FastifyRequest<{ Params: { id: string }; Body: Partial<UpdateUserDTO> }>,
        reply: FastifyReply
    ) {
        const id = parseInt(req.params.id);
        const user = await this.userService.updateUser(id, req.body);
        return reply.status(200).send({ user });
    }
    
    // DELETE /users/:id
    async delete(
        req: FastifyRequest<{ Params: { id: string } }>,
        reply: FastifyReply
    ) {
        const id = parseInt(req.params.id);
        await this.userService.deleteUser(id);
        return reply.status(204).send();
    }
}
```

---

## 💻 Code to Type & Understand

Extend your Day 13 code in `exercises/day14/`:

**src/controllers/userController.ts** (complete version):
```typescript
import { FastifyRequest, FastifyReply } from "fastify";
import { UserService } from "../services/userService";

// Type definitions
interface IdParams {
    id: string;
}

interface CreateUserBody {
    name: string;
    email: string;
    password: string;
}

interface UpdateUserBody {
    name?: string;
    email?: string;
    isActive?: boolean;
}

interface PaginationQuery {
    page?: string;
    limit?: string;
    sortBy?: string;
    sortOrder?: string;
}

interface SearchQuery extends PaginationQuery {
    search?: string;
    active?: string;
}

export class UserController {
    constructor(private userService: UserService) {
        console.log("[Controller] UserController initialized");
    }
    
    // ============ GET /users ============
    async getAll(
        request: FastifyRequest<{ Querystring: SearchQuery }>,
        reply: FastifyReply
    ) {
        console.log("[Controller] GET /users");
        console.log("[Controller] Query:", request.query);
        
        try {
            // Parse pagination
            const page = parseInt(request.query.page || "1");
            const limit = parseInt(request.query.limit || "10");
            
            // Validate pagination
            const validPage = Math.max(1, page);
            const validLimit = Math.min(100, Math.max(1, limit));
            
            // Get users
            const users = await this.userService.getAllUsers();
            
            // Apply search filter (simplified)
            let filteredUsers = users;
            if (request.query.search) {
                const search = request.query.search.toLowerCase();
                filteredUsers = users.filter(u => 
                    u.name.toLowerCase().includes(search) ||
                    u.email.toLowerCase().includes(search)
                );
            }
            
            // Apply active filter
            if (request.query.active !== undefined) {
                const isActive = request.query.active === "true";
                filteredUsers = filteredUsers.filter(u => u.isActive === isActive);
            }
            
            // Apply pagination
            const startIndex = (validPage - 1) * validLimit;
            const paginatedUsers = filteredUsers.slice(startIndex, startIndex + validLimit);
            
            return reply.status(200).send({
                success: true,
                data: { users: paginatedUsers },
                pagination: {
                    page: validPage,
                    limit: validLimit,
                    total: filteredUsers.length,
                    totalPages: Math.ceil(filteredUsers.length / validLimit)
                }
            });
        } catch (error: any) {
            return this.handleError(error, reply);
        }
    }
    
    // ============ GET /users/:id ============
    async getById(
        request: FastifyRequest<{ Params: IdParams }>,
        reply: FastifyReply
    ) {
        const { id } = request.params;
        console.log(`[Controller] GET /users/${id}`);
        
        try {
            const userId = this.parseId(id);
            if (userId === null) {
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
            return this.handleError(error, reply);
        }
    }
    
    // ============ POST /users ============
    async create(
        request: FastifyRequest<{ Body: CreateUserBody }>,
        reply: FastifyReply
    ) {
        console.log("[Controller] POST /users");
        
        try {
            // Validate required fields
            const validation = this.validateCreateBody(request.body);
            if (!validation.valid) {
                return reply.status(400).send({
                    success: false,
                    error: validation.error
                });
            }
            
            const user = await this.userService.register(request.body);
            
            return reply.status(201).send({
                success: true,
                data: { user },
                message: "User created successfully"
            });
        } catch (error: any) {
            return this.handleError(error, reply);
        }
    }
    
    // ============ PUT /users/:id (Full Update) ============
    async update(
        request: FastifyRequest<{ Params: IdParams; Body: UpdateUserBody }>,
        reply: FastifyReply
    ) {
        const { id } = request.params;
        console.log(`[Controller] PUT /users/${id}`);
        
        try {
            const userId = this.parseId(id);
            if (userId === null) {
                return reply.status(400).send({
                    success: false,
                    error: "Invalid user ID format"
                });
            }
            
            // For PUT, we might require all fields
            // (simplified here - just using partial update)
            const user = await this.userService.updateUser(userId, request.body);
            
            return reply.status(200).send({
                success: true,
                data: { user },
                message: "User updated successfully"
            });
        } catch (error: any) {
            return this.handleError(error, reply);
        }
    }
    
    // ============ PATCH /users/:id (Partial Update) ============
    async partialUpdate(
        request: FastifyRequest<{ Params: IdParams; Body: Partial<UpdateUserBody> }>,
        reply: FastifyReply
    ) {
        const { id } = request.params;
        console.log(`[Controller] PATCH /users/${id}`);
        
        try {
            const userId = this.parseId(id);
            if (userId === null) {
                return reply.status(400).send({
                    success: false,
                    error: "Invalid user ID format"
                });
            }
            
            // Check if body has any fields
            if (Object.keys(request.body).length === 0) {
                return reply.status(400).send({
                    success: false,
                    error: "No fields to update"
                });
            }
            
            const user = await this.userService.updateUser(userId, request.body);
            
            return reply.status(200).send({
                success: true,
                data: { user },
                message: "User updated successfully"
            });
        } catch (error: any) {
            return this.handleError(error, reply);
        }
    }
    
    // ============ DELETE /users/:id ============
    async delete(
        request: FastifyRequest<{ Params: IdParams }>,
        reply: FastifyReply
    ) {
        const { id } = request.params;
        console.log(`[Controller] DELETE /users/${id}`);
        
        try {
            const userId = this.parseId(id);
            if (userId === null) {
                return reply.status(400).send({
                    success: false,
                    error: "Invalid user ID format"
                });
            }
            
            await this.userService.deleteUser(userId);
            
            // 204 No Content - successful deletion
            return reply.status(204).send();
        } catch (error: any) {
            return this.handleError(error, reply);
        }
    }
    
    // ============ HELPERS ============
    
    private parseId(id: string): number | null {
        const parsed = parseInt(id);
        return isNaN(parsed) || parsed <= 0 ? null : parsed;
    }
    
    private validateCreateBody(body: CreateUserBody): { valid: boolean; error?: string } {
        if (!body.name) {
            return { valid: false, error: "Name is required" };
        }
        if (!body.email) {
            return { valid: false, error: "Email is required" };
        }
        if (!body.password) {
            return { valid: false, error: "Password is required" };
        }
        return { valid: true };
    }
    
    private handleError(error: Error, reply: FastifyReply) {
        console.log("[Controller] Error:", error.message);
        
        const statusCode = this.mapErrorToStatus(error);
        
        return reply.status(statusCode).send({
            success: false,
            error: error.message
        });
    }
    
    private mapErrorToStatus(error: Error): number {
        const message = error.message.toLowerCase();
        
        if (message.includes("not found")) return 404;
        if (message.includes("already") || 
            message.includes("invalid") || 
            message.includes("required") ||
            message.includes("must be")) return 400;
        if (message.includes("unauthorized") || 
            message.includes("invalid email or password")) return 401;
        if (message.includes("forbidden")) return 403;
        
        return 500;
    }
}
```

**src/routes/userRoutes.ts** (complete version):
```typescript
import { FastifyInstance } from "fastify";
import { UserController } from "../controllers/userController";
import { UserService } from "../services/userService";
import { userRepository } from "../repositories/userRepository";

export async function userRoutes(app: FastifyInstance) {
    const userService = new UserService(userRepository);
    const userController = new UserController(userService);
    
    // CRUD Routes
    app.get("/users", (req, reply) => userController.getAll(req, reply));
    app.get("/users/:id", (req, reply) => userController.getById(req, reply));
    app.post("/users", (req, reply) => userController.create(req, reply));
    app.put("/users/:id", (req, reply) => userController.update(req, reply));
    app.patch("/users/:id", (req, reply) => userController.partialUpdate(req, reply));
    app.delete("/users/:id", (req, reply) => userController.delete(req, reply));
    
    // Auth Routes
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
    console.log("=== Day 14: Controller Layer Advanced ===\n");
    
    await app.register(userRoutes);
    await app.listen({ port: PORT });
    console.log(`Server running at http://localhost:${PORT}\n`);
    
    // Test all CRUD operations
    console.log("--- Testing CRUD Operations ---\n");
    
    // CREATE
    console.log("1. CREATE - POST /users");
    const createRes = await app.inject({
        method: "POST",
        url: "/users",
        payload: { name: "Test User", email: "test@test.com", password: "test123" }
    });
    console.log(`   Status: ${createRes.statusCode}`);
    const created = JSON.parse(createRes.body);
    console.log(`   Created ID: ${created.data?.user?.id}\n`);
    
    // READ ALL with pagination
    console.log("2. READ ALL - GET /users?page=1&limit=5");
    const readAllRes = await app.inject({
        method: "GET",
        url: "/users?page=1&limit=5"
    });
    console.log(`   Status: ${readAllRes.statusCode}`);
    const readAll = JSON.parse(readAllRes.body);
    console.log(`   Pagination: ${JSON.stringify(readAll.pagination)}\n`);
    
    // READ ALL with search
    console.log("3. READ ALL - GET /users?search=test");
    const searchRes = await app.inject({
        method: "GET",
        url: "/users?search=test"
    });
    console.log(`   Status: ${searchRes.statusCode}`);
    const searchResult = JSON.parse(searchRes.body);
    console.log(`   Found: ${searchResult.data?.users?.length} users\n`);
    
    // READ ONE
    console.log("4. READ ONE - GET /users/1");
    const readOneRes = await app.inject({
        method: "GET",
        url: "/users/1"
    });
    console.log(`   Status: ${readOneRes.statusCode}\n`);
    
    // UPDATE (PUT)
    console.log("5. UPDATE - PUT /users/1");
    const updateRes = await app.inject({
        method: "PUT",
        url: "/users/1",
        payload: { name: "Updated Name", email: "updated@test.com" }
    });
    console.log(`   Status: ${updateRes.statusCode}\n`);
    
    // PARTIAL UPDATE (PATCH)
    console.log("6. PARTIAL UPDATE - PATCH /users/1");
    const patchRes = await app.inject({
        method: "PATCH",
        url: "/users/1",
        payload: { name: "Patched Name" }
    });
    console.log(`   Status: ${patchRes.statusCode}\n`);
    
    // DELETE
    const newUserId = created.data?.user?.id;
    if (newUserId) {
        console.log(`7. DELETE - DELETE /users/${newUserId}`);
        const deleteRes = await app.inject({
            method: "DELETE",
            url: `/users/${newUserId}`
        });
        console.log(`   Status: ${deleteRes.statusCode} (204 = success)\n`);
    }
    
    // Error cases
    console.log("--- Testing Error Cases ---\n");
    
    console.log("8. GET /users/999 (not found)");
    const notFoundRes = await app.inject({ method: "GET", url: "/users/999" });
    console.log(`   Status: ${notFoundRes.statusCode}\n`);
    
    console.log("9. GET /users/abc (invalid ID)");
    const invalidRes = await app.inject({ method: "GET", url: "/users/abc" });
    console.log(`   Status: ${invalidRes.statusCode}\n`);
    
    console.log("10. PATCH /users/1 (empty body)");
    const emptyRes = await app.inject({
        method: "PATCH",
        url: "/users/1",
        payload: {}
    });
    console.log(`   Status: ${emptyRes.statusCode}\n`);
    
    console.log("=== All Tests Completed ===");
    await app.close();
}

main().catch(console.error);
```

---

## ✍️ Exercises

### Exercise 1: Add Sorting
Enhance the `getAll` method to support sorting:
- `GET /users?sortBy=name&sortOrder=asc`
- Support sorting by: name, email, createdAt
- Support order: asc, desc

### Exercise 2: Add Validation Schema
Create Fastify validation schemas for:
- Create user (name: 2-100 chars, email: valid format, password: 6+ chars)
- Update user (all fields optional but validated if present)

### Exercise 3: Create BookController
Create a complete BookController with:
- All CRUD operations
- Pagination support
- Search by title or author
- Filter by availability

---

## ❓ Quiz Questions

### Q1: PUT vs PATCH
What is the difference between PUT and PATCH?

**Your Answer**: 
- PUT is used to replace an entire resource. You must send the complete resource representation; any missing fields will typically be overwritten with null or default values. It is idempotent, meaning making the same request multiple times will always yield the same result.

- PATCH is used for partial updates. You only send the specific fields you want to modify, leaving the rest of the resource untouched. It is generally non-idempotent, as repeating a relative instruction (e.g., "add 1 to age") alters the resource state each time.

**✅ Correct!** You nailed the core distinction: PUT replaces the whole resource (all fields), PATCH updates only what you send. Your code mirrors this — `replaceUserSchema` requires every field; `patchUserSchema` allows partials with `minProperties: 1`. Small nuance: PATCH *can* be idempotent when you send absolute values (e.g. `{ "name": "Alice" }` twice); it’s only non-idempotent with relative ops like JSON Patch `"add"`.

### Q2: Pagination
What information should a paginated response include?

**Your Answer**: 
- Data payload: The current slice of items.
- Metadata:
    - totalCount (total items across all pages)
    - pageSize / limit (items per page)
    - currentPage / cursor (current position)
    - totalPages (total pages available)

**✅ Correct!** Your field names map directly to what your API returns: `data` (the slice), `pagination.page`, `pagination.limit`, `pagination.total`, and `pagination.totalPages`. Clients need those four metadata fields to build “page X of Y” navigation.

### Q3: Status Code for Delete
What status code should DELETE return on success and why?

**Your Answer**: 
- 204 No Content: The most common choice. Use this if the resource was successfully deleted and the server has no body/response payload to send back.
- 200 OK: Use this if want to return a response body, such as a confirmation message or a copy of the deleted item.
- 202 Accepted: Use this if the deletion task has been accepted but is being processed asynchronously (e.g., a background job running later).

**✅ Correct!** **204 No Content** is the default for a successful DELETE with no body — exactly what your `userController.delete` and `bookController.delete` return. **200** is fine when you return a confirmation or the deleted record; **202** fits async/queued deletes.

---

## 📝 Bonus Questions (Optional)

### B1: Why validate in both controller and service layer?

**Your Answer**: 
- Controller: Fails fast by validating basic input formats (HTTP level) to save server resources.
- Service: Validates core business logic and data integrity, protecting the system regardless of whether the request came from an API, a cron job, or a CLI tool.

**✅ Correct!** In your project this split is real: Fastify schemas in `schemas/userSchemas.ts` catch bad HTTP shape before the handler runs; `UserService.validateRegistration()` enforces business rules (duplicate email, password length) even if something bypasses HTTP.

### B2: How would you handle bulk operations (e.g., delete multiple users)?

**Your Answer**: 
- Small/Medium scale: Pass a list of IDs via query parameters (?ids=1,2,3) or in a POST request body.
- Large scale: Process asynchronously by returning a 202 Accepted and offloading the work to a background queue.
- Database efficiency: Execute a single batch query (e.g., WHERE id IN (...)) instead of looping individual deletes.

**✅ Correct!** `DELETE /users?ids=1,2,3` or `POST /users/bulk-delete` with `{ "ids": [1,2,3] }` are the usual patterns; one `WHERE id IN (...)` in the repository beats N round-trips. **202** + background job is the right call when the list is huge.

---

## 📊 Quiz Results: Day 14

| Question | Result | Notes |
|----------|--------|-------|
| Q1: PUT vs PATCH | ✅ Correct | Full replace vs partial; idempotent PUT; PATCH idempotency nuance noted |
| Q2: Pagination metadata | ✅ Correct | Data slice + page, limit, total, totalPages |
| Q3: DELETE status code | ✅ Correct | 204 default; 200/202 alternatives explained |
| B1: Dual validation | ✅ Correct | Schema (HTTP) + service (business rules) |
| B2: Bulk operations | ✅ Correct | Batch IDs, async 202, single SQL batch |

**Score: 5/5 (100%)**

### Exercise review (`Exercises/day14/src/`)

Runnable code in [`Exercises/day14/`](./) (`package.json`, `tsconfig.json`, `src/`). Extends Day 13 patterns with full advanced controller layer.

- **Lesson code:** [`controllers/userController.ts`](src/controllers/userController.ts) — full CRUD, pagination, search/filter, `login`; [`routes/userRoutes.ts`](src/routes/userRoutes.ts); [`index.ts`](src/index.ts) — inject-based CRUD + error tests.
- **Exercise 1 (Sorting):** [`controllers/userController.ts`](src/controllers/userController.ts) — `buildFilters` + `sortBy`/`sortOrder`; [`repositories/userRepository.ts`](src/repositories/userRepository.ts) — `applySort`; [`utils/parseQuery.ts`](src/utils/parseQuery.ts) — shared parsers.
- **Exercise 2 (Validation schemas):** [`schemas/userSchemas.ts`](src/schemas/userSchemas.ts) — create, replace (PUT), patch, list query, id params; wired in [`routes/userRoutes.ts`](src/routes/userRoutes.ts).
- **Exercise 3 (BookController):** [`controllers/bookController.ts`](src/controllers/bookController.ts), [`services/bookService.ts`](src/services/bookService.ts), [`repositories/bookRepository.ts`](src/repositories/bookRepository.ts), [`routes/bookRoutes.ts`](src/routes/bookRoutes.ts), [`schemas/bookSchemas.ts`](src/schemas/bookSchemas.ts), [`types/book.ts`](src/types/book.ts).

Implementation goes beyond the lesson snippet: filter/pagination/sort live in repository/service (not controller `.filter()`/`.slice()`), PUT requires all fields via schema, and shared [`utils/mapErrorToStatus.ts`](src/utils/mapErrorToStatus.ts) is reused from Day 13.

---

## 💬 Q&A Session Notes

### Q: Please prepare the code needed for Day 14; reuse previous code where relevant.

**A:** Day 14 project was bootstrapped in `Exercises/day14/src/` from Day 13 patterns — same Fastify setup, `UserService`/`userRepository`, plus new `updateUser`, pagination/sort in the repository, Fastify schemas, and a full Book stack for Exercise 3. Run with `npm install && npm run dev`.

---

### Q: What is still not done on Day 14 so I can continue learning?

**A:** Code and exercises were already complete; remaining items were reading Module 7, typing/understanding the examples, quiz answers, and updating `PROGRESS.md`. Quiz and progress are now done via this review.

---

### Q: Is the Day 14 code correct and does it follow the instructions?

**A:** Yes. All three exercises are implemented and tests pass. Main differences from the lesson text are improvements: layered filtering (repository vs controller), stricter PUT via `replaceUserSchema`, and schema + service validation instead of duplicate controller checks. Invalid IDs return Fastify schema 400 (different message shape) instead of the controller’s `"Invalid user ID format"` — still correct HTTP behavior.

---

## ✅ Day 14 Checklist

- [x] Read Module 7 (Lines 3201-3648)
- [x] Understand complete CRUD operations
- [x] Understand PUT vs PATCH
- [x] Understand pagination pattern
- [x] Understand search and filter patterns
- [x] Understand request validation
- [x] Type all code examples
- [x] Complete Exercise 1 (Sorting)
- [x] Complete Exercise 2 (Validation schema)
- [x] Complete Exercise 3 (BookController)
- [x] Answer all quiz questions
- [x] Update Progress.md

---

## 🔗 Next Day Preview
Tomorrow is **Review & Mini Project Day** - you'll build a complete Book Management API integrating all layers (Repository, Service, Controller).
