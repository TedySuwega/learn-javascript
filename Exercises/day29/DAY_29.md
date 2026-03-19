# Day 29: Controller Layer & Routes (Finance Tracker)

## 📚 What to Learn Today
- **Reference**: [LEARNING_MODULE.md](../../Modules/LEARNING_MODULE.md) - Module 7 (Lines 2922-3648)
- **Topics**: Fastify controllers, route registration, request/reply handling
- **Time**: ~45 minutes reading, ~45 minutes practice
- **Goal**: Complete the REST API for the finance tracker using Fastify

---

## 📖 Key Concepts

### 1. Controller Responsibilities

```
Controller Layer:
├── Parse request data (body, params, query)
├── Call appropriate service methods
├── Format responses
├── Handle HTTP status codes
└── Basic request validation (via Fastify schemas)
```

### 2. RESTful API Design

```
Resource: /api/v1/transactions

GET    /api/v1/transactions      → List all (with filters)
POST   /api/v1/transactions      → Create new
GET    /api/v1/transactions/:id  → Get one
PUT    /api/v1/transactions/:id  → Update
DELETE /api/v1/transactions/:id  → Delete
```

### 3. HTTP Status Codes

```
Success:
200 OK           → Successful GET/PUT
201 Created      → Successful POST
204 No Content   → Successful DELETE

Client Errors:
400 Bad Request  → Invalid input
401 Unauthorized → Not authenticated
403 Forbidden    → Not authorized
404 Not Found    → Resource not found

Server Errors:
500 Internal Server Error
```

### 4. Fastify Request/Reply Types

```typescript
import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'

// Request with typed body
FastifyRequest<{ Body: { email: string; password: string } }>

// Request with typed params
FastifyRequest<{ Params: { id: string } }>

// Request with typed query
FastifyRequest<{ Querystring: { page?: string; limit?: string } }>

// Combined
FastifyRequest<{
    Params: { id: string };
    Body: { name: string };
    Querystring: { filter?: string };
}>
```

---

## 💻 Code to Type & Understand

### Step 1: Auth Controller

Create `src/api/v1/controllers/auth.controller.ts`:

```typescript
// ============================================
// Auth Controller - Authentication Endpoints
// ============================================

import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import { AuthService } from '../services/auth.service.js'
import { UserRepository } from '../repositories/user.repository.js'

// Request type definitions
interface RegisterBody {
    full_name: string
    email: string
    password: string
}

interface LoginBody {
    email: string
    password: string
}

interface UpdateProfileBody {
    full_name?: string
    email?: string
}

interface ChangePasswordBody {
    currentPassword: string
    newPassword: string
}

export async function authController(fastify: FastifyInstance) {
    // Initialize dependencies
    const userRepository = new UserRepository()
    const authService = new AuthService(userRepository)

    /**
     * POST /api/v1/auth/register
     * Register a new user
     */
    fastify.post<{ Body: RegisterBody }>('/api/v1/auth/register', {
        schema: {
            body: {
                type: 'object',
                required: ['full_name', 'email', 'password'],
                properties: {
                    full_name: { type: 'string', minLength: 2 },
                    email: { type: 'string', format: 'email' },
                    password: { type: 'string', minLength: 8 }
                }
            },
            response: {
                201: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean' },
                        data: {
                            type: 'object',
                            properties: {
                                user: { type: 'object' },
                                token: { type: 'string' }
                            }
                        },
                        message: { type: 'string' }
                    }
                }
            }
        }
    }, async (request, reply) => {
        try {
            const result = await authService.register(request.body)

            return reply.status(201).send({
                success: true,
                data: result,
                message: 'Registration successful'
            })
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Registration failed'
            
            if (message.includes('already registered')) {
                return reply.status(409).send({
                    success: false,
                    error: message
                })
            }

            return reply.status(400).send({
                success: false,
                error: message
            })
        }
    })

    /**
     * POST /api/v1/auth/login
     * Login user
     */
    fastify.post<{ Body: LoginBody }>('/api/v1/auth/login', {
        schema: {
            body: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                    email: { type: 'string', format: 'email' },
                    password: { type: 'string' }
                }
            }
        }
    }, async (request, reply) => {
        try {
            const result = await authService.login(request.body)

            return reply.send({
                success: true,
                data: result,
                message: 'Login successful'
            })
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Login failed'

            return reply.status(401).send({
                success: false,
                error: message
            })
        }
    })

    /**
     * GET /api/v1/auth/profile
     * Get current user profile (requires auth)
     */
    fastify.get('/api/v1/auth/profile', {
        preHandler: [fastify.authenticate]
    }, async (request, reply) => {
        try {
            const userId = request.user.userId
            const profile = await authService.getProfile(userId)

            return reply.send({
                success: true,
                data: profile
            })
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to get profile'

            return reply.status(404).send({
                success: false,
                error: message
            })
        }
    })

    /**
     * PUT /api/v1/auth/profile
     * Update user profile (requires auth)
     */
    fastify.put<{ Body: UpdateProfileBody }>('/api/v1/auth/profile', {
        preHandler: [fastify.authenticate],
        schema: {
            body: {
                type: 'object',
                properties: {
                    full_name: { type: 'string', minLength: 2 },
                    email: { type: 'string', format: 'email' }
                }
            }
        }
    }, async (request, reply) => {
        try {
            const userId = request.user.userId
            const profile = await authService.updateProfile(userId, request.body)

            return reply.send({
                success: true,
                data: profile,
                message: 'Profile updated successfully'
            })
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to update profile'

            return reply.status(400).send({
                success: false,
                error: message
            })
        }
    })

    /**
     * POST /api/v1/auth/change-password
     * Change password (requires auth)
     */
    fastify.post<{ Body: ChangePasswordBody }>('/api/v1/auth/change-password', {
        preHandler: [fastify.authenticate],
        schema: {
            body: {
                type: 'object',
                required: ['currentPassword', 'newPassword'],
                properties: {
                    currentPassword: { type: 'string' },
                    newPassword: { type: 'string', minLength: 8 }
                }
            }
        }
    }, async (request, reply) => {
        try {
            const userId = request.user.userId
            const { currentPassword, newPassword } = request.body

            await authService.changePassword(userId, currentPassword, newPassword)

            return reply.send({
                success: true,
                message: 'Password changed successfully'
            })
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to change password'

            return reply.status(400).send({
                success: false,
                error: message
            })
        }
    })
}
```

