export {}; // Makes this file a module (avoids global scope conflicts)

// ============================================
// DAY 2 PRACTICE - TypeScript & Async/Await
// Type the code below yourself to learn!
// ============================================

// 1. Basic Type Annotations
let userName: string = "Alice";
let userAge: number = 25;
let isLoggedIn: boolean = false;

console.log("1. Basic Types:");
console.log("Name:", userName, "| Age:", userAge, "| Logged in:", isLoggedIn);

// 2. Array Types
let scores: number[] = [85, 90, 78, 92];
let fruits: string[] = ["apple", "banana", "mango"];

console.log("\n2. Arrays:");
console.log("Scores:", scores);
console.log("Fruits:", fruits);

// 3. Interface - Define object shape
interface Person {
    name: string;
    age: number;
    email: string;
    isActive: boolean;
}

// 4. Using the interface
const person: Person = {
    name: "John Doe",
    age: 30,
    email: "john@example.com",
    isActive: true
};

console.log("\n3. Person object:");
console.log(person);

// 5. Function with types
function calculateTotal(price: number, quantity: number): number {
    return price * quantity;
}

const total = calculateTotal(100, 5);
console.log("\n4. Calculate total (100 x 5):", total);

// 6. Arrow function with types
const greet = (name: string): string => {
    return `Hello, ${name}!`;
};

console.log("\n5. Greeting:", greet("World"));

// 7. Optional properties (?)
interface Product {
    name: string;
    price: number;
    description?: string;  // Optional - can be undefined
}

const product1: Product = {
    name: "Laptop",
    price: 1000
    // description is optional, so we can skip it
};

const product2: Product = {
    name: "Phone",
    price: 500,
    description: "Latest smartphone"
};

console.log("\n6. Products:");
console.log("Product 1:", product1);
console.log("Product 2:", product2);

// 8. Simulating Async/Await
// This simulates waiting for data (like from a server)

function delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchUserData(): Promise<Person> {
    console.log("\n7. Fetching user data...");
    await delay(1000);  // Simulate 1 second wait
    
    return {
        name: "Fetched User",
        age: 28,
        email: "fetched@example.com",
        isActive: true
    };
}

// 9. Using async function
async function main() {
    console.log("\n8. Async Demo - Start");
    
    const user = await fetchUserData();
    console.log("User received:", user);
    
    console.log("Async Demo - End");
}

// 10. Error handling with try/catch
async function safeFetch(): Promise<void> {
    try {
        const user = await fetchUserData();
        console.log("\n9. Safe fetch success:", user.name);
    } catch (error) {
        console.log("Error occurred:", error);
    }
}

// Run the async functions
async function runAll() {
    await main();
    await safeFetch();
    console.log("\n✅ All practice code completed!");
}

runAll();
