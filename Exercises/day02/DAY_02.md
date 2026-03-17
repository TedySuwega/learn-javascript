# Day 2: TypeScript & Async/Await

## 📚 What to Learn Today
- **Read**: [LEARNING_MODULE.md](../../Modules/LEARNING_MODULE.md) - Module 1 (Lines 171-268)
- **Time**: ~35 minutes reading, ~25 minutes practice
- **Topics**: TypeScript basics, type annotations, async/await

---

## 📖 Key Concepts

### 1. What is TypeScript?
TypeScript = JavaScript + **Type Safety**

```javascript
// JavaScript - No type checking
let userName = "John";
userName = 123;  // Allowed, but might cause bugs!

// TypeScript - Type checking
let userName: string = "John";
userName = 123;  // ERROR! TypeScript catches this
```

### 2. Why Use TypeScript?
1. **Catch errors early** - Find bugs before running code
2. **Better autocomplete** - Editor knows what methods are available
3. **Self-documenting** - Types tell you what data is expected

### 3. Type Annotations

```typescript
// Basic types
let name: string = "Alice";
let age: number = 25;
let isActive: boolean = true;

// Arrays
let numbers: number[] = [1, 2, 3];
let names: string[] = ["Alice", "Bob"];

// Objects with interface
interface User {
    name: string;
    age: number;
    email: string;
}

let user: User = {
    name: "John",
    age: 25,
    email: "john@example.com"
};
```

### 4. Function Types

```typescript
// Parameters and return type
function add(a: number, b: number): number {
    return a + b;
}

// Arrow function with types
const multiply = (a: number, b: number): number => {
    return a * b;
};

// Function that returns nothing (void)
function logMessage(message: string): void {
    console.log(message);
}
```

### 5. What is Async/Await?

Some operations take time (like fetching data from internet). We use `async/await` to handle them.

```typescript
// Without async/await - confusing nested callbacks
fetch('/api/user')
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.log(error));

// With async/await - clean and readable!
async function getUser() {
    try {
        const response = await fetch('/api/user');
        const data = await response.json();
        console.log(data);
    } catch (error) {
        console.log(error);
    }
}
```

### 6. Understanding Async/Await

- `async` - Marks a function as asynchronous
- `await` - Pauses execution until the operation completes
- Always use `try/catch` for error handling

```typescript
// Think of it like ordering food:
async function orderFood() {
    console.log("1. Order placed");           // Instant
    const food = await kitchen.prepare();     // Wait for kitchen
    console.log("2. Food received:", food);   // After waiting
    return food;
}
```

---

## 💻 Code to Type & Understand

Type this code in `exercises/day02/practice.ts`:

```typescript
// ============================================
// DAY 2 PRACTICE - TypeScript & Async/Await
// ============================================

// 1. Basic Type Annotations
let userName: string = "Alice";
let userAge: number = 25;
let isLoggedIn: boolean = false;

// 2. Array Types
let scores: number[] = [85, 90, 78, 92];
let fruits: string[] = ["apple", "banana", "mango"];

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

// 5. Function with types
function calculateTotal(price: number, quantity: number): number {
    return price * quantity;
}

const total = calculateTotal(100, 5);
console.log("Total:", total);  // 500

// 6. Arrow function with types
const greet = (name: string): string => {
    return `Hello, ${name}!`;
};

console.log(greet("World"));

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

// 8. Simulating Async/Await
// This simulates waiting for data (like from a server)

function delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchUserData(): Promise<Person> {
    console.log("Fetching user data...");
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
    console.log("Start");
    
    const user = await fetchUserData();
    console.log("User received:", user);
    
    console.log("End");
}

// Run the async function
main();

// 10. Error handling with try/catch
async function safeFetch(): Promise<void> {
    try {
        const user = await fetchUserData();
        console.log("Success:", user.name);
    } catch (error) {
        console.log("Error occurred:", error);
    }
}
```

---

## ✍️ Exercises

Complete these in `exercises/day02/exercises.ts`:

### Exercise 1: Create an Interface
Create an interface called `Book` with:
- title (string)
- author (string)
- pages (number)
- isRead (boolean)
- publishYear (number, optional)

