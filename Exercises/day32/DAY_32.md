# Day 32: Dashboard & Layout

## 📚 What to Learn Today
- **Topics**: Layout component, dashboard, summary cards, recent transactions
- **Time**: ~45 minutes reading, ~45 minutes practice
- **Goal**: Build dashboard showing income, expense, and balance with Tailwind CSS

---

## 📖 Key Concepts

### 1. Layout Pattern

```
┌─────────────────────────────────────────────┐
│                  Navbar                     │
├─────────┬───────────────────────────────────┤
│         │                                   │
│ Sidebar │         Main Content              │
│         │                                   │
│         │                                   │
└─────────┴───────────────────────────────────┘
```

### 2. Dashboard Components

```
Dashboard:
├── Summary Cards (Income, Expense, Balance)
├── Recent Transactions
├── Quick Actions
└── Charts (Preview - built in Day 34)
```

### 3. Data Fetching Pattern

```typescript
function useDashboard() {
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        fetchData()
    }, [])

    return { data, loading, error, refetch }
}
```

### 4. Responsive Design with Tailwind

```
Mobile First:
- Base styles for mobile
- sm: (640px) - Small tablets
- md: (768px) - Tablets
- lg: (1024px) - Laptops
- xl: (1280px) - Desktops
```

---

## 💻 Code to Type & Understand

### Step 1: Reports API

Create `src/api/reports.ts`:

```typescript
// ============================================
// Reports API
// ============================================

import api from './client'
import { DashboardSummary, CategorySummary, MonthlyTrend } from '../types'

export const reportsApi = {
    getDashboard: async (): Promise<DashboardSummary> => {
        const response = await api.get<DashboardSummary>('/api/v1/reports/dashboard')
        if (response.success && response.data) {
            return response.data
        }
        throw new Error(response.error || 'Failed to fetch dashboard')
    },

    getMonthlyTrends: async (months: number = 12): Promise<MonthlyTrend[]> => {
        const response = await api.get<MonthlyTrend[]>('/api/v1/reports/monthly', { months })
        if (response.success && response.data) {
            return response.data
        }
        throw new Error(response.error || 'Failed to fetch trends')
    },

    getCategoryBreakdown: async (startDate?: string, endDate?: string): Promise<{
        income: CategorySummary[]
        expense: CategorySummary[]
    }> => {
        const response = await api.get<{
            income: CategorySummary[]
            expense: CategorySummary[]
        }>('/api/v1/reports/categories', { startDate, endDate })
        if (response.success && response.data) {
            return response.data
        }
        throw new Error(response.error || 'Failed to fetch categories')
    },
}
```

### Step 2: Transactions API

Create `src/api/transactions.ts`:

```typescript
// ============================================
// Transactions API
// ============================================

import api from './client'
import { Transaction, TransactionCreate } from '../types'

interface TransactionListResponse {
    transactions: Transaction[]
    pagination: {
        page: number
        limit: number
        total: number
        totalPages: number
    }
}

export const transactionsApi = {
    getAll: async (params?: {
        page?: number
        limit?: number
        startDate?: string
        endDate?: string
        type?: 'income' | 'expense'
        categoryId?: string
    }): Promise<TransactionListResponse> => {
        const response = await api.get<Transaction[]>('/api/v1/transactions', params)
        if (response.success && response.data) {
            return {
                transactions: response.data,
                pagination: (response as any).pagination || {
                    page: 1,
                    limit: 20,
                    total: response.data.length,
                    totalPages: 1
                }
            }
        }
        throw new Error(response.error || 'Failed to fetch transactions')
    },

    getById: async (id: string): Promise<Transaction> => {
        const response = await api.get<Transaction>(`/api/v1/transactions/${id}`)
        if (response.success && response.data) {
            return response.data
        }
        throw new Error(response.error || 'Transaction not found')
    },

    create: async (data: TransactionCreate): Promise<Transaction> => {
        const response = await api.post<Transaction>('/api/v1/transactions', data)
        if (response.success && response.data) {
            return response.data
        }
        throw new Error(response.error || 'Failed to create transaction')
    },

    update: async (id: string, data: Partial<TransactionCreate>): Promise<Transaction> => {
        const response = await api.put<Transaction>(`/api/v1/transactions/${id}`, data)
        if (response.success && response.data) {
            return response.data
        }
        throw new Error(response.error || 'Failed to update transaction')
    },

    delete: async (id: string): Promise<void> => {
        const response = await api.delete(`/api/v1/transactions/${id}`)
        if (!response.success) {
            throw new Error(response.error || 'Failed to delete transaction')
        }
    },
}
```

