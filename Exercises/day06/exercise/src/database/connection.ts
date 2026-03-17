// Simulated database connection
interface DatabaseConfig {
    host: string;
    port: number;
    database: string;
    username: string;
    password: string;
}

interface DatabaseConnection {
    isConnected: boolean;
    config: DatabaseConfig | null;
}

// Simulated connection state
let connection: DatabaseConnection = {
    isConnected: false,
    config: null
};

// Simulate connection delay
function delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export async function connect(config: DatabaseConfig): Promise<void> {
    console.log(`🔌 Connecting to ${config.host}:${config.port}/${config.database}...`);
    
    // Simulate connection time
    await delay(1000);
    
    // Simulate connection failure for wrong credentials
    if (config.password === "wrong") {
        throw new Error("Authentication failed: Invalid password");
    }
    
    // Simulate connection failure for wrong host
    if (config.host === "invalid-host") {
        throw new Error("Connection refused: Host not found");
    }
    
    connection.isConnected = true;
    connection.config = config;
    console.log("✅ Database connected successfully!");
}

// connect with 3 times try and if failed throw error
export async function connectWithRetry(config: Omit<DatabaseConfig, "password">, passwords: string[]): Promise<void> {
    const maxRetries = passwords.length;
    for (let i = 0; i < maxRetries; i++) {
        try {
            await connect({ ...config, password: passwords[i]});
            return;
        } catch (error) {
            console.log(`Try ${i + 1} failed:`, (error as Error).message);
        }
    }
    throw new Error(`Failed to connect to database after ${maxRetries} attempts`);
}

export async function disconnect(): Promise<void> {
    if (connection.isConnected) {
        console.log("🔌 Disconnecting from database...");
        await delay(500);
        connection.isConnected = false;
        connection.config = null;
        console.log("✅ Database disconnected");
    }
}

export function isConnected(): boolean {
    return connection.isConnected;
}

export function getConnection(): DatabaseConnection {
    return connection;
}