Then create 2 book objects using this interface.

### Exercise 2: Typed Function
Create a function called `formatPrice` that:
- Takes a price (number) and currency (string)
- Returns a formatted string like "$100" or "Rp100000"
- Example: `formatPrice(100, "$")` returns `"$100"`

### Exercise 3: Async Function
Create an async function called `simulateLogin` that:
- Takes username and password as parameters
- Waits 1 second (use the delay function from practice)
- Returns `true` if username is "admin" and password is "123"
- Returns `false` otherwise

---

## 📚 Mini Exercise (from Module)

Analyze this code from the learning module:

```typescript
async function login(email: string, password: string): Promise<boolean> {
    const user = await findUserByEmail(email);
    
    if (user === null) {
        return false;  // User not found
    }
    
    if (user.password === password) {
        return true;   // Login successful
    }
    
    return false;      // Wrong password
}
```

### ME1: What are the two parameters this function needs?

**Your Answer**: 
need 2 string parameter for email and password, showed at "login(email: string, password: string)" 

**✅ Correct!** The function needs `email: string` and `password: string`.

### ME2: What does this function return?

**Your Answer**: 
boolean, showed at "Promise<boolean> "

**✅ Correct!** It returns `Promise<boolean>` - a Promise that resolves to `true` (login success) or `false` (login failed).

### ME3: What happens if the user is not found?

**Your Answer**: 
it will return false , 
"if (user === null) {
        return false;  // User not found
    }"

**✅ Correct!** If `findUserByEmail` returns `null`, the function returns `false` immediately.

---

## ❓ Quiz Questions

### Q1: Type Annotation
What does `: string` mean in `let name: string = "John"`?

**Your Answer**: 
string mean type of name, in taht case mean name have type string, cannot use any other type, should be string

**✅ Correct!** `: string` is a type annotation that tells TypeScript this variable must always hold a string value.

### Q2: Async/Await Purpose
Why do we use `async/await`? Give a real-world example.

**Your Answer**: 
we use async await for do task and not wait until that task done, but do another task when previous task is stil waiting, 
like cofee analogy, async await, like make cofee we make use maschine and make toast, just use mahicne cofee thatn use machine toast wait , done, not simultane and paralel

**✅ Correct!** Great understanding! Async/await allows non-blocking operations - the program can do other things while waiting for slow operations (like API calls, database queries) to complete. And you correctly noted it's NOT parallel - it's asynchronous (efficient waiting, not simultaneous execution).

### Q3: Type Error
What happens if you try to assign a number to a variable typed as string?
```typescript
let name: string = "John";
name = 123;  // What happens?
```

**Your Answer**: 
it will error , cz typescript detect missmatch type

**✅ Correct!** TypeScript will show a compile-time error: `Type 'number' is not assignable to type 'string'`. The code won't even run until you fix it.

---

## 📝 Bonus Questions (Optional)

### B1: What is the difference between `interface` and `type` in TypeScript?

**Your Answer**: 
interface is like template for creating object, so the object will have same patern or template, like we create object user that have name and email, 
intergface User {
    name: string;
    email: string;
}

and type is the definition for each varaiable for example in that interface name: string, that mean varaible name has a string type, and since name is string, it cannot be assign for another type like number or boolean

**⚠️ Partially Correct!** Your understanding of `interface` is correct. However, the question asked about `interface` vs `type` keyword in TypeScript - they're both ways to define shapes:

```typescript
// Using interface
interface User {
    name: string;
}

// Using type (similar but different syntax)
type User = {
    name: string;
}
```

**Key differences:**
- `interface` can be extended/merged, better for objects
- `type` can define unions, primitives, more flexible
- For objects, both work similarly - `interface` is more common

### B2: What does `Promise<void>` mean as a return type?

**Your Answer**: 
Promise mean it will guarantee that you wil have the type of your promise, in this case void after the async works done. and yes in this case return voidor nothing

**✅ Correct!** `Promise<void>` means the async function will complete (resolve) but returns no value - it just does an action (like logging, saving) without giving back data.