### Step 3: Layout Component

Create `src/components/Layout.tsx`:

```tsx
// ============================================
// Layout Component
// ============================================

import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

interface LayoutProps {
    children: React.ReactNode
}

const navigation = [
    { name: 'Dashboard', path: '/dashboard', icon: '📊' },
    { name: 'Transactions', path: '/transactions', icon: '💳' },
    { name: 'Reports', path: '/reports', icon: '📈' },
]

export function Layout({ children }: LayoutProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const { user, logout } = useAuth()
    const location = useLocation()
    const navigate = useNavigate()

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Mobile sidebar backdrop */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-gray-600 bg-opacity-50 z-20 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out lg:translate-x-0 ${
                    sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="flex items-center h-16 px-6 border-b border-gray-200">
                        <span className="text-xl font-bold text-primary-600">💰 Finance</span>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-4 py-4 space-y-1">
                        {navigation.map((item) => {
                            const isActive = location.pathname === item.path
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                                        isActive
                                            ? 'bg-primary-50 text-primary-700'
                                            : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                                    onClick={() => setSidebarOpen(false)}
                                >
                                    <span className="mr-3">{item.icon}</span>
                                    <span className="font-medium">{item.name}</span>
                                </Link>
                            )
                        })}
                    </nav>

                    {/* User section */}
                    <div className="p-4 border-t border-gray-200">
                        <div className="flex items-center">
                            <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                                <span className="text-primary-600 font-medium">
                                    {user?.full_name?.charAt(0).toUpperCase()}
                                </span>
                            </div>
                            <div className="ml-3 flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                    {user?.full_name}
                                </p>
                                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="mt-4 w-full btn btn-secondary text-sm"
                        >
                            Sign out
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main content */}
            <div className="lg:pl-64">
                {/* Top navbar */}
                <header className="sticky top-0 z-10 bg-white border-b border-gray-200">
                    <div className="flex items-center justify-between h-16 px-4 lg:px-8">
                        <button
                            className="lg:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100"
                            onClick={() => setSidebarOpen(true)}
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>

                        <div className="flex-1 lg:flex-none" />

                        <div className="flex items-center space-x-4">
                            <span className="text-sm text-gray-600 hidden sm:block">
                                {new Date().toLocaleDateString('en-US', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </span>
                        </div>
                    </div>
                </header>

                {/* Page content */}
                <main className="p-4 lg:p-8">{children}</main>
            </div>
        </div>
    )
}
```

### Step 4: Summary Card Component

Create `src/components/SummaryCard.tsx`:

```tsx
// ============================================
// Summary Card Component
// ============================================

interface SummaryCardProps {
    title: string
    value: number
    change?: number
    type: 'income' | 'expense' | 'balance'
    loading?: boolean
}

export function SummaryCard({ title, value, change, type, loading }: SummaryCardProps) {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount)
    }

    const getColors = () => {
        switch (type) {
            case 'income':
                return {
                    bg: 'bg-green-50',
                    text: 'text-green-600',
                    icon: '📈',
                }
            case 'expense':
                return {
                    bg: 'bg-red-50',
                    text: 'text-red-600',
                    icon: '📉',
                }
            case 'balance':
                return {
                    bg: 'bg-blue-50',
                    text: 'text-blue-600',
                    icon: '💰',
                }
        }
    }

    const colors = getColors()

    if (loading) {
        return (
            <div className="card animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-24 mb-4"></div>
                <div className="h-8 bg-gray-200 rounded w-32"></div>
            </div>
        )
    }

    return (
        <div className="card">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-500">{title}</p>
                    <p className={`text-2xl font-bold mt-1 ${colors.text}`}>
                        {formatCurrency(value)}
                    </p>
                    {change !== undefined && (
                        <p className={`text-sm mt-2 ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {change >= 0 ? '↑' : '↓'} {Math.abs(change).toFixed(1)}% from last month
                        </p>
                    )}
                </div>
                <div className={`w-12 h-12 rounded-full ${colors.bg} flex items-center justify-center`}>
                    <span className="text-2xl">{colors.icon}</span>
                </div>
            </div>
        </div>
    )
}
```

### Step 5: Recent Transactions Component

Create `src/components/RecentTransactions.tsx`:

```tsx
// ============================================
// Recent Transactions Component
// ============================================

import { Link } from 'react-router-dom'
import { Transaction } from '../types'

interface RecentTransactionsProps {
    transactions: Transaction[]
    loading?: boolean
}

