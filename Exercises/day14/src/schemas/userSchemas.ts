/**
 * Exercise 2 — Fastify validation schemas for user routes.
 *
 * Fastify uses Ajv under the hood, so a JSON Schema attached to a route
 * runs BEFORE the handler. If validation fails, Fastify returns 400
 * automatically — the controller never runs.
 */

const emailFormat = { type: "string", format: "email" } as const;

export const createUserSchema = {
  body: {
    type: "object",
    required: ["name", "email", "password"],
    additionalProperties: false,
    properties: {
      name: { type: "string", minLength: 2, maxLength: 100 },
      email: emailFormat,
      password: { type: "string", minLength: 6, maxLength: 100 },
    },
  },
} as const;

export const loginSchema = {
  body: {
    type: "object",
    required: ["email", "password"],
    additionalProperties: false,
    properties: {
      email: emailFormat,
      password: { type: "string", minLength: 1 },
    },
  },
} as const;

/**
 * PUT (full replace) — every editable field is required.
 */
export const replaceUserSchema = {
  body: {
    type: "object",
    required: ["name", "email", "isActive"],
    additionalProperties: false,
    properties: {
      name: { type: "string", minLength: 2, maxLength: 100 },
      email: emailFormat,
      isActive: { type: "boolean" },
    },
  },
  params: {
    type: "object",
    required: ["id"],
    properties: { id: { type: "string", pattern: "^[1-9][0-9]*$" } },
  },
} as const;

/**
 * PATCH (partial) — at least one field, but each field is still validated.
 */
export const patchUserSchema = {
  body: {
    type: "object",
    additionalProperties: false,
    minProperties: 1,
    properties: {
      name: { type: "string", minLength: 2, maxLength: 100 },
      email: emailFormat,
      isActive: { type: "boolean" },
    },
  },
  params: {
    type: "object",
    required: ["id"],
    properties: { id: { type: "string", pattern: "^[1-9][0-9]*$" } },
  },
} as const;

export const idParamsSchema = {
  params: {
    type: "object",
    required: ["id"],
    properties: { id: { type: "string", pattern: "^[1-9][0-9]*$" } },
  },
} as const;

export const listUsersSchema = {
  querystring: {
    type: "object",
    additionalProperties: false,
    properties: {
      search: { type: "string" },
      active: { type: "string", enum: ["true", "false"] },
      page: { type: "string", pattern: "^[1-9][0-9]*$" },
      limit: { type: "string", pattern: "^[1-9][0-9]*$" },
      sortBy: { type: "string", enum: ["name", "email", "createdAt"] },
      sortOrder: { type: "string", enum: ["asc", "desc"] },
    },
  },
} as const;
