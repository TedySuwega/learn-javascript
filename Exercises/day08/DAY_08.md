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
- SELECT * FROM Users WHERE created_at > '2024-01-01';

**✅ Correct!** Proper use of WHERE with date comparison.

2. Get the 5 most recent posts
- SELECT * FROM posts ORDER BY created_at DESC LIMIT 5;

**✅ Correct!** Proper use of ORDER BY DESC for most recent, LIMIT 5, and correct table name.

3. Count how many comments each post has
- SELECT posts.title, COUNT(comments.id) as comment_count FROM posts LEFT JOIN comments ON posts.id = comments.post_id GROUP BY posts.id;

**✅ Correct!** Good use of LEFT JOIN (includes posts with 0 comments), COUNT, and GROUP BY.

4. Update a user's email where id = 5
- UPDATE users SET email = 'alice.smith@example.com' WHERE id = 5;

**✅ Correct!** Proper UPDATE with SET and WHERE clause targeting the right id.

5. Delete all inactive users
- DELETE FROM users WHERE is_active = false;

**✅ Correct!** Proper DELETE with WHERE clause.

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
SELECT * FROM Users WHERE age >18;

**✅ Correct!** Valid SQL with WHERE condition.

### Q2: Migration Purpose
What is a database migration and why do we use it?

**Your Answer**: 
Migrations are like version control for your database structure. They let you:
- Create tables
- Modify existing tables
- Roll back changes if something goes wrong

why we use migration, 
Without migrations:
- You manually run SQL to create tables
- Hard to track what changes were made
- Team members might have different database structures

With migrations:
- Database changes are tracked in code
- Everyone runs the same migrations
- Can undo changes (rollback)

**✅ Correct!** Thorough answer covering both what migrations are and why we use them with clear before/after comparison.

### Q3: Up and Down
What does "up" and "down" mean in migrations?

**Your Answer**: 
up is for aplied the migration / make changes
down for undo the migration / undo changes

**✅ Correct!** Up applies changes (create table, add column), down reverts them (drop table, remove column).

---

## 📝 Bonus Questions (Optional)

### B1: What is the danger of running UPDATE or DELETE without a WHERE clause?

**Your Answer**: 
Without where clause it will apllied to all row, that dangerous

**✅ Correct!** Without WHERE, UPDATE affects every row and DELETE removes every row -- potentially catastrophic in production.

### B2: What does RETURNING * do in PostgreSQL?

**Your Answer**: 
It will return the content taht modified    

**✅ Correct!** RETURNING * gives back the rows that were inserted, updated, or deleted so you can see/use them without a separate SELECT query.

---

## 📊 Quiz Results: Day 08

| Question | Result | Notes |
|----------|--------|-------|
| Ex1-Q1 (users after Jan 2024) | ✅ Correct | Good WHERE with date |
| Ex1-Q2 (5 most recent posts) | ✅ Correct | ORDER BY DESC + LIMIT 5 |
| Ex1-Q3 (comments count) | ✅ Correct | LEFT JOIN + GROUP BY |
| Ex1-Q4 (update email id=5) | ✅ Correct | UPDATE SET WHERE id=5 |
| Ex1-Q5 (delete inactive) | ✅ Correct | |
| Q1 (SQL age > 18) | ✅ Correct | |
| Q2 (migration purpose) | ✅ Correct | Thorough explanation |
| Q3 (up and down) | ✅ Correct | |
| B1 (danger no WHERE) | ✅ Correct | |
| B2 (RETURNING *) | ✅ Correct | |

**Score: 10/10 (100%)**

---

### Exercise Review

**Exercise 2 (Migration Files)** - `exercise/src/migrations/migrationRunner.ts`
- ✅ Version 5: `create_products_table` - correctly pushes/filters `databaseTables`
- ✅ Version 6: `add_description_to_products` - correctly uses comments for real SQL (ALTER TABLE)
- ✅ Version 7: `create_orders_table` - correctly simulated with real SQL comment showing REFERENCES users(id)

**Exercise 3 (Extend Query Builder)** - `exercise/src/database/queryBuilder.ts`
- ✅ `orWhere()` - correctly stores the actual operator and uses `connector: "OR"`
- ✅ `whereIn()` - correctly stores array value with `operator: "IN"`
- ✅ `buildSelect()` updated to handle connectors (AND/OR) and expand IN arrays into multiple placeholders
- Note: Initial attempt had issues (overwriting operator with "OR", not updating buildSelect). After guided hints and fixes, the final implementation is correct.

