# Day 25: React Router & Forms

## 📚 What to Learn Today
- **Topics**: React Router, navigation, form handling, validation
- **Time**: ~45 minutes reading, ~40 minutes practice
- **Goal**: Build multi-page applications with routing and forms

---

## 📖 Key Concepts

### 1. What is React Router?
React Router enables navigation between different views/pages without page reload.

```
Traditional Web App          React SPA with Router
┌─────────────────┐         ┌─────────────────┐
│ Page 1 → Reload │         │ Component 1     │
│ Page 2 → Reload │         │ Component 2     │ No reload!
│ Page 3 → Reload │         │ Component 3     │
└─────────────────┘         └─────────────────┘
```

### 2. Core Router Components

```tsx
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

// BrowserRouter - Wraps your app
// Routes - Container for Route components
// Route - Maps URL path to component
// Link - Navigation without page reload
```

### 3. Basic Routing Setup

```tsx
<BrowserRouter>
    <nav>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
    </nav>
    
    <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/users/:id" element={<UserDetail />} />
        <Route path="*" element={<NotFound />} />
    </Routes>
</BrowserRouter>
```

### 4. Route Parameters

```tsx
// URL: /users/123
<Route path="/users/:id" element={<UserDetail />} />

// In UserDetail component:
import { useParams } from 'react-router-dom';

function UserDetail() {
    const { id } = useParams<{ id: string }>();
    return <div>User ID: {id}</div>;
}
```

### 5. Programmatic Navigation

```tsx
import { useNavigate } from 'react-router-dom';

function LoginForm() {
    const navigate = useNavigate();

    const handleSubmit = () => {
        // After successful login
        navigate('/dashboard');
        // Or go back
        navigate(-1);
    };
}
```

### 6. Form Validation Patterns

```tsx
// Validation rules object
const validationRules = {
    email: (value: string) => {
        if (!value) return 'Email is required';
        if (!/\S+@\S+\.\S+/.test(value)) return 'Invalid email';
        return null;
    },
    password: (value: string) => {
        if (!value) return 'Password is required';
        if (value.length < 8) return 'Password must be at least 8 characters';
        return null;
    }
};
```

---

## 💻 Code to Type & Understand

### Step 1: Install React Router

```bash
npm install react-router-dom
```

### Step 2: Create Page Components

Create `src/pages/Home.tsx`:

```tsx
// ============================================
// Home Page
// ============================================

import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Welcome to Finance Tracker</h1>
            <p style={styles.subtitle}>
                Manage your finances with ease
            </p>

            <div style={styles.features}>
                <div style={styles.feature}>
                    <span style={styles.icon}>💰</span>
                    <h3>Track Income</h3>
                    <p>Record all your income sources</p>
                </div>
                <div style={styles.feature}>
                    <span style={styles.icon}>💸</span>
                    <h3>Track Expenses</h3>
                    <p>Monitor where your money goes</p>
                </div>
                <div style={styles.feature}>
                    <span style={styles.icon}>📊</span>
                    <h3>View Reports</h3>
                    <p>Visualize your financial data</p>
                </div>
            </div>

            <div style={styles.cta}>
                <Link to="/register" style={styles.primaryButton}>
                    Get Started
                </Link>
                <Link to="/login" style={styles.secondaryButton}>
                    Login
                </Link>
            </div>
        </div>
    );
}

const styles: { [key: string]: React.CSSProperties } = {
    container: {
        textAlign: 'center',
        padding: '60px 20px',
    },
    title: {
        fontSize: '3rem',
        color: '#333',
        marginBottom: '10px',
    },
    subtitle: {
        fontSize: '1.2rem',
        color: '#666',
        marginBottom: '50px',
    },
    features: {
        display: 'flex',
        justifyContent: 'center',
        gap: '30px',
        flexWrap: 'wrap',
        marginBottom: '50px',
    },
    feature: {
        backgroundColor: '#fff',
        padding: '30px',
        borderRadius: '12px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
        width: '200px',
    },
    icon: {
        fontSize: '3rem',
    },
    cta: {
        display: 'flex',
        justifyContent: 'center',
        gap: '15px',
    },
    primaryButton: {
        padding: '15px 40px',
        backgroundColor: '#3498db',
        color: 'white',
        textDecoration: 'none',
        borderRadius: '8px',
        fontWeight: 'bold',
        fontSize: '1.1rem',
    },
    secondaryButton: {
        padding: '15px 40px',
        backgroundColor: 'transparent',
        color: '#3498db',
        textDecoration: 'none',
        borderRadius: '8px',
        fontWeight: 'bold',
        fontSize: '1.1rem',
        border: '2px solid #3498db',
    },
};

export default Home;
```

