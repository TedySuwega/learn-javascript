// Entry point - where the application starts
import { config } from "./config";
import { createProduct, getAllProducts, getProductById } from "./services/productService";

console.log(`Starting ${config.appName}...`);
console.log(`Environment: ${config.environment}`);

// Test our service
// const product1 = createProduct({ name: "Laptop", price: 1000, description: "Latest laptop", stock: 10, category: "Electronics", isActive: true });
// const product2 = createProduct({ name: "Phone", price: 500, description: "Latest smartphone", stock: 20, category: "Electronics", isActive: true });

for (let i = 0; i < 10; i++) {
  createProduct({ name: `Product ${i}`, price: i * 100, description: `Description ${i}`, stock: i * 10, category: "Electronics", isActive: true });
}

console.log("\nAll products:", getAllProducts());
console.log("\nProduct with ID 1:", getProductById(1));
console.log("\nProduct with ID 99:", getProductById(99));