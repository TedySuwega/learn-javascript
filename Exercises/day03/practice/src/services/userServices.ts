// Business logic for users
import { User, CreateUserInput } from "../types/user";

// Simulated database
let users: User[] = [];
let nextId = 1;

export function createUser(input: CreateUserInput): User {
  const newUser: User = {
    id: nextId++,
    name: input.name,
    email: input.email,
    createdAt: new Date(),
  };
  users.push(newUser);
  return newUser;
}

export function getAllUsers(): User[] {
  return users;
}

export function getUserById(id: number): User | undefined {
  return users.find((user) => user.id === id);
}
