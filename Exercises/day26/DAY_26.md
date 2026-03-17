# Day 26: Project Setup & Database Design

## 📚 What to Learn Today
- **Topics**: Finance Tracker project setup, database schema design
- **Time**: ~40 minutes reading, ~45 minutes practice
- **Goal**: Set up the complete project structure and design the database

---

## 📖 Key Concepts

### 1. Project Overview
We're building a **Personal Finance Tracker** - a full-stack application to manage income and expenses.

```
Finance Tracker Features:
┌─────────────────────────────────────────────┐
│ 🔐 Authentication (Register/Login)          │
│ 💰 Track Income                             │
│ 💸 Track Expenses                           │
│ 📁 Categorize Transactions                  │
│ 📊 View Reports & Charts                    │
│ 📅 Filter by Date Range                     │
└─────────────────────────────────────────────┘
```

### 2. Tech Stack

```
Backend:
├── Node.js + Express
├── TypeScript
├── SQLite (Database)
├── JWT (Authentication)
└── bcrypt (Password hashing)

Frontend:
├── React + TypeScript
├── React Router
├── Recharts (Charts)
└── CSS Modules
```

### 3. Database Schema Design

```
┌──────────────────┐     ┌──────────────────┐
│      users       │     │    categories    │
├──────────────────┤     ├──────────────────┤
│ id (PK)          │     │ id (PK)          │
│ email            │     │ name             │
│ password_hash    │     │ type (income/    │
│ name             │     │       expense)   │
│ created_at       │     │ icon             │
│ updated_at       │     │ user_id (FK)     │
└────────┬─────────┘     └────────┬─────────┘
         │                        │
         │    ┌───────────────────┘
         │    │
         ▼    ▼
┌──────────────────┐
│   transactions   │
├──────────────────┤
│ id (PK)          │
│ user_id (FK)     │
│ category_id (FK) │
│ amount           │
│ description      │
│ date             │
│ type             │
│ created_at       │
│ updated_at       │
└──────────────────┘
```

### 4. Project Structure

```
finance-tracker/
├── src/
│   ├── config/
│   │   └── database.ts
│   ├── controllers/
│   │   ├── authController.ts
│   │   ├── transactionController.ts
│   │   └── categoryController.ts
│   ├── middleware/
│   │   ├── auth.ts
│   │   └── errorHandler.ts
│   ├── models/
│   │   └── types.ts
│   ├── repositories/
│   │   ├── userRepository.ts
│   │   ├── transactionRepository.ts
│   │   └── categoryRepository.ts
│   ├── routes/
│   │   ├── authRoutes.ts
│   │   ├── transactionRoutes.ts
│   │   └── categoryRoutes.ts
│   ├── services/
│   │   ├── authService.ts
│   │   ├── transactionService.ts
│   │   └── reportService.ts
│   ├── utils/
│   │   └── helpers.ts
│   └── index.ts
├── migrations/
│   └── 001_initial_schema.sql
├── package.json
├── tsconfig.json
└── .env
```

---

## 💻 Code to Type & Understand

### Step 1: Initialize Project

```bash
# Create project directory
mkdir finance-tracker-backend
cd finance-tracker-backend

# Initialize npm
npm init -y

# Install dependencies
npm install express better-sqlite3 bcryptjs jsonwebtoken dotenv cors
npm install -D typescript @types/node @types/express @types/better-sqlite3 @types/bcryptjs @types/jsonwebtoken @types/cors ts-node nodemon
```

### Step 2: TypeScript Configuration

Create `tsconfig.json`:

```json
{
    "compilerOptions": {
        "target": "ES2020",
        "module": "commonjs",
        "lib": ["ES2020"],
        "outDir": "./dist",
        "rootDir": "./src",
        "strict": true,
        "esModuleInterop": true,
        "skipLibCheck": true,
        "forceConsistentCasingInFileNames": true,
        "resolveJsonModule": true,
        "declaration": true,
        "declarationMap": true,
        "sourceMap": true
    },
    "include": ["src/**/*"],
    "exclude": ["node_modules", "dist"]
}
```

### Step 3: Package.json Scripts

Update `package.json`:

```json
{
    "name": "finance-tracker-backend",
    "version": "1.0.0",
    "description": "Personal Finance Tracker API",
    "main": "dist/index.js",
    "scripts": {
        "dev": "nodemon --exec ts-node src/index.ts",
        "build": "tsc",
        "start": "node dist/index.js",
        "migrate": "ts-node src/config/migrate.ts"
    },
    "keywords": ["finance", "tracker", "api"],
    "author": "",
    "license": "ISC"
}
```

### Step 4: Environment Variables

Create `.env`:

```env
PORT=3000
JWT_SECRET=your-super-secret-key-change-in-production
JWT_EXPIRES_IN=7d
DATABASE_PATH=./data/finance.db
```

### Step 5: Type Definitions

