# Day 27: Repository Layer (Finance Tracker)

## 📚 What to Learn Today
- **Reference**: [LEARNING_MODULE.md](../../Modules/LEARNING_MODULE.md) - Module 5 (Lines 1622-2187)
- **Topics**: UserRepository, TransactionRepository, CategoryRepository with Sequelize
- **Time**: ~45 minutes reading, ~45 minutes practice
- **Goal**: Implement all database operations using Sequelize raw SQL queries

---

## 📖 Key Concepts

### 1. Repository Pattern Review
Repositories encapsulate all database operations for a specific entity.

```
Controller → Service → Repository → Database
                          ↓
                    SQL Queries (via Sequelize)
                    Data Mapping
                    Error Handling
```

### 2. Repository Responsibilities

```
Repository Layer:
├── CRUD Operations (Create, Read, Update, Delete)
├── SQL Query Execution
├── Data Mapping (DB rows → TypeScript objects)
├── Parameter Binding (SQL injection prevention)
└── Database-specific logic
```

### 3. Sequelize Raw SQL Pattern (from LEARNING_MODULE)

```typescript
// Using sequelize.query() with replacements
const [result] = await sequelize.query(`
    SELECT * FROM users WHERE email = :email
`, {
    type: QueryTypes.SELECT,
    replacements: { email }
});

// Key points:
// - :placeholder syntax for parameters
// - replacements object maps values
// - QueryTypes specifies the query type
// - Automatic SQL injection prevention
```

### 4. Why Raw SQL with Sequelize?

| Approach | Pros | Cons |
|----------|------|------|
| **Sequelize Models** | Less code, auto-mapping | Less control, magic |
| **Raw SQL** | Full control, explicit | More code |
| **Raw SQL + Sequelize** | Best of both: control + safety | Slightly more verbose |

We use raw SQL because:
- You learn actual SQL
- Full control over queries
- Easier to optimize
- Matches the LEARNING_MODULE approach

---

## 💻 Code to Type & Understand

### Step 1: User Repository

Create `src/api/v1/repositories/user.repository.ts`:

