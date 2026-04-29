import { FastifyRequest, FastifyReply } from "fastify";
import { UserService } from "../services/userService";

// Type definitions for request parameters
interface GetByIdParams {
    id: string;
}

interface CreateUserBody {
    name: string;
    email: string;
    password: string;
}

interface LoginBody {
    email: string;
    password: string;
}

export class UserController {
    constructor(private userService: UserService) {
        console.log("[Controller] UserController initialized");
    }
    
    // ============ GET /users ============
    async getAll(request: FastifyRequest, reply: FastifyReply) {
        console.log("[Controller] GET /users");
        
        try {
            const users = await this.userService.getAllUsers();
            
            return reply.status(200).send({
                success: true,
                data: { users },
                count: users.length
            });
        } catch (error: any) {
            console.log("[Controller] Error:", error.message);
            return reply.status(500).send({
                success: false,
                error: "Internal server error"
            });
        }
    }
    
    // ============ GET /users/:id ============
    async getById(
        request: FastifyRequest<{ Params: GetByIdParams }>,
        reply: FastifyReply
    ) {
        const { id } = request.params;
        console.log(`[Controller] GET /users/${id}`);
        
        try {
            // Parse and validate ID
            const userId = parseInt(id);
            if (isNaN(userId)) {
                return reply.status(400).send({
                    success: false,
                    error: "Invalid user ID format"
                });
            }
            
            const user = await this.userService.getUserById(userId);
            
            return reply.status(200).send({
                success: true,
                data: { user }
            });
        } catch (error: any) {
            console.log("[Controller] Error:", error.message);
            
            // Map error to appropriate status code
            const statusCode = this.mapErrorToStatus(error);
            return reply.status(statusCode).send({
                success: false,
                error: error.message
            });
        }
    }
    
    // ============ POST /users/register ============
    async register(
        request: FastifyRequest<{ Body: CreateUserBody }>,
        reply: FastifyReply
    ) {
        console.log("[Controller] POST /users/register");
        
        try {
            const { name, email, password } = request.body;
            
            // Basic presence check (detailed validation in service)
            if (!name || !email || !password) {
                return reply.status(400).send({
                    success: false,
                    error: "Name, email, and password are required"
                });
            }
            
            const user = await this.userService.register({ name, email, password });
            
            return reply.status(201).send({
                success: true,
                data: { user },
                message: "User registered successfully"
            });
        } catch (error: any) {
            console.log("[Controller] Error:", error.message);
            
            const statusCode = this.mapErrorToStatus(error);
            return reply.status(statusCode).send({
                success: false,
                error: error.message
            });
        }
    }
    
    // ============ POST /users/login ============
    async login(
        request: FastifyRequest<{ Body: LoginBody }>,
        reply: FastifyReply
    ) {
        console.log("[Controller] POST /users/login");
        
        try {
            const { email, password } = request.body;
            
            if (!email || !password) {
                return reply.status(400).send({
                    success: false,
                    error: "Email and password are required"
                });
            }
            
            const result = await this.userService.login({ email, password });
            
            return reply.status(200).send({
                success: true,
                data: result
            });
        } catch (error: any) {
            console.log("[Controller] Error:", error.message);
            
            // Login errors should be 401
            if (error.message.includes("Invalid email or password")) {
                return reply.status(401).send({
                    success: false,
                    error: error.message
                });
            }
            
            const statusCode = this.mapErrorToStatus(error);
            return reply.status(statusCode).send({
                success: false,
                error: error.message
            });
        }
    }

    // ============ DELETE /users/:id ============
    async deleteUser(
        request: FastifyRequest<{ Params: { id: string } }>,
        reply: FastifyReply
    ) {
        console.log("[Controller] DELETE /users/:id");
        
        try {
            const userId = parseInt(request.params.id);
            if (isNaN(userId)) {
                return reply.status(400).send({
                    success: false,
                    error: "Invalid user ID format"
                });
            }
            if (userId <= 0) {
                return reply.status(400).send({
                    success: false,
                    error: "Invalid user ID"
                });
            }
            const user = await this.userService.getUserById(userId);
            if (!user) {
                return reply.status(404).send({
                    success: false,
                    error: "User not found"
                });
            }
            await this.userService.deleteUser(userId);
            return reply.status(204).send({
                success: true,
                message: "User deleted successfully"
            });
        } catch (error: any) {
            console.log("[Controller] Error:", error.message);
            const statusCode = this.mapErrorToStatus(error);
            return reply.status(statusCode).send({
                    success: false,
                error: error.message
            });
        }
    }   
    // ============ HELPER: Error to Status Code ============
    private mapErrorToStatus(error: Error): number {
        const message = error.message.toLowerCase();
        
        if (message.includes("not found")) {
            return 404;
        }
        if (message.includes("already") || 
            message.includes("invalid") || 
            message.includes("required") ||
            message.includes("must be")) {
            return 400;
        }
        if (message.includes("unauthorized")) {
            return 401;
        }
        if (message.includes("forbidden")) {
            return 403;
        }
        
        return 500;
    }
}