---

## 📊 Quiz Results: Day 2

| Question | Result | Notes |
|----------|--------|-------|
| ME1: Function parameters | ✅ Correct | email and password, both strings |
| ME2: Function return | ✅ Correct | Promise<boolean> |
| ME3: User not found | ✅ Correct | Returns false |
| Q1: Type annotation | ✅ Correct | Defines variable type |
| Q2: Async/await purpose | ✅ Correct | Great coffee analogy + understood it's not parallel! |
| Q3: Type error | ✅ Correct | TypeScript catches mismatch |
| B1: interface vs type | ⚠️ Partial | Understood interface, but question was about `type` keyword |
| B2: Promise<void> | ✅ Correct | Promise that returns nothing |

**Score: 5.5/6 (92%)**

---

## ✅ Day 2 Checklist

- [x] Read Module 1 (Lines 171-268)
- [x] Understand why TypeScript over JavaScript
- [x] Understand type annotations for variables
- [x] Understand interfaces for objects
- [x] Understand function parameter and return types
- [x] Understand async/await concept
- [x] Type all code examples
- [x] Complete Exercise 1 (Book Interface)
- [x] Complete Exercise 2 (formatPrice)
- [x] Complete Exercise 3 (simulateLogin)
- [x] Answer all quiz questions
- [x] Update Progress.md

---

## 🔗 Next Day Preview
Tomorrow you'll learn about **Project Structure** - how professional projects organize their files and folders, and what `package.json` does.

---

## 💬 Q&A Session Notes

### Q: Why doesn't the async function in the module have a return type?

**A:** It should have one for proper TypeScript. The module simplified it for beginners, but correct code should be:
```typescript
async function getUserFromDatabase(email: string): Promise<User> {
    const user = await database.findUser(email);
    return user;
}
```
Async functions always return a `Promise<T>` where T is the actual return type.

---

### Q: What is an interface?

**A:** An interface is a blueprint/template that defines the shape of an object. Any object using that interface MUST have all required properties with correct types.
```typescript
interface User {
    name: string;   // Required
    age: number;    // Required
    bio?: string;   // Optional (?)
}
```

---

### Q: Do I need to create an interface before creating an object?

**A:** No, but it's recommended for reusable objects:
- One-time object → interface optional
- Reusable object → use interface ✅ (better code quality)

---

### Q: What does `=>` mean in arrow functions?

**A:** Arrow function syntax - same as regular function, just shorter:
```typescript
// Same thing:
function add(a: number, b: number): number { return a + b; }
const add = (a: number, b: number): number => a + b;
```

---

### Q: What does `void` mean?

**A:** Function does an action but returns nothing:
```typescript
function logMessage(msg: string): void {
    console.log(msg);  // Action, no return
}
```

---

### Q: What is a callback?

**A:** A function passed to another function, called later when something finishes:
```typescript
// Callback style (old)
fetch('/api').then(data => console.log(data));

// Async/await (modern, cleaner)
const data = await fetch('/api');
console.log(data);
```

---

### Q: Is asynchronous the same as parallel?

**A:** No!
- **Synchronous**: Wait for each task to finish
- **Asynchronous**: Start task, do other things while waiting (non-blocking)
- **Parallel**: Multiple tasks at exact same time (needs multiple CPUs)

JavaScript is single-threaded, so it uses async (not parallel) to be efficient.

---

### Q: What is `resolve` in Promise?

**A:** `resolve` is a function given by Promise - you call it when the async work is done:
```typescript
new Promise((resolve) => {
    setTimeout(() => resolve(), 1000);  // Call resolve after 1 sec
});
```
With async/await, `return` automatically calls resolve.

---

### Q: What does `?` mean in interface properties?

**A:** Optional property - can be provided or skipped:
```typescript
interface Product {
    name: string;       // Required
    description?: string; // Optional
}
```

---

### Q: What is template literal `${}`?

**A:** A way to insert variables into strings using backticks:
```typescript
const name = "John";
const msg = `Hello, ${name}!`;  // "Hello, John!"
```
