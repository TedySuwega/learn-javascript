# Day 30: Auth Middleware & Testing

## 📚 What to Learn Today
- **Topics**: JWT middleware, API testing, bug fixes
- **Time**: ~40 minutes reading, ~45 minutes practice
- **Goal**: Secure routes and test the complete API

---

## 📖 Key Concepts

### 1. Authentication Middleware Flow

```
Request → Auth Middleware → Controller
              ↓
         Check Header
              ↓
         Extract Token
              ↓
         Verify JWT
              ↓
         Attach User to Request
              ↓
         Next() or 401 Error
```

### 2. JWT Token in Headers

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

Parts:
- "Bearer" - Token type
- Token - The actual JWT
```

### 3. API Testing Tools

```
Options:
├── Postman (GUI)
├── Thunder Client (VS Code extension)
├── curl (Command line)
├── HTTPie (Command line)
└── REST Client (VS Code extension)
```

### 4. Testing Checklist

```
For each endpoint, test:
├── Happy path (valid input)
├── Invalid input (400)
├── Unauthorized (401)
├── Not found (404)
├── Edge cases
└── Error handling
```

---

## 💻 Code to Type & Understand

### Step 1: Auth Middleware

Create `src/middleware/auth.ts`:

```typescript
// ============================================
// Authentication Middleware
// ============================================

import { Request, Response, NextFunction } from 'express';
import { authService } from '../services';

// Extend Express Request type
declare global {
    namespace Express {
        interface Request {
            user?: {
                userId: number;
                email: string;
            };
        }
    }
}

/**
 * Authentication middleware
 * Verifies JWT token and attaches user to request
 */
export function authMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
): void {
    try {
        // Get authorization header
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            res.status(401).json({
                success: false,
                error: 'No authorization header provided'
            });
            return;
        }

        // Check Bearer format
        const parts = authHeader.split(' ');
        if (parts.length !== 2 || parts[0] !== 'Bearer') {
            res.status(401).json({
                success: false,
                error: 'Invalid authorization format. Use: Bearer <token>'
            });
            return;
        }

        const token = parts[1];

        // Verify token
        const payload = authService.verifyToken(token);

        // Attach user to request
        req.user = {
            userId: payload.userId,
            email: payload.email
        };

        next();
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Authentication failed';
        res.status(401).json({
            success: false,
            error: message
        });
    }
}

/**
 * Optional auth middleware
 * Attaches user if token present, but doesn't require it
 */
export function optionalAuthMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
): void {
    try {
        const authHeader = req.headers.authorization;

        if (authHeader) {
            const parts = authHeader.split(' ');
            if (parts.length === 2 && parts[0] === 'Bearer') {
                const payload = authService.verifyToken(parts[1]);
                req.user = {
                    userId: payload.userId,
                    email: payload.email
                };
            }
        }

        next();
    } catch (error) {
        // Ignore errors for optional auth
        next();
    }
}
```

### Step 2: Error Handler Middleware

Create `src/middleware/errorHandler.ts`:

```typescript
// ============================================
// Error Handler Middleware
// ============================================

import { Request, Response, NextFunction } from 'express';

// Custom error class
export class AppError extends Error {
    statusCode: number;
    isOperational: boolean;

    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}

// Not found error
export class NotFoundError extends AppError {
    constructor(resource: string = 'Resource') {
        super(`${resource} not found`, 404);
    }
}

// Validation error
export class ValidationError extends AppError {
    constructor(message: string) {
        super(message, 400);
    }
}

// Unauthorized error
export class UnauthorizedError extends AppError {
    constructor(message: string = 'Unauthorized') {
        super(message, 401);
    }
}

/**
 * Global error handler
 */
export function errorHandler(
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
): void {
    console.error('Error:', err);

    // Handle known errors
    if (err instanceof AppError) {
        res.status(err.statusCode).json({
            success: false,
            error: err.message
        });
        return;
    }

    // Handle JWT errors
    if (err.name === 'JsonWebTokenError') {
        res.status(401).json({
            success: false,
            error: 'Invalid token'
        });
        return;
    }

    if (err.name === 'TokenExpiredError') {
        res.status(401).json({
            success: false,
            error: 'Token expired'
        });
        return;
    }

    // Handle SQLite errors
    if (err.message.includes('UNIQUE constraint failed')) {
        res.status(400).json({
            success: false,
            error: 'Duplicate entry'
        });
        return;
    }

    if (err.message.includes('FOREIGN KEY constraint failed')) {
        res.status(400).json({
            success: false,
            error: 'Invalid reference'
        });
        return;
    }

    // Default error
    res.status(500).json({
        success: false,
        error: process.env.NODE_ENV === 'production' 
            ? 'Internal server error' 
            : err.message
    });
}

/**
 * Async handler wrapper
 * Catches errors in async route handlers
 */
