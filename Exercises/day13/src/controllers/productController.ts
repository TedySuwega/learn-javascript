import { FastifyRequest, FastifyReply } from "fastify";
import { ProductService } from "../services/productService";
import { mapErrorToStatus } from "../utils/mapErrorToStatus";

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
 *
 * For try/catch error responses, use `mapErrorToStatus` from `../utils/mapErrorToStatus`
 * (same helper as `UserController`).
 */
export class ProductController {
  constructor(private productService: ProductService) {
    console.log("[Controller] ProductController initialized");
  }

  // ============ GET /products ============
  async getAll(_request: FastifyRequest, reply: FastifyReply) {
    console.log("[Controller] GET /products");

    try {
      const products = await this.productService.getAllProducts();
      return reply.status(200).send({
        success: true,
        data: { products },
        count: products.length,
      });
    } catch (error: any) {
      console.log("[Controller] Error:", error.message);
      const statusCode = mapErrorToStatus(error);
      return reply.status(statusCode).send({success: false, error: error.message});
    }
  }

  // ============ GET /products/:id ============
  async getById(
    _request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ) {
    const { id } = _request.params;
    console.log(`[Controller] GET /products/${id}`);

    try {
      const productId = parseInt(id);
      if (isNaN(productId)) {
        return reply.status(400).send({
          success: false,
          error: "Invalid product ID format"
        });
      }

      const product = await this.productService.getProductById(productId);
      
      return reply.status(200).send({
        success: true,
        data: { product }
      });
    } catch (error: any) {
      console.log("[Controller] Error:", error.message);
      const statusCode = mapErrorToStatus(error);
      return reply.status(statusCode).send({success: false, error: error.message});
    }
  }

  // ============ POST /products ============
  async create(
    _request: FastifyRequest<{
      Body: { name: string; price: number; stock: number; category: string };
    }>,
    reply: FastifyReply,
  ) {
    console.log("[Controller] POST /products");

    try {
      const { name, price, stock, category } = _request.body;
      const product = await this.productService.createProduct({ name, price, stock, category });
      return reply.status(201).send({success: true, data: {product}});
    } catch (error: any) {
      console.log("[Controller] Error:", error.message);
      const statusCode = mapErrorToStatus(error);
      return reply.status(statusCode).send({success: false, error: error.message});  
    }
  }
}
