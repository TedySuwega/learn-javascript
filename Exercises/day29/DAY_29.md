# Day 29: Controller Layer & Routes (Finance Tracker)

## 📚 What to Learn Today
- **Topics**: All API endpoints, route registration
- **Time**: ~45 minutes reading, ~45 minutes practice
- **Goal**: Complete the REST API for the finance tracker

---

## 📖 Key Concepts

### 1. Controller Responsibilities

```
Controller Layer:
├── Parse request data (body, params, query)
├── Call appropriate service methods
├── Format responses
├── Handle HTTP status codes
└── Basic request validation
```

### 2. RESTful API Design

```
Resource: /api/transactions

GET    /api/transactions      → List all (with filters)
POST   /api/transactions      → Create new
GET    /api/transactions/:id  → Get one
PUT    /api/transactions/:id  → Update
DELETE /api/transactions/:id  → Delete
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

### 4. Express Request Types

```typescript
interface Request {
    body: any;           // POST/PUT data
    params: { id: string };  // URL parameters
    query: { page: string }; // Query string
    user?: { userId: number }; // Added by auth middleware
}
```

---

## 💻 Code to Type & Understand

### Step 1: Auth Controller

Create `src/controllers/authController.ts`:

```typescript
// ============================================
// Auth Controller - Authentication Endpoints
// ============================================

import { Request, Response } from 'express';
import { authService } from '../services';
import { ApiResponse, AuthResponse, UserResponse } from '../models/types';

class AuthController {
    /**
     * POST /api/auth/register
     * Register a new user
     */
    async register(req: Request, res: Response): Promise<void> {
        try {
            const { name, email, password } = req.body;

            const result = await authService.register({ name, email, password });

            const response: ApiResponse<AuthResponse> = {
                success: true,
                data: result,
                message: 'Registration successful'
            };

            res.status(201).json(response);
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Registration failed';
            res.status(400).json({
                success: false,
                error: message
            });
        }
    }

    /**
     * POST /api/auth/login
     * Login user
     */
    async login(req: Request, res: Response): Promise<void> {
        try {
            const { email, password } = req.body;

            const result = await authService.login({ email, password });

            const response: ApiResponse<AuthResponse> = {
                success: true,
                data: result,
                message: 'Login successful'
            };

            res.json(response);
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Login failed';
            res.status(401).json({
                success: false,
                error: message
            });
        }
    }

    /**
     * GET /api/auth/profile
     * Get current user profile
     */
    getProfile(req: Request, res: Response): void {
        try {
            const userId = (req as any).user?.userId;

            if (!userId) {
                res.status(401).json({
                    success: false,
                    error: 'Not authenticated'
                });
                return;
            }

            const profile = authService.getProfile(userId);

            if (!profile) {
                res.status(404).json({
                    success: false,
                    error: 'User not found'
                });
                return;
            }

            const response: ApiResponse<UserResponse> = {
                success: true,
                data: profile
            };

            res.json(response);
        } catch (error) {
            res.status(500).json({
                success: false,
                error: 'Failed to get profile'
            });
        }
    }

    /**
     * PUT /api/auth/profile
     * Update user profile
     */
    updateProfile(req: Request, res: Response): void {
        try {
            const userId = (req as any).user?.userId;
            const { name, email } = req.body;

            const profile = authService.updateProfile(userId, { name, email });

            if (!profile) {
                res.status(404).json({
                    success: false,
                    error: 'User not found'
                });
                return;
            }

            const response: ApiResponse<UserResponse> = {
                success: true,
                data: profile,
                message: 'Profile updated successfully'
            };

            res.json(response);
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Update failed';
            res.status(400).json({
                success: false,
                error: message
            });
        }
    }

    /**
     * PUT /api/auth/password
     * Change password
     */
    async changePassword(req: Request, res: Response): Promise<void> {
        try {
            const userId = (req as any).user?.userId;
            const { currentPassword, newPassword } = req.body;

            await authService.changePassword(userId, currentPassword, newPassword);

            res.json({
                success: true,
                message: 'Password changed successfully'
            });
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Password change failed';
            res.status(400).json({
                success: false,
                error: message
            });
        }
    }
}

export default new AuthController();
```

### Step 2: Transaction Controller

Create `src/controllers/transactionController.ts`:

```typescript
// ============================================
// Transaction Controller - Transaction Endpoints
// ============================================

