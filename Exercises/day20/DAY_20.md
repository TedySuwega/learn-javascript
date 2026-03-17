# Day 20: Hands-On Exercises

## 📚 What to Learn Today
- **Read**: [LEARNING_MODULE.md](../../Modules/LEARNING_MODULE.md) - Module 10 (Lines 4929-5674)
- **Time**: ~90 minutes practice
- **Topics**: Practice exercises, add new features

---

## 📖 Overview

Today is all about practice! You'll complete comprehensive exercises that test everything you've learned in Weeks 3-4:

- Service Layer (business logic, validation)
- Controller Layer (HTTP handling, status codes)
- Authentication (JWT, middleware)
- Error Handling (custom errors, global handler)
- Data Transformation (security, sanitization)

---

## 🎯 Exercise 1: Complete User Management System

Build a complete user management system with all layers.

### Requirements

**Features:**
1. User registration with validation
2. User login with JWT
3. Get current user profile (protected)
4. Update user profile (protected)
5. Change password (protected)
6. Admin: List all users (admin only)
7. Admin: Delete user (admin only)

**Validation Rules:**
- Name: 2-100 characters
- Email: Valid format, unique
- Password: 6-50 characters, at least 1 number

### Starter Code

Create `exercises/day20/exercise1/`:

**src/types/index.ts**:
```typescript
export interface User {
    id: number;
    name: string;
    email: string;
    password: string;
    role: "user" | "admin";
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface RegisterDTO {
    name: string;
    email: string;
    password: string;
}

export interface LoginDTO {
    email: string;
    password: string;
}

export interface UpdateProfileDTO {
    name?: string;
    email?: string;
}

export interface ChangePasswordDTO {
    currentPassword: string;
    newPassword: string;
}

export interface UserResponse {
    id: number;
    name: string;
    email: string;
    role: string;
    isActive: boolean;
    createdAt: string;
}

export interface AuthResponse {
    user: UserResponse;
    accessToken: string;
    expiresIn: string;
}

export interface TokenPayload {
    userId: number;
    email: string;
    role: string;
}

declare module "fastify" {
    interface FastifyRequest {
        user?: TokenPayload;
    }
}
```

### Your Task

Implement the following:

1. **UserRepository** (`src/repositories/userRepository.ts`)
   - `findAll(): Promise<User[]>`
   - `findById(id: number): Promise<User | null>`
   - `findByEmail(email: string): Promise<User | null>`
   - `create(data: CreateUserDTO): Promise<User>`
   - `update(id: number, data: Partial<User>): Promise<User | null>`
   - `delete(id: number): Promise<boolean>`

2. **UserService** (`src/services/userService.ts`)
   - `register(data: RegisterDTO): Promise<AuthResponse>`
   - `login(data: LoginDTO): Promise<AuthResponse>`
   - `getProfile(userId: number): Promise<UserResponse>`
   - `updateProfile(userId: number, data: UpdateProfileDTO): Promise<UserResponse>`
   - `changePassword(userId: number, data: ChangePasswordDTO): Promise<void>`
   - `getAllUsers(): Promise<UserResponse[]>` (admin)
   - `deleteUser(id: number): Promise<void>` (admin)

3. **UserController** (`src/controllers/userController.ts`)
   - Handle all HTTP requests
   - Proper status codes
   - Error handling

4. **Auth Middleware** (`src/middleware/auth.ts`)
   - Token verification
   - Role checking

5. **Routes** (`src/routes/index.ts`)
   - Public: POST /auth/register, POST /auth/login
   - Protected: GET /users/me, PUT /users/me, PUT /users/me/password
   - Admin: GET /users, DELETE /users/:id

### Expected Behavior