Create `src/pages/Login.tsx`:

```tsx
// ============================================
// Login Page with Form Validation
// ============================================

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

interface FormData {
    email: string;
    password: string;
}

interface FormErrors {
    email?: string;
    password?: string;
    general?: string;
}

function Login() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState<FormData>({
        email: '',
        password: '',
    });
    const [errors, setErrors] = useState<FormErrors>({});
    const [isLoading, setIsLoading] = useState(false);

    const validate = (): boolean => {
        const newErrors: FormErrors = {};

        // Email validation
        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email';
        }

        // Password validation
        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        
        // Clear error when user types
        if (errors[name as keyof FormErrors]) {
            setErrors(prev => ({ ...prev, [name]: undefined }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) return;

        setIsLoading(true);
        setErrors({});

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Simulate successful login
            if (formData.email === 'test@test.com' && formData.password === 'password123') {
                localStorage.setItem('token', 'fake-jwt-token');
                navigate('/dashboard');
            } else {
                setErrors({ general: 'Invalid email or password' });
            }
        } catch (error) {
            setErrors({ general: 'An error occurred. Please try again.' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.formCard}>
                <h1 style={styles.title}>Login</h1>
                <p style={styles.subtitle}>Welcome back! Please login to continue.</p>

                {errors.general && (
                    <div style={styles.errorBanner}>{errors.general}</div>
                )}

                <form onSubmit={handleSubmit}>
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="you@example.com"
                            style={{
                                ...styles.input,
                                borderColor: errors.email ? '#e74c3c' : '#ddd',
                            }}
                        />
                        {errors.email && (
                            <span style={styles.errorText}>{errors.email}</span>
                        )}
                    </div>

                    <div style={styles.formGroup}>
                        <label style={styles.label}>Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="••••••••"
                            style={{
                                ...styles.input,
                                borderColor: errors.password ? '#e74c3c' : '#ddd',
                            }}
                        />
                        {errors.password && (
                            <span style={styles.errorText}>{errors.password}</span>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        style={{
                            ...styles.submitButton,
                            opacity: isLoading ? 0.7 : 1,
                        }}
                    >
                        {isLoading ? 'Logging in...' : 'Login'}
                    </button>
                </form>

                <p style={styles.footer}>
                    Don't have an account?{' '}
                    <Link to="/register" style={styles.link}>Register</Link>
                </p>

                <p style={styles.hint}>
                    Hint: test@test.com / password123
                </p>
            </div>
        </div>
    );
}

const styles: { [key: string]: React.CSSProperties } = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 'calc(100vh - 100px)',
        padding: '20px',
    },
    formCard: {
        backgroundColor: '#fff',
        padding: '40px',
        borderRadius: '12px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        width: '100%',
        maxWidth: '400px',
    },
    title: {
        margin: '0 0 10px 0',
        color: '#333',
        textAlign: 'center',
    },
    subtitle: {
        margin: '0 0 30px 0',
        color: '#666',
        textAlign: 'center',
    },
    errorBanner: {
        backgroundColor: '#fee',
        color: '#c00',
        padding: '12px',
        borderRadius: '8px',
        marginBottom: '20px',
        textAlign: 'center',
    },
    formGroup: {
        marginBottom: '20px',
    },
    label: {
        display: 'block',
        marginBottom: '8px',
        fontWeight: 'bold',
        color: '#333',
    },
    input: {
        width: '100%',
        padding: '12px',
        fontSize: '1rem',
        border: '2px solid #ddd',
        borderRadius: '8px',
        boxSizing: 'border-box',
        transition: 'border-color 0.2s',
    },
    errorText: {
        color: '#e74c3c',
        fontSize: '0.85rem',
        marginTop: '5px',
        display: 'block',
    },
    submitButton: {
        width: '100%',
        padding: '14px',
        fontSize: '1rem',
        fontWeight: 'bold',
        backgroundColor: '#3498db',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        marginTop: '10px',
    },
    footer: {
        textAlign: 'center',
        marginTop: '20px',
        color: '#666',
    },
    link: {
        color: '#3498db',
        textDecoration: 'none',
        fontWeight: 'bold',
    },
    hint: {
        textAlign: 'center',
        marginTop: '15px',
        color: '#999',
        fontSize: '0.85rem',
    },
};

export default Login;
```

