# Day 26: Project Setup & Database Design

## 📚 What to Learn Today
- **Reference**: [LEARNING_MODULE.md](../../Modules/LEARNING_MODULE.md) - Module 3 & 4
- **Topics**: Finance Tracker project setup, Docker, PostgreSQL, Fastify, Sequelize
- **Time**: ~45 minutes reading, ~45 minutes practice
- **Goal**: Set up the complete project structure with production-ready stack

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

### 2. Tech Stack (Production-Ready)

```
Backend:
├── Node.js + Fastify (Web Framework)
├── TypeScript
├── PostgreSQL (Database)
├── Sequelize (ORM - Raw SQL)
├── Docker (Containerization)
├── JWT (Authentication)
└── bcrypt (Password hashing)

Frontend:
├── React + TypeScript
├── React Router
├── Recharts (Charts)
└── Tailwind CSS (Styling)
```

### 3. Why This Stack?

| Technology | Why We Use It |
|------------|---------------|
| **Fastify** | Fast, TypeScript-friendly, plugin ecosystem |
| **PostgreSQL** | Production-grade, powerful SQL features |
| **Docker** | Consistent environment, easy setup |
| **Sequelize** | Raw SQL with safety (parameterized queries) |
| **Tailwind CSS** | Utility-first, rapid UI development |

### 4. Database Schema Design

```
┌──────────────────┐     ┌──────────────────┐
│      users       │     │    categories    │
├──────────────────┤     ├──────────────────┤
│ id (UUID, PK)    │     │ id (UUID, PK)    │
│ email            │     │ name             │
│ password         │     │ type (income/    │
│ full_name        │     │       expense)   │
│ email_verified   │     │ icon             │
│ created_at       │     │ user_id (FK)     │
│ updated_at       │     │ created_at       │
└────────┬─────────┘     └────────┬─────────┘
         │                        │
         │    ┌───────────────────┘
         │    │
         ▼    ▼
┌──────────────────┐
│   transactions   │
├──────────────────┤
│ id (UUID, PK)    │
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

### 5. Project Structure

```
finance-tracker/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.ts
│   │   ├── api/
│   │   │   └── v1/
│   │   │       ├── controllers/
│   │   │       │   ├── auth.controller.ts
│   │   │       │   ├── transaction.controller.ts
│   │   │       │   └── category.controller.ts
│   │   │       ├── services/
│   │   │       │   ├── auth.service.ts
│   │   │       │   ├── transaction.service.ts
│   │   │       │   └── report.service.ts
│   │   │       └── repositories/
│   │   │           ├── user.repository.ts
│   │   │           ├── transaction.repository.ts
│   │   │           └── category.repository.ts
│   │   ├── types/
│   │   │   └── index.ts
│   │   └── index.ts
│   ├── db/
│   │   └── migrations/
│   │       ├── 001-create-users-table.js
│   │       ├── 002-create-categories-table.js
│   │       └── 003-create-transactions-table.js
│   ├── docker-compose.yml
│   ├── package.json
│   ├── tsconfig.json
│   └── .env
└── frontend/
    └── (Day 31+)
```

---

## 💻 Code to Type & Understand

### Step 1: Initialize Project

```bash
# Create project directory
mkdir finance-tracker
cd finance-tracker
mkdir backend
cd backend

# Initialize npm
npm init -y

# Install dependencies
npm install fastify @fastify/cors @fastify/swagger @fastify/swagger-ui sequelize pg pg-hstore bcryptjs jsonwebtoken dotenv

