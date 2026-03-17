# Day 15: Review & Mini Project

## 📚 What to Learn Today
- **Review**: Modules 1-7 (All concepts so far)
- **Time**: ~60 minutes practice
- **Topics**: Build a complete Book Management API

---

## 📖 Review: Key Concepts

### Architecture Layers Recap

```
┌─────────────────────────────────────────────────────────┐
│                    HTTP Request                          │
└─────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────┐
│  CONTROLLER LAYER                                        │
│  - Receives HTTP requests                                │
│  - Extracts params, body, query                          │
│  - Calls service methods                                 │
│  - Returns HTTP responses with status codes              │
└─────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────┐
│  SERVICE LAYER                                           │
│  - Contains business logic                               │
│  - Validates data                                        │
│  - Transforms data (hash passwords, etc.)                │
│  - Orchestrates repository calls                         │
└─────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────┐
│  REPOSITORY LAYER                                        │
│  - Data access only                                      │
│  - CRUD operations                                       │
│  - SQL queries                                           │
│  - Returns raw data                                      │
└─────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────┐
│                     DATABASE                             │
└─────────────────────────────────────────────────────────┘
```

### HTTP Status Codes Summary

| Code | Name | Use Case |
|------|------|----------|
| 200 | OK | Successful GET, PUT, PATCH |
| 201 | Created | Successful POST |
| 204 | No Content | Successful DELETE |
| 400 | Bad Request | Validation errors |
| 401 | Unauthorized | Not authenticated |
| 403 | Forbidden | Not authorized |
| 404 | Not Found | Resource doesn't exist |
| 500 | Internal Error | Server error |

### Layer Responsibilities

| Layer | Does | Doesn't Do |
|-------|------|------------|
| Controller | Parse requests, call services, return responses | Business logic, database queries |
| Service | Business logic, validation, data transformation | HTTP handling, direct DB access |
| Repository | Database operations, SQL queries | Business logic, HTTP handling |

---

## 🎯 Mini Project: Book Management API

Build a complete Book Management API with all three layers.

### Requirements

**Features:**
1. CRUD operations for books
2. Search books by title or author
3. Filter books by availability
4. Pagination support
5. Proper error handling
6. Consistent response format

**Book Entity:**
```typescript
interface Book {
    id: number;
    title: string;
    author: string;
    isbn: string;
    publishedYear: number;
    genre: string;
    available: boolean;
    createdAt: Date;
    updatedAt: Date;
}
```

**Endpoints:**
- `GET /books` - List all books (with pagination, search, filter)
- `GET /books/:id` - Get book by ID
- `POST /books` - Create new book
- `PUT /books/:id` - Update book
- `DELETE /books/:id` - Delete book
- `PATCH /books/:id/availability` - Toggle availability

---

## 💻 Code to Type & Understand

Create this structure in `exercises/day15/`:

```
exercises/day15/
├── src/
│   ├── types/
│   │   └── book.ts
│   ├── database/
│   │   └── fakeDb.ts
│   ├── repositories/
│   │   └── bookRepository.ts
│   ├── services/
│   │   └── bookService.ts
│   ├── controllers/
│   │   └── bookController.ts
│   ├── routes/
│   │   └── bookRoutes.ts
│   └── index.ts
└── package.json
```

**src/types/book.ts**:
```typescript
export interface Book {
    id: number;
    title: string;
    author: string;
    isbn: string;
    publishedYear: number;
    genre: string;
    available: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateBookDTO {
    title: string;
    author: string;
    isbn: string;
    publishedYear: number;
    genre: string;
}

export interface UpdateBookDTO {
    title?: string;
    author?: string;
    isbn?: string;
    publishedYear?: number;
    genre?: string;
    available?: boolean;
}

export interface BookFilters {
    search?: string;
    genre?: string;
    available?: boolean;
    publishedAfter?: number;
    publishedBefore?: number;
}

export interface PaginationOptions {
    page: number;
    limit: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
}

export interface PaginatedResult<T> {
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}
```