```typescript
// ============================================
// User Repository - Database Operations
// ============================================

import { QueryTypes } from 'sequelize'
import sequelize from '../../../config/database.js'
import { User, UserCreate, UserResponse } from '../../../types/index.js'

export class UserRepository {
    /**
     * Find all users
     */
    async findAll(): Promise<UserResponse[]> {
        const result = await sequelize.query(`
            SELECT id, email, full_name, email_verified, created_at
            FROM users
            ORDER BY created_at DESC
        `, {
            type: QueryTypes.SELECT
        })

        return result as UserResponse[]
    }

    /**
     * Find user by ID
     */
    async findById(id: string): Promise<User | null> {
        const [result] = await sequelize.query(`
            SELECT id, email, password, full_name, email_verified, created_at, updated_at
            FROM users
            WHERE id = :id
        `, {
            type: QueryTypes.SELECT,
            replacements: { id }
        })

        return (result as User) || null
    }

    /**
     * Find user by email
     */
    async findByEmail(email: string): Promise<User | null> {
        const [result] = await sequelize.query(`
            SELECT id, email, password, full_name, email_verified, created_at, updated_at
            FROM users
            WHERE email = :email
        `, {
            type: QueryTypes.SELECT,
            replacements: { email: email.toLowerCase() }
        })

        return (result as User) || null
    }

    /**
     * Create new user
     */
    async create(userData: UserCreate & { password: string }): Promise<User> {
        const [result] = await sequelize.query(`
            INSERT INTO users (full_name, email, password, email_verified)
            VALUES (:full_name, :email, :password, :email_verified)
            RETURNING *
        `, {
            replacements: {
                full_name: userData.full_name,
                email: userData.email.toLowerCase(),
                password: userData.password,
                email_verified: false
            }
        })

        return (result as any)[0] as User
    }

    /**
     * Update user
     */
    async update(id: string, updates: Partial<Pick<User, 'full_name' | 'email'>>): Promise<User | null> {
        const fields: string[] = []
        const replacements: Record<string, any> = { id }

        if (updates.full_name !== undefined) {
            fields.push('full_name = :full_name')
            replacements.full_name = updates.full_name
        }

        if (updates.email !== undefined) {
            fields.push('email = :email')
            replacements.email = updates.email.toLowerCase()
        }

        if (fields.length === 0) {
            return this.findById(id)
        }

        fields.push('updated_at = CURRENT_TIMESTAMP')

        const [result] = await sequelize.query(`
            UPDATE users
            SET ${fields.join(', ')}
            WHERE id = :id
            RETURNING *
        `, {
            replacements
        })

        return (result as any)[0] as User || null
    }

    /**
     * Update password
     */
    async updatePassword(id: string, passwordHash: string): Promise<boolean> {
        const [, metadata] = await sequelize.query(`
            UPDATE users
            SET password = :password, updated_at = CURRENT_TIMESTAMP
            WHERE id = :id
        `, {
            replacements: { id, password: passwordHash }
        })

        return (metadata as any).rowCount > 0
    }

    /**
     * Update email verification status
     */
    async updateEmailVerification(id: string): Promise<boolean> {
        const [, metadata] = await sequelize.query(`
            UPDATE users
            SET email_verified = true, updated_at = CURRENT_TIMESTAMP
            WHERE id = :id
        `, {
            replacements: { id }
        })

        return (metadata as any).rowCount > 0
    }

    /**
     * Delete user
     */
    async delete(id: string): Promise<boolean> {
        const [, metadata] = await sequelize.query(`
            DELETE FROM users WHERE id = :id
        `, {
            replacements: { id }
        })

        return (metadata as any).rowCount > 0
    }

    /**
     * Check if email exists
     */
    async emailExists(email: string, excludeUserId?: string): Promise<boolean> {
        let query = 'SELECT COUNT(*) as count FROM users WHERE email = :email'
        const replacements: Record<string, any> = { email: email.toLowerCase() }

        if (excludeUserId) {
            query += ' AND id != :excludeUserId'
            replacements.excludeUserId = excludeUserId
        }

        const [result] = await sequelize.query(query, {
            type: QueryTypes.SELECT,
            replacements
        })

        return parseInt((result as any).count) > 0
    }

    /**
     * Convert User to UserResponse (remove sensitive data)
     */
    toResponse(user: User): UserResponse {
        return {
            id: user.id,
            email: user.email,
            full_name: user.full_name,
            email_verified: user.email_verified,
            created_at: user.created_at
        }
    }
}
```

### Step 2: Category Repository

Create `src/api/v1/repositories/category.repository.ts`:

```typescript
// ============================================
// Category Repository - Database Operations
// ============================================

import { QueryTypes } from 'sequelize'
import sequelize from '../../../config/database.js'
import { Category, CategoryCreate, CategoryType } from '../../../types/index.js'

export class CategoryRepository {
    /**
     * Find category by ID
     */
    async findById(id: string): Promise<Category | null> {
        const [result] = await sequelize.query(`
            SELECT id, name, type, icon, user_id, created_at
            FROM categories
            WHERE id = :id
        `, {
            type: QueryTypes.SELECT,
            replacements: { id }
        })

        return (result as Category) || null
    }

    /**
     * Find all categories for a user (including defaults)
     */
    async findByUserId(userId: string): Promise<Category[]> {
        const result = await sequelize.query(`
            SELECT id, name, type, icon, user_id, created_at
            FROM categories
            WHERE user_id IS NULL OR user_id = :userId
            ORDER BY 
                CASE WHEN user_id IS NULL THEN 0 ELSE 1 END,
                type,
                name
        `, {
            type: QueryTypes.SELECT,
            replacements: { userId }
        })

        return result as Category[]
    }

    /**
     * Find categories by type
     */
    async findByType(userId: string, type: CategoryType): Promise<Category[]> {
        const result = await sequelize.query(`
            SELECT id, name, type, icon, user_id, created_at
            FROM categories
            WHERE (user_id IS NULL OR user_id = :userId)
              AND type = :type
            ORDER BY name
        `, {
            type: QueryTypes.SELECT,
            replacements: { userId, type }
        })

        return result as Category[]
    }

    /**
     * Find default categories only
     */
    async findDefaults(): Promise<Category[]> {
        const result = await sequelize.query(`
            SELECT id, name, type, icon, user_id, created_at
            FROM categories
            WHERE user_id IS NULL
            ORDER BY type, name
        `, {
            type: QueryTypes.SELECT
        })

        return result as Category[]
    }

    /**
     * Find user's custom categories only
     */
    async findCustomByUserId(userId: string): Promise<Category[]> {
        const result = await sequelize.query(`
            SELECT id, name, type, icon, user_id, created_at
            FROM categories
            WHERE user_id = :userId
            ORDER BY type, name
        `, {
            type: QueryTypes.SELECT,
            replacements: { userId }
        })

        return result as Category[]
    }

    /**
     * Create new category
     */
    async create(categoryData: CategoryCreate): Promise<Category> {
        const [result] = await sequelize.query(`
            INSERT INTO categories (name, type, icon, user_id)
            VALUES (:name, :type, :icon, :user_id)
            RETURNING *
        `, {
            replacements: {
                name: categoryData.name,
                type: categoryData.type,
                icon: categoryData.icon || '📁',
                user_id: categoryData.user_id || null
            }
        })

        return (result as any)[0] as Category
    }

    /**
     * Update category (only user's own categories)
     */
    async update(id: string, userId: string, updates: Partial<Pick<Category, 'name' | 'icon'>>): Promise<Category | null> {
        const category = await this.findById(id)
        if (!category || category.user_id !== userId) {
            return null
        }

        const fields: string[] = []
        const replacements: Record<string, any> = { id }

        if (updates.name !== undefined) {
            fields.push('name = :name')
            replacements.name = updates.name
        }

        if (updates.icon !== undefined) {
            fields.push('icon = :icon')
            replacements.icon = updates.icon
        }

        if (fields.length === 0) {
            return category
        }

        const [result] = await sequelize.query(`
            UPDATE categories
            SET ${fields.join(', ')}
            WHERE id = :id
            RETURNING *
        `, {
            replacements
        })

        return (result as any)[0] as Category || null
    }

    /**
     * Delete category (only user's custom categories)
     */
    async delete(id: string, userId: string): Promise<boolean> {
        const category = await this.findById(id)
        if (!category || category.user_id !== userId) {
            return false
        }

        const inUse = await this.isCategoryInUse(id)
        if (inUse) {
            throw new Error('Cannot delete category that has transactions')
        }

        const [, metadata] = await sequelize.query(`
            DELETE FROM categories WHERE id = :id AND user_id = :userId
        `, {
            replacements: { id, userId }
        })

        return (metadata as any).rowCount > 0
    }

    /**
     * Check if category is used in any transactions
     */
    async isCategoryInUse(categoryId: string): Promise<boolean> {
        const [result] = await sequelize.query(`
            SELECT COUNT(*) as count
            FROM transactions
            WHERE category_id = :categoryId
        `, {
            type: QueryTypes.SELECT,
            replacements: { categoryId }
        })

        return parseInt((result as any).count) > 0
    }

    /**
     * Check if category name exists for user
     */
    async nameExists(name: string, userId: string, excludeId?: string): Promise<boolean> {
        let query = `
            SELECT COUNT(*) as count
            FROM categories
            WHERE name = :name
              AND (user_id IS NULL OR user_id = :userId)
        `
        const replacements: Record<string, any> = { name, userId }

        if (excludeId) {
            query += ' AND id != :excludeId'
            replacements.excludeId = excludeId
        }

        const [result] = await sequelize.query(query, {
            type: QueryTypes.SELECT,
            replacements
        })

        return parseInt((result as any).count) > 0
    }

    /**
     * Validate category belongs to user (or is default)
     */
    async validateCategoryAccess(categoryId: string, userId: string): Promise<boolean> {
        const category = await this.findById(categoryId)
        if (!category) return false
        return category.user_id === null || category.user_id === userId
    }
}
```

