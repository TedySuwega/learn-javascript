// CONTROLLER LAYER - Handles HTTP requests
import { userService } from "../services/userService";
import { CreateUserDTO } from "../types/user";

// Simulated HTTP request/response
interface Request {
  body: any;
  params: { id?: string };
}

interface Response {
  status: number;
  data: any;
}

export const userController = {
  // POST /users - Create user
  register(req: Request): Response {
    console.log("[Controller] Received registration request");

    const { email, password } = req.body as CreateUserDTO;

    // Validation
    if (!email || !email.includes("@")) {
      return { status: 400, data: { error: "Invalid email" } };
    }
    if (!password || password.length < 6) {
      return {
        status: 400,
        data: { error: "Password must be at least 6 characters" },
      };
    }

    try {
      const user = userService.register({ email, password });
      return { status: 201, data: user };
    } catch (error: any) {
      return { status: 400, data: { error: error.message } };
    }
  },

  // GET /users/:id - Get user by ID
  getById(req: Request): Response {
    console.log("[Controller] Received get user request");

    const id = parseInt(req.params.id || "0");

    if (!id) {
      return { status: 400, data: { error: "Invalid ID" } };
    }

    const user = userService.getById(id);

    if (!user) {
      return { status: 404, data: { error: "User not found" } };
    }

    return { status: 200, data: user };
  },

  // GET /users - Get all users
  getAll(): Response {
    console.log("[Controller] Received get all users request");
    const users = userService.getAll();
    return { status: 200, data: users };
  },
};
