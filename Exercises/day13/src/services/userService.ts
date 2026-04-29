import { IUserRepository } from "../repositories/userRepository";
import {
  LoginDTO,
  LoginResponse,
  RegisterDTO,
  UserFilters,
  UserResponse,
  User,
} from "../types/user";

export class UserService {
  constructor(private userRepository: IUserRepository) {
    console.log("[Service] UserService initialized");
  }

  async getAllUsers(filters?: UserFilters): Promise<UserResponse[]> {
    console.log("[Service] getAllUsers");

    const rows = await this.userRepository.findAll(filters);
    return rows.map((u) => this.toUserResponse(u));
  }

  async getUserById(id: number): Promise<UserResponse> {
    console.log(`[Service] getUserById: ${id}`);

    if (Number.isNaN(id) || id <= 0) {
      throw new Error("Invalid user ID");
    }

    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new Error("User not found");
    }

    return this.toUserResponse(user);
  }

  async register(data: RegisterDTO): Promise<UserResponse> {
    console.log("[Service] register");

    this.validateRegistration(data);

    const emailNorm = data.email.toLowerCase().trim();
    const existing = await this.userRepository.findByEmail(emailNorm);
    if (existing) {
      throw new Error("Email already registered");
    }

    const newUser = await this.userRepository.create({
      name: data.name.trim(),
      email: emailNorm,
      password: data.password,
    });

    return this.toUserResponse(newUser);
  }

  async login(data: LoginDTO): Promise<LoginResponse> {
    console.log("[Service] login");

    const user = await this.userRepository.findByEmail(data.email.toLowerCase());
    if (!user) {
      throw new Error("Invalid email or password");
    }

    // Learning demo: plaintext compare — use hashing in production.
    if (user.password !== data.password) {
      throw new Error("Invalid email or password");
    }

    if (!user.isActive) {
      throw new Error("Account is deactivated");
    }

    return {
      user: this.toUserResponse(user),
      message: "Login successful",
    };
  }

  /** Optional — wire from controller when you add Exercise 1. */
  async deleteUser(id: number): Promise<void> {
    console.log(`[Service] deleteUser: ${id}`);

    if (Number.isNaN(id) || id <= 0) {
      throw new Error("Invalid user ID");
    }

    const existing = await this.userRepository.findById(id);
    if (!existing) {
      throw new Error("User not found");
    }

    await this.userRepository.delete(id);
  }

  private validateRegistration(data: RegisterDTO): void {
    if (!data.name || data.name.trim().length < 2) {
      throw new Error("Name must be at least 2 characters");
    }

    if (!data.email) {
      throw new Error("Email is required");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      throw new Error("Invalid email format");
    }

    if (!data.password || data.password.length < 6) {
      throw new Error("Password must be at least 6 characters");
    }
  }

  private toUserResponse(user: User): UserResponse {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      isActive: user.isActive,
      createdAt: user.createdAt,
    };
  }
}
