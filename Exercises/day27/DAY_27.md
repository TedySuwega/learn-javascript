# Day 27: Repository Layer (Finance Tracker)

## 📚 What to Learn Today
- **Topics**: UserRepository, TransactionRepository, CategoryRepository
- **Time**: ~45 minutes reading, ~45 minutes practice
- **Goal**: Implement all database operations with TypeScript

---

## 📖 Key Concepts

### 1. Repository Pattern Review
Repositories encapsulate all database operations for a specific entity.

```
Controller → Service → Repository → Database
                          ↓
                    SQL Queries
                    Data Mapping
                    Error Handling
```

### 2. Repository Responsibilities

```
Repository Layer:
├── CRUD Operations (Create, Read, Update, Delete)
├── Query Building
├── Data Mapping (DB rows → TypeScript objects)
├── Parameter Validation
└── Database-specific logic
```

### 3. Better-sqlite3 Patterns

```typescript
// Prepared statements (recommended)
const stmt = db.prepare('SELECT * FROM users WHERE id = ?');
const user = stmt.get(userId);

// Run for INSERT/UPDATE/DELETE
const result = db.prepare('INSERT INTO users (name) VALUES (?)').run(name);
console.log(result.lastInsertRowid);  // Get inserted ID

// All for multiple rows
const users = db.prepare('SELECT * FROM users').all();
```

---

## 💻 Code to Type & Understand

### Step 1: User Repository

Create `src/repositories/userRepository.ts`:

```typescript
// ============================================
// User Repository - Database Operations
// ============================================

import db from '../config/database';
import { User, UserCreate, UserResponse } from '../models/types';

class UserRepository {
    /**
     * Find user by ID
     */
    findById(id: number): User | null {
        const stmt = db.prepare(`
            SELECT id, email, password_hash, name, created_at, updated_at
            FROM users
            WHERE id = ?
        `);
        
        const user = stmt.get(id) as User | undefined;
        return user || null;
    }

    /**
     * Find user by email
     */
    findByEmail(email: string): User | null {
        const stmt = db.prepare(`
            SELECT id, email, password_hash, name, created_at, updated_at
            FROM users
            WHERE email = ?
        `);
        
        const user = stmt.get(email.toLowerCase()) as User | undefined;
        return user || null;
    }

    /**
     * Create new user
     */
    create(userData: UserCreate & { password_hash: string }): User {
        const stmt = db.prepare(`
            INSERT INTO users (email, password_hash, name)
            VALUES (?, ?, ?)
        `);

        const result = stmt.run(
            userData.email.toLowerCase(),
            userData.password_hash,
            userData.name
        );

        const newUser = this.findById(result.lastInsertRowid as number);
        if (!newUser) {
            throw new Error('Failed to create user');
        }

        return newUser;
    }

    /**
     * Update user
     */
    update(id: number, updates: Partial<Pick<User, 'name' | 'email'>>): User | null {
        const user = this.findById(id);
        if (!user) return null;

        const fields: string[] = [];
        const values: any[] = [];

        if (updates.name !== undefined) {
            fields.push('name = ?');
            values.push(updates.name);
        }

        if (updates.email !== undefined) {
            fields.push('email = ?');
            values.push(updates.email.toLowerCase());
        }

        if (fields.length === 0) return user;

        fields.push('updated_at = datetime("now")');
        values.push(id);

        const stmt = db.prepare(`
            UPDATE users
            SET ${fields.join(', ')}
            WHERE id = ?
        `);

        stmt.run(...values);
        return this.findById(id);
    }

    /**
     * Update password
     */
    updatePassword(id: number, passwordHash: string): boolean {
        const stmt = db.prepare(`
            UPDATE users
            SET password_hash = ?, updated_at = datetime('now')
            WHERE id = ?
        `);

        const result = stmt.run(passwordHash, id);
        return result.changes > 0;
    }

    /**
     * Delete user
     */
    delete(id: number): boolean {
        const stmt = db.prepare('DELETE FROM users WHERE id = ?');
        const result = stmt.run(id);
        return result.changes > 0;
    }

    /**
     * Check if email exists
     */
    emailExists(email: string, excludeUserId?: number): boolean {
        let query = 'SELECT COUNT(*) as count FROM users WHERE email = ?';
        const params: any[] = [email.toLowerCase()];

        if (excludeUserId) {
            query += ' AND id != ?';
            params.push(excludeUserId);
        }

        const stmt = db.prepare(query);
        const result = stmt.get(...params) as { count: number };
        return result.count > 0;
    }

    /**
     * Get all users (admin function)
     */
    findAll(limit: number = 100, offset: number = 0): UserResponse[] {
        const stmt = db.prepare(`
            SELECT id, email, name, created_at
            FROM users
            ORDER BY created_at DESC
            LIMIT ? OFFSET ?
        `);

        return stmt.all(limit, offset) as UserResponse[];
    }

    /**
     * Count total users
     */
    count(): number {
        const stmt = db.prepare('SELECT COUNT(*) as count FROM users');
        const result = stmt.get() as { count: number };
        return result.count;
    }

    /**
     * Convert User to UserResponse (remove sensitive data)
     */
    toResponse(user: User): UserResponse {
        return {
            id: user.id,
            email: user.email,
            name: user.name,
            created_at: user.created_at
        };
    }
}

// Export singleton instance
export default new UserRepository();
```

