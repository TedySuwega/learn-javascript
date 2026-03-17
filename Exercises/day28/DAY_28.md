# Day 28: Service Layer (Finance Tracker)

## 📚 What to Learn Today
- **Topics**: AuthService, TransactionService, ReportService
- **Time**: ~45 minutes reading, ~45 minutes practice
- **Goal**: Implement business logic with validation and monthly reports

---

## 📖 Key Concepts

### 1. Service Layer Responsibilities

```
Service Layer:
├── Business Logic
├── Input Validation
├── Data Transformation
├── Error Handling
├── Orchestrating Repository Calls
└── Cross-cutting Concerns (logging, etc.)
```

### 2. Service vs Repository

```
Repository                    Service
├── Database operations       ├── Business rules
├── SQL queries               ├── Validation
├── Data mapping              ├── Multiple repo calls
└── Single entity focus       └── Complex operations
```

### 3. Authentication Flow

```
Register:
User Data → Validate → Hash Password → Save → Generate Token → Return

Login:
Credentials → Find User → Verify Password → Generate Token → Return
```

### 4. JWT Token Structure

```
Header.Payload.Signature

Payload contains:
{
    userId: 123,
    email: "user@example.com",
    iat: 1234567890,  // Issued at
    exp: 1234567890   // Expires at
}
```

---

## 💻 Code to Type & Understand

### Step 1: Auth Service

Create `src/services/authService.ts`:

```typescript
// ============================================
// Auth Service - Authentication Logic
// ============================================

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { userRepository } from '../repositories';
import {
    User,
    UserCreate,
    UserResponse,
    LoginCredentials,
    AuthResponse,
    JWTPayload
} from '../models/types';

class AuthService {
    private readonly JWT_SECRET: string;
    private readonly JWT_EXPIRES_IN: string;
    private readonly SALT_ROUNDS = 10;

    constructor() {
        this.JWT_SECRET = process.env.JWT_SECRET || 'default-secret-change-me';
        this.JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

        if (this.JWT_SECRET === 'default-secret-change-me') {
            console.warn('⚠️ Warning: Using default JWT secret. Set JWT_SECRET in production!');
        }
    }

    /**
     * Register a new user
     */
    async register(userData: UserCreate): Promise<AuthResponse> {
        // Validate input
        this.validateRegistration(userData);

        // Check if email already exists
        if (userRepository.emailExists(userData.email)) {
            throw new Error('Email already registered');
        }

        // Hash password
        const passwordHash = await bcrypt.hash(userData.password, this.SALT_ROUNDS);

        // Create user
        const user = userRepository.create({
            ...userData,
            password_hash: passwordHash
        });

        // Generate token
        const token = this.generateToken(user);

        return {
            user: userRepository.toResponse(user),
            token
        };
    }

    /**
     * Login user
     */
    async login(credentials: LoginCredentials): Promise<AuthResponse> {
        // Validate input
        if (!credentials.email || !credentials.password) {
            throw new Error('Email and password are required');
        }

        // Find user
        const user = userRepository.findByEmail(credentials.email);
        if (!user) {
            throw new Error('Invalid email or password');
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(
            credentials.password,
            user.password_hash
        );

        if (!isValidPassword) {
            throw new Error('Invalid email or password');
        }

        // Generate token
        const token = this.generateToken(user);

        return {
            user: userRepository.toResponse(user),
            token
        };
    }

    /**
     * Get user profile
     */
    getProfile(userId: number): UserResponse | null {
        const user = userRepository.findById(userId);
        if (!user) return null;
        return userRepository.toResponse(user);
    }

    /**
     * Update user profile
     */
    updateProfile(
        userId: number,
        updates: { name?: string; email?: string }
    ): UserResponse | null {
        // Validate email if provided
        if (updates.email) {
            if (!this.isValidEmail(updates.email)) {
                throw new Error('Invalid email format');
            }
            if (userRepository.emailExists(updates.email, userId)) {
                throw new Error('Email already in use');
            }
        }

        // Validate name if provided
        if (updates.name !== undefined && updates.name.trim().length < 2) {
            throw new Error('Name must be at least 2 characters');
        }

        const user = userRepository.update(userId, updates);
        if (!user) return null;
        return userRepository.toResponse(user);
    }

    /**
     * Change password
     */
    async changePassword(
        userId: number,
        currentPassword: string,
        newPassword: string
    ): Promise<boolean> {
        // Get user
        const user = userRepository.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        // Verify current password
        const isValid = await bcrypt.compare(currentPassword, user.password_hash);
        if (!isValid) {
            throw new Error('Current password is incorrect');
        }

        // Validate new password
        if (!this.isValidPassword(newPassword)) {
            throw new Error('New password must be at least 8 characters');
        }

        // Hash and update
        const newHash = await bcrypt.hash(newPassword, this.SALT_ROUNDS);
        return userRepository.updatePassword(userId, newHash);
    }

    /**
     * Verify JWT token
     */
    verifyToken(token: string): JWTPayload {
        try {
            const decoded = jwt.verify(token, this.JWT_SECRET) as JWTPayload;
            return decoded;
        } catch (error) {
            throw new Error('Invalid or expired token');
        }
    }

    /**
     * Generate JWT token
     */
    private generateToken(user: User): string {
        const payload: JWTPayload = {
            userId: user.id,
            email: user.email
        };

        return jwt.sign(payload, this.JWT_SECRET, {
            expiresIn: this.JWT_EXPIRES_IN
        });
    }

    /**
     * Validate registration data
     */
    private validateRegistration(data: UserCreate): void {
        const errors: string[] = [];

        if (!data.name || data.name.trim().length < 2) {
            errors.push('Name must be at least 2 characters');
        }

        if (!data.email || !this.isValidEmail(data.email)) {
            errors.push('Valid email is required');
        }

        if (!data.password || !this.isValidPassword(data.password)) {
            errors.push('Password must be at least 8 characters');
        }

        if (errors.length > 0) {
            throw new Error(errors.join(', '));
        }
    }

    /**
     * Validate email format
     */
    private isValidEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    /**
     * Validate password strength
     */
    private isValidPassword(password: string): boolean {
        return password.length >= 8;
    }
}

// Export singleton instance
export default new AuthService();
```

