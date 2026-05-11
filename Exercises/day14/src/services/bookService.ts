import { IBookRepository } from "../repositories/bookRepository";
import {
  Book,
  BookFilters,
  BookResponse,
  CreateBookDTO,
  UpdateBookDTO,
} from "../types/book";
import { Pagination } from "../types/user";

export interface PagedBooks {
  books: BookResponse[];
  pagination: Pagination;
}

export class BookService {
  constructor(private bookRepository: IBookRepository) {
    console.log("[Service] BookService initialized");
  }

  async getAllBooks(filters?: BookFilters): Promise<PagedBooks> {
    console.log("[Service] getAllBooks", filters ?? {});

    const { rows, total } = await this.bookRepository.findAll(filters);
    const page = filters?.page && filters.page > 0 ? filters.page : 1;
    const limit = filters?.limit && filters.limit > 0 ? filters.limit : total || 1;

    return {
      books: rows.map((b) => this.toBookResponse(b)),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / limit)),
      },
    };
  }

  async getBookById(id: number): Promise<BookResponse> {
    console.log(`[Service] getBookById: ${id}`);

    if (Number.isNaN(id) || id <= 0) {
      throw new Error("Invalid book ID");
    }

    const book = await this.bookRepository.findById(id);
    if (!book) throw new Error("Book not found");

    return this.toBookResponse(book);
  }

  async createBook(data: CreateBookDTO): Promise<BookResponse> {
    console.log("[Service] createBook");

    this.validateCreate(data);

    const isbn = data.isbn.trim();
    const existing = await this.bookRepository.findByIsbn(isbn);
    if (existing) throw new Error("ISBN already registered");

    const created = await this.bookRepository.create({
      ...data,
      isbn,
    });
    return this.toBookResponse(created);
  }

  async updateBook(id: number, data: UpdateBookDTO): Promise<BookResponse> {
    console.log(`[Service] updateBook: ${id}`, data);

    if (Number.isNaN(id) || id <= 0) {
      throw new Error("Invalid book ID");
    }

    this.validateUpdate(data);

    if (data.isbn) {
      const isbn = data.isbn.trim();
      const existing = await this.bookRepository.findByIsbn(isbn);
      if (existing && existing.id !== id) {
        throw new Error("ISBN already registered");
      }
      data = { ...data, isbn };
    }

    const updated = await this.bookRepository.update(id, data);
    if (!updated) throw new Error("Book not found");

    return this.toBookResponse(updated);
  }

  async deleteBook(id: number): Promise<void> {
    console.log(`[Service] deleteBook: ${id}`);

    if (Number.isNaN(id) || id <= 0) {
      throw new Error("Invalid book ID");
    }

    const ok = await this.bookRepository.delete(id);
    if (!ok) throw new Error("Book not found");
  }

  private validateCreate(data: CreateBookDTO): void {
    if (!data.title || data.title.trim().length < 2) {
      throw new Error("Title must be at least 2 characters");
    }
    if (!data.author || data.author.trim().length < 2) {
      throw new Error("Author must be at least 2 characters");
    }
    if (!data.isbn || data.isbn.trim().length < 5) {
      throw new Error("ISBN is required");
    }
  }

  private validateUpdate(data: UpdateBookDTO): void {
    if (data.title !== undefined && data.title.trim().length < 2) {
      throw new Error("Title must be at least 2 characters");
    }
    if (data.author !== undefined && data.author.trim().length < 2) {
      throw new Error("Author must be at least 2 characters");
    }
    if (data.isbn !== undefined && data.isbn.trim().length < 5) {
      throw new Error("ISBN must be at least 5 characters");
    }
  }

  private toBookResponse(book: Book): BookResponse {
    return {
      id: book.id,
      title: book.title,
      author: book.author,
      isbn: book.isbn,
      available: book.available,
      createdAt: book.createdAt,
      updatedAt: book.updatedAt,
    };
  }
}
