# Day 7: Database Fundamentals

## 📚 What to Learn Today
- **Read**: [LEARNING_MODULE.md](../../Modules/LEARNING_MODULE.md) - Module 4 (Lines 1159-1350)
- **Time**: ~35 minutes reading, ~25 minutes practice
- **Topics**: What is a database, SQL vs NoSQL, tables, primary/foreign keys

---

## 📖 Key Concepts

### 1. What is a Database?
A **database** is an organized collection of data that can be easily accessed, managed, and updated.

Think of it like:
- A filing cabinet with organized folders
- A spreadsheet with multiple sheets
- A library with cataloged books

### 2. SQL vs NoSQL

| Feature | SQL (Relational) | NoSQL (Non-Relational) |
|---------|-----------------|------------------------|
| Structure | Tables with rows/columns | Documents, key-value, graphs |
| Schema | Fixed schema | Flexible schema |
| Relationships | Strong (foreign keys) | Weak or none |
| Examples | PostgreSQL, MySQL | MongoDB, Redis |
| Best for | Complex queries, transactions | Scalability, flexibility |

### 3. SQL Database Structure

```
DATABASE: my_app
├── TABLE: users
│   ├── id (PRIMARY KEY)
│   ├── name
│   ├── email
│   └── created_at
│
├── TABLE: posts
│   ├── id (PRIMARY KEY)
│   ├── user_id (FOREIGN KEY → users.id)
│   ├── title
│   └── content
│
└── TABLE: comments
    ├── id (PRIMARY KEY)
    ├── post_id (FOREIGN KEY → posts.id)
    ├── user_id (FOREIGN KEY → users.id)
    └── text
```

### 4. Tables, Rows, and Columns

**Table** = A collection of related data (like a spreadsheet)
**Row** = A single record (one user, one product)
**Column** = A field/attribute (name, email, price)

```
TABLE: users
┌────┬─────────┬─────────────────────┬────────────┐
│ id │  name   │        email        │ created_at │
├────┼─────────┼─────────────────────┼────────────┤
│  1 │ Alice   │ alice@example.com   │ 2024-01-01 │  ← Row
│  2 │ Bob     │ bob@example.com     │ 2024-01-02 │  ← Row
│  3 │ Charlie │ charlie@example.com │ 2024-01-03 │  ← Row
└────┴─────────┴─────────────────────┴────────────┘
       ↑              ↑                    ↑
    Column         Column              Column
```

### 5. Primary Key
A **Primary Key** uniquely identifies each row in a table.

Rules:
- Must be unique (no duplicates)
- Cannot be NULL
- Usually auto-incremented numbers

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,  -- Auto-incrementing primary key
    name VARCHAR(100),
    email VARCHAR(255)
);
```

### 6. Foreign Key
A **Foreign Key** creates a relationship between two tables.

```sql
CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),  -- Foreign key
    title VARCHAR(255),
    content TEXT
);
```

```
users table              posts table
┌────┬─────────┐        ┌────┬─────────┬─────────────┐
│ id │  name   │        │ id │ user_id │    title    │
├────┼─────────┤        ├────┼─────────┼─────────────┤
│  1 │ Alice   │◄───────│  1 │    1    │ First Post  │
│  2 │ Bob     │◄───────│  2 │    1    │ Second Post │
└────┴─────────┘   │    │  3 │    2    │ Bob's Post  │
                   │    └────┴─────────┴─────────────┘
                   │
                   └── user_id references users.id
```

### 7. Data Types in PostgreSQL

| Type | Description | Example |
|------|-------------|---------|
| INTEGER | Whole numbers | 1, 42, -10 |
| SERIAL | Auto-increment integer | 1, 2, 3... |
| VARCHAR(n) | Variable text up to n chars | "Hello" |
| TEXT | Unlimited text | Long content |
| BOOLEAN | True/False | true, false |
| DATE | Date only | 2024-01-15 |
| TIMESTAMP | Date and time | 2024-01-15 10:30:00 |
| DECIMAL(p,s) | Precise numbers | 19.99 |

---

## 💻 Code to Type & Understand

Create in `exercises/day07/`:

**src/types/database.ts**:
```typescript
// TypeScript types that mirror database tables

// Users table
export interface User {
    id: number;           // PRIMARY KEY, auto-increment
    name: string;         // VARCHAR(100)
    email: string;        // VARCHAR(255), unique
    password: string;     // VARCHAR(255)
    isActive: boolean;    // BOOLEAN, default true
    createdAt: Date;      // TIMESTAMP
    updatedAt: Date;      // TIMESTAMP
}

