// Entry point - where the application starts
import { config } from "./config";
import { createUser, getAllUsers, getUserById } from "./services/userServices";

console.log(`Starting ${config.appName}...`);
console.log(`Environment: ${config.environment}`);

// Test our service
const user1 = createUser({ name: "Alice", email: "alice@example.com" });
const user2 = createUser({ name: "Bob", email: "bob@example.com" });

console.log("\nAll users:", getAllUsers());
console.log("\nUser with ID 1:", getUserById(1));
console.log("\nUser with ID 99:", getUserById(99)); // undefined
