# Day 30: Auth Middleware & Testing

## 📚 What to Learn Today
- **Reference**: [LEARNING_MODULE.md](../../Modules/LEARNING_MODULE.md) - Module 8 (Lines 3649-4310)
- **Topics**: Fastify authentication hooks, JWT verification, API testing
- **Time**: ~40 minutes reading, ~45 minutes practice
- **Goal**: Secure routes with JWT authentication and test the complete API

---

## 📖 Key Concepts

### 1. Authentication Middleware Flow

```
Request → Auth Middleware (preHandler) → Controller
              ↓
         Check Header
              ↓
         Extract Token
              ↓
         Verify JWT
              ↓
         Attach User to Request
              ↓
         Next() or 401 Error
```

### 2. JWT Token in Headers

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

Parts:
- "Bearer" - Token type
- Token - The actual JWT
```

### 3. Fastify Decorators

```typescript
// Decorate the Fastify instance with a function
fastify.decorate('authenticate', async (request, reply) => {
    // Verification logic
})

// Use it in routes
fastify.get('/protected', {
    preHandler: [fastify.authenticate]
}, handler)
```

### 4. TypeScript Declaration Merging

```typescript
// Extend Fastify types to include our custom properties
declare module 'fastify' {
    interface FastifyInstance {
        authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>
    }
    interface FastifyRequest {
        user: { userId: string; email: string }
    }
}
```

---

## 💻 Code to Type & Understand

### Step 1: Type Declarations

Create `src/types/fastify.d.ts`:

```typescript
// ============================================
// Fastify Type Extensions
// ============================================

import { FastifyRequest, FastifyReply, FastifyInstance } from 'fastify'

declare module 'fastify' {
    interface FastifyInstance {
        authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>
    }

    interface FastifyRequest {
        user: {
            userId: string
            email: string
        }
    }
}
```

### Step 2: Auth Plugin

Create `src/plugins/auth.plugin.ts`:

```typescript
// ============================================
// Authentication Plugin
// ============================================

import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import fp from 'fastify-plugin'
import jwt from 'jsonwebtoken'
import { JWTPayload } from '../types/index.js'

async function authPlugin(fastify: FastifyInstance) {
    const JWT_SECRET = process.env.JWT_SECRET || 'default-secret-change-me'

    // Decorate fastify with authenticate function
    fastify.decorate('authenticate', async function (
        request: FastifyRequest,
        reply: FastifyReply
    ) {
        try {
            // Get authorization header
            const authHeader = request.headers.authorization

            if (!authHeader) {
                return reply.status(401).send({
                    success: false,
                    error: 'Authorization header is required'
                })
            }

            // Check Bearer format
            if (!authHeader.startsWith('Bearer ')) {
                return reply.status(401).send({
                    success: false,
                    error: 'Invalid authorization format. Use: Bearer <token>'
                })
            }

            // Extract token
            const token = authHeader.substring(7) // Remove 'Bearer '

            if (!token) {
                return reply.status(401).send({
                    success: false,
                    error: 'Token is required'
                })
            }

            // Verify token
            try {
                const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload

                // Attach user to request
                request.user = {
                    userId: decoded.userId,
                    email: decoded.email
                }
            } catch (jwtError) {
                if (jwtError instanceof jwt.TokenExpiredError) {
                    return reply.status(401).send({
                        success: false,
                        error: 'Token has expired'
                    })
                }

                if (jwtError instanceof jwt.JsonWebTokenError) {
                    return reply.status(401).send({
                        success: false,
                        error: 'Invalid token'
                    })
                }

                throw jwtError
            }
        } catch (error) {
            request.log.error(error, 'Authentication error')
            return reply.status(500).send({
                success: false,
                error: 'Authentication failed'
            })
        }
    })
}

// Export as Fastify plugin
export default fp(authPlugin, {
    name: 'auth-plugin'
})
```

### Step 3: Update Entry Point

Update `src/index.ts`:

```typescript
// ============================================
// Finance Tracker API - Entry Point
// ============================================

import Fastify from 'fastify'
import cors from '@fastify/cors'
import swagger from '@fastify/swagger'
import swaggerUi from '@fastify/swagger-ui'
import dotenv from 'dotenv'
import sequelize from './config/database.js'
import authPlugin from './plugins/auth.plugin.js'

// Import controllers
import {
    authController,
    transactionController,
    categoryController,
    reportController
} from './api/v1/controllers/index.js'

dotenv.config()

const app = Fastify({
    logger: true
})

// Register CORS
await app.register(cors, {
    origin: true
})

// Register Swagger
await app.register(swagger, {
    openapi: {
        info: {
            title: 'Finance Tracker API',
            description: 'Personal Finance Tracker REST API',
            version: '1.0.0'
        },
        servers: [
            {
                url: `http://localhost:${process.env.PORT || 3000}`,
                description: 'Development server'
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                }
            }
        }
    }
})