Create `src/models/types.ts`:

```typescript
// ============================================
// Type Definitions for Finance Tracker
// ============================================

// User types
export interface User {
    id: number;
    email: string;
    password_hash: string;
    name: string;
    created_at: string;
    updated_at: string;
}

export interface UserCreate {
    email: string;
    password: string;
    name: string;
}

export interface UserResponse {
    id: number;
    email: string;
    name: string;
    created_at: string;
}

// Category types
export type CategoryType = 'income' | 'expense';

export interface Category {
    id: number;
    name: string;
    type: CategoryType;
    icon: string;
    user_id: number | null;  // null for default categories
    created_at: string;
}

export interface CategoryCreate {
    name: string;
    type: CategoryType;
    icon: string;
    user_id?: number;
}

// Transaction types
export interface Transaction {
    id: number;
    user_id: number;
    category_id: number;
    amount: number;
    description: string;
    date: string;
    type: CategoryType;
    created_at: string;
    updated_at: string;
}

export interface TransactionCreate {
    user_id: number;
    category_id: number;
    amount: number;
    description: string;
    date: string;
    type: CategoryType;
}

export interface TransactionUpdate {
    category_id?: number;
    amount?: number;
    description?: string;
    date?: string;
}

export interface TransactionWithCategory extends Transaction {
    category_name: string;
    category_icon: string;
}

// Report types
export interface MonthlySummary {
    month: string;
    total_income: number;
    total_expense: number;
    balance: number;
}

export interface CategorySummary {
    category_id: number;
    category_name: string;
    category_icon: string;
    total: number;
    percentage: number;
}

// Auth types
export interface LoginCredentials {
    email: string;
    password: string;
}

export interface AuthResponse {
    user: UserResponse;
    token: string;
}

export interface JWTPayload {
    userId: number;
    email: string;
}

// API Response types
export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}

// Query filters
export interface TransactionFilters {
    startDate?: string;
    endDate?: string;
    type?: CategoryType;
    categoryId?: number;
    limit?: number;
    offset?: number;
}
```

### Step 6: Database Configuration

Create `src/config/database.ts`:

```typescript
// ============================================
// Database Configuration
// ============================================

import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

// Ensure data directory exists
const dataDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

// Database path from environment or default
const dbPath = process.env.DATABASE_PATH || './data/finance.db';

// Create database connection
const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Export database instance
export default db;

// Helper to run migrations
export function runMigration(sql: string): void {
    db.exec(sql);
}

// Close database connection
export function closeDatabase(): void {
    db.close();
}
```

### Step 7: Migration File

Create `migrations/001_initial_schema.sql`:

```sql
-- ============================================
-- Initial Database Schema
-- ============================================

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    name TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
    icon TEXT DEFAULT '📁',
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    created_at TEXT DEFAULT (datetime('now')),
    UNIQUE(name, user_id)
);

-- Transactions table
CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    category_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
    amount REAL NOT NULL CHECK (amount > 0),
    description TEXT,
    date TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
);

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(type);
CREATE INDEX IF NOT EXISTS idx_transactions_category ON transactions(category_id);

-- Insert default categories (user_id = NULL means global/default)
INSERT OR IGNORE INTO categories (name, type, icon, user_id) VALUES
    -- Income categories
    ('Salary', 'income', '💼', NULL),
    ('Freelance', 'income', '💻', NULL),
    ('Investment', 'income', '📈', NULL),
    ('Gift', 'income', '🎁', NULL),
    ('Other Income', 'income', '💰', NULL),
    
    -- Expense categories
    ('Food & Dining', 'expense', '🍔', NULL),
    ('Transportation', 'expense', '🚗', NULL),
    ('Shopping', 'expense', '🛒', NULL),
    ('Entertainment', 'expense', '🎬', NULL),
    ('Bills & Utilities', 'expense', '📱', NULL),
    ('Healthcare', 'expense', '🏥', NULL),
    ('Education', 'expense', '📚', NULL),
    ('Travel', 'expense', '✈️', NULL),
    ('Other Expense', 'expense', '💸', NULL);
```

### Step 8: Migration Runner

Create `src/config/migrate.ts`:

