# Day 16: Authentication Basics

## 📚 What to Learn Today
- **Read**: [LEARNING_MODULE.md](../../Modules/LEARNING_MODULE.md) - Module 8 (Lines 3649-3900)
- **Time**: ~35 minutes reading, ~25 minutes practice
- **Topics**: Authentication vs Authorization, JWT structure

---

## 📖 Key Concepts

### 1. Authentication vs Authorization

**Authentication (AuthN)**: "Who are you?"
- Verifying identity
- Login with username/password
- Result: You are John Doe

**Authorization (AuthZ)**: "What can you do?"
- Verifying permissions
- Checking if user can access a resource
- Result: John Doe can edit posts, but cannot delete users

```
┌─────────────────────────────────────────────────────────┐
│  User sends credentials (email + password)               │
└─────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────┐
│  AUTHENTICATION: Verify credentials                      │
│  "Is this really John Doe?"                              │
└─────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────┐
│  AUTHORIZATION: Check permissions                        │
│  "Can John Doe access this resource?"                    │
└─────────────────────────────────────────────────────────┘
```

### 2. What is JWT?

**JWT** = JSON Web Token

A JWT is a compact, URL-safe way to represent claims between two parties.

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiam9obkBleGFtcGxlLmNvbSIsImlhdCI6MTYxNjIzOTAyMn0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```

### 3. JWT Structure

A JWT has three parts separated by dots (`.`):

```
HEADER.PAYLOAD.SIGNATURE
```

**1. Header** (Algorithm & Token Type):
```json
{
    "alg": "HS256",
    "typ": "JWT"
}
```

**2. Payload** (Claims/Data):
```json
{
    "userId": 1,
    "email": "john@example.com",
    "role": "admin",
    "iat": 1616239022,
    "exp": 1616325422
}
```

**3. Signature** (Verification):
```
HMACSHA256(
    base64UrlEncode(header) + "." + base64UrlEncode(payload),
    secret
)
```

### 4. Common JWT Claims

| Claim | Name | Description |
|-------|------|-------------|
| `iss` | Issuer | Who created the token |
| `sub` | Subject | Who the token is about (usually user ID) |
| `aud` | Audience | Who the token is intended for |
| `exp` | Expiration | When the token expires (Unix timestamp) |
| `iat` | Issued At | When the token was created |
| `nbf` | Not Before | Token not valid before this time |

### 5. How JWT Authentication Works

```
1. User logs in with email/password
         ↓
2. Server verifies credentials
         ↓
3. Server creates JWT with user info
         ↓
4. Server sends JWT to client
         ↓
5. Client stores JWT (localStorage, cookie)
         ↓
6. Client sends JWT with each request
   (Authorization: Bearer <token>)
         ↓
7. Server verifies JWT signature
         ↓
8. Server extracts user info from JWT
         ↓
9. Server processes request
```

### 6. Creating JWT in Node.js

```typescript
import jwt from "jsonwebtoken";

const SECRET_KEY = "your-secret-key";  // Keep this secure!

// Create (sign) a token
function createToken(userId: number, email: string): string {
    const payload = {
        userId,
        email,
        role: "user"
    };
    
    const options = {
        expiresIn: "24h"  // Token expires in 24 hours
    };
    
    return jwt.sign(payload, SECRET_KEY, options);
}

// Verify and decode a token
function verifyToken(token: string): any {
    try {
        return jwt.verify(token, SECRET_KEY);
    } catch (error) {
        throw new Error("Invalid token");
    }
}

// Decode without verification (for debugging)
function decodeToken(token: string): any {
    return jwt.decode(token);  // Does NOT verify signature!
}
```

### 7. Token Expiration

```typescript
// Short-lived access token (15 min - 24 hours)
const accessToken = jwt.sign(payload, SECRET, { expiresIn: "15m" });

// Long-lived refresh token (7 days - 30 days)
const refreshToken = jwt.sign(payload, REFRESH_SECRET, { expiresIn: "7d" });

