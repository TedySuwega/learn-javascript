# Day 5: Entry Point - Server Setup

## 📚 What to Learn Today
- **Read**: [LEARNING_MODULE.md](../../Modules/LEARNING_MODULE.md) - Module 3 (Lines 608-850)
- **Time**: ~35 minutes reading, ~25 minutes practice
- **Topics**: Entry point (index.ts), Fastify basics, CORS, Swagger

---

## 📖 Key Concepts

### 1. What is an Entry Point?
The **entry point** is the first file that runs when you start your application. Usually `src/index.ts`.

```typescript
// src/index.ts - This is where everything begins!
console.log("Application starting...");
```

When you run `npm start`, Node.js looks at package.json to find which file to run.

### 2. What is Fastify?
**Fastify** is a web framework for Node.js - it helps you build APIs quickly.

Think of it like this:
- Without framework: Build a house brick by brick
- With Fastify: Use pre-built walls and just assemble them

```typescript
import Fastify from "fastify";

const app = Fastify();

// Define a route
app.get("/hello", async () => {
    return { message: "Hello World!" };
});

// Start the server
app.listen({ port: 3000 });
```

### 3. HTTP Methods (Routes)

| Method | Purpose | Example |
|--------|---------|---------|
| GET | Read/Fetch data | Get list of users |
| POST | Create new data | Create new user |
| PUT | Update entire resource | Update all user fields |
| PATCH | Update partial resource | Update only email |
| DELETE | Remove data | Delete a user |

```typescript
app.get("/users", handler);      // Get all users
app.get("/users/:id", handler);  // Get user by ID
app.post("/users", handler);     // Create user
app.put("/users/:id", handler);  // Update user
app.delete("/users/:id", handler); // Delete user
```

### 4. What is CORS?
**CORS** = Cross-Origin Resource Sharing

By default, browsers block requests from different domains (security).
CORS allows your API to accept requests from specific domains.

```
Your frontend: http://localhost:5173
Your backend:  http://localhost:3000

Without CORS: Browser blocks the request ❌
With CORS:    Browser allows the request ✅
```

```typescript
import cors from "@fastify/cors";

// Allow all origins (for development)
app.register(cors, {
    origin: true
});

// Or specific origins (for production)
app.register(cors, {
    origin: ["https://myapp.com", "https://admin.myapp.com"]
});
```

### 5. What is Swagger?
**Swagger** is automatic API documentation. It creates a webpage showing all your API endpoints.

```typescript
import swagger from "@fastify/swagger";
import swaggerUI from "@fastify/swagger-ui";

app.register(swagger, {
    swagger: {
        info: {
            title: "My API",
            version: "1.0.0"
        }
    }
});

app.register(swaggerUI, {
    routePrefix: "/docs"  // Access at http://localhost:3000/docs
});
```

### 6. Server Startup Flow

```
1. Import dependencies (fastify, cors, etc.)
        ↓
2. Create Fastify instance
        ↓
3. Register plugins (cors, swagger)
        ↓
4. Connect to database
        ↓
5. Register routes
        ↓
6. Start listening on port
        ↓
7. Server is ready! 🚀
```

---

## 💻 Code to Type & Understand

Create this structure in `exercises/day05/`:

```
exercises/day05/
├── src/
│   ├── routes/
│   │   └── userRoutes.ts
│   └── index.ts
├── package.json
└── tsconfig.json
```

**package.json**:
```json
{
  "name": "day05-server",
  "version": "1.0.0",
  "scripts": {
    "dev": "npx ts-node src/index.ts"
  },
  "dependencies": {
    "fastify": "^4.24.0"
  },
  "devDependencies": {
    "typescript": "^5.2.0",
    "ts-node": "^10.9.0",
    "@types/node": "^20.0.0"
  }
}
```

