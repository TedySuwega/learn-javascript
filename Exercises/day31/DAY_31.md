# Day 31: React Setup & Auth Pages

## 📚 What to Learn Today
- **Topics**: React project setup, auth context, login/register pages
- **Time**: ~45 minutes reading, ~45 minutes practice
- **Goal**: Build authentication flow with JWT storage

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

### 4. API Client Pattern

```typescript
// Centralized API client with:
// - Base URL configuration
// - Token injection
// - Error handling
// - Response parsing
```

---

## 💻 Code to Type & Understand

### Step 1: Create React App

```bash
npx create-react-app finance-tracker-frontend --template typescript
cd finance-tracker-frontend
npm install react-router-dom axios
```

### Step 2: Type Definitions

Create `src/types/index.ts`:

```typescript
// ============================================
// Type Definitions
// ============================================

// User types
export interface User {
    id: number;
    email: string;
    name: string;
    created_at: string;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterData {
    name: string;
    email: string;
    password: string;
}

export interface AuthResponse {
    user: User;
    token: string;
}

// Transaction types
export type TransactionType = 'income' | 'expense';

export interface Transaction {
    id: number;
    user_id: number;
    category_id: number;
    amount: number;
    description: string;
    date: string;
    type: TransactionType;
    category_name: string;
    category_icon: string;
    created_at: string;
}

export interface TransactionCreate {
    category_id: number;
    amount: number;
    description: string;
    date: string;
}

// Category types
export interface Category {
    id: number;
    name: string;
    type: TransactionType;
    icon: string;
    user_id: number | null;
}

// Report types
export interface DashboardSummary {
    totalIncome: number;
    totalExpense: number;
    balance: number;
    transactionCount: number;
    incomeChange: number;
    expenseChange: number;
}

export interface CategorySummary {
    category_id: number;
    category_name: string;
    category_icon: string;
    total: number;
    percentage: number;
}

export interface MonthlyTrend {
    month: string;
    income: number;
    expense: number;
    balance: number;
}

// API Response
export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
    meta?: {
        total: number;
        page: number;
        pageSize: number;
        totalPages: number;
    };
}
```

### Step 3: API Client

Create `src/api/client.ts`:

```typescript
// ============================================
// API Client
// ============================================

import axios, { AxiosInstance, AxiosError } from 'axios';
import { ApiResponse } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

class ApiClient {
    private client: AxiosInstance;

    constructor() {
        this.client = axios.create({
            baseURL: API_BASE_URL,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // Add token to requests
        this.client.interceptors.request.use((config) => {
            const token = localStorage.getItem('token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        });

        // Handle errors
        this.client.interceptors.response.use(
            (response) => response,
            (error: AxiosError) => {
                if (error.response?.status === 401) {
                    // Token expired or invalid
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    window.location.href = '/login';
                }
                return Promise.reject(error);
            }
        );
    }

    // Set token
    setToken(token: string | null): void {
        if (token) {
            localStorage.setItem('token', token);
        } else {
            localStorage.removeItem('token');
        }
    }

    // GET request
    async get<T>(url: string, params?: object): Promise<ApiResponse<T>> {
        const response = await this.client.get<ApiResponse<T>>(url, { params });
        return response.data;
    }

    // POST request
    async post<T>(url: string, data?: object): Promise<ApiResponse<T>> {
        const response = await this.client.post<ApiResponse<T>>(url, data);
        return response.data;
    }

    // PUT request
    async put<T>(url: string, data?: object): Promise<ApiResponse<T>> {
        const response = await this.client.put<ApiResponse<T>>(url, data);
        return response.data;
    }

    // DELETE request
    async delete<T>(url: string): Promise<ApiResponse<T>> {
        const response = await this.client.delete<ApiResponse<T>>(url);
        return response.data;
    }
}

export default new ApiClient();
```

### Step 4: Auth API

Create `src/api/auth.ts`:

```typescript
// ============================================
// Auth API
// ============================================

import api from './client';
import { AuthResponse, LoginCredentials, RegisterData, User } from '../types';

export const authApi = {
    // Register new user
    register: async (data: RegisterData): Promise<AuthResponse> => {
        const response = await api.post<AuthResponse>('/api/auth/register', data);
        if (response.success && response.data) {
            api.setToken(response.data.token);
            return response.data;
        }
        throw new Error(response.error || 'Registration failed');
    },

    // Login user
    login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
        const response = await api.post<AuthResponse>('/api/auth/login', credentials);
        if (response.success && response.data) {
            api.setToken(response.data.token);
            return response.data;
        }
        throw new Error(response.error || 'Login failed');
    },

    // Get current user profile
    getProfile: async (): Promise<User> => {
        const response = await api.get<User>('/api/auth/profile');
        if (response.success && response.data) {
            return response.data;
        }
        throw new Error(response.error || 'Failed to get profile');
    },

    // Logout
    logout: (): void => {
        api.setToken(null);
        localStorage.removeItem('user');
    },
};
```

### Step 5: Auth Context

Create `src/context/AuthContext.tsx`:

```tsx
// ============================================
// Auth Context
// ============================================

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, LoginCredentials, RegisterData, AuthResponse } from '../types';
import { authApi } from '../api/auth';

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (credentials: LoginCredentials) => Promise<void>;
    register: (data: RegisterData) => Promise<void>;
    logout: () => void;
    error: string | null;
    clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Check for existing session on mount
    useEffect(() => {
        const initAuth = async () => {
            const token = localStorage.getItem('token');
            const savedUser = localStorage.getItem('user');

            if (token && savedUser) {
                try {
                    // Verify token is still valid
                    const profile = await authApi.getProfile();
                    setUser(profile);
                    localStorage.setItem('user', JSON.stringify(profile));
                } catch (err) {
                    // Token invalid, clear storage
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                }
            }

            setIsLoading(false);
        };

        initAuth();
    }, []);

    const login = async (credentials: LoginCredentials): Promise<void> => {
        try {
            setError(null);
            setIsLoading(true);
            const response = await authApi.login(credentials);
            setUser(response.user);
            localStorage.setItem('user', JSON.stringify(response.user));
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Login failed';
            setError(message);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const register = async (data: RegisterData): Promise<void> => {
        try {
            setError(null);
            setIsLoading(true);
            const response = await authApi.register(data);
            setUser(response.user);
            localStorage.setItem('user', JSON.stringify(response.user));
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Registration failed';
            setError(message);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = (): void => {
        authApi.logout();
        setUser(null);
    };

    const clearError = (): void => {
        setError(null);
    };

    const value: AuthContextType = {
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        error,
        clearError,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
```

### Step 6: Protected Route Component

Create `src/components/ProtectedRoute.tsx`:

```tsx
// ============================================
// Protected Route Component
// ============================================

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

function ProtectedRoute({ children }: ProtectedRouteProps) {
    const { isAuthenticated, isLoading } = useAuth();
    const location = useLocation();

    if (isLoading) {
        return (
            <div style={styles.loading}>
                <div style={styles.spinner}></div>
                <p>Loading...</p>
            </div>
        );
    }

    if (!isAuthenticated) {
        // Redirect to login, saving the attempted URL
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return <>{children}</>;
}

const styles: { [key: string]: React.CSSProperties } = {
    loading: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
    },
    spinner: {
        width: '40px',
        height: '40px',
        border: '4px solid #f3f3f3',
        borderTop: '4px solid #3498db',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
    },
};

export default ProtectedRoute;
```

### Step 7: Login Page

Create `src/pages/Login.tsx`:

```tsx
// ============================================
// Login Page
// ============================================

import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Auth.css';

function Login() {
    const navigate = useNavigate();
    const location = useLocation();
    const { login, error, clearError, isLoading } = useAuth();

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

    const from = (location.state as any)?.from?.pathname || '/dashboard';

    const validate = (): boolean => {
        const errors: { [key: string]: string } = {};

        if (!formData.email) {
            errors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            errors.email = 'Invalid email format';
        }

        if (!formData.password) {
            errors.password = 'Password is required';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        
        if (formErrors[name]) {
            setFormErrors(prev => ({ ...prev, [name]: '' }));
        }
        if (error) {
            clearError();
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) return;

        try {
            await login(formData);
            navigate(from, { replace: true });
        } catch (err) {
            // Error is handled by context
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <h1>Welcome Back</h1>
                    <p>Login to your Finance Tracker account</p>
                </div>

                {error && (
                    <div className="auth-error">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="you@example.com"
                            className={formErrors.email ? 'error' : ''}
                            disabled={isLoading}
                        />
                        {formErrors.email && (
                            <span className="error-text">{formErrors.email}</span>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="••••••••"
                            className={formErrors.password ? 'error' : ''}
                            disabled={isLoading}
                        />
                        {formErrors.password && (
                            <span className="error-text">{formErrors.password}</span>
                        )}
                    </div>

                    <button 
                        type="submit" 
                        className="auth-button"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Logging in...' : 'Login'}
                    </button>
                </form>

                <div className="auth-footer">
                    <p>
                        Don't have an account?{' '}
                        <Link to="/register">Register</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Login;
```

### Step 8: Register Page

Create `src/pages/Register.tsx`:

```tsx
// ============================================
// Register Page
// ============================================

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Auth.css';

function Register() {
    const navigate = useNavigate();
    const { register, error, clearError, isLoading } = useAuth();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

    const validate = (): boolean => {
        const errors: { [key: string]: string } = {};

        if (!formData.name || formData.name.trim().length < 2) {
            errors.name = 'Name must be at least 2 characters';
        }

        if (!formData.email) {
            errors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            errors.email = 'Invalid email format';
        }

        if (!formData.password) {
            errors.password = 'Password is required';
        } else if (formData.password.length < 8) {
            errors.password = 'Password must be at least 8 characters';
        }

        if (formData.password !== formData.confirmPassword) {
            errors.confirmPassword = 'Passwords do not match';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        
        if (formErrors[name]) {
            setFormErrors(prev => ({ ...prev, [name]: '' }));
        }
        if (error) {
            clearError();
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) return;

        try {
            await register({
                name: formData.name,
                email: formData.email,
                password: formData.password,
            });
            navigate('/dashboard');
        } catch (err) {
            // Error is handled by context
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <h1>Create Account</h1>
                    <p>Start managing your finances today</p>
                </div>

                {error && (
                    <div className="auth-error">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label htmlFor="name">Full Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="John Doe"
                            className={formErrors.name ? 'error' : ''}
                            disabled={isLoading}
                        />
                        {formErrors.name && (
                            <span className="error-text">{formErrors.name}</span>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="you@example.com"
                            className={formErrors.email ? 'error' : ''}
                            disabled={isLoading}
                        />
                        {formErrors.email && (
                            <span className="error-text">{formErrors.email}</span>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="••••••••"
                            className={formErrors.password ? 'error' : ''}
                            disabled={isLoading}
                        />
                        {formErrors.password && (
                            <span className="error-text">{formErrors.password}</span>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="••••••••"
                            className={formErrors.confirmPassword ? 'error' : ''}
                            disabled={isLoading}
                        />
                        {formErrors.confirmPassword && (
                            <span className="error-text">{formErrors.confirmPassword}</span>
                        )}
                    </div>

                    <button 
                        type="submit" 
                        className="auth-button register"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Creating Account...' : 'Create Account'}
                    </button>
                </form>

                <div className="auth-footer">
                    <p>
                        Already have an account?{' '}
                        <Link to="/login">Login</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Register;
```

### Step 9: Auth Styles

Create `src/styles/Auth.css`:

```css
/* ============================================
   Auth Pages Styles
   ============================================ */

.auth-container {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: 20px;
}

.auth-card {
    background: white;
    border-radius: 16px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
    padding: 40px;
    width: 100%;
    max-width: 420px;
}

.auth-header {
    text-align: center;
    margin-bottom: 30px;
}

.auth-header h1 {
    margin: 0 0 10px 0;
    color: #333;
    font-size: 1.8rem;
}

.auth-header p {
    margin: 0;
    color: #666;
}

.auth-error {
    background: #fee;
    color: #c00;
    padding: 12px 16px;
    border-radius: 8px;
    margin-bottom: 20px;
    text-align: center;
    font-size: 0.9rem;
}

.auth-form {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.form-group label {
    font-weight: 600;
    color: #333;
    font-size: 0.9rem;
}

.form-group input {
    padding: 12px 16px;
    border: 2px solid #e0e0e0;
    border-radius: 8px;
    font-size: 1rem;
    transition: border-color 0.2s, box-shadow 0.2s;
}

.form-group input:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-group input.error {
    border-color: #e74c3c;
}

.form-group input:disabled {
    background: #f5f5f5;
    cursor: not-allowed;
}

.error-text {
    color: #e74c3c;
    font-size: 0.85rem;
}

.auth-button {
    padding: 14px;
    background: #667eea;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s, transform 0.1s;
}

.auth-button:hover:not(:disabled) {
    background: #5a6fd6;
}

.auth-button:active:not(:disabled) {
    transform: scale(0.98);
}

.auth-button:disabled {
    opacity: 0.7;
    cursor: not-allowed;
}

.auth-button.register {
    background: #2ecc71;
}

.auth-button.register:hover:not(:disabled) {
    background: #27ae60;
}

.auth-footer {
    text-align: center;
    margin-top: 25px;
    padding-top: 25px;
    border-top: 1px solid #eee;
}

.auth-footer p {
    margin: 0;
    color: #666;
}

.auth-footer a {
    color: #667eea;
    text-decoration: none;
    font-weight: 600;
}

.auth-footer a:hover {
    text-decoration: underline;
}

/* Spinner animation */
@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}
```

### Step 10: Update App.tsx

Update `src/App.tsx`:

```tsx
// ============================================
// App Component with Routing
// ============================================

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import './App.css';

// Placeholder for Dashboard (will be built tomorrow)
function Dashboard() {
    return <div>Dashboard - Coming Tomorrow!</div>;
}

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    {/* Public routes */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    {/* Protected routes */}
                    <Route
                        path="/dashboard"
                        element={
                            <ProtectedRoute>
                                <Dashboard />
                            </ProtectedRoute>
                        }
                    />

                    {/* Default redirect */}
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;
```

---

## ✍️ Exercises

### Exercise 1: Add "Remember Me" Feature
Modify the login page to:
- Add a "Remember me" checkbox
- Store token in localStorage (persistent) or sessionStorage (session only)
- Update AuthContext to handle both storage types

### Exercise 2: Add Password Strength Indicator
Add to the register page:
- Visual password strength meter
- Show requirements (length, uppercase, number, special char)
- Disable submit until password meets minimum strength

### Exercise 3: Add Forgot Password Page
Create `src/pages/ForgotPassword.tsx` that:
- Has an email input
- Shows success message after submission
- Links back to login page

---

## ❓ Quiz Questions

### Q1: Context vs Props
Why do we use React Context for auth instead of passing props?

**Your Answer**: 


### Q2: Token Storage
What are the pros and cons of storing JWT in localStorage vs cookies?

**Your Answer**: 


### Q3: Protected Routes
What happens if a user tries to access `/dashboard` without being logged in?

**Your Answer**: 


---

## 📝 Bonus Questions (Optional)

### B1: How would you implement automatic token refresh before expiration?

**Your Answer**: 


### B2: What is XSS and how does it relate to JWT storage?

**Your Answer**: 


---

## ✅ Day 31 Checklist

- [ ] Set up React project with TypeScript
- [ ] Create type definitions
- [ ] Create API client with axios
- [ ] Implement AuthContext
- [ ] Create ProtectedRoute component
- [ ] Build Login page with validation
- [ ] Build Register page with validation
- [ ] Add auth styles
- [ ] Test login flow
- [ ] Test registration flow
- [ ] Complete Exercise 1 (Remember Me)
- [ ] Complete Exercise 2 (Password Strength)
- [ ] Complete Exercise 3 (Forgot Password)
- [ ] Answer all quiz questions

---

## 🔗 Next Day Preview
Tomorrow you'll build the **Dashboard & Layout** - creating the main layout component and dashboard with summary cards.