### Step 2: Transaction Service

Create `src/services/transactionService.ts`:

```typescript
// ============================================
// Transaction Service - Business Logic
// ============================================

import { transactionRepository, categoryRepository } from '../repositories';
import {
    TransactionCreate,
    TransactionUpdate,
    TransactionWithCategory,
    TransactionFilters,
    CategoryType
} from '../models/types';

class TransactionService {
    /**
     * Create a new transaction
     */
    create(
        userId: number,
        data: Omit<TransactionCreate, 'user_id'>
    ): TransactionWithCategory {
        // Validate input
        this.validateTransaction(data);

        // Validate category access
        if (!categoryRepository.validateCategoryAccess(data.category_id, userId)) {
            throw new Error('Invalid category');
        }

        // Get category to determine type
        const category = categoryRepository.findById(data.category_id);
        if (!category) {
            throw new Error('Category not found');
        }

        // Create transaction
        return transactionRepository.create({
            ...data,
            user_id: userId,
            type: category.type
        });
    }

    /**
     * Get transaction by ID
     */
    getById(id: number, userId: number): TransactionWithCategory | null {
        return transactionRepository.findById(id, userId);
    }

    /**
     * Get all transactions for user with filters
     */
    getAll(userId: number, filters: TransactionFilters = {}): {
        transactions: TransactionWithCategory[];
        total: number;
        page: number;
        pageSize: number;
        totalPages: number;
    } {
        const pageSize = filters.limit || 20;
        const page = Math.floor((filters.offset || 0) / pageSize) + 1;

        const transactions = transactionRepository.findByUserId(userId, filters);
        const total = transactionRepository.countByUserId(userId, filters);
        const totalPages = Math.ceil(total / pageSize);

        return {
            transactions,
            total,
            page,
            pageSize,
            totalPages
        };
    }

    /**
     * Update transaction
     */
    update(
        id: number,
        userId: number,
        updates: TransactionUpdate
    ): TransactionWithCategory | null {
        // Check transaction exists
        const existing = transactionRepository.findById(id, userId);
        if (!existing) {
            return null;
        }

        // Validate updates
        if (updates.amount !== undefined && updates.amount <= 0) {
            throw new Error('Amount must be greater than 0');
        }

        if (updates.date !== undefined && !this.isValidDate(updates.date)) {
            throw new Error('Invalid date format');
        }

        // Validate category if changing
        if (updates.category_id !== undefined) {
            if (!categoryRepository.validateCategoryAccess(updates.category_id, userId)) {
                throw new Error('Invalid category');
            }
        }

        return transactionRepository.update(id, userId, updates);
    }

    /**
     * Delete transaction
     */
    delete(id: number, userId: number): boolean {
        return transactionRepository.delete(id, userId);
    }

    /**
     * Get recent transactions
     */
    getRecent(userId: number, limit: number = 5): TransactionWithCategory[] {
        return transactionRepository.getRecent(userId, limit);
    }

    /**
     * Get transactions by type
     */
    getByType(
        userId: number,
        type: CategoryType,
        filters: TransactionFilters = {}
    ): TransactionWithCategory[] {
        return transactionRepository.findByUserId(userId, { ...filters, type });
    }

    /**
     * Get transactions for a specific month
     */
    getByMonth(userId: number, year: number, month: number): TransactionWithCategory[] {
        const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
        const lastDay = new Date(year, month, 0).getDate();
        const endDate = `${year}-${String(month).padStart(2, '0')}-${lastDay}`;

        return transactionRepository.findByUserId(userId, {
            startDate,
            endDate
        });
    }

    /**
     * Bulk create transactions
     */
    createMany(
        userId: number,
        transactions: Array<Omit<TransactionCreate, 'user_id'>>
    ): TransactionWithCategory[] {
        const created: TransactionWithCategory[] = [];

        for (const data of transactions) {
            try {
                const transaction = this.create(userId, data);
                created.push(transaction);
            } catch (error) {
                console.error('Failed to create transaction:', error);
            }
        }

        return created;
    }

    /**
     * Validate transaction data
     */
    private validateTransaction(data: Omit<TransactionCreate, 'user_id'>): void {
        const errors: string[] = [];

        if (!data.category_id) {
            errors.push('Category is required');
        }

        if (!data.amount || data.amount <= 0) {
            errors.push('Amount must be greater than 0');
        }

        if (!data.date || !this.isValidDate(data.date)) {
            errors.push('Valid date is required (YYYY-MM-DD)');
        }

        if (errors.length > 0) {
            throw new Error(errors.join(', '));
        }
    }

    /**
     * Validate date format
     */
    private isValidDate(dateString: string): boolean {
        const regex = /^\d{4}-\d{2}-\d{2}$/;
        if (!regex.test(dateString)) return false;

        const date = new Date(dateString);
        return date instanceof Date && !isNaN(date.getTime());
    }
}

// Export singleton instance
export default new TransactionService();
```

