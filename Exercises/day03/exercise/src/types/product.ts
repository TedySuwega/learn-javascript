// Type definitions for User
export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  stock: number;
  category: string;
  isActive: boolean;
  createdAt: Date;
}

export interface CreateProductInput {
  name: string;
  price: number;
  description: string;
  stock: number;
  category: string;
  isActive: boolean;
}