export function asyncHandler(
    fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) {
    return (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
}
```

### Step 3: Request Logger Middleware

Create `src/middleware/logger.ts`:

```typescript
// ============================================
// Request Logger Middleware
// ============================================

import { Request, Response, NextFunction } from 'express';

interface LogEntry {
    timestamp: string;
    method: string;
    path: string;
    statusCode: number;
    duration: number;
    userAgent?: string;
    userId?: number;
}

/**
 * Request logger middleware
 */
export function requestLogger(
    req: Request,
    res: Response,
    next: NextFunction
): void {
    const startTime = Date.now();

    // Log after response is sent
    res.on('finish', () => {
        const duration = Date.now() - startTime;
        
        const logEntry: LogEntry = {
            timestamp: new Date().toISOString(),
            method: req.method,
            path: req.path,
            statusCode: res.statusCode,
            duration,
            userAgent: req.get('User-Agent'),
            userId: req.user?.userId
        };

        // Color code based on status
        const statusColor = res.statusCode >= 500 ? '\x1b[31m' :  // Red
                           res.statusCode >= 400 ? '\x1b[33m' :  // Yellow
                           res.statusCode >= 300 ? '\x1b[36m' :  // Cyan
                           '\x1b[32m';                           // Green

        console.log(
            `${logEntry.timestamp} | ${statusColor}${logEntry.method.padEnd(7)}\x1b[0m | ` +
            `${logEntry.path.padEnd(30)} | ${statusColor}${logEntry.statusCode}\x1b[0m | ` +
            `${logEntry.duration}ms` +
            (logEntry.userId ? ` | User: ${logEntry.userId}` : '')
        );
    });

    next();
}
```

### Step 4: API Test Collection

Create `api-tests/README.md`:

```markdown
# API Test Collection

## Setup

1. Start the server: `npm run dev`
2. Run migrations: `npm run migrate`
3. Use Postman, Thunder Client, or curl to test

## Base URL
```
http://localhost:3000
```

## Authentication

After login/register, copy the token and add to headers:
```
Authorization: Bearer <your-token>
```

---

## Auth Endpoints

### Register
```
POST /api/auth/register
Content-Type: application/json

{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
}
```

### Login
```
POST /api/auth/login
Content-Type: application/json

{
    "email": "john@example.com",
    "password": "password123"
}
```

### Get Profile (Protected)
```
GET /api/auth/profile
Authorization: Bearer <token>
```

---

## Transaction Endpoints (All Protected)

### List Transactions
```
GET /api/transactions
GET /api/transactions?type=expense
GET /api/transactions?startDate=2024-01-01&endDate=2024-12-31
GET /api/transactions?limit=10&offset=0
```

### Create Transaction
```
POST /api/transactions
Content-Type: application/json

{
    "category_id": 1,
    "amount": 5000,
    "description": "Monthly salary",
    "date": "2024-01-15"
}
```

### Get Transaction
```
GET /api/transactions/1
```

### Update Transaction
```
PUT /api/transactions/1
Content-Type: application/json

{
    "amount": 5500,
    "description": "Updated salary"
}
```

### Delete Transaction
```
DELETE /api/transactions/1
```

---

## Category Endpoints (All Protected)

### List Categories
```
GET /api/categories
GET /api/categories?type=income
```

### Create Category
```
POST /api/categories
Content-Type: application/json

{
    "name": "Side Hustle",
    "type": "income",
    "icon": "🚀"
}
```

---

## Report Endpoints (All Protected)

### Dashboard Summary
```
GET /api/reports/dashboard
```

### Monthly Trends
```
GET /api/reports/monthly?months=6
```

### Category Breakdown
```
GET /api/reports/categories?startDate=2024-01-01&endDate=2024-12-31
```
```

### Step 5: Curl Test Script

Create `api-tests/test.sh`:

```bash
#!/bin/bash

# ============================================
# API Test Script
# ============================================

BASE_URL="http://localhost:3000"
TOKEN=""

echo "🧪 Finance Tracker API Tests"
echo "============================"
echo ""

# Health Check
echo "1. Health Check"
curl -s "$BASE_URL/health" | jq
echo ""

# Register
echo "2. Register User"
REGISTER_RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/register" \
    -H "Content-Type: application/json" \
    -d '{
        "name": "Test User",
        "email": "test@example.com",
        "password": "password123"
    }')
echo $REGISTER_RESPONSE | jq
TOKEN=$(echo $REGISTER_RESPONSE | jq -r '.data.token')
echo "Token: ${TOKEN:0:50}..."
echo ""

# Get Profile
echo "3. Get Profile"
curl -s "$BASE_URL/api/auth/profile" \
    -H "Authorization: Bearer $TOKEN" | jq
echo ""

# Get Categories
echo "4. Get Categories"
curl -s "$BASE_URL/api/categories" \
    -H "Authorization: Bearer $TOKEN" | jq
echo ""

# Create Transaction
echo "5. Create Transaction"
curl -s -X POST "$BASE_URL/api/transactions" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d '{
        "category_id": 1,
        "amount": 5000,
        "description": "Monthly salary",
        "date": "2024-01-15"
    }' | jq
echo ""

# Get Transactions
echo "6. Get Transactions"
curl -s "$BASE_URL/api/transactions" \
    -H "Authorization: Bearer $TOKEN" | jq
