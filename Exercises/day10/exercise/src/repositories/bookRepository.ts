import { db } from "../database/fakeDb";
import { Book, CreateBookDTO, UpdateBookDTO, BookFilters } from "../types/book";

export interface IBookRepository {
    findAll(filters?: BookFilters): Promise<Book[]>;
    findById(id: number): Promise<Book | null>;
    findByAuthor(author: string): Promise<Book | null>;
    findByIsbn(isbn: string): Promise<Book | null>;
    create(data: CreateBookDTO): Promise<Book>;
    update(id: number, data: UpdateBookDTO): Promise<Book | null>;
    delete(id: number): Promise<boolean>;
}

export class BookRepository implements IBookRepository {
    // ============ READ OPERATIONS ============
    async findAll(filters?: BookFilters): Promise<Book[]> {
        console.log("[Repository] findAll books");
        
        let sql = "SELECT * FROM books";
        const params: any[] = [];
        
        if (filters?.search) {
            sql = "SELECT * FROM books WHERE title LIKE $1 OR author LIKE $2";
            params.push(`%${filters.search}%`, `%${filters.search}%`);
        }

        if (filters?.genre) {
            sql = "SELECT * FROM books WHERE genre = $1";
            params.push(filters.genre);
        }

        if (filters?.isAvailable !== undefined) {
            sql = "SELECT * FROM books WHERE isAvailable = $1";
            params.push(filters.isAvailable);
        }

        if (filters?.author) {
            sql = "SELECT * FROM books WHERE author = $1";
            params.push(filters.author);
        }

        if (filters?.publishedAfter) {
            sql = "SELECT * FROM books WHERE publishedYear >= $1";
            params.push(filters.publishedAfter);
        }

        if (filters?.publishedBefore) {
            sql = "SELECT * FROM books WHERE publishedYear <= $1";
            params.push(filters.publishedBefore);
        }

        const result = await db.query(sql, params);
        return result.rows;
    }

    async findById(id: number): Promise<Book | null> {
        console.log(`[Repository] findById: ${id}`);
        const result = await db.query("SELECT * FROM books WHERE id = $1", [id]); 
        return result.rows[0] || null;
    }

    async findByAuthor(author: string): Promise<Book | null> {
        console.log(`[Repository] findByAuthor: ${author}`);
        const result = await db.query("SELECT * FROM books WHERE author = $1", [author]);
        return result.rows[0] || null;
    }

    async findByIsbn(isbn: string): Promise<Book | null> {
        console.log(`[Repository] findByIsbn: ${isbn}`);
        const result = await db.query("SELECT * FROM books WHERE isbn = $1", [isbn]);
        return result.rows[0] || null;
    }

    // ============ WRITE OPERATIONS ============
    async create(data: CreateBookDTO): Promise<Book> {
        console.log("[Repository] create book");
        console.log("[Repository] Data:", JSON.stringify(data));
        const result = await db.query("INSERT INTO books (title, author, isbn, publishedYear, genre) VALUES ($1, $2, $3, $4, $5) RETURNING *", [data.title, data.author, data.isbn, data.publishedYear, data.genre]);
        return result.rows[0];
    }

    async update(id: number, data: UpdateBookDTO): Promise<Book | null> {  
        console.log(`[Repository] update: ${id}`);
        console.log("[Repository] Data:", JSON.stringify(data));
        const result = await db.query("UPDATE books SET title = $1, author = $2, isbn = $3, publishedYear = $4, genre = $5, isAvailable = $6 WHERE id = $7 RETURNING *", [data.title, data.author, data.isbn, data.publishedYear, data.genre, data.isAvailable, id]);
        return result.rows[0] || null;
    }

    // ============ DELETE OPERATIONS ============
    async delete(id: number): Promise<boolean> {
        console.log(`[Repository] delete: ${id}`);
        const result = await db.query("DELETE FROM books WHERE id = $1 RETURNING *", [id]);
        return result.rows.length > 0;
    }
}

export const bookRepository = new BookRepository();