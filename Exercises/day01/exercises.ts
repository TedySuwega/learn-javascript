export {}; // Makes this file a module (avoids global scope conflicts)

// ============================================
// DAY 1 EXERCISES
// ============================================

// Exercise 1: Create Your Profile
// Create variables for your own profile:
// - Your name (string)
// - Your age (number)
// - Are you employed? (boolean)
// - Your skills (array of strings)
// - Your full profile (object with all above)

// Your code here:
let myName = "Tedy";
let age = 30;
let isEmployed = true;
let skills = ["JavaScript", "TypeScript", "React", "Node.js", "Python", "SQL", "Docker", "Kubernetes"];
let fullProfile = {
    name: "Tedy",
    age: 30,
    isEmployed: true,
    skills: ["JavaScript", "TypeScript", "React", "Node.js", "Python", "SQL", "Docker", "Kubernetes"]
};


// Exercise 2: Simple Calculator Function
// Create a function called `add` that:
// - Takes two numbers as parameters
// - Returns the sum
// Test it: add(5, 3) should return 8

// Your code here:
function add(a: number, b: number): number {
    return a + b;
}

console.log(add(5, 3));

// Exercise 3: Age Checker
// Create a function called `checkAge` that:
// - Takes an age as parameter
// - Returns "Adult" if age >= 18
// - Returns "Minor" if age < 18

// Your code here:
function checkAge(age: number): string {
    if (age >= 18) {
        return "Adult";
    } else {
        return "Minor";
    }
}

console.log(checkAge(30));

