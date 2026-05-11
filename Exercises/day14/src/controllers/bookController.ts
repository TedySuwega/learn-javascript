import { FastifyRequest, FastifyReply } from "fastify";
import { BookService } from "../services/bookService";
import {
  BookFilters,
  BookListQuery,
  BookSortField,
  CreateBookDTO,
  UpdateBookDTO,
} from "../types/book";
import { mapErrorToStatus } from "../utils/mapErrorToStatus";
import {
  parseBoolean,
  parseId,
  parsePagination,
  parseSortField,
  parseSortOrder,
} from "../utils/parseQuery";

interface IdParams {
  id: string;
}

const BOOK_SORT_FIELDS = ["title", "author", "createdAt"] as const;

/**
 * Exercise 3 — full CRUD controller for the Book API.
 * Mirrors UserController; same response envelope, same error mapping.
 */
export class BookController {
  constructor(private bookService: BookService) {
    console.log("[Controller] BookController initialized");
  }

  // ============ GET /books ============
  async getAll(
    request: FastifyRequest<{ Querystring: BookListQuery }>,
    reply: FastifyReply,
  ) {
    console.log("[Controller] GET /books", { ...request.query });

    try {
      const filters = this.buildFilters(request.query);
      const { books, pagination } = await this.bookService.getAllBooks(filters);

      return reply.status(200).send({
        success: true,
        data: { books },
        pagination,
      });
    } catch (error) {
      return this.handleError(error as Error, reply);
    }
  }

  // ============ GET /books/:id ============
  async getById(
    request: FastifyRequest<{ Params: IdParams }>,
    reply: FastifyReply,
  ) {
    const { id } = request.params;
    console.log(`[Controller] GET /books/${id}`);

    try {
      const bookId = parseId(id);
      if (bookId === null) {
        return reply.status(400).send({
          success: false,
          error: "Invalid book ID format",
        });
      }

      const book = await this.bookService.getBookById(bookId);
      return reply.status(200).send({ success: true, data: { book } });
    } catch (error) {
      return this.handleError(error as Error, reply);
    }
  }

  // ============ POST /books ============
  async create(
    request: FastifyRequest<{ Body: CreateBookDTO }>,
    reply: FastifyReply,
  ) {
    console.log("[Controller] POST /books");

    try {
      const book = await this.bookService.createBook(request.body);
      return reply.status(201).send({
        success: true,
        data: { book },
        message: "Book created successfully",
      });
    } catch (error) {
      return this.handleError(error as Error, reply);
    }
  }

  // ============ PUT /books/:id (full replace) ============
  async update(
    request: FastifyRequest<{ Params: IdParams; Body: Required<UpdateBookDTO> }>,
    reply: FastifyReply,
  ) {
    const { id } = request.params;
    console.log(`[Controller] PUT /books/${id}`);

    try {
      const bookId = parseId(id);
      if (bookId === null) {
        return reply.status(400).send({
          success: false,
          error: "Invalid book ID format",
        });
      }

      const book = await this.bookService.updateBook(bookId, request.body);
      return reply.status(200).send({
        success: true,
        data: { book },
        message: "Book replaced successfully",
      });
    } catch (error) {
      return this.handleError(error as Error, reply);
    }
  }

  // ============ PATCH /books/:id (partial update) ============
  async partialUpdate(
    request: FastifyRequest<{ Params: IdParams; Body: UpdateBookDTO }>,
    reply: FastifyReply,
  ) {
    const { id } = request.params;
    console.log(`[Controller] PATCH /books/${id}`);

    try {
      const bookId = parseId(id);
      if (bookId === null) {
        return reply.status(400).send({
          success: false,
          error: "Invalid book ID format",
        });
      }

      if (Object.keys(request.body ?? {}).length === 0) {
        return reply.status(400).send({
          success: false,
          error: "No fields to update",
        });
      }

      const book = await this.bookService.updateBook(bookId, request.body);
      return reply.status(200).send({
        success: true,
        data: { book },
        message: "Book updated successfully",
      });
    } catch (error) {
      return this.handleError(error as Error, reply);
    }
  }

  // ============ DELETE /books/:id ============
  async delete(
    request: FastifyRequest<{ Params: IdParams }>,
    reply: FastifyReply,
  ) {
    const { id } = request.params;
    console.log(`[Controller] DELETE /books/${id}`);

    try {
      const bookId = parseId(id);
      if (bookId === null) {
        return reply.status(400).send({
          success: false,
          error: "Invalid book ID format",
        });
      }

      await this.bookService.deleteBook(bookId);
      return reply.status(204).send();
    } catch (error) {
      return this.handleError(error as Error, reply);
    }
  }

  private buildFilters(query: BookListQuery): BookFilters {
    const { page, limit } = parsePagination(query.page, query.limit);

    const filters: BookFilters = { page, limit };

    if (query.search?.trim()) filters.search = query.search.trim();

    const available = parseBoolean(query.available);
    if (available !== undefined) filters.available = available;

    const sortBy = parseSortField<BookSortField>(query.sortBy, BOOK_SORT_FIELDS);
    if (sortBy) {
      filters.sortBy = sortBy;
      filters.sortOrder = parseSortOrder(query.sortOrder);
    }

    return filters;
  }

  private handleError(error: Error, reply: FastifyReply) {
    console.log("[Controller] Error:", error.message);
    const statusCode = mapErrorToStatus(error);
    return reply.status(statusCode).send({
      success: false,
      error: error.message,
    });
  }
}
