// ============================================
// ENTRY POINT - Where the application starts
// ============================================

import Fastify from "fastify";
import { userRoutes } from "./routes/userRoutes";

// Configuration
const PORT = 3000;
const HOST = "0.0.0.0";

// Create Fastify instance with logging
const app = Fastify({
  logger: true, // Enable request logging
});

// Main function to start the server
async function main() {
  try {
    // Step 1: Register plugins (CORS would go here)
    console.log("📦 Registering plugins...");

    // Step 2: Register routes
    console.log("🛣️  Registering routes...");
    app.register(userRoutes);

    // Step 3: Add a health check route
    app.get("/health", async () => {
      return { status: "ok", timestamp: new Date().toISOString() };
    });

    // Step 4: Add root route
    app.get("/", async () => {
      return {
        message: "Welcome to Day 05 API!",
        endpoints: [
          "GET /health - Health check",
          "GET /users - Get all users",
          "GET /users/:id - Get user by ID",
          "POST /users - Create user",
          "PUT /users/:id - Update user",
          "DELETE /users/:id - Delete user",
        ],
      };
    });

    // Step 5: Start the server
    console.log("🚀 Starting server...");
    await app.listen({ port: PORT, host: HOST });

    console.log(`
╔════════════════════════════════════════════╗
║  🎉 Server is running!                     ║
║  📍 http://localhost:${PORT}                  ║
║  📚 Try: http://localhost:${PORT}/users       ║
╚════════════════════════════════════════════╝
        `);
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
}

// Run the main function
main();
