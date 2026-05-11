/** Domain book (Exercise 3). */
export interface Book {
  id: number;
  title: string;
  author: string;
  isbn: string;
  /** true = on shelf, false = checked out / sold out. */
  available: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export interface CreateBookDTO {
  title: string;
  author: string;
  isbn: string;
  available?: boolean;
}

export interface UpdateBookDTO {
  title?: string;
  author?: string;
  isbn?: string;
  available?: boolean;
}

/** API-safe book shape. */
export interface BookResponse {
  id: number;
  title: string;
  author: string;
  isbn: string;
  available: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type BookSortField = "title" | "author" | "createdAt";
export type SortOrder = "asc" | "desc";

export interface BookFilters {
  search?: string;
  available?: boolean;
  page?: number;
  limit?: number;
  sortBy?: BookSortField;
  sortOrder?: SortOrder;
}

/** Raw query (everything is a string from Fastify). */
export interface BookListQuery {
  search?: string;
  available?: string;
  page?: string;
  limit?: string;
  sortBy?: string;
  sortOrder?: string;
}