```bash
# Register
POST /auth/register
Body: { "name": "John", "email": "john@example.com", "password": "pass123" }
Response: 201 { success: true, data: { user: {...}, accessToken: "..." } }

# Login
POST /auth/login
Body: { "email": "john@example.com", "password": "pass123" }
Response: 200 { success: true, data: { user: {...}, accessToken: "..." } }

# Get Profile (with token)
GET /users/me
Headers: Authorization: Bearer <token>
Response: 200 { success: true, data: { user: {...} } }

# Update Profile (with token)
PUT /users/me
Headers: Authorization: Bearer <token>
Body: { "name": "John Doe" }
Response: 200 { success: true, data: { user: {...} } }

# Admin List Users (admin token)
GET /users
Headers: Authorization: Bearer <admin-token>
Response: 200 { success: true, data: { users: [...] } }

# Non-admin trying admin route
GET /users
Headers: Authorization: Bearer <user-token>
Response: 403 { success: false, error: "Insufficient permissions" }
```

---

## 🎯 Exercise 2: Blog Post API

Build a blog post API with authentication and authorization.

### Requirements

**Features:**
1. Create post (authenticated users)
2. List all posts (public)
3. Get single post (public)
4. Update post (author only)
5. Delete post (author or admin)
6. Add comment to post (authenticated)
7. List comments for post (public)

**Post Entity:**
```typescript
interface Post {
    id: number;
    title: string;
    content: string;
    authorId: number;
    isPublished: boolean;
    createdAt: Date;
    updatedAt: Date;
}

interface Comment {
    id: number;
    postId: number;
    authorId: number;
    content: string;
    createdAt: Date;
}
```

### Your Task

Create `exercises/day20/exercise2/` with:

1. **PostRepository** and **CommentRepository**
2. **PostService** with business logic
3. **PostController** with proper authorization
4. **Routes** with appropriate middleware

### Authorization Rules

| Action | Who Can Do It |
|--------|---------------|
| Create post | Any authenticated user |
| Update post | Author only |
| Delete post | Author OR admin |
| Publish post | Author only |
| Add comment | Any authenticated user |
| Delete comment | Comment author OR post author OR admin |

### Expected Behavior

```bash
# Create post (authenticated)
POST /posts
Headers: Authorization: Bearer <token>
Body: { "title": "My Post", "content": "..." }
Response: 201 { success: true, data: { post: {...} } }

# Update own post
PUT /posts/1
Headers: Authorization: Bearer <author-token>
Body: { "title": "Updated Title" }
Response: 200 { success: true, data: { post: {...} } }

# Update someone else's post
PUT /posts/1
Headers: Authorization: Bearer <other-user-token>
Response: 403 { success: false, error: "You can only edit your own posts" }

# Admin delete any post
DELETE /posts/1
Headers: Authorization: Bearer <admin-token>
Response: 204
```

---

## 🎯 Exercise 3: E-commerce Product API

Build a product management API with inventory tracking.

### Requirements

**Features:**
1. CRUD operations for products
2. Inventory management (stock levels)
3. Category filtering
4. Price range filtering
5. Search by name
6. Low stock alerts

**Product Entity:**
```typescript
interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    stock: number;
    category: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
```

### Your Task

Create `exercises/day20/exercise3/` with:

