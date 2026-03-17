// REPOSITORY LAYER - Talks to database
import { User, CreateUserDTO } from "../types/user";

// Simulated database
let users: User[] = [];
let nextId = 1;

export const userRepository = {
  // Create a new user in database
  create(data: CreateUserDTO): User {
    const newUser: User = {
      id: nextId++,
      email: data.email,
      password: data.password, // Already hashed by service
      createdAt: new Date(),
    };
    users.push(newUser);
    console.log("[Repository] User saved to database");
    return newUser;
  },

  // Find user by email
  findByEmail(email: string): User | undefined {
    console.log("[Repository] Searching for email:", email);
    return users.find((user) => user.email === email);
  },

  // Find user by ID
  findById(id: number): User | undefined {
    console.log("[Repository] Searching for ID:", id);
    return users.find((user) => user.id === id);
  },

  // Get all users
  findAll(): User[] {
    console.log("[Repository] Getting all users");
    return users;
  },
};
