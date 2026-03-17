# Day 4: TypeScript Config & Layered Architecture

## 📚 What to Learn Today
- **Read**: [LEARNING_MODULE.md](../../Modules/LEARNING_MODULE.md) - Module 2 (Lines 451-607)
- **Time**: ~35 minutes reading, ~25 minutes practice
- **Topics**: tsconfig.json, Repository-Service-Controller pattern

---

## 📖 Key Concepts

### 1. What is tsconfig.json?
Configuration file that tells TypeScript HOW to compile your code.

```json
{
  "compilerOptions": {
    "target": "ES2020",           // JavaScript version to output
    "module": "commonjs",         // Module system
    "outDir": "./dist",           // Where compiled JS goes
    "rootDir": "./src",           // Where source TS files are
    "strict": true,               // Enable strict type checking
    "esModuleInterop": true       // Better import compatibility
  },
  "include": ["src/**/*"],        // Files to compile
  "exclude": ["node_modules"]     // Files to ignore
}
```

### 2. Key tsconfig Options Explained

| Option | Purpose |
|--------|---------|
| `target` | JavaScript version (ES2020, ES2021, etc.) |
| `outDir` | Folder for compiled JavaScript files |
| `rootDir` | Folder containing TypeScript source |
| `strict` | Enable all strict type checks |
| `include` | Which files to compile |
| `exclude` | Which files to ignore |

### 3. Layered Architecture

Professional applications separate code into **layers**, each with a specific job:

```
┌─────────────────────────────────────────────────────────┐
│                      CLIENT REQUEST                      │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│                    CONTROLLER LAYER                      │
│         Handles HTTP requests & responses                │
│         Validates input, returns JSON                    │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│                     SERVICE LAYER                        │
│              Contains business logic                     │
│         Password hashing, validation rules               │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│                   REPOSITORY LAYER                       │
│            Talks directly to database                    │
│         SQL queries, data access methods                 │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│                       DATABASE                           │
└─────────────────────────────────────────────────────────┘
```

### 4. Why Separate Into Layers?

1. **Separation of Concerns** - Each layer has ONE job
2. **Easier Testing** - Test each layer independently
3. **Maintainability** - Change one layer without affecting others
4. **Reusability** - Services can be used by multiple controllers

### 5. Layer Responsibilities

| Layer | Responsibility | Example |
|-------|---------------|---------|
| **Controller** | Handle HTTP, validate request | Check if email format is valid |
| **Service** | Business logic | Hash password, check if user exists |
| **Repository** | Database operations | INSERT INTO users, SELECT * FROM users |

### 6. Data Flow Example: User Registration

```
1. Controller receives: { email: "john@example.com", password: "123456" }
         ↓
2. Controller validates: Is email format correct? Is password long enough?
         ↓
3. Service processes: Hash the password, prepare user data
         ↓
4. Repository executes: INSERT INTO users (email, password) VALUES (...)
         ↓
5. Repository returns: { id: 1, email: "john@example.com" }
         ↓
6. Service returns: User object (without password)
         ↓
7. Controller responds: HTTP 201 Created with user JSON
```

---

## 💻 Code to Type & Understand

**Day 4 practice:** Type the code below into `Exercises/day04/src/`. From `Exercises/day04/` run `npm install` then `npm run start` (or `npx ts-node src/index.ts`).

Create this structure in `Exercises/day04/`:

```
Exercises/day04/
├── src/
│   ├── repositories/
│   │   └── userRepository.ts
│   ├── services/
│   │   └── userService.ts
│   ├── controllers/
│   │   └── userController.ts
│   ├── types/
│   │   └── user.ts
│   └── index.ts
├── package.json
├── tsconfig.json
└── node_modules/          (after npm install)
```

