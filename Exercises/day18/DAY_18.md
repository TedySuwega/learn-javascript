# Day 18: Complete Request Flow

## 📚 What to Learn Today
- **Read**: [LEARNING_MODULE.md](../../Modules/LEARNING_MODULE.md) - Module 9 (Lines 4311-4600)
- **Time**: ~35 minutes reading, ~25 minutes practice
- **Topics**: End-to-end flow, registration/login flow

---

## 📖 Key Concepts

### 1. The Complete Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         CLIENT (Browser/App)                         │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         HTTP REQUEST                                 │
│  POST /api/auth/register                                            │
│  Headers: Content-Type: application/json                            │
│  Body: { "name": "John", "email": "john@example.com", "password": "secret" }
└─────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         MIDDLEWARE LAYER                             │
│  1. Logging Middleware → Log request                                │
│  2. CORS Middleware → Check origin                                  │
│  3. Body Parser → Parse JSON body                                   │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         ROUTER                                       │
│  Match: POST /api/auth/register → AuthController.register           │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         CONTROLLER LAYER                             │
│  1. Extract request data (body, params, query)                      │
│  2. Basic input validation                                          │
│  3. Call service method                                             │
│  4. Format and send response                                        │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         SERVICE LAYER                                │
│  1. Validate business rules                                         │
│  2. Check email uniqueness                                          │
│  3. Hash password                                                   │
│  4. Call repository to save                                         │
│  5. Return result (without password)                                │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         REPOSITORY LAYER                             │
│  1. Build SQL query                                                 │
│  2. Execute query                                                   │
│  3. Return raw data                                                 │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         DATABASE                                     │
│  INSERT INTO users (name, email, password) VALUES (...)             │
└─────────────────────────────────────────────────────────────────────┘
```

### 2. Registration Flow - Step by Step

```
Step 1: Client sends POST /api/auth/register
        Body: { name, email, password }
                    │
                    ▼
Step 2: Controller receives request
        - Extracts body data
        - Checks required fields present
        - Calls authService.register()
                    │
                    ▼
Step 3: Service validates data
        - Name length >= 2
        - Email format valid
        - Password length >= 6
                    │
                    ▼
Step 4: Service checks email uniqueness
        - Calls userRepository.findByEmail()
        - If exists → throw "Email already registered"
                    │
                    ▼
Step 5: Service hashes password
        - bcrypt.hash(password, 10)
                    │
                    ▼
Step 6: Service creates user
        - Calls userRepository.create()
        - Returns user without password
                    │
                    ▼
Step 7: Controller sends response
        - Status: 201 Created
        - Body: { success: true, user: {...} }
```

### 3. Login Flow - Step by Step

```
Step 1: Client sends POST /api/auth/login
        Body: { email, password }
                    │
                    ▼
Step 2: Controller receives request
        - Extracts email and password
        - Calls authService.login()
                    │
                    ▼
Step 3: Service finds user
        - Calls userRepository.findByEmail()
        - If not found → throw "Invalid email or password"
                    │
                    ▼
Step 4: Service verifies password
        - bcrypt.compare(password, user.password)
        - If mismatch → throw "Invalid email or password"
                    │
                    ▼
Step 5: Service generates JWT
        - Creates payload: { userId, email, role }
        - Signs token with secret
                    │
                    ▼
Step 6: Controller sends response
        - Status: 200 OK
        - Body: { success: true, token: "...", user: {...} }
```

### 4. Protected Request Flow

```
Step 1: Client sends GET /api/users
        Headers: Authorization: Bearer <token>
                    │
                    ▼
Step 2: Auth Middleware intercepts
        - Extracts token from header
        - Verifies token signature
        - Checks token not expired
        - Attaches user to request
                    │
                    ▼
Step 3: Role Middleware checks (if needed)
        - Checks user.role against required roles
        - If insufficient → 403 Forbidden
                    │
                    ▼
Step 4: Controller handles request
        - Has access to request.user
        - Calls service method
                    │
                    ▼
Step 5: Service processes
        - May use user info for filtering
        - Calls repository
                    │
                    ▼
Step 6: Response sent
        - Status: 200 OK
        - Body: { success: true, data: [...] }
```

### 5. Error Flow

```
Any Layer Can Throw Error
            │
            ▼
┌─────────────────────────────────────────┐
│  Error Propagates Up                     │
│                                          │
│  Repository throws → Service catches     │
│  Service throws → Controller catches     │
│  Controller formats error response       │
└─────────────────────────────────────────┘
            │
            ▼
