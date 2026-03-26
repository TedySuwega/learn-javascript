export interface Book {
    id: number;
    title: string;
    author: string;
    isbn: string;
    publishedYear: number;
    genre: string;
    isAvailable: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateBookDTO {
    title: string;
    author: string;
    isbn: string;
    publishedYear: number;
    genre: string;
}

export interface UpdateBookDTO {
    title?: string;
    author?: string;
    isbn?: string;
    publishedYear?: number;
    genre?: string;
    isAvailable?: boolean;
}

export interface BookFilters {
    search?: string;
    genre?: string;
    isAvailable?: boolean;
    author?: string;
    publishedAfter?: number;
    publishedBefore?: number;
}