### Step 2: Category Repository

Create `src/repositories/categoryRepository.ts`:

```typescript
// ============================================
// Category Repository - Database Operations
// ============================================

import db from '../config/database';
import { Category, CategoryCreate, CategoryType } from '../models/types';

class CategoryRepository {
    /**
     * Find category by ID
     */
    findById(id: number): Category | null {
        const stmt = db.prepare(`
            SELECT id, name, type, icon, user_id, created_at
            FROM categories
            WHERE id = ?
        `);

        const category = stmt.get(id) as Category | undefined;
        return category || null;
    }

    /**
     * Find all categories for a user (including defaults)
     */
    findByUserId(userId: number): Category[] {
        const stmt = db.prepare(`
            SELECT id, name, type, icon, user_id, created_at
            FROM categories
            WHERE user_id IS NULL OR user_id = ?
            ORDER BY 
                CASE WHEN user_id IS NULL THEN 0 ELSE 1 END,
                type,
                name
        `);

        return stmt.all(userId) as Category[];
    }

    /**
     * Find categories by type
     */
    findByType(userId: number, type: CategoryType): Category[] {
        const stmt = db.prepare(`
            SELECT id, name, type, icon, user_id, created_at
            FROM categories
            WHERE (user_id IS NULL OR user_id = ?)
              AND type = ?
            ORDER BY name
        `);

        return stmt.all(userId, type) as Category[];
    }

    /**
     * Find default categories only
     */
    findDefaults(): Category[] {
        const stmt = db.prepare(`
            SELECT id, name, type, icon, user_id, created_at
            FROM categories
            WHERE user_id IS NULL
            ORDER BY type, name
        `);

        return stmt.all() as Category[];
    }

    /**
     * Find user's custom categories only
     */
    findCustomByUserId(userId: number): Category[] {
        const stmt = db.prepare(`
            SELECT id, name, type, icon, user_id, created_at
            FROM categories
            WHERE user_id = ?
            ORDER BY type, name
        `);

        return stmt.all(userId) as Category[];
    }

    /**
     * Create new category
     */
    create(categoryData: CategoryCreate): Category {
        const stmt = db.prepare(`
            INSERT INTO categories (name, type, icon, user_id)
            VALUES (?, ?, ?, ?)
        `);

        const result = stmt.run(
            categoryData.name,
            categoryData.type,
            categoryData.icon || '📁',
            categoryData.user_id || null
        );

        const newCategory = this.findById(result.lastInsertRowid as number);
        if (!newCategory) {
            throw new Error('Failed to create category');
        }

        return newCategory;
    }

    /**
     * Update category
     */
    update(id: number, userId: number, updates: Partial<Pick<Category, 'name' | 'icon'>>): Category | null {
        // Only allow updating user's own categories
        const category = this.findById(id);
        if (!category || category.user_id !== userId) {
            return null;
        }

        const fields: string[] = [];
        const values: any[] = [];

        if (updates.name !== undefined) {
            fields.push('name = ?');
            values.push(updates.name);
        }

        if (updates.icon !== undefined) {
            fields.push('icon = ?');
            values.push(updates.icon);
        }

        if (fields.length === 0) return category;

        values.push(id);

        const stmt = db.prepare(`
            UPDATE categories
            SET ${fields.join(', ')}
            WHERE id = ?
        `);

        stmt.run(...values);
        return this.findById(id);
    }

    /**
     * Delete category (only user's custom categories)
     */
    delete(id: number, userId: number): boolean {
        // Check if category belongs to user
        const category = this.findById(id);
        if (!category || category.user_id !== userId) {
            return false;
        }

        // Check if category is in use
        const inUse = this.isCategoryInUse(id);
        if (inUse) {
            throw new Error('Cannot delete category that has transactions');
        }

        const stmt = db.prepare('DELETE FROM categories WHERE id = ? AND user_id = ?');
        const result = stmt.run(id, userId);
        return result.changes > 0;
    }

    /**
     * Check if category is used in any transactions
     */
    isCategoryInUse(categoryId: number): boolean {
        const stmt = db.prepare(`
            SELECT COUNT(*) as count
            FROM transactions
            WHERE category_id = ?
        `);

        const result = stmt.get(categoryId) as { count: number };
        return result.count > 0;
    }

    /**
     * Check if category name exists for user
     */
    nameExists(name: string, userId: number, excludeId?: number): boolean {
        let query = `
            SELECT COUNT(*) as count
            FROM categories
            WHERE name = ?
              AND (user_id IS NULL OR user_id = ?)
        `;
        const params: any[] = [name, userId];

        if (excludeId) {
            query += ' AND id != ?';
            params.push(excludeId);
        }

        const stmt = db.prepare(query);
        const result = stmt.get(...params) as { count: number };
        return result.count > 0;
    }

    /**
     * Validate category belongs to user (or is default)
     */
    validateCategoryAccess(categoryId: number, userId: number): boolean {
        const category = this.findById(categoryId);
        if (!category) return false;
        return category.user_id === null || category.user_id === userId;
    }
}

// Export singleton instance
export default new CategoryRepository();
```

