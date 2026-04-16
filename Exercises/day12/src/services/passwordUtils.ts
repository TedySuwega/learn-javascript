import bcrypt from "bcrypt";

export const SALT_ROUNDS = 10;

/** Real bcrypt — same shape as the old fake helper for services. */
export const passwordCrypto = {
  async hash(password: string, rounds: number): Promise<string> {
    return bcrypt.hash(password, rounds);
  },
  async compare(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  },
};

export function validatePassword(password: string): void {
  if (!password) {
    throw new Error("Password is required");
  }

  if (password.length < 6) {
    throw new Error("Password must be at least 6 characters");
  }

  if (password.length > 100) {
    throw new Error("Password must be less than 100 characters");
  }

  if (!/[A-Z]/.test(password)) {
    throw new Error("Password must contain at least one uppercase letter");
  }

  if (!/[a-z]/.test(password)) {
    throw new Error("Password must contain at least one lowercase letter");
  }

  if (!/[0-9]/.test(password)) {
    throw new Error("Password must contain at least one number");
  }

  if (!/[!@#$%^&*]/.test(password)) {
    throw new Error("Password must contain at least one special character");
  }
}