**src/routes/userRoutes.ts**:
```typescript
import { FastifyInstance } from "fastify";

// Simulated database
interface User {
    id: number;
    name: string;
    email: string;
}

let users: User[] = [
    { id: 1, name: "Alice", email: "alice@example.com" },
    { id: 2, name: "Bob", email: "bob@example.com" }
];
let nextId = 3;

export async function userRoutes(app: FastifyInstance) {
    // GET /users - Get all users
    app.get("/users", async (request, reply) => {
        console.log("GET /users - Fetching all users");
        return users;
    });

    // GET /users/:id - Get user by ID
    app.get<{ Params: { id: string } }>("/users/:id", async (request, reply) => {
        const id = parseInt(request.params.id);
        console.log(`GET /users/${id} - Fetching user`);
        
        const user = users.find(u => u.id === id);
        
        if (!user) {
            reply.status(404);
            return { error: "User not found" };
        }
        
        return user;
    });

    // POST /users - Create new user
    app.post<{ Body: { name: string; email: string } }>("/users", async (request, reply) => {
        const { name, email } = request.body;
        console.log(`POST /users - Creating user: ${name}`);
        
        // Validation
        if (!name || !email) {
            reply.status(400);
            return { error: "Name and email are required" };
        }
        
        const newUser: User = {
            id: nextId++,
            name,
            email
        };
        
        users.push(newUser);
        reply.status(201);
        return newUser;
    });

    // PUT /users/:id - Update user
    app.put<{ Params: { id: string }; Body: { name: string; email: string } }>(
        "/users/:id",
        async (request, reply) => {
            const id = parseInt(request.params.id);
            const { name, email } = request.body;
            console.log(`PUT /users/${id} - Updating user`);
            
            const userIndex = users.findIndex(u => u.id === id);
            
            if (userIndex === -1) {
                reply.status(404);
                return { error: "User not found" };
            }
            
            users[userIndex] = { id, name, email };
            return users[userIndex];
        }
    );

    // DELETE /users/:id - Delete user
    app.delete<{ Params: { id: string } }>("/users/:id", async (request, reply) => {
        const id = parseInt(request.params.id);
        console.log(`DELETE /users/${id} - Deleting user`);
        
        const userIndex = users.findIndex(u => u.id === id);
        
        if (userIndex === -1) {
            reply.status(404);
            return { error: "User not found" };
        }
        
        users.splice(userIndex, 1);
        reply.status(204);
        return;
    });
}
```

**src/index.ts**:
```typescript
// ============================================
// ENTRY POINT - Where the application starts
// ============================================

import Fastify from "fastify";
import { userRoutes } from "./routes/userRoutes";

// Configuration
const PORT = 3000;
const HOST = "0.0.0.0";

// Create Fastify instance with logging
const app = Fastify({
    logger: true  // Enable request logging
});

// Main function to start the server
async function main() {
    try {
        // Step 1: Register plugins (CORS would go here)
        console.log("📦 Registering plugins...");
        
        // Step 2: Register routes
        console.log("🛣️  Registering routes...");
        app.register(userRoutes);
        
        // Step 3: Add a health check route
        app.get("/health", async () => {
            return { status: "ok", timestamp: new Date().toISOString() };
        });
        
        // Step 4: Add root route
        app.get("/", async () => {
            return {
                message: "Welcome to Day 05 API!",
                endpoints: [
                    "GET /health - Health check",
                    "GET /users - Get all users",
                    "GET /users/:id - Get user by ID",
                    "POST /users - Create user",
                    "PUT /users/:id - Update user",
                    "DELETE /users/:id - Delete user"
                ]
            };
        });
        
        // Step 5: Start the server
        console.log("🚀 Starting server...");
        await app.listen({ port: PORT, host: HOST });
        
        console.log(`
╔════════════════════════════════════════════╗
║  🎉 Server is running!                     ║
║  📍 http://localhost:${PORT}                  ║
║  📚 Try: http://localhost:${PORT}/users       ║
╚════════════════════════════════════════════╝
        `);
        
    } catch (error) {
        console.error("❌ Failed to start server:", error);
        process.exit(1);
    }
}

// Run the main function
main();
```

### How to Run (Optional - if you have Node.js installed)

```bash
cd exercises/day05
npm install
npm run dev
```

Then open browser: `http://localhost:3000/users`

---