**src/database/fakeDb.ts**:
```typescript
import { Book } from "../types/book";

// Simulated database
const books: Book[] = [
    {
        id: 1,
        title: "The Pragmatic Programmer",
        author: "David Thomas",
        isbn: "978-0135957059",
        publishedYear: 2019,
        genre: "Programming",
        available: true,
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-01")
    },
    {
        id: 2,
        title: "Clean Code",
        author: "Robert C. Martin",
        isbn: "978-0132350884",
        publishedYear: 2008,
        genre: "Programming",
        available: true,
        createdAt: new Date("2024-01-02"),
        updatedAt: new Date("2024-01-02")
    },
    {
        id: 3,
        title: "Design Patterns",
        author: "Gang of Four",
        isbn: "978-0201633610",
        publishedYear: 1994,
        genre: "Programming",
        available: false,
        createdAt: new Date("2024-01-03"),
        updatedAt: new Date("2024-01-03")
    },
    {
        id: 4,
        title: "The Hobbit",
        author: "J.R.R. Tolkien",
        isbn: "978-0547928227",
        publishedYear: 1937,
        genre: "Fantasy",
        available: true,
        createdAt: new Date("2024-01-04"),
        updatedAt: new Date("2024-01-04")
    },
    {
        id: 5,
        title: "1984",
        author: "George Orwell",
        isbn: "978-0451524935",
        publishedYear: 1949,
        genre: "Fiction",
        available: true,
        createdAt: new Date("2024-01-05"),
        updatedAt: new Date("2024-01-05")
    }
];

let nextId = 6;

export const db = {
    books,
    getNextId: () => nextId++
};
```

**src/repositories/bookRepository.ts**:
```typescript
import { db } from "../database/fakeDb";
import { Book, CreateBookDTO, UpdateBookDTO, BookFilters } from "../types/book";

export interface IBookRepository {
    findAll(filters?: BookFilters): Promise<Book[]>;
    findById(id: number): Promise<Book | null>;
    findByIsbn(isbn: string): Promise<Book | null>;
    create(data: CreateBookDTO): Promise<Book>;
    update(id: number, data: UpdateBookDTO): Promise<Book | null>;
    delete(id: number): Promise<boolean>;
    count(filters?: BookFilters): Promise<number>;
}

export class BookRepository implements IBookRepository {
    async findAll(filters?: BookFilters): Promise<Book[]> {
        console.log("[Repository] findAll books");
        
        let result = [...db.books];
        
        if (filters) {
            if (filters.search) {
                const search = filters.search.toLowerCase();
                result = result.filter(b => 
                    b.title.toLowerCase().includes(search) ||
                    b.author.toLowerCase().includes(search)
                );
            }
            
            if (filters.genre) {
                result = result.filter(b => 
                    b.genre.toLowerCase() === filters.genre!.toLowerCase()
                );
            }
            
            if (filters.available !== undefined) {
                result = result.filter(b => b.available === filters.available);
            }
            
            if (filters.publishedAfter) {
                result = result.filter(b => b.publishedYear >= filters.publishedAfter!);
            }
            
            if (filters.publishedBefore) {
                result = result.filter(b => b.publishedYear <= filters.publishedBefore!);
            }
        }
        
        return result;
    }
    
    async findById(id: number): Promise<Book | null> {
        console.log(`[Repository] findById: ${id}`);
        return db.books.find(b => b.id === id) || null;
    }
    
    async findByIsbn(isbn: string): Promise<Book | null> {
        console.log(`[Repository] findByIsbn: ${isbn}`);
        return db.books.find(b => b.isbn === isbn) || null;
    }
    
    async create(data: CreateBookDTO): Promise<Book> {
        console.log("[Repository] create book");
        
        const newBook: Book = {
            id: db.getNextId(),
            ...data,
            available: true,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        
        db.books.push(newBook);
        return newBook;
    }
    
    async update(id: number, data: UpdateBookDTO): Promise<Book | null> {
        console.log(`[Repository] update book: ${id}`);
        
        const index = db.books.findIndex(b => b.id === id);
        if (index === -1) return null;
        
        db.books[index] = {
            ...db.books[index],
            ...data,
            updatedAt: new Date()
        };
        
        return db.books[index];
    }
    
    async delete(id: number): Promise<boolean> {
        console.log(`[Repository] delete book: ${id}`);
        
        const index = db.books.findIndex(b => b.id === id);
        if (index === -1) return false;
        
        db.books.splice(index, 1);
        return true;
    }
    
    async count(filters?: BookFilters): Promise<number> {
        const books = await this.findAll(filters);
        return books.length;
    }
}

export const bookRepository = new BookRepository();
```

