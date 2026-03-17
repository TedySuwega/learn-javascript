# Day 12: Service Layer Security

## 📚 What to Learn Today
- **Read**: [LEARNING_MODULE.md](../../Modules/LEARNING_MODULE.md) - Module 6 (Lines 2501-2921)
- **Time**: ~35 minutes reading, ~25 minutes practice
- **Topics**: Password hashing with bcrypt, ForgotPasswordService, error handling

---

## 📖 Key Concepts

### 1. Why Hash Passwords?

**NEVER store passwords in plain text!**

```typescript
// ❌ TERRIBLE - Plain text password
const user = {
    email: "alice@example.com",
    password: "secret123"  // If database is hacked, password is exposed!
};

// ✅ CORRECT - Hashed password
const user = {
    email: "alice@example.com",
    password: "$2b$10$X7z3..."  // Even if hacked, password is protected
};
```

### 2. What is bcrypt?

**bcrypt** is a password hashing algorithm that:
- Converts passwords into irreversible hashes
- Adds "salt" (random data) to prevent rainbow table attacks
- Is intentionally slow to prevent brute force attacks

```typescript
import bcrypt from "bcrypt";

// Hashing a password
const plainPassword = "secret123";
const saltRounds = 10;  // Higher = more secure but slower
const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);
// Result: "$2b$10$X7z3vQ..."

// Verifying a password
const isMatch = await bcrypt.compare("secret123", hashedPassword);
// Result: true

const isWrong = await bcrypt.compare("wrongpassword", hashedPassword);
// Result: false
```

### 3. Salt Rounds Explained

| Salt Rounds | Time to Hash | Security |
|-------------|--------------|----------|
| 8 | ~40ms | Minimum acceptable |
| 10 | ~100ms | Recommended default |
| 12 | ~300ms | High security |
| 14 | ~1s | Very high security |

```typescript
// The salt is embedded in the hash itself
const hash = "$2b$10$X7z3vQ...";
//            ↑   ↑
//            |   └── Salt rounds (10)
//            └────── Algorithm version (2b)
```

### 4. Updated UserService with Password Hashing

```typescript
import bcrypt from "bcrypt";

export class UserService {
    private readonly SALT_ROUNDS = 10;
    
    async register(data: RegisterDTO): Promise<UserResponse> {
        // Validate
        this.validateRegistration(data);
        
        // Check email uniqueness
        const existing = await this.userRepository.findByEmail(data.email);
        if (existing) {
            throw new Error("Email already registered");
        }
        
        // Hash password before saving
        const hashedPassword = await bcrypt.hash(data.password, this.SALT_ROUNDS);
        
        // Create user with hashed password
        const user = await this.userRepository.create({
            name: data.name,
            email: data.email,
            password: hashedPassword  // Never store plain text!
        });
        
        return this.toUserResponse(user);
    }
    
    async login(data: LoginDTO): Promise<LoginResponse> {
        // Find user by email
        const user = await this.userRepository.findByEmail(data.email);
        if (!user) {
            throw new Error("Invalid email or password");
        }
        
        // Verify password
        const isPasswordValid = await bcrypt.compare(data.password, user.password);
        if (!isPasswordValid) {
            throw new Error("Invalid email or password");
        }
        
        // Check if account is active
        if (!user.isActive) {
            throw new Error("Account is deactivated");
        }
        
        return {
            user: this.toUserResponse(user),
            message: "Login successful"
        };
    }
}
```

### 5. Security Best Practice: Generic Error Messages

```typescript
// ❌ BAD - Reveals too much information
async login(data: LoginDTO) {
    const user = await this.userRepository.findByEmail(data.email);
    if (!user) {
        throw new Error("Email not found");  // Attacker knows email doesn't exist
    }
    
    const valid = await bcrypt.compare(data.password, user.password);
    if (!valid) {
        throw new Error("Wrong password");  // Attacker knows email exists
    }
}

// ✅ GOOD - Generic message
async login(data: LoginDTO) {
    const user = await this.userRepository.findByEmail(data.email);
    if (!user) {
        throw new Error("Invalid email or password");  // Same message
    }
    
    const valid = await bcrypt.compare(data.password, user.password);
    if (!valid) {
        throw new Error("Invalid email or password");  // Same message
    }
}
```