┌─────────────────────────────────────────┐
│  Controller Error Handler                │
│                                          │
│  - Maps error to status code             │
│  - Formats error message                 │
│  - Sends error response                  │
└─────────────────────────────────────────┘
            │
            ▼
Client receives: { success: false, error: "..." }
```

### 6. Data Transformation Through Layers

```typescript
// What client sends
{
    name: "John Doe",
    email: "JOHN@EXAMPLE.COM",
    password: "secret123"
}

// After Controller (basic cleanup)
{
    name: "John Doe",
    email: "JOHN@EXAMPLE.COM",
    password: "secret123"
}

// After Service (business transformation)
{
    name: "John Doe",
    email: "john@example.com",  // Normalized to lowercase
    password: "$2b$10$..."      // Hashed
}

// After Repository (database adds fields)
{
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    password: "$2b$10$...",
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
}

// What client receives (service removes sensitive data)
{
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z"
}
```

---

## 💻 Code to Type & Understand

Create this structure in `exercises/day18/`:

```
exercises/day18/
├── src/
│   ├── types/
│   │   └── index.ts
│   ├── database/
│   │   └── fakeDb.ts
│   ├── repositories/
│   │   └── userRepository.ts
│   ├── services/
│   │   └── authService.ts
│   ├── controllers/
│   │   └── authController.ts
│   ├── middleware/
│   │   └── auth.ts
│   ├── routes/
│   │   └── index.ts
│   ├── utils/
│   │   ├── jwt.ts
│   │   └── logger.ts
│   └── index.ts
└── package.json
```

**src/utils/logger.ts**:
```typescript
// Simple logger to trace request flow
export class Logger {
    private static indent = 0;
    
    static startFlow(name: string) {
        console.log("\n" + "=".repeat(60));
        console.log(`FLOW: ${name}`);
        console.log("=".repeat(60));
        this.indent = 0;
    }
    
    static step(layer: string, message: string) {
        const prefix = "  ".repeat(this.indent);
        console.log(`${prefix}[${layer}] ${message}`);
    }
    
    static enter(layer: string) {
        const prefix = "  ".repeat(this.indent);
        console.log(`${prefix}┌─ Entering ${layer}`);
        this.indent++;
    }
    
    static exit(layer: string) {
        this.indent--;
        const prefix = "  ".repeat(this.indent);
        console.log(`${prefix}└─ Exiting ${layer}`);
    }
    
    static data(label: string, data: any) {
        const prefix = "  ".repeat(this.indent);
        const sanitized = this.sanitize(data);
        console.log(`${prefix}   ${label}:`, JSON.stringify(sanitized));
    }
    
    static error(message: string) {
        const prefix = "  ".repeat(this.indent);
        console.log(`${prefix}   ❌ ERROR: ${message}`);
    }
    
    static success(message: string) {
        const prefix = "  ".repeat(this.indent);
        console.log(`${prefix}   ✓ ${message}`);
    }
    
    private static sanitize(data: any): any {
        if (!data) return data;
        if (typeof data !== "object") return data;
        
        const sanitized = { ...data };
        if (sanitized.password) sanitized.password = "***";
        if (sanitized.accessToken) sanitized.accessToken = sanitized.accessToken.substring(0, 20) + "...";
        return sanitized;
    }
}
```

**src/repositories/userRepository.ts**:
```typescript
import { db } from "../database/fakeDb";
import { User, CreateUserDTO } from "../types";
import { Logger } from "../utils/logger";

export interface IUserRepository {
    findByEmail(email: string): Promise<User | null>;
    findById(id: number): Promise<User | null>;
    create(data: CreateUserDTO): Promise<User>;
}

export class UserRepository implements IUserRepository {
    async findByEmail(email: string): Promise<User | null> {
        Logger.enter("Repository");
        Logger.step("Repository", `findByEmail: ${email}`);
        
        const user = db.users.find(u => u.email === email);
        
        if (user) {
            Logger.success(`Found user with ID: ${user.id}`);
        } else {
            Logger.step("Repository", "User not found");
        }
        
        Logger.exit("Repository");
        return user || null;
    }
    
    async findById(id: number): Promise<User | null> {
        Logger.enter("Repository");
        Logger.step("Repository", `findById: ${id}`);
        
        const user = db.users.find(u => u.id === id);
        
        Logger.exit("Repository");
        return user || null;
    }
    
