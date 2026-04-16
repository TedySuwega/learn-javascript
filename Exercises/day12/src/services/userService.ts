import { IUserRepository } from "../repositories/userRepository";
import { passwordCrypto, SALT_ROUNDS, validatePassword } from "./passwordUtils";
import {
  User,
  RegisterDTO,
  LoginDTO,
  UserResponse,
  UpdateUserDTO,
  LoginResponse,
} from "../types/user";

export class UserService {

  constructor(private userRepository: IUserRepository) {
    console.log("[Service] UserService initialized");
  }

  // ============ AUTHENTICATION ============

  async register(data: RegisterDTO): Promise<UserResponse> {
    console.log("[Service] register");
    console.log(
      "[Service] Data:",
      JSON.stringify({ ...data, password: "***" }),
    );

    this.validateRegistration(data);

    const emailNorm = data.email.toLowerCase().trim();
    const existingUser = await this.userRepository.findByEmail(emailNorm);
    if (existingUser) {
      throw new Error("Email already registered");
    }

    console.log("[Service] Hashing password...");
    const hashedPassword = await passwordCrypto.hash(data.password, SALT_ROUNDS);
    console.log("[Service] Password hashed successfully");

    const newUser = await this.userRepository.create({
      name: data.name.trim(),
      email: emailNorm,
      password: hashedPassword,
    });

    console.log("[Service] User registered successfully");
    return this.toUserResponse(newUser);
  }

  async login(data: LoginDTO): Promise<LoginResponse> {
    console.log("[Service] login attempt");

    if (!data.email || !data.password) {
      throw new Error("Email and password are required");
    }

    const user = await this.userRepository.findByEmail(data.email.toLowerCase());

    if (!user) {
      console.log("[Service] User not found");
      throw new Error("Invalid email or password");
    }

    console.log("[Service] Verifying password...");
    const isPasswordValid = await passwordCrypto.compare(data.password, user.password);

    if (!isPasswordValid) {
      console.log("[Service] Password mismatch");
      throw new Error("Invalid email or password");
    }

    if (!user.isActive) {
      throw new Error("Account is deactivated");
    }

    console.log("[Service] Login successful");
    return {
      user: this.toUserResponse(user),
      message: "Login successful",
    };
  }

  async changePassword(
    userId: number,
    currentPassword: string,
    newPassword: string,
  ): Promise<void> {
    console.log(`[Service] changePassword for user: ${userId}`);

    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const isCurrentValid = await passwordCrypto.compare(currentPassword, user.password);
    if (!isCurrentValid) {
      throw new Error("Current password is incorrect");
    }

    validatePassword(newPassword);

    const isSamePassword = await passwordCrypto.compare(newPassword, user.password);
    if (isSamePassword) {
      throw new Error("New password must be different from current password");
    }

    const hashedPassword = await passwordCrypto.hash(newPassword, SALT_ROUNDS);
    await this.userRepository.update(userId, { password: hashedPassword });

    console.log("[Service] Password changed successfully");
  }

  // ============ READ OPERATIONS ============

  async getAllUsers(): Promise<UserResponse[]> {
    console.log("[Service] getAllUsers");

    const users = await this.userRepository.findAll();

    return users.map((user) => this.toUserResponse(user));
  }

  async getUserById(id: number): Promise<UserResponse> {
    console.log(`[Service] getUserById: ${id}`);

    if (id <= 0) {
      throw new Error("Invalid user ID");
    }

    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new Error("User not found");
    }

    return this.toUserResponse(user);
  }

  // ============ WRITE OPERATIONS ============

  async updateProfile(id: number, data: UpdateUserDTO): Promise<UserResponse> {
    console.log(`[Service] updateProfile: ${id}`);
    console.log("[Service] Data:", JSON.stringify(data));

    if (id <= 0) {
      throw new Error("Invalid user ID");
    }

    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new Error("User not found");
    }

    if (data.email && !this.isValidEmail(data.email)) {
      throw new Error("Invalid email format");
    }

    if (data.email && data.email !== user.email) {
      const existingUser = await this.userRepository.findByEmail(data.email);
      if (existingUser) {
        throw new Error("Email already in use");
      }
    }

    if (data.name) {
      const name = data.name.trim();

      if (name.length < 2 || name.length > 100) {
        throw new Error("Name must be between 2 and 100 characters");
      }
    }

    const updatedUser = await this.userRepository.update(id, data);
    if (!updatedUser) {
      throw new Error("Failed to update profile");
    }

    return this.toUserResponse(updatedUser);
  }

  async deactivateAccount(id: number): Promise<void> {
    console.log(`[Service] deactivateAccount: ${id}`);

    if (id <= 0) {
      throw new Error("Invalid user ID");
    }

    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new Error("User not found");
    }

    if (!user.isActive) {
      throw new Error("Account already deactivated");
    }

    const updatedUser = await this.userRepository.update(id, { isActive: false });
    if (!updatedUser) {
      throw new Error("Failed to deactivate account");
    }

    console.log("[Service] Account deactivated successfully");
  }

  // ============ VALIDATION ============

  private validateRegistration(data: RegisterDTO): void {
    console.log("[Service] Validating registration data");

    if (!data.name || data.name.trim().length < 2) {
      throw new Error("Name must be at least 2 characters");
    }

    if (data.name.length > 100) {
      throw new Error("Name must be less than 100 characters");
    }

    if (!data.email) {
      throw new Error("Email is required");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      throw new Error("Invalid email format");
    }

    validatePassword(data.password);

    console.log("[Service] Validation passed");
  }

  // ============ HELPERS ============

  private toUserResponse(user: User): UserResponse {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      isActive: user.isActive,
      createdAt: user.createdAt,
    };
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
