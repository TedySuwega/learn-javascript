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
      databaseTables = databaseTables.filter((t) => t !== "users");
    },
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
      databaseTables = databaseTables.filter((t) => t !== "posts");
    },
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
      databaseTables = databaseTables.filter((t) => t !== "comments");
    },
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
    },
  },
  {
    version: 5,
    name: "create_products_table",
    up: () => {
      console.log("  Creating products table...");
      databaseTables.push("products");
    },
    down: () => {
      console.log("  Dropping products table...");
      databaseTables = databaseTables.filter((t) => t !== "products");
    },
  },
  {
    version: 6,
    name: "add_description_to_products",
    up: () => {
      console.log("  Adding description column to products...");
      // In real DB: ALTER TABLE products ADD COLUMN description TEXT;
    },
    down: () => {
      console.log("  Removing description column from products...");
      // In real DB: ALTER TABLE products DROP COLUMN description;
    },
  },
  {
    version: 7,
    name: "create_orders_table",
    up: () => {
      console.log("  Creating orders table...");
      databaseTables.push("orders");
      // In real DB:
      // CREATE TABLE orders (
      //   id SERIAL PRIMARY KEY,
      //   user_id INTEGER NOT NULL REFERENCES users(id),
      //   total DECIMAL(10,2) NOT NULL,
      //   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      // );
    },
    down: () => {
      console.log("  Dropping orders table...");
      databaseTables = databaseTables.filter((t) => t !== "orders");
      // In real DB: DROP TABLE IF EXISTS orders;
    },
  },
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
  const migration = migrations.find((m) => m.version === lastVersion);

  if (migration) {
    console.log(
      `Rolling back migration ${migration.version}: ${migration.name}`,
    );
    migration.down();
    appliedMigrations = appliedMigrations.filter((v) => v !== lastVersion);
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