### 6. ForgotPasswordService

```typescript
export class ForgotPasswordService {
    constructor(
        private userRepository: IUserRepository,
        private tokenRepository: ITokenRepository,
        private emailService: IEmailService
    ) {}
    
    async requestPasswordReset(email: string): Promise<void> {
        // Find user (don't reveal if email exists)
        const user = await this.userRepository.findByEmail(email);
        
        if (user) {
            // Generate secure random token
            const token = crypto.randomBytes(32).toString("hex");
            const expiresAt = new Date(Date.now() + 3600000);  // 1 hour
            
            // Save token
            await this.tokenRepository.create({
                userId: user.id,
                token: token,
                type: "password_reset",
                expiresAt: expiresAt
            });
            
            // Send email
            await this.emailService.sendPasswordResetEmail(user.email, token);
        }
        
        // Always return success (don't reveal if email exists)
    }
    
    async resetPassword(token: string, newPassword: string): Promise<void> {
        // Find valid token
        const resetToken = await this.tokenRepository.findByToken(token);
        
        if (!resetToken || resetToken.expiresAt < new Date()) {
            throw new Error("Invalid or expired token");
        }
        
        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        
        // Update user password
        await this.userRepository.update(resetToken.userId, {
            password: hashedPassword
        });
        
        // Delete used token
        await this.tokenRepository.delete(resetToken.id);
    }
}
```

### 7. Change Password Flow

```typescript
async changePassword(
    userId: number,
    currentPassword: string,
    newPassword: string
): Promise<void> {
    // Get user
    const user = await this.userRepository.findById(userId);
    if (!user) {
        throw new Error("User not found");
    }
    
    // Verify current password
    const isCurrentValid = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentValid) {
        throw new Error("Current password is incorrect");
    }
    
    // Validate new password
    if (newPassword.length < 6) {
        throw new Error("New password must be at least 6 characters");
    }
    
    // Don't allow same password
    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) {
        throw new Error("New password must be different from current password");
    }
    
    // Hash and save new password
    const hashedPassword = await bcrypt.hash(newPassword, this.SALT_ROUNDS);
    await this.userRepository.update(userId, { password: hashedPassword });
}
```

---

## 💻 Code to Type & Understand

Extend your Day 11 code in `exercises/day12/`:

