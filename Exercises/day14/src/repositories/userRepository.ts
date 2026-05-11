import {
  User,
  CreateUserDTO,
  UpdateUserDTO,
  UserFilters,
} from "../types/user";

/** Contract — keep tight so we can swap to SQLite/Postgres later. */
export interface IUserRepository {
  findAll(filters?: UserFilters): Promise<{ rows: User[]; total: number }>;
  findById(id: number): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  create(data: CreateUserDTO): Promise<User>;
  update(id: number, data: UpdateUserDTO): Promise<User | null>;
  delete(id: number): Promise<boolean>;
}

function now(): Date {
  return new Date();
}

let nextId = 6;
let users: User[] = [
  {
    id: 1,
    name: "Alice Johnson",
    email: "alice@example.com",
    password: "hashed_placeholder_1",
    isActive: true,
    createdAt: new Date("2026-01-02T10:00:00Z"),
    updatedAt: new Date("2026-01-02T10:00:00Z"),
    deletedAt: null,
  },
  {
    id: 2,
    name: "Bob Smith",
    email: "bob@example.com",
    password: "hashed_placeholder_2",
    isActive: true,
    createdAt: new Date("2026-02-15T09:30:00Z"),
    updatedAt: new Date("2026-02-15T09:30:00Z"),
    deletedAt: null,
  },
  {
    id: 3,
    name: "Charlie Brown",
    email: "charlie@example.com",
    password: "hashed_placeholder_3",
    isActive: false,
    createdAt: new Date("2026-03-10T08:00:00Z"),
    updatedAt: new Date("2026-03-10T08:00:00Z"),
    deletedAt: null,
  },
  {
    id: 4,
    name: "Diana Prince",
    email: "diana@example.com",
    password: "hashed_placeholder_4",
    isActive: true,
    createdAt: new Date("2026-04-01T12:15:00Z"),
    updatedAt: new Date("2026-04-01T12:15:00Z"),
    deletedAt: null,
  },
  {
    id: 5,
    name: "Ethan Hunt",
    email: "ethan@example.com",
    password: "hashed_placeholder_5",
    isActive: true,
    createdAt: new Date("2026-04-22T16:45:00Z"),
    updatedAt: new Date("2026-04-22T16:45:00Z"),
    deletedAt: null,
  },
];

function applyFilters(rows: User[], filters?: UserFilters): User[] {
  let list = rows.filter((u) => u.deletedAt === null);
  if (!filters) return list;

  if (filters.isActive !== undefined) {
    list = list.filter((u) => u.isActive === filters.isActive);
  }

  if (filters.search?.trim()) {
    const q = filters.search.trim().toLowerCase();
    list = list.filter(
      (u) =>
        u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q),
    );
  }

  return list;
}

function applySort(rows: User[], filters?: UserFilters): User[] {
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

export class UserRepository implements IUserRepository {
  async findAll(filters?: UserFilters): Promise<{ rows: User[]; total: number }> {
    console.log("[Repository] user findAll", filters ?? {});

    const filtered = applyFilters([...users], filters);
    const sorted = applySort(filtered, filters);

    const total = sorted.length;
    const page = filters?.page && filters.page > 0 ? filters.page : 1;
    const limit = filters?.limit && filters.limit > 0 ? filters.limit : total || 1;
    const start = (page - 1) * limit;
    const rows = sorted.slice(start, start + limit);

    return { rows, total };
  }

  async findById(id: number): Promise<User | null> {
    console.log(`[Repository] user findById: ${id}`);
    return users.find((u) => u.id === id && u.deletedAt === null) ?? null;
  }

  async findByEmail(email: string): Promise<User | null> {
    console.log(`[Repository] user findByEmail: ${email}`);
    const norm = email.toLowerCase();
    return (
      users.find((u) => u.email.toLowerCase() === norm && u.deletedAt === null) ??
      null
    );
  }

  async create(data: CreateUserDTO): Promise<User> {
    console.log("[Repository] user create");

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

  async update(id: number, data: UpdateUserDTO): Promise<User | null> {
    console.log(`[Repository] user update: ${id}`, data);

    const idx = users.findIndex((u) => u.id === id && u.deletedAt === null);
    if (idx === -1) return null;

    const current = users[idx];
    const updated: User = {
      ...current,
      ...(data.name !== undefined ? { name: data.name } : {}),
      ...(data.email !== undefined ? { email: data.email.toLowerCase() } : {}),
      ...(data.isActive !== undefined ? { isActive: data.isActive } : {}),
      updatedAt: now(),
    };

    users = users.map((u, i) => (i === idx ? updated : u));
    return updated;
  }

  async delete(id: number): Promise<boolean> {
    console.log(`[Repository] user delete: ${id}`);

    const idx = users.findIndex((u) => u.id === id && u.deletedAt === null);
    if (idx === -1) return false;

    users = users.map((u, i) =>
      i === idx ? { ...u, deletedAt: now(), updatedAt: now(), isActive: false } : u,
    );
    return true;
  }
}

export const userRepository = new UserRepository();
