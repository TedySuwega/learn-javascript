# Day 31: React Setup & Auth Pages

## 📚 What to Learn Today
- **Topics**: React project setup, Tailwind CSS, auth context, login/register pages
- **Time**: ~45 minutes reading, ~45 minutes practice
- **Goal**: Build authentication flow with JWT storage and Tailwind CSS styling

---

## 📖 Key Concepts

### 1. Frontend Architecture

```
finance-tracker-frontend/
├── src/
│   ├── api/           # API client
│   ├── components/    # Reusable components
│   ├── context/       # React Context (auth)
│   ├── hooks/         # Custom hooks
│   ├── pages/         # Page components
│   ├── types/         # TypeScript types
│   └── utils/         # Helper functions
```

### 2. Auth Context Pattern

```
AuthContext provides:
├── user (current user data)
├── token (JWT token)
├── isAuthenticated (boolean)
├── login(credentials)
├── register(userData)
├── logout()
└── loading (auth state loading)
```

### 3. Protected Routes

```
Route Check:
Is Authenticated? 
├── Yes → Render Component
└── No  → Redirect to Login
```

### 4. Tailwind CSS Benefits

```
Traditional CSS:
.button {
    background-color: blue;
    padding: 8px 16px;
    border-radius: 4px;
}

Tailwind CSS:
<button className="bg-blue-500 px-4 py-2 rounded">
```

---

## 💻 Code to Type & Understand

### Step 1: Create React App with Vite

```bash
# Create new Vite project with React + TypeScript
npm create vite@latest finance-tracker-frontend -- --template react-ts
cd finance-tracker-frontend
npm install

# Install dependencies
npm install react-router-dom axios
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### Step 2: Configure Tailwind CSS

Update `tailwind.config.js`:

```javascript
/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    50: '#eff6ff',
                    100: '#dbeafe',
                    200: '#bfdbfe',
                    300: '#93c5fd',
                    400: '#60a5fa',
                    500: '#3b82f6',
                    600: '#2563eb',
                    700: '#1d4ed8',
                    800: '#1e40af',
                    900: '#1e3a8a',
                },
                success: '#10b981',
                warning: '#f59e0b',
                danger: '#ef4444',
            },
        },
    },
    plugins: [],
}
```

Update `src/index.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
    body {
        @apply bg-gray-50 text-gray-900;
    }
}

@layer components {
    .btn {
        @apply px-4 py-2 rounded-lg font-medium transition-colors duration-200;
    }
    .btn-primary {
        @apply bg-primary-600 text-white hover:bg-primary-700;
    }
    .btn-secondary {
        @apply bg-gray-200 text-gray-800 hover:bg-gray-300;
    }
    .btn-danger {
        @apply bg-danger text-white hover:bg-red-600;
    }
    .input {
        @apply w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all;
    }
    .input-error {
        @apply border-danger focus:ring-danger;
    }
    .card {
        @apply bg-white rounded-xl shadow-sm border border-gray-100 p-6;
    }
    .label {
        @apply block text-sm font-medium text-gray-700 mb-1;
    }
}
```

### Step 3: Type Definitions

Create `src/types/index.ts`:

```typescript
// ============================================
// Type Definitions
// ============================================

// User types
export interface User {
    id: string
    email: string
    full_name: string
    email_verified: boolean
    created_at: string
}

export interface LoginCredentials {
    email: string
    password: string
}

export interface RegisterData {
    full_name: string
    email: string
    password: string
}

export interface AuthResponse {
    user: User
    token: string
}

// API Response types
export interface ApiResponse<T> {
    success: boolean
    data?: T
    error?: string
    message?: string
}

// Category types
export type CategoryType = 'income' | 'expense'

export interface Category {
    id: string
    name: string
    type: CategoryType
    icon: string
    user_id: string | null
    created_at: string
}

// Transaction types
export interface Transaction {
    id: string
    user_id: string
    category_id: string
    amount: number
    description: string
    date: string
    type: CategoryType
    created_at: string
    updated_at: string
    category_name: string
    category_icon: string
}

export interface TransactionCreate {
    category_id: string
    amount: number
    description?: string
    date: string
    type: CategoryType
}

// Report types
export interface DashboardSummary {
    totalIncome: number
    totalExpense: number
    balance: number
    transactionCount: number
    monthlyChange: {
        income: number
        expense: number
    }
}

export interface CategorySummary {
    category_id: string
    category_name: string
    category_icon: string
    total: number
    percentage: number
}

export interface MonthlyTrend {
    month: string
    total_income: number
    total_expense: number
    balance: number
}
```

### Step 4: API Client

Create `src/api/client.ts`:

```typescript
// ============================================
// API Client
// ============================================

import { ApiResponse } from '../types'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