### Step 3: Transaction Repository

Create `src/repositories/transactionRepository.ts`:

```typescript
// ============================================
// Transaction Repository - Database Operations
// ============================================

import db from '../config/database';
import {
    Transaction,
    TransactionCreate,
    TransactionUpdate,
    TransactionWithCategory,
    TransactionFilters,
    MonthlySummary,
    CategorySummary
} from '../models/types';

class TransactionRepository {
    /**
     * Find transaction by ID
     */
    findById(id: number, userId: number): TransactionWithCategory | null {
        const stmt = db.prepare(`
            SELECT 
                t.id, t.user_id, t.category_id, t.amount, 
                t.description, t.date, t.type, t.created_at, t.updated_at,
                c.name as category_name, c.icon as category_icon
            FROM transactions t
            JOIN categories c ON t.category_id = c.id
            WHERE t.id = ? AND t.user_id = ?
        `);

        const transaction = stmt.get(id, userId) as TransactionWithCategory | undefined;
        return transaction || null;
    }

    /**
     * Find all transactions for a user with filters
     */
    findByUserId(userId: number, filters: TransactionFilters = {}): TransactionWithCategory[] {
        const conditions: string[] = ['t.user_id = ?'];
        const params: any[] = [userId];

        if (filters.startDate) {
            conditions.push('t.date >= ?');
            params.push(filters.startDate);
        }

        if (filters.endDate) {
            conditions.push('t.date <= ?');
            params.push(filters.endDate);
        }

        if (filters.type) {
            conditions.push('t.type = ?');
            params.push(filters.type);
        }

        if (filters.categoryId) {
            conditions.push('t.category_id = ?');
            params.push(filters.categoryId);
        }

        const limit = filters.limit || 100;
        const offset = filters.offset || 0;

        const query = `
            SELECT 
                t.id, t.user_id, t.category_id, t.amount, 
                t.description, t.date, t.type, t.created_at, t.updated_at,
                c.name as category_name, c.icon as category_icon
            FROM transactions t
            JOIN categories c ON t.category_id = c.id
            WHERE ${conditions.join(' AND ')}
            ORDER BY t.date DESC, t.created_at DESC
            LIMIT ? OFFSET ?
        `;

        params.push(limit, offset);

        const stmt = db.prepare(query);
        return stmt.all(...params) as TransactionWithCategory[];
    }

    /**
     * Create new transaction
     */
    create(transactionData: TransactionCreate): TransactionWithCategory {
        const stmt = db.prepare(`
            INSERT INTO transactions (user_id, category_id, amount, description, date, type)
            VALUES (?, ?, ?, ?, ?, ?)
        `);

        const result = stmt.run(
            transactionData.user_id,
            transactionData.category_id,
            transactionData.amount,
            transactionData.description || '',
            transactionData.date,
            transactionData.type
        );

        const newTransaction = this.findById(
            result.lastInsertRowid as number,
            transactionData.user_id
        );

        if (!newTransaction) {
            throw new Error('Failed to create transaction');
        }

        return newTransaction;
    }

    /**
     * Update transaction
     */
    update(id: number, userId: number, updates: TransactionUpdate): TransactionWithCategory | null {
        const transaction = this.findById(id, userId);
        if (!transaction) return null;

        const fields: string[] = [];
        const values: any[] = [];

        if (updates.category_id !== undefined) {
            fields.push('category_id = ?');
            values.push(updates.category_id);
        }

        if (updates.amount !== undefined) {
            fields.push('amount = ?');
            values.push(updates.amount);
        }

        if (updates.description !== undefined) {
            fields.push('description = ?');
            values.push(updates.description);
        }

        if (updates.date !== undefined) {
            fields.push('date = ?');
            values.push(updates.date);
        }

        if (fields.length === 0) return transaction;

        fields.push('updated_at = datetime("now")');
        values.push(id, userId);

        const stmt = db.prepare(`
            UPDATE transactions
            SET ${fields.join(', ')}
            WHERE id = ? AND user_id = ?
        `);

        stmt.run(...values);
        return this.findById(id, userId);
    }

    /**
     * Delete transaction
     */
    delete(id: number, userId: number): boolean {
        const stmt = db.prepare('DELETE FROM transactions WHERE id = ? AND user_id = ?');
        const result = stmt.run(id, userId);
        return result.changes > 0;
    }

    /**
     * Get total count for user
     */
    countByUserId(userId: number, filters: TransactionFilters = {}): number {
        const conditions: string[] = ['user_id = ?'];
        const params: any[] = [userId];

        if (filters.startDate) {
            conditions.push('date >= ?');
            params.push(filters.startDate);
        }

        if (filters.endDate) {
            conditions.push('date <= ?');
            params.push(filters.endDate);
        }

        if (filters.type) {
            conditions.push('type = ?');
            params.push(filters.type);
        }

        const stmt = db.prepare(`
            SELECT COUNT(*) as count
            FROM transactions
            WHERE ${conditions.join(' AND ')}
        `);

        const result = stmt.get(...params) as { count: number };
        return result.count;
    }

    /**
     * Get summary (total income, expense, balance)
     */
    getSummary(userId: number, startDate?: string, endDate?: string): {
        totalIncome: number;
        totalExpense: number;
        balance: number;
        transactionCount: number;
    } {
        const conditions: string[] = ['user_id = ?'];
        const params: any[] = [userId];

        if (startDate) {
            conditions.push('date >= ?');
            params.push(startDate);
        }

        if (endDate) {
            conditions.push('date <= ?');
            params.push(endDate);
        }

        const stmt = db.prepare(`
            SELECT 
                COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0) as total_income,
                COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) as total_expense,
                COUNT(*) as transaction_count
            FROM transactions
            WHERE ${conditions.join(' AND ')}
        `);

        const result = stmt.get(...params) as {
            total_income: number;
            total_expense: number;
            transaction_count: number;
        };

        return {
            totalIncome: result.total_income,
            totalExpense: result.total_expense,
            balance: result.total_income - result.total_expense,
            transactionCount: result.transaction_count
        };
    }

    /**
     * Get monthly summary
     */
    getMonthlySummary(userId: number, months: number = 12): MonthlySummary[] {
        const stmt = db.prepare(`
            SELECT 
                strftime('%Y-%m', date) as month,
                COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0) as total_income,
                COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) as total_expense
            FROM transactions
            WHERE user_id = ?
              AND date >= date('now', '-' || ? || ' months')
            GROUP BY strftime('%Y-%m', date)
            ORDER BY month DESC
        `);

        const results = stmt.all(userId, months) as Array<{
            month: string;
            total_income: number;
            total_expense: number;
        }>;

        return results.map(row => ({
            month: row.month,
            total_income: row.total_income,
            total_expense: row.total_expense,
            balance: row.total_income - row.total_expense
        }));
    }

    /**
     * Get summary by category
     */
    getCategorySummary(
        userId: number,
        type: 'income' | 'expense',
        startDate?: string,
        endDate?: string
    ): CategorySummary[] {
        const conditions: string[] = ['t.user_id = ?', 't.type = ?'];
        const params: any[] = [userId, type];

        if (startDate) {
            conditions.push('t.date >= ?');
            params.push(startDate);
        }

        if (endDate) {
            conditions.push('t.date <= ?');
            params.push(endDate);
        }

        const stmt = db.prepare(`
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
        `);

        const results = stmt.all(...params) as Array<{
            category_id: number;
            category_name: string;
            category_icon: string;
            total: number;
        }>;

        // Calculate percentages
        const grandTotal = results.reduce((sum, row) => sum + row.total, 0);

        return results.map(row => ({
            category_id: row.category_id,
            category_name: row.category_name,
            category_icon: row.category_icon,
            total: row.total,
            percentage: grandTotal > 0 ? (row.total / grandTotal) * 100 : 0
        }));
    }

    /**
     * Get recent transactions
     */
    getRecent(userId: number, limit: number = 5): TransactionWithCategory[] {
        return this.findByUserId(userId, { limit });
    }

    /**
     * Delete all transactions for a user
     */
    deleteAllByUserId(userId: number): number {
        const stmt = db.prepare('DELETE FROM transactions WHERE user_id = ?');
        const result = stmt.run(userId);
        return result.changes;
    }
}

// Export singleton instance
export default new TransactionRepository();
```

