// ============================================
// ENTRY POINT - Where the application starts
// ============================================

import { connect, connectWithRetry, disconnect, isConnected } from "./database/connection";
import { UserRepository } from "./repositories/userRepository";
import { NotFoundError, DatabaseError, handleError } from "./errors/customErrors";
import { ProductRepository } from "./repositories/productRepository";

const userRepository = new UserRepository();

async function main() {
    console.log("=== Day 06: Database Connection & Error Handling ===\n");

    // Test 1: [User] Try to use repository before connecting
    console.log("--- Test 1: [User] Before Connection ---");
    try {
        await userRepository.findAll();
    } catch (error) {
        if (error instanceof DatabaseError) {
            console.log("Caught DatabaseError:", error.message);
        }
    }
    // Test 2: [User] Connect with wrong password (comment if you want to test connect with retry)
    console.log("\n--- Test 2: [User] Wrong Password ---");
    try {
        await connect({
            host: "localhost",
            port: 5432,
            database: "myapp",
            username: "admin",
            password: "wrong"
        });
    } catch (error) {
        console.log("Caught connection error:", (error as Error).message);
    }

    // Test 2.1: [User] Connect with retry wrong password (comment if you want to test connect without retry)
    // console.log("\n--- Test 2.1: [User] Connect with Retry ---");
    // try {
    //     await connectWithRetry({
    //         host: "localhost",
    //         port: 5432,
    //         database: "myapp",
    //         username: "admin",
    //         password: "wrong"
    //     });
    // } catch (error) {
    //     console.log("Connection failed:", error);
    //     process.exit(1);
    // }

    // Test 3: [User] Connect successfully (comment if you want to test connect with retry)
    // console.log("\n--- Test 3: [User] Successful Connection ---");
    // try {
    //     await connect({
    //         host: "localhost",
    //         port: 5432,
    //         database: "myapp",
    //         username: "admin",
    //         password: "correct"
    //     });
    // } catch (error) {
    //     console.log("Connection failed:", error);
    //     process.exit(1);
    // }

    // Test 3.1: [User] Connect with retry (comment if you want to test connect without retry)
    console.log("\n--- Test 3.1: [User] Connect with Retry ---");
    const listPassword = ["wrong", "wrong", "correct"];
    for (const password of listPassword) {
        try {
            await connectWithRetry({
                host: "localhost",
                port: 5432,
                database: "myapp",
                username: "admin"
            }, listPassword);
        } catch (error) {
            console.log("Connection failed:", error);
            process.exit(1);
        }
    }
    
    
    // Test 5: [User] Handle NotFoundError
    console.log("\n--- Test 5: [User] Not Found ---");
    try {
        await userRepository.findById(999);
    } catch (error) {
        if (error instanceof NotFoundError) {
            console.log("Caught NotFoundError:", error.message);
            console.log("Status code:", error.statusCode);
        }
    }
    
    // Test 6: [User] Graceful shutdown
    console.log("\n--- Test 6: [User] Graceful Shutdown ---");
    await disconnect();
    
    console.log("\n=== All tests completed ===");
}

const productRepository = new ProductRepository();
async function mainProduct() {
    console.log("=== Day 06: Product Repository ===\n");

    // Test 1: [Product] Try to use repository before connecting
    console.log("--- Test 1: [Product] Before Connection ---");
    try {
        await productRepository.findAll();
    } catch (error) {
        if (error instanceof DatabaseError) {
        console.log("Caught DatabaseError:", error.message);
        }
    }
    // Test 2: [Product] Connect with wrong password (comment if you want to test connect with retry)
    console.log("\n--- Test 2: [Product] Wrong Password ---");
    try {
        await connect({
        host: "localhost",
        port: 5432,
        database: "myapp",
        username: "admin",
        password: "wrong",
        });
    } catch (error) {
        const response = handleError(error as Error);
        console.log(`Status: ${response.status}, Message: ${response.message}`);
    }
    // Test 2.1: [Product] Connect with retry wrong password (comment if you want to test connect without retry)
    // console.log("\n--- Test 2.1: [Product] Connect with Retry ---");
    // try {
    //     await connectWithRetry({
    //     host: "localhost",
    //     port: 5432,
    //     database: "myapp",
    //     username: "admin",
    //     password: "wrong",
    //     });
    // } catch (error) {
    //     const response = handleError(error as Error);
    //     console.log(`Status: ${response.status}, Message: ${response.message}`);
    //     process.exit(1);
    // }
    // Test 3: [Product] Connect successfully (comment if you want to test connect with retry)
    // console.log("\n--- Test 3: [Product] Successful Connection ---");
    // try {
    //     await connect({
    //     host: "localhost",
    //     port: 5432,
    //     database: "myapp",
    //     username: "admin",
    //     password: "correct",
    //     });
    // } catch (error) {
    //     const response = handleError(error as Error);
    //     console.log(`Status: ${response.status}, Message: ${response.message}`);
    //     process.exit(1);
    // }
    // Test 3.1: [Product] Connect with retry (comment if you want to test connect without retry)
    console.log("\n--- Test 3.1: [Product] Connect with Retry ---");
    const listPassword = ["wrong", "wrong", "correct"];
    try {
        await connectWithRetry({
            host: "localhost",
            port: 5432,
            database: "myapp",  
            username: "admin"
        }, listPassword);
    } catch (error) {
        const response = handleError(error as Error);
        console.log(`Status: ${response.status}, Message: ${response.message}`);
        process.exit(1);
    }
    
    // Test 4: [Product] Find all products
    console.log("\n--- Test 4: [Product] Find all products ---");
    try {
        const products = await productRepository.findAll();
        console.log("Products:", products);
    } catch (error) {
        const response = handleError(error as Error);
        console.log(`Status: ${response.status}, Message: ${response.message}`);
    }
    // Test 5: [Product] Find product by id
    console.log("\n--- Test 5: [Product] Find product by id ---");
    try {
        const product = await productRepository.findById(1);
        console.log("Product:", product);
    } catch (error) {
        const response = handleError(error as Error);
        console.log(`Status: ${response.status}, Message: ${response.message}`);
    }
    // Test 6: [Product] Delete product
    console.log("\n--- Test 6: [Product] Delete product ---");
    try {
        await productRepository.delete(1);
        console.log("Product deleted");
    } catch (error) {
        const response = handleError(error as Error);
        console.log(`Status: ${response.status}, Message: ${response.message}`);
    }
    // Test 7: [Product] Graceful shutdown
    console.log("\n--- Test 7: [Product] Graceful Shutdown ---");
    await disconnect();
    console.log("\n=== All tests completed ===");
}

// Handle unexpected errors
process.on("uncaughtException", (error) => {
    console.error("Uncaught Exception:", error);
    process.exit(1);
});

process.on("unhandledRejection", (reason) => {
    console.error("Unhandled Rejection:", reason);
    process.exit(1);
});

// Run
main(); // user repository
// mainProduct(); // product repository