### Step 3: Report Service

Create `src/services/reportService.ts`:

```typescript
// ============================================
// Report Service - Financial Reports
// ============================================

import { transactionRepository, categoryRepository } from '../repositories';
import {
    MonthlySummary,
    CategorySummary,
    CategoryType
} from '../models/types';

interface DashboardSummary {
    totalIncome: number;
    totalExpense: number;
    balance: number;
    transactionCount: number;
    incomeChange: number;
    expenseChange: number;
}

interface MonthlyTrend {
    month: string;
    income: number;
    expense: number;
    balance: number;
}

interface CategoryBreakdown {
    income: CategorySummary[];
    expense: CategorySummary[];
}

class ReportService {
    /**
     * Get dashboard summary
     */
    getDashboardSummary(userId: number): DashboardSummary {
        // Get current month dates
        const now = new Date();
        const currentMonthStart = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;
        const currentMonthEnd = now.toISOString().split('T')[0];

        // Get previous month dates
        const prevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const prevMonthStart = `${prevMonth.getFullYear()}-${String(prevMonth.getMonth() + 1).padStart(2, '0')}-01`;
        const prevMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0)
            .toISOString().split('T')[0];

        // Get current month summary
        const currentSummary = transactionRepository.getSummary(
            userId,
            currentMonthStart,
            currentMonthEnd
        );

        // Get previous month summary for comparison
        const prevSummary = transactionRepository.getSummary(
            userId,
            prevMonthStart,
            prevMonthEnd
        );

        // Calculate percentage changes
        const incomeChange = this.calculatePercentageChange(
            prevSummary.totalIncome,
            currentSummary.totalIncome
        );

        const expenseChange = this.calculatePercentageChange(
            prevSummary.totalExpense,
            currentSummary.totalExpense
        );

        return {
            totalIncome: currentSummary.totalIncome,
            totalExpense: currentSummary.totalExpense,
            balance: currentSummary.balance,
            transactionCount: currentSummary.transactionCount,
            incomeChange,
            expenseChange
        };
    }

    /**
     * Get overall summary (all time or date range)
     */
    getSummary(
        userId: number,
        startDate?: string,
        endDate?: string
    ): {
        totalIncome: number;
        totalExpense: number;
        balance: number;
        transactionCount: number;
    } {
        return transactionRepository.getSummary(userId, startDate, endDate);
    }

    /**
     * Get monthly trends
     */
    getMonthlyTrends(userId: number, months: number = 12): MonthlyTrend[] {
        const monthlySummary = transactionRepository.getMonthlySummary(userId, months);

        return monthlySummary.map(summary => ({
            month: summary.month,
            income: summary.total_income,
            expense: summary.total_expense,
            balance: summary.balance
        }));
    }

    /**
     * Get category breakdown
     */
    getCategoryBreakdown(
        userId: number,
        startDate?: string,
        endDate?: string
    ): CategoryBreakdown {
        const income = transactionRepository.getCategorySummary(
            userId,
            'income',
            startDate,
            endDate
        );

        const expense = transactionRepository.getCategorySummary(
            userId,
            'expense',
            startDate,
            endDate
        );

        return { income, expense };
    }

    /**
     * Get spending by category
     */
    getSpendingByCategory(
        userId: number,
        startDate?: string,
        endDate?: string
    ): CategorySummary[] {
        return transactionRepository.getCategorySummary(
            userId,
            'expense',
            startDate,
            endDate
        );
    }

    /**
     * Get income by category
     */
    getIncomeByCategory(
        userId: number,
        startDate?: string,
        endDate?: string
    ): CategorySummary[] {
        return transactionRepository.getCategorySummary(
            userId,
            'income',
            startDate,
            endDate
        );
    }

    /**
     * Get monthly comparison
     */
    getMonthlyComparison(
        userId: number,
        year: number,
        month: number
    ): {
        current: { income: number; expense: number; balance: number };
        previous: { income: number; expense: number; balance: number };
        changes: { income: number; expense: number; balance: number };
    } {
        // Current month
        const currentStart = `${year}-${String(month).padStart(2, '0')}-01`;
        const currentEnd = new Date(year, month, 0).toISOString().split('T')[0];

        // Previous month
        const prevDate = new Date(year, month - 2, 1);
        const prevStart = `${prevDate.getFullYear()}-${String(prevDate.getMonth() + 1).padStart(2, '0')}-01`;
        const prevEnd = new Date(year, month - 1, 0).toISOString().split('T')[0];

        const currentSummary = transactionRepository.getSummary(userId, currentStart, currentEnd);
        const prevSummary = transactionRepository.getSummary(userId, prevStart, prevEnd);

        return {
            current: {
                income: currentSummary.totalIncome,
                expense: currentSummary.totalExpense,
                balance: currentSummary.balance
            },
            previous: {
                income: prevSummary.totalIncome,
                expense: prevSummary.totalExpense,
                balance: prevSummary.balance
            },
            changes: {
                income: this.calculatePercentageChange(prevSummary.totalIncome, currentSummary.totalIncome),
                expense: this.calculatePercentageChange(prevSummary.totalExpense, currentSummary.totalExpense),
                balance: this.calculatePercentageChange(prevSummary.balance, currentSummary.balance)
            }
        };
    }

    /**
     * Get yearly summary
     */
    getYearlySummary(userId: number, year: number): {
        months: MonthlyTrend[];
        totals: { income: number; expense: number; balance: number };
        averages: { income: number; expense: number };
    } {
        const startDate = `${year}-01-01`;
        const endDate = `${year}-12-31`;

        const summary = transactionRepository.getSummary(userId, startDate, endDate);
        const monthlyData = transactionRepository.getMonthlySummary(userId, 12)
            .filter(m => m.month.startsWith(String(year)));

        const months = monthlyData.map(m => ({
            month: m.month,
            income: m.total_income,
            expense: m.total_expense,
            balance: m.balance
        }));

        const monthCount = months.length || 1;

        return {
            months,
            totals: {
                income: summary.totalIncome,
                expense: summary.totalExpense,
                balance: summary.balance
            },
            averages: {
                income: summary.totalIncome / monthCount,
                expense: summary.totalExpense / monthCount
            }
        };
    }

    /**
     * Get top spending categories
     */
    getTopSpendingCategories(
        userId: number,
        limit: number = 5,
        startDate?: string,
        endDate?: string
    ): CategorySummary[] {
        const categories = transactionRepository.getCategorySummary(
            userId,
            'expense',
            startDate,
            endDate
        );

        return categories.slice(0, limit);
    }

    /**
     * Calculate percentage change
     */
    private calculatePercentageChange(oldValue: number, newValue: number): number {
        if (oldValue === 0) {
            return newValue > 0 ? 100 : 0;
        }
        return ((newValue - oldValue) / oldValue) * 100;
    }
}

// Export singleton instance
export default new ReportService();
```

