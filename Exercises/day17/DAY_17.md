# Day 17: Auth Middleware

## 📚 What to Learn Today
- **Read**: [LEARNING_MODULE.md](../../Modules/LEARNING_MODULE.md) - Module 8 (Lines 3901-4310)
- **Time**: ~35 minutes reading, ~25 minutes practice
- **Topics**: Middleware concept, token verification, protected routes

---

## 📖 Key Concepts

### 1. What is Middleware?

**Middleware** is code that runs between receiving a request and sending a response. It can:
- Modify the request
- Modify the response
- End the request-response cycle
- Call the next middleware

```
Request → Middleware 1 → Middleware 2 → Route Handler → Response
              ↓               ↓
          (logging)    (authentication)
```

### 2. Middleware Flow

```typescript
// Middleware function signature
async function middleware(request, reply, done) {
    // Do something before route handler
    console.log("Before handler");
    
    // Continue to next middleware or route handler
    done();
    
    // Or stop here and send response
    // reply.status(401).send({ error: "Unauthorized" });
}
```

### 3. Auth Middleware Purpose

The auth middleware:
1. Extracts token from Authorization header
2. Verifies the token
3. Attaches user info to request
4. Allows or denies access

```
Request with Token
       ↓
┌──────────────────────┐
│   Auth Middleware    │
│                      │
│  1. Extract token    │
│  2. Verify token     │
│  3. Attach user      │
│  4. Allow/Deny       │
└──────────────────────┘
       ↓
   Route Handler
   (has user info)
```

### 4. Authorization Header Format

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
               ^^^^^^ ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
               Type   Token
```

```typescript
// Extracting the token
function extractToken(authHeader: string | undefined): string | null {
    if (!authHeader) return null;
    
    const parts = authHeader.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer") {
        return null;
    }
    
    return parts[1];
}
```

### 5. Basic Auth Middleware

```typescript
import { FastifyRequest, FastifyReply } from "fastify";
import { verifyToken } from "../utils/jwt";

export async function authMiddleware(
    request: FastifyRequest,
    reply: FastifyReply
) {
    try {
        // Step 1: Get Authorization header
        const authHeader = request.headers.authorization;
        
        if (!authHeader) {
            return reply.status(401).send({
                error: "No authorization header"
            });
        }
        
        // Step 2: Extract token
        const token = extractToken(authHeader);
        
        if (!token) {
            return reply.status(401).send({
                error: "Invalid authorization format"
            });
        }
        
        // Step 3: Verify token
        const payload = verifyToken(token);
        
        // Step 4: Attach user to request
        request.user = payload;
        
        // Continue to route handler
    } catch (error: any) {
        return reply.status(401).send({
            error: "Invalid or expired token"
        });
    }
}
```

### 6. Extending Request Type

```typescript
// Extend FastifyRequest to include user
declare module "fastify" {
    interface FastifyRequest {
        user?: {
            userId: number;
            email: string;
            role: string;
        };
    }
}

// Now you can access request.user in route handlers
app.get("/profile", async (request, reply) => {
    const user = request.user!;  // Available after auth middleware
    return { userId: user.userId, email: user.email };
});
```

### 7. Protected vs Public Routes

```typescript
// Public routes - no auth required
app.get("/health", async () => ({ status: "ok" }));
app.post("/auth/login", loginHandler);
app.post("/auth/register", registerHandler);

// Protected routes - auth required
app.register(async (protectedRoutes) => {
    // Apply auth middleware to all routes in this scope
    protectedRoutes.addHook("preHandler", authMiddleware);
    
    protectedRoutes.get("/profile", getProfileHandler);
    protectedRoutes.get("/users", getUsersHandler);
    protectedRoutes.put("/users/:id", updateUserHandler);
});
```

### 8. Role-Based Authorization

```typescript
// Role check middleware factory
function requireRole(...allowedRoles: string[]) {
    return async (request: FastifyRequest, reply: FastifyReply) => {
        const user = request.user;
        
        if (!user) {
            return reply.status(401).send({ error: "Not authenticated" });
        }
        
        if (!allowedRoles.includes(user.role)) {
            return reply.status(403).send({ 
                error: "Insufficient permissions" 
            });
        }
    };
}

// Usage
app.delete("/users/:id", {
    preHandler: [authMiddleware, requireRole("admin")],
    handler: deleteUserHandler
});
```

### 9. Common Middleware Patterns

```typescript
// Logging middleware
async function loggingMiddleware(request: FastifyRequest) {
    console.log(`${request.method} ${request.url}`);
    console.log("User:", request.user?.email || "anonymous");
}

// Rate limiting middleware (simplified)
const requestCounts = new Map<string, number>();

