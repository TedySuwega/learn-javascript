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

/** Optional filters — used when you implement Exercise 2 on `GET /users`. */
export interface UserFilters {
  isActive?: boolean;
  limit?: number;
  search?: string;
}