await app.register(swaggerUi, {
    routePrefix: '/documentation'
})

// Register auth plugin (adds fastify.authenticate)
await app.register(authPlugin)

// Initialize database
try {
    await sequelize.authenticate()
    console.log('✅ Database connected')
} catch (error) {
    console.error('❌ Database connection failed:', error)
    process.exit(1)
}

// Register controllers
await app.register(authController)
await app.register(transactionController)
await app.register(categoryController)
await app.register(reportController)

// Health check
app.get('/health', async () => ({
    success: true,
    message: 'Finance Tracker API is running!',
    timestamp: new Date().toISOString()
}))

// API info
app.get('/api', async () => ({
    success: true,
    data: {
        name: 'Finance Tracker API',
        version: '1.0.0',
        documentation: '/documentation'
    }
}))

// Global error handler
app.setErrorHandler((error, request, reply) => {
    request.log.error(error)

    // Handle validation errors
    if (error.validation) {
        return reply.status(400).send({
            success: false,
            error: 'Validation failed',
            details: error.validation
        })
    }

    // Handle other errors
    return reply.status(error.statusCode || 500).send({
        success: false,
        error: error.message || 'Internal server error'
    })
})

// Start server
const PORT = parseInt(process.env.PORT || '3000')
const HOST = process.env.HOST || '0.0.0.0'

try {
    await app.listen({ port: PORT, host: HOST })
    console.log(`
╔════════════════════════════════════════════════╗
║     Finance Tracker API                        ║
║     Running on http://localhost:${PORT}           ║
║     Docs at http://localhost:${PORT}/documentation ║
╚════════════════════════════════════════════════╝
    `)
} catch (err) {
    app.log.error(err)
    process.exit(1)
}

export default app
```

### Step 4: Install fastify-plugin

```bash
npm install fastify-plugin
```

### Step 5: API Testing Guide

Create `API_TESTING.md` in your project root:

```markdown
# API Testing Guide

## Testing Tools
- **Postman** (GUI)
- **Thunder Client** (VS Code extension)
- **curl** (Command line)

## Test Sequence

### 1. Health Check
```bash
curl http://localhost:3000/health
```

### 2. Register User
```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "full_name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

Save the token from the response!

### 3. Login
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### 4. Get Profile (Protected)
```bash
curl http://localhost:3000/api/v1/auth/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 5. Get Categories (Protected)
```bash
curl http://localhost:3000/api/v1/categories \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 6. Create Transaction (Protected)
```bash
curl -X POST http://localhost:3000/api/v1/transactions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "category_id": "CATEGORY_UUID_HERE",
    "amount": 5000,
    "description": "Monthly salary",
    "date": "2024-01-15",
    "type": "income"
  }'
```

### 7. Get Transactions (Protected)
```bash
curl "http://localhost:3000/api/v1/transactions?page=1&limit=10" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 8. Get Dashboard (Protected)
```bash
curl http://localhost:3000/api/v1/reports/dashboard \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Error Testing

### Missing Token
```bash
curl http://localhost:3000/api/v1/auth/profile
# Expected: 401 Unauthorized
```

### Invalid Token
```bash
curl http://localhost:3000/api/v1/auth/profile \
  -H "Authorization: Bearer invalid-token"
# Expected: 401 Invalid token
```

### Invalid Input
```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "invalid-email",
    "password": "123"
  }'
# Expected: 400 Validation error
```
```

### Step 6: Test Script

Create `src/test-api.ts`:

```typescript
// ============================================
// API Test Script
// ============================================

import dotenv from 'dotenv'
dotenv.config()

const BASE_URL = `http://localhost:${process.env.PORT || 3000}`

interface TestResult {
    name: string
    passed: boolean
    message: string
}

const results: TestResult[] = []

async function test(name: string, fn: () => Promise<void>) {
    try {
        await fn()
        results.push({ name, passed: true, message: 'Passed' })
        console.log(`✅ ${name}`)
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error'
        results.push({ name, passed: false, message })
        console.log(`❌ ${name}: ${message}`)
    }
}