// Check if token is expired
function isTokenExpired(token: string): boolean {
    try {
        const decoded = jwt.verify(token, SECRET);
        return false;  // Token is valid
    } catch (error: any) {
        if (error.name === "TokenExpiredError") {
            return true;  // Token is expired
        }
        throw error;  // Other error
    }
}
```

### 8. JWT vs Sessions

| Feature | JWT | Sessions |
|---------|-----|----------|
| Storage | Client-side | Server-side |
| Scalability | Stateless, easy to scale | Requires shared session store |
| Size | Larger (contains data) | Small (just session ID) |
| Revocation | Difficult | Easy |
| Security | Token can be stolen | Session can be hijacked |

---

## 💻 Code to Type & Understand

Create this structure in `exercises/day16/`:

```
exercises/day16/
├── src/
│   ├── types/
│   │   └── auth.ts
│   ├── services/
│   │   └── authService.ts
│   ├── utils/
│   │   └── jwt.ts
│   └── index.ts
└── package.json
```

**src/types/auth.ts**:
```typescript
export interface User {
    id: number;
    email: string;
    password: string;
    role: "user" | "admin";
}

export interface TokenPayload {
    userId: number;
    email: string;
    role: string;
    iat?: number;
    exp?: number;
}

export interface LoginResponse {
    user: {
        id: number;
        email: string;
        role: string;
    };
    accessToken: string;
    expiresIn: string;
}
```

**src/utils/jwt.ts**:
```typescript
import { TokenPayload } from "../types/auth";

// Simulated JWT functions (for learning without installing jsonwebtoken)
// In real app, use: import jwt from "jsonwebtoken"

const SECRET_KEY = "super-secret-key-change-in-production";

// Base64 URL encode
function base64UrlEncode(str: string): string {
    return Buffer.from(str)
        .toString("base64")
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=/g, "");
}

// Base64 URL decode
function base64UrlDecode(str: string): string {
    str = str.replace(/-/g, "+").replace(/_/g, "/");
    while (str.length % 4) str += "=";
    return Buffer.from(str, "base64").toString();
}

// Simple hash (NOT secure - for learning only!)
function simpleHash(data: string, secret: string): string {
    let hash = 0;
    const combined = data + secret;
    for (let i = 0; i < combined.length; i++) {
        const char = combined.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return Math.abs(hash).toString(16);
}

export function createToken(payload: TokenPayload, expiresInSeconds: number = 86400): string {
    console.log("[JWT] Creating token...");
    
    // Header
    const header = {
        alg: "HS256",
        typ: "JWT"
    };
    
    // Add timestamps to payload
    const now = Math.floor(Date.now() / 1000);
    const fullPayload = {
        ...payload,
        iat: now,
        exp: now + expiresInSeconds
    };
    
    // Encode header and payload
    const encodedHeader = base64UrlEncode(JSON.stringify(header));
    const encodedPayload = base64UrlEncode(JSON.stringify(fullPayload));
    
    // Create signature
    const signatureInput = `${encodedHeader}.${encodedPayload}`;
    const signature = base64UrlEncode(simpleHash(signatureInput, SECRET_KEY));
    
    // Combine all parts
    const token = `${encodedHeader}.${encodedPayload}.${signature}`;
    
    console.log("[JWT] Token created successfully");
    console.log("[JWT] Expires in:", expiresInSeconds, "seconds");
    
    return token;
}

export function verifyToken(token: string): TokenPayload {
    console.log("[JWT] Verifying token...");
    
    const parts = token.split(".");
    if (parts.length !== 3) {
        throw new Error("Invalid token format");
    }
    
    const [encodedHeader, encodedPayload, signature] = parts;
    
    // Verify signature
    const signatureInput = `${encodedHeader}.${encodedPayload}`;
    const expectedSignature = base64UrlEncode(simpleHash(signatureInput, SECRET_KEY));
    
    if (signature !== expectedSignature) {
        throw new Error("Invalid token signature");
    }
    
    // Decode payload
    const payload = JSON.parse(base64UrlDecode(encodedPayload)) as TokenPayload;
    
    // Check expiration
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) {
        throw new Error("Token has expired");
    }
    
    console.log("[JWT] Token verified successfully");
    return payload;
}

export function decodeToken(token: string): TokenPayload | null {
    console.log("[JWT] Decoding token (without verification)...");
    
    try {
        const parts = token.split(".");
        if (parts.length !== 3) return null;
        
        const payload = JSON.parse(base64UrlDecode(parts[1]));
        return payload;
    } catch {
        return null;
    }
}

