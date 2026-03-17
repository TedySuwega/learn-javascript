// SERVICE LAYER - Business logic
import { userRepository } from "../repositories/userRepository";
import { CreateUserDTO, UserResponse } from "../types/user";

// Simple hash simulation (real apps use bcrypt)
function hashPassword(password: string): string {
  return `hashed_${password}_hashed`;
}

export const userService = {
  // Register a new user
  register(data: CreateUserDTO): UserResponse {
    console.log("[Service] Processing registration");

    // Business logic: Check if email already exists
    const existingUser = userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new Error("Email already registered");
    }

    // Business logic: Hash the password
    const hashedPassword = hashPassword(data.password);

    // Call repository to save
    const user = userRepository.create({
      email: data.email,
      password: hashedPassword,
    });

    // Return user WITHOUT password
    return {
      id: user.id,
      email: user.email,
      createdAt: user.createdAt,
    };
  },

  // Get user by ID
  getById(id: number): UserResponse | null {
    console.log("[Service] Getting user by ID");
    const user = userRepository.findById(id);

    if (!user) {
      return null;
    }

    // Return without password
    return {
      id: user.id,
      email: user.email,
      createdAt: user.createdAt,
    };
  },

  // Get all users
  getAll(): UserResponse[] {
    console.log("[Service] Getting all users");
    const users = userRepository.findAll();

    // Remove passwords from all users
    return users.map((user) => ({
      id: user.id,
      email: user.email,
      createdAt: user.createdAt,
    }));
  },
};