### Step 3: Transaction Repository

Create `src/api/v1/repositories/transaction.repository.ts`:

```typescript
// ============================================
// Transaction Repository - Database Operations
// ============================================

import { QueryTypes } from 'sequelize'
import sequelize from '../../../config/database.js'
import {
    Transaction,
    TransactionCreate,
    TransactionUpdate,
    TransactionWithCategory,
    TransactionFilters,
    MonthlySummary,
    CategorySummary
} from '../../../types/index.js'

export class TransactionRepository {
    /**
     * Find transaction by ID
     */
    async findById(id: string, userId: string): Promise<TransactionWithCategory | null> {
        const [result] = await sequelize.query(`
            SELECT 
                t.id, t.user_id, t.category_id, t.amount, 
                t.description, t.date, t.type, t.created_at, t.updated_at,
                c.name as category_name, c.icon as category_icon
            FROM transactions t
            JOIN categories c ON t.category_id = c.id
            WHERE t.id = :id AND t.user_id = :userId
        `, {
            type: QueryTypes.SELECT,
            replacements: { id, userId }
        })

        return (result as TransactionWithCategory) || null
    }

    /**
     * Find all transactions for a user with filters
     */
    async findByUserId(userId: string, filters: TransactionFilters = {}): Promise<TransactionWithCategory[]> {
        const conditions: string[] = ['t.user_id = :userId']
        const replacements: Record<string, any> = { userId }

        if (filters.startDate) {
            conditions.push('t.date >= :startDate')
            replacements.startDate = filters.startDate
        }

        if (filters.endDate) {
            conditions.push('t.date <= :endDate')
            replacements.endDate = filters.endDate
        }

        if (filters.type) {
            conditions.push('t.type = :type')
            replacements.type = filters.type
        }

        if (filters.categoryId) {
            conditions.push('t.category_id = :categoryId')
            replacements.categoryId = filters.categoryId
        }

        const limit = filters.limit || 100
        const offset = filters.offset || 0
        replacements.limit = limit
        replacements.offset = offset

        const result = await sequelize.query(`
            SELECT 
                t.id, t.user_id, t.category_id, t.amount, 
                t.description, t.date, t.type, t.created_at, t.updated_at,
                c.name as category_name, c.icon as category_icon
            FROM transactions t
            JOIN categories c ON t.category_id = c.id
            WHERE ${conditions.join(' AND ')}
            ORDER BY t.date DESC, t.created_at DESC
            LIMIT :limit OFFSET :offset
        `, {
            type: QueryTypes.SELECT,
            replacements
        })

        return result as TransactionWithCategory[]
    }

    /**
     * Create new transaction
     */
    async create(transactionData: TransactionCreate): Promise<TransactionWithCategory> {
        const [result] = await sequelize.query(`
            INSERT INTO transactions (user_id, category_id, amount, description, date, type)
            VALUES (:user_id, :category_id, :amount, :description, :date, :type)
            RETURNING *
        `, {
            replacements: {
                user_id: transactionData.user_id,
                category_id: transactionData.category_id,
                amount: transactionData.amount,
                description: transactionData.description || '',
                date: transactionData.date,
                type: transactionData.type
            }
        })

        const transaction = (result as any)[0] as Transaction
        return this.findById(transaction.id, transaction.user_id) as Promise<TransactionWithCategory>
    }

    /**
     * Update transaction
     */
    async update(id: string, userId: string, updates: TransactionUpdate): Promise<TransactionWithCategory | null> {
        const transaction = await this.findById(id, userId)
        if (!transaction) return null

        const fields: string[] = []
        const replacements: Record<string, any> = { id, userId }

        if (updates.category_id !== undefined) {
            fields.push('category_id = :category_id')
            replacements.category_id = updates.category_id
        }

        if (updates.amount !== undefined) {
            fields.push('amount = :amount')
            replacements.amount = updates.amount
        }

        if (updates.description !== undefined) {
            fields.push('description = :description')
            replacements.description = updates.description
        }

        if (updates.date !== undefined) {
            fields.push('date = :date')
            replacements.date = updates.date
        }

        if (fields.length === 0) {
            return transaction
        }

        fields.push('updated_at = CURRENT_TIMESTAMP')

        await sequelize.query(`
            UPDATE transactions
            SET ${fields.join(', ')}
            WHERE id = :id AND user_id = :userId
        `, {
            replacements
        })

        return this.findById(id, userId)
    }

    /**
     * Delete transaction
     */
    async delete(id: string, userId: string): Promise<boolean> {
        const [, metadata] = await sequelize.query(`
            DELETE FROM transactions WHERE id = :id AND user_id = :userId
        `, {
            replacements: { id, userId }
        })

        return (metadata as any).rowCount > 0
    }

    /**
     * Get total count for user
     */
    async countByUserId(userId: string, filters: TransactionFilters = {}): Promise<number> {
        const conditions: string[] = ['user_id = :userId']
        const replacements: Record<string, any> = { userId }

        if (filters.startDate) {
            conditions.push('date >= :startDate')
            replacements.startDate = filters.startDate
        }

        if (filters.endDate) {
            conditions.push('date <= :endDate')
            replacements.endDate = filters.endDate
        }

        if (filters.type) {
            conditions.push('type = :type')
            replacements.type = filters.type
        }

        const [result] = await sequelize.query(`
            SELECT COUNT(*) as count
            FROM transactions
            WHERE ${conditions.join(' AND ')}
        `, {
            type: QueryTypes.SELECT,
            replacements
        })

        return parseInt((result as any).count)
    }

    /**
     * Get summary (total income, expense, balance)
     */
    async getSummary(userId: string, startDate?: string, endDate?: string): Promise<{
        totalIncome: number;
        totalExpense: number;
        balance: number;
        transactionCount: number;
    }> {
        const conditions: string[] = ['user_id = :userId']
        const replacements: Record<string, any> = { userId }

        if (startDate) {
            conditions.push('date >= :startDate')
            replacements.startDate = startDate
        }

        if (endDate) {
            conditions.push('date <= :endDate')
            replacements.endDate = endDate
        }

        const [result] = await sequelize.query(`
            SELECT 
                COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0) as total_income,
                COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) as total_expense,
                COUNT(*) as transaction_count
            FROM transactions
            WHERE ${conditions.join(' AND ')}
        `, {
            type: QueryTypes.SELECT,
            replacements
        })

        const row = result as any
        return {
            totalIncome: parseFloat(row.total_income),
            totalExpense: parseFloat(row.total_expense),
            balance: parseFloat(row.total_income) - parseFloat(row.total_expense),
            transactionCount: parseInt(row.transaction_count)
        }
    }

    /**
     * Get monthly summary
     */
    async getMonthlySummary(userId: string, months: number = 12): Promise<MonthlySummary[]> {
        const result = await sequelize.query(`
            SELECT 
                TO_CHAR(date, 'YYYY-MM') as month,
                COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0) as total_income,
                COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) as total_expense
            FROM transactions
            WHERE user_id = :userId
              AND date >= CURRENT_DATE - INTERVAL ':months months'
            GROUP BY TO_CHAR(date, 'YYYY-MM')
            ORDER BY month DESC
        `, {
            type: QueryTypes.SELECT,
            replacements: { userId, months }
        })

        return (result as any[]).map(row => ({
            month: row.month,
            total_income: parseFloat(row.total_income),
            total_expense: parseFloat(row.total_expense),
            balance: parseFloat(row.total_income) - parseFloat(row.total_expense)
        }))
    }

    /**
     * Get summary by category
     */
    async getCategorySummary(
        userId: string,
        type: 'income' | 'expense',
        startDate?: string,
        endDate?: string
    ): Promise<CategorySummary[]> {
        const conditions: string[] = ['t.user_id = :userId', 't.type = :type']
        const replacements: Record<string, any> = { userId, type }

        if (startDate) {
            conditions.push('t.date >= :startDate')
            replacements.startDate = startDate
        }

        if (endDate) {
            conditions.push('t.date <= :endDate')
            replacements.endDate = endDate
        }

        const result = await sequelize.query(`
            SELECT 
                c.id as category_id,
                c.name as category_name,
                c.icon as category_icon,
                COALESCE(SUM(t.amount), 0) as total
            FROM transactions t
            JOIN categories c ON t.category_id = c.id
            WHERE ${conditions.join(' AND ')}
            GROUP BY c.id, c.name, c.icon
            ORDER BY total DESC
        `, {
            type: QueryTypes.SELECT,
            replacements
        })

        const rows = result as any[]
        const grandTotal = rows.reduce((sum, row) => sum + parseFloat(row.total), 0)

        return rows.map(row => ({
            category_id: row.category_id,
            category_name: row.category_name,
            category_icon: row.category_icon,
            total: parseFloat(row.total),
            percentage: grandTotal > 0 ? (parseFloat(row.total) / grandTotal) * 100 : 0
        }))
    }

    /**
     * Get recent transactions
     */
    async getRecent(userId: string, limit: number = 5): Promise<TransactionWithCategory[]> {
        return this.findByUserId(userId, { limit })
    }

    /**
     * Delete all transactions for a user
     */
    async deleteAllByUserId(userId: string): Promise<number> {
        const [, metadata] = await sequelize.query(`
            DELETE FROM transactions WHERE user_id = :userId
        `, {
            replacements: { userId }
        })

        return (metadata as any).rowCount
    }
}
```

