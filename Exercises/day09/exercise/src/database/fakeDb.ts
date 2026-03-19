// Simulated database for learning
import { Product } from "../types/product";
import { User } from "../types/user";

// In-memory storage
let users: User[] = [
  {
    id: 1,
    name: "Alice Johnson",
    email: "alice@example.com",
    password: "hashed_password_1",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 2,
    name: "Bob Smith",
    email: "bob@example.com",
    password: "hashed_password_2",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 3,
    name: "Charlie Brown",
    email: "charlie@example.com",
    password: "hashed_password_3",
    isActive: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

let products: Product[] = [
  {
    id: 1,
    name: "Product 1",
    price: 100,
    stock: 10,
    category: "Category 1",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 2,
    name: "Product 2",
    price: 200,
    stock: 20,
    category: "Category 2",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 3,
    name: "Product 3",
    price: 300,
    stock: 30,
    category: "Category 3",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
    {
    id: 4,
    name: "Product 4",
    price: 400,
    stock: 40,
    category: "Category 4",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 5,
    name: "Product 5",
    price: 500,
    stock: 50,
    category: "Category 5",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 6,
    name: "Product 6",
    price: 600,
    stock: 60,
    category: "Category 6",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

let nextId = 7;
// Simulate async database operations
function delay(ms: number = 100): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Simulated query function

export const db = {
    async query(sql: string, params: any[] = []): Promise<{ rows: any[] }>
    {
        await delay();
        console.log(`[DB] Executing: ${sql}`);
        console.log(`[DB] Params: ${JSON.stringify(params)}`);

        // Parse and execute simple queries
        if (sql.startsWith("SELECT * FROM users WHERE id =")) {
            const id = params[0];
            const user = users.find(u => u.id === id);
            return { rows: user ? [user] : [] };
        }

        if (sql.startsWith("SELECT * FROM users WHERE email =")) {
            const email = params[0];
            const user = users.find(u => u.email === email);
            return { rows: user ? [user] : [] };
        }

        if (sql.startsWith("SELECT * FROM users WHERE is_active =")) {
            const isActive = params[0];
            return { rows: users.filter(u => u.isActive === isActive) };
        }

        if (sql === "SELECT * FROM users") {
            return { rows: [...users] };
        }

        if (sql.startsWith("INSERT INTO users")) {
            const newUser: User = {
                id: nextId++,
                name: params[0],
                email: params[1],
                password: params[2],
                isActive: true,
                createdAt: new Date(),
                updatedAt: new Date()
            };
            users.push(newUser);
            return { rows: [newUser] };
        }

        if (sql.startsWith("UPDATE users SET")) {
            const id = params[params.length - 1];
            const userIndex = users.findIndex(u => u.id === id);
            if (userIndex === -1) {
                return { rows: [] };
            }
            // Simple update simulation
            users[userIndex] = {
                ...users[userIndex],
                updatedAt: new Date()
            };
            return { rows: [users[userIndex]] };
        }

        if (sql.startsWith("DELETE FROM users")) {
            const id = params[0];
            const userIndex = users.findIndex(u => u.id === id);
            if (userIndex === -1) {
                return { rows: [] };
            }
            const deleted = users.splice(userIndex, 1);
            return { rows: deleted };
        }

        if (sql.startsWith("SELECT * FROM users WHERE name LIKE")) {
          // SQL LIKE uses % as wildcard; JS .includes() treats % as normal characters.
          // Remove % so "%Alice%" → search for "alice" inside the name (like real LIKE '%Alice%').
          const pattern = String(params[0] ?? "")
            .replace(/%/g, "")
            .toLowerCase();
          if (!pattern) {
            return { rows: [] };
          }
          return {
            rows: users.filter((u) => u.name.toLowerCase().includes(pattern)),
          };
        }

        if (sql.startsWith("SELECT * FROM products WHERE id =")) {
            const id = params[0];
            const product = products.find(p => p.id === id);
            return { rows: product ? [product] : [] };
        }

        if (sql.startsWith("SELECT * FROM products WHERE name =")) {
            const name = params[0];
            const product = products.find(p => p.name === name);
            return { rows: product ? [product] : [] };
        }

        if (sql.startsWith("SELECT * FROM products WHERE category =")) {
            const category = params[0];
            const product = products.find(p => p.category === category);
            return { rows: product ? [product] : [] };
        }

        if (sql.startsWith("SELECT * FROM products WHERE price =")) {
            const price = params[0];
            return { rows: products.filter((p) => p.price === price) };
        }

        if (sql.startsWith("SELECT * FROM products WHERE stock =")) {
            const stock = params[0];
            return { rows: products.filter((p) => p.stock === stock) };
        }

        if (sql.startsWith("SELECT * FROM products")) {
            return { rows: [...products] };
        }

        

        if (sql.startsWith("INSERT INTO products")) {
            const newProduct: Product = {
                id: nextId++,
                name: params[0],
                price: params[1],
                stock: params[2],
                category: params[3],
                createdAt: new Date(),
                updatedAt: new Date()
            };
            products.push(newProduct);
            return { rows: [newProduct] };
        }

        if (sql.startsWith("UPDATE products SET")) {
            const id = params[params.length - 1];
            const productIndex = products.findIndex(p => p.id === id);
            if (productIndex === -1) {
                return { rows: [] };
            }
            // Simple update simulation
            products[productIndex] = {
                ...products[productIndex],
                updatedAt: new Date()
            };
            return { rows: [products[productIndex]] };
        }

        if (sql.startsWith("DELETE FROM products")) {
            const id = params[0];
            const productIndex = products.findIndex(p => p.id === id);
            if (productIndex === -1) {
                return { rows: [] };
            }
            const deleted = products.splice(productIndex, 1);
            return { rows: deleted };   
        }

        return { rows: [] };
    }
};