## ✍️ Exercises

### Exercise 1: Trace the Startup
Looking at the index.ts code, list the steps that happen when the server starts (in order).


### Exercise 2: Add a New Route
Add a new route to userRoutes.ts:
- `GET /users/:id/profile` - Returns user with additional field `profileUrl`
here the detail code, the code already add in userRoutes.ts
// GET /users/:id/Profile - Get user profile
    app.get<{ Params: { id: string } }>("/users/:id/Profile", async (request, reply) => {
      const id = parseInt(request.params.id);
      console.log(`GET /users/${id}/Profile - Fetching user profile`);

      const user = users.find((u) => u.id === id);

      if (!user) {
        reply.status(404);
        return { error: "User not found" };
      }

      return { profile: { name: user.name, email: user.email } };
    });

### Exercise 3: Pseudo-code Server
Write pseudo-code (plain English steps) for starting a server that:
1. Connects to a database
-// Initialize database connection
try {
  await sequelize.authenticate()
  console.log('Database connection has been established successfully.')
} catch (error) {
  console.error('Unable to connect to the database:', error)
  process.exit(1)
}

2. Sets up CORS for `https://myapp.com`
- app.register(cors, {
    origin: ["https://myapp.com", "https://admin.myapp.com"]
});
3. Registers user and product routes
- app.register(userRoutes);
app.register(productRoutes);

4. Starts on port 8080
- // Configuration
const PORT = 8080;
const HOST = "0.0.0.0";

---

## ❓ Quiz Questions

### Q1: Entry Point
What is the entry point of a Node.js application and how is it determined?

**Your Answer**: 
The file where the app boots (creates server, registers routes, starts listening).
the JavaScript file where execution begins or where the app boots (creates server, registers routes, starts listening), typically named index.js or server.js

**✅ Correct!** You correctly identified that the entry point is the first file that runs when starting the application. It's typically `index.ts` or `server.ts`. The entry point is determined by the `"main"` field in `package.json` or the file you pass directly to `node`/`ts-node`.

### Q2: CORS
What is CORS and why is it needed?

**Your Answer**: 
CORS is Cross-Origin Resource Sharing
by default, browsers block requests from different domains (security) so CORS allows your API to accept requests from specific domains.

**✅ Correct!** You explained CORS accurately - it stands for Cross-Origin Resource Sharing and is needed because browsers block cross-origin requests by default for security. CORS headers allow your API to specify which domains are permitted to access it.

### Q3: Swagger
What is Swagger used for?

**Your Answer**: 
Swagger is automatic API documentation. It creates a webpage showing all API endpoints.
so swagger can show all list endpooint that we have and we caninteract that api like using postman, but with more documentation

**✅ Correct!** Great explanation. Swagger generates interactive API documentation where you can see all endpoints, their parameters, and even test them directly in the browser - similar to Postman but with built-in documentation.

---

## 📝 Bonus Questions (Optional)

### B1: What HTTP status code should you return when creating a new resource successfully?

**Your Answer**: 
201 for create or add 

**✅ Correct!** 201 Created is the standard HTTP status code for successful resource creation. Other common codes: 200 OK (success), 204 No Content (success with no body), 400 Bad Request, 404 Not Found.

### B2: What is the difference between `app.get()` and `app.post()`?

**Your Answer**: 
app.get() is for endpoint or route that only fo get the data and no need body request that send to API
app.post() is for endpoint or route that add someting with send the body request that send to API

**✅ Correct!** You correctly differentiated the two: GET is for retrieving data (no request body), POST is for creating new resources (with request body). GET requests are also idempotent (same request = same result), while POST creates new data each time.

---

## 📊 Quiz Results: Day 5

| Question | Result | Notes |
|----------|--------|-------|
| Q1: Entry Point | ✅ Correct | Understood entry point concept and typical naming |
| Q2: CORS | ✅ Correct | Explained purpose and security reason |
| Q3: Swagger | ✅ Correct | Good explanation with Postman comparison |
| B1: HTTP Status Code | ✅ Correct | 201 for resource creation |
| B2: GET vs POST | ✅ Correct | Understood method purposes and body usage |

