import { FastifyRequest, FastifyReply } from "fastify";
import { ProductService } from "../services/productService";

/**
 * Exercise 3 — implement this controller (DAY_13.md).
 *
 * Use `UserController` as a reference: parse params/body, call `this.productService`,
 * return JSON with `success` / `data` / `error` and correct HTTP status codes.
 *
 * Service methods available:
 * - `getAllProducts()` → 200
 * - `getProductById(id)` → 200 or 404 / 400
 * - `createProduct(body)` → 201 or 400
 *
 * Until you implement the methods below, routes return 501 so the app still compiles.
 */
export class ProductController {
  constructor(private productService: ProductService) {
    console.log("[Controller] ProductController initialized");
  }

  // ============ GET /products ============
  async getAll(_request: FastifyRequest, reply: FastifyReply) {
    return reply.status(501).send({
      success: false,
      error: "Exercise 3: implement ProductController.getAll (GET /products)",
    });
  }

  // ============ GET /products/:id ============
  async getById(
    _request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ) {
    return reply.status(501).send({
      success: false,
      error: "Exercise 3: implement ProductController.getById (GET /products/:id)",
    });
  }

  // ============ POST /products ============
  async create(
    _request: FastifyRequest<{
      Body: { name: string; price: number; stock: number; category: string };
    }>,
    reply: FastifyReply,
  ) {
    return reply.status(501).send({
      success: false,
      error: "Exercise 3: implement ProductController.create (POST /products)",
    });
  }
}
