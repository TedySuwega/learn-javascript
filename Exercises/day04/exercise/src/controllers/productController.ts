// CONTROLLER LAYER - Handles HTTP requests
import { productService } from "../services/productService";
import { CreateProductDTO } from "../types/product";

// Simulated HTTP request/response
interface Request {
  body: any;
  params: { id?: string };
}

interface Response {
  status: number;
  data: any;
}

export const productController = {
  // POST /products - Create product
  register(req: Request): Response {
    console.log("[Controller] Received registration request");

    const { name, price, description, stock, category, isActive } = req.body as CreateProductDTO;

    // Validation
    // name must be at least 3 characters
    // price must be greater than 0
    // description must be at least 10 characters
    // stock must be greater than 0
    // category must be at least 3 characters
    // isActive must be a boolean
    if (!name || name.length < 3) {
      return { status: 400, data: { error: "Invalid name" } };
    }
    if (!price || price <= 0) {
      return { status: 400, data: { error: "Invalid price" } };
    }
    if (!description || description.length < 10) {
      return { status: 400, data: { error: "Invalid description" } };
    }
    if (!stock || stock <= 0) {
      return { status: 400, data: { error: "Invalid stock" } };
    }
    if (!category || category.length < 3) {
      return { status: 400, data: { error: "Invalid category" } };
    }
    if (!isActive || typeof isActive !== "boolean") {
      return { status: 400, data: { error: "Invalid isActive" } };
    }
    try {
      const product = productService.register({ name, price, description, stock, category, isActive });
      return { status: 201, data: product };
    } catch (error: any) {
      return { status: 400, data: { error: error.message } };
    }
  },

  // GET /products/:id - Get product by ID
  getById(req: Request): Response {
    console.log("[Controller] Received get product request");

    const id = parseInt(req.params.id || "0");

    if (!id) {
      return { status: 400, data: { error: "Invalid ID" } };
    }

    const product = productService.getById(id);

    if (!product) {
      return { status: 404, data: { error: "Product not found" } };
    }

    return { status: 200, data: product };
  },

  // GET /products - Get all products
  getAll(): Response {
    console.log("[Controller] Received get all products request");
    const products = productService.getAll();
    return { status: 200, data: products };
  },
};