**Score: 5/5 (100%)**

---

## 📁 Exercise Review

**Exercise Code Location:** `Exercises/day05/exercise/`

### Exercise 1: Trace the Startup
Code typed correctly in `src/index.ts`. The startup flow follows: Import → Create Fastify instance → Register plugins → Register routes → Add health/root routes → Start listening.

### Exercise 2: New Route (GET /users/:id/profile)
- Location: `src/routes/userRoutes.ts` lines 38-51
- Implementation is correct and functional
- Minor suggestion: Use lowercase `/profile` instead of `/Profile` (URL convention)

### Exercise 3: Pseudo-code Server
- Provided actual code snippets instead of plain English pseudo-code
- All 4 requirements addressed correctly (DB connect, CORS setup, route registration, port config)
- Shows good understanding of server setup flow

---

## 💬 Q&A Session Notes

### Q: Can I use the same tsconfig.json from day04 for day05?

**A:** Yes, you can use the same `tsconfig.json` configuration. The day04 config is a good standard TypeScript configuration for Node.js projects with settings like `target: ES2020`, `module: commonjs`, `strict: true`, etc.

---

### Q: Do I need to install Fastify? Is npm install isolated to this folder?

**A:** Fastify was already listed in your `package.json` as a dependency, but you needed to run `npm install` to actually download it. Yes, `npm install` is completely isolated to the folder containing the `package.json` - it creates `node_modules` only in that directory and doesn't affect other projects.

---

### Q: What does "1 high severity vulnerability" mean after npm install?

**A:** npm's security audit found one known security issue in the installed packages. "High severity" means it's a serious issue (e.g., DoS vulnerability). You can run `npm audit` to see details and `npm audit fix --force` to upgrade to a patched version.

---

### Q: Does npm audit fix --force update package.json?

**A:** Yes. Running `npm audit fix --force` updates three things:
1. `node_modules` - installs the fixed version
2. `package.json` - updates the dependency version
3. `package-lock.json` - locks the exact versions

---

### Q: What is the difference between endpoint, routes, and entry point?

**A:** 
- **Endpoint**: A specific URL + HTTP method that your API responds to (e.g., `GET /users`, `POST /users/123`)
- **Routes**: The code that maps endpoints to handlers - defines what function runs for each endpoint
- **Entry point**: The file where the app starts running (e.g., `src/index.ts`) - creates server, registers routes, starts listening

---

### Q: What does `app.listen({ port, host })` do - is it for connecting to a database?

**A:** No, `app.listen()` starts the HTTP server and binds it to the specified port and host to accept incoming HTTP requests. It does NOT connect to a database. Database connection would be separate code using a client like Mongoose, Prisma, or a PostgreSQL driver.

---

### Q: What code shows connecting to a database in Day 5?

**A:** Day 5 does NOT use a real database connection. The exercise uses a "simulated database" - just an in-memory array (`let users: User[] = [...]`). Real database connections (MongoDB, PostgreSQL, etc.) will be covered in later days (Week 2: Database & Repository Layer).

---

## ✅ Day 5 Checklist

- [x] Read Module 3 (Lines 608-850)
- [x] Understand what an entry point is
- [x] Understand Fastify basics
- [x] Understand HTTP methods (GET, POST, PUT, DELETE)
- [x] Understand what CORS does
- [x] Understand what Swagger does
- [x] Type all code examples
- [x] Complete Exercise 1 (Trace startup)
- [x] Complete Exercise 2 (New route)
- [x] Complete Exercise 3 (Pseudo-code)
- [x] Answer all quiz questions
- [x] Update Progress.md

---

## 🎉 Week 1 Complete!

Congratulations! You've finished Week 1. You now understand:
- JavaScript/TypeScript basics
- Project structure and package.json
- Layered architecture
- Server entry point and routing

**Weekend Review**: Go through your quiz answers and make sure you understand any mistakes.

---

## 🔗 Next Day Preview
Next week starts with **Database Connection & Error Handling** - how to connect your server to a real database.