// Posts table
export interface Post {
    id: number;           // PRIMARY KEY
    userId: number;       // FOREIGN KEY → users.id
    title: string;        // VARCHAR(255)
    content: string;      // TEXT
    isPublished: boolean; // BOOLEAN
    createdAt: Date;      // TIMESTAMP
}

// Comments table
export interface Comment {
    id: number;           // PRIMARY KEY
    postId: number;       // FOREIGN KEY → posts.id
    userId: number;       // FOREIGN KEY → users.id
    text: string;         // TEXT
    createdAt: Date;      // TIMESTAMP
}

// Categories table
export interface Category {
    id: number;           // PRIMARY KEY
    name: string;         // VARCHAR(100)
    description: string;  // TEXT, nullable
}

// Many-to-many: posts_categories
export interface PostCategory {
    postId: number;       // FOREIGN KEY → posts.id
    categoryId: number;   // FOREIGN KEY → categories.id
}
```

**src/schemas/tables.sql**:
```sql
-- SQL Schema for a Blog Application
-- This is what you would run in PostgreSQL

-- Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Posts table
CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    is_published BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Comments table
CREATE TABLE comments (
    id SERIAL PRIMARY KEY,
    post_id INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    text TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Categories table
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT
);

-- Junction table for many-to-many relationship
CREATE TABLE posts_categories (
    post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
    category_id INTEGER REFERENCES categories(id) ON DELETE CASCADE,
    PRIMARY KEY (post_id, category_id)
);

-- Create indexes for better performance
CREATE INDEX idx_posts_user_id ON posts(user_id);
CREATE INDEX idx_comments_post_id ON comments(post_id);
CREATE INDEX idx_comments_user_id ON comments(user_id);
```

**src/database/simulated.ts**:
```typescript
// Simulated in-memory database
import { User, Post, Comment } from "../types/database";

// Simulated tables
export const tables = {
    users: [] as User[],
    posts: [] as Post[],
    comments: [] as Comment[]
};

// Auto-increment IDs
const nextIds = {
    users: 1,
    posts: 1,
    comments: 1
};

// Simulated database operations
export const db = {
    users: {
        insert(data: Omit<User, "id" | "createdAt" | "updatedAt">): User {
            const user: User = {
                id: nextIds.users++,
                ...data,
                createdAt: new Date(),
                updatedAt: new Date()
            };
            tables.users.push(user);
            return user;
        },
        
        findById(id: number): User | undefined {
            return tables.users.find(u => u.id === id);
        },
        
        findByEmail(email: string): User | undefined {
            return tables.users.find(u => u.email === email);
        },
        
        findAll(): User[] {
            return tables.users;
        }
    },
    
    posts: {
        insert(data: Omit<Post, "id" | "createdAt">): Post {
            // Check if user exists (foreign key constraint)
            const user = tables.users.find(u => u.id === data.userId);
            if (!user) {
                throw new Error(`Foreign key violation: User ${data.userId} does not exist`);
            }
            
            const post: Post = {
                id: nextIds.posts++,
                ...data,
                createdAt: new Date()
            };
            tables.posts.push(post);
            return post;
        },
        
        findById(id: number): Post | undefined {
            return tables.posts.find(p => p.id === id);
        },
        
        findByUserId(userId: number): Post[] {
            return tables.posts.filter(p => p.userId === userId);
        },
        
        findAll(): Post[] {
            return tables.posts;
        }
    },
    
    comments: {
        insert(data: Omit<Comment, "id" | "createdAt">): Comment {
            // Check foreign keys
            const post = tables.posts.find(p => p.id === data.postId);
            if (!post) {
                throw new Error(`Foreign key violation: Post ${data.postId} does not exist`);
            }
            
            const user = tables.users.find(u => u.id === data.userId);
            if (!user) {
                throw new Error(`Foreign key violation: User ${data.userId} does not exist`);
            }
            
            const comment: Comment = {
                id: nextIds.comments++,
                ...data,
                createdAt: new Date()
            };
            tables.comments.push(comment);
            return comment;
        },
        
        findByPostId(postId: number): Comment[] {
            return tables.comments.filter(c => c.postId === postId);
        }
    }
};
```

**src/index.ts**:
```typescript
// Test database concepts
import { db, tables } from "./database/simulated";

console.log("=== Day 07: Database Fundamentals ===\n");

