// ============================================
// DAY 1 PRACTICE - Type the code from DAY_01.md here
// ============================================

// Start typing your practice code below:
// 1. Variables - Different ways to declare
let myName = "John";
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
console.log(person.name);
console.log(person["age"]);

// 4. Accessing Array Items
console.log(fruits[0]);
console.log(fruits[2]);

// 5. Simple Function
function sayHello(name: string): string { 
    return "Hello, " + name + "!";
}

console.log(sayHello("World"));

//6. Conditional
let temperature = 30;

if (temperature > 25) {
    console.log("It's hot!");
} else if (temperature > 15) 
{
    console.log("it's nice.");
} else {
    console.log("It's cold!")
}

// 7. typeof - Check data type
console.log(typeof myName);
console.log(typeof count);
console.log(typeof isActive);
console.log(typeof fruits);