class ApiClient {
    private baseUrl: string
    private token: string | null = null

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl
        this.token = localStorage.getItem('token')
    }

    setToken(token: string | null) {
        this.token = token
        if (token) {
            localStorage.setItem('token', token)
        } else {
            localStorage.removeItem('token')
        }
    }

    getToken(): string | null {
        return this.token
    }

    private async request<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<ApiResponse<T>> {
        const url = `${this.baseUrl}${endpoint}`

        const headers: HeadersInit = {
            'Content-Type': 'application/json',
            ...options.headers,
        }

        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`
        }

        try {
            const response = await fetch(url, {
                ...options,
                headers,
            })

            const data = await response.json()

            if (!response.ok) {
                return {
                    success: false,
                    error: data.error || 'Request failed',
                }
            }

            return data
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Network error',
            }
        }
    }

    async get<T>(endpoint: string, params?: Record<string, any>): Promise<ApiResponse<T>> {
        let url = endpoint
        if (params) {
            const searchParams = new URLSearchParams()
            Object.entries(params).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    searchParams.append(key, String(value))
                }
            })
            const queryString = searchParams.toString()
            if (queryString) {
                url += `?${queryString}`
            }
        }
        return this.request<T>(url, { method: 'GET' })
    }

    async post<T>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, {
            method: 'POST',
            body: body ? JSON.stringify(body) : undefined,
        })
    }

    async put<T>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, {
            method: 'PUT',
            body: body ? JSON.stringify(body) : undefined,
        })
    }

    async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, { method: 'DELETE' })
    }
}

export const api = new ApiClient(API_BASE_URL)
export default api
```

### Step 5: Auth API

Create `src/api/auth.ts`:

```typescript
// ============================================
// Auth API
// ============================================

import api from './client'
import { AuthResponse, LoginCredentials, RegisterData, User } from '../types'

export const authApi = {
    register: async (data: RegisterData): Promise<AuthResponse> => {
        const response = await api.post<AuthResponse>('/api/v1/auth/register', data)
        if (response.success && response.data) {
            api.setToken(response.data.token)
            return response.data
        }
        throw new Error(response.error || 'Registration failed')
    },

    login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
        const response = await api.post<AuthResponse>('/api/v1/auth/login', credentials)
        if (response.success && response.data) {
            api.setToken(response.data.token)
            return response.data
        }
        throw new Error(response.error || 'Login failed')
    },

    getProfile: async (): Promise<User> => {
        const response = await api.get<User>('/api/v1/auth/profile')
        if (response.success && response.data) {
            return response.data
        }
        throw new Error(response.error || 'Failed to get profile')
    },

    logout: () => {
        api.setToken(null)
    },
}
```

### Step 6: Auth Context

Create `src/context/AuthContext.tsx`:

```tsx
// ============================================
// Auth Context
// ============================================

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { User, LoginCredentials, RegisterData } from '../types'
import { authApi } from '../api/auth'
import api from '../api/client'

interface AuthContextType {
    user: User | null
    token: string | null
    isAuthenticated: boolean
    loading: boolean
    login: (credentials: LoginCredentials) => Promise<void>
    register: (data: RegisterData) => Promise<void>
    logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [token, setToken] = useState<string | null>(api.getToken())
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const initAuth = async () => {
            const savedToken = api.getToken()
            if (savedToken) {
                try {
                    const profile = await authApi.getProfile()
                    setUser(profile)
                    setToken(savedToken)
                } catch (error) {
                    api.setToken(null)
                    setToken(null)
                }
            }
            setLoading(false)
        }

        initAuth()
    }, [])

    const login = async (credentials: LoginCredentials) => {
        const response = await authApi.login(credentials)
        setUser(response.user)
        setToken(response.token)
    }

    const register = async (data: RegisterData) => {
        const response = await authApi.register(data)
        setUser(response.user)
        setToken(response.token)
    }

    const logout = () => {
        authApi.logout()
        setUser(null)
        setToken(null)
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                isAuthenticated: !!user,
                loading,
                login,
                register,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}
```

### Step 7: Protected Route Component

Create `src/components/ProtectedRoute.tsx`:

```tsx
// ============================================
// Protected Route Component
// ============================================

import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

interface ProtectedRouteProps {
    children: React.ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
    const { isAuthenticated, loading } = useAuth()
    const location = useLocation()

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
            </div>
        )
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />
    }

    return <>{children}</>
}
```

### Step 8: Login Page

Create `src/pages/Login.tsx`:

```tsx
// ============================================
// Login Page
// ============================================

import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const { login } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()

    const from = (location.state as any)?.from?.pathname || '/dashboard'

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            await login({ email, password })
            navigate(from, { replace: true })
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Login failed')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 px-4">
            <div className="max-w-md w-full">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Finance Tracker</h1>
                    <p className="text-gray-600 mt-2">Sign in to your account</p>
                </div>

                <div className="card">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                                {error}
                            </div>
                        )}

                        <div>
                            <label htmlFor="email" className="label">
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="input"
                                placeholder="you@example.com"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="label">
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="input"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Signing in...
                                </span>
                            ) : (
                                'Sign in'
                            )}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-gray-600">
                            Don't have an account?{' '}
                            <Link to="/register" className="text-primary-600 hover:text-primary-700 font-medium">
                                Sign up
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
```

### Step 9: Register Page

Create `src/pages/Register.tsx`:

```tsx
// ============================================
// Register Page
// ============================================

import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export function Register() {
    const [fullName, setFullName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const { register } = useAuth()
    const navigate = useNavigate()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        if (password !== confirmPassword) {
            setError('Passwords do not match')
            return
        }

        if (password.length < 8) {
            setError('Password must be at least 8 characters')
            return
        }

        setLoading(true)

        try {
            await register({ full_name: fullName, email, password })
            navigate('/dashboard')
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Registration failed')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 px-4 py-8">
            <div className="max-w-md w-full">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Finance Tracker</h1>
                    <p className="text-gray-600 mt-2">Create your account</p>
                </div>

                <div className="card">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                                {error}
                            </div>
                        )}

                        <div>
                            <label htmlFor="fullName" className="label">
                                Full Name
                            </label>
                            <input
                                id="fullName"
                                type="text"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                className="input"
                                placeholder="John Doe"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="email" className="label">
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="input"
                                placeholder="you@example.com"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="label">
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="input"
                                placeholder="••••••••"
                                required
                                minLength={8}
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Must be at least 8 characters
                            </p>
                        </div>

                        <div>
                            <label htmlFor="confirmPassword" className="label">
                                Confirm Password
                            </label>
                            <input
                                id="confirmPassword"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className={`input ${password !== confirmPassword && confirmPassword ? 'input-error' : ''}`}
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Creating account...' : 'Create account'}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-gray-600">
                            Already have an account?{' '}
                            <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
```

### Step 10: App Component with Routes

Update `src/App.tsx`:

```tsx
// ============================================
// App Component
// ============================================

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ProtectedRoute } from './components/ProtectedRoute'
import { Login } from './pages/Login'
import { Register } from './pages/Register'

function Dashboard() {
    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-gray-600">Welcome! Dashboard will be built tomorrow.</p>
        </div>
    )
}

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route
                        path="/dashboard"
                        element={
                            <ProtectedRoute>
                                <Dashboard />
                            </ProtectedRoute>
                        }
                    />
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    )
}

export default App
```

### Step 11: Environment Variables

Create `.env`:

```env
VITE_API_URL=http://localhost:3000
```

---

## ✍️ Exercises

### Exercise 1: Add Form Validation
Enhance the registration form with:
- Real-time email format validation
- Password strength indicator (weak/medium/strong)
- Visual feedback for matching passwords

### Exercise 2: Add "Remember Me" Feature
Add a "Remember me" checkbox to login that:
- Stores token in localStorage (checked) or sessionStorage (unchecked)
- Persists the preference

### Exercise 3: Add Forgot Password UI
Create a forgot password page with:
- Email input form
- Success message after submission
- Link back to login

---

## ❓ Quiz Questions

### Q1: Context vs Props
Why do we use React Context for auth state instead of passing props through components?

**Your Answer**: 


### Q2: Token Storage
What are the security implications of storing JWT in localStorage vs sessionStorage?

**Your Answer**: 


### Q3: Tailwind vs CSS
What are the advantages and disadvantages of using Tailwind CSS compared to traditional CSS files?

**Your Answer**: 


---

## 📝 Bonus Questions (Optional)

### B1: How would you implement "dark mode" with Tailwind CSS?

**Your Answer**: 


### B2: Why do we check for existing token on app load (in useEffect)?

**Your Answer**: 


---

## ✅ Day 31 Checklist

- [ ] Set up React project with Vite
- [ ] Configure Tailwind CSS
- [ ] Create type definitions
- [ ] Build API client with token handling
- [ ] Create Auth Context
- [ ] Build Protected Route component
- [ ] Create Login page with Tailwind styling
- [ ] Create Register page with Tailwind styling
- [ ] Set up React Router
- [ ] Test authentication flow
- [ ] Complete Exercise 1 (Form Validation)
- [ ] Complete Exercise 2 (Remember Me)
- [ ] Complete Exercise 3 (Forgot Password UI)
- [ ] Answer all quiz questions

---

## 🔗 Next Day Preview
Tomorrow you'll build the **Dashboard** - creating the layout component, summary cards, and recent transactions display with Tailwind CSS.