**src/services/bookService.ts**:
```typescript
import { IBookRepository } from "../repositories/bookRepository";
import { 
    Book, CreateBookDTO, UpdateBookDTO, BookFilters, 
    PaginationOptions, PaginatedResult 
} from "../types/book";

export class BookService {
    constructor(private bookRepository: IBookRepository) {
        console.log("[Service] BookService initialized");
    }
    
    async getAllBooks(
        filters?: BookFilters,
        pagination?: PaginationOptions
    ): Promise<PaginatedResult<Book>> {
        console.log("[Service] getAllBooks");
        
        // Get all books with filters
        let books = await this.bookRepository.findAll(filters);
        const total = books.length;
        
        // Apply sorting
        if (pagination?.sortBy) {
            const sortBy = pagination.sortBy as keyof Book;
            const sortOrder = pagination.sortOrder || "asc";
            
            books.sort((a, b) => {
                const aVal = a[sortBy];
                const bVal = b[sortBy];
                
                if (typeof aVal === "string" && typeof bVal === "string") {
                    return sortOrder === "asc" 
                        ? aVal.localeCompare(bVal)
                        : bVal.localeCompare(aVal);
                }
                
                if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
                if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
                return 0;
            });
        }
        
        // Apply pagination
        const page = pagination?.page || 1;
        const limit = pagination?.limit || 10;
        const startIndex = (page - 1) * limit;
        const paginatedBooks = books.slice(startIndex, startIndex + limit);
        
        return {
            data: paginatedBooks,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        };
    }
    
    async getBookById(id: number): Promise<Book> {
        console.log(`[Service] getBookById: ${id}`);
        
        if (id <= 0) {
            throw new Error("Invalid book ID");
        }
        
        const book = await this.bookRepository.findById(id);
        if (!book) {
            throw new Error("Book not found");
        }
        
        return book;
    }
    
    async createBook(data: CreateBookDTO): Promise<Book> {
        console.log("[Service] createBook");
        
        // Validate
        this.validateBook(data);
        
        // Check ISBN uniqueness
        const existingBook = await this.bookRepository.findByIsbn(data.isbn);
        if (existingBook) {
            throw new Error("Book with this ISBN already exists");
        }
        
        return this.bookRepository.create(data);
    }
    
    async updateBook(id: number, data: UpdateBookDTO): Promise<Book> {
        console.log(`[Service] updateBook: ${id}`);
        
        // Check if book exists
        const existingBook = await this.bookRepository.findById(id);
        if (!existingBook) {
            throw new Error("Book not found");
        }
        
        // Validate update data
        if (data.title !== undefined && data.title.trim().length < 1) {
            throw new Error("Title cannot be empty");
        }
        
        if (data.author !== undefined && data.author.trim().length < 1) {
            throw new Error("Author cannot be empty");
        }
        
        // Check ISBN uniqueness if changing
        if (data.isbn && data.isbn !== existingBook.isbn) {
            const isbnExists = await this.bookRepository.findByIsbn(data.isbn);
            if (isbnExists) {
                throw new Error("Book with this ISBN already exists");
            }
        }
        
        const updatedBook = await this.bookRepository.update(id, data);
        return updatedBook!;
    }
    
    async deleteBook(id: number): Promise<void> {
        console.log(`[Service] deleteBook: ${id}`);
        
        const book = await this.bookRepository.findById(id);
        if (!book) {
            throw new Error("Book not found");
        }
        
        await this.bookRepository.delete(id);
    }
    
    async toggleAvailability(id: number): Promise<Book> {
        console.log(`[Service] toggleAvailability: ${id}`);
        
        const book = await this.bookRepository.findById(id);
        if (!book) {
            throw new Error("Book not found");
        }
        
        const updatedBook = await this.bookRepository.update(id, {
            available: !book.available
        });
        
        return updatedBook!;
    }
    
    private validateBook(data: CreateBookDTO): void {
        if (!data.title || data.title.trim().length < 1) {
            throw new Error("Title is required");
        }
        
        if (!data.author || data.author.trim().length < 1) {
            throw new Error("Author is required");
        }
        
        if (!data.isbn || data.isbn.trim().length < 10) {
            throw new Error("Valid ISBN is required");
        }
        
        if (!data.publishedYear || data.publishedYear < 1000 || data.publishedYear > new Date().getFullYear()) {
            throw new Error("Valid published year is required");
        }
        
        if (!data.genre || data.genre.trim().length < 1) {
            throw new Error("Genre is required");
        }
    }
}
```