```typescript
// ============================================
// Database Migration Runner
// ============================================

import fs from 'fs';
import path from 'path';
import db, { runMigration, closeDatabase } from './database';

async function migrate(): Promise<void> {
    console.log('🚀 Starting database migration...\n');

    const migrationsDir = path.join(process.cwd(), 'migrations');
    
    // Check if migrations directory exists
    if (!fs.existsSync(migrationsDir)) {
        console.error('❌ Migrations directory not found!');
        process.exit(1);
    }

    // Get all SQL files sorted by name
    const migrationFiles = fs.readdirSync(migrationsDir)
        .filter(file => file.endsWith('.sql'))
        .sort();

    if (migrationFiles.length === 0) {
        console.log('📭 No migration files found.');
        return;
    }

    // Create migrations tracking table
    db.exec(`
        CREATE TABLE IF NOT EXISTS migrations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT UNIQUE NOT NULL,
            executed_at TEXT DEFAULT (datetime('now'))
        )
    `);

    // Get already executed migrations
    const executed = db.prepare('SELECT name FROM migrations').all() as { name: string }[];
    const executedNames = new Set(executed.map(m => m.name));

    // Run pending migrations
    for (const file of migrationFiles) {
        if (executedNames.has(file)) {
            console.log(`⏭️  Skipping ${file} (already executed)`);
            continue;
        }

        console.log(`📝 Running ${file}...`);
        
        try {
            const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf-8');
            runMigration(sql);
            
            // Record migration
            db.prepare('INSERT INTO migrations (name) VALUES (?)').run(file);
            
            console.log(`✅ ${file} completed successfully`);
        } catch (error) {
            console.error(`❌ Error running ${file}:`, error);
            process.exit(1);
        }
    }

    console.log('\n🎉 All migrations completed!');
}

// Run migrations
migrate()
    .then(() => {
        closeDatabase();
        process.exit(0);
    })
    .catch((error) => {
        console.error('Migration failed:', error);
        closeDatabase();
        process.exit(1);
    });
```

### Step 9: Basic Express Server

Create `src/index.ts`:

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

// Create Express app
const app: Express = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Request logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
    res.json({
        success: true,
        message: 'Finance Tracker API is running!',
        timestamp: new Date().toISOString()
    });
});

// API info endpoint
app.get('/api', (req: Request, res: Response) => {
    res.json({
        success: true,
        data: {
            name: 'Finance Tracker API',
            version: '1.0.0',
            endpoints: {
                auth: {
                    register: 'POST /api/auth/register',
                    login: 'POST /api/auth/login',
                    profile: 'GET /api/auth/profile'
                },
                transactions: {
                    list: 'GET /api/transactions',
                    create: 'POST /api/transactions',
                    get: 'GET /api/transactions/:id',
                    update: 'PUT /api/transactions/:id',
                    delete: 'DELETE /api/transactions/:id'
                },
                categories: {
                    list: 'GET /api/categories',
                    create: 'POST /api/categories'
                },
                reports: {
                    summary: 'GET /api/reports/summary',
                    monthly: 'GET /api/reports/monthly',
                    byCategory: 'GET /api/reports/by-category'
                }
            }
        }
    });
});

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

### Step 10: Test the Setup

```bash
# Run migration
npm run migrate

# Start development server
npm run dev

# Test endpoints (in another terminal)
curl http://localhost:3000/health
curl http://localhost:3000/api
```

---

## ✍️ Exercises

### Exercise 1: Add More Default Categories
Modify `migrations/001_initial_schema.sql` to add:
- At least 3 more income categories (e.g., Rental Income, Dividends, Bonus)
- At least 3 more expense categories (e.g., Insurance, Subscriptions, Pets)

### Exercise 2: Create a Reset Migration
Create `migrations/002_add_notes_column.sql` that:
- Adds a `notes` column to the transactions table
- Adds a `color` column to the categories table
- Make sure it's idempotent (can run multiple times safely)

### Exercise 3: Environment Configuration
Create a `src/config/env.ts` file that:
- Validates all required environment variables
- Provides typed access to configuration
- Throws helpful errors if required variables are missing

---

## ❓ Quiz Questions

### Q1: Why SQLite?
Why are we using SQLite for this project instead of PostgreSQL or MySQL?

**Your Answer**: 


### Q2: Foreign Keys
What does `ON DELETE CASCADE` mean in the foreign key definition?

**Your Answer**: 


### Q3: Database Indexes
Why do we create indexes on columns like `user_id` and `date` in the transactions table?

**Your Answer**: 


---

## 📝 Bonus Questions (Optional)

### B1: What is the purpose of the `CHECK` constraint in the schema (e.g., `CHECK (amount > 0)`)?

**Your Answer**: 


### B2: Why do we use `INSERT OR IGNORE` for the default categories?

**Your Answer**: 


---

## ✅ Day 26 Checklist

- [ ] Understand the project requirements
- [ ] Set up project structure
- [ ] Configure TypeScript
- [ ] Create type definitions
- [ ] Design database schema
- [ ] Create migration file
- [ ] Set up database connection
- [ ] Create migration runner
- [ ] Set up basic Express server
- [ ] Run migrations successfully
- [ ] Test health endpoint
- [ ] Complete Exercise 1 (Categories)
- [ ] Complete Exercise 2 (Migration)
- [ ] Complete Exercise 3 (Environment)
- [ ] Answer all quiz questions

---

## 🔗 Next Day Preview
Tomorrow you'll implement the **Repository Layer** - creating UserRepository, TransactionRepository, and CategoryRepository with all CRUD operations.