**src/services/userService.ts** (updated with security):
```typescript
import { IUserRepository } from "../repositories/userRepository";
import { User, RegisterDTO, LoginDTO, UserResponse, LoginResponse } from "../types/user";

// Simulated bcrypt (for learning without installing bcrypt)
const fakeBcrypt = {
    async hash(password: string, rounds: number): Promise<string> {
        // In real app, use: import bcrypt from "bcrypt"
        return `$2b$${rounds}$FAKE_HASH_${password.split("").reverse().join("")}`;
    },
    async compare(password: string, hash: string): Promise<boolean> {
        // In real app, use: bcrypt.compare()
        const reversed = password.split("").reverse().join("");
        return hash.includes(reversed);
    }
};

export class UserService {
    private readonly SALT_ROUNDS = 10;
    
    constructor(private userRepository: IUserRepository) {
        console.log("[Service] UserService initialized");
    }
    
    // ============ AUTHENTICATION ============
    
    async register(data: RegisterDTO): Promise<UserResponse> {
        console.log("[Service] register");
        
        // Step 1: Validate input
        this.validateRegistration(data);
        
        // Step 2: Check if email already exists
        const existingUser = await this.userRepository.findByEmail(data.email);
        if (existingUser) {
            throw new Error("Email already registered");
        }
        
        // Step 3: Hash password (SECURITY!)
        console.log("[Service] Hashing password...");
        const hashedPassword = await fakeBcrypt.hash(data.password, this.SALT_ROUNDS);
        console.log("[Service] Password hashed successfully");
        
        // Step 4: Create user with hashed password
        const newUser = await this.userRepository.create({
            name: data.name.trim(),
            email: data.email.toLowerCase().trim(),
            password: hashedPassword
        });
        
        console.log("[Service] User registered successfully");
        return this.toUserResponse(newUser);
    }
    
    async login(data: LoginDTO): Promise<LoginResponse> {
        console.log("[Service] login attempt");
        
        // Step 1: Validate input
        if (!data.email || !data.password) {
            throw new Error("Email and password are required");
        }
        
        // Step 2: Find user by email
        const user = await this.userRepository.findByEmail(data.email.toLowerCase());
        
        // Step 3: Check if user exists (generic error message!)
        if (!user) {
            console.log("[Service] User not found");
            throw new Error("Invalid email or password");  // Don't reveal which is wrong!
        }
        
        // Step 4: Verify password
        console.log("[Service] Verifying password...");
        const isPasswordValid = await fakeBcrypt.compare(data.password, user.password);
        
        if (!isPasswordValid) {
            console.log("[Service] Password mismatch");
            throw new Error("Invalid email or password");  // Same message!
        }
        
        // Step 5: Check if account is active
        if (!user.isActive) {
            throw new Error("Account is deactivated");
        }
        
        console.log("[Service] Login successful");
        return {
            user: this.toUserResponse(user),
            message: "Login successful"
        };
    }
    
    async changePassword(
        userId: number,
        currentPassword: string,
        newPassword: string
    ): Promise<void> {
        console.log(`[Service] changePassword for user: ${userId}`);
        
        // Step 1: Get user
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new Error("User not found");
        }
        
        // Step 2: Verify current password
        const isCurrentValid = await fakeBcrypt.compare(currentPassword, user.password);
        if (!isCurrentValid) {
            throw new Error("Current password is incorrect");
        }
        
        // Step 3: Validate new password
        this.validatePassword(newPassword);
        
        // Step 4: Check not same as current
        const isSamePassword = await fakeBcrypt.compare(newPassword, user.password);
        if (isSamePassword) {
            throw new Error("New password must be different from current password");
        }
        
        // Step 5: Hash and save
        const hashedPassword = await fakeBcrypt.hash(newPassword, this.SALT_ROUNDS);
        await this.userRepository.update(userId, { password: hashedPassword });
        
        console.log("[Service] Password changed successfully");
    }
    
    // ============ READ OPERATIONS ============
    
    async getAllUsers(): Promise<UserResponse[]> {
        const users = await this.userRepository.findAll();
        return users.map(user => this.toUserResponse(user));
    }
    
    async getUserById(id: number): Promise<UserResponse> {
        if (id <= 0) {
            throw new Error("Invalid user ID");
        }
        
        const user = await this.userRepository.findById(id);
        if (!user) {
            throw new Error("User not found");
        }
        
        return this.toUserResponse(user);
    }
    
    // ============ VALIDATION ============
    
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
        
        this.validatePassword(data.password);
    }
    
    private validatePassword(password: string): void {
        if (!password) {
            throw new Error("Password is required");
        }
        
        if (password.length < 6) {
            throw new Error("Password must be at least 6 characters");
        }
        
        if (password.length > 100) {
            throw new Error("Password must be less than 100 characters");
        }
    }
    
    // ============ HELPERS ============
    
    private toUserResponse(user: User): UserResponse {
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            isActive: user.isActive,
            createdAt: user.createdAt
        };
    }
}
```