export function getTokenExpiration(token: string): Date | null {
    const payload = decodeToken(token);
    if (!payload || !payload.exp) return null;
    return new Date(payload.exp * 1000);
}
```

**src/services/authService.ts**:
```typescript
import { User, LoginResponse, TokenPayload } from "../types/auth";
import { createToken, verifyToken } from "../utils/jwt";

// Simulated user database
const users: User[] = [
    { id: 1, email: "admin@example.com", password: "admin123", role: "admin" },
    { id: 2, email: "user@example.com", password: "user123", role: "user" }
];

// Simulated bcrypt compare
async function comparePassword(plain: string, hashed: string): Promise<boolean> {
    return plain === hashed;  // In real app, use bcrypt.compare()
}

export class AuthService {
    private readonly TOKEN_EXPIRY = 24 * 60 * 60;  // 24 hours in seconds
    
    async login(email: string, password: string): Promise<LoginResponse> {
        console.log("[AuthService] Login attempt for:", email);
        
        // Find user
        const user = users.find(u => u.email === email);
        if (!user) {
            throw new Error("Invalid email or password");
        }
        
        // Verify password
        const isValid = await comparePassword(password, user.password);
        if (!isValid) {
            throw new Error("Invalid email or password");
        }
        
        // Create token payload
        const payload: TokenPayload = {
            userId: user.id,
            email: user.email,
            role: user.role
        };
        
        // Generate token
        const accessToken = createToken(payload, this.TOKEN_EXPIRY);
        
        console.log("[AuthService] Login successful");
        
        return {
            user: {
                id: user.id,
                email: user.email,
                role: user.role
            },
            accessToken,
            expiresIn: "24h"
        };
    }
    
    async validateToken(token: string): Promise<TokenPayload> {
        console.log("[AuthService] Validating token...");
        
        try {
            const payload = verifyToken(token);
            
            // Optionally: Check if user still exists
            const user = users.find(u => u.id === payload.userId);
            if (!user) {
                throw new Error("User no longer exists");
            }
            
            console.log("[AuthService] Token is valid for user:", payload.email);
            return payload;
        } catch (error: any) {
            console.log("[AuthService] Token validation failed:", error.message);
            throw error;
        }
    }
    
    async refreshToken(oldToken: string): Promise<string> {
        console.log("[AuthService] Refreshing token...");
        
        // Verify old token (even if expired, we can still decode it)
        const payload = verifyToken(oldToken);
        
        // Create new token with fresh expiration
        const newPayload: TokenPayload = {
            userId: payload.userId,
            email: payload.email,
            role: payload.role
        };
        
        const newToken = createToken(newPayload, this.TOKEN_EXPIRY);
        
        console.log("[AuthService] Token refreshed successfully");
        return newToken;
    }
}

export const authService = new AuthService();
```

**src/index.ts**:
```typescript
import { authService } from "./services/authService";
import { createToken, verifyToken, decodeToken, getTokenExpiration } from "./utils/jwt";

