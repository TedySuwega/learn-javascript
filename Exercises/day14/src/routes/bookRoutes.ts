import { FastifyInstance } from "fastify";
import { BookController } from "../controllers/bookController";
import { BookService } from "../services/bookService";
import { bookRepository } from "../repositories/bookRepository";
import {
  BookListQuery,
  CreateBookDTO,
  UpdateBookDTO,
} from "../types/book";
import {
  createBookSchema,
  idParamsSchema,
  listBooksSchema,
  patchBookSchema,
  replaceBookSchema,
} from "../schemas/bookSchemas";

export async function bookRoutes(app: FastifyInstance) {
  const bookService = new BookService(bookRepository);
  const bookController = new BookController(bookService);

  app.get<{ Querystring: BookListQuery }>(
    "/books",
    { schema: listBooksSchema },
    (req, reply) => bookController.getAll(req, reply),
  );

  app.get<{ Params: { id: string } }>(
    "/books/:id",
    { schema: idParamsSchema },
    (req, reply) => bookController.getById(req, reply),
  );

  app.post<{ Body: CreateBookDTO }>(
    "/books",
    { schema: createBookSchema },
    (req, reply) => bookController.create(req, reply),
  );

  app.put<{ Params: { id: string }; Body: Required<UpdateBookDTO> }>(
    "/books/:id",
    { schema: replaceBookSchema },
    (req, reply) => bookController.update(req, reply),
  );

  app.patch<{ Params: { id: string }; Body: UpdateBookDTO }>(
    "/books/:id",
    { schema: patchBookSchema },
    (req, reply) => bookController.partialUpdate(req, reply),
  );

  app.delete<{ Params: { id: string } }>(
    "/books/:id",
    { schema: idParamsSchema },
    (req, reply) => bookController.delete(req, reply),
  );

  console.log("[Routes] Book routes registered");
}