import { Request, Response } from 'express';
import { transactionService } from '../services';
import { ApiResponse, TransactionWithCategory, TransactionFilters } from '../models/types';

class TransactionController {
    /**
     * GET /api/transactions
     * List transactions with filters
     */
    getAll(req: Request, res: Response): void {
        try {
            const userId = (req as any).user?.userId;
            
            // Parse query parameters
            const filters: TransactionFilters = {
                startDate: req.query.startDate as string,
                endDate: req.query.endDate as string,
                type: req.query.type as 'income' | 'expense',
                categoryId: req.query.categoryId ? parseInt(req.query.categoryId as string) : undefined,
                limit: req.query.limit ? parseInt(req.query.limit as string) : 20,
                offset: req.query.offset ? parseInt(req.query.offset as string) : 0
            };

            const result = transactionService.getAll(userId, filters);

            res.json({
                success: true,
                data: result.transactions,
                meta: {
                    total: result.total,
                    page: result.page,
                    pageSize: result.pageSize,
                    totalPages: result.totalPages
                }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: 'Failed to fetch transactions'
            });
        }
    }

    /**
     * GET /api/transactions/:id
     * Get single transaction
     */
    getById(req: Request, res: Response): void {
        try {
            const userId = (req as any).user?.userId;
            const id = parseInt(req.params.id);

            if (isNaN(id)) {
                res.status(400).json({
                    success: false,
                    error: 'Invalid transaction ID'
                });
                return;
            }

            const transaction = transactionService.getById(id, userId);

            if (!transaction) {
                res.status(404).json({
                    success: false,
                    error: 'Transaction not found'
                });
                return;
            }

            const response: ApiResponse<TransactionWithCategory> = {
                success: true,
                data: transaction
            };

            res.json(response);
        } catch (error) {
            res.status(500).json({
                success: false,
                error: 'Failed to fetch transaction'
            });
        }
    }

    /**
     * POST /api/transactions
     * Create new transaction
     */
    create(req: Request, res: Response): void {
        try {
            const userId = (req as any).user?.userId;
            const { category_id, amount, description, date } = req.body;

            const transaction = transactionService.create(userId, {
                category_id,
                amount: parseFloat(amount),
                description,
                date,
                type: 'expense' // Will be overridden by service based on category
            });

            const response: ApiResponse<TransactionWithCategory> = {
                success: true,
                data: transaction,
                message: 'Transaction created successfully'
            };

            res.status(201).json(response);
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to create transaction';
            res.status(400).json({
                success: false,
                error: message
            });
        }
    }

    /**
     * PUT /api/transactions/:id
     * Update transaction
     */
    update(req: Request, res: Response): void {
        try {
            const userId = (req as any).user?.userId;
            const id = parseInt(req.params.id);
            const { category_id, amount, description, date } = req.body;

            if (isNaN(id)) {
                res.status(400).json({
                    success: false,
                    error: 'Invalid transaction ID'
                });
                return;
            }

            const updates: any = {};
            if (category_id !== undefined) updates.category_id = category_id;
            if (amount !== undefined) updates.amount = parseFloat(amount);
            if (description !== undefined) updates.description = description;
            if (date !== undefined) updates.date = date;

            const transaction = transactionService.update(id, userId, updates);

            if (!transaction) {
                res.status(404).json({
                    success: false,
                    error: 'Transaction not found'
                });
                return;
            }

            const response: ApiResponse<TransactionWithCategory> = {
                success: true,
                data: transaction,
                message: 'Transaction updated successfully'
            };

            res.json(response);
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to update transaction';
            res.status(400).json({
                success: false,
                error: message
            });
        }
    }

    /**
     * DELETE /api/transactions/:id
     * Delete transaction
     */
    delete(req: Request, res: Response): void {
        try {
            const userId = (req as any).user?.userId;
            const id = parseInt(req.params.id);

            if (isNaN(id)) {
                res.status(400).json({
                    success: false,
                    error: 'Invalid transaction ID'
                });
                return;
            }

            const deleted = transactionService.delete(id, userId);

            if (!deleted) {
                res.status(404).json({
                    success: false,
                    error: 'Transaction not found'
                });
                return;
            }

            res.json({
                success: true,
                message: 'Transaction deleted successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: 'Failed to delete transaction'
            });
        }
    }

