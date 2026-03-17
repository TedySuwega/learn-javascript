# Day 8: SQL Operations

## 📚 What to Learn Today
- **Read**: [LEARNING_MODULE.md](../../Modules/LEARNING_MODULE.md) - Module 4 (Lines 1351-1621)
- **Time**: ~35 minutes reading, ~25 minutes practice
- **Topics**: SELECT, INSERT, UPDATE, DELETE, migrations

---

## 📖 Key Concepts

### 1. The Four Basic SQL Operations (CRUD)

| Operation | SQL Command | Purpose |
|-----------|-------------|---------|
| **C**reate | INSERT | Add new data |
| **R**ead | SELECT | Retrieve data |
| **U**pdate | UPDATE | Modify existing data |
| **D**elete | DELETE | Remove data |

### 2. SELECT - Reading Data

```sql
-- Get all columns from all users
SELECT * FROM users;

-- Get specific columns
SELECT name, email FROM users;

-- Filter with WHERE
SELECT * FROM users WHERE is_active = true;

-- Multiple conditions
SELECT * FROM users WHERE is_active = true AND created_at > '2024-01-01';

-- Order results
SELECT * FROM users ORDER BY created_at DESC;

-- Limit results
SELECT * FROM users LIMIT 10;

-- Count rows
SELECT COUNT(*) FROM users;

-- Get unique values
SELECT DISTINCT city FROM users;
```

### 3. INSERT - Creating Data

```sql
-- Insert single row
INSERT INTO users (name, email, password)
VALUES ('Alice', 'alice@example.com', 'hashed_password');

-- Insert and return the created row
INSERT INTO users (name, email, password)
VALUES ('Bob', 'bob@example.com', 'hashed_password')
RETURNING *;

-- Insert multiple rows
INSERT INTO users (name, email, password)
VALUES 
    ('Charlie', 'charlie@example.com', 'hash1'),
    ('Diana', 'diana@example.com', 'hash2');
```

### 4. UPDATE - Modifying Data

```sql
-- Update single field
UPDATE users SET name = 'Alice Smith' WHERE id = 1;

-- Update multiple fields
UPDATE users 
SET name = 'Alice Smith', email = 'alice.smith@example.com'
WHERE id = 1;

-- Update with condition
UPDATE users SET is_active = false WHERE last_login < '2023-01-01';

-- Update and return
UPDATE users SET name = 'New Name' WHERE id = 1 RETURNING *;

-- ⚠️ DANGER: Without WHERE, updates ALL rows!
UPDATE users SET is_active = false;  -- Updates EVERYONE!
```

### 5. DELETE - Removing Data

```sql
-- Delete specific row
DELETE FROM users WHERE id = 1;

-- Delete with condition
DELETE FROM users WHERE is_active = false;

-- Delete and return
DELETE FROM users WHERE id = 1 RETURNING *;

-- ⚠️ DANGER: Without WHERE, deletes ALL rows!
DELETE FROM users;  -- Deletes EVERYONE!
```

### 6. JOIN - Combining Tables

```sql
-- Get posts with user names
SELECT posts.title, users.name as author
FROM posts
JOIN users ON posts.user_id = users.id;

-- Get posts with comments count
SELECT posts.title, COUNT(comments.id) as comment_count
FROM posts
LEFT JOIN comments ON posts.id = comments.post_id
GROUP BY posts.id;
```

### 7. What are Migrations?

**Migrations** = Version control for your database schema.

Instead of manually running SQL, you create migration files that can be:
- Applied (UP) - Make changes
- Reverted (DOWN) - Undo changes

```
migrations/
├── 001_create_users_table.sql
├── 002_create_posts_table.sql
├── 003_add_avatar_to_users.sql
└── 004_create_comments_table.sql
```

### 8. Migration File Structure

```sql
-- migrations/001_create_users_table.sql

-- UP: Apply this migration
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- DOWN: Revert this migration
DROP TABLE users;
```

---

## 💻 Code to Type & Understand

Create in `exercises/day08/`:

**src/database/queryBuilder.ts**:
```typescript
// Simple SQL Query Builder (simulated)

interface WhereCondition {
    field: string;
    operator: "=" | "!=" | ">" | "<" | ">=" | "<=" | "LIKE";
    value: any;
}

interface QueryResult {
    sql: string;
    params: any[];
}

export class QueryBuilder {
    private table: string = "";
    private selectFields: string[] = ["*"];
    private whereConditions: WhereCondition[] = [];
    private orderByField: string = "";
    private orderDirection: "ASC" | "DESC" = "ASC";
    private limitCount: number = 0;
    
    from(table: string): QueryBuilder {
        this.table = table;
        return this;
    }
    
    select(...fields: string[]): QueryBuilder {
        this.selectFields = fields.length > 0 ? fields : ["*"];
        return this;
    }
    
    where(field: string, operator: WhereCondition["operator"], value: any): QueryBuilder {
        this.whereConditions.push({ field, operator, value });
        return this;
    }
    
    orderBy(field: string, direction: "ASC" | "DESC" = "ASC"): QueryBuilder {
        this.orderByField = field;
        this.orderDirection = direction;
        return this;
    }
    
    limit(count: number): QueryBuilder {
        this.limitCount = count;
        return this;
    }
    
    buildSelect(): QueryResult {
        let sql = `SELECT ${this.selectFields.join(", ")} FROM ${this.table}`;
        const params: any[] = [];
        
        if (this.whereConditions.length > 0) {
            const whereClauses = this.whereConditions.map((cond, index) => {
                params.push(cond.value);
                return `${cond.field} ${cond.operator} $${index + 1}`;
            });
            sql += ` WHERE ${whereClauses.join(" AND ")}`;
        }
        
        if (this.orderByField) {
            sql += ` ORDER BY ${this.orderByField} ${this.orderDirection}`;
        }
        
        if (this.limitCount > 0) {
            sql += ` LIMIT ${this.limitCount}`;
        }
        
        return { sql, params };
    }
    
    // Reset for reuse
    reset(): QueryBuilder {
        this.table = "";
        this.selectFields = ["*"];
        this.whereConditions = [];
        this.orderByField = "";
        this.orderDirection = "ASC";
        this.limitCount = 0;
        return this;
    }
}

// INSERT query builder
export function buildInsert(table: string, data: Record<string, any>): QueryResult {
    const fields = Object.keys(data);
    const values = Object.values(data);
    const placeholders = fields.map((_, i) => `$${i + 1}`);
    
    const sql = `INSERT INTO ${table} (${fields.join(", ")}) VALUES (${placeholders.join(", ")}) RETURNING *`;
    
    return { sql, params: values };
}

// UPDATE query builder
export function buildUpdate(table: string, data: Record<string, any>, whereId: number): QueryResult {
    const fields = Object.keys(data);
    const values = Object.values(data);
    
    const setClauses = fields.map((field, i) => `${field} = $${i + 1}`);
    values.push(whereId);
    
    const sql = `UPDATE ${table} SET ${setClauses.join(", ")} WHERE id = $${values.length} RETURNING *`;
    
    return { sql, params: values };
}

// DELETE query builder
export function buildDelete(table: string, whereId: number): QueryResult {
    return {
        sql: `DELETE FROM ${table} WHERE id = $1 RETURNING *`,
        params: [whereId]
    };
}
```

**src/migrations/migrationRunner.ts**:
```typescript
// Simulated migration system

interface Migration {
    version: number;
    name: string;
    up: () => void;
    down: () => void;
}

// Track applied migrations
let appliedMigrations: number[] = [];

// Simulated database state
let databaseTables: string[] = [];

export const migrations: Migration[] = [
    {
        version: 1,
        name: "create_users_table",
        up: () => {
            console.log("  Creating users table...");
            databaseTables.push("users");
        },
        down: () => {
            console.log("  Dropping users table...");
            databaseTables = databaseTables.filter(t => t !== "users");
        }
    },
    {
        version: 2,
        name: "create_posts_table",
        up: () => {
            console.log("  Creating posts table...");
            databaseTables.push("posts");
        },
        down: () => {
            console.log("  Dropping posts table...");
            databaseTables = databaseTables.filter(t => t !== "posts");
        }
    },
    {
        version: 3,
        name: "create_comments_table",
        up: () => {
            console.log("  Creating comments table...");
            databaseTables.push("comments");
        },
        down: () => {
            console.log("  Dropping comments table...");
            databaseTables = databaseTables.filter(t => t !== "comments");
        }
    },
    {
        version: 4,
        name: "add_avatar_to_users",
        up: () => {
            console.log("  Adding avatar column to users...");
            // In real DB: ALTER TABLE users ADD COLUMN avatar VARCHAR(255);
        },
        down: () => {
            console.log("  Removing avatar column from users...");
            // In real DB: ALTER TABLE users DROP COLUMN avatar;
        }
    }
];

export function runMigrations(): void {
    console.log("Running pending migrations...\n");
    
    for (const migration of migrations) {
        if (!appliedMigrations.includes(migration.version)) {
            console.log(`Migration ${migration.version}: ${migration.name}`);
            migration.up();
            appliedMigrations.push(migration.version);
            console.log("  ✅ Applied\n");
        }
    }
    
    console.log("All migrations complete!");
}

export function rollbackMigration(): void {
    if (appliedMigrations.length === 0) {
        console.log("No migrations to rollback");
        return;
    }
    
    const lastVersion = Math.max(...appliedMigrations);
    const migration = migrations.find(m => m.version === lastVersion);
    
    if (migration) {
        console.log(`Rolling back migration ${migration.version}: ${migration.name}`);
        migration.down();
        appliedMigrations = appliedMigrations.filter(v => v !== lastVersion);
        console.log("  ✅ Rolled back\n");
    }
}

export function getMigrationStatus(): void {
    console.log("Migration Status:");
    console.log("─".repeat(50));
    
    for (const migration of migrations) {
        const status = appliedMigrations.includes(migration.version) ? "✅" : "⬜";
        console.log(`${status} ${migration.version}: ${migration.name}`);
    }
    
    console.log("─".repeat(50));
    console.log(`Tables in database: [${databaseTables.join(", ")}]`);
}
```

