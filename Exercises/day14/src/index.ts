import Fastify, { FastifyInstance } from "fastify";
import { userRoutes } from "./routes/userRoutes";
import { bookRoutes } from "./routes/bookRoutes";

const PORT = 3000;

interface InjectOpts {
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  url: string;
  payload?: unknown;
}

async function step(
  app: FastifyInstance,
  label: string,
  opts: InjectOpts,
): Promise<unknown> {
  console.log(`\n${label}  →  ${opts.method} ${opts.url}`);
  if (opts.payload !== undefined) {
    console.log(`   payload: ${JSON.stringify(opts.payload)}`);
  }

  const res = await app.inject({
    method: opts.method,
    url: opts.url,
    payload: opts.payload as object | undefined,
  });

  console.log(`   status: ${res.statusCode}`);
  if (res.body) console.log(`   body  : ${res.body}`);
  try {
    return res.body ? JSON.parse(res.body) : null;
  } catch {
    return null;
  }
}

async function main() {
  console.log("=== Day 14: Controller Layer Advanced ===\n");

  const app = Fastify({ logger: false });

  await app.register(userRoutes);
  await app.register(bookRoutes);
  app.get("/health", async () => ({ status: "ok" }));

  await app.listen({ port: PORT });
  console.log(`Server running at http://localhost:${PORT}`);

  // ─────────────── User CRUD ───────────────
  console.log("\n--- USER CRUD ---");

  const created = (await step(app, "U1 CREATE", {
    method: "POST",
    url: "/users",
    payload: {
      name: "Test User",
      email: "test@test.com",
      password: "test123",
    },
  })) as { data?: { user?: { id: number } } } | null;

  await step(app, "U2 LIST page=1 limit=2", {
    method: "GET",
    url: "/users?page=1&limit=2",
  });

  await step(app, "U3 LIST sort=name asc (Exercise 1)", {
    method: "GET",
    url: "/users?sortBy=name&sortOrder=asc",
  });

  await step(app, "U4 LIST sort=createdAt desc", {
    method: "GET",
    url: "/users?sortBy=createdAt&sortOrder=desc&limit=3",
  });

  await step(app, "U5 LIST search=alice", {
    method: "GET",
    url: "/users?search=alice",
  });

  await step(app, "U6 LIST active=false", {
    method: "GET",
    url: "/users?active=false",
  });

  await step(app, "U7 GET /users/1", {
    method: "GET",
    url: "/users/1",
  });

  await step(app, "U8 PUT /users/1 (full replace)", {
    method: "PUT",
    url: "/users/1",
    payload: {
      name: "Alice Replaced",
      email: "alice.new@example.com",
      isActive: true,
    },
  });

  await step(app, "U9 PATCH /users/2 (partial)", {
    method: "PATCH",
    url: "/users/2",
    payload: { name: "Bobby" },
  });

  const newId = created?.data?.user?.id;
  if (newId) {
    await step(app, `U10 DELETE /users/${newId}`, {
      method: "DELETE",
      url: `/users/${newId}`,
    });
  }

  // ─────────────── Validation / errors (Exercise 2) ───────────────
  console.log("\n--- USER ERROR & VALIDATION CASES ---");

  await step(app, "E1 GET /users/999 (not found)", {
    method: "GET",
    url: "/users/999",
  });

  await step(app, "E2 GET /users/abc (invalid id — schema)", {
    method: "GET",
    url: "/users/abc",
  });

  await step(app, "E3 POST /users missing fields (schema)", {
    method: "POST",
    url: "/users",
    payload: { email: "x@y.com" },
  });

  await step(app, "E4 POST /users bad email (schema)", {
    method: "POST",
    url: "/users",
    payload: { name: "Bad", email: "not-an-email", password: "secret123" },
  });

  await step(app, "E5 PATCH /users/2 empty body (schema)", {
    method: "PATCH",
    url: "/users/2",
    payload: {},
  });

  await step(app, "E6 PUT /users/2 missing field (schema)", {
    method: "PUT",
    url: "/users/2",
    payload: { name: "Only Name" },
  });

  // ─────────────── Book CRUD (Exercise 3) ───────────────
  console.log("\n--- BOOK CRUD (Exercise 3) ---");

  const createdBook = (await step(app, "B1 CREATE", {
    method: "POST",
    url: "/books",
    payload: {
      title: "Refactoring",
      author: "Martin Fowler",
      isbn: "978-0134757599",
      available: true,
    },
  })) as { data?: { book?: { id: number } } } | null;

  await step(app, "B2 LIST sort=title asc", {
    method: "GET",
    url: "/books?sortBy=title&sortOrder=asc",
  });

  await step(app, "B3 LIST search=javascript", {
    method: "GET",
    url: "/books?search=javascript",
  });

  await step(app, "B4 LIST available=false", {
    method: "GET",
    url: "/books?available=false",
  });

  await step(app, "B5 LIST page=1 limit=2", {
    method: "GET",
    url: "/books?page=1&limit=2",
  });

  await step(app, "B6 GET /books/1", {
    method: "GET",
    url: "/books/1",
  });

  await step(app, "B7 PATCH /books/1 (mark unavailable)", {
    method: "PATCH",
    url: "/books/1",
    payload: { available: false },
  });

  await step(app, "B8 PUT /books/2 (full replace)", {
    method: "PUT",
    url: "/books/2",
    payload: {
      title: "The Pragmatic Programmer (20th Anniv.)",
      author: "Andrew Hunt & David Thomas",
      isbn: "978-0135957059",
      available: true,
    },
  });

  const bookId = createdBook?.data?.book?.id;
  if (bookId) {
    await step(app, `B9 DELETE /books/${bookId}`, {
      method: "DELETE",
      url: `/books/${bookId}`,
    });
  }

  console.log("\n=== All Tests Completed ===");
  await app.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
