// Entry point - Simulate HTTP requests
import { productController } from "./controllers/productController";

console.log("=== Testing Layered Architecture ===\n");

// Test 1: Register a product
console.log("--- Test 1: Register Product ---");
const registerResult = productController.register({
  body: { name: "Product 1", price: 100, description: "Description 1", stock: 10, category: "Category 1", isActive: true },
  params: { id: "1" },
});
console.log("Response:", registerResult);

// Test 2: Try to register same product
console.log("\n--- Test 2: Duplicate Product ---");
const duplicateResult = productController.register({
  body: { name: "Product 1", price: 100, description: "Description 1", stock: 10, category: "Category 1", isActive: true },
  params: { id: "1" },
});
console.log("Response:", duplicateResult);

// Test 3: Invalid name
console.log("\n--- Test 3: Invalid Name ---");
const invalidResult = productController.register({
  body: { name: "Pr", price: 0, description: "Description 1", stock: 10, category: "Category 1", isActive: true },
  params: { id: "1" },
});
console.log("Response:", invalidResult);

// Test 4: Get product by ID
console.log("\n--- Test 4: Get Product by ID ---");
const getProductResult = productController.getById({
  body: {},
  params: { id: "1" },
});
console.log("Response:", getProductResult);

// Test 5: Get all products
console.log("\n--- Test 5: Get All Products ---");
const getAllResult = productController.getAll();
console.log("Response:", getAllResult);