1. **ProductRepository** with filtering support
2. **ProductService** with:
   - Stock validation (can't go negative)
   - Price validation (must be positive)
   - Low stock detection
3. **ProductController** with:
   - Pagination
   - Filtering (category, price range, in stock)
   - Search

### Expected Behavior

```bash
# List products with filters
GET /products?category=electronics&minPrice=100&maxPrice=500&inStock=true&page=1&limit=10
Response: 200 {
    success: true,
    data: { products: [...] },
    pagination: { page: 1, limit: 10, total: 25, totalPages: 3 }
}

# Search products
GET /products?search=laptop
Response: 200 { success: true, data: { products: [...] } }

# Update stock
PATCH /products/1/stock
Body: { "adjustment": -5 }  // Decrease by 5
Response: 200 { success: true, data: { product: {...}, newStock: 15 } }

# Try to reduce stock below zero
PATCH /products/1/stock
Body: { "adjustment": -100 }
Response: 400 { success: false, error: "Insufficient stock" }

# Get low stock products
GET /products/low-stock?threshold=10
Response: 200 { success: true, data: { products: [...] } }
```

---

## 🎯 Exercise 4: Integration Challenge

Combine everything into a mini e-commerce system.

### Requirements

Build an API that includes:
1. User authentication (from Exercise 1)
2. Product management (from Exercise 3)
3. Shopping cart functionality
4. Order placement

**New Entities:**
```typescript
interface CartItem {
    productId: number;
    quantity: number;
}

interface Order {
    id: number;
    userId: number;
    items: OrderItem[];
    totalAmount: number;
    status: "pending" | "confirmed" | "shipped" | "delivered";
    createdAt: Date;
}

interface OrderItem {
    productId: number;
    quantity: number;
    priceAtPurchase: number;
}
```

### Your Task

Create `exercises/day20/exercise4/` with:

1. **CartService**
   - Add item to cart
   - Remove item from cart
   - Get cart contents
   - Clear cart

2. **OrderService**
   - Place order (validate stock, calculate total)
   - Get user's orders
   - Update order status (admin)

### Business Rules

- Can't add out-of-stock products to cart
- Placing order reduces product stock
- Order total is calculated from current prices
- Users can only see their own orders
- Admins can see all orders

---

## ✍️ Submission Checklist

For each exercise, ensure:

- [ ] All CRUD operations work correctly
- [ ] Proper HTTP status codes used
- [ ] Authentication works where required
- [ ] Authorization rules enforced
- [ ] Validation errors return 400
- [ ] Not found errors return 404
- [ ] Conflict errors return 409
- [ ] Sensitive data not exposed in responses
- [ ] Consistent response format
- [ ] Code is well-organized

---

## ❓ Reflection Questions

After completing the exercises, answer these questions:

### Q1: Architecture
What are the benefits of separating code into Repository, Service, and Controller layers?

**Your Answer**: 


### Q2: Error Handling
How does having custom error classes improve your code?

**Your Answer**: 


### Q3: Security
What security measures did you implement and why are they important?

**Your Answer**: 


---

## 📝 Bonus Challenges

### Challenge 1: Add Caching
Implement a simple in-memory cache for:
- Product listings (cache for 5 minutes)
- User profiles (cache for 1 minute)
- Invalidate cache on updates

### Challenge 2: Add Audit Logging
Log all important actions:
- User login/logout
- Resource creation/update/deletion
- Failed authentication attempts

### Challenge 3: Add Rate Limiting
Implement rate limiting:
- 100 requests per minute for authenticated users
- 20 requests per minute for unauthenticated users
- Different limits for different endpoints

---

## ✅ Day 20 Checklist

- [ ] Read Module 10 (Lines 4929-5674)
- [ ] Complete Exercise 1 (User Management)
- [ ] Complete Exercise 2 (Blog Post API)
- [ ] Complete Exercise 3 (Product API)
- [ ] Complete Exercise 4 (Integration)
- [ ] Answer reflection questions
- [ ] Try at least one bonus challenge
- [ ] Update Progress.md

---

## 🎉 Week 4 Complete!

Congratulations! You've completed Weeks 3-4 of your JavaScript/TypeScript backend learning journey!

**What you've learned:**
- Service Layer for business logic
- Controller Layer for HTTP handling
- JWT Authentication
- Auth Middleware and protected routes
- Complete request flow
- Error handling and data transformation
- Building complete APIs

**What's next:**
- Testing (unit tests, integration tests)
- Database integration (PostgreSQL, MongoDB)
- API documentation (Swagger/OpenAPI)
- Deployment and DevOps
- Advanced patterns (caching, queuing, microservices)

---

## 🔗 Continue Learning

Recommended next steps:
1. Add unit tests to your exercises
2. Connect to a real database
3. Deploy your API to a cloud platform
4. Add API documentation with Swagger
5. Implement more advanced features (file uploads, email sending, etc.)

**Great job completing this learning module!** 🚀