async function rateLimitMiddleware(
    request: FastifyRequest,
    reply: FastifyReply
) {
    const ip = request.ip;
    const count = requestCounts.get(ip) || 0;
    
    if (count > 100) {  // 100 requests per window
        return reply.status(429).send({ error: "Too many requests" });
    }
    
    requestCounts.set(ip, count + 1);
}
```

---

## 💻 Code to Type & Understand

Create this structure in `exercises/day17/`:

```
exercises/day17/
├── src/
│   ├── types/
│   │   └── index.ts
│   ├── middleware/
│   │   ├── auth.ts
│   │   └── roleCheck.ts
│   ├── utils/
│   │   └── jwt.ts
│   ├── routes/
│   │   ├── publicRoutes.ts
│   │   └── protectedRoutes.ts
│   └── index.ts
└── package.json
```

**src/types/index.ts**:
```typescript
// Extend Fastify types
declare module "fastify" {
    interface FastifyRequest {
        user?: TokenPayload;
    }
}

export interface TokenPayload {
    userId: number;
    email: string;
    role: "user" | "admin" | "moderator";
    iat?: number;
    exp?: number;
}

export interface User {
    id: number;
    email: string;
    password: string;
    role: "user" | "admin" | "moderator";
    name: string;
}
```

**src/middleware/auth.ts**:
```typescript
import { FastifyRequest, FastifyReply } from "fastify";
import { verifyToken } from "../utils/jwt";

export async function authMiddleware(
    request: FastifyRequest,
    reply: FastifyReply
): Promise<void> {
    console.log("[Auth Middleware] Checking authentication...");
    
    try {
        // Step 1: Get Authorization header
        const authHeader = request.headers.authorization;
        
        if (!authHeader) {
            console.log("[Auth Middleware] No authorization header");
            reply.status(401).send({
                success: false,
                error: "Authorization header required"
            });
            return;
        }
        
        // Step 2: Validate header format
        const parts = authHeader.split(" ");
        
        if (parts.length !== 2 || parts[0] !== "Bearer") {
            console.log("[Auth Middleware] Invalid header format");
            reply.status(401).send({
                success: false,
                error: "Invalid authorization format. Use: Bearer <token>"
            });
            return;
        }
        
        const token = parts[1];
        
        // Step 3: Verify token
        console.log("[Auth Middleware] Verifying token...");
        const payload = verifyToken(token);
        
        // Step 4: Attach user to request
        request.user = payload;
        
        console.log("[Auth Middleware] Authenticated as:", payload.email);
        
    } catch (error: any) {
        console.log("[Auth Middleware] Error:", error.message);
        
        let errorMessage = "Invalid token";
        if (error.message.includes("expired")) {
            errorMessage = "Token has expired";
        } else if (error.message.includes("signature")) {
            errorMessage = "Invalid token signature";
        }
        
        reply.status(401).send({
            success: false,
            error: errorMessage
        });
        return;
    }
}

// Optional auth - doesn't fail if no token, but attaches user if present
export async function optionalAuthMiddleware(
    request: FastifyRequest,
    reply: FastifyReply
): Promise<void> {
    const authHeader = request.headers.authorization;
    
    if (!authHeader) {
        return;  // Continue without user
    }
    
    try {
        const parts = authHeader.split(" ");
        if (parts.length === 2 && parts[0] === "Bearer") {
            const payload = verifyToken(parts[1]);
            request.user = payload;
        }
    } catch {
        // Ignore errors - user just won't be attached
    }
}
```

**src/middleware/roleCheck.ts**:
```typescript
import { FastifyRequest, FastifyReply } from "fastify";

type Role = "user" | "admin" | "moderator";

export function requireRole(...allowedRoles: Role[]) {
    return async function roleCheckMiddleware(
        request: FastifyRequest,
        reply: FastifyReply
    ): Promise<void> {
        console.log("[Role Check] Required roles:", allowedRoles);
        
        // Check if user is authenticated
        if (!request.user) {
            console.log("[Role Check] No user attached to request");
            reply.status(401).send({
                success: false,
                error: "Authentication required"
            });
            return;
        }
        
        const userRole = request.user.role;
        console.log("[Role Check] User role:", userRole);
        
        // Check if user has required role
        if (!allowedRoles.includes(userRole)) {
            console.log("[Role Check] Insufficient permissions");
            reply.status(403).send({
                success: false,
                error: "Insufficient permissions",
                required: allowedRoles,
                current: userRole
            });
            return;
        }
        
        console.log("[Role Check] Access granted");
    };
}

// Convenience functions
export const requireAdmin = requireRole("admin");
export const requireModerator = requireRole("admin", "moderator");
export const requireUser = requireRole("admin", "moderator", "user");
```

**src/routes/publicRoutes.ts**:
```typescript
import { FastifyInstance } from "fastify";
import { createToken } from "../utils/jwt";

