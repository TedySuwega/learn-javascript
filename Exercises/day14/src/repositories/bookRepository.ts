import {
  Book,
  BookFilters,
  CreateBookDTO,
  UpdateBookDTO,
} from "../types/book";

export interface IBookRepository {
  findAll(filters?: BookFilters): Promise<{ rows: Book[]; total: number }>;
  findById(id: number): Promise<Book | null>;
  findByIsbn(isbn: string): Promise<Book | null>;
  create(data: CreateBookDTO): Promise<Book>;
  update(id: number, data: UpdateBookDTO): Promise<Book | null>;
  delete(id: number): Promise<boolean>;
}

function now(): Date {
  return new Date();
}

let nextId = 5;
let books: Book[] = [
  {
    id: 1,
    title: "Clean Code",
    author: "Robert C. Martin",
    isbn: "978-0132350884",
    available: true,
    createdAt: new Date("2026-01-05T08:00:00Z"),
    updatedAt: new Date("2026-01-05T08:00:00Z"),
    deletedAt: null,
  },
  {
    id: 2,
    title: "The Pragmatic Programmer",
    author: "Andrew Hunt",
    isbn: "978-0201616224",
    available: true,
    createdAt: new Date("2026-02-12T10:30:00Z"),
    updatedAt: new Date("2026-02-12T10:30:00Z"),
    deletedAt: null,
  },
  {
    id: 3,
    title: "You Don't Know JS",
    author: "Kyle Simpson",
    isbn: "978-1491924464",
    available: false,
    createdAt: new Date("2026-03-20T09:15:00Z"),
    updatedAt: new Date("2026-03-20T09:15:00Z"),
    deletedAt: null,
  },
  {
    id: 4,
    title: "Eloquent JavaScript",
    author: "Marijn Haverbeke",
    isbn: "978-1593279509",
    available: true,
    createdAt: new Date("2026-04-08T14:00:00Z"),
    updatedAt: new Date("2026-04-08T14:00:00Z"),
    deletedAt: null,
  },
];

function applyFilters(rows: Book[], filters?: BookFilters): Book[] {
  let list = rows.filter((b) => b.deletedAt === null);
  if (!filters) return list;

  if (filters.available !== undefined) {
    list = list.filter((b) => b.available === filters.available);
  }

  if (filters.search?.trim()) {
    const q = filters.search.trim().toLowerCase();
    list = list.filter(
      (b) =>
        b.title.toLowerCase().includes(q) ||
        b.author.toLowerCase().includes(q),
    );
  }

  return list;
}

function applySort(rows: Book[], filters?: BookFilters): Book[] {
  if (!filters?.sortBy) return rows;

  const dir = filters.sortOrder === "asc" ? 1 : -1;
  const field = filters.sortBy;

  return [...rows].sort((a, b) => {
    const av = a[field];
    const bv = b[field];

    if (av instanceof Date && bv instanceof Date) {
      return (av.getTime() - bv.getTime()) * dir;
    }
    if (typeof av === "string" && typeof bv === "string") {
      return av.localeCompare(bv) * dir;
    }
    return 0;
  });
}

export class BookRepository implements IBookRepository {
  async findAll(filters?: BookFilters): Promise<{ rows: Book[]; total: number }> {
    console.log("[Repository] book findAll", filters ?? {});

    const filtered = applyFilters([...books], filters);
    const sorted = applySort(filtered, filters);

    const total = sorted.length;
    const page = filters?.page && filters.page > 0 ? filters.page : 1;
    const limit = filters?.limit && filters.limit > 0 ? filters.limit : total || 1;
    const start = (page - 1) * limit;
    const rows = sorted.slice(start, start + limit);

    return { rows, total };
  }

  async findById(id: number): Promise<Book | null> {
    console.log(`[Repository] book findById: ${id}`);
    return books.find((b) => b.id === id && b.deletedAt === null) ?? null;
  }

  async findByIsbn(isbn: string): Promise<Book | null> {
    console.log(`[Repository] book findByIsbn: ${isbn}`);
    return books.find((b) => b.isbn === isbn && b.deletedAt === null) ?? null;
  }

  async create(data: CreateBookDTO): Promise<Book> {
    console.log("[Repository] book create");

    const created: Book = {
      id: nextId++,
      title: data.title.trim(),
      author: data.author.trim(),
      isbn: data.isbn.trim(),
      available: data.available ?? true,
      createdAt: now(),
      updatedAt: now(),
      deletedAt: null,
    };

    books = [...books, created];
    return created;
  }

  async update(id: number, data: UpdateBookDTO): Promise<Book | null> {
    console.log(`[Repository] book update: ${id}`, data);

    const idx = books.findIndex((b) => b.id === id && b.deletedAt === null);
    if (idx === -1) return null;

    const current = books[idx];
    const updated: Book = {
      ...current,
      ...(data.title !== undefined ? { title: data.title } : {}),
      ...(data.author !== undefined ? { author: data.author } : {}),
      ...(data.isbn !== undefined ? { isbn: data.isbn } : {}),
      ...(data.available !== undefined ? { available: data.available } : {}),
      updatedAt: now(),
    };

    books = books.map((b, i) => (i === idx ? updated : b));
    return updated;
  }

  async delete(id: number): Promise<boolean> {
    console.log(`[Repository] book delete: ${id}`);

    const idx = books.findIndex((b) => b.id === id && b.deletedAt === null);
    if (idx === -1) return false;

    books = books.map((b, i) =>
      i === idx ? { ...b, deletedAt: now(), updatedAt: now() } : b,
    );
    return true;
  }
}

export const bookRepository = new BookRepository();
