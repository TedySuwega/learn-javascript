# Backend Development Learning Module for Complete Beginners

Welcome to this comprehensive learning module! This guide will teach you how to understand and build backend applications by explaining every line of code in the CV Management Backend application. By the end of this module, you will understand how professional backend applications work.

**Prerequisites:** None! This module is designed for people with zero coding experience.

---

## Table of Contents

1. [Module 1: Introduction to Programming](#module-1-introduction-to-programming)
2. [Module 2: Understanding the Project Structure](#module-2-understanding-the-project-structure)
3. [Module 3: The Entry Point - Where It All Begins](#module-3-the-entry-point---where-it-all-begins)
4. [Module 4: Understanding Databases](#module-4-understanding-databases)
5. [Module 5: The Repository Layer](#module-5-the-repository-layer---talking-to-the-database)
6. [Module 6: The Service Layer](#module-6-the-service-layer---business-logic)
7. [Module 7: The Controller Layer](#module-7-the-controller-layer---handling-http-requests)
8. [Module 8: Authentication and Security](#module-8-authentication-and-security)
9. [Module 9: The Complete Request Flow](#module-9-the-complete-request-flow)
10. [Module 10: Hands-On Exercises](#module-10-hands-on-exercises)
11. [Glossary](#glossary)

---

# Module 1: Introduction to Programming

## What is Programming?

Programming is like writing a recipe for a computer. Just like a recipe tells a chef what ingredients to use and what steps to follow, a program tells a computer what data to work with and what operations to perform.

**Analogy:** Imagine you're teaching a robot to make a sandwich. You can't just say "make a sandwich" - you need to give specific instructions:
1. Get two slices of bread
2. Open the peanut butter jar
3. Use a knife to spread peanut butter on one slice
4. Put the slices together

Programming is exactly like this - breaking down tasks into small, specific steps that a computer can follow.

## What is a Backend?

When you use a website or an app, there are actually TWO parts working together:

### Frontend (Client-Side)
- What you SEE and interact with
- The buttons, forms, images, and text on your screen
- Runs in your web browser or on your phone
- Example: The login form you fill out

### Backend (Server-Side)
- What PROCESSES your data behind the scenes
- Receives your information, checks if it's correct, stores it
- Runs on a remote computer called a "server"
- Example: Checking if your username and password are correct

```
┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
│                 │         │                 │         │                 │
│    Frontend     │ ──────> │     Backend     │ ──────> │    Database     │
│  (Your Browser) │ <────── │    (Server)     │ <────── │  (Data Storage) │
│                 │         │                 │         │                 │
└─────────────────┘         └─────────────────┘         └─────────────────┘
     You see this           This processes            This stores
                            your requests             your data
```

**This application (AppsBackend) is the Backend** - it's the "brain" that processes requests and manages data.

## How Web Applications Work: The Client-Server Model

When you click a button on a website, here's what happens:

1. **You (Client):** Click "Login" button
2. **Your Browser:** Sends a REQUEST to the server with your email and password
3. **Backend Server:** Receives the request, checks if the password is correct
4. **Database:** The server asks the database "Is this password correct?"
5. **Backend Server:** Gets the answer and sends a RESPONSE back
6. **Your Browser:** Shows you "Login successful!" or "Wrong password"

This back-and-forth communication happens using **HTTP** (HyperText Transfer Protocol) - the language of the web.

## Introduction to JavaScript

JavaScript is a programming language - one of the most popular in the world! It can run in web browsers (frontend) and on servers (backend using Node.js).

### Your First JavaScript Concepts

#### 1. Variables - Storing Information

Variables are like labeled boxes where you store information.

```javascript
// Creating variables to store different types of data
let userName = "John";        // Text (called a "string")
let userAge = 25;             // Number
let isLoggedIn = true;        // Boolean (true or false)

// 'let' means "I'm creating a new box"
// 'userName' is the label on the box
// "John" is what's inside the box
```

**Analogy:** Think of variables like labeled jars in a kitchen:
- A jar labeled "Sugar" contains sugar
- A jar labeled "Salt" contains salt
- You can change what's inside, but the label helps you find it

#### 2. Data Types - Different Kinds of Information

```javascript
// String - Text (always in quotes)
let name = "Alice";
let greeting = 'Hello, World!';

// Number - Numeric values (no quotes)
let age = 30;
let price = 19.99;

// Boolean - True or False
let isActive = true;
let isDeleted = false;

// Array - A list of items (in square brackets)
let fruits = ["apple", "banana", "orange"];
let numbers = [1, 2, 3, 4, 5];

// Object - A collection of related information (in curly braces)
let user = {
    name: "John",
    age: 25,
    email: "john@example.com"
};
```

#### 3. Functions - Reusable Blocks of Code

Functions are like recipes - they define a set of steps that you can use over and over.

```javascript
// Defining a function
function greetUser(name) {
    return "Hello, " + name + "!";
}

// Using (calling) the function
let message = greetUser("Alice");  // message = "Hello, Alice!"
let message2 = greetUser("Bob");   // message2 = "Hello, Bob!"
```

**Breaking it down:**
- `function` - Keyword that says "I'm creating a function"
- `greetUser` - The name of the function (like a recipe name)
- `(name)` - The "ingredient" the function needs (called a parameter)
- `return` - What the function gives back when it's done

#### 4. Conditional Statements - Making Decisions

```javascript
let age = 18;

if (age >= 18) {
    console.log("You can vote!");
} else {
    console.log("You're too young to vote.");
}

// This checks: Is age greater than or equal to 18?
// If YES: print "You can vote!"
// If NO: print "You're too young to vote."
```

## Introduction to TypeScript

TypeScript is JavaScript with "superpowers". The main superpower is **type checking** - it helps catch errors before you run your code.

```typescript
// JavaScript - No types, can cause errors
let userName = "John";
userName = 123;  // JavaScript allows this (but it might cause bugs!)

// TypeScript - With types, catches errors early
let userName: string = "John";
userName = 123;  // ERROR! TypeScript won't allow this
```

### Why Use TypeScript?

1. **Catch errors early** - Find bugs before your code runs
2. **Better autocomplete** - Your editor knows what you can do with each variable
3. **Self-documenting** - Types tell you what kind of data is expected

```typescript
// TypeScript function with types
function calculateTotal(price: number, quantity: number): number {
    return price * quantity;
}

// The ': number' after each parameter says "this must be a number"
// The ': number' at the end says "this function returns a number"

calculateTotal(10, 5);      // Works! Returns 50
calculateTotal("10", 5);    // ERROR! "10" is a string, not a number
```

## Async/Await - Waiting for Things to Happen

In real applications, some operations take time:
- Fetching data from a database
- Sending emails
- Downloading files

JavaScript uses **async/await** to handle these operations without freezing the program.

```typescript
// Without async/await - the program would freeze while waiting
// With async/await - the program can do other things while waiting

async function getUserFromDatabase(email: string) {
    // 'await' means "wait here until this is done"
    const user = await database.findUser(email);
    return user;
}

// 'async' before function means "this function might wait for things"
// 'await' before an operation means "pause here until this finishes"
```

**Analogy:** Imagine ordering coffee:
- **Without async:** You order, then stand completely still until the coffee is ready
- **With async:** You order, get a number, and sit down to read while waiting

## Summary - Module 1

You've learned:
- **Programming** is giving computers specific instructions
- **Backend** is the server-side code that processes data
- **Client-Server model** is how browsers and servers communicate
- **Variables** store information
- **Functions** are reusable blocks of code
- **TypeScript** adds type safety to JavaScript
- **Async/await** handles operations that take time

### Mini Exercise

Try to understand this code:

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

**Questions to answer:**
1. What are the two parameters this function needs?
2. What does this function return?
3. What happens if the user is not found?

---

# Module 2: Understanding the Project Structure

Every professional project has a specific structure - a way of organizing files and folders. Let's explore how this backend application is organized.

## The Folder Structure

```
AppsBackend/
├── src/                          # Source code (the actual code)
│   ├── api/                      # API-related code
│   │   ├── v1/                   # Version 1 of the API
│   │   │   ├── controllers/      # Handle incoming requests
│   │   │   ├── services/         # Business logic
│   │   │   └── repositories/     # Database operations
│   │   └── v2/                   # Version 2 of the API
│   │       ├── controllers/
│   │       ├── services/
│   │       └── repositories/
│   ├── config/                   # Configuration files
│   ├── middleware/               # Code that runs between request and response
│   ├── types/                    # TypeScript type definitions
│   └── index.ts                  # Entry point - where the app starts
├── db/
│   └── migrations/               # Database structure changes
├── config/                       # Sequelize configuration
├── package.json                  # Project dependencies and scripts
├── tsconfig.json                 # TypeScript configuration
└── docker-compose.yml            # Database container setup
```

**Analogy:** Think of this like a company:
- `src/` - The main office building
- `controllers/` - The receptionist (receives visitors/requests)
- `services/` - The workers (do the actual work)
- `repositories/` - The filing department (stores and retrieves documents)
- `config/` - The company policies and settings

## Understanding package.json - The Recipe Book

The `package.json` file is like a recipe book for your project. It tells:
1. What your project is called
2. What other code (libraries) your project needs
3. What commands you can run

Let's examine it line by line:

```json
{
  "name": "backendapps",
  "version": "1.0.0",
  "description": "Fastify TypeScript Backend with Repository Pattern",
  "type": "module",
  "main": "dist/index.js",
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "migrate": "sequelize-cli db:migrate",
    "migrate:undo": "sequelize-cli db:migrate:undo"
  },
  "dependencies": {
    "@fastify/cors": "^8.0.0",
    "fastify": "^4.0.0",
    "sequelize": "^6.37.7",
    "bcrypt": "^6.0.0",
    "jsonwebtoken": "^9.0.2"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "tsx": "^4.0.0"
  }
}
```

### Line-by-Line Explanation

#### Basic Information

```json
"name": "backendapps",
```
- The name of your project
- Used when publishing to npm or in logs
- Must be lowercase, no spaces

```json
"version": "1.0.0",
```
- The version number of your project
- Format: MAJOR.MINOR.PATCH
- 1.0.0 means: first major release, no minor updates, no patches

```json
"description": "Fastify TypeScript Backend with Repository Pattern",
```
- A human-readable description of what this project does

```json
"type": "module",
```
- Tells Node.js to use modern JavaScript modules (import/export)
- Without this, you'd have to use older syntax (require)

```json
"main": "dist/index.js",
```
- The entry point when your project is compiled
- `dist/` is where compiled JavaScript goes
- `src/` contains TypeScript, `dist/` contains JavaScript

#### Scripts - Commands You Can Run

```json
"scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "migrate": "sequelize-cli db:migrate"
},
```

Scripts are shortcuts for commands. You run them with `npm run <script-name>`:

| Command | What It Does |
|---------|--------------|
| `npm run dev` | Starts the server in development mode with auto-reload |
| `npm run build` | Compiles TypeScript to JavaScript |
| `npm start` | Runs the compiled production version |
| `npm run migrate` | Updates the database structure |

**Breaking down `"dev": "tsx watch src/index.ts"`:**
- `tsx` - A tool that runs TypeScript directly
- `watch` - Automatically restart when files change
- `src/index.ts` - The file to run

#### Dependencies - External Libraries

```json
"dependencies": {
    "@fastify/cors": "^8.0.0",
    "fastify": "^4.0.0",
    "sequelize": "^6.37.7",
    "bcrypt": "^6.0.0",
    "jsonwebtoken": "^9.0.2"
},
```

Dependencies are other people's code that your project uses. Think of them as ingredients you buy instead of making from scratch.

| Package | What It Does |
|---------|--------------|
| `fastify` | Web framework - helps create web servers easily |
| `@fastify/cors` | Allows requests from different websites |
| `sequelize` | ORM - helps talk to databases without writing raw SQL |
| `bcrypt` | Securely encrypts passwords |
| `jsonwebtoken` | Creates and verifies login tokens |

**The `^` symbol explained:**
- `"^6.37.7"` means "version 6.37.7 or higher, but less than 7.0.0"
- This allows automatic updates that don't break your code

#### DevDependencies - Development-Only Tools

```json
"devDependencies": {
    "@types/node": "^20.0.0",
    "tsx": "^4.0.0"
}
```

These are only needed during development, not in production:

| Package | What It Does |
|---------|--------------|
| `@types/node` | TypeScript definitions for Node.js |
| `tsx` | Runs TypeScript files directly |

## Understanding npm - Node Package Manager

npm is like an app store for JavaScript code. It lets you:
1. **Download** packages other developers have created
2. **Install** them in your project
3. **Manage** versions and updates

### Common npm Commands

```bash
# Install all dependencies listed in package.json
npm install

# Add a new package to your project
npm install fastify

# Add a development-only package
npm install --save-dev typescript

# Run a script from package.json
npm run dev

# Start the application (special shortcut)
npm start
```

### What Happens When You Run `npm install`?

1. npm reads `package.json`
2. Downloads all listed dependencies
3. Puts them in a folder called `node_modules/`
4. Creates `package-lock.json` (locks exact versions)

**Note:** `node_modules/` is huge and should never be shared. That's why we use `.gitignore` to exclude it.

## Understanding tsconfig.json - TypeScript Settings

This file configures how TypeScript behaves in your project:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "strict": true,
    "outDir": "dist",
    "rootDir": "src",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### Key Settings Explained

```json
"target": "ES2022",
```
- What version of JavaScript to compile to
- ES2022 is a modern version with recent features

```json
"module": "NodeNext",
```
- How to handle imports/exports
- NodeNext works with modern Node.js

```json
"strict": true,
```
- Enable all strict type-checking options
- Catches more potential bugs

```json
"outDir": "dist",
```
- Where to put compiled JavaScript files

```json
"rootDir": "src",
```
- Where your TypeScript source files are

```json
"paths": {
    "@/*": ["./src/*"]
}
```
- Path aliases - shortcuts for imports
- Instead of `import { User } from '../../../types/user'`
- You can write `import { User } from '@/types/user'`

## The Architecture Pattern: Repository-Service-Controller

This project follows a common pattern called "Layered Architecture":

```
┌─────────────────────────────────────────────────────────────┐
│                         CLIENT                               │
│                   (Browser/Mobile App)                       │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                       CONTROLLER                             │
│              Receives requests, sends responses              │
│                   (auth.controller.ts)                       │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                        SERVICE                               │
│          Contains business logic and rules                   │
│                   (user.service.ts)                          │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      REPOSITORY                              │
│            Handles database operations                       │
│                 (user.repository.ts)                         │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                       DATABASE                               │
│                      (PostgreSQL)                            │
└─────────────────────────────────────────────────────────────┘
```

### Why This Pattern?

1. **Separation of Concerns** - Each layer has one job
2. **Testability** - You can test each layer independently
3. **Maintainability** - Easy to find and fix bugs
4. **Reusability** - Services can be used by multiple controllers

**Analogy - A Restaurant:**
- **Controller** = Waiter (takes orders, delivers food)
- **Service** = Chef (prepares the food, knows the recipes)
- **Repository** = Pantry worker (gets ingredients from storage)
- **Database** = The storage room (where ingredients are kept)

## Summary - Module 2

You've learned:
- **Project structure** - How files and folders are organized
- **package.json** - The project's recipe book with dependencies and scripts
- **npm** - The package manager for installing libraries
- **tsconfig.json** - TypeScript configuration
- **Layered Architecture** - Controller → Service → Repository pattern

### Mini Exercise

Look at the `package.json` and answer:
1. What command would you run to start the server in development mode?
2. What library is used for password encryption?
3. What's the difference between dependencies and devDependencies?

---

# Module 3: The Entry Point - Where It All Begins

The entry point is where your application starts running. In this project, it's `src/index.ts`. This is the first file that executes when you run `npm run dev`.

Let's examine every single line of this file.

## The Complete File

Here's the entire `src/index.ts` file. We'll break it down section by section:

```typescript
import Fastify from 'fastify'
import cors from '@fastify/cors'
import swagger from '@fastify/swagger'
import swaggerUi from '@fastify/swagger-ui'
import { authController } from './api/v1/controllers/auth.controller.js'
import { userController } from './api/v1/controllers/user.controller.js'
import { changePasswordController } from './api/v1/controllers/change-password.controller.js'
import { forgotPasswordController } from './api/v1/controllers/forgot-password.controller.js'
import { UserService } from './api/v1/services/user.service.js'
import { UserRepository } from './api/v1/repositories/user.repository.js'
import { ForgotPasswordService } from './api/v1/services/forgot-password.service.js'
import { ForgotPasswordRepository } from './api/v1/repositories/forgot-password.repository.js'
import { ExperienceRepository } from './api/v1/repositories/experience.repository.js'
import { ExperienceService } from './api/v1/services/experience.service.js'
import { experienceController } from './api/v1/controllers/experience.controller.js'
import sequelize from './config/database.js'
import { CertificateRepository } from './api/v1/repositories/certificate.repository.js'
import { CertificateService } from './api/v1/services/certificate.service.js'
import { certificateController } from './api/v1/controllers/certificate.controller.js'

// API V2
import { authController as authControllerV2 } from './api/v2/controllers/auth.controller.js'
import { experienceController as experienceControllerV2 } from './api/v2/controllers/experience.controller.js'
import { testController as testControllerV2 } from './api/v2/controllers/test.controller.js'

const app = Fastify({
  logger: true
})

// Register plugins
await app.register(cors, {
  origin: true
})

// ... (Swagger configuration)

// Initialize database connection
try {
  await sequelize.authenticate()
  console.log('Database connection has been established successfully.')
} catch (error) {
  console.error('Unable to connect to the database:', error)
  process.exit(1)
}

// Initialize dependencies
const userRepository = new UserRepository()
const userService = new UserService(userRepository)
// ... more dependencies

// Register controllers
await authController(app, userService)
await userController(app)
// ... more controllers

// Start server
try {
  await app.listen({ port: 3000, host: '0.0.0.0' })
  console.log('Server is running on http://localhost:3000')
} catch (err) {
  app.log.error(err)
  process.exit(1)
}
```

Now let's understand each section in detail.

---

## Section 1: Import Statements (Lines 1-25)

```typescript
import Fastify from 'fastify'
import cors from '@fastify/cors'
import swagger from '@fastify/swagger'
import swaggerUi from '@fastify/swagger-ui'
```

### What is `import`?

`import` brings in code from other files or packages. Think of it like borrowing tools from a toolbox.

### Line-by-Line Breakdown:

```typescript
import Fastify from 'fastify'
```
- **What:** Imports the Fastify web framework
- **Why:** Fastify helps us create a web server easily
- **`from 'fastify'`:** The package name (installed via npm)
- **`Fastify`:** The name we'll use to reference it in our code

```typescript
import cors from '@fastify/cors'
```
- **What:** Imports CORS (Cross-Origin Resource Sharing) plugin
- **Why:** Allows our API to be called from different websites
- **Example:** Without CORS, a frontend at `example.com` couldn't call our API at `localhost:3000`

```typescript
import swagger from '@fastify/swagger'
import swaggerUi from '@fastify/swagger-ui'
```
- **What:** Imports Swagger documentation tools
- **Why:** Automatically creates API documentation
- **Result:** You can visit `/documentation` to see all available API endpoints

### Importing Our Own Code

```typescript
import { authController } from './api/v1/controllers/auth.controller.js'
import { UserService } from './api/v1/services/user.service.js'
import { UserRepository } from './api/v1/repositories/user.repository.js'
```

- **`{}`** - Curly braces mean we're importing a specific thing (named export)
- **`'./api/v1/...'`** - Path to our own file (`.` means current directory)
- **`.js`** - Even though we write `.ts`, we import as `.js` (TypeScript compiles to JavaScript)

### Renaming Imports

```typescript
import { authController as authControllerV2 } from './api/v2/controllers/auth.controller.js'
```

- **`as authControllerV2`** - Renames the import to avoid conflicts
- We already have `authController` from V1, so we rename V2's version

---

## Section 2: Creating the Application (Lines 27-29)

```typescript
const app = Fastify({
  logger: true
})
```

### Line-by-Line Breakdown:

```typescript
const app = Fastify({
```
- **`const`** - Creates a constant variable (can't be reassigned)
- **`app`** - The name of our server application
- **`Fastify({...})`** - Calls the Fastify function to create a server

```typescript
  logger: true
```
- **Configuration option** - Enables logging
- **Logging** - Prints messages about what the server is doing
- Example output: `{"level":30,"time":1234567890,"msg":"Server listening at http://0.0.0.0:3000"}`

```typescript
})
```
- Closes the configuration object and function call

---

## Section 3: Registering Plugins (Lines 31-87)

```typescript
// Register plugins
await app.register(cors, {
  origin: true
})
```

### What are Plugins?

Plugins add extra features to Fastify. Think of them like add-ons or extensions.

### Line-by-Line Breakdown:

```typescript
await app.register(cors, {
```
- **`await`** - Wait for this to finish before continuing
- **`app.register()`** - Method to add a plugin to our app
- **`cors`** - The plugin we're adding

```typescript
  origin: true
```
- **Configuration** - Allow requests from any origin (any website)
- In production, you'd specify exact allowed origins for security

### Swagger Documentation

```typescript
await app.register(swagger, {
  swagger: {
    info: {
      title: 'CV Management Backend',
      description: 'API documentation for the CV Management Backend application',
      version: '1.0.0'
    },
    host: 'localhost:3000',
    schemes: ['http'],
    consumes: ['application/json'],
    produces: ['application/json'],
    tags: [
      { name: 'Auth', description: 'Authentication related endpoints' },
      { name: 'User', description: 'User profile and dashboard endpoints' },
      // ... more tags
    ],
    securityDefinitions: {
      Bearer: {
        type: 'apiKey',
        name: 'Authorization',
        in: 'header',
        description: 'JWT Authorization header using the Bearer scheme.'
      }
    }
  }
})
```

### Breaking Down the Swagger Configuration:

```typescript
info: {
  title: 'CV Management Backend',        // Name shown in docs
  description: '...',                    // Description shown in docs
  version: '1.0.0'                       // API version
},
```
- Basic information about your API

```typescript
host: 'localhost:3000',                  // Where the API runs
schemes: ['http'],                       // Use HTTP (not HTTPS locally)
consumes: ['application/json'],          // We accept JSON data
produces: ['application/json'],          // We return JSON data
```
- Technical details about the API

```typescript
tags: [
  { name: 'Auth', description: 'Authentication related endpoints' },
  { name: 'User', description: 'User profile and dashboard endpoints' },
],
```
- Groups endpoints by category in the documentation

```typescript
securityDefinitions: {
  Bearer: {
    type: 'apiKey',
    name: 'Authorization',
    in: 'header'
  }
}
```
- Defines how authentication works (using JWT tokens in headers)

---

## Section 4: Database Connection (Lines 89-96)

```typescript
// Initialize database connection
try {
  await sequelize.authenticate()
  console.log('Database connection has been established successfully.')
} catch (error) {
  console.error('Unable to connect to the database:', error)
  process.exit(1)
}
```

### Understanding try/catch

This is **error handling** - preparing for things that might go wrong.

```typescript
try {
  // Code that might fail goes here
} catch (error) {
  // What to do if it fails
}
```

**Analogy:** Like trying to open a door:
- **try:** Attempt to open the door
- **catch:** If the door is locked, do something else (knock, call someone)

### Line-by-Line Breakdown:

```typescript
try {
```
- Start the "try" block - we'll attempt something that might fail

```typescript
  await sequelize.authenticate()
```
- **`sequelize`** - Our database connection tool
- **`.authenticate()`** - Tests if we can connect to the database
- **`await`** - Wait for the database to respond

```typescript
  console.log('Database connection has been established successfully.')
```
- If successful, print a success message to the console

```typescript
} catch (error) {
```
- If anything in the `try` block fails, jump to here
- **`error`** - Contains information about what went wrong

```typescript
  console.error('Unable to connect to the database:', error)
```
- Print an error message with details

```typescript
  process.exit(1)
```
- **`process.exit(1)`** - Stop the application
- **`1`** - Exit code indicating an error (0 = success, 1+ = error)
- We can't run without a database, so we stop the app

---

## Section 5: Dependency Injection (Lines 98-106)

```typescript
// Initialize dependencies
const userRepository = new UserRepository()
const userService = new UserService(userRepository)
const forgotPasswordRepository = new ForgotPasswordRepository()
const forgotPasswordService = new ForgotPasswordService(userRepository, forgotPasswordRepository)
const experienceRepository = new ExperienceRepository()
const experienceService = new ExperienceService(experienceRepository)
const certificateRepository = new CertificateRepository()
const certificateService = new CertificateService(certificateRepository)
```

### What is Dependency Injection?

Dependency Injection is a fancy term for "giving objects the things they need to work."

**Without Dependency Injection:**
```typescript
class UserService {
  private repository = new UserRepository() // Creates its own dependency
}
```

**With Dependency Injection:**
```typescript
class UserService {
  constructor(private repository: UserRepository) {} // Receives dependency from outside
}
```

### Why Use Dependency Injection?

1. **Testability** - Easy to swap real database for a fake one during testing
2. **Flexibility** - Easy to change implementations
3. **Clarity** - Clear what each class depends on

### Line-by-Line Breakdown:

```typescript
const userRepository = new UserRepository()
```
- **`new`** - Creates a new instance (copy) of the class
- **`UserRepository()`** - The repository class
- This object will handle all user database operations

```typescript
const userService = new UserService(userRepository)
```
- Creates a new UserService
- **Passes `userRepository` to it** - The service needs the repository to work
- Now the service can call `userRepository.findByEmail()` etc.

```typescript
const forgotPasswordService = new ForgotPasswordService(userRepository, forgotPasswordRepository)
```
- Some services need multiple repositories
- This service needs both user and forgot-password repositories

---

## Section 6: Route Registration (Lines 108-119)

```typescript
// Register controllers
await authController(app, userService)
await userController(app)
await changePasswordController(app, userService)
await forgotPasswordController(app, forgotPasswordService)
await experienceController(app, experienceService)
await certificateController(app, certificateService)

// API V2
await authControllerV2(app)
await experienceControllerV2(app)
await testControllerV2(app)
```

### What is Route Registration?

Routes are like addresses that tell the server what to do for each URL.

- `/api/v1/auth/login` → Handle login
- `/api/v1/auth/signup` → Handle signup
- `/api/v1/users/profile` → Get user profile

### Line-by-Line Breakdown:

```typescript
await authController(app, userService)
```
- **`authController()`** - A function that adds authentication routes
- **`app`** - Our Fastify server (routes get added to this)
- **`userService`** - The service the controller will use
- This adds routes like `/api/v1/auth/login`, `/api/v1/auth/signup`

```typescript
await authControllerV2(app)
```
- V2 controllers don't receive services (they create their own inside)
- Different design pattern - both approaches work

---

## Section 7: Starting the Server (Lines 122-129)

```typescript
// Start server
try {
  await app.listen({ port: 3000, host: '0.0.0.0' })
  console.log('Server is running on http://localhost:3000')
} catch (err) {
  app.log.error(err)
  process.exit(1)
}
```

### Line-by-Line Breakdown:

```typescript
try {
```
- Start error handling block

```typescript
  await app.listen({ port: 3000, host: '0.0.0.0' })
```
- **`app.listen()`** - Start accepting connections
- **`port: 3000`** - Listen on port 3000 (like apartment number in an address)
- **`host: '0.0.0.0'`** - Accept connections from any IP address

**What is a Port?**
Think of your computer as an apartment building:
- The IP address is the street address
- The port is the apartment number
- Different apps use different ports (web: 80, our app: 3000)

```typescript
  console.log('Server is running on http://localhost:3000')
```
- Print a success message

```typescript
} catch (err) {
  app.log.error(err)
  process.exit(1)
}
```
- If starting fails (e.g., port already in use), log the error and exit

---

## The Complete Flow

When you run `npm run dev`, here's what happens:

```
1. Node.js runs src/index.ts

2. Import all dependencies
   └── Load Fastify, plugins, controllers, services, repositories

3. Create Fastify app
   └── const app = Fastify({ logger: true })

4. Register plugins
   └── CORS, Swagger

5. Connect to database
   └── If fails → exit
   └── If success → continue

6. Create service instances
   └── Repository → Service → Controller (dependency chain)

7. Register routes
   └── All API endpoints become available

8. Start listening
   └── Server ready at http://localhost:3000

9. Wait for requests
   └── Browser/Postman sends request → Server responds
```

## Summary - Module 3

You've learned:
- **Import statements** - Bringing in external code
- **Fastify** - Creating a web server
- **Plugins** - Adding features (CORS, Swagger)
- **try/catch** - Handling errors
- **Dependency Injection** - Giving objects what they need
- **Route registration** - Setting up API endpoints
- **Listening** - Starting the server

### Mini Exercise

Look at this code and answer:

```typescript
const app = Fastify({ logger: true })
await app.listen({ port: 4000, host: '0.0.0.0' })
```

1. What does `logger: true` do?
2. What port will the server listen on?
3. What URL would you use to access this server?

---

# Module 4: Understanding Databases

Databases are where applications store their data permanently. When you sign up for a website, your information is saved in a database. Let's understand how databases work and how this application connects to one.

## What is a Database?

A database is like a digital filing cabinet - an organized way to store, retrieve, and manage data.

**Analogy:** Think of a library:
- The library building = Database
- Each bookshelf = Table
- Each book = Row/Record
- Book properties (title, author, year) = Columns

## Types of Databases

### SQL Databases (Relational)
- Store data in tables with rows and columns
- Tables can be linked (related) to each other
- Examples: PostgreSQL, MySQL, SQLite

### NoSQL Databases
- Store data in flexible formats (documents, key-value, etc.)
- Good for unstructured data
- Examples: MongoDB, Redis

**This project uses PostgreSQL** - a powerful SQL database.

## Understanding Tables, Rows, and Columns

Here's what a `users` table might look like:

| id | full_name | email | password | email_verified | created_at |
|----|-----------|-------|----------|----------------|------------|
| abc-123 | John Doe | john@example.com | $2b$10... | true | 2024-01-15 |
| def-456 | Jane Smith | jane@example.com | $2b$10... | false | 2024-01-16 |
| ghi-789 | Bob Wilson | bob@example.com | $2b$10... | true | 2024-01-17 |

- **Table** = users (the entire grid)
- **Columns** = id, full_name, email, etc. (vertical)
- **Rows** = Each user's data (horizontal)
- **Primary Key** = id (unique identifier for each row)

## Understanding SQL - The Language of Databases

SQL (Structured Query Language) is how we talk to databases.

### Basic SQL Commands

#### SELECT - Getting Data
```sql
-- Get all users
SELECT * FROM users;

-- Get specific columns
SELECT full_name, email FROM users;

-- Get users with a condition
SELECT * FROM users WHERE email_verified = true;

-- Get one user by email
SELECT * FROM users WHERE email = 'john@example.com';
```

#### INSERT - Adding Data
```sql
-- Add a new user
INSERT INTO users (full_name, email, password, email_verified)
VALUES ('Alice Brown', 'alice@example.com', '$2b$10...', false);
```

#### UPDATE - Changing Data
```sql
-- Update a user's email verification status
UPDATE users SET email_verified = true WHERE id = 'abc-123';

-- Update multiple fields
UPDATE users SET full_name = 'John Smith', email = 'johnsmith@example.com' 
WHERE id = 'abc-123';
```

#### DELETE - Removing Data
```sql
-- Delete a specific user
DELETE FROM users WHERE id = 'abc-123';

-- Delete all unverified users (dangerous!)
DELETE FROM users WHERE email_verified = false;
```

### SQL Breakdown - Understanding the Syntax

```sql
SELECT * FROM users WHERE email = 'john@example.com';
```

| Part | Meaning |
|------|---------|
| `SELECT` | "I want to get data" |
| `*` | "All columns" |
| `FROM users` | "From the users table" |
| `WHERE` | "Only rows that match this condition" |
| `email = 'john@example.com'` | "Where email equals this value" |

## The Database Configuration File

Let's examine `src/config/database.ts`:

```typescript
import { Sequelize } from 'sequelize'
import dotenv from 'dotenv'

dotenv.config()

const sequelize = new Sequelize({
  dialect: 'postgres',
  host: 'localhost',
  port:  6432,
  username: 'myuser',
  password: 'mypassword',
  database: 'mydatabase',
  logging: false
})

export default sequelize
```

### Line-by-Line Breakdown:

```typescript
import { Sequelize } from 'sequelize'
```
- **What:** Imports Sequelize - an ORM (Object-Relational Mapper)
- **ORM:** A tool that lets you work with databases using JavaScript instead of SQL
- **Why:** Makes database operations easier and safer

```typescript
import dotenv from 'dotenv'
```
- **What:** Imports dotenv - a tool for environment variables
- **Why:** Allows storing sensitive data (passwords) outside the code

```typescript
dotenv.config()
```
- **What:** Loads variables from a `.env` file
- **Why:** Now we can use `process.env.DATABASE_PASSWORD` instead of hardcoding

```typescript
const sequelize = new Sequelize({
```
- **What:** Creates a new Sequelize connection instance
- **Think of it as:** Opening a phone line to the database

```typescript
  dialect: 'postgres',
```
- **What:** Tells Sequelize we're using PostgreSQL
- **Other options:** 'mysql', 'sqlite', 'mariadb'

```typescript
  host: 'localhost',
```
- **What:** The address where the database is running
- **localhost:** Means "this computer" (127.0.0.1)
- **In production:** Would be a remote server address

```typescript
  port: 6432,
```
- **What:** The port number the database listens on
- **Default PostgreSQL port:** 5432
- **We use 6432:** Because Docker maps it differently

```typescript
  username: 'myuser',
  password: 'mypassword',
```
- **What:** Credentials to access the database
- **Security note:** In real apps, these should come from environment variables!

```typescript
  database: 'mydatabase',
```
- **What:** Which database to connect to
- **One server can have multiple databases**

```typescript
  logging: false
```
- **What:** Disables SQL query logging
- **Set to `console.log`** to see every SQL query executed (useful for debugging)

```typescript
})

export default sequelize
```
- **What:** Makes this connection available to other files
- **Other files can import it:** `import sequelize from './config/database.js'`

## Understanding Migrations

Migrations are like version control for your database structure. They let you:
1. Create tables
2. Modify existing tables
3. Roll back changes if something goes wrong

### Why Use Migrations?

**Without migrations:**
- You manually run SQL to create tables
- Hard to track what changes were made
- Team members might have different database structures

**With migrations:**
- Database changes are tracked in code
- Everyone runs the same migrations
- Can undo changes (rollback)

### Examining a Migration File

Let's look at `db/migrations/001-create-users-table.js`:

```javascript
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Enable uuid-ossp extension for gen_random_uuid() function
    await queryInterface.sequelize.query(`
      CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
    `);
    
    await queryInterface.sequelize.query(`
      CREATE TABLE users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        full_name VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        profile_image VARCHAR(255),
        email_verified BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      DROP TABLE IF EXISTS users;
    `);
  }
};
```

### Breaking Down the Migration:

#### The Structure

```javascript
module.exports = {
  async up(queryInterface, Sequelize) {
    // Code to CREATE or MODIFY (moving forward)
  },

  async down(queryInterface, Sequelize) {
    // Code to UNDO the changes (moving backward)
  }
};
```

- **`up`** - What to do when applying the migration
- **`down`** - What to do when undoing the migration

#### The UP Function - Creating the Table

```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```
- **What:** Enables a PostgreSQL extension for generating UUIDs
- **UUID:** A unique identifier like `a1b2c3d4-e5f6-7890-abcd-ef1234567890`

```sql
CREATE TABLE users (
```
- **What:** Creates a new table called "users"

```sql
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
```
| Part | Meaning |
|------|---------|
| `id` | Column name |
| `UUID` | Data type (unique identifier) |
| `PRIMARY KEY` | This is the main identifier |
| `DEFAULT gen_random_uuid()` | Auto-generate a unique ID |

```sql
  full_name VARCHAR(100) NOT NULL,
```
| Part | Meaning |
|------|---------|
| `full_name` | Column name |
| `VARCHAR(100)` | Text up to 100 characters |
| `NOT NULL` | This field is required (can't be empty) |

```sql
  email VARCHAR(100) NOT NULL UNIQUE,
```
| Part | Meaning |
|------|---------|
| `UNIQUE` | No two users can have the same email |

```sql
  password VARCHAR(255) NOT NULL,
```
- **Why 255 characters?** Hashed passwords are long
- **Never store plain text passwords!**

```sql
  profile_image VARCHAR(255),
```
- **No `NOT NULL`:** This field is optional (can be empty)

```sql
  email_verified BOOLEAN DEFAULT FALSE,
```
| Part | Meaning |
|------|---------|
| `BOOLEAN` | true or false value |
| `DEFAULT FALSE` | New users start as unverified |

```sql
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
```
- **`TIMESTAMP WITH TIME ZONE`** - Date and time with timezone
- **`DEFAULT CURRENT_TIMESTAMP`** - Automatically set to "now"

#### The DOWN Function - Undoing the Migration

```sql
DROP TABLE IF EXISTS users;
```
- **What:** Deletes the table completely
- **`IF EXISTS`:** Don't error if table doesn't exist

### Running Migrations

```bash
# Apply all pending migrations
npm run migrate

# Undo the last migration
npm run migrate:undo

# Undo all migrations
npm run migrate:undo:all
```

## Other Tables in This Application

### The Email Verification Tokens Table

```sql
CREATE TABLE email_verification_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(255) NOT NULL UNIQUE,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

**Key parts:**
- **`REFERENCES users(id)`** - Links to the users table (foreign key)
- **`ON DELETE CASCADE`** - If user is deleted, delete their tokens too

### The Experiences Table

```sql
CREATE TABLE experiences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    company_name VARCHAR(100) NOT NULL,
    position VARCHAR(100) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

**Relationships:**
```
┌──────────────┐         ┌──────────────────┐
│    users     │         │   experiences    │
├──────────────┤         ├──────────────────┤
│ id (PK)      │◄────────│ user_id (FK)     │
│ full_name    │         │ company_name     │
│ email        │         │ position         │
│ password     │         │ start_date       │
└──────────────┘         └──────────────────┘

One user can have MANY experiences
```

## Docker and the Database

This project uses Docker to run PostgreSQL:

```yaml
# docker-compose.yml
version: '3.8'
services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: myuser
      POSTGRES_PASSWORD: mypassword
      POSTGRES_DB: mydatabase
    ports:
      - "6432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
```

**Why Docker?**
- **Consistent environment:** Everyone runs the exact same database version
- **Easy setup:** One command to start
- **Isolation:** Database runs in a container, doesn't affect your system

**Starting the database:**
```bash
docker-compose up -d   # Start in background
docker-compose down    # Stop
```

## Summary - Module 4

You've learned:
- **What a database is** - Organized storage for data
- **Tables, rows, columns** - The structure of relational databases
- **SQL commands** - SELECT, INSERT, UPDATE, DELETE
- **The database configuration** - How to connect to PostgreSQL
- **Migrations** - Version control for database structure
- **Foreign keys** - Linking tables together
- **Docker** - Running the database in a container

### Mini Exercise

Given this SQL:
```sql
SELECT full_name, email FROM users WHERE email_verified = true;
```

1. What columns will be returned?
2. What condition filters the results?
3. Write SQL to get all experiences for user with id 'abc-123'

---

# Module 5: The Repository Layer - Talking to the Database

The Repository Layer is responsible for all database operations. It's the only layer that directly communicates with the database, keeping all SQL queries in one place.

## What is a Repository?

A Repository is a class that handles data access. It provides methods like:
- `findAll()` - Get all records
- `findById(id)` - Get one record by ID
- `create(data)` - Add a new record
- `update(id, data)` - Modify a record
- `delete(id)` - Remove a record

**Analogy:** Think of a Repository as a librarian:
- You ask the librarian for a book (call a method)
- The librarian knows where to find it (SQL query)
- The librarian brings you the book (returns data)
- You never go into the storage room yourself

## Why Use a Repository Layer?

1. **Separation of Concerns** - Database logic stays in one place
2. **Testability** - Easy to mock for testing
3. **Maintainability** - Change database implementation without affecting other code
4. **Reusability** - Same queries can be used by multiple services

## The User Repository - Complete Walkthrough

Let's examine `src/api/v2/repositories/user.repository.ts` line by line:

```typescript
import { SignUp, User } from '@/types/user.js';
import sequelize from '../../../config/database.js'
import { QueryTypes } from 'sequelize'

export class UserRepository {
    async findAll() {
        const result = await sequelize.query(`
            SELECT * FROM users
        `, {
            type: QueryTypes.SELECT
        });
        return result 
    }

    async findByEmail(email: string) {
        const [result] = await sequelize.query(`
            SELECT * FROM users WHERE email = :email
        `, {
            type: QueryTypes.SELECT,
            replacements: { email }
        });

        return result as {
            id: string,
            email: string,
            password: string,
            full_name: string,
            email_verified: boolean
        };
    }

    async insertVerificationToken(userId: string, token: string, expiresAt: Date) {
        await sequelize.query(`
            INSERT INTO email_verification_tokens (user_id, token, expires_at)
            VALUES (:userId, :token, :expiresAt)
        `, {
            replacements: { userId, token, expiresAt }
        });
    }

    async register(SignUpData: SignUp) {
        try {
            const [result] = await sequelize.query(`
                INSERT INTO users (full_name, email, password, email_verified)
                VALUES (:full_name, :email, :password, :email_verified)
                RETURNING *
            `, {
                replacements: {
                    full_name: SignUpData.full_name,
                    email: SignUpData.email,
                    password: SignUpData.password,
                    email_verified: false
                }
            });
            return {
                success: true,
                data: result[0] as { id: string },
                message: 'User registered successfully'
            }
        } catch (error) {
            console.error('Error during sign up:', error)
            return {
                success: false,
                message: 'Internal server error during registration'
            }
        }
    }

    async findVerificationToken(token: string) {
        const [result] = await sequelize.query(`
            SELECT * FROM email_verification_tokens 
            WHERE token = :token AND expires_at > CURRENT_TIMESTAMP
        `, {
            type: QueryTypes.SELECT,
            replacements: { token }
        });
        return result as { user_id: string };
    }

    async updateEmailVerification(userId: string) {
        await sequelize.query(`
            UPDATE users SET email_verified = :email_verified WHERE id = :userId
        `, {
            replacements: { userId, email_verified: true }
        });
    }
}
```

---

## Section 1: Import Statements

```typescript
import { SignUp, User } from '@/types/user.js';
import sequelize from '../../../config/database.js'
import { QueryTypes } from 'sequelize'
```

### Line-by-Line Breakdown:

```typescript
import { SignUp, User } from '@/types/user.js';
```
- **What:** Imports TypeScript type definitions
- **`SignUp`:** Type for signup data (full_name, email, password)
- **`User`:** Type for user data
- **`@/types/user.js`:** Using the path alias (@ = src/)

```typescript
import sequelize from '../../../config/database.js'
```
- **What:** Imports our database connection
- **`../../../`:** Go up three directories (from repositories → v2 → api → src)
- **`config/database.js`:** Then go into config and get database.js

```typescript
import { QueryTypes } from 'sequelize'
```
- **What:** Imports QueryTypes enum from Sequelize
- **Used for:** Telling Sequelize what kind of query we're running
- **Options:** SELECT, INSERT, UPDATE, DELETE, etc.

---

## Section 2: The Class Definition

```typescript
export class UserRepository {
```

### Understanding Classes

A **class** is a blueprint for creating objects. Think of it like a cookie cutter:
- The class is the cutter shape
- Each object created is a cookie

```typescript
export class UserRepository {
    // Methods (functions) go here
}
```

- **`export`** - Makes this class available to other files
- **`class`** - Keyword to define a class
- **`UserRepository`** - Name of the class (PascalCase convention)

---

## Section 3: The findAll Method

```typescript
async findAll() {
    const result = await sequelize.query(`
        SELECT * FROM users
    `, {
        type: QueryTypes.SELECT
    });
    return result 
}
```

### Line-by-Line Breakdown:

```typescript
async findAll() {
```
- **`async`** - This function contains asynchronous operations (database calls)
- **`findAll`** - Method name (describes what it does)
- **`()`** - No parameters needed

```typescript
const result = await sequelize.query(`
```
- **`const result`** - Store the result in a variable
- **`await`** - Wait for the database to respond
- **`sequelize.query(`** - Execute a raw SQL query
- **`\``** - Template literal (allows multi-line strings)

```typescript
    SELECT * FROM users
```
- **SQL query** - Get all columns from users table
- **`*`** - All columns

```typescript
`, {
    type: QueryTypes.SELECT
});
```
- **End of SQL string**
- **`type: QueryTypes.SELECT`** - Tells Sequelize this is a SELECT query
- This helps Sequelize return the data in the right format

```typescript
return result 
```
- **Return the results** - Send data back to whoever called this method

---

## Section 4: The findByEmail Method

```typescript
async findByEmail(email: string) {
    const [result] = await sequelize.query(`
        SELECT * FROM users WHERE email = :email
    `, {
        type: QueryTypes.SELECT,
        replacements: { email }
    });

    return result as {
        id: string,
        email: string,
        password: string,
        full_name: string,
        email_verified: boolean
    };
}
```

### Line-by-Line Breakdown:

```typescript
async findByEmail(email: string) {
```
- **`email: string`** - This method requires an email parameter
- **`: string`** - TypeScript type annotation (must be text)

```typescript
const [result] = await sequelize.query(`
```
- **`const [result]`** - Destructuring: get the first item from the array
- **Why?** SELECT returns an array, but we only want one user

**Destructuring Explained:**
```typescript
// Without destructuring
const results = await query();  // results = [user1, user2, ...]
const firstUser = results[0];

// With destructuring
const [firstUser] = await query();  // firstUser = user1
```

```typescript
    SELECT * FROM users WHERE email = :email
```
- **`:email`** - A placeholder (parameter)
- **Why placeholders?** To prevent SQL injection attacks!

**SQL Injection Prevention:**
```typescript
// DANGEROUS - Never do this!
const query = `SELECT * FROM users WHERE email = '${email}'`;
// If email = "'; DROP TABLE users; --" you're in trouble!

// SAFE - Use placeholders
const query = `SELECT * FROM users WHERE email = :email`;
// The actual value is escaped properly
```

```typescript
    type: QueryTypes.SELECT,
    replacements: { email }
```
- **`replacements: { email }`** - Fill in the :email placeholder
- **Short for:** `replacements: { email: email }`
- Sequelize safely escapes the value

```typescript
return result as {
    id: string,
    email: string,
    password: string,
    full_name: string,
    email_verified: boolean
};
```
- **Type casting** - Tell TypeScript what shape the data has
- **`as { ... }`** - "Treat this result as having these properties"

---

## Section 5: The insertVerificationToken Method

```typescript
async insertVerificationToken(userId: string, token: string, expiresAt: Date) {
    await sequelize.query(`
        INSERT INTO email_verification_tokens (user_id, token, expires_at)
        VALUES (:userId, :token, :expiresAt)
    `, {
        replacements: { userId, token, expiresAt }
    });
}
```

### Line-by-Line Breakdown:

```typescript
async insertVerificationToken(userId: string, token: string, expiresAt: Date) {
```
- **Three parameters:** userId, token, and expiration date
- **`Date`** - TypeScript Date type

```typescript
INSERT INTO email_verification_tokens (user_id, token, expires_at)
VALUES (:userId, :token, :expiresAt)
```
- **`INSERT INTO table_name (columns)`** - Specify which columns to fill
- **`VALUES (:placeholders)`** - The values to insert

**Breaking down INSERT:**
```sql
INSERT INTO email_verification_tokens  -- Table name
    (user_id, token, expires_at)       -- Column names
VALUES 
    (:userId, :token, :expiresAt)      -- Values (placeholders)
```

```typescript
replacements: { userId, token, expiresAt }
```
- Maps JavaScript variables to SQL placeholders
- `userId` → `:userId`
- `token` → `:token`
- `expiresAt` → `:expiresAt`

---

## Section 6: The register Method

```typescript
async register(SignUpData: SignUp) {
    try {
        const [result] = await sequelize.query(`
            INSERT INTO users (full_name, email, password, email_verified)
            VALUES (:full_name, :email, :password, :email_verified)
            RETURNING *
        `, {
            replacements: {
                full_name: SignUpData.full_name,
                email: SignUpData.email,
                password: SignUpData.password,
                email_verified: false
            }
        });
        return {
            success: true,
            data: result[0] as { id: string },
            message: 'User registered successfully'
        }
    } catch (error) {
        console.error('Error during sign up:', error)
        return {
            success: false,
            message: 'Internal server error during registration'
        }
    }
}
```

### Line-by-Line Breakdown:

```typescript
async register(SignUpData: SignUp) {
```
- **`SignUpData: SignUp`** - Parameter with a custom type
- **`SignUp`** - Type imported from our types file

**What does SignUp look like?**
```typescript
type SignUp = {
    full_name: string;
    email: string;
    password: string;
}
```

```typescript
try {
```
- Start error handling - registration might fail (duplicate email, etc.)

```typescript
INSERT INTO users (full_name, email, password, email_verified)
VALUES (:full_name, :email, :password, :email_verified)
RETURNING *
```
- **`RETURNING *`** - PostgreSQL feature: return the inserted row
- This gives us the auto-generated `id` without another query

```typescript
replacements: {
    full_name: SignUpData.full_name,
    email: SignUpData.email,
    password: SignUpData.password,
    email_verified: false
}
```
- Map SignUpData properties to SQL placeholders
- **`email_verified: false`** - New users start unverified

```typescript
return {
    success: true,
    data: result[0] as { id: string },
    message: 'User registered successfully'
}
```
- Return a structured response
- **`result[0]`** - The first (and only) inserted row
- Contains the new user's ID

```typescript
} catch (error) {
    console.error('Error during sign up:', error)
    return {
        success: false,
        message: 'Internal server error during registration'
    }
}
```
- If something goes wrong (like duplicate email), catch the error
- Log it for debugging
- Return a friendly error response

---

## Section 7: The findVerificationToken Method

```typescript
async findVerificationToken(token: string) {
    const [result] = await sequelize.query(`
        SELECT * FROM email_verification_tokens 
        WHERE token = :token AND expires_at > CURRENT_TIMESTAMP
    `, {
        type: QueryTypes.SELECT,
        replacements: { token }
    });
    return result as { user_id: string };
}
```

### Key SQL Concept: Multiple Conditions

```sql
WHERE token = :token AND expires_at > CURRENT_TIMESTAMP
```
- **`AND`** - Both conditions must be true
- **`expires_at > CURRENT_TIMESTAMP`** - Token hasn't expired yet
- **`CURRENT_TIMESTAMP`** - PostgreSQL function for "right now"

---

## Section 8: The updateEmailVerification Method

```typescript
async updateEmailVerification(userId: string) {
    await sequelize.query(`
        UPDATE users SET email_verified = :email_verified WHERE id = :userId
    `, {
        replacements: { userId, email_verified: true }
    });
}
```

### Understanding UPDATE

```sql
UPDATE users                          -- Which table
SET email_verified = :email_verified  -- What to change
WHERE id = :userId                    -- Which row(s)
```

- **`SET column = value`** - Change this column to this value
- **`WHERE`** - Only update rows matching this condition
- **Without WHERE, ALL rows would be updated!**

---

## Repository Pattern Summary

Here's how the Repository methods map to database operations:

| Method | SQL Command | Purpose |
|--------|-------------|---------|
| `findAll()` | SELECT * | Get all records |
| `findByEmail(email)` | SELECT WHERE | Find one record |
| `register(data)` | INSERT RETURNING | Create and return new record |
| `insertVerificationToken()` | INSERT | Add a new record |
| `updateEmailVerification()` | UPDATE WHERE | Modify a record |

## How Other Layers Use the Repository

```typescript
// In a Service file
const userRepository = new UserRepository();

// Get a user
const user = await userRepository.findByEmail('john@example.com');

// Register a new user
const result = await userRepository.register({
    full_name: 'John Doe',
    email: 'john@example.com',
    password: 'hashedPassword123'
});
```

## Summary - Module 5

You've learned:
- **What a Repository is** - Data access layer
- **Class syntax** - Defining methods in a class
- **SQL queries** - SELECT, INSERT, UPDATE
- **Parameterized queries** - Using placeholders for safety
- **Destructuring** - `const [first] = array`
- **Type casting** - `as { type }`
- **Error handling** - try/catch in database operations

### Mini Exercise

Write a repository method to delete a user by ID:

```typescript
async deleteById(userId: string) {
    // Your code here
    // Hint: Use DELETE FROM ... WHERE ...
}
```

---

# Module 6: The Service Layer - Business Logic

The Service Layer contains the "business logic" of your application - the rules and processes that make your application work. It sits between Controllers (which handle HTTP) and Repositories (which handle data).

## What is Business Logic?

Business logic is the code that implements the rules of your application:

- **Rule:** Users must verify their email before logging in
- **Rule:** Passwords must be hashed before storing
- **Rule:** Verification tokens expire after 24 hours
- **Rule:** A user can't register with an email that already exists

These rules don't belong in the database layer (Repository) or the HTTP layer (Controller). They belong in the Service.

## Why Use a Service Layer?

**Without Service Layer:**
```typescript
// Controller becomes messy with all the logic
app.post('/signup', async (request, reply) => {
    // Check if email exists
    // Validate password strength
    // Hash password
    // Save to database
    // Generate verification token
    // Send email
    // Return response
    // 100+ lines of code in one place!
});
```

**With Service Layer:**
```typescript
// Controller is clean
app.post('/signup', async (request, reply) => {
    const result = await userService.SignUp(request.body);
    return reply.send(result);
});

// All logic is organized in the service
```

## The User Service - Complete Walkthrough

Let's examine `src/api/v2/services/user.service.ts` line by line:

```typescript
import { SignUp } from '@/types/user.js';
import { UserRepository } from '../repositories/user.repository.js';
import bcrypt from 'bcrypt';
import { Hash } from '@sinclair/typebox/value';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';

const userRepository = new UserRepository();

export class UserService {
    constructor() {
    }

    async hashPassword(password: string): Promise<string> {
        const saltRounds = 10
        return bcrypt.hash(password, saltRounds)
    }

    generateVerificationToken(): string {
        return crypto.randomBytes(32).toString('hex')
    }

    async SignUp(SignUpData: SignUp) {
        // Check if email is already registered
        const isRegistered = await userRepository.findByEmail(SignUpData.email)
        if (isRegistered) {
            return {
                success: false,
                message: 'Email is already registered'
            }
        }

        // Hash Password
        const hashedPassword = await this.hashPassword(SignUpData.password)

        const register = await userRepository.register({
            ...SignUpData,
            password: hashedPassword
        });

        if(register.success) {
            const verificationToken = this.generateVerificationToken();
            
            const expiresAt = new Date()
            expiresAt.setHours(expiresAt.getHours() + 24)

            if(register.data?.id) {
                await userRepository.insertVerificationToken(
                    register.data?.id as string, 
                    verificationToken, 
                    expiresAt
                )
            }

            return {
                success: true,
                message: 'User registered successfully',
                data: {
                    ...register.data,
                    password: undefined
                }
            }
        }
        
        return {
            success: false,
            message: 'Internal server error during registration'
        }
    }

    async verifyEmail(token: string) {
        const verificationToken = await userRepository.findVerificationToken(token)
        if(!verificationToken) {
            return {
                success: false,
                message: 'Invalid or expired verification token'
            }
        }
        
        await userRepository.updateEmailVerification(verificationToken.user_id)
        return {
            success: true,
            message: 'Email verified successfully'
        }
    }

    async login(email: string, password: string) {
        const user = await userRepository.findByEmail(email)
        if(!user) {
            return {
                success: false,
                message: 'User not found'
            }
        }

        if(!user.email_verified) {
            return {
                success: false,
                message: 'Email not verified'
            }
        }

        const isPasswordValid = await bcrypt.compare(password, user.password)
        if(!isPasswordValid) {
            return {
                success: false,
                message: 'Invalid password'
            }
        }

        const token = jwt.sign({
            id: user.id,
            email: user.email,
            full_name: user.full_name
        }, 'iniadalahsecretkey', {
            expiresIn: '24h'
        })

        return {
            success: true,
            message: 'Login successful',
            access_token: token
        }
    }
}
```

---

## Section 1: Import Statements

```typescript
import { SignUp } from '@/types/user.js';
import { UserRepository } from '../repositories/user.repository.js';
import bcrypt from 'bcrypt';
import { Hash } from '@sinclair/typebox/value';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
```

### Line-by-Line Breakdown:

```typescript
import { SignUp } from '@/types/user.js';
```
- **Type definition** for signup data

```typescript
import { UserRepository } from '../repositories/user.repository.js';
```
- **The Repository** - this is how the service talks to the database

```typescript
import bcrypt from 'bcrypt';
```
- **bcrypt** - A library for securely hashing passwords
- Why bcrypt? It's specifically designed for passwords and is very secure

```typescript
import crypto from 'crypto';
```
- **crypto** - Node.js built-in module for cryptographic functions
- Used to generate random tokens

```typescript
import jwt from 'jsonwebtoken';
```
- **JWT** - JSON Web Tokens
- Used for creating login tokens (we'll explain this in detail in Module 8)

---

## Section 2: Repository Instance

```typescript
const userRepository = new UserRepository();
```

- Creates an instance of UserRepository
- The service will use this to interact with the database
- This is created once and reused for all operations

---

## Section 3: The Class Definition

```typescript
export class UserService {
    constructor() {
    }
```

### Understanding Constructors

A **constructor** is a special method that runs when you create a new instance:

```typescript
class Car {
    constructor(color: string) {
        this.color = color;
        console.log('New car created!');
    }
}

const myCar = new Car('red');  // Prints: "New car created!"
```

In this service, the constructor is empty - no special setup needed.

---

## Section 4: The hashPassword Method

```typescript
async hashPassword(password: string): Promise<string> {
    const saltRounds = 10
    return bcrypt.hash(password, saltRounds)
}
```

### What is Password Hashing?

**Hashing** converts a password into a scrambled string that can't be reversed:

```
Original:  "myPassword123"
Hashed:    "$2b$10$N9qo8uLOickgx2ZMRZoMy.MQDMNkXCbUg8rOkqG6eQIWc9dgjQgX."
```

**Why hash passwords?**
- If someone steals your database, they can't see real passwords
- Even you (the developer) shouldn't see user passwords

### Line-by-Line Breakdown:

```typescript
async hashPassword(password: string): Promise<string> {
```
- **`async`** - Hashing takes time (intentionally slow for security)
- **`password: string`** - Takes the plain text password
- **`: Promise<string>`** - Returns a promise that resolves to the hashed password

```typescript
const saltRounds = 10
```
- **Salt** - Random data added to the password before hashing
- **Rounds** - How many times to process (higher = more secure, but slower)
- **10** is a good balance of security and performance

```typescript
return bcrypt.hash(password, saltRounds)
```
- **`bcrypt.hash()`** - Creates the hash
- Returns something like: `$2b$10$N9qo8uLO...`

### Why Salt Matters

Without salt, same passwords produce same hashes:
```
"password123" → "abc123..." (always)
```

With salt, same passwords produce different hashes:
```
"password123" + salt1 → "xyz789..."
"password123" + salt2 → "def456..."
```

This prevents attackers from using pre-computed hash tables.

---

## Section 5: The generateVerificationToken Method

```typescript
generateVerificationToken(): string {
    return crypto.randomBytes(32).toString('hex')
}
```

### Line-by-Line Breakdown:

```typescript
generateVerificationToken(): string {
```
- **Not async** - This is fast and synchronous
- **`: string`** - Returns a string

```typescript
return crypto.randomBytes(32).toString('hex')
```
- **`crypto.randomBytes(32)`** - Generate 32 random bytes
- **`.toString('hex')`** - Convert to hexadecimal string

**Result:** A 64-character random string like:
```
"a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8"
```

This is used in email verification links.

---

## Section 6: The SignUp Method (The Main Registration Logic)

```typescript
async SignUp(SignUpData: SignUp) {
    // Check if email is already registered
    const isRegistered = await userRepository.findByEmail(SignUpData.email)
    if (isRegistered) {
        return {
            success: false,
            message: 'Email is already registered'
        }
    }

    // Hash Password
    const hashedPassword = await this.hashPassword(SignUpData.password)

    const register = await userRepository.register({
        ...SignUpData,
        password: hashedPassword
    });

    if(register.success) {
        const verificationToken = this.generateVerificationToken();
        
        const expiresAt = new Date()
        expiresAt.setHours(expiresAt.getHours() + 24)

        if(register.data?.id) {
            await userRepository.insertVerificationToken(
                register.data?.id as string, 
                verificationToken, 
                expiresAt
            )
        }

        return {
            success: true,
            message: 'User registered successfully',
            data: {
                ...register.data,
                password: undefined
            }
        }
    }
    
    return {
        success: false,
        message: 'Internal server error during registration'
    }
}
```

### Step-by-Step Breakdown:

#### Step 1: Check if Email Already Exists

```typescript
const isRegistered = await userRepository.findByEmail(SignUpData.email)
if (isRegistered) {
    return {
        success: false,
        message: 'Email is already registered'
    }
}
```

**Business Rule:** Each email can only register once.

- Query the database for this email
- If found, return an error (don't continue)

#### Step 2: Hash the Password

```typescript
const hashedPassword = await this.hashPassword(SignUpData.password)
```

**Business Rule:** Never store plain text passwords.

- **`this.hashPassword()`** - Call our method (using `this` because it's in the same class)

#### Step 3: Save to Database

```typescript
const register = await userRepository.register({
    ...SignUpData,
    password: hashedPassword
});
```

**Understanding the Spread Operator (`...`):**

```typescript
// SignUpData = { full_name: "John", email: "john@example.com", password: "plain123" }

// This:
{
    ...SignUpData,
    password: hashedPassword
}

// Becomes:
{
    full_name: "John",
    email: "john@example.com",
    password: "$2b$10$..." // Replaced with hashed version
}
```

- **`...SignUpData`** - Copy all properties from SignUpData
- **`password: hashedPassword`** - Override the password with the hashed version

#### Step 4: Generate Verification Token

```typescript
if(register.success) {
    const verificationToken = this.generateVerificationToken();
    
    const expiresAt = new Date()
    expiresAt.setHours(expiresAt.getHours() + 24)
```

**Business Rule:** Email verification tokens expire after 24 hours.

- **`new Date()`** - Current date/time
- **`setHours(getHours() + 24)`** - Add 24 hours

#### Step 5: Store the Token

```typescript
if(register.data?.id) {
    await userRepository.insertVerificationToken(
        register.data?.id as string, 
        verificationToken, 
        expiresAt
    )
}
```

**Understanding `?.` (Optional Chaining):**

```typescript
// Without optional chaining (can crash if data is undefined)
register.data.id  // Error if data is undefined!

// With optional chaining (safe)
register.data?.id  // Returns undefined if data is undefined
```

#### Step 6: Return Success (Without Password!)

```typescript
return {
    success: true,
    message: 'User registered successfully',
    data: {
        ...register.data,
        password: undefined
    }
}
```

**Security:** Never return the password, even hashed!
- **`password: undefined`** - Remove password from response

---

## Section 7: The verifyEmail Method

```typescript
async verifyEmail(token: string) {
    const verificationToken = await userRepository.findVerificationToken(token)
    if(!verificationToken) {
        return {
            success: false,
            message: 'Invalid or expired verification token'
        }
    }
    
    await userRepository.updateEmailVerification(verificationToken.user_id)
    return {
        success: true,
        message: 'Email verified successfully'
    }
}
```

### The Flow:

1. **Find the token** in the database
2. **If not found or expired** → Return error
3. **If valid** → Update user's `email_verified` to `true`
4. **Return success**

---

## Section 8: The login Method

```typescript
async login(email: string, password: string) {
    const user = await userRepository.findByEmail(email)
    if(!user) {
        return {
            success: false,
            message: 'User not found'
        }
    }

    if(!user.email_verified) {
        return {
            success: false,
            message: 'Email not verified'
        }
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if(!isPasswordValid) {
        return {
            success: false,
            message: 'Invalid password'
        }
    }

    const token = jwt.sign({
        id: user.id,
        email: user.email,
        full_name: user.full_name
    }, 'iniadalahsecretkey', {
        expiresIn: '24h'
    })

    return {
        success: true,
        message: 'Login successful',
        access_token: token
    }
}
```

### Step-by-Step Breakdown:

#### Step 1: Find the User

```typescript
const user = await userRepository.findByEmail(email)
if(!user) {
    return {
        success: false,
        message: 'User not found'
    }
}
```

**Business Rule:** Can't login with non-existent email.

#### Step 2: Check Email Verification

```typescript
if(!user.email_verified) {
    return {
        success: false,
        message: 'Email not verified'
    }
}
```

**Business Rule:** Users must verify email before logging in.

#### Step 3: Verify Password

```typescript
const isPasswordValid = await bcrypt.compare(password, user.password)
if(!isPasswordValid) {
    return {
        success: false,
        message: 'Invalid password'
    }
}
```

**Understanding `bcrypt.compare()`:**

```typescript
// bcrypt.compare(plainPassword, hashedPassword)
// Returns true if they match, false if they don't

await bcrypt.compare("myPassword123", "$2b$10$N9qo8uLO...")  // true
await bcrypt.compare("wrongPassword", "$2b$10$N9qo8uLO...")  // false
```

- **You can't "un-hash" a password**
- Instead, hash the input and compare the hashes

#### Step 4: Generate JWT Token

```typescript
const token = jwt.sign({
    id: user.id,
    email: user.email,
    full_name: user.full_name
}, 'iniadalahsecretkey', {
    expiresIn: '24h'
})
```

**Understanding JWT:**

```typescript
jwt.sign(
    payload,      // Data to include in the token
    secretKey,    // Secret key to sign the token
    options       // Configuration (like expiration)
)
```

**The Payload:** Information stored in the token
```javascript
{
    id: "abc-123",
    email: "john@example.com",
    full_name: "John Doe"
}
```

**The Secret Key:** `'iniadalahsecretkey'`
- Used to sign and verify tokens
- **Security Note:** Should be in environment variables, not hardcoded!

**Options:** `{ expiresIn: '24h' }`
- Token expires after 24 hours
- User must login again after that

#### Step 5: Return the Token

```typescript
return {
    success: true,
    message: 'Login successful',
    access_token: token
}
```

The client stores this token and sends it with future requests.

---

## Service Layer Summary

| Method | Purpose | Business Rules |
|--------|---------|----------------|
| `hashPassword()` | Secure password storage | Use bcrypt with salt |
| `generateVerificationToken()` | Create email verification token | 64-char random hex |
| `SignUp()` | Register new user | Check duplicate, hash password, create token |
| `verifyEmail()` | Verify email address | Check token validity, update user |
| `login()` | Authenticate user | Check email verified, compare password, create JWT |

## Summary - Module 6

You've learned:
- **What business logic is** - Application rules and processes
- **Password hashing** - Using bcrypt to secure passwords
- **Token generation** - Creating random verification tokens
- **The registration flow** - Check, hash, save, verify
- **The login flow** - Find, check, compare, token
- **JWT tokens** - Creating authentication tokens
- **Spread operator** - `...object` to copy and override

### Mini Exercise

Create a method to change a user's password:

```typescript
async changePassword(userId: string, oldPassword: string, newPassword: string) {
    // 1. Find the user by ID
    // 2. Verify the old password is correct
    // 3. Hash the new password
    // 4. Update in database
    // 5. Return success or error
}
```

---

# Module 7: The Controller Layer - Handling HTTP Requests

The Controller Layer is where your application meets the outside world. Controllers receive HTTP requests from clients (browsers, mobile apps, etc.), process them, and send back responses.

## What is a Controller?

A Controller is like a receptionist:
1. **Receives** incoming requests
2. **Understands** what the client wants
3. **Delegates** the work to the appropriate service
4. **Sends back** a response

```
Client Request → Controller → Service → Repository → Database
                     ↓
              Client Response
```

## HTTP Basics - How the Web Communicates

Before diving into the code, let's understand HTTP.

### HTTP Methods (Verbs)

| Method | Purpose | Example |
|--------|---------|---------|
| GET | Retrieve data | Get user profile |
| POST | Create data | Register new user |
| PUT | Update entire resource | Update all user info |
| PATCH | Partial update | Update just the email |
| DELETE | Remove data | Delete account |

### HTTP Status Codes

| Code | Meaning | When to Use |
|------|---------|-------------|
| 200 | OK | Request successful |
| 201 | Created | New resource created |
| 400 | Bad Request | Invalid data sent |
| 401 | Unauthorized | Not logged in |
| 403 | Forbidden | Logged in but no permission |
| 404 | Not Found | Resource doesn't exist |
| 500 | Server Error | Something broke on the server |

### HTTP Request Structure

```
POST /api/v2/auth/signup HTTP/1.1
Host: localhost:3000
Content-Type: application/json
Authorization: Bearer eyJhbGc...

{
    "full_name": "John Doe",
    "email": "john@example.com",
    "password": "SecurePass123!"
}
```

**Parts:**
- **Method:** POST
- **URL:** /api/v2/auth/signup
- **Headers:** Content-Type, Authorization
- **Body:** JSON data

## The Auth Controller - Complete Walkthrough

Let's examine `src/api/v2/controllers/auth.controller.ts`:

```typescript
import { FastifyInstance } from 'fastify'
import { UserService } from '../services/user.service.js'
import { SignUp, SignUpSchema, LoginSchema } from '@/types/user.js';
import { Type } from '@fastify/type-provider-typebox';
import { authenticateToken } from '@/middleware/auth.middleware.v2.js';
import { AuthenticatedRequest, JWTPayload } from '@/middleware/auth.middleware.v2.js';

export async function authController(fastify: FastifyInstance) {
  const userService = new UserService();

  fastify.post('/api/v2/auth/signup', {
    schema: {
      tags: ['Auth'],
      summary: 'User signup',
      description: 'Register a new user account',
      body: SignUpSchema
    }
  }, async (request, reply) => {
    const signUpData = request.body as SignUp;
    const result = await userService.SignUp(signUpData);
    
    if(result.success) {
      return reply.status(200).send({ message: result.message, data: result.data });
    } else {
      return reply.status(400).send({ message: result.message });
    }
  })

  fastify.get('/api/v2/auth/verify', {
    schema: {
      tags: ['Auth'],
      summary: 'Email verification',
      description: 'Verify user email with verification token',
    }
  }, async (request, reply) => {
    const { token } = request.query as { token: string };
    const result = await userService.verifyEmail(token);
    
    if(result.success) {
      return reply.status(200).send({ message: result.message });
    } else {
      return reply.status(400).send({ message: result.message });
    }
  });

  fastify.post('/api/v2/auth/login', {
    schema: {
      tags: ['Auth'],
      summary: 'User login',
      description: 'Authenticate user with email and password',
      body: LoginSchema
    }
  }, async (request, reply) => {
    const { email, password } = request.body as { email: string; password: string };
    const result = await userService.login(email, password);
    
    if(result.success) {
      return reply.status(200).send({ message: result.message, access_token: result.access_token });
    } else {
      return reply.status(400).send({ message: result.message });
    }
  });

  fastify.get('/api/v2/auth/profile', {
    preHandler: authenticateToken,
    schema: {
      tags: ['Auth'],
      summary: 'User profile',
      description: 'Get user profile',
      security: [{ Bearer: [] }],
    }
  }, async (request: AuthenticatedRequest, reply) => {
    const user = request.user as JWTPayload;
    return reply.status(200).send({ message: 'Profile retrieved successfully', user: user });
  });
}
```

---

## Section 1: Import Statements

```typescript
import { FastifyInstance } from 'fastify'
import { UserService } from '../services/user.service.js'
import { SignUp, SignUpSchema, LoginSchema } from '@/types/user.js';
import { Type } from '@fastify/type-provider-typebox';
import { authenticateToken } from '@/middleware/auth.middleware.v2.js';
import { AuthenticatedRequest, JWTPayload } from '@/middleware/auth.middleware.v2.js';
```

### Line-by-Line Breakdown:

```typescript
import { FastifyInstance } from 'fastify'
```
- **FastifyInstance** - The type of our Fastify server
- Used for type safety when registering routes

```typescript
import { UserService } from '../services/user.service.js'
```
- The service that handles business logic
- Controller will delegate work to this

```typescript
import { SignUp, SignUpSchema, LoginSchema } from '@/types/user.js';
```
- **SignUp** - TypeScript type for signup data
- **SignUpSchema** - Validation schema (we'll explain this)
- **LoginSchema** - Validation schema for login

```typescript
import { authenticateToken } from '@/middleware/auth.middleware.v2.js';
```
- **Middleware** that checks if the user is logged in
- Used for protected routes

---

## Section 2: The Controller Function

```typescript
export async function authController(fastify: FastifyInstance) {
  const userService = new UserService();
```

### Understanding the Structure:

```typescript
export async function authController(fastify: FastifyInstance) {
```
- **`export`** - Makes this function available to other files
- **`async function`** - This function uses await
- **`authController`** - Name of the function
- **`fastify: FastifyInstance`** - Receives the Fastify server instance

```typescript
const userService = new UserService();
```
- Create an instance of UserService
- All route handlers will use this

---

## Section 3: The Signup Route

```typescript
fastify.post('/api/v2/auth/signup', {
  schema: {
    tags: ['Auth'],
    summary: 'User signup',
    description: 'Register a new user account',
    body: SignUpSchema
  }
}, async (request, reply) => {
  const signUpData = request.body as SignUp;
  const result = await userService.SignUp(signUpData);
  
  if(result.success) {
    return reply.status(200).send({ message: result.message, data: result.data });
  } else {
    return reply.status(400).send({ message: result.message });
  }
})
```

### Breaking It Down:

#### Route Registration

```typescript
fastify.post('/api/v2/auth/signup', {
```
- **`fastify.post()`** - Register a POST route
- **`'/api/v2/auth/signup'`** - The URL path

**URL Structure:**
```
/api/v2/auth/signup
  │   │   │     │
  │   │   │     └── Action: signup
  │   │   └── Category: auth (authentication)
  │   └── Version: v2
  └── Prefix: api
```

#### Schema (Documentation & Validation)

```typescript
schema: {
  tags: ['Auth'],
  summary: 'User signup',
  description: 'Register a new user account',
  body: SignUpSchema
}
```

| Property | Purpose |
|----------|---------|
| `tags` | Groups this route in Swagger documentation |
| `summary` | Short description |
| `description` | Detailed description |
| `body` | Schema to validate the request body |

**What is SignUpSchema?**

```typescript
// From @/types/user.js
import { Type } from '@sinclair/typebox';

export const SignUpSchema = Type.Object({
  full_name: Type.String({ minLength: 1 }),
  email: Type.String({ format: 'email' }),
  password: Type.String({ minLength: 8 })
});
```

This schema:
- Validates that `full_name` is a non-empty string
- Validates that `email` is a valid email format
- Validates that `password` is at least 8 characters

**If validation fails, Fastify automatically returns a 400 error!**

#### The Handler Function

```typescript
async (request, reply) => {
```
- **`request`** - Contains all information about the incoming request
- **`reply`** - Used to send the response

#### Extracting Data from Request

```typescript
const signUpData = request.body as SignUp;
```
- **`request.body`** - The JSON data sent by the client
- **`as SignUp`** - Type casting (tell TypeScript the type)

**What the client sends:**
```json
{
    "full_name": "John Doe",
    "email": "john@example.com",
    "password": "SecurePass123!"
}
```

**What we receive:**
```typescript
signUpData = {
    full_name: "John Doe",
    email: "john@example.com",
    password: "SecurePass123!"
}
```

#### Calling the Service

```typescript
const result = await userService.SignUp(signUpData);
```
- Pass the data to the service
- Service handles all the business logic
- Returns a result object

#### Sending the Response

```typescript
if(result.success) {
  return reply.status(200).send({ message: result.message, data: result.data });
} else {
  return reply.status(400).send({ message: result.message });
}
```

**Understanding `reply`:**

```typescript
reply
  .status(200)      // Set HTTP status code
  .send({           // Send JSON response
    message: "...",
    data: { ... }
  });
```

**Success Response (200):**
```json
{
    "message": "User registered successfully",
    "data": {
        "id": "abc-123",
        "full_name": "John Doe",
        "email": "john@example.com"
    }
}
```

**Error Response (400):**
```json
{
    "message": "Email is already registered"
}
```

---

## Section 4: The Verify Email Route

```typescript
fastify.get('/api/v2/auth/verify', {
  schema: {
    tags: ['Auth'],
    summary: 'Email verification',
    description: 'Verify user email with verification token',
  }
}, async (request, reply) => {
  const { token } = request.query as { token: string };
  const result = await userService.verifyEmail(token);
  
  if(result.success) {
    return reply.status(200).send({ message: result.message });
  } else {
    return reply.status(400).send({ message: result.message });
  }
});
```

### Key Difference: Query Parameters

```typescript
const { token } = request.query as { token: string };
```

**Query Parameters vs Body:**

| Type | Example URL | How to Access |
|------|-------------|---------------|
| Query | `/verify?token=abc123` | `request.query` |
| Body | POST with JSON | `request.body` |
| Params | `/users/:id` | `request.params` |

**The URL:**
```
/api/v2/auth/verify?token=a7b8c9d0e1f2...
                    └── Query parameter
```

**Destructuring:**
```typescript
// This:
const { token } = request.query;

// Is the same as:
const token = request.query.token;
```

---

## Section 5: The Login Route

```typescript
fastify.post('/api/v2/auth/login', {
  schema: {
    tags: ['Auth'],
    summary: 'User login',
    description: 'Authenticate user with email and password',
    body: LoginSchema
  }
}, async (request, reply) => {
  const { email, password } = request.body as { email: string; password: string };
  const result = await userService.login(email, password);
  
  if(result.success) {
    return reply.status(200).send({ message: result.message, access_token: result.access_token });
  } else {
    return reply.status(400).send({ message: result.message });
  }
});
```

### Key Points:

```typescript
const { email, password } = request.body as { email: string; password: string };
```
- **Destructuring** - Extract email and password from body
- Same as:
  ```typescript
  const email = request.body.email;
  const password = request.body.password;
  ```

**Success Response includes the token:**
```json
{
    "message": "Login successful",
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

The client stores this token and sends it with future requests.

---

## Section 6: The Profile Route (Protected)

```typescript
fastify.get('/api/v2/auth/profile', {
  preHandler: authenticateToken,
  schema: {
    tags: ['Auth'],
    summary: 'User profile',
    description: 'Get user profile',
    security: [{ Bearer: [] }],
  }
}, async (request: AuthenticatedRequest, reply) => {
  const user = request.user as JWTPayload;
  return reply.status(200).send({ message: 'Profile retrieved successfully', user: user });
});
```

### Key Difference: Protected Route

```typescript
preHandler: authenticateToken,
```
- **`preHandler`** - Code that runs BEFORE the main handler
- **`authenticateToken`** - Middleware that checks for a valid JWT token
- If no token or invalid token → Returns 401 (Unauthorized)
- If valid token → Continues to the handler

**The Flow:**
```
1. Client sends request with "Authorization: Bearer <token>"
2. authenticateToken middleware runs
   - Extracts the token
   - Verifies it
   - Attaches user info to request
3. If valid → Handler runs
4. If invalid → 401 error returned
```

```typescript
schema: {
  security: [{ Bearer: [] }],
}
```
- **For Swagger documentation** - Shows this route requires authentication

```typescript
async (request: AuthenticatedRequest, reply) => {
```
- **`AuthenticatedRequest`** - A custom type that includes `request.user`

```typescript
const user = request.user as JWTPayload;
```
- **`request.user`** - Added by the middleware
- Contains: `{ id, email, full_name, iat, exp }`

**Response:**
```json
{
    "message": "Profile retrieved successfully",
    "user": {
        "id": "abc-123",
        "email": "john@example.com",
        "full_name": "John Doe",
        "iat": 1234567890,
        "exp": 1234654290
    }
}
```

---

## Request and Response Objects

### The Request Object

```typescript
request = {
  // The URL path
  url: '/api/v2/auth/signup',
  
  // HTTP method
  method: 'POST',
  
  // Request headers
  headers: {
    'content-type': 'application/json',
    'authorization': 'Bearer eyJhbG...',
    'host': 'localhost:3000'
  },
  
  // URL query parameters (?key=value)
  query: {
    token: 'abc123'
  },
  
  // URL path parameters (/users/:id)
  params: {
    id: '123'
  },
  
  // Request body (JSON)
  body: {
    email: 'john@example.com',
    password: 'secret'
  },
  
  // Added by auth middleware
  user: {
    id: 'abc-123',
    email: 'john@example.com'
  }
}
```

### The Reply Object

```typescript
reply
  .status(200)                    // Set status code
  .header('X-Custom', 'value')    // Set custom header
  .send({ data: 'value' });       // Send JSON response

// Or send different types
reply.send('Plain text');         // Text response
reply.send(Buffer.from('...'));   // Binary response
```

---

## Route Parameters

Sometimes you need dynamic parts in your URL:

```typescript
// Route with parameter
fastify.get('/api/v2/users/:id', async (request, reply) => {
  const { id } = request.params as { id: string };
  // id = "123" if URL is /api/v2/users/123
});

// Multiple parameters
fastify.get('/api/v2/users/:userId/experiences/:expId', async (request, reply) => {
  const { userId, expId } = request.params;
  // /api/v2/users/123/experiences/456
  // userId = "123", expId = "456"
});
```

---

## Controller Best Practices

### 1. Keep Controllers Thin

Controllers should ONLY:
- Extract data from request
- Call service methods
- Send response

**Bad:**
```typescript
fastify.post('/signup', async (request, reply) => {
  // 50 lines of business logic here
  // Hash password, check email, generate token...
});
```

**Good:**
```typescript
fastify.post('/signup', async (request, reply) => {
  const data = request.body;
  const result = await userService.SignUp(data);
  return reply.status(200).send(result);
});
```

### 2. Handle Errors Properly

```typescript
fastify.get('/user/:id', async (request, reply) => {
  try {
    const { id } = request.params;
    const user = await userService.findById(id);
    
    if (!user) {
      return reply.status(404).send({ message: 'User not found' });
    }
    
    return reply.status(200).send(user);
  } catch (error) {
    return reply.status(500).send({ message: 'Internal server error' });
  }
});
```

### 3. Use Consistent Response Format

```typescript
// Success
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}

// Error
{
  "success": false,
  "message": "What went wrong"
}
```

---

## Summary - Module 7

You've learned:
- **What a Controller is** - HTTP request handler
- **HTTP methods** - GET, POST, PUT, DELETE
- **HTTP status codes** - 200, 400, 401, 404, 500
- **Route registration** - `fastify.post('/path', handler)`
- **Request object** - body, query, params, headers
- **Reply object** - status, send
- **Schemas** - Validation and documentation
- **Protected routes** - Using preHandler middleware

### Mini Exercise

Create a DELETE route to delete a user:

```typescript
fastify.delete('/api/v2/users/:id', {
  preHandler: authenticateToken,
  schema: {
    tags: ['User'],
    summary: 'Delete user',
    security: [{ Bearer: [] }]
  }
}, async (request: AuthenticatedRequest, reply) => {
  // 1. Get the user ID from params
  // 2. Check if the logged-in user matches the ID
  // 3. Call userService.delete(id)
  // 4. Return appropriate response
});
```

---

# Module 8: Authentication and Security

Authentication is how your application knows WHO is making a request. Security is how you protect your application and user data. This module covers both.

## Authentication vs Authorization

These terms are often confused:

| Concept | Question | Example |
|---------|----------|---------|
| **Authentication** | "Who are you?" | Login with email/password |
| **Authorization** | "What can you do?" | Can this user delete posts? |

**Analogy:**
- **Authentication:** Showing your ID at the door (proving who you are)
- **Authorization:** The bouncer checking if you're on the VIP list (checking what you can do)

## How Authentication Works in This App

```
1. User logs in with email/password
   └── Server verifies credentials
   └── Server creates a JWT token
   └── Server sends token to client

2. Client stores the token

3. Client makes authenticated requests
   └── Sends token in Authorization header
   └── Server verifies token
   └── Server allows or denies access
```

## Understanding JWT (JSON Web Tokens)

JWT is like a digital ID card that proves who you are.

### JWT Structure

A JWT has three parts separated by dots:

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImFiYy0xMjMiLCJlbWFpbCI6ImpvaG5AZXhhbXBsZS5jb20ifQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
│                                      │                                                              │
└──────────────────────────────────────┴──────────────────────────────────────────────────────────────┴────────────────────────────────────────────────────┘
        HEADER                                                    PAYLOAD                                                       SIGNATURE
```

### Part 1: Header

```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```
- **`alg`** - Algorithm used to sign (HS256 = HMAC-SHA256)
- **`typ`** - Type of token (JWT)

### Part 2: Payload

```json
{
  "id": "abc-123",
  "email": "john@example.com",
  "full_name": "John Doe",
  "iat": 1234567890,
  "exp": 1234654290
}
```
- **`id`, `email`, `full_name`** - User data (claims)
- **`iat`** - Issued At (when token was created)
- **`exp`** - Expiration (when token expires)

**Important:** The payload is NOT encrypted! Anyone can decode it. Don't put secrets in it.

### Part 3: Signature

```
HMACSHA256(
  base64UrlEncode(header) + "." + base64UrlEncode(payload),
  secret
)
```
- Created using the header, payload, and a SECRET KEY
- If anyone changes the payload, the signature won't match
- Only the server knows the secret key

### How JWT Verification Works

```
1. Client sends: Authorization: Bearer <token>

2. Server:
   a. Splits the token into header.payload.signature
   b. Uses the secret key to create a NEW signature
   c. Compares new signature with the one in the token
   d. If they match → Token is valid
   e. If they don't match → Token was tampered with

3. Server also checks:
   - Is the token expired? (exp < current time)
```

**Analogy:** JWT is like a sealed envelope:
- You can read what's written on it (payload)
- The wax seal proves it came from the right person (signature)
- If the seal is broken, you know someone tampered with it

---

## The Authentication Middleware - Complete Walkthrough

Let's examine `src/middleware/auth.middleware.v2.ts`:

```typescript
import { FastifyRequest, FastifyReply } from 'fastify'
import jwt from 'jsonwebtoken'

interface JWTPayload {
  id: string
  email: string
  full_name: string
  iat: number
  exp: number
}

interface AuthenticatedRequest extends FastifyRequest {
  user?: JWTPayload
}

export async function authenticateToken(
    request: AuthenticatedRequest,
    reply: FastifyReply) {

    try {
        const authHeader = request.headers.authorization
        const token = authHeader && authHeader.split(' ')[1]

        if (!token) {
            return reply.status(401).send({
                status: 'error',
                error: 'Access token is required'
            })
        }

        const decoded = jwt.verify(token, 'iniadalahsecretkey') as JWTPayload

        const currentTime = Math.floor(Date.now() / 1000)
        if (decoded.exp < currentTime) {
            return reply.status(401).send({
                status: 'error',
                error: 'Token has expired'
            })
        }

        request.user = decoded
    } catch (error) {
        return reply.status(401).send({
            status: 'error',
            error: 'Invalid token'
        })
    }
}

export type { AuthenticatedRequest, JWTPayload }
```

---

## Section 1: Imports and Types

```typescript
import { FastifyRequest, FastifyReply } from 'fastify'
import jwt from 'jsonwebtoken'
```

- **FastifyRequest, FastifyReply** - Types for request and response
- **jwt** - JSON Web Token library

### Type Definitions

```typescript
interface JWTPayload {
  id: string
  email: string
  full_name: string
  iat: number
  exp: number
}
```

**What is an Interface?**

An interface defines the SHAPE of an object - what properties it should have:

```typescript
// This interface says: "A JWTPayload must have these properties"
interface JWTPayload {
  id: string       // Must have an id that's a string
  email: string    // Must have an email that's a string
  full_name: string
  iat: number      // "Issued At" timestamp
  exp: number      // "Expiration" timestamp
}

// This is valid:
const payload: JWTPayload = {
  id: "abc",
  email: "a@b.com",
  full_name: "John",
  iat: 123,
  exp: 456
}

// This would be an error (missing properties):
const bad: JWTPayload = {
  id: "abc"
  // Error: missing email, full_name, iat, exp
}
```

```typescript
interface AuthenticatedRequest extends FastifyRequest {
  user?: JWTPayload
}
```

**What does `extends` mean?**

```typescript
// AuthenticatedRequest has everything FastifyRequest has
// PLUS an optional 'user' property
interface AuthenticatedRequest extends FastifyRequest {
  user?: JWTPayload  // The '?' means optional (might not exist)
}
```

---

## Section 2: The Middleware Function

```typescript
export async function authenticateToken(
    request: AuthenticatedRequest,
    reply: FastifyReply) {
```

### What is Middleware?

Middleware is code that runs BETWEEN receiving a request and running the main handler:

```
Request → Middleware → Handler → Response
              │
              └── Can stop here and send response (e.g., 401 error)
```

**Common uses:**
- Authentication (check if logged in)
- Logging (record all requests)
- Rate limiting (prevent too many requests)
- CORS (allow cross-origin requests)

### Parameters

- **`request`** - The incoming request
- **`reply`** - The response object (for sending errors)

---

## Section 3: Extracting the Token

```typescript
try {
    const authHeader = request.headers.authorization
    const token = authHeader && authHeader.split(' ')[1]
```

### Line-by-Line Breakdown:

```typescript
const authHeader = request.headers.authorization
```

The Authorization header looks like:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

- **`request.headers`** - All HTTP headers
- **`.authorization`** - The Authorization header specifically

```typescript
const token = authHeader && authHeader.split(' ')[1]
```

**Breaking this down:**

```typescript
// The header value
authHeader = "Bearer eyJhbGciOiJIUzI1NiIs..."

// Split by space
authHeader.split(' ')
// Result: ["Bearer", "eyJhbGciOiJIUzI1NiIs..."]

// Get index 1 (the token, not "Bearer")
authHeader.split(' ')[1]
// Result: "eyJhbGciOiJIUzI1NiIs..."
```

**The `&&` operator:**
```typescript
// authHeader && authHeader.split(' ')[1]
// If authHeader is undefined/null/empty → return undefined
// If authHeader exists → return the split result

// This prevents: "Cannot read property 'split' of undefined"
```

---

## Section 4: Checking for Missing Token

```typescript
if (!token) {
    return reply.status(401).send({
        status: 'error',
        error: 'Access token is required'
    })
}
```

- **If no token** → Return 401 (Unauthorized)
- **`return`** → Stop execution here (don't continue to handler)

---

## Section 5: Verifying the Token

```typescript
const decoded = jwt.verify(token, 'iniadalahsecretkey') as JWTPayload
```

### What jwt.verify() Does:

1. **Decodes** the base64 header and payload
2. **Creates a signature** using the secret key
3. **Compares signatures**
4. **If they match** → Returns the payload
5. **If they don't match** → Throws an error

```typescript
jwt.verify(
    token,              // The JWT token to verify
    'iniadalahsecretkey' // The secret key (must match what was used to create it)
)
```

**The Secret Key:**
- `'iniadalahsecretkey'` = "this is a secret key" in Indonesian
- **Security Issue:** This should be in environment variables!
- Anyone with this key can create fake tokens

**Best Practice:**
```typescript
const decoded = jwt.verify(token, process.env.JWT_SECRET) as JWTPayload
```

---

## Section 6: Checking Expiration

```typescript
const currentTime = Math.floor(Date.now() / 1000)
if (decoded.exp < currentTime) {
    return reply.status(401).send({
        status: 'error',
        error: 'Token has expired'
    })
}
```

### Line-by-Line Breakdown:

```typescript
const currentTime = Math.floor(Date.now() / 1000)
```

**Understanding the math:**
- `Date.now()` returns milliseconds since 1970 (e.g., 1699876543210)
- JWT uses seconds, not milliseconds
- `/ 1000` converts to seconds (e.g., 1699876543)
- `Math.floor()` rounds down

```typescript
if (decoded.exp < currentTime) {
```

- **`decoded.exp`** - Token expiration time (in seconds)
- **If expiration is in the past** → Token is expired

**Example:**
```typescript
// Token created at 1:00 PM, expires at 1:00 PM + 24 hours
decoded.exp = 1699876543     // Tomorrow 1:00 PM

// Current time
currentTime = 1699790143      // Today 1:00 PM

// Is expired?
decoded.exp < currentTime    // false (tomorrow > today)
// Token is still valid!

// Later, at 2:00 PM tomorrow...
currentTime = 1699962943
decoded.exp < currentTime    // true (1 PM < 2 PM)
// Token has expired!
```

---

## Section 7: Attaching User to Request

```typescript
request.user = decoded
```

- **Stores the decoded payload** in the request object
- Now the handler can access: `request.user.id`, `request.user.email`, etc.

**In the controller:**
```typescript
fastify.get('/profile', { preHandler: authenticateToken }, async (request, reply) => {
    // Thanks to the middleware, we have request.user
    const user = request.user;
    console.log(user.id);        // "abc-123"
    console.log(user.email);     // "john@example.com"
});
```

---

## Section 8: Error Handling

```typescript
} catch (error) {
    return reply.status(401).send({
        status: 'error',
        error: 'Invalid token'
    })
}
```

**What errors can occur?**
- Token is malformed (not valid JWT format)
- Signature doesn't match (token was tampered with)
- Token uses wrong algorithm

All of these mean: **don't trust this token**.

---

## Section 9: Exporting Types

```typescript
export type { AuthenticatedRequest, JWTPayload }
```

- Makes these types available to other files
- Controllers can import and use them

---

## Security Best Practices

### 1. Store Secret Key Securely

**Bad:**
```typescript
jwt.verify(token, 'iniadalahsecretkey')  // Hardcoded
```

**Good:**
```typescript
jwt.verify(token, process.env.JWT_SECRET)  // From environment
```

### 2. Use Strong Secret Keys

**Bad:**
```typescript
JWT_SECRET=password123
```

**Good:**
```typescript
JWT_SECRET=a8f9d2c4e1b7a3f6d8c2e5b9a1f4d7c3e6b8a2f5d9c1e4b7a0f3d6c9e2b5a8f1
```

Generate with:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 3. Set Appropriate Expiration

```typescript
// Too long - security risk if token is stolen
expiresIn: '30d'

// Too short - annoying for users
expiresIn: '5m'

// Good balance
expiresIn: '24h'
```

### 4. Use HTTPS in Production

JWT tokens are sent in headers. Without HTTPS, anyone can intercept them.

### 5. Never Store Sensitive Data in JWT

**Bad:**
```typescript
jwt.sign({
    id: user.id,
    password: user.password,     // NEVER!
    creditCard: user.creditCard  // NEVER!
}, secret)
```

**Good:**
```typescript
jwt.sign({
    id: user.id,
    email: user.email,
    role: user.role
}, secret)
```

---

## Password Security (Recap from Module 6)

### Why Hash Passwords?

```
Plain text storage:        Hashed storage:
┌──────────────────┐      ┌──────────────────────────────────┐
│ password123      │  →   │ $2b$10$N9qo8uLOickgx2ZMRZoMy... │
└──────────────────┘      └──────────────────────────────────┘
     Readable!                     Unreadable!
```

If your database is stolen:
- **Plain text:** Attacker has all passwords
- **Hashed:** Attacker has useless strings

### bcrypt Features

1. **Salting** - Adds random data so same passwords have different hashes
2. **Cost factor** - Intentionally slow (makes brute-force attacks impractical)
3. **Industry standard** - Specifically designed for passwords

---

## Complete Authentication Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         REGISTRATION FLOW                                │
└─────────────────────────────────────────────────────────────────────────┘

1. User submits: email, password, name
                    │
2. Server validates input
                    │
3. Server hashes password with bcrypt
                    │
4. Server stores user in database
                    │
5. Server generates verification token
                    │
6. Server stores token in database
                    │
7. Server sends verification email
                    │
8. User clicks link in email
                    │
9. Server marks email as verified


┌─────────────────────────────────────────────────────────────────────────┐
│                            LOGIN FLOW                                    │
└─────────────────────────────────────────────────────────────────────────┘

1. User submits: email, password
                    │
2. Server finds user by email
                    │
3. Server compares password with hash (bcrypt.compare)
                    │
4. If valid → Server creates JWT token
   If invalid → Return error
                    │
5. Server sends token to client
                    │
6. Client stores token (localStorage, cookie, etc.)


┌─────────────────────────────────────────────────────────────────────────┐
│                       AUTHENTICATED REQUEST FLOW                         │
└─────────────────────────────────────────────────────────────────────────┘

1. Client sends request with header:
   Authorization: Bearer eyJhbGc...
                    │
2. Middleware extracts token
                    │
3. Middleware verifies signature
                    │
4. Middleware checks expiration
                    │
5. If valid → Attach user to request, continue to handler
   If invalid → Return 401 error
                    │
6. Handler processes request
                    │
7. Server sends response
```

---

## Summary - Module 8

You've learned:
- **Authentication vs Authorization** - Who you are vs what you can do
- **JWT structure** - Header, Payload, Signature
- **How JWT verification works** - Signature comparison
- **Middleware** - Code that runs before handlers
- **Token extraction** - Getting token from Authorization header
- **Security best practices** - Secret keys, HTTPS, password hashing

### Mini Exercise

What's wrong with this middleware?

```typescript
async function checkAuth(request, reply) {
    const token = request.headers.authorization;
    const decoded = jwt.verify(token, 'secret123');
    request.user = decoded;
}
```

**Hint:** There are at least 4 issues!

---

# Module 9: The Complete Request Flow

Now that you understand all the layers, let's trace a complete request from start to finish. This will show you how everything connects together.

## The Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              CLIENT                                          │
│                    (Browser, Mobile App, Postman)                           │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         FASTIFY SERVER                                       │
│                         (src/index.ts)                                       │
├─────────────────────────────────────────────────────────────────────────────┤
│  Plugins: CORS, Swagger                                                      │
│  Receives all incoming HTTP requests                                         │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                          MIDDLEWARE                                          │
│                   (src/middleware/*.ts)                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│  - authenticateToken: Verify JWT tokens                                      │
│  Runs BEFORE the controller (for protected routes)                          │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                          CONTROLLER                                          │
│               (src/api/v2/controllers/*.ts)                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│  - Receives HTTP request                                                     │
│  - Extracts data (body, params, query)                                       │
│  - Calls appropriate service method                                          │
│  - Sends HTTP response                                                       │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           SERVICE                                            │
│                (src/api/v2/services/*.ts)                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│  - Contains business logic                                                   │
│  - Validates data                                                            │
│  - Hashes passwords, generates tokens                                        │
│  - Calls repository methods                                                  │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         REPOSITORY                                           │
│              (src/api/v2/repositories/*.ts)                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│  - Executes SQL queries                                                      │
│  - Returns raw data from database                                            │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         DATABASE                                             │
│                        (PostgreSQL)                                          │
├─────────────────────────────────────────────────────────────────────────────┤
│  Tables: users, experiences, email_verification_tokens, etc.                 │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Example 1: User Registration (POST /api/v2/auth/signup)

Let's trace a complete registration request.

### Step 1: Client Sends Request

```http
POST /api/v2/auth/signup HTTP/1.1
Host: localhost:3000
Content-Type: application/json

{
    "full_name": "John Doe",
    "email": "john@example.com",
    "password": "SecurePass123!"
}
```

### Step 2: Fastify Receives Request

```typescript
// src/index.ts
const app = Fastify({ logger: true })
// ... app is listening on port 3000

// When request arrives, Fastify:
// 1. Parses the JSON body
// 2. Matches the URL to a registered route
// 3. Runs any middleware (none for this route)
// 4. Calls the route handler
```

### Step 3: Controller Handles Request

```typescript
// src/api/v2/controllers/auth.controller.ts

fastify.post('/api/v2/auth/signup', {
  schema: {
    body: SignUpSchema  // Fastify validates the body automatically
  }
}, async (request, reply) => {
  // Extract data from request body
  const signUpData = request.body as SignUp;
  // signUpData = { full_name: "John Doe", email: "john@example.com", password: "SecurePass123!" }
  
  // Call service method
  const result = await userService.SignUp(signUpData);
  
  // Send response based on result
  if(result.success) {
    return reply.status(200).send({ message: result.message, data: result.data });
  } else {
    return reply.status(400).send({ message: result.message });
  }
})
```

### Step 4: Service Processes Business Logic

```typescript
// src/api/v2/services/user.service.ts

async SignUp(SignUpData: SignUp) {
    // 1. Check if email already exists
    const isRegistered = await userRepository.findByEmail(SignUpData.email);
    // isRegistered = null (email not found)
    
    if (isRegistered) {
        return { success: false, message: 'Email is already registered' };
    }
    
    // 2. Hash the password
    const hashedPassword = await this.hashPassword(SignUpData.password);
    // hashedPassword = "$2b$10$xyz..."
    
    // 3. Save to database
    const register = await userRepository.register({
        ...SignUpData,
        password: hashedPassword
    });
    
    // 4. Generate verification token
    if(register.success) {
        const verificationToken = this.generateVerificationToken();
        // verificationToken = "a7b8c9d0..."
        
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 24);
        
        await userRepository.insertVerificationToken(
            register.data.id, 
            verificationToken, 
            expiresAt
        );
        
        return {
            success: true,
            message: 'User registered successfully',
            data: { ...register.data, password: undefined }
        };
    }
}
```

### Step 5: Repository Executes SQL

```typescript
// src/api/v2/repositories/user.repository.ts

// First, check if email exists
async findByEmail(email: string) {
    const [result] = await sequelize.query(`
        SELECT * FROM users WHERE email = :email
    `, { replacements: { email } });
    return result;  // null (not found)
}

// Then, register the user
async register(SignUpData: SignUp) {
    const [result] = await sequelize.query(`
        INSERT INTO users (full_name, email, password, email_verified)
        VALUES (:full_name, :email, :password, :email_verified)
        RETURNING *
    `, {
        replacements: {
            full_name: "John Doe",
            email: "john@example.com",
            password: "$2b$10$xyz...",
            email_verified: false
        }
    });
    return { success: true, data: result[0] };
}

// Finally, store verification token
async insertVerificationToken(userId, token, expiresAt) {
    await sequelize.query(`
        INSERT INTO email_verification_tokens (user_id, token, expires_at)
        VALUES (:userId, :token, :expiresAt)
    `, { replacements: { userId, token, expiresAt } });
}
```

### Step 6: Database Stores Data

```sql
-- SQL executed:
INSERT INTO users (full_name, email, password, email_verified)
VALUES ('John Doe', 'john@example.com', '$2b$10$xyz...', false)
RETURNING *;

-- Result:
-- id: 'abc-123-def-456'
-- full_name: 'John Doe'
-- email: 'john@example.com'
-- password: '$2b$10$xyz...'
-- email_verified: false
-- created_at: '2024-01-15T10:30:00Z'

INSERT INTO email_verification_tokens (user_id, token, expires_at)
VALUES ('abc-123-def-456', 'a7b8c9d0...', '2024-01-16T10:30:00Z');
```

### Step 7: Response Travels Back

```
Database → Repository → Service → Controller → Client
   │           │            │           │          │
   │           │            │           │          └── Receives JSON response
   │           │            │           └── Sends HTTP 200
   │           │            └── Returns { success: true, data: {...} }
   │           └── Returns inserted row
   └── Stores data
```

### Step 8: Client Receives Response

```http
HTTP/1.1 200 OK
Content-Type: application/json

{
    "message": "User registered successfully",
    "data": {
        "id": "abc-123-def-456",
        "full_name": "John Doe",
        "email": "john@example.com"
    }
}
```

---

## Example 2: User Login (POST /api/v2/auth/login)

### The Complete Flow

```
┌──────────────────────────────────────────────────────────────────────┐
│ CLIENT                                                                │
│ POST /api/v2/auth/login                                              │
│ Body: { email: "john@example.com", password: "SecurePass123!" }      │
└──────────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌──────────────────────────────────────────────────────────────────────┐
│ CONTROLLER (auth.controller.ts)                                       │
│ const { email, password } = request.body                              │
│ const result = await userService.login(email, password)               │
└──────────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌──────────────────────────────────────────────────────────────────────┐
│ SERVICE (user.service.ts)                                             │
│                                                                       │
│ 1. Find user: userRepository.findByEmail(email)                       │
│    └── Found: { id, email, password: "$2b$10$...", email_verified }  │
│                                                                       │
│ 2. Check email verified: user.email_verified === true? ✓              │
│                                                                       │
│ 3. Compare password: bcrypt.compare(password, user.password)          │
│    └── Returns: true (passwords match)                                │
│                                                                       │
│ 4. Generate JWT: jwt.sign({ id, email, full_name }, secret)           │
│    └── Returns: "eyJhbGciOiJIUzI1NiIs..."                            │
│                                                                       │
│ 5. Return: { success: true, access_token: "eyJ..." }                  │
└──────────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌──────────────────────────────────────────────────────────────────────┐
│ REPOSITORY (user.repository.ts)                                       │
│ SELECT * FROM users WHERE email = 'john@example.com'                  │
└──────────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌──────────────────────────────────────────────────────────────────────┐
│ DATABASE                                                              │
│ Returns user row                                                      │
└──────────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌──────────────────────────────────────────────────────────────────────┐
│ RESPONSE TO CLIENT                                                    │
│ {                                                                     │
│     "message": "Login successful",                                    │
│     "access_token": "eyJhbGciOiJIUzI1NiIs..."                        │
│ }                                                                     │
└──────────────────────────────────────────────────────────────────────┘
```

---

## Example 3: Get Profile (Protected Route)

This example shows how authentication middleware works.

### Step 1: Client Sends Authenticated Request

```http
GET /api/v2/auth/profile HTTP/1.1
Host: localhost:3000
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

### Step 2: Middleware Runs First

```typescript
// src/middleware/auth.middleware.v2.ts

export async function authenticateToken(request, reply) {
    // 1. Extract token
    const authHeader = request.headers.authorization;
    // authHeader = "Bearer eyJhbGciOiJIUzI1NiIs..."
    
    const token = authHeader.split(' ')[1];
    // token = "eyJhbGciOiJIUzI1NiIs..."
    
    // 2. Verify token
    const decoded = jwt.verify(token, 'iniadalahsecretkey');
    // decoded = { id: "abc-123", email: "john@example.com", full_name: "John Doe", iat: 123, exp: 456 }
    
    // 3. Check expiration
    const currentTime = Math.floor(Date.now() / 1000);
    if (decoded.exp < currentTime) {
        return reply.status(401).send({ error: 'Token has expired' });
    }
    
    // 4. Attach user to request
    request.user = decoded;
    // Now request.user is available in the controller!
}
```

### Step 3: Controller Runs After Middleware

```typescript
// src/api/v2/controllers/auth.controller.ts

fastify.get('/api/v2/auth/profile', {
  preHandler: authenticateToken,  // Middleware runs first
}, async (request: AuthenticatedRequest, reply) => {
  // request.user was set by the middleware
  const user = request.user;
  // user = { id: "abc-123", email: "john@example.com", full_name: "John Doe" }
  
  return reply.status(200).send({ 
    message: 'Profile retrieved successfully', 
    user: user 
  });
});
```

### The Complete Protected Request Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│ CLIENT: GET /api/v2/auth/profile                                         │
│ Header: Authorization: Bearer eyJhbGciOiJIUzI1NiIs...                    │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ MIDDLEWARE: authenticateToken                                            │
│                                                                          │
│ ┌─────────────────────────────────────────────────────────────────────┐ │
│ │ Token present?                                                       │ │
│ │ ├── NO  → Return 401: "Access token is required"                    │ │
│ │ └── YES → Continue                                                   │ │
│ └─────────────────────────────────────────────────────────────────────┘ │
│                                    │                                     │
│                                    ▼                                     │
│ ┌─────────────────────────────────────────────────────────────────────┐ │
│ │ Token valid? (signature matches)                                     │ │
│ │ ├── NO  → Return 401: "Invalid token"                               │ │
│ │ └── YES → Continue                                                   │ │
│ └─────────────────────────────────────────────────────────────────────┘ │
│                                    │                                     │
│                                    ▼                                     │
│ ┌─────────────────────────────────────────────────────────────────────┐ │
│ │ Token expired?                                                       │ │
│ │ ├── YES → Return 401: "Token has expired"                           │ │
│ │ └── NO  → Attach user to request, continue to controller            │ │
│ └─────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ CONTROLLER                                                               │
│ const user = request.user;  // { id, email, full_name }                  │
│ return reply.send({ user });                                             │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ RESPONSE                                                                 │
│ {                                                                        │
│     "message": "Profile retrieved successfully",                         │
│     "user": {                                                            │
│         "id": "abc-123",                                                 │
│         "email": "john@example.com",                                     │
│         "full_name": "John Doe"                                          │
│     }                                                                    │
│ }                                                                        │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Data Transformation Through Layers

Let's see how data changes as it passes through each layer:

### Registration Data Flow

```
CLIENT INPUT:
{
    "full_name": "John Doe",
    "email": "john@example.com",
    "password": "SecurePass123!"      ← Plain text password
}
        │
        ▼
CONTROLLER (extracts data):
signUpData = {
    full_name: "John Doe",
    email: "john@example.com",
    password: "SecurePass123!"        ← Still plain text
}
        │
        ▼
SERVICE (transforms data):
{
    full_name: "John Doe",
    email: "john@example.com",
    password: "$2b$10$N9qo8uLO..."     ← Now hashed!
}
        │
        ▼
REPOSITORY (sends to database):
INSERT INTO users (full_name, email, password)
VALUES ('John Doe', 'john@example.com', '$2b$10$N9qo8uLO...')
        │
        ▼
DATABASE RETURNS:
{
    id: "abc-123",
    full_name: "John Doe",
    email: "john@example.com",
    password: "$2b$10$N9qo8uLO...",
    email_verified: false,
    created_at: "2024-01-15T10:30:00Z"
}
        │
        ▼
SERVICE (cleans response):
{
    id: "abc-123",
    full_name: "John Doe",
    email: "john@example.com",
    password: undefined                ← Password removed!
}
        │
        ▼
CONTROLLER (sends response):
reply.send({
    message: "User registered successfully",
    data: {
        id: "abc-123",
        full_name: "John Doe",
        email: "john@example.com"      ← No password in response
    }
})
```

---

## Error Handling Flow

What happens when something goes wrong?

### Example: Email Already Exists

```
CLIENT: POST /api/v2/auth/signup
Body: { email: "existing@example.com", ... }
        │
        ▼
CONTROLLER:
const result = await userService.SignUp(signUpData);
        │
        ▼
SERVICE:
const isRegistered = await userRepository.findByEmail(email);
// isRegistered = { id: "xyz", email: "existing@example.com", ... }  ← User exists!

if (isRegistered) {
    return {
        success: false,                               ← Indicates error
        message: 'Email is already registered'
    };
}
        │
        ▼
CONTROLLER:
if(result.success) {
    // Skip this
} else {
    return reply.status(400).send({                   ← 400 Bad Request
        message: result.message
    });
}
        │
        ▼
CLIENT RECEIVES:
HTTP 400 Bad Request
{
    "message": "Email is already registered"
}
```

### Example: Invalid Token

```
CLIENT: GET /api/v2/auth/profile
Header: Authorization: Bearer invalid_token_here
        │
        ▼
MIDDLEWARE:
try {
    const decoded = jwt.verify(token, secret);
    // Throws error! Token is invalid
} catch (error) {
    return reply.status(401).send({                   ← 401 Unauthorized
        status: 'error',
        error: 'Invalid token'
    });
}
        │
        ▼
CONTROLLER: Never runs! Middleware returned early.
        │
        ▼
CLIENT RECEIVES:
HTTP 401 Unauthorized
{
    "status": "error",
    "error": "Invalid token"
}
```

---

## Summary - Module 9

You've learned:
- **How layers connect** - Controller → Service → Repository → Database
- **Complete request flows** - Registration, Login, Protected routes
- **Middleware execution** - Runs before controller for protected routes
- **Data transformation** - How data changes through each layer
- **Error handling flow** - How errors propagate back to the client

### Key Takeaways

1. **Each layer has one job:**
   - Controller: Handle HTTP
   - Service: Business logic
   - Repository: Database queries

2. **Data flows down, then back up:**
   - Down: Request → Controller → Service → Repository → Database
   - Up: Database → Repository → Service → Controller → Response

3. **Middleware is a gatekeeper:**
   - Protected routes require middleware approval
   - If middleware returns, controller never runs

4. **Errors are caught at appropriate levels:**
   - Database errors caught in Repository
   - Business rule violations caught in Service
   - HTTP errors sent from Controller

---

# Module 10: Hands-On Exercises

Now it's time to practice! These exercises will help you understand the code better by actually working with it.

## Exercise 1: Read and Trace

**Goal:** Follow a request through all layers manually.

### Task

Trace what happens when a user tries to verify their email. Start with this request:

```http
GET /api/v2/auth/verify?token=a7b8c9d0e1f2a3b4c5d6e7f8
Host: localhost:3000
```

### Questions to Answer

1. Which controller method handles this request?
2. What data is extracted from the request?
3. Which service method is called?
4. Which repository method(s) are called?
5. What SQL query(ies) are executed?
6. What are the possible responses?

### Solution

<details>
<summary>Click to reveal solution</summary>

1. **Controller:** `auth.controller.ts` - the `GET /api/v2/auth/verify` route

2. **Data extracted:**
   ```typescript
   const { token } = request.query as { token: string };
   // token = "a7b8c9d0e1f2a3b4c5d6e7f8"
   ```

3. **Service method:** `userService.verifyEmail(token)`

4. **Repository methods:**
   - `userRepository.findVerificationToken(token)`
   - If found: `userRepository.updateEmailVerification(user_id)`

5. **SQL queries:**
   ```sql
   -- Find token
   SELECT * FROM email_verification_tokens 
   WHERE token = 'a7b8c9d0e1f2a3b4c5d6e7f8' 
   AND expires_at > CURRENT_TIMESTAMP;
   
   -- If found, update user
   UPDATE users SET email_verified = true WHERE id = 'user-id';
   ```

6. **Possible responses:**
   - Success (200): `{ message: 'Email verified successfully' }`
   - Error (400): `{ message: 'Invalid or expired verification token' }`

</details>

---

## Exercise 2: Add a New Field

**Goal:** Add a `phone_number` field to user registration.

### Task

Modify the code to allow users to optionally provide a phone number during registration.

### Steps

1. **Update the database** (create a migration):
   ```sql
   ALTER TABLE users ADD COLUMN phone_number VARCHAR(20);
   ```

2. **Update the type definition** (`src/types/user.ts`):
   ```typescript
   export interface SignUp {
       full_name: string;
       email: string;
       password: string;
       phone_number?: string;  // Add this (? means optional)
   }
   
   export const SignUpSchema = Type.Object({
       full_name: Type.String({ minLength: 1 }),
       email: Type.String({ format: 'email' }),
       password: Type.String({ minLength: 8 }),
       phone_number: Type.Optional(Type.String())  // Add this
   });
   ```

3. **Update the repository** (`user.repository.ts`):
   ```typescript
   async register(SignUpData: SignUp) {
       const [result] = await sequelize.query(`
           INSERT INTO users (full_name, email, password, phone_number, email_verified)
           VALUES (:full_name, :email, :password, :phone_number, :email_verified)
           RETURNING *
       `, {
           replacements: {
               full_name: SignUpData.full_name,
               email: SignUpData.email,
               password: SignUpData.password,
               phone_number: SignUpData.phone_number || null,  // Add this
               email_verified: false
           }
       });
       // ...
   }
   ```

### Questions

- Why did we add `?` to `phone_number?` in the interface?
- What does `Type.Optional()` do in the schema?
- What does `|| null` mean in the repository?

---

## Exercise 3: Create a New Endpoint

**Goal:** Create an endpoint to update user profile.

### Task

Create a `PATCH /api/v2/users/profile` endpoint that allows authenticated users to update their `full_name` and `profile_image`.

### Requirements

1. Must be a protected route (require authentication)
2. Can only update their own profile
3. Return updated user data

### Skeleton Code

**Repository:**
```typescript
// user.repository.ts
async updateProfile(userId: string, data: { full_name?: string; profile_image?: string }) {
    // Your SQL UPDATE query here
}
```

**Service:**
```typescript
// user.service.ts
async updateProfile(userId: string, data: { full_name?: string; profile_image?: string }) {
    // Call repository
    // Return result
}
```

**Controller:**
```typescript
// auth.controller.ts or create user.controller.ts
fastify.patch('/api/v2/users/profile', {
    preHandler: authenticateToken,
    schema: {
        tags: ['User'],
        summary: 'Update user profile',
        security: [{ Bearer: [] }],
        body: Type.Object({
            full_name: Type.Optional(Type.String()),
            profile_image: Type.Optional(Type.String())
        })
    }
}, async (request: AuthenticatedRequest, reply) => {
    // Get user ID from request.user
    // Get update data from request.body
    // Call service
    // Return response
});
```

### Solution

<details>
<summary>Click to reveal solution</summary>

**Repository:**
```typescript
async updateProfile(userId: string, data: { full_name?: string; profile_image?: string }) {
    const updates: string[] = [];
    const replacements: any = { userId };
    
    if (data.full_name) {
        updates.push('full_name = :full_name');
        replacements.full_name = data.full_name;
    }
    
    if (data.profile_image) {
        updates.push('profile_image = :profile_image');
        replacements.profile_image = data.profile_image;
    }
    
    if (updates.length === 0) {
        return { success: false, message: 'No fields to update' };
    }
    
    await sequelize.query(`
        UPDATE users 
        SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP
        WHERE id = :userId
    `, { replacements });
    
    return { success: true, message: 'Profile updated successfully' };
}
```

**Service:**
```typescript
async updateProfile(userId: string, data: { full_name?: string; profile_image?: string }) {
    const result = await userRepository.updateProfile(userId, data);
    return result;
}
```

**Controller:**
```typescript
fastify.patch('/api/v2/users/profile', {
    preHandler: authenticateToken,
    schema: {
        tags: ['User'],
        summary: 'Update user profile',
        security: [{ Bearer: [] }],
        body: Type.Object({
            full_name: Type.Optional(Type.String({ minLength: 1 })),
            profile_image: Type.Optional(Type.String())
        })
    }
}, async (request: AuthenticatedRequest, reply) => {
    const user = request.user as JWTPayload;
    const updateData = request.body as { full_name?: string; profile_image?: string };
    
    const result = await userService.updateProfile(user.id, updateData);
    
    if (result.success) {
        return reply.status(200).send({ message: result.message });
    } else {
        return reply.status(400).send({ message: result.message });
    }
});
```

</details>

---

## Exercise 4: Debug This Code

**Goal:** Find and fix the bugs.

### Task

The following code has several bugs. Find them all!

```typescript
// auth.controller.ts
fastify.post('/api/v2/auth/signup' {
    schema: {
        body: SignUpSchema
    }
}, async (request, reply) {
    const signUpData = request.body;
    const result = userService.SignUp(signUpData);
    
    if(result.success) {
        return reply.send({ message: result.message, data: result.data });
    } else {
        return reply.send({ message: result.message });
    }
})
```

### Solution

<details>
<summary>Click to reveal solution</summary>

**Bug 1:** Missing comma after the route path
```typescript
// Wrong:
fastify.post('/api/v2/auth/signup' {
// Correct:
fastify.post('/api/v2/auth/signup', {
```

**Bug 2:** Missing arrow in handler function
```typescript
// Wrong:
async (request, reply) {
// Correct:
async (request, reply) => {
```

**Bug 3:** Missing await before service call
```typescript
// Wrong:
const result = userService.SignUp(signUpData);
// Correct:
const result = await userService.SignUp(signUpData);
```

**Bug 4:** Missing status code for error response
```typescript
// Wrong:
return reply.send({ message: result.message });
// Correct:
return reply.status(400).send({ message: result.message });
```

**Bug 5:** Missing type casting
```typescript
// Wrong:
const signUpData = request.body;
// Better:
const signUpData = request.body as SignUp;
```

**Corrected code:**
```typescript
fastify.post('/api/v2/auth/signup', {
    schema: {
        body: SignUpSchema
    }
}, async (request, reply) => {
    const signUpData = request.body as SignUp;
    const result = await userService.SignUp(signUpData);
    
    if(result.success) {
        return reply.status(200).send({ message: result.message, data: result.data });
    } else {
        return reply.status(400).send({ message: result.message });
    }
});
```

</details>

---

## Exercise 5: Security Review

**Goal:** Identify security issues.

### Task

Review this code and identify security problems:

```typescript
// Bad example - find the issues!

const sequelize = new Sequelize({
    host: 'localhost',
    password: 'admin123',
    database: 'production_db'
});

async function login(email: string, password: string) {
    const query = `SELECT * FROM users WHERE email = '${email}'`;
    const user = await sequelize.query(query);
    
    if (user.password === password) {
        const token = jwt.sign({ id: user.id }, 'secret');
        return { token };
    }
}

fastify.get('/user/:id', async (request, reply) => {
    const { id } = request.params;
    const query = `SELECT * FROM users WHERE id = '${id}'`;
    const user = await sequelize.query(query);
    return reply.send(user);
});
```

### Solution

<details>
<summary>Click to reveal solution</summary>

**Issue 1: Hardcoded database password**
```typescript
// Wrong:
password: 'admin123',
// Should be:
password: process.env.DB_PASSWORD,
```

**Issue 2: SQL Injection vulnerability (twice!)**
```typescript
// Wrong:
const query = `SELECT * FROM users WHERE email = '${email}'`;
// Should be:
const query = `SELECT * FROM users WHERE email = :email`;
// With: replacements: { email }
```

**Issue 3: Comparing plain text password**
```typescript
// Wrong:
if (user.password === password)
// Should be:
const isValid = await bcrypt.compare(password, user.password);
if (isValid)
```

**Issue 4: Weak JWT secret**
```typescript
// Wrong:
jwt.sign({ id: user.id }, 'secret');
// Should be:
jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '24h' });
```

**Issue 5: Missing token expiration**
```typescript
// Wrong:
jwt.sign({ id: user.id }, 'secret');
// Should include:
{ expiresIn: '24h' }
```

**Issue 6: No authentication on user endpoint**
```typescript
// Wrong:
fastify.get('/user/:id', async (request, reply) => {
// Should be:
fastify.get('/user/:id', { preHandler: authenticateToken }, async (request, reply) => {
```

**Issue 7: Returning all user data including password**
```typescript
// Wrong:
return reply.send(user);
// Should be:
return reply.send({ ...user, password: undefined });
```

</details>

---

## Exercise 6: Build a Complete Feature

**Goal:** Create a "Forgot Password" feature from scratch.

### Requirements

1. `POST /api/v2/auth/forgot-password` - Request password reset
   - Accepts email
   - Generates reset token
   - Stores token in database (expires in 1 hour)
   - Returns success message

2. `POST /api/v2/auth/reset-password` - Reset the password
   - Accepts token and new password
   - Validates token
   - Updates password (hashed)
   - Invalidates token

### Hints

- You'll need to create a new table: `password_reset_tokens`
- Create methods in all three layers
- Think about security (hash passwords, expire tokens)

This exercise is more challenging - try to complete it on your own using what you've learned!

---

# Glossary

A reference of programming terms used in this module.

## A

**API (Application Programming Interface)**
A set of rules that allows different software programs to communicate with each other.

**Async/Await**
JavaScript syntax for handling asynchronous operations. `async` marks a function as asynchronous, `await` pauses execution until a Promise resolves.

**Authentication**
The process of verifying who a user is (e.g., login with email/password).

**Authorization**
The process of verifying what a user can do (e.g., can this user delete posts?).

## B

**Backend**
The server-side part of an application that processes data and business logic.

**bcrypt**
A library for securely hashing passwords.

**Body (Request Body)**
Data sent with an HTTP request, typically in JSON format for POST/PUT requests.

## C

**Class**
A blueprint for creating objects with properties and methods.

**Controller**
A layer that handles HTTP requests and responses.

**CORS (Cross-Origin Resource Sharing)**
A security feature that controls which websites can access your API.

**CRUD**
Create, Read, Update, Delete - the four basic database operations.

## D

**Database**
Organized storage for application data.

**Dependency**
External code (library/package) that your project uses.

**Dependency Injection**
A pattern where objects receive their dependencies from outside rather than creating them internally.

**Destructuring**
JavaScript syntax for extracting values from objects or arrays: `const { name } = user;`

## E

**Endpoint**
A specific URL path that accepts HTTP requests.

**Environment Variables**
Configuration values stored outside your code (e.g., passwords, API keys).

**Export**
Making code available to other files: `export function myFunction() {}`

## F

**Fastify**
A web framework for Node.js, similar to Express but faster.

**Frontend**
The client-side part of an application that users interact with.

**Function**
A reusable block of code that performs a specific task.

## H

**Hash/Hashing**
Converting data into a fixed-length string that cannot be reversed.

**Header (HTTP Header)**
Metadata sent with HTTP requests/responses (e.g., Content-Type, Authorization).

**HTTP (HyperText Transfer Protocol)**
The protocol used for communication on the web.

## I

**Import**
Bringing code from other files or packages: `import { function } from 'package';`

**Interface (TypeScript)**
A definition of the shape/structure of an object.

## J

**JSON (JavaScript Object Notation)**
A text format for storing and exchanging data.

**JWT (JSON Web Token)**
A secure token format used for authentication.

## M

**Middleware**
Code that runs between receiving a request and sending a response.

**Migration**
A file that defines changes to the database structure.

**Module**
A file containing reusable code.

## N

**Node.js**
A runtime that allows JavaScript to run on servers.

**npm (Node Package Manager)**
A tool for installing and managing JavaScript packages.

## O

**ORM (Object-Relational Mapping)**
A tool that lets you interact with databases using programming language objects instead of SQL.

## P

**Package**
A reusable bundle of code, typically installed via npm.

**Parameter**
A value passed to a function: `function greet(name) {}` - `name` is a parameter.

**Payload**
The data contained in a JWT token or HTTP request body.

**Plugin**
An add-on that extends functionality of a framework.

**Port**
A number that identifies a specific process on a computer (e.g., 3000).

**POST**
An HTTP method for creating/submitting data.

**Primary Key**
A unique identifier for each row in a database table.

**Promise**
An object representing a future value (the eventual result of an async operation).

## Q

**Query**
A request for data from a database.

**Query Parameters**
Key-value pairs in a URL after the `?`: `/search?term=hello&page=1`

## R

**Repository**
A layer that handles database operations.

**Request**
An HTTP message sent from client to server.

**Response**
An HTTP message sent from server to client.

**REST (Representational State Transfer)**
An architectural style for designing web APIs.

**Route**
A URL path mapped to a handler function.

## S

**Salt**
Random data added to passwords before hashing for extra security.

**Schema**
A definition of data structure, used for validation.

**Sequelize**
An ORM for Node.js that supports PostgreSQL, MySQL, and other databases.

**Service**
A layer containing business logic.

**SQL (Structured Query Language)**
A language for managing and querying databases.

**Status Code**
A number indicating the result of an HTTP request (e.g., 200 = OK, 404 = Not Found).

**String**
A data type for text: `"Hello, World!"`

## T

**Token**
A string that represents authentication or authorization.

**try/catch**
Error handling syntax: code in `try` is attempted, errors are caught in `catch`.

**Type**
A classification of data (string, number, boolean, etc.).

**TypeScript**
JavaScript with added type safety features.

## U

**UUID (Universally Unique Identifier)**
A 128-bit identifier guaranteed to be unique.

## V

**Variable**
A named storage location for data.

**Validation**
Checking if data meets certain requirements.

---

# Congratulations!

You've completed the Backend Development Learning Module!

## What You've Learned

1. **Programming Basics** - Variables, functions, types, async/await
2. **Project Structure** - How professional projects are organized
3. **The Entry Point** - How applications start
4. **Databases** - SQL, tables, migrations
5. **Repository Layer** - Data access patterns
6. **Service Layer** - Business logic
7. **Controller Layer** - HTTP handling
8. **Authentication** - JWT, middleware, security
9. **Request Flow** - How everything connects
10. **Practical Skills** - Through hands-on exercises

## Next Steps

1. **Practice** - Complete all the exercises
2. **Experiment** - Modify the code and see what happens
3. **Build** - Create your own features
4. **Learn More** - Explore topics like testing, deployment, and advanced patterns

## Resources for Further Learning

- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Fastify Documentation](https://www.fastify.io/docs/latest/)
- [Sequelize Documentation](https://sequelize.org/docs/v6/)
- [PostgreSQL Tutorial](https://www.postgresql.org/docs/current/tutorial.html)
- [JWT.io](https://jwt.io/) - Learn more about JWT tokens

---

*Happy Coding!*