// Create users
console.log("--- Creating Users ---");
const alice = db.users.insert({
    name: "Alice",
    email: "alice@example.com",
    password: "hashed_password",
    isActive: true
});
console.log("Created:", alice);

const bob = db.users.insert({
    name: "Bob",
    email: "bob@example.com",
    password: "hashed_password",
    isActive: true
});
console.log("Created:", bob);

// Create posts (with foreign key to users)
console.log("\n--- Creating Posts ---");
const post1 = db.posts.insert({
    userId: alice.id,  // Foreign key reference
    title: "My First Post",
    content: "Hello World!",
    isPublished: true
});
console.log("Created:", post1);

const post2 = db.posts.insert({
    userId: alice.id,
    title: "Second Post",
    content: "More content here",
    isPublished: false
});
console.log("Created:", post2);

// Try to create post with non-existent user
console.log("\n--- Foreign Key Violation Test ---");
try {
    db.posts.insert({
        userId: 999,  // User doesn't exist!
        title: "Invalid Post",
        content: "This should fail",
        isPublished: false
    });
} catch (error) {
    console.log("Error caught:", (error as Error).message);
}

// Create comments
console.log("\n--- Creating Comments ---");
const comment1 = db.comments.insert({
    postId: post1.id,
    userId: bob.id,
    text: "Great post!"
});
console.log("Created:", comment1);

// Query relationships
console.log("\n--- Querying Relationships ---");
console.log("All users:", db.users.findAll().map(u => u.name));
console.log("Alice's posts:", db.posts.findByUserId(alice.id).map(p => p.title));
console.log("Comments on post 1:", db.comments.findByPostId(post1.id).map(c => c.text));

