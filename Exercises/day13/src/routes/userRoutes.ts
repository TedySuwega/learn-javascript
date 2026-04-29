import { FastifyInstance } from "fastify";
import { UserController } from "../controllers/userController";
import { UserService } from "../services/userService";
import { userRepository } from "../repositories/userRepository";

export async function userRoutes(app: FastifyInstance) {
    // Create dependencies
    const userService = new UserService(userRepository);
    const userController = new UserController(userService);
    
    // Register routes (generics satisfy controller request typings)
    app.get("/users", (req, reply) => userController.getAll(req, reply));

    app.get<{ Params: { id: string } }>("/users/:id", (req, reply) =>
        userController.getById(req, reply));

    app.post<{ Body: { name: string; email: string; password: string } }>(
        "/users/register",
        (req, reply) => userController.register(req, reply)
    );

    app.post<{ Body: { email: string; password: string } }>(
        "/users/login",
        (req, reply) => userController.login(req, reply)
    );

    app.delete<{ Params: { id: string } }>(
        "/users/:id",
        (req, reply) => userController.deleteUser(req, reply)
    );
    
    console.log("[Routes] User routes registered");
}
