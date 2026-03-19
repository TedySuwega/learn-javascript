import { userRepository } from "./repositories/userRepository";
import { productRepository } from "./repositories/productRepository";

async function main() {
    console.log("=== Day 09: Repository Layer Basics ===");

    // Test 1: findAll
    console.log("\n" + "=".repeat(50));
    console.log("TEST 1: Find All Users");
    console.log("=".repeat(50));

    const allUsers = await userRepository.findAll();
    console.log("\nResult:");
    allUsers.users.forEach(user => {
        console.log(`  - ${user.id}: ${user.name} (${user.email})`);
    });

    // Test 2: findAll with filter
    console.log("\n" + "=".repeat(50));
    console.log("TEST 2: Find Active Users Only");
    console.log("=".repeat(50));

    const activeUsers = await userRepository.findAll({ filters: { isActive: true } });
    console.log("\nResult:");
    activeUsers.users.forEach(user => {
        console.log(`  - ${user.id}: ${user.name} (active: ${user.isActive})`);
    });

    console.log("\nTotal users:", allUsers.total);
    console.log("\nPage:", allUsers.page);
    console.log("\nTotal pages:", allUsers.totalPages);
    
    // Test 3: findById - existing user
    console.log("\n" + "=".repeat(50));
    console.log("TEST 3: Find User by ID (exists)");
    console.log("=".repeat(50));

    const user1 = await userRepository.findById(1);
    console.log("\nResult:", user1);
    
    // Test 4: findById - non-existing user
    console.log("\n" + "=".repeat(50));
    console.log("TEST 4: Find User by ID (not exists)");
    console.log("=".repeat(50));

    const user999 = await userRepository.findById(999);
    console.log("\nResult:", user999);
    
    // Test 5: findByEmail
    console.log("\n" + "=".repeat(50));
    console.log("TEST 5: Find User by Email");
    console.log("=".repeat(50));

    const userByEmail = await userRepository.findByEmail("alice@example.com");
    console.log("\nResult:", userByEmail?.name);
    
    // Test 6: emailExists
    console.log("\n" + "=".repeat(50));
    console.log("TEST 6: Check Email Exists");
    console.log("=".repeat(50));

    const exists1 = await userRepository.emailExists("alice@example.com");
    const exists2 = await userRepository.emailExists("nobody@example.com");
    const exists3 = await userRepository.emailExists("charlie@example.com");
    console.log("\nalice@example.com exists:", exists1);
    console.log("nobody@example.com exists:", exists2);
    console.log("charlie@example.com exists:", exists3);

    // Test 7: count
    console.log("\n" + "=".repeat(50));
    console.log("TEST 7: Count Users");
    console.log("=".repeat(50));

    const count = await userRepository.count();
    console.log("\nTotal users:", count);
    const nonActiveCount = await userRepository.count({ isActive: false });
    console.log("\nNon-active users:", nonActiveCount);
    
    // Test 8: search
    console.log("\n" + "=".repeat(50));
    console.log("TEST 8: Search Users");
    console.log("=".repeat(50));

    const searchResult = await userRepository.search("Alice");
    console.log("\nSearch result:", searchResult.map(user => user.name));
    
    //Product 
    // Test 9: findAll with pagination
    console.log("\n" + "=".repeat(50));
    console.log("TEST 9: Find All Products");
    console.log("=".repeat(50));

    const allProducts = await productRepository.findAll();
    console.log("\nResult:");
    allProducts.products.forEach(product => {
        console.log(`  - ${product.id}: ${product.name} (${product.price})`);
    });

    console.log("\nTotal products:", allProducts.total);
    console.log("\nPage:", allProducts.page);
    console.log("\nTotal pages:", allProducts.totalPages);

    // Test 10: findById
    console.log("\n" + "=".repeat(50));
    console.log("TEST 10: Find Product by ID");
    console.log("=".repeat(50));

    const product1 = await productRepository.findById(1);
    console.log("\nResult:", product1);

    // Test 11: findByCategory
    console.log("\n" + "=".repeat(50));
    console.log("TEST 11: Find Product by Category");
    console.log("=".repeat(50));

    const productByCategory = await productRepository.findByCategory("Category 1");
    console.log("\nResult:", productByCategory?.name);

    // Test 12: count
    console.log("\n" + "=".repeat(50));
    console.log("TEST 12: Count Products");
    console.log("=".repeat(50));

    const productCount = await productRepository.count();
    console.log("\nTotal products:", productCount);
    const lowStockCount = await productRepository.count({ stock: 10 });
    console.log("\nLow stock products:", lowStockCount);
}

main();