**src/controllers/bookController.ts**:
```typescript
import { FastifyRequest, FastifyReply } from "fastify";
import { BookService } from "../services/bookService";
import { CreateBookDTO, UpdateBookDTO, BookFilters, PaginationOptions } from "../types/book";

interface IdParams { id: string; }

interface QueryParams {
    page?: string;
    limit?: string;
    sortBy?: string;
    sortOrder?: string;
    search?: string;
    genre?: string;
    available?: string;
}

export class BookController {
    constructor(private bookService: BookService) {
        console.log("[Controller] BookController initialized");
    }
    
    async getAll(
        request: FastifyRequest<{ Querystring: QueryParams }>,
        reply: FastifyReply
    ) {
        console.log("[Controller] GET /books");
        
        try {
            // Build filters
            const filters: BookFilters = {};
            if (request.query.search) filters.search = request.query.search;
            if (request.query.genre) filters.genre = request.query.genre;
            if (request.query.available !== undefined) {
                filters.available = request.query.available === "true";
            }
            
            // Build pagination
            const pagination: PaginationOptions = {
                page: Math.max(1, parseInt(request.query.page || "1")),
                limit: Math.min(100, Math.max(1, parseInt(request.query.limit || "10"))),
                sortBy: request.query.sortBy,
                sortOrder: (request.query.sortOrder as "asc" | "desc") || "asc"
            };
            
            const result = await this.bookService.getAllBooks(filters, pagination);
            
            return reply.status(200).send({
                success: true,
                ...result
            });
        } catch (error: any) {
            return this.handleError(error, reply);
        }
    }
    
    async getById(
        request: FastifyRequest<{ Params: IdParams }>,
        reply: FastifyReply
    ) {
        console.log(`[Controller] GET /books/${request.params.id}`);
        
        try {
            const id = parseInt(request.params.id);
            if (isNaN(id)) {
                return reply.status(400).send({
                    success: false,
                    error: "Invalid book ID"
                });
            }
            
            const book = await this.bookService.getBookById(id);
            
            return reply.status(200).send({
                success: true,
                data: { book }
            });
        } catch (error: any) {
            return this.handleError(error, reply);
        }
    }
    
    async create(
        request: FastifyRequest<{ Body: CreateBookDTO }>,
        reply: FastifyReply
    ) {
        console.log("[Controller] POST /books");
        
        try {
            const book = await this.bookService.createBook(request.body);
            
            return reply.status(201).send({
                success: true,
                data: { book },
                message: "Book created successfully"
            });
        } catch (error: any) {
            return this.handleError(error, reply);
        }
    }
    
    async update(
        request: FastifyRequest<{ Params: IdParams; Body: UpdateBookDTO }>,
        reply: FastifyReply
    ) {
        console.log(`[Controller] PUT /books/${request.params.id}`);
        
        try {
            const id = parseInt(request.params.id);
            if (isNaN(id)) {
                return reply.status(400).send({
                    success: false,
                    error: "Invalid book ID"
                });
            }
            
            const book = await this.bookService.updateBook(id, request.body);
            
            return reply.status(200).send({
                success: true,
                data: { book },
                message: "Book updated successfully"
            });
        } catch (error: any) {
            return this.handleError(error, reply);
        }
    }
    
    async delete(
        request: FastifyRequest<{ Params: IdParams }>,
        reply: FastifyReply
    ) {
        console.log(`[Controller] DELETE /books/${request.params.id}`);
        
        try {
            const id = parseInt(request.params.id);
            if (isNaN(id)) {
                return reply.status(400).send({
                    success: false,
                    error: "Invalid book ID"
                });
            }
            
            await this.bookService.deleteBook(id);
            
            return reply.status(204).send();
        } catch (error: any) {
            return this.handleError(error, reply);
        }
    }
    
    async toggleAvailability(
        request: FastifyRequest<{ Params: IdParams }>,
        reply: FastifyReply
    ) {
        console.log(`[Controller] PATCH /books/${request.params.id}/availability`);
        
        try {
            const id = parseInt(request.params.id);
            if (isNaN(id)) {
                return reply.status(400).send({
                    success: false,
                    error: "Invalid book ID"
                });
            }
            
            const book = await this.bookService.toggleAvailability(id);
            
            return reply.status(200).send({
                success: true,
                data: { book },
                message: `Book is now ${book.available ? "available" : "unavailable"}`
            });
        } catch (error: any) {
            return this.handleError(error, reply);
        }
    }
    
    private handleError(error: Error, reply: FastifyReply) {
        console.log("[Controller] Error:", error.message);
        
        const message = error.message.toLowerCase();
        let statusCode = 500;
        
        if (message.includes("not found")) statusCode = 404;
        else if (message.includes("already") || message.includes("invalid") || 
                 message.includes("required")) statusCode = 400;
        
        return reply.status(statusCode).send({
            success: false,
            error: error.message
        });
    }
}
```