**package.json**:
```json
{
  "name": "day04-exercises",
  "version": "1.0.0",
  "description": "Learning layered architecture for Day 4 exercises",
  "main": "src/index.ts",
  "scripts": {
    "start": "ts-node src/index.ts",
    "build": "tsc",
    "test": "echo \"No tests yet\""
  },
  "keywords": ["learning", "typescript"],
  "author": "Your Name",
  "license": "MIT",
  "dependencies": {},
  "devDependencies": {
    "typescript": "^5.3.0",
    "ts-node": "^10.9.0",
    "@types/node": "^20.0.0"
  }
}
```

Then run `npm install` in `Exercises/day04/` so you can use `npm run start`.

**tsconfig.json**:
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

**src/types/user.ts**:
```typescript
export interface User {
    id: number;
    email: string;
    password: string;
    createdAt: Date;
}

export interface CreateUserDTO {
    email: string;
    password: string;
}

export interface UserResponse {
    id: number;
    email: string;
    createdAt: Date;
    // Note: password is NOT included in response!
}
```

**src/repositories/userRepository.ts**:
```typescript
// REPOSITORY LAYER - Talks to database
import { User, CreateUserDTO } from "../types/user";

// Simulated database
let users: User[] = [];
let nextId = 1;

export const userRepository = {
    // Create a new user in database
    create(data: CreateUserDTO): User {
        const newUser: User = {
            id: nextId++,
            email: data.email,
            password: data.password,  // Already hashed by service
            createdAt: new Date()
        };
        users.push(newUser);
        console.log("[Repository] User saved to database");
        return newUser;
    },

    // Find user by email
    findByEmail(email: string): User | undefined {
        console.log("[Repository] Searching for email:", email);
        return users.find(user => user.email === email);
    },

    // Find user by ID
    findById(id: number): User | undefined {
        console.log("[Repository] Searching for ID:", id);
        return users.find(user => user.id === id);
    },

    // Get all users
    findAll(): User[] {
        console.log("[Repository] Getting all users");
        return users;
    }
};
```

**src/services/userService.ts**:
```typescript
// SERVICE LAYER - Business logic
import { userRepository } from "../repositories/userRepository";
import { CreateUserDTO, UserResponse } from "../types/user";

// Simple hash simulation (real apps use bcrypt)
function hashPassword(password: string): string {
    return `hashed_${password}_hashed`;
}

export const userService = {
    // Register a new user
    register(data: CreateUserDTO): UserResponse {
        console.log("[Service] Processing registration");

        // Business logic: Check if email already exists
        const existingUser = userRepository.findByEmail(data.email);
        if (existingUser) {
            throw new Error("Email already registered");
        }

        // Business logic: Hash the password
        const hashedPassword = hashPassword(data.password);

        // Call repository to save
        const user = userRepository.create({
            email: data.email,
            password: hashedPassword
        });

        // Return user WITHOUT password
        return {
            id: user.id,
            email: user.email,
            createdAt: user.createdAt
        };
    },

    // Get user by ID
    getById(id: number): UserResponse | null {
        console.log("[Service] Getting user by ID");
        const user = userRepository.findById(id);
        
        if (!user) {
            return null;
        }

        // Return without password
        return {
            id: user.id,
            email: user.email,
            createdAt: user.createdAt
        };
    },

    // Get all users
    getAll(): UserResponse[] {
        console.log("[Service] Getting all users");
        const users = userRepository.findAll();
        
        // Remove passwords from all users
        return users.map(user => ({
            id: user.id,
            email: user.email,
            createdAt: user.createdAt
        }));
    }
};
```