async function main() {
    console.log("=== Day 16: Authentication Basics ===\n");
    
    // Part 1: Understanding JWT Structure
    console.log("--- Part 1: JWT Structure ---\n");
    
    const samplePayload = {
        userId: 1,
        email: "test@example.com",
        role: "user"
    };
    
    const token = createToken(samplePayload, 3600);  // 1 hour
    console.log("\nGenerated Token:");
    console.log(token);
    
    // Split and show parts
    const parts = token.split(".");
    console.log("\nToken Parts:");
    console.log("1. Header:", parts[0]);
    console.log("2. Payload:", parts[1]);
    console.log("3. Signature:", parts[2]);
    
    // Decode without verification
    console.log("\nDecoded Payload (without verification):");
    const decoded = decodeToken(token);
    console.log(decoded);
    
    // Get expiration
    const expiration = getTokenExpiration(token);
    console.log("\nToken Expires At:", expiration);
    
    // Part 2: Token Verification
    console.log("\n--- Part 2: Token Verification ---\n");
    
    // Verify valid token
    console.log("Verifying valid token:");
    try {
        const verified = verifyToken(token);
        console.log("Verified payload:", verified);
    } catch (error: any) {
        console.log("Error:", error.message);
    }
    
    // Verify tampered token
    console.log("\nVerifying tampered token:");
    const tamperedToken = token.slice(0, -5) + "XXXXX";
    try {
        verifyToken(tamperedToken);
    } catch (error: any) {
        console.log("Expected error:", error.message);
    }
    
    // Part 3: Login Flow
    console.log("\n--- Part 3: Login Flow ---\n");
    
    // Successful login
    console.log("Login with valid credentials:");
    try {
        const result = await authService.login("admin@example.com", "admin123");
        console.log("Login result:", {
            user: result.user,
            tokenPreview: result.accessToken.substring(0, 50) + "...",
            expiresIn: result.expiresIn
        });
        
        // Validate the received token
        console.log("\nValidating received token:");
        const validated = await authService.validateToken(result.accessToken);
        console.log("Token belongs to:", validated.email, "with role:", validated.role);
    } catch (error: any) {
        console.log("Error:", error.message);
    }
    
    // Failed login - wrong password
    console.log("\nLogin with wrong password:");
    try {
        await authService.login("admin@example.com", "wrongpassword");
    } catch (error: any) {
        console.log("Expected error:", error.message);
    }
    
    // Failed login - non-existent user
    console.log("\nLogin with non-existent email:");
    try {
        await authService.login("nobody@example.com", "password");
    } catch (error: any) {
        console.log("Expected error:", error.message);
    }
    
    // Part 4: Token Expiration Demo
    console.log("\n--- Part 4: Token Expiration ---\n");
    
    // Create a token that expires in 2 seconds
    console.log("Creating token that expires in 2 seconds...");
    const shortToken = createToken(samplePayload, 2);
    
    console.log("Verifying immediately:");
    try {
        verifyToken(shortToken);
        console.log("Token is valid!");
    } catch (error: any) {
        console.log("Error:", error.message);
    }
    
    console.log("\nWaiting 3 seconds...");
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    console.log("Verifying after expiration:");
    try {
        verifyToken(shortToken);
    } catch (error: any) {
        console.log("Expected error:", error.message);
    }
    
    console.log("\n=== All Tests Completed ===");
}

main().catch(console.error);
```

---

## ✍️ Exercises

### Exercise 1: Add Role-Based Claims
Modify the token creation to include:
- User's permissions array
- User's department
- Token ID (jti) for revocation

### Exercise 2: Implement Refresh Token
Create a refresh token system:
- Short-lived access token (15 minutes)
- Long-lived refresh token (7 days)
- Endpoint to exchange refresh token for new access token

### Exercise 3: Token Blacklist
Implement a simple token blacklist:
- Store invalidated tokens in memory
- Check blacklist during verification
- Add logout endpoint that blacklists the token

---

## ❓ Quiz Questions

### Q1: Authentication vs Authorization
What is the difference between authentication and authorization?

**Your Answer**: 


### Q2: JWT Parts
What are the three parts of a JWT and what does each contain?

**Your Answer**: 


### Q3: Token Security
Why should the JWT secret key be kept secure?

**Your Answer**: 


---

## 📝 Bonus Questions (Optional)

### B1: Why is JWT considered "stateless" and what are the implications?

**Your Answer**: 


### B2: What happens if someone steals a JWT token? How can you mitigate this?

**Your Answer**: 


---

## ✅ Day 16 Checklist

- [ ] Read Module 8 (Lines 3649-3900)
- [ ] Understand authentication vs authorization
- [ ] Understand JWT structure (header, payload, signature)
- [ ] Understand common JWT claims
- [ ] Understand token creation and verification
- [ ] Understand token expiration
- [ ] Type all code examples
- [ ] Complete Exercise 1 (Role-based claims)
- [ ] Complete Exercise 2 (Refresh token)
- [ ] Complete Exercise 3 (Token blacklist)
- [ ] Answer all quiz questions
- [ ] Update Progress.md

---

## 🔗 Next Day Preview
Tomorrow you'll learn about **Auth Middleware** - how to protect routes and verify tokens on every request.
