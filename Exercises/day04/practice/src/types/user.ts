export interface User {
    id: number;
    email: string;
    password: string;
    createdAt: Date;
}

export interface CreateUserDTO {
    email: string;
    password: string;
}

export interface UserResponse {
    id: number;
    email: string;
    createdAt: Date;
    // Note: password is NOT included in response!
}