**src/controllers/userController.ts**:
```typescript
// CONTROLLER LAYER - Handles HTTP requests
import { userService } from "../services/userService";
import { CreateUserDTO } from "../types/user";

// Simulated HTTP request/response
interface Request {
    body: any;
    params: { id?: string };
}

interface Response {
    status: number;
    data: any;
}

export const userController = {
    // POST /users - Create user
    register(req: Request): Response {
        console.log("[Controller] Received registration request");
        
        const { email, password } = req.body as CreateUserDTO;

        // Validation
        if (!email || !email.includes("@")) {
            return { status: 400, data: { error: "Invalid email" } };
        }
        if (!password || password.length < 6) {
            return { status: 400, data: { error: "Password must be at least 6 characters" } };
        }

        try {
            const user = userService.register({ email, password });
            return { status: 201, data: user };
        } catch (error: any) {
            return { status: 400, data: { error: error.message } };
        }
    },

    // GET /users/:id - Get user by ID
    getById(req: Request): Response {
        console.log("[Controller] Received get user request");
        
        const id = parseInt(req.params.id || "0");
        
        if (!id) {
            return { status: 400, data: { error: "Invalid ID" } };
        }

        const user = userService.getById(id);
        
        if (!user) {
            return { status: 404, data: { error: "User not found" } };
        }

        return { status: 200, data: user };
    },

    // GET /users - Get all users
    getAll(): Response {
        console.log("[Controller] Received get all users request");
        const users = userService.getAll();
        return { status: 200, data: users };
    }
};
```

**src/index.ts**:
```typescript
// Entry point - Simulate HTTP requests
import { userController } from "./controllers/userController";

console.log("=== Testing Layered Architecture ===\n");

// Test 1: Register a user
console.log("--- Test 1: Register User ---");
const registerResult = userController.register({
    body: { email: "john@example.com", password: "password123" },
    params: {}
});
console.log("Response:", registerResult);

// Test 2: Try to register same email
console.log("\n--- Test 2: Duplicate Email ---");
const duplicateResult = userController.register({
    body: { email: "john@example.com", password: "another123" },
    params: {}
});
console.log("Response:", duplicateResult);

// Test 3: Invalid email
console.log("\n--- Test 3: Invalid Email ---");
const invalidResult = userController.register({
    body: { email: "invalid-email", password: "password123" },
    params: {}
});
console.log("Response:", invalidResult);

// Test 4: Get user by ID
console.log("\n--- Test 4: Get User by ID ---");
const getUserResult = userController.getById({
    body: {},
    params: { id: "1" }
});
console.log("Response:", getUserResult);

// Test 5: Get all users
console.log("\n--- Test 5: Get All Users ---");
const getAllResult = userController.getAll();
console.log("Response:", getAllResult);
```

---

## ✍️ Exercises

**Locations:** Day 4 **practice** is in `Exercises/day04/practice`; **exercise** (Product layer) is in `Exercises/day04/exercise`. You ran and tested both; all good.

### Exercise 1: Trace the Flow
For a "Get User by ID" request, write down:
1. What does the Controller do? 
-  the controller do handle HTTP request recieve request in that code example body: {},
  params: { id: "1" },
2. What does the Service do? 
- const user = userService.getById(id); in controller mean that call userservice method getById, that do call const user = userRepository.findById(id); userRepository method findById to find user by ID
3. What does the Repository do?
- userRepository.findById(id); userRepository method findById to  find user by ID
  findById(id: number): User | undefined {
    console.log("[Repository] Searching for ID:", id);
    return users.find((user) => user.id === id);
  },

### Exercise 2: Add Product Layer
Create a complete layered structure for Products:
- `types/product.ts` - Product interface
- `repositories/productRepository.ts` - CRUD operations
- `services/productService.ts` - Business logic
- `controllers/productController.ts` - HTTP handling

### Exercise 3: Draw the Diagram
On paper or digitally, draw a diagram showing:
- The 3 layers
```
┌─────────────────────────────────────────────────────────┐
│                      CLIENT REQUEST                      │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│                    CONTROLLER LAYER                      │
│         Handles HTTP requests & responses                │
│         Validates input, returns JSON                    │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│                     SERVICE LAYER                        │
│              Contains business logic                     │
│         Password hashing, validation rules               │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│                   REPOSITORY LAYER                       │
│            Talks directly to database                    │
│         SQL queries, data access methods                 │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│                       DATABASE                           │
└─────────────────────────────────────────────────────────┘
```

- What data flows between them 
1. Controller receives: { email: "john@example.com", password: "123456" }
         ↓