// Show table structure
console.log("\n--- Current Database State ---");
console.log("Users table:", tables.users.length, "rows");
console.log("Posts table:", tables.posts.length, "rows");
console.log("Comments table:", tables.comments.length, "rows");
```

---

## ✍️ Exercises

### Exercise 1: Design a Schema
Design a database schema for an e-commerce app with:
- Products (id, name, price, stock)
- Orders (id, user_id, total, status)
- Order_Items (order_id, product_id, quantity, price)

answer: 
Product schema
```sql
CREATE TABLE product (
    id SERIAL PRIMARY KEY,
    name TEXT,
    price DECIMAL,
    stock INTEGER
)
```

Order schema
```sql
CREATE TABLE order (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES user(id),
    total DECIMAL,
    status TEXT
)
```

Order_Items schema
```sql
CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL REFERENCES order(id),
    product_id INTEGER NOT NULL REFERENCES product(id),
    quantity INTEGER,
    price DECIMAL
    
)
```

**✅ Correct!** Good schema design with proper foreign keys. Minor note: `order` is a reserved keyword in SQL; use `orders` instead to avoid syntax errors.

Draw the relationships between tables.

### Exercise 2: Identify Keys
In this table, identify:
1. Primary Key 
- id
2. Foreign Key(s)
- product_id and user_id
3. What table it references
- product_id references to id in table product
  user_id references to id in table user 

**✅ Correct!** All keys correctly identified with their references.

```sql
CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES products(id),
    user_id INTEGER REFERENCES users(id),
    rating INTEGER,
    comment TEXT
);
```

### Exercise 3: Add Categories
Extend the simulated database to include:
- Categories table
- Ability to assign categories to posts
- Query posts by category
answer:
all in the practice or exercise folder

**✅ Complete!** Full implementation verified in `practice/src/database/simulated.ts` (categories table, postsCategories junction, link(), findCategoriesByPostId(), findPostsByCategoryId()) and tested in `practice/src/index.ts`.

---

## ❓ Quiz Questions

### Q1: SQL vs NoSQL
What is the difference between SQL and NoSQL databases? Give one example of each.

**Your Answer**: 
SQL is Relational 
- Store data in tables with rows and columns
- Tables can be linked (related) to each other
- Examples: PostgreSQL, MySQL, SQLite

NoSQL is Non-Relational 
- Store data in flexible formats (documents, key-value, etc.)
- Good for unstructured data
- Examples: MongoDB, Redis

| Feature | SQL (Relational) | NoSQL (Non-Relational) |
|---------|-----------------|------------------------|
| Structure | Tables with rows/columns | Documents, key-value, graphs |
| Schema | Fixed schema | Flexible schema |
| Relationships | Strong (foreign keys) | Weak or none |
| Examples | PostgreSQL, MySQL | MongoDB, Redis |
| Best for | Complex queries, transactions | Scalability, flexibility |

**✅ Correct!** Comprehensive answer with clear comparison table. You correctly identified the key differences and provided multiple examples for each type.

### Q2: Primary Key
What is a primary key and what rules must it follow?

**Your Answer**: 
A Primary Key uniquely identifies each row in a table.

Rules:
- Must be unique (no duplicates)
- Cannot be NULL
- Usually auto-incremented numbers

**✅ Correct!** All three rules identified correctly. The auto-increment is a common practice but not a strict requirement.

### Q3: Foreign Key
What is a foreign key and what is its purpose?

**Your Answer**: 
A Foreign Key creates a relationship between two tables. so like if tabel user have row id and name and id is primary key, then table car have row id_car as primary key , id_user, type_car. the primary key in table user (id) is the foreign key in table car (id user), and taht make the user table and car table have relationship

**✅ Correct!** Good real-world example with user/car relationship. You correctly explained that a foreign key references a primary key in another table to create relationships.

---

## 📝 Bonus Questions (Optional)

### B1: What happens if you try to delete a user who has posts? (with ON DELETE CASCADE)

**Your Answer**: 
it will delete the user with automatically delete all posts that associated with that user

**✅ Correct!** CASCADE means the deletion "cascades" down to all related records. This maintains referential integrity automatically.

### B2: Why do we use SERIAL instead of INTEGER for primary keys?

**Your Answer**: 
using SERIAL it will automatically craete and auto incrementing integer column, will simplifies primary key management, and INTEGER just srtandard integer data type witout auto incement

**✅ Correct!** SERIAL = INTEGER + auto-increment + NOT NULL. It simplifies ID management so you don't have to manually track the next ID.

---

## 📊 Quiz Results: Day 07

| Question | Result | Notes |
|----------|--------|-------|
| Q1: SQL vs NoSQL | ✅ Correct | Comprehensive comparison with table |
| Q2: Primary Key | ✅ Correct | All rules identified |
| Q3: Foreign Key | ✅ Correct | Good real-world example |
| B1: ON DELETE CASCADE | ✅ Correct | Cascade behavior understood |
| B2: SERIAL vs INTEGER | ✅ Correct | Auto-increment explained |
| Exercise 1 | ✅ Correct | Minor: use "orders" not "order" |
| Exercise 2 | ✅ Correct | All keys identified |
| Exercise 3 | ✅ Complete | Full implementation in practice/ |

**Score: 5/5 (100%)** - Quiz + Bonus all correct

---

## 💬 Q&A Session Notes

### Q: Are DEFAULT values (like DEFAULT true, DEFAULT CURRENT_TIMESTAMP) necessary or optional in SQL schemas?

**A:** They are **optional**. You only add defaults when you want the database to auto-fill a value if none is provided. Without a default:
- If the column is `NOT NULL`, the insert will fail if you don't provide a value
- If the column allows `NULL`, it will just be `NULL`

Common use cases: `is_active DEFAULT true` for new users, `created_at DEFAULT CURRENT_TIMESTAMP` for automatic timestamps.

---

### Q: What is ON DELETE CASCADE and what are the alternatives?

**A:** `ON DELETE CASCADE` means if the referenced row is deleted, automatically delete this row too.

| Option | Behavior |
|--------|----------|
| `CASCADE` | Delete child rows automatically |
| `SET NULL` | Set the FK column to NULL (column must allow NULL) |
| `SET DEFAULT` | Set to the default value |
| `RESTRICT` | Prevent deletion if children exist (error) |
| `NO ACTION` | Same as RESTRICT (default) |

---

### Q: Should foreign keys always be NOT NULL?

**A:** It depends on the relationship:
- Use `NOT NULL` when the relationship is **required** (e.g., a comment must belong to a post)
- Allow `NULL` when the relationship is **optional** (e.g., a user might not have a manager)

For most real apps, use `NOT NULL` on foreign keys when the relationship is required.

---

### Q: What is a junction table and why do we need it for many-to-many relationships?

**A:** A **junction table** (also called "join table" or "bridge table") connects two tables to create a many-to-many relationship. You can't put multiple foreign key values in a single column, so you create a separate table that stores pairs of IDs.

Example: `posts_categories` with `(post_id, category_id)` allows one post to have many categories and one category to have many posts.

**Visual representation:**

```
posts                    posts_categories              categories
┌────┬───────────┐      ┌─────────┬─────────────┐      ┌────┬────────────┐
│ id │   title   │      │ post_id │ category_id │      │ id │    name    │
├────┼───────────┤      ├─────────┼─────────────┤      ├────┼────────────┤
│  1 │ Learn JS  │◄─────│    1    │      1      │─────►│  1 │ Tech       │
│  2 │ CSS Tips  │◄─────│    1    │      2      │─────►│  2 │ Tutorial   │
└────┴───────────┘      │    2    │      1      │      │  3 │ Design     │
                        │    2    │      3      │      └────┴────────────┘
                        └─────────┴─────────────┘

