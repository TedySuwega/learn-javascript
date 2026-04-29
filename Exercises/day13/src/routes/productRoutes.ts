import { FastifyInstance } from "fastify";
import { ProductController } from "../controllers/productController";
import { ProductService } from "../services/productService";
import { productRepository } from "../repositories/productRepository";

export async function productRoutes(app: FastifyInstance) {
  const productService = new ProductService(productRepository);
  const productController = new ProductController(productService);

  app.get("/products", (req, reply) => productController.getAll(req, reply));

  app.get<{ Params: { id: string } }>("/products/:id", (req, reply) =>
    productController.getById(req, reply),
  );

  app.post<{
    Body: { name: string; price: number; stock: number; category: string };
  }>("/products", (req, reply) => productController.create(req, reply));

  console.log("[Routes] Product routes registered");
}
