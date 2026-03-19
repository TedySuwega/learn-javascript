# Day 28: Service Layer (Finance Tracker)

## 📚 What to Learn Today
- **Reference**: [LEARNING_MODULE.md](../../Modules/LEARNING_MODULE.md) - Module 6 (Lines 2188-2921)
- **Topics**: AuthService, TransactionService, ReportService
- **Time**: ~45 minutes reading, ~45 minutes practice
- **Goal**: Implement business logic with validation, JWT tokens, and password hashing

---

## 📖 Key Concepts

### 1. Service Layer Responsibilities

```
Service Layer:
├── Business Logic (rules and validations)
├── Input Validation
├── Data Transformation
├── Password Hashing
├── JWT Token Generation
├── Orchestrating Repository Calls
└── Error Handling
```

### 2. Service vs Repository

```
Repository                    Service
├── Database operations       ├── Business rules
├── SQL queries               ├── Validation
├── Data mapping              ├── Multiple repo calls
├── Single entity focus       ├── Complex operations
└── No business logic         └── Security (hashing, JWT)
```

### 3. Authentication Flow

```
Register:
User Data → Validate → Hash Password → Save to DB → Generate Token → Return

Login:
Credentials → Find User → Verify Password → Generate Token → Return

Profile:
Token → Verify Token → Get User → Return (without password)
```

### 4. JWT Token Structure

```
Header.Payload.Signature

Payload contains:
{
    userId: "uuid-here",
    email: "user@example.com",
    iat: 1234567890,  // Issued at
    exp: 1234567890   // Expires at
}
```

---

## 💻 Code to Type & Understand

### Step 1: Auth Service

Create `src/api/v1/services/auth.service.ts`:

