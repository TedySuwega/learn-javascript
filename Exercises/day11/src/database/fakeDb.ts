// Simulated database for learning
import { Product } from "../types/product";
import { User } from "../types/user";
import { Book } from "../types/book";

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
    deletedAt: null,
  },
  {
    id: 2,
    name: "Bob Smith",
    email: "bob@example.com",
    password: "hashed_password_2",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  },
  {
    id: 3,
    name: "Charlie Brown",
    email: "charlie@example.com",
    password: "hashed_password_3",
    isActive: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null
  },
  {
    id: 4,
    name: "Deleted User",
    email: "deleted@example.com",
    password: "hashed_password_4",
    isActive: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: new Date(),
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

let books: Book[] = [
  {
    id: 1,
    title: "The Hobbit",
    author: "J.R.R. Tolkien",
    isbn: "978-0547928227",
    publishedYear: 1937,
    genre: "Fantasy",
    isAvailable: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 2,
    title: "The Lord of the Rings",
    author: "J.R.R. Tolkien",
    isbn: "978-0547928227",
    publishedYear: 1954,
    genre: "Fantasy",
    isAvailable: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 3,
    title: "Harry Potter and the Philosopher's Stone",
    author: "J.K. Rowling",
    isbn: "978-0547928227",
    publishedYear: 1997,
    genre: "Fantasy",
    isAvailable: true,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: 4,
    title: "The Catcher in the Rye",
    author: "J.D. Salinger",
    isbn: "978-0547928227",
    publishedYear: 1951,
    genre: "Fiction",
    isAvailable: true,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: 5,
    title: "1984",
    author: "George Orwell",
    isbn: "978-0547928227",
    publishedYear: 1949,
    genre: "Fiction",
    isAvailable: true,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: 6,
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    isbn: "978-0547928227",
    publishedYear: 1960,
    genre: "Fiction",
    isAvailable: true,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: 7,
    title: "The Old Man and the Sea",
    author: "Ernest Hemingway",
    isbn: "978-0547928227",
    publishedYear: 1926,
    genre: "Literature",
    isAvailable: true,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
];

let nextUserId = users.length;
let nextProductId = products.length;
let nextBookId = books.length;
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

        if (sql.startsWith("SELECT * FROM users WHERE is_active = $1 AND deleted_at IS NULL")) {
            const isActive = params[0];
            return {
                rows: users.filter(
                    (u) => u.isActive === isActive && u.deletedAt === null
                ),
            };
        }

        if (sql.startsWith("SELECT * FROM users WHERE is_active =")) {
            const isActive = params[0];
            return { rows: users.filter(u => u.isActive === isActive) };
        }
    
        if (sql.startsWith("SELECT * FROM users WHERE deleted_at IS NULL")) {
            return { rows: users.filter(u => u.deletedAt === null) };
        }
    
        if (sql.startsWith("SELECT * FROM users WHERE deleted_at IS NOT NULL")) {
            return { rows: users.filter(u => u.deletedAt !== null) };
        }

        if (sql === "SELECT * FROM users") {
            return { rows: [...users] };
        }

        if (sql.startsWith("INSERT INTO users")) {
            const newUser: User = {
                id: nextUserId++,
                name: params[0],
                email: params[1],
                password: params[2],
                isActive: true,
                createdAt: new Date(),
                updatedAt: new Date(),
                deletedAt: null,
            };
            users.push(newUser);
            return { rows: [newUser] };
        }

        if (sql.startsWith("UPDATE users SET")) {
            const whereIdx = sql.search(/\bWHERE\s+id\s*=\s*\$\d+/i);
            if (whereIdx === -1) {
                return { rows: [] };
            }
            const id = params[params.length - 1];
            const userIndex = users.findIndex(u => u.id === id);
            if (userIndex === -1) {
                return { rows: [] };
            }
            const setPart = sql.slice("UPDATE users SET".length, whereIdx).trim();
            const assignments = setPart.split(",").map((s) => s.trim());
            const patch: Partial<User> = {};
            for (const assign of assignments) {
                const m = assign.match(/^(\w+)\s*=\s*\$(\d+)$/);
                if (!m) continue;
                const col = m[1];
                const paramIdx = parseInt(m[2], 10) - 1;
                if (paramIdx < 0 || paramIdx >= params.length - 1) continue;
                const val = params[paramIdx];
                if (col === "name") patch.name = val;
                else if (col === "email") patch.email = val;
                else if (col === "is_active") patch.isActive = val;
                else if (col === "deleted_at") patch.deletedAt = val;
            }
            if (/deleted_at\s*=\s*NOW\(\)/i.test(setPart)) {
                patch.deletedAt = new Date();
            }
            users[userIndex] = {
                ...users[userIndex],
                ...patch,
                updatedAt: new Date(),
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
                id: nextProductId++,
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
            const whereMatch = sql.match(/\bWHERE\s+id\s*=\s*\$\d+/i);
            const setEnd = whereMatch ? whereMatch.index! : sql.length;
            const setPart = sql.slice("UPDATE products SET".length, setEnd).trim();
            const assignments = setPart.split(",").map((s) => s.trim());
            const patch: Partial<Product> = {};
            for (const assign of assignments) {
                const m = assign.match(/^(\w+)\s*=\s*\$(\d+)$/);
                if (!m) continue;
                const col = m[1];
                const paramIdx = parseInt(m[2], 10) - 1;
                if (paramIdx < 0 || paramIdx >= params.length - 1) continue;
                const val = params[paramIdx];
                if (col === "name") patch.name = val;
                else if (col === "price") patch.price = val;
                else if (col === "stock") patch.stock = val;
                else if (col === "category") patch.category = val;
            }
            products[productIndex] = {
                ...products[productIndex],
                ...patch,
                updatedAt: new Date(),
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

        if (sql.startsWith("SELECT * FROM books WHERE id =")) {
            const id = params[0];
            const book = books.find(b => b.id === id);
            return { rows: book ? [book] : [] };
        }

        if (sql.startsWith("SELECT * FROM books WHERE title =")) {
            const title = params[0];
            const book = books.find(b => b.title === title);
            return { rows: book ? [book] : [] };
        }

        if (sql.startsWith("SELECT * FROM books WHERE author =")) {
            const author = params[0];
            const book = books.find(b => b.author === author);
            return { rows: book ? [book] : [] };
        }

        if (sql.startsWith("SELECT * FROM books WHERE publishedYear =")) {
            const publishedYear = params[0];
            const book = books.find(b => b.publishedYear === publishedYear);
            return { rows: book ? [book] : [] };
        }

        if (sql.startsWith("SELECT * FROM books WHERE genre =")) {
            const genre = params[0];
            const book = books.find(b => b.genre === genre);
            return { rows: book ? [book] : [] };
        }

        if (sql.startsWith("SELECT * FROM books WHERE isAvailable =")) {
            const isAvailable = params[0];
            const book = books.find(b => b.isAvailable === isAvailable);
            return { rows: book ? [book] : [] };
        }

        if (sql.startsWith("SELECT * FROM books")) {
            return { rows: [...books] };
        }

        if (sql.startsWith("INSERT INTO books")) {
            const newBook: Book = {
                id: nextBookId++,
                title: params[0],
                author: params[1],
                isbn: params[2],
                publishedYear: params[3],
                genre: params[4],
                isAvailable: true,
                createdAt: new Date(),
                updatedAt: new Date()
            };
            books.push(newBook);
            return { rows: [newBook] };
        }

        if (sql.startsWith("UPDATE books SET")) {
            const id = params[params.length - 1];
            const bookIndex = books.findIndex(b => b.id === id);
            if (bookIndex === -1) {
                return { rows: [] };
            }
            // Simple update simulation
            const setPart = sql.slice("UPDATE books SET".length, sql.search(/\bWHERE\s+id\s*=\s*\$\d+/i)).trim();
            const assignments = setPart.split(",").map((s) => s.trim());
            const patch: Partial<Book> = {};
            for (const assign of assignments) {
                const m = assign.match(/^(\w+)\s*=\s*\$(\d+)$/);
                if (!m) continue;
                const col = m[1];
                const paramIdx = parseInt(m[2], 10) - 1;
                if (paramIdx < 0 || paramIdx >= params.length - 1) continue;
                const val = params[paramIdx];
                if (col === "title") patch.title = val;
                else if (col === "author") patch.author = val;
                else if (col === "isbn") patch.isbn = val;
                else if (col === "publishedYear") patch.publishedYear = val;
                else if (col === "genre") patch.genre = val;
                else if (col === "isAvailable") patch.isAvailable = val;
            }
            return { rows: [books[bookIndex]] };
        }

        if (sql.startsWith("DELETE FROM books")) {
            const id = params[0];
            const bookIndex = books.findIndex(b => b.id === id);
            if (bookIndex === -1) {
                return { rows: [] };
            }
            const deleted = books.splice(bookIndex, 1);
            return { rows: deleted };
        }

        return { rows: [] };
    }
};
