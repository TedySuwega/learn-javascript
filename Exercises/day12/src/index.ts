// Test Service Layer Security
import { userRepository } from "./repositories/userRepository";
import { ForgotPasswordService } from "./services/forgotPasswordService";
import { UserService } from "./services/userService";

async function main() {
  console.log("=== Day 12: Service Layer Security ===\n");

  const userService = new UserService(userRepository);
  const forgotPasswordService = new ForgotPasswordService(userRepository);

  // Test: Register with password hashing
  console.log("--- TEST: Register (Password Hashing) ---");
  try {
    const newUser = await userService.register({
      name: "Bruce Wayne",
      email: "bruce@wayne.com",
      password: "Batman123!",
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
      password: "Batman123!",
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
      password: "wrongpassword",
    });
  } catch (error: any) {
    console.log("Expected error:", error.message);
  }

  // Test: Login with non-existent email
  console.log("\n--- TEST: Login (Non-existent Email) ---");
  try {
    await userService.login({
      email: "nobody@example.com",
      password: "anypassword",
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

  // Test: Forgot password (Exercise 3 — in-memory token store)
  console.log("\n--- TEST: Forgot Password (request + reset) ---");
  try {
    const token = await forgotPasswordService.requestReset("bruce@wayne.com");
    console.log("(Demo) Reset token issued, length:", token.length);

    await forgotPasswordService.resetPassword(token, "Newpass456!");
    const afterReset = await userService.login({
      email: "bruce@wayne.com",
      password: "Newpass456!",
    });
    console.log("Login after reset:", afterReset.user.email);

    try {
      await forgotPasswordService.resetPassword(token, "ShouldFail!");
    } catch (e: any) {
      console.log("Expected error (reused token):", e.message);
    }
  } catch (error: any) {
    console.log("Forgot password flow error:", error.message);
  }

  // Show that passwords are hashed in storage
  console.log("\n--- Verify Password Hashing ---");
  const allUsers = await userService.getAllUsers();
  console.log("Users in response (no passwords visible):");
  allUsers.forEach((u) => {
    console.log(`  ${u.id}: ${u.name} - ${u.email}`);
    console.log(`      Has password field: ${"password" in u}`);
  });

  console.log("\n=== All Tests Completed ===");
}

main().catch(console.error);
