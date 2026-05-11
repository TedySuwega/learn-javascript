import { FastifyInstance } from "fastify";
import { UserController } from "../controllers/userController";
import { UserService } from "../services/userService";
import { userRepository } from "../repositories/userRepository";
import {
  CreateUserDTO,
  LoginDTO,
  UpdateUserDTO,
  UserListQuery,
} from "../types/user";
import {
  createUserSchema,
  idParamsSchema,
  listUsersSchema,
  loginSchema,
  patchUserSchema,
  replaceUserSchema,
} from "../schemas/userSchemas";

export async function userRoutes(app: FastifyInstance) {
  const userService = new UserService(userRepository);
  const userController = new UserController(userService);

  app.get<{ Querystring: UserListQuery }>(
    "/users",
    { schema: listUsersSchema },
    (req, reply) => userController.getAll(req, reply),
  );

  app.get<{ Params: { id: string } }>(
    "/users/:id",
    { schema: idParamsSchema },
    (req, reply) => userController.getById(req, reply),
  );

  app.post<{ Body: CreateUserDTO }>(
    "/users",
    { schema: createUserSchema },
    (req, reply) => userController.create(req, reply),
  );

  app.post<{ Body: LoginDTO }>(
    "/users/login",
    { schema: loginSchema },
    (req, reply) => userController.login(req, reply),
  );

  app.put<{ Params: { id: string }; Body: Required<UpdateUserDTO> }>(
    "/users/:id",
    { schema: replaceUserSchema },
    (req, reply) => userController.update(req, reply),
  );

  app.patch<{ Params: { id: string }; Body: UpdateUserDTO }>(
    "/users/:id",
    { schema: patchUserSchema },
    (req, reply) => userController.partialUpdate(req, reply),
  );

  app.delete<{ Params: { id: string } }>(
    "/users/:id",
    { schema: idParamsSchema },
    (req, reply) => userController.delete(req, reply),
  );

  console.log("[Routes] User routes registered");
}