    async create(data: CreateUserDTO): Promise<User> {
        Logger.enter("Repository");
        Logger.step("Repository", "Creating new user");
        Logger.data("Input", data);
        
        const newUser: User = {
            id: db.getNextId(),
            name: data.name,
            email: data.email,
            password: data.password,
            role: "user",
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        
        db.users.push(newUser);
        
        Logger.success(`Created user with ID: ${newUser.id}`);
        Logger.data("Created", newUser);
        Logger.exit("Repository");
        
        return newUser;
    }
}

export const userRepository = new UserRepository();
```

**src/services/authService.ts**:
```typescript
import { IUserRepository } from "../repositories/userRepository";
import { RegisterDTO, LoginDTO, AuthResponse, UserResponse } from "../types";
import { createToken } from "../utils/jwt";
import { Logger } from "../utils/logger";

export class AuthService {
    constructor(private userRepository: IUserRepository) {}
    
    async register(data: RegisterDTO): Promise<AuthResponse> {
        Logger.enter("Service");
        Logger.step("Service", "Processing registration");
        Logger.data("Input", data);
        
        // Step 1: Validate
        Logger.step("Service", "Validating input...");
        this.validateRegistration(data);
        Logger.success("Validation passed");
        
        // Step 2: Check email uniqueness
        Logger.step("Service", "Checking email uniqueness...");
        const existingUser = await this.userRepository.findByEmail(data.email.toLowerCase());
        if (existingUser) {
            Logger.error("Email already registered");
            Logger.exit("Service");
            throw new Error("Email already registered");
        }
        Logger.success("Email is unique");
        
        // Step 3: Hash password
        Logger.step("Service", "Hashing password...");
        const hashedPassword = await this.hashPassword(data.password);
        Logger.success("Password hashed");
        
        // Step 4: Create user
        Logger.step("Service", "Creating user in database...");
        const user = await this.userRepository.create({
            name: data.name.trim(),
            email: data.email.toLowerCase().trim(),
            password: hashedPassword
        });
        
        // Step 5: Generate token
        Logger.step("Service", "Generating JWT token...");
        const token = createToken({
            userId: user.id,
            email: user.email,
            role: user.role
        }, 3600);
        Logger.success("Token generated");
        
        // Step 6: Prepare response
        const response: AuthResponse = {
            user: this.toUserResponse(user),
            accessToken: token,
            expiresIn: "1h"
        };
        
        Logger.data("Response", response);
        Logger.exit("Service");
        
        return response;
    }
    
    async login(data: LoginDTO): Promise<AuthResponse> {
        Logger.enter("Service");
        Logger.step("Service", "Processing login");
        Logger.data("Input", { email: data.email, password: "***" });
        
        // Step 1: Find user
        Logger.step("Service", "Finding user by email...");
        const user = await this.userRepository.findByEmail(data.email.toLowerCase());
        
        if (!user) {
            Logger.error("User not found");
            Logger.exit("Service");
            throw new Error("Invalid email or password");
        }
        Logger.success("User found");
        
        // Step 2: Verify password
        Logger.step("Service", "Verifying password...");
        const isValid = await this.comparePassword(data.password, user.password);
        
        if (!isValid) {
            Logger.error("Password mismatch");
            Logger.exit("Service");
            throw new Error("Invalid email or password");
        }
        Logger.success("Password verified");
        
        // Step 3: Check account status
        Logger.step("Service", "Checking account status...");
        if (!user.isActive) {
            Logger.error("Account is deactivated");
            Logger.exit("Service");
            throw new Error("Account is deactivated");
        }
        Logger.success("Account is active");
        
        // Step 4: Generate token
        Logger.step("Service", "Generating JWT token...");
        const token = createToken({
            userId: user.id,
            email: user.email,
            role: user.role
        }, 3600);
        Logger.success("Token generated");
        
        const response: AuthResponse = {
            user: this.toUserResponse(user),
            accessToken: token,
            expiresIn: "1h"
        };
        
        Logger.data("Response", response);
        Logger.exit("Service");
        
        return response;
    }
    
    private validateRegistration(data: RegisterDTO): void {
        if (!data.name || data.name.trim().length < 2) {
            throw new Error("Name must be at least 2 characters");
        }
        if (!data.email || !data.email.includes("@")) {
            throw new Error("Invalid email format");
        }
        if (!data.password || data.password.length < 6) {
            throw new Error("Password must be at least 6 characters");
        }
    }
    