### Step 2: Transaction Controller

Create `src/api/v1/controllers/transaction.controller.ts`:

```typescript
// ============================================
// Transaction Controller - Transaction Endpoints
// ============================================

import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import { TransactionService } from '../services/transaction.service.js'
import { TransactionRepository } from '../repositories/transaction.repository.js'
import { CategoryRepository } from '../repositories/category.repository.js'
import { CategoryType } from '../../../types/index.js'

// Request type definitions
interface TransactionParams {
    id: string
}

interface TransactionQuery {
    page?: string
    limit?: string
    startDate?: string
    endDate?: string
    type?: CategoryType
    categoryId?: string
}

interface CreateTransactionBody {
    category_id: string
    amount: number
    description?: string
    date: string
    type: CategoryType
}

interface UpdateTransactionBody {
    category_id?: string
    amount?: number
    description?: string
    date?: string
}

export async function transactionController(fastify: FastifyInstance) {
    // Initialize dependencies
    const transactionRepository = new TransactionRepository()
    const categoryRepository = new CategoryRepository()
    const transactionService = new TransactionService(transactionRepository, categoryRepository)

    /**
     * GET /api/v1/transactions
     * Get all transactions for current user
     */
    fastify.get<{ Querystring: TransactionQuery }>('/api/v1/transactions', {
        preHandler: [fastify.authenticate]
    }, async (request, reply) => {
        try {
            const userId = request.user.userId
            const { page, limit, startDate, endDate, type, categoryId } = request.query

            const pageNum = parseInt(page || '1')
            const limitNum = parseInt(limit || '20')
            const offset = (pageNum - 1) * limitNum

            const result = await transactionService.getTransactions(userId, {
                startDate,
                endDate,
                type,
                categoryId,
                limit: limitNum,
                offset
            })

            return reply.send({
                success: true,
                data: result.transactions,
                pagination: {
                    page: result.page,
                    limit: result.limit,
                    total: result.total,
                    totalPages: Math.ceil(result.total / result.limit)
                }
            })
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to get transactions'

            return reply.status(500).send({
                success: false,
                error: message
            })
        }
    })

    /**
     * GET /api/v1/transactions/:id
     * Get single transaction
     */
    fastify.get<{ Params: TransactionParams }>('/api/v1/transactions/:id', {
        preHandler: [fastify.authenticate]
    }, async (request, reply) => {
        try {
            const userId = request.user.userId
            const { id } = request.params

            const transaction = await transactionService.getTransaction(id, userId)

            return reply.send({
                success: true,
                data: transaction
            })
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to get transaction'

            if (message.includes('not found')) {
                return reply.status(404).send({
                    success: false,
                    error: message
                })
            }

            return reply.status(500).send({
                success: false,
                error: message
            })
        }
    })

    /**
     * POST /api/v1/transactions
     * Create new transaction
     */
    fastify.post<{ Body: CreateTransactionBody }>('/api/v1/transactions', {
        preHandler: [fastify.authenticate],
        schema: {
            body: {
                type: 'object',
                required: ['category_id', 'amount', 'date', 'type'],
                properties: {
                    category_id: { type: 'string', format: 'uuid' },
                    amount: { type: 'number', minimum: 0.01 },
                    description: { type: 'string', maxLength: 500 },
                    date: { type: 'string', pattern: '^\\d{4}-\\d{2}-\\d{2}$' },
                    type: { type: 'string', enum: ['income', 'expense'] }
                }
            }
        }
    }, async (request, reply) => {
        try {
            const userId = request.user.userId
            const transaction = await transactionService.createTransaction(userId, request.body)

            return reply.status(201).send({
                success: true,
                data: transaction,
                message: 'Transaction created successfully'
            })
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to create transaction'

            return reply.status(400).send({
                success: false,
                error: message
            })
        }
    })

    /**
     * PUT /api/v1/transactions/:id
     * Update transaction
     */
    fastify.put<{ Params: TransactionParams; Body: UpdateTransactionBody }>('/api/v1/transactions/:id', {
        preHandler: [fastify.authenticate],
        schema: {
            body: {
                type: 'object',
                properties: {
                    category_id: { type: 'string', format: 'uuid' },
                    amount: { type: 'number', minimum: 0.01 },
                    description: { type: 'string', maxLength: 500 },
                    date: { type: 'string', pattern: '^\\d{4}-\\d{2}-\\d{2}$' }
                }
            }
        }
    }, async (request, reply) => {
        try {
            const userId = request.user.userId
            const { id } = request.params

            const transaction = await transactionService.updateTransaction(id, userId, request.body)

            return reply.send({
                success: true,
                data: transaction,
                message: 'Transaction updated successfully'
            })
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to update transaction'

            if (message.includes('not found')) {
                return reply.status(404).send({
                    success: false,
                    error: message
                })
            }

            return reply.status(400).send({
                success: false,
                error: message
            })
        }
    })

    /**
     * DELETE /api/v1/transactions/:id
     * Delete transaction
     */
    fastify.delete<{ Params: TransactionParams }>('/api/v1/transactions/:id', {
        preHandler: [fastify.authenticate]
    }, async (request, reply) => {
        try {
            const userId = request.user.userId
            const { id } = request.params

            await transactionService.deleteTransaction(id, userId)

            return reply.status(204).send()
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to delete transaction'

            if (message.includes('not found')) {
                return reply.status(404).send({
                    success: false,
                    error: message
                })
            }

            return reply.status(500).send({
                success: false,
                error: message
            })
        }
    })
}
```

