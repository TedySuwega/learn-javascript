# Day 1: Programming Basics & JavaScript Intro

## 📚 What to Learn Today
- **Read**: [LEARNING_MODULE.md](../../Modules/LEARNING_MODULE.md) - Module 1 (Lines 25-170)
- **Time**: ~35 minutes reading, ~25 minutes practice
- **Topics**: What is backend, client-server model, variables, data types, functions, conditionals

---

## 📖 Key Concepts

### 1. Frontend vs Backend
```
Frontend (Browser)  →  Backend (Server)  →  Database
   You see this         Processes data       Stores data
```

- **Frontend**: What users see (buttons, forms, images)
- **Backend**: The "brain" that processes requests and manages data
- **Database**: Where data is stored permanently

### 2. Client-Server Model
When you click a button on a website:
1. Your browser sends a **REQUEST** to the server
2. Server processes the request
3. Server sends back a **RESPONSE**
4. Browser displays the result

### 3. Variables
Variables are like labeled boxes that store information.

```javascript
let userName = "John";      // Can be changed later
const age = 25;             // Cannot be changed (constant)
var oldWay = "avoid this";  // Old syntax, don't use
```

**Key difference**:
- `let` - value can change
- `const` - value cannot change (use this by default!)

### 4. Data Types

| Type | Example | Description |
|------|---------|-------------|
| String | `"Hello"` or `'Hello'` | Text (always in quotes) |
| Number | `42` or `3.14` | Numeric values |
| Boolean | `true` or `false` | Yes/No values |
| Array | `[1, 2, 3]` | List of items |
| Object | `{name: "John", age: 25}` | Collection of key-value pairs |

### 5. Functions
Functions are reusable blocks of code.

```javascript
// Defining a function
function greet(name) {
    return "Hello, " + name + "!";
}

// Calling a function
let message = greet("Alice");  // "Hello, Alice!"
```

### 6. Conditionals
Making decisions in code.

```javascript
let age = 18;

if (age >= 18) {
    console.log("You can vote!");
} else {
    console.log("Too young to vote.");
}
```

---

## 💻 Code to Type & Understand

Type this code in `exercises/day01/practice.ts`. Don't copy-paste - typing helps you learn!

```typescript
// ============================================
// DAY 1 PRACTICE - Type this code yourself!
// ============================================

// 1. Variables - Different ways to declare
let myName = "Your Name Here";
const birthYear = 2000;
let isLearning = true;

// 2. Data Types
let greeting: string = "Hello World";
let count: number = 42;
let isActive: boolean = true;
let fruits: string[] = ["apple", "banana", "orange"];
let person = {
    name: "John",
    age: 25,
    city: "Jakarta"
};

// 3. Accessing Object Properties
console.log(person.name);      // Dot notation
console.log(person["age"]);    // Bracket notation

// 4. Accessing Array Items
console.log(fruits[0]);        // "apple" (index starts at 0)
console.log(fruits[2]);        // "orange"

// 5. Simple Function
function sayHello(name: string): string {
    return "Hello, " + name + "!";
}

console.log(sayHello("World"));

// 6. Conditional
let temperature = 30;

if (temperature > 25) {
    console.log("It's hot!");
} else if (temperature > 15) {
    console.log("It's nice.");
} else {
    console.log("It's cold!");
}

// 7. typeof - Check data type
console.log(typeof myName);     // "string"
console.log(typeof count);      // "number"
console.log(typeof isActive);   // "boolean"
console.log(typeof fruits);     // "object" (arrays are objects!)
```

---

## ✍️ Exercises

Complete these in `exercises/day01/exercises.ts`:

### Exercise 1: Create Your Profile
Create variables for your own profile:
- Your name (string)
- Your age (number)
- Are you employed? (boolean)
- Your skills (array of strings)
- Your full profile (object with all above)

### Exercise 2: Simple Calculator Function
Create a function called `add` that:
- Takes two numbers as parameters
- Returns the sum
- Test it with: `add(5, 3)` should return `8`

### Exercise 3: Age Checker
Create a function called `checkAge` that:
- Takes an age as parameter
- Returns "Adult" if age >= 18
- Returns "Minor" if age < 18

---

## ❓ Quiz Questions

Answer these questions (write your answers below):

### Q1: Variable Declaration
What is the difference between `let` and `const`?

**Your Answer**: 
let is for variable that can be cahnges later.
const is for variable taht cannot be cahnges later, or constant