2. Controller validates: Is email format correct? Is password long enough?
         ↓
3. Service processes: Hash the password, prepare user data
         ↓
4. Repository executes: INSERT INTO users (email, password) VALUES (...)
         ↓
5. Repository returns: { id: 1, email: "john@example.com" }
         ↓
6. Service returns: User object (without password)
         ↓
7. Controller responds: HTTP 201 Created with user JSON

- For a "Create User" request
idk this question mean flow for create user? if yes the answer is in previous question exactly above this question

**Exercise review:** Yes — the "Create User" flow is the same as the 7-step flow you wrote above.

---

## ❓ Quiz Questions

### Q1: Layer Responsibilities
What is the purpose of each layer (Repository, Service, Controller)?

**Your Answer**: 
Controller	for Handle HTTP, validate request example Check if email format is valid
Service	for Business logic	example Hash password, check if user exists
Repository	for Database operations	example INSERT INTO users, SELECT * FROM users

**✅ Correct!** Controller: HTTP + validation; Service: business logic; Repository: database access.

### Q2: Why Separate?
Why do we separate code into layers instead of putting everything in one file?

**Your Answer**: 
Separation of Concerns - Each layer has ONE job
Easier Testing - Test each layer independently
Maintainability - Change one layer without affecting others
Reusability - Services can be used by multiple controllers

**✅ Correct!** All four reasons: separation of concerns, testing, maintainability, reusability.

### Q3: Database Layer
Which layer talks directly to the database?

**Your Answer**: 
Repository Layer

**✅ Correct!** Repository is the only layer that runs SQL/queries the database.

---

## 📝 Bonus Questions (Optional)

### B1: Where should password hashing happen - Controller, Service, or Repository? Why?

**Your Answer**: 
in Service since service caontain business logic and hashing password is in business logic 

**✅ Correct!** Hashing is business/security logic, so it belongs in the Service layer.

### B2: If you need to change from PostgreSQL to MongoDB, which layer(s) would you modify?

**Your Answer**: 
Repositroy since that handle database operation

**✅ Correct!** Only the Repository layer talks to the database; swapping DB = change only Repository.

---

## 📊 Quiz Results: Day 4

| Question | Result | Notes |
|----------|--------|-------|
| Q1: Layer responsibilities | ✅ Correct | Controller, Service, Repository roles |
| Q2: Why separate | ✅ Correct | Separation, testing, maintainability, reusability |
| Q3: Database layer | ✅ Correct | Repository |
| B1: Password hashing | ✅ Correct | Service (business logic) |
| B2: Change DB | ✅ Correct | Repository only |

**Score: 5/5 (100%)**

---

## Layered Architecture – Quick Recap

- **Controller:** Receives HTTP request (body, params), validates input, calls Service, returns HTTP response (status + JSON). Does not call Repository or DB.
- **Service:** Holds business rules (e.g. hash password, "user already exists"), calls Repository for data, returns data to Controller. Does not know about HTTP status codes or request/response shape.
- **Repository:** Only layer that talks to the database (SQL or ORM). No business logic; only CRUD and queries.
- **Data flow:** Request to Controller to Service to Repository to DB; then back: DB to Repository to Service to Controller to Response.
- **Why it helps:** Change DB = change only Repository; change validation = Controller or Service; test each layer with mocks.

---

## ✅ Day 4 Checklist

- [x] Read Module 2 (Lines 451-607)
- [x] Understand tsconfig.json options
- [x] Understand the 3-layer architecture
- [x] Understand data flow between layers
- [x] Create the complete layered example
- [x] Run and observe the console logs
- [x] Complete Exercise 1 (Trace flow)
- [x] Complete Exercise 2 (Product layer)
- [x] Complete Exercise 3 (Draw diagram)
- [x] Answer all quiz questions
- [x] Update Progress.md

---

## 🔗 Next Day Preview
Tomorrow you'll learn about the **Entry Point** - how a server starts up, what Fastify is, and how CORS and Swagger work.