### Step 3: Category Controller

Create `src/api/v1/controllers/category.controller.ts`:

```typescript
// ============================================
// Category Controller - Category Endpoints
// ============================================

import { FastifyInstance } from 'fastify'
import { CategoryService } from '../services/category.service.js'
import { CategoryRepository } from '../repositories/category.repository.js'
import { CategoryType } from '../../../types/index.js'

// Request type definitions
interface CategoryParams {
    id: string
}

interface CategoryQuery {
    type?: CategoryType
}

interface CreateCategoryBody {
    name: string
    type: CategoryType
    icon?: string
}

interface UpdateCategoryBody {
    name?: string
    icon?: string
}

export async function categoryController(fastify: FastifyInstance) {
    // Initialize dependencies
    const categoryRepository = new CategoryRepository()
    const categoryService = new CategoryService(categoryRepository)

    /**
     * GET /api/v1/categories
     * Get all categories for current user
     */
    fastify.get<{ Querystring: CategoryQuery }>('/api/v1/categories', {
        preHandler: [fastify.authenticate]
    }, async (request, reply) => {
        try {
            const userId = request.user.userId
            const { type } = request.query

            const categories = await categoryService.getCategories(userId, type)

            return reply.send({
                success: true,
                data: categories
            })
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to get categories'

            return reply.status(500).send({
                success: false,
                error: message
            })
        }
    })

    /**
     * POST /api/v1/categories
     * Create custom category
     */
    fastify.post<{ Body: CreateCategoryBody }>('/api/v1/categories', {
        preHandler: [fastify.authenticate],
        schema: {
            body: {
                type: 'object',
                required: ['name', 'type'],
                properties: {
                    name: { type: 'string', minLength: 2, maxLength: 50 },
                    type: { type: 'string', enum: ['income', 'expense'] },
                    icon: { type: 'string', maxLength: 10 }
                }
            }
        }
    }, async (request, reply) => {
        try {
            const userId = request.user.userId
            const category = await categoryService.createCategory(userId, request.body)

            return reply.status(201).send({
                success: true,
                data: category,
                message: 'Category created successfully'
            })
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to create category'

            return reply.status(400).send({
                success: false,
                error: message
            })
        }
    })

    /**
     * PUT /api/v1/categories/:id
     * Update custom category
     */
    fastify.put<{ Params: CategoryParams; Body: UpdateCategoryBody }>('/api/v1/categories/:id', {
        preHandler: [fastify.authenticate],
        schema: {
            body: {
                type: 'object',
                properties: {
                    name: { type: 'string', minLength: 2, maxLength: 50 },
                    icon: { type: 'string', maxLength: 10 }
                }
            }
        }
    }, async (request, reply) => {
        try {
            const userId = request.user.userId
            const { id } = request.params

            const category = await categoryService.updateCategory(id, userId, request.body)

            return reply.send({
                success: true,
                data: category,
                message: 'Category updated successfully'
            })
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to update category'

            if (message.includes('not found') || message.includes('cannot be modified')) {
                return reply.status(404).send({
                    success: false,
                    error: message
                })
            }

            return reply.status(400).send({
                success: false,
                error: message
            })
        }
    })

    /**
     * DELETE /api/v1/categories/:id
     * Delete custom category
     */
    fastify.delete<{ Params: CategoryParams }>('/api/v1/categories/:id', {
        preHandler: [fastify.authenticate]
    }, async (request, reply) => {
        try {
            const userId = request.user.userId
            const { id } = request.params

            await categoryService.deleteCategory(id, userId)

            return reply.status(204).send()
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to delete category'

            if (message.includes('not found') || message.includes('cannot be deleted')) {
                return reply.status(404).send({
                    success: false,
                    error: message
                })
            }

            if (message.includes('transactions')) {
                return reply.status(400).send({
                    success: false,
                    error: message
                })
            }

            return reply.status(500).send({
                success: false,
                error: message
            })
        }
    })
}
```