# Install dev dependencies
npm install -D typescript @types/node @types/bcryptjs @types/jsonwebtoken ts-node nodemon sequelize-cli
```

### Step 2: TypeScript Configuration

Create `tsconfig.json`:

```json
{
    "compilerOptions": {
        "target": "ES2022",
        "module": "NodeNext",
        "moduleResolution": "NodeNext",
        "lib": ["ES2022"],
        "outDir": "./dist",
        "rootDir": "./src",
        "strict": true,
        "esModuleInterop": true,
        "skipLibCheck": true,
        "forceConsistentCasingInFileNames": true,
        "resolveJsonModule": true,
        "declaration": true,
        "declarationMap": true,
        "sourceMap": true,
        "baseUrl": ".",
        "paths": {
            "@/*": ["src/*"]
        }
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
    "type": "module",
    "main": "dist/index.js",
    "scripts": {
        "dev": "nodemon --exec node --loader ts-node/esm src/index.ts",
        "build": "tsc",
        "start": "node dist/index.js",
        "db:migrate": "npx sequelize-cli db:migrate",
        "db:migrate:undo": "npx sequelize-cli db:migrate:undo",
        "db:seed": "npx sequelize-cli db:seed:all"
    },
    "keywords": ["finance", "tracker", "api", "fastify"],
    "author": "",
    "license": "ISC"
}
```

### Step 4: Docker Compose for PostgreSQL

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    container_name: finance-tracker-db
    environment:
      POSTGRES_USER: finance_user
      POSTGRES_PASSWORD: finance_password
      POSTGRES_DB: finance_tracker
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U finance_user -d finance_tracker"]
      interval: 5s
      timeout: 5s
      retries: 5

volumes:
  postgres_data:
```

**Start PostgreSQL:**
```bash
docker-compose up -d
```

### Step 5: Environment Variables

Create `.env`:

```env
# Server
PORT=3000
HOST=0.0.0.0

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=finance_tracker
DB_USER=finance_user
DB_PASSWORD=finance_password

# JWT
JWT_SECRET=your-super-secret-key-change-in-production-minimum-32-chars
JWT_EXPIRES_IN=7d
```

Create `.env.example` (for sharing):

```env
# Server
PORT=3000
HOST=0.0.0.0

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=finance_tracker
DB_USER=your_db_user
DB_PASSWORD=your_db_password

# JWT
JWT_SECRET=your-secret-key-minimum-32-characters
JWT_EXPIRES_IN=7d
```

### Step 6: Database Configuration

Create `src/config/database.ts`:

```typescript
// ============================================
// Database Configuration - Sequelize + PostgreSQL
// ============================================

import { Sequelize } from 'sequelize'
import dotenv from 'dotenv'

dotenv.config()

const sequelize = new Sequelize({
    dialect: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USER || 'finance_user',
    password: process.env.DB_PASSWORD || 'finance_password',
    database: process.env.DB_NAME || 'finance_tracker',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
})

export default sequelize
```

### Step 7: Type Definitions

Create `src/types/index.ts`:

```typescript
// ============================================
// Type Definitions for Finance Tracker
// ============================================

// User types
export interface User {
    id: string;
    email: string;
    password: string;
    full_name: string;
    email_verified: boolean;
    created_at: Date;
    updated_at: Date;
}

export interface UserCreate {
    email: string;
    password: string;
    full_name: string;
}

export interface UserResponse {
    id: string;
    email: string;
    full_name: string;
    email_verified: boolean;
    created_at: Date;
}

// Category types
export type CategoryType = 'income' | 'expense';

export interface Category {
    id: string;
    name: string;
    type: CategoryType;
    icon: string;
    user_id: string | null;
    created_at: Date;
}

export interface CategoryCreate {
    name: string;
    type: CategoryType;
    icon: string;
    user_id?: string;
}

// Transaction types
export interface Transaction {
    id: string;
    user_id: string;
    category_id: string;
    amount: number;
    description: string;
    date: string;
    type: CategoryType;
    created_at: Date;
    updated_at: Date;
}

export interface TransactionCreate {
    user_id: string;
    category_id: string;
    amount: number;
    description: string;
    date: string;
    type: CategoryType;
}

export interface TransactionUpdate {
    category_id?: string;
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
    category_id: string;
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
    userId: string;
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
    categoryId?: string;
    limit?: number;
    offset?: number;
}
```

### Step 8: Sequelize CLI Configuration

Create `.sequelizerc` in backend root:

```javascript
const path = require('path');

module.exports = {
    'config': path.resolve('db', 'config.js'),
    'migrations-path': path.resolve('db', 'migrations'),
    'seeders-path': path.resolve('db', 'seeders'),
};
```

Create `db/config.js`:

```javascript
require('dotenv').config();

module.exports = {
    development: {
        username: process.env.DB_USER || 'finance_user',
        password: process.env.DB_PASSWORD || 'finance_password',
        database: process.env.DB_NAME || 'finance_tracker',
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432'),
        dialect: 'postgres'
    },
    production: {
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT || '5432'),
        dialect: 'postgres'
    }
};
```

### Step 9: Migration Files

Create `db/migrations/001-create-users-table.js`:

```javascript
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        // Enable uuid-ossp extension
        await queryInterface.sequelize.query(`
            CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
        `);

        // Create users table
        await queryInterface.sequelize.query(`
            CREATE TABLE users (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                full_name VARCHAR(100) NOT NULL,
                email VARCHAR(100) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                email_verified BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // Create index on email
        await queryInterface.sequelize.query(`
            CREATE INDEX idx_users_email ON users(email);
        `);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.sequelize.query(`
            DROP TABLE IF EXISTS users;
        `);
    }
};
```

Create `db/migrations/002-create-categories-table.js`:

```javascript
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        // Create categories table
        await queryInterface.sequelize.query(`
            CREATE TABLE categories (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                name VARCHAR(50) NOT NULL,
                type VARCHAR(10) NOT NULL CHECK (type IN ('income', 'expense')),
                icon VARCHAR(10) DEFAULT '📁',
                user_id UUID REFERENCES users(id) ON DELETE CASCADE,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(name, user_id)
            );
        `);

        // Insert default categories
        await queryInterface.sequelize.query(`
            INSERT INTO categories (name, type, icon, user_id) VALUES
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
        `);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.sequelize.query(`
            DROP TABLE IF EXISTS categories;
        `);
    }
};
```

Create `db/migrations/003-create-transactions-table.js`:

```javascript
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        // Create transactions table
        await queryInterface.sequelize.query(`
            CREATE TABLE transactions (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                category_id UUID NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
                amount DECIMAL(12, 2) NOT NULL CHECK (amount > 0),
                description TEXT,
                date DATE NOT NULL,
                type VARCHAR(10) NOT NULL CHECK (type IN ('income', 'expense')),
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // Create indexes for common queries
        await queryInterface.sequelize.query(`
            CREATE INDEX idx_transactions_user_id ON transactions(user_id);
            CREATE INDEX idx_transactions_date ON transactions(date);
            CREATE INDEX idx_transactions_type ON transactions(type);
            CREATE INDEX idx_transactions_category ON transactions(category_id);
        `);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.sequelize.query(`
            DROP TABLE IF EXISTS transactions;
        `);
    }
};
```

### Step 10: Fastify Server Entry Point

Create `src/index.ts`:

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

dotenv.config()

const app = Fastify({
    logger: true
})

// Register CORS
await app.register(cors, {
    origin: true
})

// Register Swagger documentation
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
    routePrefix: '/documentation',
    uiConfig: {
        docExpansion: 'list',
        deepLinking: false
    }
})