Create `src/pages/Register.tsx`:

```tsx
// ============================================
// Register Page with Complex Validation
// ============================================

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

interface FormData {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    agreeToTerms: boolean;
}

interface FormErrors {
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    agreeToTerms?: string;
}

function Register() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState<FormData>({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        agreeToTerms: false,
    });
    const [errors, setErrors] = useState<FormErrors>({});
    const [isLoading, setIsLoading] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState(0);

    const calculatePasswordStrength = (password: string): number => {
        let strength = 0;
        if (password.length >= 8) strength++;
        if (/[a-z]/.test(password)) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^a-zA-Z0-9]/.test(password)) strength++;
        return strength;
    };

    const validate = (): boolean => {
        const newErrors: FormErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        } else if (formData.name.length < 2) {
            newErrors.name = 'Name must be at least 2 characters';
        }

        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
        } else if (passwordStrength < 3) {
            newErrors.password = 'Password is too weak';
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password';
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        if (!formData.agreeToTerms) {
            newErrors.agreeToTerms = 'You must agree to the terms';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        const newValue = type === 'checkbox' ? checked : value;

        setFormData(prev => ({ ...prev, [name]: newValue }));

        if (name === 'password') {
            setPasswordStrength(calculatePasswordStrength(value));
        }

        if (errors[name as keyof FormErrors]) {
            setErrors(prev => ({ ...prev, [name]: undefined }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) return;

        setIsLoading(true);

        try {
            await new Promise(resolve => setTimeout(resolve, 1500));
            alert('Registration successful! Please login.');
            navigate('/login');
        } catch (error) {
            alert('Registration failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const getStrengthColor = () => {
        if (passwordStrength <= 1) return '#e74c3c';
        if (passwordStrength <= 2) return '#f39c12';
        if (passwordStrength <= 3) return '#f1c40f';
        return '#2ecc71';
    };

    const getStrengthText = () => {
        if (passwordStrength <= 1) return 'Weak';
        if (passwordStrength <= 2) return 'Fair';
        if (passwordStrength <= 3) return 'Good';
        return 'Strong';
    };

    return (
        <div style={styles.container}>
            <div style={styles.formCard}>
                <h1 style={styles.title}>Create Account</h1>
                <p style={styles.subtitle}>Start managing your finances today</p>

                <form onSubmit={handleSubmit}>
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Full Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="John Doe"
                            style={{
                                ...styles.input,
                                borderColor: errors.name ? '#e74c3c' : '#ddd',
                            }}
                        />
                        {errors.name && (
                            <span style={styles.errorText}>{errors.name}</span>
                        )}
                    </div>

                    <div style={styles.formGroup}>
                        <label style={styles.label}>Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="you@example.com"
                            style={{
                                ...styles.input,
                                borderColor: errors.email ? '#e74c3c' : '#ddd',
                            }}
                        />
                        {errors.email && (
                            <span style={styles.errorText}>{errors.email}</span>
                        )}
                    </div>

                    <div style={styles.formGroup}>
                        <label style={styles.label}>Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="••••••••"
                            style={{
                                ...styles.input,
                                borderColor: errors.password ? '#e74c3c' : '#ddd',
                            }}
                        />
                        {formData.password && (
                            <div style={styles.strengthContainer}>
                                <div style={styles.strengthBar}>
                                    <div style={{
                                        ...styles.strengthFill,
                                        width: `${(passwordStrength / 5) * 100}%`,
                                        backgroundColor: getStrengthColor(),
                                    }} />
                                </div>
                                <span style={{ color: getStrengthColor(), fontSize: '0.85rem' }}>
                                    {getStrengthText()}
                                </span>
                            </div>
                        )}
                        {errors.password && (
                            <span style={styles.errorText}>{errors.password}</span>
                        )}
                    </div>

                    <div style={styles.formGroup}>
                        <label style={styles.label}>Confirm Password</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="••••••••"
                            style={{
                                ...styles.input,
                                borderColor: errors.confirmPassword ? '#e74c3c' : '#ddd',
                            }}
                        />
                        {errors.confirmPassword && (
                            <span style={styles.errorText}>{errors.confirmPassword}</span>
                        )}
                    </div>

                    <div style={styles.checkboxGroup}>
                        <input
                            type="checkbox"
                            name="agreeToTerms"
                            checked={formData.agreeToTerms}
                            onChange={handleChange}
                            id="terms"
                        />
                        <label htmlFor="terms" style={styles.checkboxLabel}>
                            I agree to the Terms of Service and Privacy Policy
                        </label>
                    </div>
                    {errors.agreeToTerms && (
                        <span style={styles.errorText}>{errors.agreeToTerms}</span>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        style={{
                            ...styles.submitButton,
                            opacity: isLoading ? 0.7 : 1,
                        }}
                    >
                        {isLoading ? 'Creating Account...' : 'Create Account'}
                    </button>
                </form>

                <p style={styles.footer}>
                    Already have an account?{' '}
                    <Link to="/login" style={styles.link}>Login</Link>
                </p>
            </div>
        </div>
    );
}

const styles: { [key: string]: React.CSSProperties } = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 'calc(100vh - 100px)',
        padding: '20px',
    },
    formCard: {
        backgroundColor: '#fff',
        padding: '40px',
        borderRadius: '12px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        width: '100%',
        maxWidth: '450px',
    },
    title: {
        margin: '0 0 10px 0',
        color: '#333',
        textAlign: 'center',
    },
    subtitle: {
        margin: '0 0 30px 0',
        color: '#666',
        textAlign: 'center',
    },
    formGroup: {
        marginBottom: '20px',
    },
    label: {
        display: 'block',
        marginBottom: '8px',
        fontWeight: 'bold',
        color: '#333',
    },
    input: {
        width: '100%',
        padding: '12px',
        fontSize: '1rem',
        border: '2px solid #ddd',
        borderRadius: '8px',
        boxSizing: 'border-box',
    },
    errorText: {
        color: '#e74c3c',
        fontSize: '0.85rem',
        marginTop: '5px',
        display: 'block',
    },
    strengthContainer: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        marginTop: '8px',
    },
    strengthBar: {
        flex: 1,
        height: '6px',
        backgroundColor: '#eee',
        borderRadius: '3px',
        overflow: 'hidden',
    },
    strengthFill: {
        height: '100%',
        transition: 'width 0.3s, background-color 0.3s',
    },
    checkboxGroup: {
        display: 'flex',
        alignItems: 'flex-start',
        gap: '10px',
        marginBottom: '20px',
    },
    checkboxLabel: {
        color: '#666',
        fontSize: '0.9rem',
        lineHeight: '1.4',
    },
    submitButton: {
        width: '100%',
        padding: '14px',
        fontSize: '1rem',
        fontWeight: 'bold',
        backgroundColor: '#2ecc71',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
    },
    footer: {
        textAlign: 'center',
        marginTop: '20px',
        color: '#666',
    },
    link: {
        color: '#3498db',
        textDecoration: 'none',
        fontWeight: 'bold',
    },
};

export default Register;
```