    /**
     * GET /api/transactions/recent
     * Get recent transactions
     */
    getRecent(req: Request, res: Response): void {
        try {
            const userId = (req as any).user?.userId;
            const limit = req.query.limit ? parseInt(req.query.limit as string) : 5;

            const transactions = transactionService.getRecent(userId, limit);

            res.json({
                success: true,
                data: transactions
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: 'Failed to fetch recent transactions'
            });
        }
    }
}

export default new TransactionController();
```

### Step 3: Category Controller

Create `src/controllers/categoryController.ts`:

```typescript
// ============================================
// Category Controller - Category Endpoints
// ============================================

import { Request, Response } from 'express';
import { categoryService } from '../services';
import { ApiResponse, Category } from '../models/types';

class CategoryController {
    /**
     * GET /api/categories
     * List all categories
     */
    getAll(req: Request, res: Response): void {
        try {
            const userId = (req as any).user?.userId;
            const type = req.query.type as 'income' | 'expense' | undefined;

            let categories: Category[];

            if (type) {
                categories = categoryService.getByType(userId, type);
            } else {
                categories = categoryService.getAll(userId);
            }

            res.json({
                success: true,
                data: categories
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: 'Failed to fetch categories'
            });
        }
    }

    /**
     * GET /api/categories/:id
     * Get single category
     */
    getById(req: Request, res: Response): void {
        try {
            const userId = (req as any).user?.userId;
            const id = parseInt(req.params.id);

            if (isNaN(id)) {
                res.status(400).json({
                    success: false,
                    error: 'Invalid category ID'
                });
                return;
            }

            const category = categoryService.getById(id, userId);

            if (!category) {
                res.status(404).json({
                    success: false,
                    error: 'Category not found'
                });
                return;
            }

            const response: ApiResponse<Category> = {
                success: true,
                data: category
            };

            res.json(response);
        } catch (error) {
            res.status(500).json({
                success: false,
                error: 'Failed to fetch category'
            });
        }
    }

    /**
     * POST /api/categories
     * Create custom category
     */
    create(req: Request, res: Response): void {
        try {
            const userId = (req as any).user?.userId;
            const { name, type, icon } = req.body;

            const category = categoryService.create(userId, {
                name,
                type,
                icon: icon || '📁'
            });

            const response: ApiResponse<Category> = {
                success: true,
                data: category,
                message: 'Category created successfully'
            };

            res.status(201).json(response);
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to create category';
            res.status(400).json({
                success: false,
                error: message
            });
        }
    }

    /**
     * PUT /api/categories/:id
     * Update category
     */
    update(req: Request, res: Response): void {
        try {
            const userId = (req as any).user?.userId;
            const id = parseInt(req.params.id);
            const { name, icon } = req.body;

            if (isNaN(id)) {
                res.status(400).json({
                    success: false,
                    error: 'Invalid category ID'
                });
                return;
            }

            const category = categoryService.update(id, userId, { name, icon });

            if (!category) {
                res.status(404).json({
                    success: false,
                    error: 'Category not found or cannot be modified'
                });
                return;
            }

            const response: ApiResponse<Category> = {
                success: true,
                data: category,
                message: 'Category updated successfully'
            };

            res.json(response);
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to update category';
            res.status(400).json({
                success: false,
                error: message
            });
        }
    }

    /**
     * DELETE /api/categories/:id
     * Delete category
     */
    delete(req: Request, res: Response): void {
        try {
            const userId = (req as any).user?.userId;
            const id = parseInt(req.params.id);

            if (isNaN(id)) {
                res.status(400).json({
                    success: false,
                    error: 'Invalid category ID'
                });
                return;
            }

            const deleted = categoryService.delete(id, userId);

            if (!deleted) {
                res.status(404).json({
                    success: false,
                    error: 'Category not found or cannot be deleted'
                });
                return;
            }

            res.json({
                success: true,
                message: 'Category deleted successfully'
            });
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to delete category';
            res.status(400).json({
                success: false,
                error: message
            });
        }
    }
}

export default new CategoryController();
```

### Step 4: Report Controller

Create `src/controllers/reportController.ts`:

```typescript
// ============================================
// Report Controller - Report Endpoints
// ============================================

import { Request, Response } from 'express';
import { reportService } from '../services';