**src/routes/bookRoutes.ts**:
```typescript
import { FastifyInstance } from "fastify";
import { BookController } from "../controllers/bookController";
import { BookService } from "../services/bookService";
import { bookRepository } from "../repositories/bookRepository";

export async function bookRoutes(app: FastifyInstance) {
    const bookService = new BookService(bookRepository);
    const bookController = new BookController(bookService);
    
    app.get("/books", (req, reply) => bookController.getAll(req, reply));
    app.get("/books/:id", (req, reply) => bookController.getById(req, reply));
    app.post("/books", (req, reply) => bookController.create(req, reply));
    app.put("/books/:id", (req, reply) => bookController.update(req, reply));
    app.delete("/books/:id", (req, reply) => bookController.delete(req, reply));
    app.patch("/books/:id/availability", (req, reply) => bookController.toggleAvailability(req, reply));
    
    console.log("[Routes] Book routes registered");
}
```

**src/index.ts**:
```typescript
import Fastify from "fastify";
import { bookRoutes } from "./routes/bookRoutes";

const app = Fastify({ logger: false });
const PORT = 3000;

async function main() {
    console.log("=== Day 15: Book Management API ===\n");
    
    await app.register(bookRoutes);
    await app.listen({ port: PORT });
    console.log(`Server running at http://localhost:${PORT}\n`);
    
    // Run comprehensive tests
    console.log("--- Testing Book Management API ---\n");
    
    // 1. Get all books
    console.log("1. GET /books");
    let res = await app.inject({ method: "GET", url: "/books" });
    console.log(`   Status: ${res.statusCode}, Books: ${JSON.parse(res.body).data?.length}\n`);
    
    // 2. Get with pagination
    console.log("2. GET /books?page=1&limit=2");
    res = await app.inject({ method: "GET", url: "/books?page=1&limit=2" });
    const paginated = JSON.parse(res.body);
    console.log(`   Status: ${res.statusCode}, Page: ${paginated.pagination?.page}, Total: ${paginated.pagination?.total}\n`);
    
    // 3. Search books
    console.log("3. GET /books?search=code");
    res = await app.inject({ method: "GET", url: "/books?search=code" });
    console.log(`   Status: ${res.statusCode}, Found: ${JSON.parse(res.body).data?.length}\n`);
    
    // 4. Filter by genre
    console.log("4. GET /books?genre=Programming");
    res = await app.inject({ method: "GET", url: "/books?genre=Programming" });
    console.log(`   Status: ${res.statusCode}, Found: ${JSON.parse(res.body).data?.length}\n`);
    
    // 5. Filter by availability
    console.log("5. GET /books?available=true");
    res = await app.inject({ method: "GET", url: "/books?available=true" });
    console.log(`   Status: ${res.statusCode}, Available: ${JSON.parse(res.body).data?.length}\n`);
    
    // 6. Get single book
    console.log("6. GET /books/1");
    res = await app.inject({ method: "GET", url: "/books/1" });
    console.log(`   Status: ${res.statusCode}, Title: ${JSON.parse(res.body).data?.book?.title}\n`);
    
    // 7. Create book
    console.log("7. POST /books");
    res = await app.inject({
        method: "POST",
        url: "/books",
        payload: {
            title: "JavaScript: The Good Parts",
            author: "Douglas Crockford",
            isbn: "978-0596517748",
            publishedYear: 2008,
            genre: "Programming"
        }
    });
    const created = JSON.parse(res.body);
    console.log(`   Status: ${res.statusCode}, Created ID: ${created.data?.book?.id}\n`);
    
    // 8. Update book
    const newId = created.data?.book?.id;
    console.log(`8. PUT /books/${newId}`);
    res = await app.inject({
        method: "PUT",
        url: `/books/${newId}`,
        payload: { title: "JavaScript: The Good Parts (Updated)" }
    });
    console.log(`   Status: ${res.statusCode}\n`);
    
    // 9. Toggle availability
    console.log(`9. PATCH /books/${newId}/availability`);
    res = await app.inject({ method: "PATCH", url: `/books/${newId}/availability` });
    console.log(`   Status: ${res.statusCode}, Available: ${JSON.parse(res.body).data?.book?.available}\n`);
    
    // 10. Delete book
    console.log(`10. DELETE /books/${newId}`);
    res = await app.inject({ method: "DELETE", url: `/books/${newId}` });
    console.log(`   Status: ${res.statusCode} (204 = success)\n`);
    
    // Error cases
    console.log("--- Error Cases ---\n");
    
    console.log("11. GET /books/999 (not found)");
    res = await app.inject({ method: "GET", url: "/books/999" });
    console.log(`   Status: ${res.statusCode}, Error: ${JSON.parse(res.body).error}\n`);
    
    console.log("12. POST /books (duplicate ISBN)");
    res = await app.inject({
        method: "POST",
        url: "/books",
        payload: {
            title: "Duplicate",
            author: "Test",
            isbn: "978-0135957059",  // Already exists
            publishedYear: 2020,
            genre: "Test"
        }
    });
    console.log(`   Status: ${res.statusCode}, Error: ${JSON.parse(res.body).error}\n`);
    
    console.log("=== All Tests Completed ===");
    await app.close();
}

