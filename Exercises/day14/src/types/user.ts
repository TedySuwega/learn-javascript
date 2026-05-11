/** Domain user (includes hashed/stored password — never sent to API clients). */
export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export interface CreateUserDTO {
  name: string;
  email: string;
  password: string;
}

export interface RegisterDTO {
  name: string;
  email: string;
  password: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

/**
 * Update payload — all fields optional so it can back BOTH PUT and PATCH.
 * For PUT the controller enforces "all fields present"; PATCH allows partials.
 */
export interface UpdateUserDTO {
  name?: string;
  email?: string;
  isActive?: boolean;
}

/** Safe user shape returned by controllers (no password). */
export interface UserResponse {
  id: number;
  name: string;
  email: string;
  isActive: boolean;
  createdAt: Date;
}

export interface LoginResponse {
  user: UserResponse;
  message: string;
}

export type UserSortField = "name" | "email" | "createdAt";
export type SortOrder = "asc" | "desc";

/** Parsed filters/pagination/sort the service & repository understand. */
export interface UserFilters {
  isActive?: boolean;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: UserSortField;
  sortOrder?: SortOrder;
}

/** Raw Fastify `request.query` — URL query values are always strings. */
export interface UserListQuery {
  active?: string;
  search?: string;
  page?: string;
  limit?: string;
  sortBy?: string;
  sortOrder?: string;
}

/** Pagination envelope returned to API clients. */
export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