class ReportController {
    /**
     * GET /api/reports/dashboard
     * Get dashboard summary
     */
    getDashboard(req: Request, res: Response): void {
        try {
            const userId = (req as any).user?.userId;

            const summary = reportService.getDashboardSummary(userId);

            res.json({
                success: true,
                data: summary
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: 'Failed to fetch dashboard data'
            });
        }
    }

    /**
     * GET /api/reports/summary
     * Get overall summary
     */
    getSummary(req: Request, res: Response): void {
        try {
            const userId = (req as any).user?.userId;
            const { startDate, endDate } = req.query;

            const summary = reportService.getSummary(
                userId,
                startDate as string,
                endDate as string
            );

            res.json({
                success: true,
                data: summary
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: 'Failed to fetch summary'
            });
        }
    }

    /**
     * GET /api/reports/monthly
     * Get monthly trends
     */
    getMonthlyTrends(req: Request, res: Response): void {
        try {
            const userId = (req as any).user?.userId;
            const months = req.query.months ? parseInt(req.query.months as string) : 12;

            const trends = reportService.getMonthlyTrends(userId, months);

            res.json({
                success: true,
                data: trends
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: 'Failed to fetch monthly trends'
            });
        }
    }

    /**
     * GET /api/reports/categories
     * Get category breakdown
     */
    getCategoryBreakdown(req: Request, res: Response): void {
        try {
            const userId = (req as any).user?.userId;
            const { startDate, endDate } = req.query;

            const breakdown = reportService.getCategoryBreakdown(
                userId,
                startDate as string,
                endDate as string
            );

            res.json({
                success: true,
                data: breakdown
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: 'Failed to fetch category breakdown'
            });
        }
    }

    /**
     * GET /api/reports/spending
     * Get spending by category
     */
    getSpending(req: Request, res: Response): void {
        try {
            const userId = (req as any).user?.userId;
            const { startDate, endDate } = req.query;

            const spending = reportService.getSpendingByCategory(
                userId,
                startDate as string,
                endDate as string
            );

            res.json({
                success: true,
                data: spending
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: 'Failed to fetch spending data'
            });
        }
    }

    /**
     * GET /api/reports/income
     * Get income by category
     */
    getIncome(req: Request, res: Response): void {
        try {
            const userId = (req as any).user?.userId;
            const { startDate, endDate } = req.query;

            const income = reportService.getIncomeByCategory(
                userId,
                startDate as string,
                endDate as string
            );

            res.json({
                success: true,
                data: income
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: 'Failed to fetch income data'
            });
        }
    }
}

export default new ReportController();
```

### Step 5: Route Files

Create `src/routes/authRoutes.ts`:

```typescript
// ============================================
// Auth Routes
// ============================================

import { Router } from 'express';
import authController from '../controllers/authController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// Public routes
router.post('/register', (req, res) => authController.register(req, res));
router.post('/login', (req, res) => authController.login(req, res));

// Protected routes
router.get('/profile', authMiddleware, (req, res) => authController.getProfile(req, res));
router.put('/profile', authMiddleware, (req, res) => authController.updateProfile(req, res));
router.put('/password', authMiddleware, (req, res) => authController.changePassword(req, res));

export default router;
```

Create `src/routes/transactionRoutes.ts`:

```typescript
// ============================================
// Transaction Routes
// ============================================

import { Router } from 'express';
import transactionController from '../controllers/transactionController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(authMiddleware);

router.get('/', (req, res) => transactionController.getAll(req, res));
router.get('/recent', (req, res) => transactionController.getRecent(req, res));
router.get('/:id', (req, res) => transactionController.getById(req, res));
router.post('/', (req, res) => transactionController.create(req, res));
router.put('/:id', (req, res) => transactionController.update(req, res));
router.delete('/:id', (req, res) => transactionController.delete(req, res));

export default router;
```

Create `src/routes/categoryRoutes.ts`:

```typescript
// ============================================
// Category Routes
// ============================================

import { Router } from 'express';
import categoryController from '../controllers/categoryController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(authMiddleware);

router.get('/', (req, res) => categoryController.getAll(req, res));
router.get('/:id', (req, res) => categoryController.getById(req, res));
router.post('/', (req, res) => categoryController.create(req, res));
router.put('/:id', (req, res) => categoryController.update(req, res));
router.delete('/:id', (req, res) => categoryController.delete(req, res));