// Initialize database connection
try {
    await sequelize.authenticate()
    console.log('✅ Database connection established successfully.')
} catch (error) {
    console.error('❌ Unable to connect to the database:', error)
    process.exit(1)
}

// Health check endpoint
app.get('/health', async (request, reply) => {
    return {
        success: true,
        message: 'Finance Tracker API is running!',
        timestamp: new Date().toISOString()
    }
})

// API info endpoint
app.get('/api', async (request, reply) => {
    return {
        success: true,
        data: {
            name: 'Finance Tracker API',
            version: '1.0.0',
            documentation: '/documentation',
            endpoints: {
                auth: {
                    register: 'POST /api/v1/auth/register',
                    login: 'POST /api/v1/auth/login',
                    profile: 'GET /api/v1/auth/profile'
                },
                transactions: {
                    list: 'GET /api/v1/transactions',
                    create: 'POST /api/v1/transactions',
                    get: 'GET /api/v1/transactions/:id',
                    update: 'PUT /api/v1/transactions/:id',
                    delete: 'DELETE /api/v1/transactions/:id'
                },
                categories: {
                    list: 'GET /api/v1/categories',
                    create: 'POST /api/v1/categories'
                },
                reports: {
                    summary: 'GET /api/v1/reports/summary',
                    monthly: 'GET /api/v1/reports/monthly',
                    byCategory: 'GET /api/v1/reports/by-category'
                }
            }
        }
    }
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

### Step 11: Test the Setup

```bash
# 1. Start PostgreSQL with Docker
docker-compose up -d

# 2. Wait for database to be ready (check with)
docker-compose logs postgres

# 3. Run migrations
npm run db:migrate

# 4. Start development server
npm run dev

# 5. Test endpoints (in another terminal)
curl http://localhost:3000/health
curl http://localhost:3000/api

# 6. Open Swagger documentation
# Visit: http://localhost:3000/documentation
```

---

## ✍️ Exercises

### Exercise 1: Add More Default Categories
Modify `db/migrations/002-create-categories-table.js` to add:
- At least 3 more income categories (e.g., Rental Income, Dividends, Bonus)
- At least 3 more expense categories (e.g., Insurance, Subscriptions, Pets)

### Exercise 2: Create Environment Validator
Create a `src/config/env.ts` file that:
- Validates all required environment variables on startup
- Provides typed access to configuration
- Throws helpful errors if required variables are missing

```typescript
// Example structure
export const config = {
    port: validateNumber('PORT', 3000),
    db: {
        host: validateString('DB_HOST', 'localhost'),
        // ... more
    },
    jwt: {
        secret: validateRequired('JWT_SECRET'),
        // ... more
    }
}
```

### Exercise 3: Add Database Health Check
Modify the `/health` endpoint to also check database connectivity:
- Return database status (connected/disconnected)
- Include response time for database ping

---

## ❓ Quiz Questions

### Q1: Why Docker for PostgreSQL?
Why do we use Docker to run PostgreSQL instead of installing it directly on our machine?

**Your Answer**: 


### Q2: UUID vs Auto-increment
Why do we use UUID for primary keys instead of auto-incrementing integers?

**Your Answer**: 


### Q3: Sequelize Raw SQL
In the LEARNING_MODULE, we use `sequelize.query()` with raw SQL instead of Sequelize models. What are the advantages of this approach?

**Your Answer**: 


---

## 📝 Bonus Questions (Optional)

### B1: What does `ON DELETE CASCADE` mean in the foreign key definition?

**Your Answer**: 


### B2: Why do we create indexes on columns like `user_id` and `date`?

**Your Answer**: 


---

## ✅ Day 26 Checklist

- [ ] Understand the project requirements and tech stack
- [ ] Set up project structure
- [ ] Configure TypeScript with ES modules
- [ ] Create Docker Compose for PostgreSQL
- [ ] Set up environment variables
- [ ] Configure Sequelize database connection
- [ ] Create type definitions
- [ ] Create migration files (users, categories, transactions)
- [ ] Set up Fastify server with CORS and Swagger
- [ ] Run migrations successfully
- [ ] Test health endpoint
- [ ] Access Swagger documentation
- [ ] Complete Exercise 1 (Categories)
- [ ] Complete Exercise 2 (Environment Validator)
- [ ] Complete Exercise 3 (Health Check)
- [ ] Answer all quiz questions

---

## 🔗 Next Day Preview
Tomorrow you'll implement the **Repository Layer** - creating UserRepository, TransactionRepository, and CategoryRepository using Sequelize raw SQL queries (matching the LEARNING_MODULE pattern).