### Step 4: Report Controller

Create `src/api/v1/controllers/report.controller.ts`:

```typescript
// ============================================
// Report Controller - Report Endpoints
// ============================================

import { FastifyInstance } from 'fastify'
import { ReportService } from '../services/report.service.js'
import { TransactionRepository } from '../repositories/transaction.repository.js'

// Request type definitions
interface ReportQuery {
    startDate?: string
    endDate?: string
    months?: string
}

export async function reportController(fastify: FastifyInstance) {
    // Initialize dependencies
    const transactionRepository = new TransactionRepository()
    const reportService = new ReportService(transactionRepository)

    /**
     * GET /api/v1/reports/dashboard
     * Get dashboard summary
     */
    fastify.get('/api/v1/reports/dashboard', {
        preHandler: [fastify.authenticate]
    }, async (request, reply) => {
        try {
            const userId = request.user.userId
            const summary = await reportService.getDashboardSummary(userId)

            return reply.send({
                success: true,
                data: summary
            })
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to get dashboard'

            return reply.status(500).send({
                success: false,
                error: message
            })
        }
    })

    /**
     * GET /api/v1/reports/monthly
     * Get monthly trends
     */
    fastify.get<{ Querystring: ReportQuery }>('/api/v1/reports/monthly', {
        preHandler: [fastify.authenticate]
    }, async (request, reply) => {
        try {
            const userId = request.user.userId
            const months = parseInt(request.query.months || '12')

            const trends = await reportService.getMonthlyTrends(userId, months)

            return reply.send({
                success: true,
                data: trends
            })
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to get monthly trends'

            return reply.status(500).send({
                success: false,
                error: message
            })
        }
    })

    /**
     * GET /api/v1/reports/categories
     * Get category breakdown
     */
    fastify.get<{ Querystring: ReportQuery }>('/api/v1/reports/categories', {
        preHandler: [fastify.authenticate]
    }, async (request, reply) => {
        try {
            const userId = request.user.userId
            const { startDate, endDate } = request.query

            const breakdown = await reportService.getCategoryBreakdown(userId, startDate, endDate)

            return reply.send({
                success: true,
                data: breakdown
            })
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to get category breakdown'

            return reply.status(500).send({
                success: false,
                error: message
            })
        }
    })

    /**
     * GET /api/v1/reports/summary
     * Get summary for date range
     */
    fastify.get<{ Querystring: ReportQuery }>('/api/v1/reports/summary', {
        preHandler: [fastify.authenticate]
    }, async (request, reply) => {
        try {
            const userId = request.user.userId
            const { startDate, endDate } = request.query

            if (!startDate || !endDate) {
                return reply.status(400).send({
                    success: false,
                    error: 'startDate and endDate are required'
                })
            }

            const summary = await reportService.getSummaryByDateRange(userId, startDate, endDate)

            return reply.send({
                success: true,
                data: summary
            })
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to get summary'

            return reply.status(500).send({
                success: false,
                error: message
            })
        }
    })
}
```

