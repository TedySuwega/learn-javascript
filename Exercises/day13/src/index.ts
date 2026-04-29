import Fastify from "fastify";
import { userRoutes } from "./routes/userRoutes";

const app = Fastify({ logger: false });
const PORT = 3000;

async function main() {
    console.log("=== Day 13: Controller Layer Basics ===\n");
    
    // Register routes
    await app.register(userRoutes);
    
    // Health check
    app.get("/health", async () => ({ status: "ok" }));
    
    // Start server
    await app.listen({ port: PORT });
    console.log(`Server running at http://localhost:${PORT}`);
    
    // Simulate HTTP requests for testing
    console.log("\n--- Simulating HTTP Requests ---\n");
    
    // Test GET /users
    console.log("1. GET /users");
    const getAllResponse = await app.inject({
        method: "GET",
        url: "/users"
    });
    console.log(`   Status: ${getAllResponse.statusCode}`);
    console.log(`   Body: ${getAllResponse.body}\n`);
    
    // Test GET /users/1
    console.log("2. GET /users/1");
    const getByIdResponse = await app.inject({
        method: "GET",
        url: "/users/1"
    });
    console.log(`   Status: ${getByIdResponse.statusCode}`);
    console.log(`   Body: ${getByIdResponse.body}\n`);
    
    // Test GET /users/999 (not found)
    console.log("3. GET /users/999 (not found)");
    const notFoundResponse = await app.inject({
        method: "GET",
        url: "/users/999"
    });
    console.log(`   Status: ${notFoundResponse.statusCode}`);
    console.log(`   Body: ${notFoundResponse.body}\n`);
    
    // Test POST /users/register
    console.log("4. POST /users/register");
    const registerResponse = await app.inject({
        method: "POST",
        url: "/users/register",
        payload: {
            name: "Clark Kent",
            email: "clark@dailyplanet.com",
            password: "superman123"
        }
    });
    console.log(`   Status: ${registerResponse.statusCode}`);
    console.log(`   Body: ${registerResponse.body}\n`);
    
    // Test POST /users/login
    console.log("5. POST /users/login");
    const loginResponse = await app.inject({
        method: "POST",
        url: "/users/login",
        payload: {
            email: "clark@dailyplanet.com",
            password: "superman123"
        }
    });
    console.log(`   Status: ${loginResponse.statusCode}`);
    console.log(`   Body: ${loginResponse.body}\n`);
    
    // Test POST /users/login (wrong password)
    console.log("6. POST /users/login (wrong password)");
    const wrongLoginResponse = await app.inject({
        method: "POST",
        url: "/users/login",
        payload: {
            email: "clark@dailyplanet.com",
            password: "wrongpassword"
        }
    });
    console.log(`   Status: ${wrongLoginResponse.statusCode}`);
    console.log(`   Body: ${wrongLoginResponse.body}\n`);
    
    // Test invalid ID format
    console.log("7. GET /users/abc (invalid ID)");
    const invalidIdResponse = await app.inject({
        method: "GET",
        url: "/users/abc"
    });
    console.log(`   Status: ${invalidIdResponse.statusCode}`);
    console.log(`   Body: ${invalidIdResponse.body}\n`);
    
    console.log("=== All Tests Completed ===");

    // Test DELETE /users/1
    console.log("8. DELETE /users/1");
    const deleteResponse = await app.inject({
        method: "DELETE",
        url: "/users/1"
    });
    console.log(`   Status: ${deleteResponse.statusCode}`);
    console.log(`   Body: ${deleteResponse.body}\n`);

    // Test DELETE /users/999 (not found)
    console.log("9. DELETE /users/999 (not found)");
    const notFoundDeleteResponse = await app.inject({
        method: "DELETE",
        url: "/users/999"
    });
    console.log(`   Status: ${notFoundDeleteResponse.statusCode}`);
    console.log(`   Body: ${notFoundDeleteResponse.body}\n`);

    // Test DELETE /users/abc (invalid ID)
    console.log("10. DELETE /users/abc (invalid ID)");
    const invalidIdDeleteResponse = await app.inject({
        method: "DELETE",
        url: "/users/abc"
    });
    console.log(`   Status: ${invalidIdDeleteResponse.statusCode}`);
    console.log(`   Body: ${invalidIdDeleteResponse.body}\n`);

    // Close server
    await app.close();
}

main().catch(console.error);