main().catch(console.error);
```

---

## ✍️ Exercises

### Exercise 1: Add Book Statistics Endpoint
Add `GET /books/stats` that returns:
- Total books count
- Available books count
- Books by genre (count per genre)
- Average published year

### Exercise 2: Add Bulk Operations
Add endpoints for:
- `POST /books/bulk` - Create multiple books
- `DELETE /books/bulk` - Delete multiple books by IDs

### Exercise 3: Add Book Reviews
Extend the API to support book reviews:
- Add Review entity (id, bookId, rating, comment, createdAt)
- `GET /books/:id/reviews` - Get reviews for a book
- `POST /books/:id/reviews` - Add review to a book
- Update book response to include average rating

---

## ❓ Quiz Questions

### Q1: Layer Flow
Describe the flow of a POST /books request through all layers.

**Your Answer**: 


### Q2: Error Handling
Where should each type of error be handled?
- Invalid ID format
- Business rule violation (duplicate ISBN)
- Database error

**Your Answer**: 


### Q3: Response Consistency
Why is it important to have a consistent response format?

**Your Answer**: 


---

## 📝 Bonus Questions (Optional)

### B1: How would you add caching to improve performance?

**Your Answer**: 


### B2: How would you handle concurrent updates to the same book?

**Your Answer**: 


---

## ✅ Day 15 Checklist

- [ ] Review all concepts from Modules 1-7
- [ ] Understand the complete architecture flow
- [ ] Create Book types and interfaces
- [ ] Implement BookRepository with all CRUD operations
- [ ] Implement BookService with business logic
- [ ] Implement BookController with proper error handling
- [ ] Set up routes and test all endpoints
- [ ] Complete Exercise 1 (Statistics)
- [ ] Complete Exercise 2 (Bulk operations)
- [ ] Complete Exercise 3 (Reviews)
- [ ] Answer all quiz questions
- [ ] Update Progress.md

---

## 🎉 Week 3 Midpoint!

Congratulations! You've built a complete API with all three layers. You now understand:
- Repository pattern for data access
- Service layer for business logic
- Controller layer for HTTP handling
- How all layers work together

---

## 🔗 Next Day Preview
Next you'll learn about **Authentication** - JWT tokens, how they work, and how to generate them.