**Test file** - `exercise/src/index.ts`
- ✅ Demonstrates orWhere, whereIn, and combined queries with correct output

---

## ✅ Day 8 Checklist

- [x] Read Module 4 (Lines 1351-1621)
- [x] Understand SELECT with WHERE, ORDER BY, LIMIT
- [x] Understand INSERT with RETURNING
- [x] Understand UPDATE (and the danger without WHERE)
- [x] Understand DELETE (and the danger without WHERE)
- [x] Understand what migrations are
- [x] Understand up/down migration concept
- [x] Type all code examples
- [x] Complete Exercise 1 (SQL queries)
- [x] Complete Exercise 2 (Migration files)
- [x] Complete Exercise 3 (Query builder)
- [x] Answer all quiz questions
- [x] Update Progress.md

---

## 💬 Q&A Session Notes

### Q: Exercise 2 is just text answers and Exercise 3 is actual code changes?

**A:** Exercise 2 could go either way, but since the simulated migration system already exists in `migrationRunner.ts`, the practical approach is to add new migration objects (versions 5-7) directly to the file. Exercise 3 is definitely about modifying the actual `QueryBuilder` class in `queryBuilder.ts` to add new methods.

---

### Q: For the orders table migration with foreign key -- is it just the same pattern as creating products?

**A:** Yes, since this is a simulated system (just tracking table names in an array), the code pattern is the same as version 5. Foreign keys only matter in a real database -- the simulation can't enforce referential integrity. Adding a comment with the real SQL (`REFERENCES users(id)`) shows understanding of the concept.

---

### Q: How do orWhere() and whereIn() work in the query builder?

**A:** Key concepts:
- `OR` is a **connector** between conditions, not a comparison operator. `orWhere("age", ">", 18)` should keep `>` as the operator and use `OR` to join it to the previous condition.
- `whereIn` needs to expand an array into multiple placeholders: `field IN ($1, $2, $3)`, not `field IN $1`.
- `buildSelect()` must use each condition's connector (AND/OR) instead of always joining with AND, and handle IN specially to expand array values.

```typescript
// orWhere stores the actual operator, marks connector as OR
orWhere(field, operator, value) {
    this.whereConditions.push({ field, operator, value, connector: "OR" });
}

// buildSelect uses connector for joining
// First condition: "name = $1"
// Next conditions: "AND age > $2" or "OR city = $3"
```

---

### Q: Is queryBuilder.ts wrapping ORM capability? Does migrationRunner.ts use it?

**A:** `queryBuilder.ts` is a simplified version of what an ORM/query builder does -- it generates SQL strings from chained method calls. `migrationRunner.ts` is completely independent; it does NOT use the query builder. They are two separate concepts:
- **Migrations** = change database **structure** (create tables, add columns)
- **Query builder** = read/write **data** within those tables
- `index.ts` imports from both and runs them as the entry point.

---

### Q: In a real app, do we still need to create our own query builder?

**A:** No. Real apps use libraries that provide this out of the box:
- **Knex.js** (Query Builder) -- chain methods, it builds SQL
- **Sequelize** (ORM) -- work with models/objects, handles SQL + migrations + relationships
- **Prisma** (ORM) -- type-safe database access

The exercise was for understanding what these libraries do under the hood. In this learning path, you'll use Sequelize which provides all of this.

---

### Q: What does real migration implementation look like?

**A:** Very similar to the exercise. Key differences:
- Each migration is a **separate file** (e.g., `001-create-users.js`, `002-create-posts.js`)
- They execute **real SQL** against an actual database
- Applied migrations are tracked in a **database table** (e.g., `SequelizeMeta`), not in-memory
- Run via CLI: `npm run migrate` (up) and `npm run migrate:undo` (down)

The user connected this to their work experience: `docker compose exec app npm run db:migrate` -- which does the same thing inside a Docker container.

---

## 🔗 Next Day Preview
Tomorrow you'll learn about the **Repository Layer** - how to organize database access code with findAll, findById, create, update, delete methods.