### Step 5: Controller Index

Create `src/api/v1/controllers/index.ts`:

```typescript
// ============================================
// Controller Exports
// ============================================

export { authController } from './auth.controller.js'
export { transactionController } from './transaction.controller.js'
export { categoryController } from './category.controller.js'
export { reportController } from './report.controller.js'
```

### Step 6: Update Entry Point

Update `src/index.ts` to register controllers:

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

// Initialize database
try {
    await sequelize.authenticate()
    console.log('✅ Database connected')
} catch (error) {
    console.error('❌ Database connection failed:', error)
    process.exit(1)
}

// Register auth decorator (will be implemented in Day 30)
app.decorate('authenticate', async (request: any, reply: any) => {
    // Placeholder - will be implemented tomorrow
    request.user = { userId: 'placeholder', email: 'placeholder@example.com' }
})

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

---

## ✍️ Exercises

### Exercise 1: Add Validation Schemas
Create Fastify JSON schemas for all endpoints:
- Add response schemas for consistent API responses
- Add error response schemas
- Test that invalid requests are rejected with proper error messages

### Exercise 2: Add Recent Transactions Endpoint
Add a new endpoint `GET /api/v1/transactions/recent` that:
- Returns the 5 most recent transactions
- Doesn't require pagination
- Includes category information

### Exercise 3: Add Bulk Delete
Add a new endpoint `DELETE /api/v1/transactions/bulk` that:
- Accepts an array of transaction IDs in the body
- Deletes all specified transactions
- Returns count of deleted transactions

---

## ❓ Quiz Questions

### Q1: Fastify Route Registration
Why do we use `fastify.post<{ Body: RegisterBody }>` instead of just `fastify.post`?

**Your Answer**: 


### Q2: HTTP Status Codes
Why do we return 201 for POST (create) but 200 for PUT (update)?

**Your Answer**: 


### Q3: preHandler
What is the purpose of `preHandler: [fastify.authenticate]` in route options?

**Your Answer**: 


---

## 📝 Bonus Questions (Optional)

### B1: Why do we use `reply.status(204).send()` for DELETE instead of returning a success message?

**Your Answer**: 


### B2: How would you implement rate limiting on the login endpoint to prevent brute force attacks?

**Your Answer**: 


---

## ✅ Day 29 Checklist

- [ ] Understand Fastify route registration
- [ ] Create AuthController with all endpoints
- [ ] Create TransactionController with CRUD endpoints
- [ ] Create CategoryController with CRUD endpoints
- [ ] Create ReportController with summary endpoints
- [ ] Understand Fastify request/reply types
- [ ] Implement JSON schema validation
- [ ] Update entry point to register controllers
- [ ] Complete Exercise 1 (Validation Schemas)
- [ ] Complete Exercise 2 (Recent Transactions)
- [ ] Complete Exercise 3 (Bulk Delete)
- [ ] Answer all quiz questions

---

## 🔗 Next Day Preview
Tomorrow you'll implement **Auth Middleware** - creating the Fastify authentication hook that verifies JWT tokens and protects routes.
