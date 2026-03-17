export {}; // Makes this file a module (avoids global scope conflicts)

// ============================================
// DAY 2 EXERCISES
// Complete the exercises below
// ============================================

// Helper function for async exercises
function delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// --------------------------------------------
// Exercise 1: Create an Interface
// --------------------------------------------
// Create an interface called `Book` with:
// - title (string)
// - author (string)
// - pages (number)
// - isRead (boolean)
// - publishYear (number, optional)
//
// Then create 2 book objects using this interface.

// Your code here:
interface Book {
    title: string;
    author: string;
    pages: number;
    isRead: boolean;
    publishYear?: number;
}
const book1: Book = {
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    pages: 180,
    isRead: true,
    publishYear: 1925
}
const book2: Book = {
    title: "1984",
    author: "George Orwell",
    pages: 328,
    isRead: false,
    publishYear: undefined // optional
}

console.log("Exercise 1 - Books:");
console.log(book1);
console.log(book2);


// --------------------------------------------
// Exercise 2: Typed Function
// --------------------------------------------
// Create a function called `formatPrice` that:
// - Takes a price (number) and currency (string)
// - Returns a formatted string like "$100" or "Rp100000"
// - Example: formatPrice(100, "$") returns "$100"

// Your code here:

function formatPrice(price: number, currency: string): string {
    return `${currency}${price}`;
}
console.log("Exercise 2 - Format Price:");
console.log(formatPrice(100, "$"));      // Should print: $100
console.log(formatPrice(50000, "Rp"));   // Should print: Rp50000
console.log(formatPrice(99.99, "€"));    // Should print: €99.99

// --------------------------------------------
// Exercise 3: Async Function
// --------------------------------------------
// Create an async function called `simulateLogin` that:
// - Takes username (string) and password (string) as parameters
// - Waits 1 second (use the delay function above)
// - Returns true if username is "admin" and password is "123"
// - Returns false otherwise
// - Don't forget the return type: Promise<boolean>

// Your code here:

async function simulateLogin(username: string, password: string): Promise<boolean> {
    await delay(1000);
    if (username === "admin" && password === "123") {
        return true;
    }
    return false;
}


// Test Exercise 3 (uncomment when ready):
async function testLogin() {
    console.log("\nExercise 3 - Simulate Login:");
    
    const result1 = await simulateLogin("admin", "123");
    console.log("admin/123:", result1);  // Should print: true
    
    const result2 = await simulateLogin("admin", "wrong");
    console.log("admin/wrong:", result2);  // Should print: false
    
    const result3 = await simulateLogin("user", "123");
    console.log("user/123:", result3);  // Should print: false
}
testLogin();