### Step 4: Repository Index

Create `src/repositories/index.ts`:

```typescript
// ============================================
// Repository Exports
// ============================================

export { default as userRepository } from './userRepository';
export { default as categoryRepository } from './categoryRepository';
export { default as transactionRepository } from './transactionRepository';
```

### Step 5: Test Repositories

Create `src/test-repositories.ts` (temporary test file):

```typescript
// ============================================
// Test Repositories (Run with: npx ts-node src/test-repositories.ts)
// ============================================

import dotenv from 'dotenv';
dotenv.config();

import { userRepository, categoryRepository, transactionRepository } from './repositories';
import bcrypt from 'bcryptjs';

async function testRepositories() {
    console.log('🧪 Testing Repositories...\n');

    // Test User Repository
    console.log('📝 Testing UserRepository...');
    
    const passwordHash = await bcrypt.hash('testpassword123', 10);
    const testUser = userRepository.create({
        email: 'test@example.com',
        password: 'testpassword123',
        name: 'Test User',
        password_hash: passwordHash
    });
    console.log('Created user:', userRepository.toResponse(testUser));

    const foundUser = userRepository.findByEmail('test@example.com');
    console.log('Found by email:', foundUser ? 'Yes' : 'No');

    // Test Category Repository
    console.log('\n📝 Testing CategoryRepository...');
    
    const categories = categoryRepository.findByUserId(testUser.id);
    console.log(`Found ${categories.length} categories for user`);

    const incomeCategories = categoryRepository.findByType(testUser.id, 'income');
    console.log(`Found ${incomeCategories.length} income categories`);

    const customCategory = categoryRepository.create({
        name: 'Side Hustle',
        type: 'income',
        icon: '🚀',
        user_id: testUser.id
    });
    console.log('Created custom category:', customCategory.name);

    // Test Transaction Repository
    console.log('\n📝 Testing TransactionRepository...');

    const transaction = transactionRepository.create({
        user_id: testUser.id,
        category_id: categories[0].id,
        amount: 5000,
        description: 'Monthly salary',
        date: new Date().toISOString().split('T')[0],
        type: 'income'
    });
    console.log('Created transaction:', transaction.id);

    const summary = transactionRepository.getSummary(testUser.id);
    console.log('Summary:', summary);

    // Cleanup
    console.log('\n🧹 Cleaning up...');
    transactionRepository.delete(transaction.id, testUser.id);
    categoryRepository.delete(customCategory.id, testUser.id);
    userRepository.delete(testUser.id);
    console.log('Cleanup complete!');

    console.log('\n✅ All repository tests passed!');
}

testRepositories().catch(console.error);
```