echo ""

# Get Dashboard
echo "7. Get Dashboard"
curl -s "$BASE_URL/api/reports/dashboard" \
    -H "Authorization: Bearer $TOKEN" | jq
echo ""

echo "✅ Tests completed!"
```

### Step 6: Thunder Client Collection

Create `api-tests/thunder-collection.json`:

```json
{
    "client": "Thunder Client",
    "collectionName": "Finance Tracker API",
    "dateExported": "2024-01-01",
    "version": "1.1",
    "folders": [
        {
            "name": "Auth",
            "containerId": ""
        },
        {
            "name": "Transactions",
            "containerId": ""
        },
        {
            "name": "Categories",
            "containerId": ""
        },
        {
            "name": "Reports",
            "containerId": ""
        }
    ],
    "requests": [
        {
            "name": "Register",
            "url": "{{baseUrl}}/api/auth/register",
            "method": "POST",
            "body": {
                "type": "json",
                "raw": "{\n    \"name\": \"Test User\",\n    \"email\": \"test@example.com\",\n    \"password\": \"password123\"\n}"
            },
            "folder": "Auth"
        },
        {
            "name": "Login",
            "url": "{{baseUrl}}/api/auth/login",
            "method": "POST",
            "body": {
                "type": "json",
                "raw": "{\n    \"email\": \"test@example.com\",\n    \"password\": \"password123\"\n}"
            },
            "folder": "Auth"
        },
        {
            "name": "Get Profile",
            "url": "{{baseUrl}}/api/auth/profile",
            "method": "GET",
            "headers": [
                {
                    "name": "Authorization",
                    "value": "Bearer {{token}}"
                }
            ],
            "folder": "Auth"
        },
        {
            "name": "List Transactions",
            "url": "{{baseUrl}}/api/transactions",
            "method": "GET",
            "headers": [
                {
                    "name": "Authorization",
                    "value": "Bearer {{token}}"
                }
            ],
            "folder": "Transactions"
        },
        {
            "name": "Create Transaction",
            "url": "{{baseUrl}}/api/transactions",
            "method": "POST",
            "headers": [
                {
                    "name": "Authorization",
                    "value": "Bearer {{token}}"
                }
            ],
            "body": {
                "type": "json",
                "raw": "{\n    \"category_id\": 1,\n    \"amount\": 5000,\n    \"description\": \"Monthly salary\",\n    \"date\": \"2024-01-15\"\n}"
            },
            "folder": "Transactions"
        },
        {
            "name": "List Categories",
            "url": "{{baseUrl}}/api/categories",
            "method": "GET",
            "headers": [
                {
                    "name": "Authorization",
                    "value": "Bearer {{token}}"
                }
            ],
            "folder": "Categories"
        },
        {
            "name": "Dashboard",
            "url": "{{baseUrl}}/api/reports/dashboard",
            "method": "GET",
            "headers": [
                {
                    "name": "Authorization",
                    "value": "Bearer {{token}}"
                }
            ],
            "folder": "Reports"
        }
    ]
}
```

---

## ✍️ Exercises

### Exercise 1: Test All Error Cases
Create tests for:
- Invalid token (401)
- Expired token (401)
- Missing required fields (400)
- Invalid data types (400)
- Non-existent resources (404)

### Exercise 2: Add Integration Tests
Create `src/__tests__/api.test.ts` using Jest that:
- Tests the full registration → login → create transaction flow
- Verifies all response structures
- Cleans up test data after each test

### Exercise 3: Create API Documentation
Create `api-tests/API_DOCS.md` that:
- Documents all endpoints with examples
- Lists all possible error responses
- Includes authentication instructions
- Shows sample request/response for each endpoint

---

## ❓ Quiz Questions

### Q1: Token Storage
Where should the frontend store the JWT token? What are the security considerations?

**Your Answer**: 


### Q2: Token Refresh
What happens when a token expires? How would you implement token refresh?

**Your Answer**: 


### Q3: Testing Strategy
What's the difference between unit tests, integration tests, and end-to-end tests? Which is most important for an API?

**Your Answer**: 


---

## 📝 Bonus Questions (Optional)

### B1: How would you implement role-based access control (RBAC) in the middleware?

**Your Answer**: 


### B2: What security headers should you add to the API responses?

**Your Answer**: 


---

## ✅ Day 30 Checklist

- [ ] Implement auth middleware
- [ ] Implement error handler middleware
- [ ] Implement request logger
- [ ] Create API test documentation
- [ ] Test registration endpoint
- [ ] Test login endpoint
- [ ] Test protected endpoints
- [ ] Test error cases
- [ ] Fix any bugs found during testing
- [ ] Complete Exercise 1 (Error Tests)
- [ ] Complete Exercise 2 (Integration Tests)
- [ ] Complete Exercise 3 (API Docs)
- [ ] Answer all quiz questions

---

## 🔗 Next Day Preview
Tomorrow you'll start the **Frontend** - setting up React with authentication pages and connecting to the backend API.