```typescript
// ============================================
// Auth Service - Authentication Logic
// ============================================

import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { UserRepository } from '../repositories/user.repository.js'
import {
    User,
    UserCreate,
    UserResponse,
    LoginCredentials,
    AuthResponse,
    JWTPayload
} from '../../../types/index.js'

export class AuthService {
    private userRepository: UserRepository
    private readonly JWT_SECRET: string
    private readonly JWT_EXPIRES_IN: string
    private readonly SALT_ROUNDS = 10

    constructor(userRepository: UserRepository) {
        this.userRepository = userRepository
        this.JWT_SECRET = process.env.JWT_SECRET || 'default-secret-change-me'
        this.JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d'

        if (this.JWT_SECRET === 'default-secret-change-me') {
            console.warn('⚠️ Warning: Using default JWT secret. Set JWT_SECRET in production!')
        }
    }

    /**
     * Register a new user
     */
    async register(userData: UserCreate): Promise<AuthResponse> {
        // Validate input
        this.validateRegistrationInput(userData)

        // Check if email already exists
        const existingUser = await this.userRepository.findByEmail(userData.email)
        if (existingUser) {
            throw new Error('Email already registered')
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(userData.password, this.SALT_ROUNDS)

        // Create user
        const user = await this.userRepository.create({
            ...userData,
            password: hashedPassword
        })

        // Generate token
        const token = this.generateToken(user)

        return {
            user: this.userRepository.toResponse(user),
            token
        }
    }

    /**
     * Login user
     */
    async login(credentials: LoginCredentials): Promise<AuthResponse> {
        // Validate input
        if (!credentials.email || !credentials.password) {
            throw new Error('Email and password are required')
        }

        // Find user
        const user = await this.userRepository.findByEmail(credentials.email)
        if (!user) {
            throw new Error('Invalid email or password')
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(credentials.password, user.password)
        if (!isValidPassword) {
            throw new Error('Invalid email or password')
        }

        // Generate token
        const token = this.generateToken(user)

        return {
            user: this.userRepository.toResponse(user),
            token
        }
    }

    /**
     * Get user profile
     */
    async getProfile(userId: string): Promise<UserResponse> {
        const user = await this.userRepository.findById(userId)
        if (!user) {
            throw new Error('User not found')
        }

        return this.userRepository.toResponse(user)
    }

    /**
     * Update user profile
     */
    async updateProfile(userId: string, updates: { full_name?: string; email?: string }): Promise<UserResponse> {
        // Check if user exists
        const user = await this.userRepository.findById(userId)
        if (!user) {
            throw new Error('User not found')
        }

        // If updating email, check it's not taken
        if (updates.email && updates.email !== user.email) {
            const emailExists = await this.userRepository.emailExists(updates.email, userId)
            if (emailExists) {
                throw new Error('Email already in use')
            }
        }

        // Update user
        const updatedUser = await this.userRepository.update(userId, updates)
        if (!updatedUser) {
            throw new Error('Failed to update profile')
        }

        return this.userRepository.toResponse(updatedUser)
    }

    /**
     * Change password
     */
    async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void> {
        // Validate new password
        if (!newPassword || newPassword.length < 8) {
            throw new Error('New password must be at least 8 characters')
        }

        // Get user
        const user = await this.userRepository.findById(userId)
        if (!user) {
            throw new Error('User not found')
        }

        // Verify current password
        const isValidPassword = await bcrypt.compare(currentPassword, user.password)
        if (!isValidPassword) {
            throw new Error('Current password is incorrect')
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, this.SALT_ROUNDS)

        // Update password
        const success = await this.userRepository.updatePassword(userId, hashedPassword)
        if (!success) {
            throw new Error('Failed to update password')
        }
    }

    /**
     * Verify JWT token
     */
    verifyToken(token: string): JWTPayload {
        try {
            const decoded = jwt.verify(token, this.JWT_SECRET) as JWTPayload
            return decoded
        } catch (error) {
            throw new Error('Invalid or expired token')
        }
    }

    /**
     * Generate JWT token
     */
    private generateToken(user: User): string {
        const payload: JWTPayload = {
            userId: user.id,
            email: user.email
        }

        return jwt.sign(payload, this.JWT_SECRET, {
            expiresIn: this.JWT_EXPIRES_IN
        })
    }

    /**
     * Validate registration input
     */
    private validateRegistrationInput(userData: UserCreate): void {
        if (!userData.email || !userData.password || !userData.full_name) {
            throw new Error('Name, email, and password are required')
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(userData.email)) {
            throw new Error('Invalid email format')
        }

        // Validate password strength
        if (userData.password.length < 8) {
            throw new Error('Password must be at least 8 characters')
        }

        // Validate name
        if (userData.full_name.trim().length < 2) {
            throw new Error('Name must be at least 2 characters')
        }
    }
}
```

### Step 2: Transaction Service

Create `src/api/v1/services/transaction.service.ts`:

```typescript
// ============================================
// Transaction Service - Business Logic
// ============================================

import { TransactionRepository } from '../repositories/transaction.repository.js'
import { CategoryRepository } from '../repositories/category.repository.js'
import {
    TransactionCreate,
    TransactionUpdate,
    TransactionWithCategory,
    TransactionFilters,
    CategoryType
} from '../../../types/index.js'

export class TransactionService {
    private transactionRepository: TransactionRepository
    private categoryRepository: CategoryRepository

    constructor(
        transactionRepository: TransactionRepository,
        categoryRepository: CategoryRepository
    ) {
        this.transactionRepository = transactionRepository
        this.categoryRepository = categoryRepository
    }

    /**
     * Get all transactions for a user
     */
    async getTransactions(userId: string, filters: TransactionFilters = {}): Promise<{
        transactions: TransactionWithCategory[];
        total: number;
        page: number;
        limit: number;
    }> {
        const limit = filters.limit || 20
        const offset = filters.offset || 0
        const page = Math.floor(offset / limit) + 1

        const [transactions, total] = await Promise.all([
            this.transactionRepository.findByUserId(userId, { ...filters, limit, offset }),
            this.transactionRepository.countByUserId(userId, filters)
        ])

        return {
            transactions,
            total,
            page,
            limit
        }
    }

    /**
     * Get single transaction
     */
    async getTransaction(id: string, userId: string): Promise<TransactionWithCategory> {
        const transaction = await this.transactionRepository.findById(id, userId)
        if (!transaction) {
            throw new Error('Transaction not found')
        }
        return transaction
    }

    /**
     * Create a new transaction
     */
    async createTransaction(userId: string, data: Omit<TransactionCreate, 'user_id'>): Promise<TransactionWithCategory> {
        // Validate input
        this.validateTransactionInput(data)

        // Validate category exists and user has access
        const hasAccess = await this.categoryRepository.validateCategoryAccess(data.category_id, userId)
        if (!hasAccess) {
            throw new Error('Invalid category')
        }

        // Get category to verify type matches
        const category = await this.categoryRepository.findById(data.category_id)
        if (category && category.type !== data.type) {
            throw new Error(`Category type mismatch: expected ${category.type}, got ${data.type}`)
        }

        // Create transaction
        return this.transactionRepository.create({
            ...data,
            user_id: userId
        })
    }

    /**
     * Update a transaction
     */
    async updateTransaction(id: string, userId: string, updates: TransactionUpdate): Promise<TransactionWithCategory> {
        // Check transaction exists
        const existing = await this.transactionRepository.findById(id, userId)
        if (!existing) {
            throw new Error('Transaction not found')
        }

        // Validate category if being updated
        if (updates.category_id) {
            const hasAccess = await this.categoryRepository.validateCategoryAccess(updates.category_id, userId)
            if (!hasAccess) {
                throw new Error('Invalid category')
            }
        }

        // Validate amount if being updated
        if (updates.amount !== undefined && updates.amount <= 0) {
            throw new Error('Amount must be greater than 0')
        }

        // Update transaction
        const updated = await this.transactionRepository.update(id, userId, updates)
        if (!updated) {
            throw new Error('Failed to update transaction')
        }

        return updated
    }

    /**
     * Delete a transaction
     */
    async deleteTransaction(id: string, userId: string): Promise<void> {
        const success = await this.transactionRepository.delete(id, userId)
        if (!success) {
            throw new Error('Transaction not found')
        }
    }

    /**
     * Get recent transactions
     */
    async getRecentTransactions(userId: string, limit: number = 5): Promise<TransactionWithCategory[]> {
        return this.transactionRepository.getRecent(userId, limit)
    }

    /**
     * Validate transaction input
     */
    private validateTransactionInput(data: Omit<TransactionCreate, 'user_id'>): void {
        if (!data.category_id) {
            throw new Error('Category is required')
        }

        if (!data.amount || data.amount <= 0) {
            throw new Error('Amount must be greater than 0')
        }

        if (!data.date) {
            throw new Error('Date is required')
        }

        if (!data.type || !['income', 'expense'].includes(data.type)) {
            throw new Error('Type must be income or expense')
        }

        // Validate date format (YYYY-MM-DD)
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/
        if (!dateRegex.test(data.date)) {
            throw new Error('Invalid date format. Use YYYY-MM-DD')
        }
    }
}
```

### Step 3: Report Service

Create `src/api/v1/services/report.service.ts`:

```typescript
// ============================================
// Report Service - Financial Reports
// ============================================

import { TransactionRepository } from '../repositories/transaction.repository.js'
import {
    MonthlySummary,
    CategorySummary
} from '../../../types/index.js'

export class ReportService {
    private transactionRepository: TransactionRepository

    constructor(transactionRepository: TransactionRepository) {
        this.transactionRepository = transactionRepository
    }

    /**
     * Get dashboard summary
     */
    async getDashboardSummary(userId: string): Promise<{
        totalIncome: number;
        totalExpense: number;
        balance: number;
        transactionCount: number;
        monthlyChange: {
            income: number;
            expense: number;
        };
    }> {
        // Get current month dates
        const now = new Date()
        const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1)
            .toISOString().split('T')[0]
        const currentMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0)
            .toISOString().split('T')[0]

        // Get last month dates
        const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1)
            .toISOString().split('T')[0]
        const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0)
            .toISOString().split('T')[0]

        // Get summaries
        const [currentSummary, lastMonthSummary] = await Promise.all([
            this.transactionRepository.getSummary(userId, currentMonthStart, currentMonthEnd),
            this.transactionRepository.getSummary(userId, lastMonthStart, lastMonthEnd)
        ])

        // Calculate monthly change percentage
        const incomeChange = lastMonthSummary.totalIncome > 0
            ? ((currentSummary.totalIncome - lastMonthSummary.totalIncome) / lastMonthSummary.totalIncome) * 100
            : 0

        const expenseChange = lastMonthSummary.totalExpense > 0
            ? ((currentSummary.totalExpense - lastMonthSummary.totalExpense) / lastMonthSummary.totalExpense) * 100
            : 0

        return {
            ...currentSummary,
            monthlyChange: {
                income: Math.round(incomeChange * 100) / 100,
                expense: Math.round(expenseChange * 100) / 100
            }
        }
    }

    /**
     * Get monthly trends
     */
    async getMonthlyTrends(userId: string, months: number = 12): Promise<MonthlySummary[]> {
        return this.transactionRepository.getMonthlySummary(userId, months)
    }

    /**
     * Get category breakdown
     */
    async getCategoryBreakdown(userId: string, startDate?: string, endDate?: string): Promise<{
        income: CategorySummary[];
        expense: CategorySummary[];
    }> {
        const [income, expense] = await Promise.all([
            this.transactionRepository.getCategorySummary(userId, 'income', startDate, endDate),
            this.transactionRepository.getCategorySummary(userId, 'expense', startDate, endDate)
        ])

        return { income, expense }
    }

    /**
     * Get summary for date range
     */
    async getSummaryByDateRange(userId: string, startDate: string, endDate: string): Promise<{
        totalIncome: number;
        totalExpense: number;
        balance: number;
        transactionCount: number;
        averageTransaction: number;
        largestIncome: number;
        largestExpense: number;
    }> {
        const summary = await this.transactionRepository.getSummary(userId, startDate, endDate)

        // Calculate averages
        const averageTransaction = summary.transactionCount > 0
            ? (summary.totalIncome + summary.totalExpense) / summary.transactionCount
            : 0

        return {
            ...summary,
            averageTransaction: Math.round(averageTransaction * 100) / 100,
            largestIncome: 0, // TODO: Implement in repository
            largestExpense: 0 // TODO: Implement in repository
        }
    }
}
```

### Step 4: Category Service

Create `src/api/v1/services/category.service.ts`:

```typescript
// ============================================
// Category Service - Category Management
// ============================================

import { CategoryRepository } from '../repositories/category.repository.js'
import { Category, CategoryCreate, CategoryType } from '../../../types/index.js'

export class CategoryService {
    private categoryRepository: CategoryRepository

    constructor(categoryRepository: CategoryRepository) {
        this.categoryRepository = categoryRepository
    }

    /**
     * Get all categories for a user
     */
    async getCategories(userId: string, type?: CategoryType): Promise<Category[]> {
        if (type) {
            return this.categoryRepository.findByType(userId, type)
        }
        return this.categoryRepository.findByUserId(userId)
    }

    /**
     * Get default categories only
     */
    async getDefaultCategories(): Promise<Category[]> {
        return this.categoryRepository.findDefaults()
    }

    /**
     * Get user's custom categories
     */
    async getCustomCategories(userId: string): Promise<Category[]> {
        return this.categoryRepository.findCustomByUserId(userId)
    }

    /**
     * Create a custom category
     */
    async createCategory(userId: string, data: Omit<CategoryCreate, 'user_id'>): Promise<Category> {
        // Validate input
        if (!data.name || data.name.trim().length < 2) {
            throw new Error('Category name must be at least 2 characters')
        }

        if (!data.type || !['income', 'expense'].includes(data.type)) {
            throw new Error('Category type must be income or expense')
        }

        // Check if name already exists
        const nameExists = await this.categoryRepository.nameExists(data.name, userId)
        if (nameExists) {
            throw new Error('Category name already exists')
        }

        // Create category
        return this.categoryRepository.create({
            ...data,
            user_id: userId
        })
    }

    /**
     * Update a category
     */
    async updateCategory(id: string, userId: string, updates: { name?: string; icon?: string }): Promise<Category> {
        // Validate name if provided
        if (updates.name !== undefined) {
            if (updates.name.trim().length < 2) {
                throw new Error('Category name must be at least 2 characters')
            }

            // Check if name already exists (excluding current category)
            const nameExists = await this.categoryRepository.nameExists(updates.name, userId, id)
            if (nameExists) {
                throw new Error('Category name already exists')
            }
        }

        const updated = await this.categoryRepository.update(id, userId, updates)
        if (!updated) {
            throw new Error('Category not found or cannot be modified')
        }

        return updated
    }

    /**
     * Delete a category
     */
    async deleteCategory(id: string, userId: string): Promise<void> {
        try {
            const success = await this.categoryRepository.delete(id, userId)
            if (!success) {
                throw new Error('Category not found or cannot be deleted')
            }
        } catch (error) {
            if (error instanceof Error && error.message.includes('transactions')) {
                throw new Error('Cannot delete category that has transactions. Delete or reassign transactions first.')
            }
            throw error
        }
    }
}
```

### Step 5: Service Index

Create `src/api/v1/services/index.ts`:

```typescript
// ============================================
// Service Exports
// ============================================

export { AuthService } from './auth.service.js'
export { TransactionService } from './transaction.service.js'
export { ReportService } from './report.service.js'
export { CategoryService } from './category.service.js'
```

---

## ✍️ Exercises

### Exercise 1: Add Email Verification
Add methods to AuthService for email verification:
- `sendVerificationEmail(userId)`: Generate and store verification token
- `verifyEmail(token)`: Verify token and update user's email_verified status

### Exercise 2: Add Transaction Validation
Enhance TransactionService validation:
- Prevent future dates (more than 1 day ahead)
- Add maximum amount limit (configurable)
- Add description length validation (max 500 characters)

### Exercise 3: Add Report Filters
Enhance ReportService with additional filters:
- `getTopCategories(userId, type, limit)`: Get top N categories by total amount
- `getSpendingByDayOfWeek(userId)`: Analyze spending patterns by day

---

## ❓ Quiz Questions

### Q1: Service vs Repository
Why do we put password hashing in the Service layer instead of the Repository layer?

**Your Answer**: 


### Q2: Dependency Injection
Why do we pass `userRepository` to the `AuthService` constructor instead of creating it inside the service?

**Your Answer**: 


### Q3: JWT Expiration
What happens when a JWT token expires? How should the frontend handle this?

**Your Answer**: 


---

## 📝 Bonus Questions (Optional)

### B1: Why do we use `bcrypt.compare()` instead of hashing the input password and comparing strings?

**Your Answer**: 


### B2: How would you implement refresh tokens to extend user sessions without requiring re-login?

**Your Answer**: 


---

## ✅ Day 28 Checklist

- [ ] Understand service layer responsibilities
- [ ] Create AuthService with register, login, profile methods
- [ ] Implement password hashing with bcrypt
- [ ] Implement JWT token generation and verification
- [ ] Create TransactionService with CRUD operations
- [ ] Create ReportService for financial summaries
- [ ] Create CategoryService for category management
- [ ] Understand dependency injection pattern
- [ ] Complete Exercise 1 (Email Verification)
- [ ] Complete Exercise 2 (Transaction Validation)
- [ ] Complete Exercise 3 (Report Filters)
- [ ] Answer all quiz questions

---

## 🔗 Next Day Preview
Tomorrow you'll implement the **Controller Layer** - creating Fastify routes and controllers that use these services to handle HTTP requests.