export default router;
```

Create `src/routes/reportRoutes.ts`:

```typescript
// ============================================
// Report Routes
// ============================================

import { Router } from 'express';
import reportController from '../controllers/reportController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(authMiddleware);

router.get('/dashboard', (req, res) => reportController.getDashboard(req, res));
router.get('/summary', (req, res) => reportController.getSummary(req, res));
router.get('/monthly', (req, res) => reportController.getMonthlyTrends(req, res));
router.get('/categories', (req, res) => reportController.getCategoryBreakdown(req, res));
router.get('/spending', (req, res) => reportController.getSpending(req, res));
router.get('/income', (req, res) => reportController.getIncome(req, res));

export default router;
```

Create `src/routes/index.ts`:

```typescript
// ============================================
// Route Registration
// ============================================

import { Express } from 'express';
import authRoutes from './authRoutes';
import transactionRoutes from './transactionRoutes';
import categoryRoutes from './categoryRoutes';
import reportRoutes from './reportRoutes';

export function registerRoutes(app: Express): void {
    app.use('/api/auth', authRoutes);
    app.use('/api/transactions', transactionRoutes);
    app.use('/api/categories', categoryRoutes);
    app.use('/api/reports', reportRoutes);
}
```

### Step 6: Update Main Index

Update `src/index.ts`:

```typescript
// ============================================
// Finance Tracker API - Entry Point
// ============================================

import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Import database to initialize it
import './config/database';

// Import route registration
import { registerRoutes } from './routes';

// Create Express app
const app: Express = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Request logging
app.use((req: Request, res: Response, next: NextFunction) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Health check
app.get('/health', (req: Request, res: Response) => {
    res.json({
        success: true,
        message: 'Finance Tracker API is running!',
        timestamp: new Date().toISOString()
    });
});

// Register all routes
registerRoutes(app);

// 404 handler
app.use((req: Request, res: Response) => {
    res.status(404).json({
        success: false,
        error: 'Endpoint not found'
    });
});

// Error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error('Error:', err.message);
    res.status(500).json({
        success: false,
        error: 'Internal server error'
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════════╗
║     Finance Tracker API                    ║
║     Running on http://localhost:${PORT}       ║
╚════════════════════════════════════════════╝
    `);
});

export default app;
```

---

## ✍️ Exercises

### Exercise 1: Add Validation Middleware
Create `src/middleware/validate.ts` that:
- Validates request body against a schema
- Returns 400 with detailed errors if validation fails
- Use it for transaction and category creation

### Exercise 2: Add Pagination Helper
Create a helper that:
- Standardizes pagination across all list endpoints
- Includes next/prev page links
- Handles edge cases (page out of range)

### Exercise 3: Add Request Rate Limiting
Implement rate limiting that:
- Limits requests per IP address
- Has different limits for auth vs other endpoints
- Returns 429 Too Many Requests when exceeded

---

## ❓ Quiz Questions

### Q1: HTTP Methods
What's the difference between PUT and PATCH for updating resources?

**Your Answer**: 


### Q2: Status Codes
When should you return 404 vs 400 for a request like `GET /api/transactions/abc`?

**Your Answer**: 


### Q3: Route Order
Why is the order of routes important in Express? (e.g., `/transactions/recent` vs `/transactions/:id`)

**Your Answer**: 


---

## 📝 Bonus Questions (Optional)

### B1: How would you implement API versioning (e.g., /api/v1/transactions)?

**Your Answer**: 


### B2: What is CORS and why do we need the cors middleware?

**Your Answer**: 


---

## ✅ Day 29 Checklist

- [ ] Understand controller responsibilities
- [ ] Create AuthController with all endpoints
- [ ] Create TransactionController with CRUD
- [ ] Create CategoryController with CRUD
- [ ] Create ReportController with reports
- [ ] Set up route files for each resource
- [ ] Register all routes in the app
- [ ] Test all endpoints manually
- [ ] Complete Exercise 1 (Validation)
- [ ] Complete Exercise 2 (Pagination)
- [ ] Complete Exercise 3 (Rate Limiting)
- [ ] Answer all quiz questions

---

## 🔗 Next Day Preview
Tomorrow you'll implement **Auth Middleware & Testing** - protecting routes with JWT and testing the complete API.
