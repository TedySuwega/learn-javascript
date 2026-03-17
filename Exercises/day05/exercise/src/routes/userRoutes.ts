import { FastifyInstance } from "fastify";

// Simulated database
interface User {
  id: number;
  name: string;
  email: string;
}

let users: User[] = [
  { id: 1, name: "Alice", email: "alice@example.com" },
  { id: 2, name: "Bob", email: "bob@example.com" },
];
let nextId = 3;

export async function userRoutes(app: FastifyInstance) {
  // GET /users - Get all users
  app.get("/users", async (request, reply) => {
    console.log("GET /users - Fetching all users");
    return users;
  });

  // GET /users/:id - Get user by ID
  app.get<{ Params: { id: string } }>("/users/:id", async (request, reply) => {
    const id = parseInt(request.params.id);
    console.log(`GET /users/${id} - Fetching user`);

    const user = users.find((u) => u.id === id);

    if (!user) {
      reply.status(404);
      return { error: "User not found" };
    }

    return user;
  });
    
    // GET /users/:id/Profile - Get user profile
    app.get<{ Params: { id: string } }>("/users/:id/Profile", async (request, reply) => {
      const id = parseInt(request.params.id);
      console.log(`GET /users/${id}/Profile - Fetching user profile`);

      const user = users.find((u) => u.id === id);

      if (!user) {
        reply.status(404);
        return { error: "User not found" };
      }

      return { profile: { name: user.name, email: user.email } };
    });

  // POST /users - Create new user
  app.post<{ Body: { name: string; email: string } }>(
    "/users",
    async (request, reply) => {
      const { name, email } = request.body;
      console.log(`POST /users - Creating user: ${name}`);

      // Validation
      if (!name || !email) {
        reply.status(400);
        return { error: "Name and email are required" };
      }

      const newUser: User = {
        id: nextId++,
        name,
        email,
      };

      users.push(newUser);
      reply.status(201);
      return newUser;
    },
  );

  // PUT /users/:id - Update user
  app.put<{ Params: { id: string }; Body: { name: string; email: string } }>(
    "/users/:id",
    async (request, reply) => {
      const id = parseInt(request.params.id);
      const { name, email } = request.body;
      console.log(`PUT /users/${id} - Updating user`);

      const userIndex = users.findIndex((u) => u.id === id);

      if (userIndex === -1) {
        reply.status(404);
        return { error: "User not found" };
      }

      users[userIndex] = { id, name, email };
      return users[userIndex];
    },
  );

  // DELETE /users/:id - Delete user
  app.delete<{ Params: { id: string } }>(
    "/users/:id",
    async (request, reply) => {
      const id = parseInt(request.params.id);
      console.log(`DELETE /users/${id} - Deleting user`);

      const userIndex = users.findIndex((u) => u.id === id);

      if (userIndex === -1) {
        reply.status(404);
        return { error: "User not found" };
      }

      users.splice(userIndex, 1);
      reply.status(204);
      return;
    },
  );
}