### Step 4: Repository Index

Create `src/api/v1/repositories/index.ts`:

```typescript
// ============================================
// Repository Exports
// ============================================

export { UserRepository } from './user.repository.js'
export { CategoryRepository } from './category.repository.js'
export { TransactionRepository } from './transaction.repository.js'
```

### Step 5: Test Repositories

Create `src/test-repositories.ts` (temporary test file):

```typescript
// ============================================
// Test Repositories (Run with: npx ts-node src/test-repositories.ts)
// ============================================

import dotenv from 'dotenv'
dotenv.config()

import { UserRepository, CategoryRepository, TransactionRepository } from './api/v1/repositories/index.js'
import bcrypt from 'bcryptjs'

async function testRepositories() {
    console.log('🧪 Testing Repositories...\n')

    const userRepo = new UserRepository()
    const categoryRepo = new CategoryRepository()
    const transactionRepo = new TransactionRepository()

    try {
        // Test User Repository
        console.log('📝 Testing UserRepository...')
        
        const passwordHash = await bcrypt.hash('testpassword123', 10)
        const testUser = await userRepo.create({
            email: 'test@example.com',
            password: passwordHash,
            full_name: 'Test User'
        })
        console.log('Created user:', userRepo.toResponse(testUser))

        const foundUser = await userRepo.findByEmail('test@example.com')
        console.log('Found by email:', foundUser ? 'Yes' : 'No')

        // Test Category Repository
        console.log('\n📝 Testing CategoryRepository...')
        
        const categories = await categoryRepo.findByUserId(testUser.id)
        console.log(`Found ${categories.length} categories for user`)

        const incomeCategories = await categoryRepo.findByType(testUser.id, 'income')
        console.log(`Found ${incomeCategories.length} income categories`)

        const customCategory = await categoryRepo.create({
            name: 'Side Hustle',
            type: 'income',
            icon: '🚀',
            user_id: testUser.id
        })
        console.log('Created custom category:', customCategory.name)

        // Test Transaction Repository
        console.log('\n📝 Testing TransactionRepository...')

        const transaction = await transactionRepo.create({
            user_id: testUser.id,
            category_id: categories[0].id,
            amount: 5000,
            description: 'Monthly salary',
            date: new Date().toISOString().split('T')[0],
            type: 'income'
        })
        console.log('Created transaction:', transaction.id)

        const summary = await transactionRepo.getSummary(testUser.id)
        console.log('Summary:', summary)

        // Cleanup
        console.log('\n🧹 Cleaning up...')
        await transactionRepo.delete(transaction.id, testUser.id)
        await categoryRepo.delete(customCategory.id, testUser.id)
        await userRepo.delete(testUser.id)
        console.log('Cleanup complete!')

        console.log('\n✅ All repository tests passed!')
    } catch (error) {
        console.error('❌ Test failed:', error)
    }

    process.exit(0)
}

testRepositories()
```