export function RecentTransactions({ transactions, loading }: RecentTransactionsProps) {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount)
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
        })
    }

    if (loading) {
        return (
            <div className="card">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Recent Transactions</h3>
                </div>
                <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="animate-pulse flex items-center">
                            <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                            <div className="ml-4 flex-1">
                                <div className="h-4 bg-gray-200 rounded w-32"></div>
                                <div className="h-3 bg-gray-200 rounded w-24 mt-2"></div>
                            </div>
                            <div className="h-4 bg-gray-200 rounded w-20"></div>
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="card">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Recent Transactions</h3>
                <Link
                    to="/transactions"
                    className="text-sm text-primary-600 hover:text-primary-700"
                >
                    View all →
                </Link>
            </div>

            {transactions.length === 0 ? (
                <div className="text-center py-8">
                    <p className="text-gray-500">No transactions yet</p>
                    <Link
                        to="/transactions"
                        className="btn btn-primary mt-4 inline-block"
                    >
                        Add your first transaction
                    </Link>
                </div>
            ) : (
                <div className="space-y-3">
                    {transactions.map((transaction) => (
                        <div
                            key={transaction.id}
                            className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                                <span>{transaction.category_icon}</span>
                            </div>
                            <div className="ml-4 flex-1 min-w-0">
                                <p className="font-medium text-gray-900 truncate">
                                    {transaction.description || transaction.category_name}
                                </p>
                                <p className="text-sm text-gray-500">
                                    {transaction.category_name} • {formatDate(transaction.date)}
                                </p>
                            </div>
                            <p
                                className={`font-semibold ${
                                    transaction.type === 'income'
                                        ? 'text-green-600'
                                        : 'text-red-600'
                                }`}
                            >
                                {transaction.type === 'income' ? '+' : '-'}
                                {formatCurrency(transaction.amount)}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
```

### Step 6: Dashboard Page

Create `src/pages/Dashboard.tsx`:

```tsx
// ============================================
// Dashboard Page
// ============================================

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Layout } from '../components/Layout'
import { SummaryCard } from '../components/SummaryCard'
import { RecentTransactions } from '../components/RecentTransactions'
import { reportsApi } from '../api/reports'
import { transactionsApi } from '../api/transactions'
import { DashboardSummary, Transaction } from '../types'

export function Dashboard() {
    const [summary, setSummary] = useState<DashboardSummary | null>(null)
    const [transactions, setTransactions] = useState<Transaction[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        fetchDashboardData()
    }, [])

    const fetchDashboardData = async () => {
        try {
            setLoading(true)
            setError(null)

            const [summaryData, transactionsData] = await Promise.all([
                reportsApi.getDashboard(),
                transactionsApi.getAll({ limit: 5 })
            ])

            setSummary(summaryData)
            setTransactions(transactionsData.transactions)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load dashboard')
        } finally {
            setLoading(false)
        }
    }

    return (
        <Layout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                        <p className="text-gray-500 mt-1">
                            Overview of your finances this month
                        </p>
                    </div>
                    <Link
                        to="/transactions"
                        className="btn btn-primary mt-4 sm:mt-0"
                    >
                        + Add Transaction
                    </Link>
                </div>

                {/* Error message */}
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                        {error}
                        <button
                            onClick={fetchDashboardData}
                            className="ml-4 underline hover:no-underline"
                        >
                            Retry
                        </button>
                    </div>
                )}

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
                    <SummaryCard
                        title="Total Income"
                        value={summary?.totalIncome || 0}
                        change={summary?.monthlyChange.income}
                        type="income"
                        loading={loading}
                    />
                    <SummaryCard
                        title="Total Expenses"
                        value={summary?.totalExpense || 0}
                        change={summary?.monthlyChange.expense}
                        type="expense"
                        loading={loading}
                    />
                    <SummaryCard
                        title="Balance"
                        value={summary?.balance || 0}
                        type="balance"
                        loading={loading}
                    />
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Recent Transactions */}
                    <RecentTransactions
                        transactions={transactions}
                        loading={loading}
                    />

                    {/* Quick Actions */}
                    <div className="card">
                        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <Link
                                to="/transactions?type=income"
                                className="p-4 rounded-lg bg-green-50 hover:bg-green-100 transition-colors text-center"
                            >
                                <span className="text-2xl">💰</span>
                                <p className="mt-2 font-medium text-green-700">Add Income</p>
                            </Link>
                            <Link
                                to="/transactions?type=expense"
                                className="p-4 rounded-lg bg-red-50 hover:bg-red-100 transition-colors text-center"
                            >
                                <span className="text-2xl">💸</span>
                                <p className="mt-2 font-medium text-red-700">Add Expense</p>
                            </Link>
                            <Link
                                to="/reports"
                                className="p-4 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors text-center"
                            >
                                <span className="text-2xl">📊</span>
                                <p className="mt-2 font-medium text-blue-700">View Reports</p>
                            </Link>
                            <Link
                                to="/transactions"
                                className="p-4 rounded-lg bg-purple-50 hover:bg-purple-100 transition-colors text-center"
                            >
                                <span className="text-2xl">📋</span>
                                <p className="mt-2 font-medium text-purple-700">All Transactions</p>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Stats */}
                {summary && (
                    <div className="card">
                        <h3 className="text-lg font-semibold mb-4">This Month's Stats</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="text-center p-4 bg-gray-50 rounded-lg">
                                <p className="text-3xl font-bold text-gray-900">
                                    {summary.transactionCount}
                                </p>
                                <p className="text-sm text-gray-500 mt-1">Transactions</p>
                            </div>
                            <div className="text-center p-4 bg-gray-50 rounded-lg">
                                <p className="text-3xl font-bold text-green-600">
                                    {summary.monthlyChange.income >= 0 ? '+' : ''}
                                    {summary.monthlyChange.income.toFixed(0)}%
                                </p>
                                <p className="text-sm text-gray-500 mt-1">Income Change</p>
                            </div>
                            <div className="text-center p-4 bg-gray-50 rounded-lg">
                                <p className="text-3xl font-bold text-red-600">
                                    {summary.monthlyChange.expense >= 0 ? '+' : ''}
                                    {summary.monthlyChange.expense.toFixed(0)}%
                                </p>
                                <p className="text-sm text-gray-500 mt-1">Expense Change</p>
                            </div>
                            <div className="text-center p-4 bg-gray-50 rounded-lg">
                                <p className="text-3xl font-bold text-blue-600">
                                    {summary.totalIncome > 0
                                        ? ((summary.totalExpense / summary.totalIncome) * 100).toFixed(0)
                                        : 0}%
                                </p>
                                <p className="text-sm text-gray-500 mt-1">Savings Rate</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    )
}
```

### Step 7: Update App Routes

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
import { Dashboard } from './pages/Dashboard'

function Transactions() {
    return <div className="p-8"><h1>Transactions - Coming tomorrow!</h1></div>
}

function Reports() {
    return <div className="p-8"><h1>Reports - Coming in Day 34!</h1></div>
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
                    <Route
                        path="/transactions"
                        element={
                            <ProtectedRoute>
                                <Transactions />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/reports"
                        element={
                            <ProtectedRoute>
                                <Reports />
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

---

## ✍️ Exercises

### Exercise 1: Add Date Range Filter
Add a date range picker to the dashboard that:
- Allows selecting start and end dates
- Refetches summary data for the selected range
- Shows "This Month" / "Last Month" / "Custom" options

### Exercise 2: Add Loading Skeletons
Create a reusable `Skeleton` component that:
- Shows animated placeholder content
- Can be configured for different shapes (text, circle, rectangle)
- Matches the layout of actual content

### Exercise 3: Add Empty State
Create an empty state component for when:
- User has no transactions
- Shows helpful illustration
- Includes call-to-action button

---

## ❓ Quiz Questions

### Q1: Responsive Design
What does `grid-cols-1 md:grid-cols-3` mean in Tailwind CSS?

**Your Answer**: 


### Q2: Data Fetching
Why do we use `Promise.all()` to fetch dashboard data instead of sequential awaits?

**Your Answer**: 


### Q3: Component Structure
Why do we separate `SummaryCard` and `RecentTransactions` into their own components?

**Your Answer**: 


---

## 📝 Bonus Questions (Optional)

### B1: How would you implement real-time updates to the dashboard (e.g., when a new transaction is added)?

**Your Answer**: 


### B2: What performance optimizations could you add to the dashboard?

**Your Answer**: 


---

## ✅ Day 32 Checklist

- [ ] Create Reports API client
- [ ] Create Transactions API client
- [ ] Build Layout component with sidebar
- [ ] Build SummaryCard component
- [ ] Build RecentTransactions component
- [ ] Create Dashboard page
- [ ] Implement responsive design
- [ ] Add loading states
- [ ] Update App routes
- [ ] Complete Exercise 1 (Date Range Filter)
- [ ] Complete Exercise 2 (Loading Skeletons)
- [ ] Complete Exercise 3 (Empty State)
- [ ] Answer all quiz questions

---

## 🔗 Next Day Preview
Tomorrow you'll build **Transaction Management** - creating the transaction list, add/edit forms, and CRUD operations with Tailwind CSS.
