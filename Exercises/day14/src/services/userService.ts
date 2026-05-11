import { IUserRepository } from "../repositories/userRepository";
import {
  LoginDTO,
  LoginResponse,
  Pagination,
  RegisterDTO,
  UpdateUserDTO,
  User,
  UserFilters,
  UserResponse,
} from "../types/user";

export interface PagedUsers {
  users: UserResponse[];
  pagination: Pagination;
}

export class UserService {
  constructor(private userRepository: IUserRepository) {
    console.log("[Service] UserService initialized");
  }

  async getAllUsers(filters?: UserFilters): Promise<PagedUsers> {
    console.log("[Service] getAllUsers", filters ?? {});

    const { rows, total } = await this.userRepository.findAll(filters);
    const page = filters?.page && filters.page > 0 ? filters.page : 1;
    const limit = filters?.limit && filters.limit > 0 ? filters.limit : total || 1;

    return {
      users: rows.map((u) => this.toUserResponse(u)),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / limit)),
      },
    };
  }

  async getUserById(id: number): Promise<UserResponse> {
    console.log(`[Service] getUserById: ${id}`);

    if (Number.isNaN(id) || id <= 0) {
      throw new Error("Invalid user ID");
    }

    const user = await this.userRepository.findById(id);
    if (!user) throw new Error("User not found");

    return this.toUserResponse(user);
  }

  async register(data: RegisterDTO): Promise<UserResponse> {
    console.log("[Service] register");

    this.validateRegistration(data);

    const emailNorm = data.email.toLowerCase().trim();
    const existing = await this.userRepository.findByEmail(emailNorm);
    if (existing) throw new Error("Email already registered");

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
    if (!user) throw new Error("Invalid email or password");

    if (user.password !== data.password) {
      throw new Error("Invalid email or password");
    }

    if (!user.isActive) throw new Error("Account is deactivated");

    return {
      user: this.toUserResponse(user),
      message: "Login successful",
    };
  }

  /**
   * Update user — backs both PUT (full) and PATCH (partial).
   * The controller decides which fields are required; the service just validates
   * whatever was provided and persists it.
   */
  async updateUser(id: number, data: UpdateUserDTO): Promise<UserResponse> {
    console.log(`[Service] updateUser: ${id}`, data);

    if (Number.isNaN(id) || id <= 0) {
      throw new Error("Invalid user ID");
    }

    this.validateUpdate(data);

    if (data.email) {
      const emailNorm = data.email.toLowerCase().trim();
      const existing = await this.userRepository.findByEmail(emailNorm);
      if (existing && existing.id !== id) {
        throw new Error("Email already registered");
      }
      data = { ...data, email: emailNorm };
    }

    const updated = await this.userRepository.update(id, data);
    if (!updated) throw new Error("User not found");

    return this.toUserResponse(updated);
  }

  async deleteUser(id: number): Promise<void> {
    console.log(`[Service] deleteUser: ${id}`);

    if (Number.isNaN(id) || id <= 0) {
      throw new Error("Invalid user ID");
    }

    const ok = await this.userRepository.delete(id);
    if (!ok) throw new Error("User not found");
  }

  private validateRegistration(data: RegisterDTO): void {
    if (!data.name || data.name.trim().length < 2) {
      throw new Error("Name must be at least 2 characters");
    }
    if (!data.email) throw new Error("Email is required");
    if (!this.isValidEmail(data.email)) {
      throw new Error("Invalid email format");
    }
    if (!data.password || data.password.length < 6) {
      throw new Error("Password must be at least 6 characters");
    }
  }

  private validateUpdate(data: UpdateUserDTO): void {
    if (data.name !== undefined && data.name.trim().length < 2) {
      throw new Error("Name must be at least 2 characters");
    }
    if (data.email !== undefined && !this.isValidEmail(data.email)) {
      throw new Error("Invalid email format");
    }
  }

  private isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
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
