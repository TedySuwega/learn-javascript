// Custom error classes for better error handling
export class AppError extends Error {
    constructor(
        message: string,
        public statusCode: number = 500
    ) {
        super(message);
        this.name = "AppError";
    }
}

export class NotFoundError extends AppError {
    constructor(resource: string) {
        super(`${resource} not found`, 404);
        this.name = "NotFoundError";
    }
}

export class ValidationError extends AppError {
    constructor(message: string) {
        super(message, 400);
        this.name = "ValidationError";
    }
}

export class DatabaseError extends AppError {
    constructor(message: string) {
        super(`Database error: ${message}`, 500);
        this.name = "DatabaseError";
    }
}

export class AuthenticationError extends AppError {
    constructor(message: string) {
        super(`Authentication error: ${message}`, 401);
        this.name = "AuthenticationError";
    }
}

export class AuthorizationError extends AppError {
    constructor(message: string) {
        super(`Authorization error: ${message}`, 403);
        this.name = "AuthorizationError";
    }
}

export function handleError(error: Error): { status: number; message: string } {
    if (error instanceof NotFoundError) {
        return { status: 404, message: error.message };
    }
    if (error instanceof ValidationError) {
        return { status: 400, message: error.message };
    }
    if (error instanceof AuthenticationError) {
        return { status: 401, message: error.message };
    }
    if (error instanceof AuthorizationError) {
        return { status: 403, message: error.message };
    }
    if (error instanceof DatabaseError) {
        return { status: 500, message: error.message };
    }
    // Or if it's any AppError (has statusCode)
    if (error instanceof AppError) {
        return { status: error.statusCode, message: error.message };
    }
    // If it's any other error, return 500 and generic message
    return { status: 500, message: "Internal server error" };
}