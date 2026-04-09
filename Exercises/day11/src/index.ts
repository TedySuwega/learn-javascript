// Test Service Layer
import { productRepository } from "./repositories/productRepository";
import { userRepository } from "./repositories/userRepository";
import { ProductService } from "./services/productService";
import { UserService } from "./services/userService";

async function main() {
    console.log("=== Day 11: Service Layer Basics ===\n");
    
    // Create service with repository dependency
    const userService = new UserService(userRepository);
    
    // Test: Get all users
    console.log("--- TEST: Get All Users ---");
    const allUsers = await userService.getAllUsers();
    console.log("Users (without passwords):", allUsers);
    
    // Test: Get user by ID
    console.log("\n--- TEST: Get User By ID ---");
    try {
        const user = await userService.getUserById(1);
        console.log("Found user:", user);
    } catch (error: any) {
        console.log("Error:", error.message);
    }
    
    // Test: Get non-existent user
    console.log("\n--- TEST: Get Non-existent User ---");
    try {
        await userService.getUserById(999);
    } catch (error: any) {
        console.log("Expected error:", error.message);
    }
    
    // Test: Register new user
    console.log("\n--- TEST: Register New User ---");
    try {
        const newUser = await userService.register({
            name: "Diana Prince",
            email: "diana@example.com",
            password: "wonder123"
        });
        console.log("Registered:", newUser);
    } catch (error: any) {
        console.log("Error:", error.message);
    }
    
    // Test: Register with existing email
    console.log("\n--- TEST: Register Duplicate Email ---");
    try {
        await userService.register({
            name: "Another Alice",
            email: "alice@example.com",  // Already exists
            password: "password123"
        });
    } catch (error: any) {
        console.log("Expected error:", error.message);
    }
    
    // Test: Register with invalid data
    console.log("\n--- TEST: Register Invalid Data ---");
    const invalidCases = [
        { name: "A", email: "test@test.com", password: "123456" },  // Name too short
        { name: "Valid Name", email: "invalid-email", password: "123456" },  // Invalid email
        { name: "Valid Name", email: "test@test.com", password: "123" }  // Password too short
    ];
    
    for (const invalidData of invalidCases) {
        try {
            await userService.register(invalidData);
        } catch (error: any) {
            console.log(`Invalid [${JSON.stringify(invalidData)}]: ${error.message}`);
        }
    }

    // Show current state
    console.log("\n--- Current Users ---");
    const currentUsers = await userService.getAllUsers();
    currentUsers.forEach(u => console.log(`  ${u.id}: ${u.name} (${u.email}) (${u.isActive ? "Active" : "Inactive"})`));

    // Test: Update profile
    console.log("\n--- TEST: Update Profile ---");
    try {
        const updatedUser = await userService.updateProfile(2, {
            name: "Bruce Wayne",
            email: "bruce@example.com"
        });
        console.log("Updated:", updatedUser);
    } catch (error: any) {
        console.log("Error:", error.message);
    }

    // Test: Deactivate account
    console.log("\n--- TEST: Deactivate Account ---");
    try {
        await userService.deactivateAccount(1);
        console.log("Account deactivated");
    } catch (error: any) {
        console.log("Error:", error.message);
    }

    // Show final state
    console.log("\n--- Final Users ---");
    const finalUsers = await userService.getAllUsers();
    finalUsers.forEach(u => console.log(`  ${u.id}: ${u.name} (${u.email}) (${u.isActive ? "Active" : "Inactive"})`));
    
    console.log("\n=== All Tests Completed ===");
}

async function testProductService() {
    console.log("=== Day 11: Product Service Basics ===\n");

    // Create service with repository dependency
    const productService = new ProductService(productRepository);

    // Test: Get all products
    console.log("--- TEST: Get All Products ---");
    const products = await productService.getAllProducts();
    console.log("Products:", products);

    // Test: Get product by ID
    console.log("\n--- TEST: Get Product By ID ---");
    const product = await productService.getProductById(1);
    console.log("Product:", product);

    // Test: Create product
    console.log("\n--- TEST: Create Product ---");
    const newProduct = await productService.createProduct({
        name: "New Product",
        price: 100,
        stock: 10,
        category: "Electronics"
    });
    console.log("Created:", newProduct);

    // Test: Create product with invalid data
    console.log("\n--- TEST: Create Product With Invalid Data ---");
    const invalidCases = [
        { name: "A", price: 0, stock: 10, category: "Electronics" },
        { name: "Valid Name", price: 0, stock: 10, category: "Electronics" },
        { name: "Valid Name", price: 100, stock: -1, category: "Electronics" }
    ];

    for (const invalidData of invalidCases) {
        try {
            await productService.createProduct(invalidData);
        } catch (error: any) {
            console.log(`Invalid [${JSON.stringify(invalidData)}]: ${error.message}`);
        }
    }
}

testProductService().catch(console.error);

// main().catch(console.error);
