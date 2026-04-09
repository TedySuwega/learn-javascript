import { IUserRepository } from "../repositories/userRepository";
import { User, RegisterDTO, UserResponse, UpdateUserDTO } from "../types/user";

export class UserService {
  constructor(private userRepository: IUserRepository) {
    console.log("[Service] UserService initialized");
  }

  // ============ READ OPERATIONS ============

  async getAllUsers(): Promise<UserResponse[]> {
    console.log("[Service] getAllUsers");

    const users = await this.userRepository.findAll();

    // Transform: Remove passwords from response
    return users.map((user) => this.toUserResponse(user));
  }

  async getUserById(id: number): Promise<UserResponse> {
    console.log(`[Service] getUserById: ${id}`);

    // Validation
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

  async register(data: RegisterDTO): Promise<UserResponse> {
    console.log("[Service] register");
    console.log(
      "[Service] Data:",
      JSON.stringify({ ...data, password: "***" }),
    );

    // Step 1: Validate input
    this.validateRegistration(data);

    // Step 2: Check if email already exists
    const existingUser = await this.userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new Error("Email already registered");
    }

    // Step 3: Create user (password hashing will be added in Day 12)
    const newUser = await this.userRepository.create({
      name: data.name.trim(),
      email: data.email.toLowerCase().trim(),
      password: data.password, // Will hash in Day 12
    });

    console.log("[Service] User registered successfully");
    return this.toUserResponse(newUser);
  }

  async updateProfile(id: number, data: UpdateUserDTO): Promise<UserResponse> {
    console.log(`[Service] updateProfile: ${id}`);
    console.log("[Service] Data:", JSON.stringify(data));

    // Validation
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

    // Update user
    const updatedUser = await this.userRepository.update(id, data);
    if (!updatedUser) {
      throw new Error("Failed to update profile");
    }

    return this.toUserResponse(updatedUser);
  }

  async deactivateAccount(id: number): Promise<void>{
    console.log(`[Service] deactivateAccount: ${id}`);

    // Validation
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

    // Deactivate user
    const updatedUser = await this.userRepository.update(id, { isActive: false });
    if (!updatedUser) {
      throw new Error("Failed to deactivate account");
    }

    console.log("[Service] Account deactivated successfully");
  }

  // ============ VALIDATION ============

  private validateRegistration(data: RegisterDTO): void {
    console.log("[Service] Validating registration data");

    // Name validation
    if (!data.name || data.name.trim().length < 2) {
      throw new Error("Name must be at least 2 characters");
    }

    if (data.name.length > 100) {
      throw new Error("Name must be less than 100 characters");
    }

    // Email validation
    if (!data.email) {
      throw new Error("Email is required");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      throw new Error("Invalid email format");
    }

    // Password validation
    if (!data.password) {
      throw new Error("Password is required");
    }

    if (data.password.length < 6) {
      throw new Error("Password must be at least 6 characters");
    }

    if (data.password.length > 100) {
      throw new Error("Password must be less than 100 characters");
    }

    console.log("[Service] Validation passed");
  }

  // ============ HELPERS ============

  private toUserResponse(user: User): UserResponse {
    // Never return password!
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