### Step 4: Category Service

Create `src/services/categoryService.ts`:

```typescript
// ============================================
// Category Service - Category Management
// ============================================

import { categoryRepository } from '../repositories';
import { Category, CategoryCreate, CategoryType } from '../models/types';

class CategoryService {
    /**
     * Get all categories for user
     */
    getAll(userId: number): Category[] {
        return categoryRepository.findByUserId(userId);
    }

    /**
     * Get categories by type
     */
    getByType(userId: number, type: CategoryType): Category[] {
        return categoryRepository.findByType(userId, type);
    }

    /**
     * Get category by ID
     */
    getById(id: number, userId: number): Category | null {
        const category = categoryRepository.findById(id);
        if (!category) return null;

        // Check access
        if (category.user_id !== null && category.user_id !== userId) {
            return null;
        }

        return category;
    }

    /**
     * Create custom category
     */
    create(userId: number, data: Omit<CategoryCreate, 'user_id'>): Category {
        // Validate input
        this.validateCategory(data);

        // Check for duplicate name
        if (categoryRepository.nameExists(data.name, userId)) {
            throw new Error('Category with this name already exists');
        }

        return categoryRepository.create({
            ...data,
            user_id: userId
        });
    }

    /**
     * Update category
     */
    update(
        id: number,
        userId: number,
        updates: { name?: string; icon?: string }
    ): Category | null {
        // Validate name if provided
        if (updates.name !== undefined) {
            if (updates.name.trim().length < 2) {
                throw new Error('Category name must be at least 2 characters');
            }
            if (categoryRepository.nameExists(updates.name, userId, id)) {
                throw new Error('Category with this name already exists');
            }
        }

        return categoryRepository.update(id, userId, updates);
    }

    /**
     * Delete category
     */
    delete(id: number, userId: number): boolean {
        // Check if category is in use
        if (categoryRepository.isCategoryInUse(id)) {
            throw new Error('Cannot delete category that has transactions. Please reassign transactions first.');
        }

        return categoryRepository.delete(id, userId);
    }

    /**
     * Get default categories
     */
    getDefaults(): Category[] {
        return categoryRepository.findDefaults();
    }

    /**
     * Get user's custom categories
     */
    getCustom(userId: number): Category[] {
        return categoryRepository.findCustomByUserId(userId);
    }

    /**
     * Validate category data
     */
    private validateCategory(data: Omit<CategoryCreate, 'user_id'>): void {
        const errors: string[] = [];

        if (!data.name || data.name.trim().length < 2) {
            errors.push('Category name must be at least 2 characters');
        }

        if (!data.type || !['income', 'expense'].includes(data.type)) {
            errors.push('Category type must be "income" or "expense"');
        }

        if (errors.length > 0) {
            throw new Error(errors.join(', '));
        }
    }
}

// Export singleton instance
export default new CategoryService();
```

