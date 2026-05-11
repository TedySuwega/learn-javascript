/** Validation schemas for the Book API (Exercise 3). */

export const createBookSchema = {
  body: {
    type: "object",
    required: ["title", "author", "isbn"],
    additionalProperties: false,
    properties: {
      title: { type: "string", minLength: 2, maxLength: 200 },
      author: { type: "string", minLength: 2, maxLength: 100 },
      isbn: { type: "string", minLength: 5, maxLength: 32 },
      available: { type: "boolean" },
    },
  },
} as const;

export const replaceBookSchema = {
  body: {
    type: "object",
    required: ["title", "author", "isbn", "available"],
    additionalProperties: false,
    properties: {
      title: { type: "string", minLength: 2, maxLength: 200 },
      author: { type: "string", minLength: 2, maxLength: 100 },
      isbn: { type: "string", minLength: 5, maxLength: 32 },
      available: { type: "boolean" },
    },
  },
  params: {
    type: "object",
    required: ["id"],
    properties: { id: { type: "string", pattern: "^[1-9][0-9]*$" } },
  },
} as const;

export const patchBookSchema = {
  body: {
    type: "object",
    additionalProperties: false,
    minProperties: 1,
    properties: {
      title: { type: "string", minLength: 2, maxLength: 200 },
      author: { type: "string", minLength: 2, maxLength: 100 },
      isbn: { type: "string", minLength: 5, maxLength: 32 },
      available: { type: "boolean" },
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

export const listBooksSchema = {
  querystring: {
    type: "object",
    additionalProperties: false,
    properties: {
      search: { type: "string" },
      available: { type: "string", enum: ["true", "false"] },
      page: { type: "string", pattern: "^[1-9][0-9]*$" },
      limit: { type: "string", pattern: "^[1-9][0-9]*$" },
      sortBy: { type: "string", enum: ["title", "author", "createdAt"] },
      sortOrder: { type: "string", enum: ["asc", "desc"] },
    },
  },
} as const;
