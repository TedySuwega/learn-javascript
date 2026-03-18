// Test SQL operations and migrations
import {
  QueryBuilder,
  buildInsert,
  buildUpdate,
  buildDelete,
} from "./database/queryBuilder";
import {
  runMigrations,
  rollbackMigration,
  getMigrationStatus,
} from "./migrations/migrationRunner";

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
query = qb
  .from("users")
  .select("*")
  .where("is_active", "=", true)
  .buildSelect();
console.log("Active users:", query.sql, "| Params:", query.params);

// Complex query
qb.reset();
query = qb
  .from("posts")
  .select("title", "content")
  .where("user_id", "=", 1)
  .where("is_published", "=", true)
  .orderBy("created_at", "DESC")
  .limit(10)
  .buildSelect();
console.log("Complex:", query.sql, "| Params:", query.params);

// orWhere - get users who are active OR are admins
qb.reset();
query = qb
  .from("users")
  .where("is_active", "=", true)
  .orWhere("role", "=", "admin")
  .buildSelect();
console.log("OR query:", query.sql, "| Params:", query.params);

// whereIn - get users with specific statuses
qb.reset();
query = qb
  .from("users")
  .whereIn("status", ["active", "pending", "review"])
  .buildSelect();
console.log("IN query:", query.sql, "| Params:", query.params);

// Combined - where + orWhere + whereIn
qb.reset();
query = qb
  .from("orders")
  .select("id", "total")
  .where("total", ">", 100)
  .orWhere("priority", "=", "high")
  .whereIn("status", ["pending", "processing"])
  .buildSelect();
console.log("Combined:", query.sql, "| Params:", query.params);

// Part 2: INSERT, UPDATE, DELETE
console.log("\n--- Part 2: INSERT, UPDATE, DELETE ---\n");

// INSERT
const insertQuery = buildInsert("users", {
  name: "Alice",
  email: "alice@example.com",
  password: "hashed_password",
});
console.log("INSERT:", insertQuery.sql);
console.log("Params:", insertQuery.params);

// UPDATE
const updateQuery = buildUpdate(
  "users",
  {
    name: "Alice Smith",
    email: "alice.smith@example.com",
  },
  1,
);
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
