// TypeScript types that mirror database tables

// Users table
export interface User {
    id: number;           // PRIMARY KEY, auto-increment
    name: string;         // VARCHAR(100)
    email: string;        // VARCHAR(255), unique
    password: string;     // VARCHAR(255)
    isActive: boolean;    // BOOLEAN, default true
    createdAt: Date;      // TIMESTAMP
    updatedAt: Date;      // TIMESTAMP
}

// Posts table
export interface Post {
    id: number;           // PRIMARY KEY
    userId: number;       // FOREIGN KEY → users.id
    title: string;        // VARCHAR(255)
    content: string;      // TEXT
    isPublished: boolean; // BOOLEAN
    createdAt: Date;      // TIMESTAMP
}

// Comments table
export interface Comment {
    id: number;           // PRIMARY KEY
    postId: number;       // FOREIGN KEY → posts.id
    userId: number;       // FOREIGN KEY → users.id
    text: string;         // TEXT
    createdAt: Date;      // TIMESTAMP
}

// Categories table
export interface Category {
    id: number;           // PRIMARY KEY
    name: string;         // VARCHAR(100)
    description: string;  // TEXT, nullable
}

// Many-to-many: posts_categories
export interface PostCategory {
    postId: number;       // FOREIGN KEY → posts.id
    categoryId: number;   // FOREIGN KEY → categories.id
}