async function runTests() {
    console.log('\n🧪 Running API Tests...\n')

    let token = ''
    let userId = ''
    let categoryId = ''
    let transactionId = ''

    // Test 1: Health check
    await test('Health check', async () => {
        const res = await fetch(`${BASE_URL}/health`)
        const data = await res.json()
        if (!data.success) throw new Error('Health check failed')
    })

    // Test 2: Register
    await test('Register user', async () => {
        const res = await fetch(`${BASE_URL}/api/v1/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                full_name: 'Test User',
                email: `test${Date.now()}@example.com`,
                password: 'password123'
            })
        })
        const data = await res.json()
        if (!data.success) throw new Error(data.error)
        token = data.data.token
        userId = data.data.user.id
    })

    // Test 3: Login
    await test('Login user', async () => {
        const res = await fetch(`${BASE_URL}/api/v1/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: `test${Date.now() - 1}@example.com`,
                password: 'password123'
            })
        })
        // This might fail if email doesn't exist, which is expected
    })

    // Test 4: Get profile
    await test('Get profile (authenticated)', async () => {
        const res = await fetch(`${BASE_URL}/api/v1/auth/profile`, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        const data = await res.json()
        if (!data.success) throw new Error(data.error)
    })

    // Test 5: Get profile without token
    await test('Get profile (unauthenticated) - should fail', async () => {
        const res = await fetch(`${BASE_URL}/api/v1/auth/profile`)
        if (res.status !== 401) throw new Error('Expected 401')
    })

    // Test 6: Get categories
    await test('Get categories', async () => {
        const res = await fetch(`${BASE_URL}/api/v1/categories`, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        const data = await res.json()
        if (!data.success) throw new Error(data.error)
        if (data.data.length > 0) {
            categoryId = data.data[0].id
        }
    })

    // Test 7: Create transaction
    await test('Create transaction', async () => {
        if (!categoryId) throw new Error('No category available')
        const res = await fetch(`${BASE_URL}/api/v1/transactions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                category_id: categoryId,
                amount: 1000,
                description: 'Test transaction',
                date: new Date().toISOString().split('T')[0],
                type: 'income'
            })
        })
        const data = await res.json()
        if (!data.success) throw new Error(data.error)
        transactionId = data.data.id
    })

    // Test 8: Get transactions
    await test('Get transactions', async () => {
        const res = await fetch(`${BASE_URL}/api/v1/transactions`, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        const data = await res.json()
        if (!data.success) throw new Error(data.error)
    })

    // Test 9: Get dashboard
    await test('Get dashboard', async () => {
        const res = await fetch(`${BASE_URL}/api/v1/reports/dashboard`, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        const data = await res.json()
        if (!data.success) throw new Error(data.error)
    })

    // Test 10: Delete transaction
    await test('Delete transaction', async () => {
        if (!transactionId) throw new Error('No transaction to delete')
        const res = await fetch(`${BASE_URL}/api/v1/transactions/${transactionId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        })
        if (res.status !== 204) throw new Error('Expected 204')
    })

    // Summary
    console.log('\n📊 Test Summary')
    console.log('================')
    const passed = results.filter(r => r.passed).length
    const failed = results.filter(r => !r.passed).length
    console.log(`Passed: ${passed}`)
    console.log(`Failed: ${failed}`)
    console.log(`Total: ${results.length}`)

    if (failed > 0) {
        console.log('\n❌ Failed Tests:')
        results.filter(r => !r.passed).forEach(r => {
            console.log(`  - ${r.name}: ${r.message}`)
        })
    }
}

runTests().catch(console.error)
```

Add to `package.json`:

```json
{
    "scripts": {
        "test:api": "node --loader ts-node/esm src/test-api.ts"
    }
}
```

---

## ✍️ Exercises

### Exercise 1: Add Token Refresh
Implement a token refresh endpoint:
- `POST /api/v1/auth/refresh` - accepts current token, returns new token
- Only refresh if token is valid but close to expiration (< 1 day left)

### Exercise 2: Add Request Logging Middleware
Create a middleware that logs:
- Request method and path
- Response status code
- Response time in milliseconds
- User ID (if authenticated)

### Exercise 3: Add Rate Limiting
Implement rate limiting for sensitive endpoints:
- Login: max 5 attempts per minute per IP
- Register: max 3 attempts per minute per IP
- Use in-memory store (for learning purposes)

---

## ❓ Quiz Questions

### Q1: preHandler vs onRequest
What's the difference between Fastify's `preHandler` and `onRequest` hooks? When would you use each?

**Your Answer**: 


### Q2: Token Storage
Where should the frontend store the JWT token? What are the security implications of each option?

**Your Answer**: 


### Q3: Error Messages
Why do we return "Invalid email or password" instead of "User not found" or "Wrong password" separately?

**Your Answer**: 


---

## 📝 Bonus Questions (Optional)

### B1: How would you implement logout functionality with JWT tokens?

**Your Answer**: 


### B2: What is a CSRF attack and how does using JWT in Authorization header help prevent it?

**Your Answer**: 


---

## ✅ Day 30 Checklist

- [ ] Understand Fastify authentication hooks
- [ ] Create type declarations for Fastify extensions
- [ ] Implement auth plugin with JWT verification
- [ ] Handle different JWT error types (expired, invalid)
- [ ] Update entry point with auth plugin
- [ ] Create API testing guide
- [ ] Test all endpoints manually
- [ ] Create automated test script
- [ ] Complete Exercise 1 (Token Refresh)
- [ ] Complete Exercise 2 (Request Logging)
- [ ] Complete Exercise 3 (Rate Limiting)
- [ ] Answer all quiz questions

---

## 🔗 Next Day Preview
Tomorrow you'll start building the **React Frontend** - setting up the project with Tailwind CSS, creating the auth context, and building login/register pages.