**src/index.ts**:
```typescript
// Test Service Layer Security
import { userRepository } from "./repositories/userRepository";
import { UserService } from "./services/userService";

async function main() {
    console.log("=== Day 12: Service Layer Security ===\n");
    
    const userService = new UserService(userRepository);
    
    // Test: Register with password hashing
    console.log("--- TEST: Register (Password Hashing) ---");
    try {
        const newUser = await userService.register({
            name: "Bruce Wayne",
            email: "bruce@wayne.com",
            password: "batman123"
        });
        console.log("Registered:", newUser);
        console.log("(Password is hashed in database, not visible in response)");
    } catch (error: any) {
        console.log("Error:", error.message);
    }
    
    // Test: Login with correct password
    console.log("\n--- TEST: Login (Correct Password) ---");
    try {
        const result = await userService.login({
            email: "bruce@wayne.com",
            password: "batman123"
        });
        console.log("Login result:", result);
    } catch (error: any) {
        console.log("Error:", error.message);
    }
    
    // Test: Login with wrong password
    console.log("\n--- TEST: Login (Wrong Password) ---");
    try {
        await userService.login({
            email: "bruce@wayne.com",
            password: "wrongpassword"
        });
    } catch (error: any) {
        console.log("Expected error:", error.message);
    }
    
    // Test: Login with non-existent email
    console.log("\n--- TEST: Login (Non-existent Email) ---");
    try {
        await userService.login({
            email: "nobody@example.com",
            password: "anypassword"
        });
    } catch (error: any) {
        console.log("Expected error:", error.message);
        console.log("(Notice: Same error message - doesn't reveal if email exists)");
    }
    
    // Test: Change password
    console.log("\n--- TEST: Change Password ---");
    try {
        // First, get a user ID
        const users = await userService.getAllUsers();
        const userId = users[0]?.id;
        
        if (userId) {
            // This would fail because we need the correct current password
            // In real scenario, user provides their current password
            console.log("Change password requires current password verification");
        }
    } catch (error: any) {
        console.log("Error:", error.message);
    }
    
    // Show that passwords are hashed in storage
    console.log("\n--- Verify Password Hashing ---");
    const allUsers = await userService.getAllUsers();
    console.log("Users in response (no passwords visible):");
    allUsers.forEach(u => {
        console.log(`  ${u.id}: ${u.name} - ${u.email}`);
        console.log(`      Has password field: ${"password" in u}`);
    });
    
    console.log("\n=== All Tests Completed ===");
}

main().catch(console.error);
```

---

## ✍️ Exercises

### Exercise 1: Implement Real bcrypt
Install bcrypt and replace the fake implementation:
```bash
npm install bcrypt
npm install -D @types/bcrypt
```
Update the service to use real bcrypt.

### Exercise 2: Add Password Strength Validation
Enhance `validatePassword()` to check:
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character (!@#$%^&*)

### Exercise 3: Create ForgotPasswordService
Create a simplified ForgotPasswordService with:
- `requestReset(email: string)` - Generates and "stores" a token
- `resetPassword(token: string, newPassword: string)` - Validates token and updates password
- Use an in-memory token store for simplicity

---

## ❓ Quiz Questions

### Q1: Why Hash?
Why should passwords be hashed instead of stored in plain text?

**Your Answer**: 


### Q2: Generic Errors
Why do we use the same error message "Invalid email or password" for both wrong email and wrong password?

**Your Answer**: 


### Q3: Salt Rounds
What are salt rounds in bcrypt and how do they affect security?

**Your Answer**: 


---

## 📝 Bonus Questions (Optional)

### B1: What is a "rainbow table attack" and how does bcrypt's salt prevent it?

**Your Answer**: 


### B2: Why should the forgot password endpoint always return success, even if the email doesn't exist?

**Your Answer**: 


---

## ✅ Day 12 Checklist

- [ ] Read Module 6 (Lines 2501-2921)
- [ ] Understand why password hashing is essential
- [ ] Understand how bcrypt works (hash and compare)
- [ ] Understand salt rounds
- [ ] Understand generic error messages for security
- [ ] Understand forgot password flow
- [ ] Type all code examples
- [ ] Complete Exercise 1 (Real bcrypt)
- [ ] Complete Exercise 2 (Password strength)
- [ ] Complete Exercise 3 (ForgotPasswordService)
- [ ] Answer all quiz questions
- [ ] Update Progress.md

---

## 🔗 Next Day Preview
Tomorrow you'll learn about the **Controller Layer** - handling HTTP requests, status codes, and connecting routes to services.
