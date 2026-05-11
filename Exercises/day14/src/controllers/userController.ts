import { FastifyRequest, FastifyReply } from "fastify";
import { UserService } from "../services/userService";
import {
  CreateUserDTO,
  LoginDTO,
  UpdateUserDTO,
  UserFilters,
  UserListQuery,
  UserSortField,
} from "../types/user";
import { mapErrorToStatus } from "../utils/mapErrorToStatus";
import {
  parseBoolean,
  parseId,
  parsePagination,
  parseSortField,
  parseSortOrder,
} from "../utils/parseQuery";

interface IdParams {
  id: string;
}

const USER_SORT_FIELDS = ["name", "email", "createdAt"] as const;

export class UserController {
  constructor(private userService: UserService) {
    console.log("[Controller] UserController initialized");
  }

  // ============ GET /users ============
  async getAll(
    request: FastifyRequest<{ Querystring: UserListQuery }>,
    reply: FastifyReply,
  ) {
    console.log("[Controller] GET /users", { ...request.query });

    try {
      const filters = this.buildFilters(request.query);
      const { users, pagination } = await this.userService.getAllUsers(filters);

      return reply.status(200).send({
        success: true,
        data: { users },
        pagination,
      });
    } catch (error) {
      return this.handleError(error as Error, reply);
    }
  }

  // ============ GET /users/:id ============
  async getById(
    request: FastifyRequest<{ Params: IdParams }>,
    reply: FastifyReply,
  ) {
    const { id } = request.params;
    console.log(`[Controller] GET /users/${id}`);

    try {
      const userId = parseId(id);
      if (userId === null) {
        return reply.status(400).send({
          success: false,
          error: "Invalid user ID format",
        });
      }

      const user = await this.userService.getUserById(userId);
      return reply.status(200).send({ success: true, data: { user } });
    } catch (error) {
      return this.handleError(error as Error, reply);
    }
  }

  // ============ POST /users ============
  async create(
    request: FastifyRequest<{ Body: CreateUserDTO }>,
    reply: FastifyReply,
  ) {
    console.log("[Controller] POST /users");

    try {
      const user = await this.userService.register(request.body);
      return reply.status(201).send({
        success: true,
        data: { user },
        message: "User created successfully",
      });
    } catch (error) {
      return this.handleError(error as Error, reply);
    }
  }

  // ============ POST /users/login ============
  async login(
    request: FastifyRequest<{ Body: LoginDTO }>,
    reply: FastifyReply,
  ) {
    console.log("[Controller] POST /users/login");

    try {
      const result = await this.userService.login(request.body);
      return reply.status(200).send({ success: true, data: result });
    } catch (error) {
      return this.handleError(error as Error, reply);
    }
  }

  // ============ PUT /users/:id (full replace) ============
  async update(
    request: FastifyRequest<{ Params: IdParams; Body: Required<UpdateUserDTO> }>,
    reply: FastifyReply,
  ) {
    const { id } = request.params;
    console.log(`[Controller] PUT /users/${id}`);

    try {
      const userId = parseId(id);
      if (userId === null) {
        return reply.status(400).send({
          success: false,
          error: "Invalid user ID format",
        });
      }

      const user = await this.userService.updateUser(userId, request.body);
      return reply.status(200).send({
        success: true,
        data: { user },
        message: "User replaced successfully",
      });
    } catch (error) {
      return this.handleError(error as Error, reply);
    }
  }

  // ============ PATCH /users/:id (partial update) ============
  async partialUpdate(
    request: FastifyRequest<{ Params: IdParams; Body: UpdateUserDTO }>,
    reply: FastifyReply,
  ) {
    const { id } = request.params;
    console.log(`[Controller] PATCH /users/${id}`);

    try {
      const userId = parseId(id);
      if (userId === null) {
        return reply.status(400).send({
          success: false,
          error: "Invalid user ID format",
        });
      }

      if (Object.keys(request.body ?? {}).length === 0) {
        return reply.status(400).send({
          success: false,
          error: "No fields to update",
        });
      }

      const user = await this.userService.updateUser(userId, request.body);
      return reply.status(200).send({
        success: true,
        data: { user },
        message: "User updated successfully",
      });
    } catch (error) {
      return this.handleError(error as Error, reply);
    }
  }

  // ============ DELETE /users/:id ============
  async delete(
    request: FastifyRequest<{ Params: IdParams }>,
    reply: FastifyReply,
  ) {
    const { id } = request.params;
    console.log(`[Controller] DELETE /users/${id}`);

    try {
      const userId = parseId(id);
      if (userId === null) {
        return reply.status(400).send({
          success: false,
          error: "Invalid user ID format",
        });
      }

      await this.userService.deleteUser(userId);
      return reply.status(204).send();
    } catch (error) {
      return this.handleError(error as Error, reply);
    }
  }

  /**
   * Translate raw query strings into a typed filter object.
   * (Exercise 1 — sort by name|email|createdAt with asc|desc.)
   */
  private buildFilters(query: UserListQuery): UserFilters {
    const { page, limit } = parsePagination(query.page, query.limit);

    const filters: UserFilters = { page, limit };

    if (query.search?.trim()) filters.search = query.search.trim();

    const isActive = parseBoolean(query.active);
    if (isActive !== undefined) filters.isActive = isActive;

    const sortBy = parseSortField<UserSortField>(query.sortBy, USER_SORT_FIELDS);
    if (sortBy) {
      filters.sortBy = sortBy;
      filters.sortOrder = parseSortOrder(query.sortOrder);
    }

    return filters;
  }

  private handleError(error: Error, reply: FastifyReply) {
    console.log("[Controller] Error:", error.message);
    const statusCode = mapErrorToStatus(error);
    return reply.status(statusCode).send({
      success: false,
      error: error.message,
    });
  }
}