    private async hashPassword(password: string): Promise<string> {
        // Simulated hash - in real app use bcrypt
        return `$2b$10$HASH_${password.split("").reverse().join("")}`;
    }
    
    private async comparePassword(plain: string, hashed: string): Promise<boolean> {
        // Simulated compare - in real app use bcrypt.compare
        const expectedHash = `$2b$10$HASH_${plain.split("").reverse().join("")}`;
        return hashed === expectedHash;
    }
    
    private toUserResponse(user: any): UserResponse {
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            isActive: user.isActive,
            createdAt: user.createdAt
        };
    }
}
```

**src/controllers/authController.ts**:
```typescript
import { FastifyRequest, FastifyReply } from "fastify";
import { AuthService } from "../services/authService";
import { RegisterDTO, LoginDTO } from "../types";
import { Logger } from "../utils/logger";

export class AuthController {
    constructor(private authService: AuthService) {}
    
    async register(
        request: FastifyRequest<{ Body: RegisterDTO }>,
        reply: FastifyReply
    ) {
        Logger.enter("Controller");
        Logger.step("Controller", "Handling POST /auth/register");
        Logger.data("Request Body", request.body);
        
        try {
            // Basic presence check
            const { name, email, password } = request.body;
            
            if (!name || !email || !password) {
                Logger.error("Missing required fields");
                Logger.exit("Controller");
                return reply.status(400).send({
                    success: false,
                    error: "Name, email, and password are required"
                });
            }
            
            // Call service
            Logger.step("Controller", "Calling AuthService.register()");
            const result = await this.authService.register(request.body);
            
            // Send success response
            Logger.step("Controller", "Sending 201 response");
            Logger.exit("Controller");
            
            return reply.status(201).send({
                success: true,
                data: result,
                message: "Registration successful"
            });
            
        } catch (error: any) {
            Logger.error(error.message);
            Logger.exit("Controller");
            
            const statusCode = this.mapErrorToStatus(error);
            return reply.status(statusCode).send({
                success: false,
                error: error.message
            });
        }
    }
    
    async login(
        request: FastifyRequest<{ Body: LoginDTO }>,
        reply: FastifyReply
    ) {
        Logger.enter("Controller");
        Logger.step("Controller", "Handling POST /auth/login");
        Logger.data("Request Body", { email: request.body.email, password: "***" });
        
        try {
            const { email, password } = request.body;
            
            if (!email || !password) {
                Logger.error("Missing credentials");
                Logger.exit("Controller");
                return reply.status(400).send({
                    success: false,
                    error: "Email and password are required"
                });
            }
            
            Logger.step("Controller", "Calling AuthService.login()");
            const result = await this.authService.login(request.body);
            
            Logger.step("Controller", "Sending 200 response");
            Logger.exit("Controller");
            
            return reply.status(200).send({
                success: true,
                data: result,
                message: "Login successful"
            });
            
        } catch (error: any) {
            Logger.error(error.message);
            Logger.exit("Controller");
            
            const statusCode = error.message.includes("Invalid") ? 401 : 500;
            return reply.status(statusCode).send({
                success: false,
                error: error.message
            });
        }
    }
    
    async getProfile(
        request: FastifyRequest,
        reply: FastifyReply
    ) {
        Logger.enter("Controller");
        Logger.step("Controller", "Handling GET /auth/profile");
        
        const user = request.user;
        Logger.data("Authenticated User", user);
        
        Logger.step("Controller", "Sending 200 response");
        Logger.exit("Controller");
        
        return reply.status(200).send({
            success: true,
            data: { user }
        });
    }
    
    private mapErrorToStatus(error: Error): number {
        const msg = error.message.toLowerCase();
        if (msg.includes("already")) return 400;
        if (msg.includes("invalid") || msg.includes("must be")) return 400;
        return 500;
    }
}
```

**src/index.ts**:
```typescript
import Fastify from "fastify";
import { AuthController } from "./controllers/authController";
import { AuthService } from "./services/authService";
import { userRepository } from "./repositories/userRepository";
import { authMiddleware } from "./middleware/auth";
import { Logger } from "./utils/logger";

const app = Fastify({ logger: false });
const PORT = 3000;