Create `src/pages/Dashboard.tsx`:

```tsx
// ============================================
// Dashboard Page (Protected)
// ============================================

import React from 'react';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h1>Dashboard</h1>
                <button onClick={handleLogout} style={styles.logoutButton}>
                    Logout
                </button>
            </div>

            <div style={styles.stats}>
                <div style={styles.statCard}>
                    <span style={styles.statIcon}>💰</span>
                    <h3>Income</h3>
                    <p style={styles.statValue}>$5,240</p>
                </div>
                <div style={styles.statCard}>
                    <span style={styles.statIcon}>💸</span>
                    <h3>Expenses</h3>
                    <p style={{ ...styles.statValue, color: '#e74c3c' }}>$3,120</p>
                </div>
                <div style={styles.statCard}>
                    <span style={styles.statIcon}>📊</span>
                    <h3>Balance</h3>
                    <p style={{ ...styles.statValue, color: '#2ecc71' }}>$2,120</p>
                </div>
            </div>

            <div style={styles.content}>
                <h2>Recent Transactions</h2>
                <p>Your transaction history will appear here...</p>
            </div>
        </div>
    );
}

const styles: { [key: string]: React.CSSProperties } = {
    container: {
        padding: '20px',
        maxWidth: '1000px',
        margin: '0 auto',
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px',
    },
    logoutButton: {
        padding: '10px 20px',
        backgroundColor: '#e74c3c',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontWeight: 'bold',
    },
    stats: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px',
        marginBottom: '30px',
    },
    statCard: {
        backgroundColor: '#fff',
        padding: '25px',
        borderRadius: '12px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        textAlign: 'center',
    },
    statIcon: {
        fontSize: '2.5rem',
    },
    statValue: {
        fontSize: '2rem',
        fontWeight: 'bold',
        color: '#333',
        margin: 0,
    },
    content: {
        backgroundColor: '#fff',
        padding: '25px',
        borderRadius: '12px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    },
};

export default Dashboard;
```