// Simulated user database
const users = [
    { id: 1, email: "admin@example.com", password: "admin123", role: "admin" as const, name: "Admin User" },
    { id: 2, email: "mod@example.com", password: "mod123", role: "moderator" as const, name: "Moderator" },
    { id: 3, email: "user@example.com", password: "user123", role: "user" as const, name: "Regular User" }
];

export async function publicRoutes(app: FastifyInstance) {
    // Health check
    app.get("/health", async () => {
        return { status: "ok", timestamp: new Date().toISOString() };
    });
    
    // Login
    app.post<{ Body: { email: string; password: string } }>("/auth/login", async (request, reply) => {
        const { email, password } = request.body;
        
        console.log("[Login] Attempt for:", email);
        
        // Find user
        const user = users.find(u => u.email === email);
        if (!user || user.password !== password) {
            return reply.status(401).send({
                success: false,
                error: "Invalid email or password"
            });
        }
        
        // Create token
        const token = createToken({
            userId: user.id,
            email: user.email,
            role: user.role
        }, 3600);  // 1 hour
        
        return reply.status(200).send({
            success: true,
            data: {
                user: { id: user.id, email: user.email, name: user.name, role: user.role },
                accessToken: token,
                expiresIn: "1h"
            }
        });
    });
    
    console.log("[Routes] Public routes registered");
}
```

**src/routes/protectedRoutes.ts**:
```typescript
import { FastifyInstance } from "fastify";
import { authMiddleware } from "../middleware/auth";
import { requireRole, requireAdmin } from "../middleware/roleCheck";

export async function protectedRoutes(app: FastifyInstance) {
    // Apply auth middleware to all routes in this scope
    app.addHook("preHandler", authMiddleware);
    
    // GET /me - Get current user profile (any authenticated user)
    app.get("/me", async (request, reply) => {
        const user = request.user!;
        
        return reply.status(200).send({
            success: true,
            data: {
                userId: user.userId,
                email: user.email,
                role: user.role
            }
        });
    });
    
    // GET /users - List all users (admin only)
    app.get("/users", {
        preHandler: requireAdmin,
        handler: async (request, reply) => {
            // Simulated user list
            const users = [
                { id: 1, email: "admin@example.com", role: "admin" },
                { id: 2, email: "mod@example.com", role: "moderator" },
                { id: 3, email: "user@example.com", role: "user" }
            ];
            
            return reply.status(200).send({
                success: true,
                data: { users }
            });
        }
    });
    
    // DELETE /users/:id - Delete user (admin only)
    app.delete<{ Params: { id: string } }>("/users/:id", {
        preHandler: requireAdmin,
        handler: async (request, reply) => {
            const { id } = request.params;
            
            console.log(`[Admin] Deleting user ${id}`);
            
            return reply.status(200).send({
                success: true,
                message: `User ${id} deleted (simulated)`
            });
        }
    });
    
    // POST /posts - Create post (admin or moderator)
    app.post("/posts", {
        preHandler: requireRole("admin", "moderator"),
        handler: async (request, reply) => {
            const user = request.user!;
            
            return reply.status(201).send({
                success: true,
                message: `Post created by ${user.email}`
            });
        }
    });
    
    // GET /dashboard - View dashboard (any authenticated user)
    app.get("/dashboard", async (request, reply) => {
        const user = request.user!;
        
        return reply.status(200).send({
            success: true,
            data: {
                welcome: `Welcome, ${user.email}!`,
                role: user.role,
                permissions: getPermissionsForRole(user.role)
            }
        });
    });
    
    console.log("[Routes] Protected routes registered");
}

function getPermissionsForRole(role: string): string[] {
    const permissions: Record<string, string[]> = {
        admin: ["read", "write", "delete", "manage_users"],
        moderator: ["read", "write", "delete"],
        user: ["read", "write"]
    };
    return permissions[role] || [];
}
```

**src/index.ts**:
```typescript
import Fastify from "fastify";
import { publicRoutes } from "./routes/publicRoutes";
import { protectedRoutes } from "./routes/protectedRoutes";

const app = Fastify({ logger: false });
const PORT = 3000;

