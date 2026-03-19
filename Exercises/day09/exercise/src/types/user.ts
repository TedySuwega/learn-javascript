export interface User {
    id: number;
    name: string;
    email: string;
    password: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateUserDTO {
    name: string;
    email: string;
    password: string;
}

export interface UpdateUserDTO {
    name?: string;
    email?: string;
    isActive?: boolean;
}

export interface UserFilters {
    isActive?: boolean;
    search?: string;
}