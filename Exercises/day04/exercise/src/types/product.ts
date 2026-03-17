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

export interface CreateProductDTO {
    name: string;
    price: number;
    description: string;
    stock: number;
    category: string;
    isActive: boolean;
}

export interface ProductResponse {
    id: number;
    name: string;
    price: number;
    description: string;
    stock: number;
    category: string;
    isActive: boolean;
    createdAt: Date;
}