---

## ✍️ Exercises

### Exercise 1: Add Search to Transaction Repository
Add a `search` method to TransactionRepository that:
- Searches transactions by description
- Uses SQL LIKE for partial matching
- Returns results ordered by relevance (exact match first)

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

### Q1: Prepared Statements
Why do we use prepared statements (`db.prepare()`) instead of string concatenation for SQL queries?

**Your Answer**: 


### Q2: Singleton Pattern
Why do we export repository instances as singletons (`export default new UserRepository()`)?

**Your Answer**: 


### Q3: Null Handling
In the CategoryRepository, why do we check for `user_id IS NULL OR user_id = ?` when finding categories?

**Your Answer**: 


---

## 📝 Bonus Questions (Optional)

### B1: What is the difference between `stmt.get()` and `stmt.all()` in better-sqlite3?

**Your Answer**: 


### B2: How would you implement soft delete (marking as deleted instead of removing) in the repositories?

**Your Answer**: 


---

## ✅ Day 27 Checklist

- [ ] Understand the repository pattern
- [ ] Create UserRepository with all methods
- [ ] Create CategoryRepository with all methods
- [ ] Create TransactionRepository with all methods
- [ ] Implement filtering and pagination
- [ ] Implement summary and report methods
- [ ] Test all repositories
- [ ] Complete Exercise 1 (Search)
- [ ] Complete Exercise 2 (Bulk Operations)
- [ ] Complete Exercise 3 (Statistics)
- [ ] Answer all quiz questions

---

## 🔗 Next Day Preview
Tomorrow you'll implement the **Service Layer** - AuthService, TransactionService, and ReportService with business logic and validation.
