/** Domain user (includes hashed or stored password — not sent to API clients). */
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

/** Parsed filters for service/repository (`GET /users` after parsing query strings). */
export interface UserFilters {
  isActive?: boolean;
  limit?: number;
  search?: string;
}

/** Raw Fastify `request.query` — URL query values are always strings. */
export interface UserListQuery {
  active?: string;
  limit?: string;
  search?: string;
}
