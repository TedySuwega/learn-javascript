/** Domain product model (repository / service layer). */
export interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  category: string;
  createdAt: Date;
  updatedAt: Date;
}

/** Payload for creating a product (matches POST body fields). */
export interface CreateProductDTO {
  name: string;
  price: number;
  stock: number;
  category: string;
}

/** API-safe product (returned from service / controller). */
export interface ProductResponse {
  id: number;
  name: string;
  price: number;
  stock: number;
  category: string;
  createdAt: Date;
  updatedAt: Date;
}