async function main() {
    console.log("=== Day 18: Complete Request Flow ===\n");
    
    // Setup
    const authService = new AuthService(userRepository);
    const authController = new AuthController(authService);
    
    // Routes
    app.post("/auth/register", (req, reply) => authController.register(req, reply));
    app.post("/auth/login", (req, reply) => authController.login(req, reply));
    app.get("/auth/profile", {
        preHandler: authMiddleware,
        handler: (req, reply) => authController.getProfile(req, reply)
    });
    
    await app.listen({ port: PORT });
    console.log(`Server running at http://localhost:${PORT}\n`);
    
    // ========== FLOW 1: Registration ==========
    Logger.startFlow("User Registration");
    
    let res = await app.inject({
        method: "POST",
        url: "/auth/register",
        payload: {
            name: "John Doe",
            email: "john@example.com",
            password: "secret123"
        }
    });
    
    console.log("\n📤 FINAL RESPONSE:");
    console.log(`   Status: ${res.statusCode}`);
    console.log(`   Body: ${res.body}`);
    
    // ========== FLOW 2: Login ==========
    Logger.startFlow("User Login");
    
    res = await app.inject({
        method: "POST",
        url: "/auth/login",
        payload: {
            email: "john@example.com",
            password: "secret123"
        }
    });
    
    console.log("\n📤 FINAL RESPONSE:");
    console.log(`   Status: ${res.statusCode}`);
    const loginResult = JSON.parse(res.body);
    const token = loginResult.data?.accessToken;
    
    // ========== FLOW 3: Protected Route ==========
    Logger.startFlow("Access Protected Route");
    
    res = await app.inject({
        method: "GET",
        url: "/auth/profile",
        headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log("\n📤 FINAL RESPONSE:");
    console.log(`   Status: ${res.statusCode}`);
    console.log(`   Body: ${res.body}`);
    
    // ========== FLOW 4: Error - Duplicate Email ==========
    Logger.startFlow("Registration Error (Duplicate Email)");
    
    res = await app.inject({
        method: "POST",
        url: "/auth/register",
        payload: {
            name: "Jane Doe",
            email: "john@example.com",  // Already exists
            password: "password123"
        }
    });
    
    console.log("\n📤 FINAL RESPONSE:");
    console.log(`   Status: ${res.statusCode}`);
    console.log(`   Body: ${res.body}`);
    
    // ========== FLOW 5: Error - Wrong Password ==========
    Logger.startFlow("Login Error (Wrong Password)");
    
    res = await app.inject({
        method: "POST",
        url: "/auth/login",
        payload: {
            email: "john@example.com",
            password: "wrongpassword"
        }
    });
    
    console.log("\n📤 FINAL RESPONSE:");
    console.log(`   Status: ${res.statusCode}`);
    console.log(`   Body: ${res.body}`);
    
    console.log("\n" + "=".repeat(60));
    console.log("=== All Flows Completed ===");
    console.log("=".repeat(60));
    
    await app.close();
}

main().catch(console.error);
```

---

## ✍️ Exercises

### Exercise 1: Add Request ID Tracking
Add a unique request ID that flows through all layers:
- Generate UUID at the start of each request
- Include in all log messages
- Return in response headers

### Exercise 2: Add Timing Metrics
Track and log timing for each layer:
- Total request time
- Service layer time
- Repository layer time
- Include in response headers

### Exercise 3: Trace a Complex Flow
Create and trace a "Create Post" flow that:
- Requires authentication
- Validates post data
- Checks user permissions
- Creates post in database
- Returns created post

---

## ❓ Quiz Questions

### Q1: Layer Order
In what order do layers process a request?

**Your Answer**: 


### Q2: Error Propagation
How do errors propagate through the layers?

**Your Answer**: 


### Q3: Data Transformation
What data transformations happen in the Service layer?

**Your Answer**: 


---

## 📝 Bonus Questions (Optional)

### B1: Why is it important to trace request flows during development?

**Your Answer**: 


### B2: How would you implement distributed tracing across multiple services?

**Your Answer**: 


---

## ✅ Day 18 Checklist

- [ ] Read Module 9 (Lines 4311-4600)
- [ ] Understand complete request flow
- [ ] Understand registration flow step by step
- [ ] Understand login flow step by step
- [ ] Understand protected route flow
- [ ] Understand error propagation
- [ ] Understand data transformation through layers
- [ ] Type all code examples
- [ ] Complete Exercise 1 (Request ID)
- [ ] Complete Exercise 2 (Timing metrics)
- [ ] Complete Exercise 3 (Complex flow)
- [ ] Answer all quiz questions
- [ ] Update Progress.md

---

## 🔗 Next Day Preview
Tomorrow you'll learn about **Error Handling & Data Transformation** - global error handlers, error types, and secure data transformation.