async function main() {
    console.log("=== Day 17: Auth Middleware ===\n");
    
    // Register routes
    await app.register(publicRoutes);
    await app.register(protectedRoutes, { prefix: "/api" });
    
    await app.listen({ port: PORT });
    console.log(`Server running at http://localhost:${PORT}\n`);
    
    // Test scenarios
    console.log("--- Testing Auth Middleware ---\n");
    
    // 1. Access protected route without token
    console.log("1. GET /api/me (no token)");
    let res = await app.inject({ method: "GET", url: "/api/me" });
    console.log(`   Status: ${res.statusCode}`);
    console.log(`   Response: ${res.body}\n`);
    
    // 2. Login as admin
    console.log("2. POST /auth/login (admin)");
    res = await app.inject({
        method: "POST",
        url: "/auth/login",
        payload: { email: "admin@example.com", password: "admin123" }
    });
    console.log(`   Status: ${res.statusCode}`);
    const adminLogin = JSON.parse(res.body);
    const adminToken = adminLogin.data?.accessToken;
    console.log(`   Token received: ${adminToken ? "Yes" : "No"}\n`);
    
    // 3. Access protected route with admin token
    console.log("3. GET /api/me (with admin token)");
    res = await app.inject({
        method: "GET",
        url: "/api/me",
        headers: { Authorization: `Bearer ${adminToken}` }
    });
    console.log(`   Status: ${res.statusCode}`);
    console.log(`   Response: ${res.body}\n`);
    
    // 4. Admin accessing admin-only route
    console.log("4. GET /api/users (admin accessing admin route)");
    res = await app.inject({
        method: "GET",
        url: "/api/users",
        headers: { Authorization: `Bearer ${adminToken}` }
    });
    console.log(`   Status: ${res.statusCode}`);
    console.log(`   Response: ${res.body}\n`);
    
    // 5. Login as regular user
    console.log("5. POST /auth/login (regular user)");
    res = await app.inject({
        method: "POST",
        url: "/auth/login",
        payload: { email: "user@example.com", password: "user123" }
    });
    const userLogin = JSON.parse(res.body);
    const userToken = userLogin.data?.accessToken;
    console.log(`   Status: ${res.statusCode}\n`);
    
    // 6. Regular user accessing admin-only route
    console.log("6. GET /api/users (user accessing admin route)");
    res = await app.inject({
        method: "GET",
        url: "/api/users",
        headers: { Authorization: `Bearer ${userToken}` }
    });
    console.log(`   Status: ${res.statusCode}`);
    console.log(`   Response: ${res.body}\n`);
    
    // 7. Regular user accessing their dashboard
    console.log("7. GET /api/dashboard (user accessing own dashboard)");
    res = await app.inject({
        method: "GET",
        url: "/api/dashboard",
        headers: { Authorization: `Bearer ${userToken}` }
    });
    console.log(`   Status: ${res.statusCode}`);
    console.log(`   Response: ${res.body}\n`);
    
    // 8. Invalid token
    console.log("8. GET /api/me (invalid token)");
    res = await app.inject({
        method: "GET",
        url: "/api/me",
        headers: { Authorization: "Bearer invalid.token.here" }
    });
    console.log(`   Status: ${res.statusCode}`);
    console.log(`   Response: ${res.body}\n`);
    
    // 9. Wrong authorization format
    console.log("9. GET /api/me (wrong format)");
    res = await app.inject({
        method: "GET",
        url: "/api/me",
        headers: { Authorization: "Basic sometoken" }
    });
    console.log(`   Status: ${res.statusCode}`);
    console.log(`   Response: ${res.body}\n`);
    
    console.log("=== All Tests Completed ===");
    await app.close();
}

main().catch(console.error);
```

---

## ✍️ Exercises

### Exercise 1: Add Logging Middleware
Create a logging middleware that logs:
- Request method and URL
- User email (if authenticated)
- Response time
- Response status code

### Exercise 2: Add Rate Limiting
Create a rate limiting middleware:
- Limit to 10 requests per minute per IP
- Return 429 status when limit exceeded
- Include `X-RateLimit-Remaining` header

### Exercise 3: Add Permission-Based Auth
Extend the role check to support specific permissions:
```typescript
requirePermission("users:delete")
requirePermission("posts:create")
```

---

## ❓ Quiz Questions

### Q1: Middleware Purpose
What is the purpose of middleware in a web application?

**Your Answer**: 


### Q2: Auth Header Format
What is the standard format for the Authorization header with JWT?

**Your Answer**: 


### Q3: 401 vs 403
When should you return 401 vs 403 status code?

**Your Answer**: 


---

## 📝 Bonus Questions (Optional)

### B1: Why should auth middleware run before route handlers?

**Your Answer**: 


### B2: How would you implement "remember me" functionality with JWT?

**Your Answer**: 


---

## ✅ Day 17 Checklist

- [ ] Read Module 8 (Lines 3901-4310)
- [ ] Understand what middleware is
- [ ] Understand auth middleware flow
- [ ] Understand how to extract and verify tokens
- [ ] Understand role-based authorization
- [ ] Understand protected vs public routes
- [ ] Type all code examples
- [ ] Complete Exercise 1 (Logging middleware)
- [ ] Complete Exercise 2 (Rate limiting)
- [ ] Complete Exercise 3 (Permission-based auth)
- [ ] Answer all quiz questions
- [ ] Update Progress.md

---

## 🔗 Next Day Preview
Tomorrow you'll learn about the **Complete Request Flow** - tracing a request from HTTP through all layers and back.