**✅ Correct!** 
- `let` allows reassignment: `let x = 1; x = 2; // OK`
- `const` prevents reassignment: `const x = 1; x = 2; // Error!`

### Q2: Object Access
Given this code:
```javascript
let user = { name: "John", age: 25, city: "Jakarta" };
```
How do you access the user's name? Write two ways.

**Your Answer**: 
console.log(user.name)

**⚠️ Partially Correct!** You gave one way (dot notation), but the question asked for TWO ways.

**Correct Answer:**
1. Dot notation: `user.name`
2. Bracket notation: `user["name"]`

Both return `"John"`. Bracket notation is useful when the property name is stored in a variable or contains special characters.

### Q3: typeof Array
What will `typeof [1, 2, 3]` return? Why?

**Your Answer**: 
array

**❌ Incorrect.**

**Correct Answer:** `"object"`

**Reason:** In JavaScript, arrays are actually a special type of object. There is no `"array"` type in `typeof`. This is a quirk of JavaScript! To check if something is an array, use `Array.isArray([1, 2, 3])` which returns `true`.

```javascript
typeof [1, 2, 3]        // "object"
typeof { a: 1 }         // "object"
Array.isArray([1,2,3])  // true
Array.isArray({a: 1})   // false
```

---

## 📝 Bonus Questions (Optional)

### B1: What happens if you try to change a `const` variable?

**Your Answer**: 
it not cahnges since const is constant cannot be changes (imutable?)

**✅ Correct idea, but more precisely:**
- JavaScript will throw a `TypeError: Assignment to constant variable`
- The code will crash/stop at that line
- Note: `const` objects/arrays can have their *contents* modified, just not reassigned:
```javascript
const arr = [1, 2];
arr.push(3);      // OK! arr is now [1, 2, 3]
arr = [4, 5];     // Error! Cannot reassign
```

### B2: What is the index of "banana" in `["apple", "banana", "orange"]`?

**Your Answer**: 
1

**✅ Correct!** 
- Array indexes start at 0
- `["apple", "banana", "orange"]`
- Index 0 = "apple"
- Index 1 = "banana" ✓
- Index 2 = "orange"

---

## 📊 Quiz Results: Day 1

| Question | Result | Notes |
|----------|--------|-------|
| Q1: let vs const | ✅ Correct | let can change, const cannot |
| Q2: Object access | ⚠️ Partial | Gave 1 way (dot notation), needed 2 ways |
| Q3: typeof array | ❌ Incorrect | Returns "object", not "array" |
| B1: const change | ✅ Correct | Error - cannot reassign |
| B2: banana index | ✅ Correct | Index 1 |

**Score: 3.5/5 (70%)**

---

## ✅ Day 1 Checklist

- [x] Read Module 1 (Lines 25-170)
- [x] Understand frontend vs backend
- [x] Understand variables (let vs const)
- [x] Understand 5 data types
- [x] Type all code examples in practice.ts
- [x] Complete Exercise 1 (Profile)
- [x] Complete Exercise 2 (Calculator)
- [x] Complete Exercise 3 (Age Checker)
- [x] Answer all quiz questions
- [x] Update Progress.md

---

## 🔗 Next Day Preview
Tomorrow you'll learn about **TypeScript** (JavaScript with superpowers) and **async/await** for handling operations that take time.

---

## 💬 Q&A Session Notes

### Q: Why does `let name = "Tedy"` show error "Cannot redeclare block-scoped variable 'name'"?

**A:** This happens because `name` is a built-in global variable (`window.name`). TypeScript treats files without `import`/`export` as scripts in global scope.

**Solutions:**
1. Add `export {};` at the top of your file (makes it a module with its own scope)
2. Use a different variable name like `myName`
3. Wrap code in a function

---

### Q: What is the difference between mutable/immutable and let/const?

**A:** They are different concepts:

| Term | Meaning |
|------|---------|
| `const` | Cannot **reassign** (cannot point to something else) |
| `let` | Can **reassign** |
| **Mutable** | Can **change** the contents (arrays, objects) |
| **Immutable** | Cannot **change** the contents (strings, numbers, booleans) |

**Key insight:** `const` only prevents reassignment, NOT mutation!

```typescript
const arr = [1, 2, 3];
arr.push(4);      // ✅ OK - mutation allowed
arr = [5, 6];     // ❌ Error - reassignment blocked

const str = "hello";
str[0] = "H";     // ❌ Strings are immutable - cannot change
```