**src/index.ts**:
```typescript
// Test SQL operations and migrations
import { QueryBuilder, buildInsert, buildUpdate, buildDelete } from "./database/queryBuilder";
import { runMigrations, rollbackMigration, getMigrationStatus } from "./migrations/migrationRunner";

console.log("=== Day 08: SQL Operations ===\n");

// Part 1: Query Building
console.log("--- Part 1: SELECT Queries ---\n");

const qb = new QueryBuilder();

// Simple select
let query = qb.from("users").buildSelect();
console.log("All users:", query.sql);

// Select with specific fields
qb.reset();
query = qb.from("users").select("name", "email").buildSelect();
console.log("Name & email:", query.sql);

// Select with WHERE
qb.reset();
query = qb.from("users")
    .select("*")
    .where("is_active", "=", true)
    .buildSelect();
console.log("Active users:", query.sql, "| Params:", query.params);

// Complex query
qb.reset();
query = qb.from("posts")
    .select("title", "content")
    .where("user_id", "=", 1)
    .where("is_published", "=", true)
    .orderBy("created_at", "DESC")
    .limit(10)
    .buildSelect();
console.log("Complex:", query.sql, "| Params:", query.params);

// Part 2: INSERT, UPDATE, DELETE
console.log("\n--- Part 2: INSERT, UPDATE, DELETE ---\n");

// INSERT
const insertQuery = buildInsert("users", {
    name: "Alice",
    email: "alice@example.com",
    password: "hashed_password"
});
console.log("INSERT:", insertQuery.sql);
console.log("Params:", insertQuery.params);

// UPDATE
const updateQuery = buildUpdate("users", {
    name: "Alice Smith",
    email: "alice.smith@example.com"
}, 1);
console.log("\nUPDATE:", updateQuery.sql);
console.log("Params:", updateQuery.params);

// DELETE
const deleteQuery = buildDelete("users", 1);
console.log("\nDELETE:", deleteQuery.sql);
console.log("Params:", deleteQuery.params);

// Part 3: Migrations
console.log("\n--- Part 3: Migrations ---\n");

console.log("Initial status:");
getMigrationStatus();

console.log("\nRunning migrations:");
runMigrations();

console.log("\nAfter running:");
getMigrationStatus();

console.log("\nRolling back one migration:");
rollbackMigration();

console.log("\nAfter rollback:");
getMigrationStatus();
```

---

## ✍️ Exercises

### Exercise 1: Write SQL Queries
Write SQL queries for:
1. Get all users who registered after January 1, 2024
2. Get the 5 most recent posts
3. Count how many comments each post has
4. Update a user's email where id = 5
5. Delete all inactive users

### Exercise 2: Create Migration Files
Write migration files (up and down) for:
1. Creating a `products` table with id, name, price, stock
2. Adding a `description` column to products
3. Creating an `orders` table with foreign key to users

### Exercise 3: Extend Query Builder
Add these methods to the QueryBuilder:
- `orWhere()` - Add OR condition
- `whereIn()` - WHERE field IN (values)

---

## ❓ Quiz Questions

### Q1: SQL Query
Write a SQL query to get all users where age > 18.

**Your Answer**: 


### Q2: Migration Purpose
What is a database migration and why do we use it?

**Your Answer**: 


### Q3: Up and Down
What does "up" and "down" mean in migrations?

**Your Answer**: 


---

## 📝 Bonus Questions (Optional)

### B1: What is the danger of running UPDATE or DELETE without a WHERE clause?

**Your Answer**: 


### B2: What does RETURNING * do in PostgreSQL?

**Your Answer**: 


---

## ✅ Day 8 Checklist

- [ ] Read Module 4 (Lines 1351-1621)
- [ ] Understand SELECT with WHERE, ORDER BY, LIMIT
- [ ] Understand INSERT with RETURNING
- [ ] Understand UPDATE (and the danger without WHERE)
- [ ] Understand DELETE (and the danger without WHERE)
- [ ] Understand what migrations are
- [ ] Understand up/down migration concept
- [ ] Type all code examples
- [ ] Complete Exercise 1 (SQL queries)
- [ ] Complete Exercise 2 (Migration files)
- [ ] Complete Exercise 3 (Query builder)
- [ ] Answer all quiz questions
- [ ] Update Progress.md

---

## 🔗 Next Day Preview
Tomorrow you'll learn about the **Repository Layer** - how to organize database access code with findAll, findById, create, update, delete methods.
