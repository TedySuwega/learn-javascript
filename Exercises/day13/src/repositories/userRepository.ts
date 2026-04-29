import {
  User,
  CreateUserDTO,
  UserFilters,
} from "../types/user";

/** Contract for swapping storage later (SQLite, Postgres, etc.). */
export interface IUserRepository {
  findAll(filters?: UserFilters): Promise<User[]>;
  findById(id: number): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  create(data: CreateUserDTO): Promise<User>;
  /** Returns true when a row was removed — use for Exercise 1 (DELETE /users/:id). */
  delete(id: number): Promise<boolean>;
}

function now(): Date {
  return new Date();
}

// In-memory store (learning only — not thread-safe across workers).
let nextId = 4;
let users: User[] = [
  {
    id: 1,
    name: "Alice Johnson",
    email: "alice@example.com",
    password: "hashed_placeholder_1",
    isActive: true,
    createdAt: now(),
    updatedAt: now(),
    deletedAt: null,
  },
  {
    id: 2,
    name: "Bob Smith",
    email: "bob@example.com",
    password: "hashed_placeholder_2",
    isActive: true,
    createdAt: now(),
    updatedAt: now(),
    deletedAt: null,
  },
  {
    id: 3,
    name: "Charlie Brown",
    email: "charlie@example.com",
    password: "hashed_placeholder_3",
    isActive: false,
    createdAt: now(),
    updatedAt: now(),
    deletedAt: null,
  },
];

function applyFilters(rows: User[], filters?: UserFilters): User[] {
  let list = rows.filter((u) => u.deletedAt === null);

  if (!filters) {
    return list;
  }

  if (filters.isActive !== undefined) {
    list = list.filter((u) => u.isActive === filters.isActive);
  }

  if (filters.search?.trim()) {
    const q = filters.search.trim().toLowerCase();
    list = list.filter((u) => u.name.toLowerCase().includes(q));
  }

  if (filters.limit !== undefined && filters.limit > 0) {
    list = list.slice(0, filters.limit);
  }

  return list;
}

export class UserRepository implements IUserRepository {
  async findAll(filters?: UserFilters): Promise<User[]> {
    console.log("[Repository] findAll");
    return applyFilters([...users], filters);
  }

  async findById(id: number): Promise<User | null> {
    console.log(`[Repository] findById: ${id}`);
    const u = users.find((x) => x.id === id && x.deletedAt === null) ?? null;
    return u;
  }

  async findByEmail(email: string): Promise<User | null> {
    console.log(`[Repository] findByEmail: ${email}`);
    const norm = email.toLowerCase();
    const u =
      users.find((x) => x.email.toLowerCase() === norm && x.deletedAt === null) ??
      null;
    return u;
  }

  async create(data: CreateUserDTO): Promise<User> {
    console.log("[Repository] create");

    const created: User = {
      id: nextId++,
      name: data.name,
      email: data.email.toLowerCase(),
      password: data.password,
      isActive: true,
      createdAt: now(),
      updatedAt: now(),
      deletedAt: null,
    };

    users = [...users, created];
    return created;
  }

  async delete(id: number): Promise<boolean> {
    console.log(`[Repository] delete: ${id}`);

    const idx = users.findIndex((x) => x.id === id && x.deletedAt === null);
    if (idx === -1) {
      return false;
    }

    users = users.map((u, i) =>
      i === idx ? { ...u, deletedAt: now(), updatedAt: now(), isActive: false } : u,
    );
    return true;
  }
}

export const userRepository = new UserRepository();