Create `src/pages/NotFound.tsx`:

```tsx
// ============================================
// 404 Not Found Page
// ============================================

import React from 'react';
import { Link } from 'react-router-dom';

function NotFound() {
    return (
        <div style={styles.container}>
            <h1 style={styles.code}>404</h1>
            <h2 style={styles.title}>Page Not Found</h2>
            <p style={styles.message}>
                The page you're looking for doesn't exist or has been moved.
            </p>
            <Link to="/" style={styles.button}>
                Go Home
            </Link>
        </div>
    );
}

const styles: { [key: string]: React.CSSProperties } = {
    container: {
        textAlign: 'center',
        padding: '100px 20px',
    },
    code: {
        fontSize: '8rem',
        color: '#ddd',
        margin: 0,
    },
    title: {
        color: '#333',
        marginBottom: '10px',
    },
    message: {
        color: '#666',
        marginBottom: '30px',
    },
    button: {
        display: 'inline-block',
        padding: '12px 30px',
        backgroundColor: '#3498db',
        color: 'white',
        textDecoration: 'none',
        borderRadius: '8px',
        fontWeight: 'bold',
    },
};

export default NotFound;
```

### Step 3: Create Navigation Component

Create `src/components/Navbar.tsx`:

```tsx
// ============================================
// Navigation Bar
// ============================================

import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function Navbar() {
    const location = useLocation();
    const isLoggedIn = localStorage.getItem('token');

    const isActive = (path: string) => location.pathname === path;

    return (
        <nav style={styles.nav}>
            <Link to="/" style={styles.logo}>
                💰 Finance Tracker
            </Link>

            <div style={styles.links}>
                <Link
                    to="/"
                    style={{
                        ...styles.link,
                        color: isActive('/') ? '#3498db' : '#666',
                    }}
                >
                    Home
                </Link>

                {isLoggedIn ? (
                    <Link
                        to="/dashboard"
                        style={{
                            ...styles.link,
                            color: isActive('/dashboard') ? '#3498db' : '#666',
                        }}
                    >
                        Dashboard
                    </Link>
                ) : (
                    <>
                        <Link
                            to="/login"
                            style={{
                                ...styles.link,
                                color: isActive('/login') ? '#3498db' : '#666',
                            }}
                        >
                            Login
                        </Link>
                        <Link to="/register" style={styles.registerButton}>
                            Register
                        </Link>
                    </>
                )}
            </div>
        </nav>
    );
}

const styles: { [key: string]: React.CSSProperties } = {
    nav: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '15px 30px',
        backgroundColor: '#fff',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    },
    logo: {
        fontSize: '1.5rem',
        fontWeight: 'bold',
        color: '#333',
        textDecoration: 'none',
    },
    links: {
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
    },
    link: {
        textDecoration: 'none',
        fontWeight: '500',
        transition: 'color 0.2s',
    },
    registerButton: {
        padding: '10px 20px',
        backgroundColor: '#3498db',
        color: 'white',
        textDecoration: 'none',
        borderRadius: '6px',
        fontWeight: 'bold',
    },
};

export default Navbar;
```