### Step 5: Service Index

Create `src/services/index.ts`:

```typescript
// ============================================
// Service Exports
// ============================================

export { default as authService } from './authService';
export { default as transactionService } from './transactionService';
export { default as categoryService } from './categoryService';
export { default as reportService } from './reportService';
```

---

## ✍️ Exercises

### Exercise 1: Add Password Reset
Add these methods to AuthService:
- `generateResetToken(email)`: Generate a password reset token
- `resetPassword(token, newPassword)`: Reset password using token
- Store reset tokens with expiration (you may need a new table)

### Exercise 2: Add Budget Service
Create `src/services/budgetService.ts` that:
- Allows setting monthly budgets per category
- Compares actual spending vs budget
- Returns alerts when approaching/exceeding budget

### Exercise 3: Add Export Service
Create `src/services/exportService.ts` that:
- Exports transactions to CSV format
- Exports transactions to JSON format
- Supports date range filtering

---

## ❓ Quiz Questions

### Q1: Service vs Repository
Why do we validate data in the service layer instead of the repository layer?

**Your Answer**: 


### Q2: Password Hashing
Why do we use bcrypt with salt rounds instead of simple hashing like SHA256?

**Your Answer**: 


### Q3: JWT Expiration
What happens when a JWT token expires? How should the frontend handle this?

**Your Answer**: 


---

## 📝 Bonus Questions (Optional)

### B1: How would you implement rate limiting for the login endpoint to prevent brute force attacks?

**Your Answer**: 


### B2: What is the difference between authentication and authorization? Where would each be handled?

**Your Answer**: 


---

## ✅ Day 28 Checklist

- [ ] Understand service layer responsibilities
- [ ] Implement AuthService with registration and login
- [ ] Implement password hashing with bcrypt
- [ ] Implement JWT token generation and verification
- [ ] Implement TransactionService with validation
- [ ] Implement ReportService with summaries
- [ ] Implement CategoryService
- [ ] Complete Exercise 1 (Password Reset)
- [ ] Complete Exercise 2 (Budget Service)
- [ ] Complete Exercise 3 (Export Service)
- [ ] Answer all quiz questions

---

## 🔗 Next Day Preview
Tomorrow you'll implement the **Controller Layer & Routes** - creating all API endpoints and connecting everything together.
