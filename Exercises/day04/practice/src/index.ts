// Entry point - Simulate HTTP requests
import { userController } from "./controllers/userController";

console.log("=== Testing Layered Architecture ===\n");

// Test 1: Register a user
console.log("--- Test 1: Register User ---");
const registerResult = userController.register({
  body: { email: "john@example.com", password: "password123" },
  params: {},
});
console.log("Response:", registerResult);

// Test 2: Try to register same email
console.log("\n--- Test 2: Duplicate Email ---");
const duplicateResult = userController.register({
  body: { email: "john@example.com", password: "another123" },
  params: {},
});
console.log("Response:", duplicateResult);

// Test 3: Invalid email
console.log("\n--- Test 3: Invalid Email ---");
const invalidResult = userController.register({
  body: { email: "invalid-email", password: "password123" },
  params: {},
});
console.log("Response:", invalidResult);

// Test 4: Get user by ID
console.log("\n--- Test 4: Get User by ID ---");
const getUserResult = userController.getById({
  body: {},
  params: { id: "1" },
});
console.log("Response:", getUserResult);

// Test 5: Get all users
console.log("\n--- Test 5: Get All Users ---");
const getAllResult = userController.getAll();
console.log("Response:", getAllResult);
