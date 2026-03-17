// Repository with dependency injection
import { isConnected } from "../database/connection";
import { DatabaseError, NotFoundError } from "../errors/customErrors";

interface User {
    id: number;
    name: string;
    email: string;
}

// Simulated database storage
let users: User[] = [
    { id: 1, name: "Alice", email: "alice@example.com" },
    { id: 2, name: "Bob", email: "bob@example.com" }
];

// Repository class with DI-ready structure
export class UserRepository {
    // In real app, database connection would be injected here
    
    private checkConnection(): void {
        if (!isConnected()) {
            throw new DatabaseError("Not connected to database");
        }
    }
    
    async findAll(): Promise<User[]> {
        this.checkConnection();
        console.log("[Repository] Finding all users");
        return users;
    }
    
    async findById(id: number): Promise<User> {
        this.checkConnection();
        console.log(`[Repository] Finding user with ID: ${id}`);
        
        const user = users.find(u => u.id === id);
        if (!user) {
            throw new NotFoundError(`User with ID ${id}`);
        }
        return user;
    }
    
    async create(data: Omit<User, "id">): Promise<User> {
        this.checkConnection();
        console.log("[Repository] Creating new user");
        
        const newUser: User = {
            id: users.length + 1,
            ...data
        };
        users.push(newUser);
        return newUser;
    }
    
    async update(id: number, data: Partial<User>): Promise<User> {
        this.checkConnection();
        console.log(`[Repository] Updating user with ID: ${id}`);
        
        const user = users.find(u => u.id === id);
        if (!user) {
            throw new NotFoundError(`User with ID ${id}`);
        }
        Object.assign(user, data);
        return user;
    }
    
    async delete(id: number): Promise<void> {
        this.checkConnection();
        console.log(`[Repository] Deleting user with ID: ${id}`);
        
        const index = users.findIndex(u => u.id === id);
        if (index === -1) {
            throw new NotFoundError(`User with ID ${id}`);
        }
        users.splice(index, 1);
    }
}