---

## ✍️ Exercises

### Exercise 1: Add Search to Transaction Repository
Add a `search` method to TransactionRepository that:
- Searches transactions by description using SQL `ILIKE`
- Returns results ordered by relevance (exact match first)

```typescript
async search(userId: string, query: string): Promise<TransactionWithCategory[]> {
    // Your implementation here
}
```

### Exercise 2: Add Bulk Operations
Add these methods to TransactionRepository:
- `createMany(transactions: TransactionCreate[])`: Insert multiple transactions
- `deleteByDateRange(userId, startDate, endDate)`: Delete transactions in date range

### Exercise 3: Add Statistics Methods
Add these methods to TransactionRepository:
- `getAverageByCategory(userId, type)`: Average transaction amount per category
- `getLargestTransaction(userId, type)`: Get the largest income/expense
- `getTransactionsByDayOfWeek(userId)`: Group transactions by day of week

---

## ❓ Quiz Questions

### Q1: Parameterized Queries
Why do we use `:placeholder` syntax with `replacements` instead of string concatenation for SQL queries?

**Your Answer**: 


### Q2: QueryTypes
What is the purpose of `QueryTypes.SELECT` in Sequelize queries? What happens if you omit it?

**Your Answer**: 


### Q3: RETURNING Clause
What does `RETURNING *` do in PostgreSQL INSERT/UPDATE statements? Why is it useful?

**Your Answer**: 


---

## 📝 Bonus Questions (Optional)

### B1: What is the difference between `sequelize.query()` returning `[result]` vs `[result, metadata]`?

**Your Answer**: 


### B2: How would you implement soft delete (marking as deleted instead of removing) in the repositories?

**Your Answer**: 


---

## ✅ Day 27 Checklist

- [ ] Understand the repository pattern with Sequelize
- [ ] Create UserRepository with all methods
- [ ] Create CategoryRepository with all methods
- [ ] Create TransactionRepository with all methods
- [ ] Understand `:placeholder` replacements syntax
- [ ] Implement filtering and pagination
- [ ] Implement summary and report methods
- [ ] Test all repositories
- [ ] Complete Exercise 1 (Search)
- [ ] Complete Exercise 2 (Bulk Operations)
- [ ] Complete Exercise 3 (Statistics)
- [ ] Answer all quiz questions

---

## 🔗 Next Day Preview
Tomorrow you'll implement the **Service Layer** - AuthService, TransactionService, and ReportService with business logic, validation, and JWT token handling.