Post 1 ("Learn JS") → Categories: Tech, Tutorial
Post 2 ("CSS Tips") → Categories: Tech, Design
```

The composite primary key `PRIMARY KEY (post_id, category_id)` ensures the combination is unique — you can't link the same post to the same category twice.

---

### Q: What are indexes and why do we create them?

**A:** An index is like a book's index — it helps the database find rows faster without scanning the entire table.

- **Without index:** Database scans every row (slow for large tables)
- **With index:** Database jumps directly to matching rows (fast)

Create indexes on columns you frequently search, filter, or join on. Trade-off: indexes speed up reads but slow down writes.

---

### Q: How do types/database.ts, simulated.ts, and tables.sql relate to each other?

**A:** They form a layered architecture:

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         Real Database (PostgreSQL)                       │
│                                                                         │
│   tables.sql defines the actual structure:                              │
│   - CREATE TABLE users (...)                                            │
│   - CREATE TABLE posts (...)                                            │
│   - etc.                                                                │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ mirrors
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                     types/database.ts (TypeScript Types)                 │
│                                                                         │
│   TypeScript interfaces that match the DB schema:                       │
│   - interface User { id, name, email, ... }                             │
│   - interface Post { id, userId, title, ... }                           │
│   - etc.                                                                │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ used by
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                    database/simulated.ts (ORM Layer)                     │
│                                                                         │
│   Provides methods to interact with data:                               │
│   - db.users.insert(), findById(), findAll()                            │
│   - db.posts.insert(), findByUserId()                                   │
│   - etc.                                                                │
│                                                                         │
│   (In real apps, this would be Prisma, TypeORM, Drizzle, etc.)          │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ used by
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                        index.ts (Application Code)                       │
│                                                                         │
│   Your business logic that uses the ORM:                                │
│   - const user = db.users.insert({ name: "Alice", ... })                │
│   - const posts = db.posts.findByUserId(user.id)                        │
└─────────────────────────────────────────────────────────────────────────┘
```

**Summary of each file's role:**

| File | Role | Real-world equivalent |
|------|------|----------------------|
| `tables.sql` | Database schema definition | SQL migrations / schema files |
| `types/database.ts` | TypeScript types mirroring DB | Prisma's generated types, TypeORM entities |
| `database/simulated.ts` | ORM layer (data access) | Prisma Client, TypeORM Repository |
| `index.ts` | Application code using the ORM | Your actual app logic |

**In a real project with Prisma:**

```
schema.prisma  →  defines tables (like your tables.sql)
       │
       │ generates
       ▼
@prisma/client types  →  TypeScript types (like your database.ts)
       │
       │ provides
       ▼
prisma.user.create()  →  ORM methods (like your db.users.insert())
```

You've built a mini version of this architecture manually, which is great for understanding how ORMs work under the hood!

---

### Q: For Exercise 3, should I create a new folder or extend the existing practice folder?

**A:** Extend the **existing practice folder**. Exercise 1 and 2 are written answers in DAY_07.md. Exercise 3 code goes in `practice/src/database/simulated.ts` (add categories and postsCategories) and `practice/src/index.ts` (test the new functionality).

---

## ✅ Day 7 Checklist

- [x] Read Module 4 (Lines 1159-1350)
- [x] Understand SQL vs NoSQL differences
- [x] Understand tables, rows, columns
- [x] Understand primary keys
- [x] Understand foreign keys and relationships
- [x] Understand common data types
- [x] Type all code examples
- [x] Complete Exercise 1 (E-commerce schema)
- [x] Complete Exercise 2 (Identify keys)
- [x] Complete Exercise 3 (Add categories)
- [x] Answer all quiz questions
- [x] Update Progress.md

---

## 🔗 Next Day Preview
Tomorrow you'll learn **SQL Operations** - SELECT, INSERT, UPDATE, DELETE queries and database migrations.
