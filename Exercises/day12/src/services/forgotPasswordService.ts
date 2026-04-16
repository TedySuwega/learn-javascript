import { randomBytes } from "crypto";
import { IUserRepository } from "../repositories/userRepository";
import { passwordCrypto, SALT_ROUNDS, validatePassword } from "./passwordUtils";

type ResetEntry = {
  userId: number;
  expiresAt: Date;
};

/**
 * In-memory reset tokens (Exercise 3). In production, tokens would be emailed
 * and might live in Redis or a DB table.
 */
export class ForgotPasswordService {
  private readonly tokenStore = new Map<string, ResetEntry>();
  private readonly tokenTtlMs = 3600_000;

  constructor(private userRepository: IUserRepository) {
    console.log("[Service] ForgotPasswordService initialized");
  }

  /**
   * Creates a reset token and stores it in memory.
   * Returns the token for learning/demos; a real app would email a link instead.
   */
  async requestReset(email: string): Promise<string> {
    const norm = email.toLowerCase().trim();
    console.log(`[ForgotPasswordService] requestReset: ${norm}`);

    const user = await this.userRepository.findByEmail(norm);
    if (!user) {
      throw new Error("User not found");
    }

    const token = randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + this.tokenTtlMs);
    this.tokenStore.set(token, { userId: user.id, expiresAt });

    console.log("[ForgotPasswordService] Token issued (in production, send by email only)");
    return token;
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    console.log("[ForgotPasswordService] resetPassword");

    const entry = this.tokenStore.get(token);
    if (!entry || Date.now() > entry.expiresAt.getTime()) {
      if (entry) {
        this.tokenStore.delete(token);
      }
      throw new Error("Invalid or expired reset token");
    }

    const user = await this.userRepository.findById(entry.userId);
    if (!user) {
      this.tokenStore.delete(token);
      throw new Error("User not found");
    }

    validatePassword(newPassword);

    const isSamePassword = await passwordCrypto.compare(newPassword, user.password);
    if (isSamePassword) {
      throw new Error("New password must be different from current password");
    }

    const hashedPassword = await passwordCrypto.hash(newPassword, SALT_ROUNDS);
    await this.userRepository.update(entry.userId, { password: hashedPassword });
    this.tokenStore.delete(token);

    console.log("[ForgotPasswordService] Password updated; token consumed");
  }
}
