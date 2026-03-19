export interface Product {
    id: number;
    name: string;
    price: number;
    stock: number;
    category: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateProductDTO {
    name: string;
    price: number;
    stock: number;
    category: string;
}

export interface UpdateProductDTO {
    name?: string;
    price?: number;
    stock?: number;
    category?: string;
}

export interface ProductFilters {
    name?: string;
    price?: number;
    stock?: number;
    category?: string;
}