### Step 4: Set Up App with Router

Update `src/App.tsx`:

```tsx
// ============================================
// DAY 25 - React Router & Forms
// ============================================

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';

// Components
import Navbar from './components/Navbar';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';

function App() {
    return (
        <BrowserRouter>
            <div style={styles.app}>
                <Navbar />
                <main style={styles.main}>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </main>
            </div>
        </BrowserRouter>
    );
}

const styles: { [key: string]: React.CSSProperties } = {
    app: {
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
    },
    main: {
        minHeight: 'calc(100vh - 70px)',
    },
};

export default App;
```

---

## ✍️ Exercises

### Exercise 1: Protected Route Component
Create `src/components/ProtectedRoute.tsx` that:
- Checks if user is logged in (has token in localStorage)
- Redirects to login page if not authenticated
- Renders children if authenticated
- Use it to wrap the Dashboard route

### Exercise 2: User Profile Page
Create `src/pages/Profile.tsx` that:
- Has a route parameter for user ID (`/profile/:id`)
- Fetches user data based on the ID
- Displays user information
- Has an edit form to update profile

### Exercise 3: Search with Query Parameters
Create `src/pages/Search.tsx` that:
- Uses URL query parameters (`/search?q=keyword`)
- Reads the query parameter using `useSearchParams`
- Displays search results based on the query
- Updates URL when search input changes

---

## ❓ Quiz Questions

### Q1: Link vs anchor tag
What's the difference between React Router's `<Link>` and a regular `<a>` tag?

**Your Answer**: 


### Q2: useNavigate
When would you use `useNavigate` instead of `<Link>`?

**Your Answer**: 


### Q3: Route Parameters
How do you define and access route parameters (like `/users/:id`)?

**Your Answer**: 


---

## 📝 Bonus Questions (Optional)

### B1: What is the difference between `useParams` and `useSearchParams`?

**Your Answer**: 


### B2: How would you implement a "remember me" feature in the login form?

**Your Answer**: 


---

## ✅ Day 25 Checklist

- [ ] Install and set up React Router
- [ ] Create multiple page components
- [ ] Set up Routes and navigation
- [ ] Use Link for navigation
- [ ] Use useNavigate for programmatic navigation
- [ ] Implement form validation
- [ ] Create password strength indicator
- [ ] Handle form submission
- [ ] Create Login page
- [ ] Create Register page
- [ ] Create Dashboard page
- [ ] Complete Exercise 1 (ProtectedRoute)
- [ ] Complete Exercise 2 (Profile)
- [ ] Complete Exercise 3 (Search)
- [ ] Answer all quiz questions

---

## 🔗 Next Day Preview
Tomorrow you'll start the **Finance Tracker Backend** project - setting up the project structure and designing the database schema.
