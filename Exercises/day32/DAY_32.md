# Day 32: Dashboard & Layout

## 📚 What to Learn Today
- **Topics**: Layout component, dashboard, summary cards
- **Time**: ~45 minutes reading, ~45 minutes practice
- **Goal**: Build dashboard showing income, expense, and balance

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
└── Charts (Preview)
```

### 3. Data Fetching Pattern

```typescript
// Custom hook for data fetching
function useDashboard() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    return { data, loading, error, refetch };
}
```

---

## 💻 Code to Type & Understand

### Step 1: Reports API

Create `src/api/reports.ts`:

```typescript
// ============================================
// Reports API
// ============================================

import api from './client';
import { DashboardSummary, CategorySummary, MonthlyTrend } from '../types';

export const reportsApi = {
    // Get dashboard summary
    getDashboard: async (): Promise<DashboardSummary> => {
        const response = await api.get<DashboardSummary>('/api/reports/dashboard');
        if (response.success && response.data) {
            return response.data;
        }
        throw new Error(response.error || 'Failed to fetch dashboard');
    },

    // Get monthly trends
    getMonthlyTrends: async (months: number = 12): Promise<MonthlyTrend[]> => {
        const response = await api.get<MonthlyTrend[]>('/api/reports/monthly', { months });
        if (response.success && response.data) {
            return response.data;
        }
        throw new Error(response.error || 'Failed to fetch trends');
    },

    // Get category breakdown
    getCategoryBreakdown: async (startDate?: string, endDate?: string): Promise<{
        income: CategorySummary[];
        expense: CategorySummary[];
    }> => {
        const response = await api.get<{
            income: CategorySummary[];
            expense: CategorySummary[];
        }>('/api/reports/categories', { startDate, endDate });
        if (response.success && response.data) {
            return response.data;
        }
        throw new Error(response.error || 'Failed to fetch categories');
    },

    // Get spending by category
    getSpending: async (startDate?: string, endDate?: string): Promise<CategorySummary[]> => {
        const response = await api.get<CategorySummary[]>('/api/reports/spending', { startDate, endDate });
        if (response.success && response.data) {
            return response.data;
        }
        throw new Error(response.error || 'Failed to fetch spending');
    },
};
```

### Step 2: Transactions API

Create `src/api/transactions.ts`:

```typescript
// ============================================
// Transactions API
// ============================================

import api from './client';
import { Transaction, TransactionCreate } from '../types';

interface TransactionListResponse {
    transactions: Transaction[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
}

interface TransactionFilters {
    startDate?: string;
    endDate?: string;
    type?: 'income' | 'expense';
    categoryId?: number;
    limit?: number;
    offset?: number;
}

export const transactionsApi = {
    // Get all transactions
    getAll: async (filters: TransactionFilters = {}): Promise<TransactionListResponse> => {
        const response = await api.get<Transaction[]>('/api/transactions', filters);
        if (response.success) {
            return {
                transactions: response.data || [],
                total: response.meta?.total || 0,
                page: response.meta?.page || 1,
                pageSize: response.meta?.pageSize || 20,
                totalPages: response.meta?.totalPages || 1,
            };
        }
        throw new Error(response.error || 'Failed to fetch transactions');
    },

    // Get recent transactions
    getRecent: async (limit: number = 5): Promise<Transaction[]> => {
        const response = await api.get<Transaction[]>('/api/transactions/recent', { limit });
        if (response.success && response.data) {
            return response.data;
        }
        throw new Error(response.error || 'Failed to fetch recent transactions');
    },

    // Get single transaction
    getById: async (id: number): Promise<Transaction> => {
        const response = await api.get<Transaction>(`/api/transactions/${id}`);
        if (response.success && response.data) {
            return response.data;
        }
        throw new Error(response.error || 'Transaction not found');
    },

    // Create transaction
    create: async (data: TransactionCreate): Promise<Transaction> => {
        const response = await api.post<Transaction>('/api/transactions', data);
        if (response.success && response.data) {
            return response.data;
        }
        throw new Error(response.error || 'Failed to create transaction');
    },

    // Update transaction
    update: async (id: number, data: Partial<TransactionCreate>): Promise<Transaction> => {
        const response = await api.put<Transaction>(`/api/transactions/${id}`, data);
        if (response.success && response.data) {
            return response.data;
        }
        throw new Error(response.error || 'Failed to update transaction');
    },

    // Delete transaction
    delete: async (id: number): Promise<void> => {
        const response = await api.delete(`/api/transactions/${id}`);
        if (!response.success) {
            throw new Error(response.error || 'Failed to delete transaction');
        }
    },
};
```

### Step 3: Layout Component

Create `src/components/Layout.tsx`:

```tsx
// ============================================
// Layout Component
// ============================================

import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Layout.css';

interface LayoutProps {
    children: React.ReactNode;
}

function Layout({ children }: LayoutProps) {
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navItems = [
        { path: '/dashboard', icon: '📊', label: 'Dashboard' },
        { path: '/transactions', icon: '💳', label: 'Transactions' },
        { path: '/reports', icon: '📈', label: 'Reports' },
        { path: '/settings', icon: '⚙️', label: 'Settings' },
    ];

    return (
        <div className="layout">
            {/* Sidebar */}
            <aside className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
                <div className="sidebar-header">
                    <h2>💰 Finance</h2>
                    <button 
                        className="sidebar-toggle"
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                    >
                        {sidebarOpen ? '◀' : '▶'}
                    </button>
                </div>

                <nav className="sidebar-nav">
                    {navItems.map(item => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
                        >
                            <span className="nav-icon">{item.icon}</span>
                            {sidebarOpen && <span className="nav-label">{item.label}</span>}
                        </Link>
                    ))}
                </nav>

                <div className="sidebar-footer">
                    {sidebarOpen && (
                        <div className="user-info">
                            <div className="user-avatar">
                                {user?.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="user-details">
                                <span className="user-name">{user?.name}</span>
                                <span className="user-email">{user?.email}</span>
                            </div>
                        </div>
                    )}
                    <button className="logout-button" onClick={handleLogout}>
                        <span>🚪</span>
                        {sidebarOpen && <span>Logout</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="main-content">
                {children}
            </main>
        </div>
    );
}

export default Layout;
```

### Step 4: Layout Styles

Create `src/styles/Layout.css`:

```css
/* ============================================
   Layout Styles
   ============================================ */

.layout {
    display: flex;
    min-height: 100vh;
    background: #f5f7fa;
}

/* Sidebar */
.sidebar {
    width: 250px;
    background: linear-gradient(180deg, #2c3e50 0%, #1a252f 100%);
    color: white;
    display: flex;
    flex-direction: column;
    transition: width 0.3s ease;
    position: fixed;
    height: 100vh;
    z-index: 100;
}

.sidebar.closed {
    width: 70px;
}

.sidebar-header {
    padding: 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.sidebar-header h2 {
    margin: 0;
    font-size: 1.3rem;
    white-space: nowrap;
    overflow: hidden;
}

.sidebar.closed .sidebar-header h2 {
    display: none;
}

.sidebar-toggle {
    background: rgba(255, 255, 255, 0.1);
    border: none;
    color: white;
    width: 30px;
    height: 30px;
    border-radius: 6px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
}

.sidebar-toggle:hover {
    background: rgba(255, 255, 255, 0.2);
}

/* Navigation */
.sidebar-nav {
    flex: 1;
    padding: 20px 10px;
    display: flex;
    flex-direction: column;
    gap: 5px;
}

.nav-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 15px;
    color: rgba(255, 255, 255, 0.7);
    text-decoration: none;
    border-radius: 8px;
    transition: all 0.2s;
}

.nav-item:hover {
    background: rgba(255, 255, 255, 0.1);
    color: white;
}

.nav-item.active {
    background: rgba(52, 152, 219, 0.3);
    color: white;
}

.nav-icon {
    font-size: 1.2rem;
    width: 24px;
    text-align: center;
}

.nav-label {
    white-space: nowrap;
}

.sidebar.closed .nav-label {
    display: none;
}

/* Sidebar Footer */
.sidebar-footer {
    padding: 15px;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.user-info {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 15px;
}

.user-avatar {
    width: 40px;
    height: 40px;
    background: #3498db;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: 1.1rem;
}

.user-details {
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

.user-name {
    font-weight: 600;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.user-email {
    font-size: 0.8rem;
    color: rgba(255, 255, 255, 0.6);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.logout-button {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    padding: 10px;
    background: rgba(231, 76, 60, 0.2);
    border: none;
    border-radius: 8px;
    color: #e74c3c;
    cursor: pointer;
    transition: background 0.2s;
}

.logout-button:hover {
    background: rgba(231, 76, 60, 0.3);
}

/* Main Content */
.main-content {
    flex: 1;
    margin-left: 250px;
    padding: 30px;
    transition: margin-left 0.3s ease;
}

.sidebar.closed + .main-content {
    margin-left: 70px;
}

/* Responsive */
@media (max-width: 768px) {
    .sidebar {
        width: 70px;
    }
    
    .sidebar .nav-label,
    .sidebar .user-info,
    .sidebar-header h2 {
        display: none;
    }
    
    .main-content {
        margin-left: 70px;
    }
}
```

### Step 5: Summary Card Component

Create `src/components/SummaryCard.tsx`:

```tsx
// ============================================
// Summary Card Component
// ============================================

import React from 'react';
import '../styles/SummaryCard.css';

interface SummaryCardProps {
    title: string;
    value: number;
    icon: string;
    type: 'income' | 'expense' | 'balance';
    change?: number;
    loading?: boolean;
}

function SummaryCard({ title, value, icon, type, change, loading }: SummaryCardProps) {
    const formatCurrency = (amount: number): string => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const getChangeColor = (): string => {
        if (change === undefined) return '';
        if (type === 'expense') {
            return change > 0 ? 'negative' : 'positive';
        }
        return change > 0 ? 'positive' : 'negative';
    };

    if (loading) {
        return (
            <div className={`summary-card ${type} loading`}>
                <div className="card-skeleton"></div>
            </div>
        );
    }

    return (
        <div className={`summary-card ${type}`}>
            <div className="card-icon">{icon}</div>
            <div className="card-content">
                <h3 className="card-title">{title}</h3>
                <p className="card-value">{formatCurrency(value)}</p>
                {change !== undefined && (
                    <span className={`card-change ${getChangeColor()}`}>
                        {change > 0 ? '↑' : '↓'} {Math.abs(change).toFixed(1)}%
                        <span className="change-label">vs last month</span>
                    </span>
                )}
            </div>
        </div>
    );
}

export default SummaryCard;
```

### Step 6: Summary Card Styles

Create `src/styles/SummaryCard.css`:

```css
/* ============================================
   Summary Card Styles
   ============================================ */

.summary-card {
    background: white;
    border-radius: 16px;
    padding: 24px;
    display: flex;
    align-items: flex-start;
    gap: 20px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
    transition: transform 0.2s, box-shadow 0.2s;
}

.summary-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12);
}

.card-icon {
    width: 56px;
    height: 56px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.8rem;
}

.summary-card.income .card-icon {
    background: rgba(46, 204, 113, 0.15);
}

.summary-card.expense .card-icon {
    background: rgba(231, 76, 60, 0.15);
}

.summary-card.balance .card-icon {
    background: rgba(52, 152, 219, 0.15);
}

.card-content {
    flex: 1;
}

.card-title {
    margin: 0 0 8px 0;
    font-size: 0.9rem;
    color: #666;
    font-weight: 500;
}

.card-value {
    margin: 0 0 8px 0;
    font-size: 1.8rem;
    font-weight: 700;
}

.summary-card.income .card-value {
    color: #2ecc71;
}

.summary-card.expense .card-value {
    color: #e74c3c;
}

.summary-card.balance .card-value {
    color: #3498db;
}

.card-change {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    font-size: 0.85rem;
    font-weight: 600;
}

.card-change.positive {
    color: #2ecc71;
}

.card-change.negative {
    color: #e74c3c;
}

.change-label {
    font-weight: 400;
    color: #999;
    margin-left: 5px;
}

/* Loading State */
.summary-card.loading {
    min-height: 120px;
}

.card-skeleton {
    width: 100%;
    height: 80px;
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
    border-radius: 8px;
}

@keyframes shimmer {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
}
```

### Step 7: Dashboard Page

Create `src/pages/Dashboard.tsx`:

```tsx
// ============================================
// Dashboard Page
// ============================================

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import SummaryCard from '../components/SummaryCard';
import { reportsApi } from '../api/reports';
import { transactionsApi } from '../api/transactions';
import { DashboardSummary, Transaction } from '../types';
import '../styles/Dashboard.css';

function Dashboard() {
    const { user } = useAuth();
    const [summary, setSummary] = useState<DashboardSummary | null>(null);
    const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            setError(null);

            const [summaryData, transactionsData] = await Promise.all([
                reportsApi.getDashboard(),
                transactionsApi.getRecent(5),
            ]);

            setSummary(summaryData);
            setRecentTransactions(transactionsData);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load dashboard');
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (amount: number): string => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
    };

    const formatDate = (dateString: string): string => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
        });
    };

    return (
        <Layout>
            <div className="dashboard">
                {/* Header */}
                <div className="dashboard-header">
                    <div>
                        <h1>Welcome back, {user?.name.split(' ')[0]}!</h1>
                        <p>Here's your financial overview for this month</p>
                    </div>
                    <Link to="/transactions/new" className="add-transaction-btn">
                        + Add Transaction
                    </Link>
                </div>

                {/* Error State */}
                {error && (
                    <div className="dashboard-error">
                        <p>{error}</p>
                        <button onClick={fetchDashboardData}>Retry</button>
                    </div>
                )}

                {/* Summary Cards */}
                <div className="summary-cards">
                    <SummaryCard
                        title="Total Income"
                        value={summary?.totalIncome || 0}
                        icon="💰"
                        type="income"
                        change={summary?.incomeChange}
                        loading={loading}
                    />
                    <SummaryCard
                        title="Total Expenses"
                        value={summary?.totalExpense || 0}
                        icon="💸"
                        type="expense"
                        change={summary?.expenseChange}
                        loading={loading}
                    />
                    <SummaryCard
                        title="Balance"
                        value={summary?.balance || 0}
                        icon="📊"
                        type="balance"
                        loading={loading}
                    />
                </div>

                {/* Recent Transactions */}
                <div className="dashboard-section">
                    <div className="section-header">
                        <h2>Recent Transactions</h2>
                        <Link to="/transactions" className="view-all">
                            View All →
                        </Link>
                    </div>

                    {loading ? (
                        <div className="transactions-loading">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="transaction-skeleton"></div>
                            ))}
                        </div>
                    ) : recentTransactions.length === 0 ? (
                        <div className="empty-state">
                            <p>No transactions yet</p>
                            <Link to="/transactions/new">Add your first transaction</Link>
                        </div>
                    ) : (
                        <div className="transactions-list">
                            {recentTransactions.map(transaction => (
                                <div key={transaction.id} className="transaction-item">
                                    <div className="transaction-icon">
                                        {transaction.category_icon}
                                    </div>
                                    <div className="transaction-details">
                                        <span className="transaction-category">
                                            {transaction.category_name}
                                        </span>
                                        <span className="transaction-description">
                                            {transaction.description || 'No description'}
                                        </span>
                                    </div>
                                    <div className="transaction-meta">
                                        <span className={`transaction-amount ${transaction.type}`}>
                                            {transaction.type === 'income' ? '+' : '-'}
                                            {formatCurrency(transaction.amount)}
                                        </span>
                                        <span className="transaction-date">
                                            {formatDate(transaction.date)}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Quick Actions */}
                <div className="dashboard-section">
                    <h2>Quick Actions</h2>
                    <div className="quick-actions">
                        <Link to="/transactions/new?type=income" className="quick-action income">
                            <span className="action-icon">💰</span>
                            <span>Add Income</span>
                        </Link>
                        <Link to="/transactions/new?type=expense" className="quick-action expense">
                            <span className="action-icon">💸</span>
                            <span>Add Expense</span>
                        </Link>
                        <Link to="/reports" className="quick-action reports">
                            <span className="action-icon">📈</span>
                            <span>View Reports</span>
                        </Link>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

export default Dashboard;
```

### Step 8: Dashboard Styles

Create `src/styles/Dashboard.css`:

```css
/* ============================================
   Dashboard Styles
   ============================================ */

.dashboard {
    max-width: 1200px;
    margin: 0 auto;
}

.dashboard-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
}

.dashboard-header h1 {
    margin: 0 0 5px 0;
    color: #333;
}

.dashboard-header p {
    margin: 0;
    color: #666;
}

.add-transaction-btn {
    padding: 12px 24px;
    background: #3498db;
    color: white;
    text-decoration: none;
    border-radius: 8px;
    font-weight: 600;
    transition: background 0.2s;
}

.add-transaction-btn:hover {
    background: #2980b9;
}

/* Error State */
.dashboard-error {
    background: #fee;
    color: #c00;
    padding: 20px;
    border-radius: 12px;
    text-align: center;
    margin-bottom: 20px;
}

.dashboard-error button {
    margin-top: 10px;
    padding: 8px 16px;
    background: #c00;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
}

/* Summary Cards Grid */
.summary-cards {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 20px;
    margin-bottom: 30px;
}

/* Dashboard Sections */
.dashboard-section {
    background: white;
    border-radius: 16px;
    padding: 24px;
    margin-bottom: 20px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}

.section-header h2 {
    margin: 0;
    font-size: 1.2rem;
    color: #333;
}

.view-all {
    color: #3498db;
    text-decoration: none;
    font-weight: 500;
}

.view-all:hover {
    text-decoration: underline;
}

/* Transactions List */
.transactions-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.transaction-item {
    display: flex;
    align-items: center;
    gap: 15px;
    padding: 15px;
    background: #f8f9fa;
    border-radius: 12px;
    transition: background 0.2s;
}

.transaction-item:hover {
    background: #f0f0f0;
}

.transaction-icon {
    width: 45px;
    height: 45px;
    background: white;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.3rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.transaction-details {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.transaction-category {
    font-weight: 600;
    color: #333;
}

.transaction-description {
    font-size: 0.85rem;
    color: #666;
}

.transaction-meta {
    text-align: right;
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.transaction-amount {
    font-weight: 700;
    font-size: 1.1rem;
}

.transaction-amount.income {
    color: #2ecc71;
}

.transaction-amount.expense {
    color: #e74c3c;
}

.transaction-date {
    font-size: 0.8rem;
    color: #999;
}

/* Loading State */
.transactions-loading {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.transaction-skeleton {
    height: 75px;
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
    border-radius: 12px;
}

/* Empty State */
.empty-state {
    text-align: center;
    padding: 40px;
    color: #666;
}

.empty-state a {
    color: #3498db;
    text-decoration: none;
    font-weight: 500;
}

/* Quick Actions */
.quick-actions {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 15px;
}

.quick-action {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    padding: 20px;
    background: #f8f9fa;
    border-radius: 12px;
    text-decoration: none;
    color: #333;
    transition: all 0.2s;
}

.quick-action:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.quick-action.income:hover {
    background: rgba(46, 204, 113, 0.1);
}

.quick-action.expense:hover {
    background: rgba(231, 76, 60, 0.1);
}

.quick-action.reports:hover {
    background: rgba(52, 152, 219, 0.1);
}

.action-icon {
    font-size: 2rem;
}

/* Responsive */
@media (max-width: 768px) {
    .dashboard-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 15px;
    }

    .add-transaction-btn {
        width: 100%;
        text-align: center;
    }
}
```

---

## ✍️ Exercises

### Exercise 1: Add Date Range Filter
Add a date range selector to the dashboard that:
- Shows current month by default
- Allows selecting different months
- Updates all data based on selection

### Exercise 2: Add Transaction Count Card
Add a fourth summary card that:
- Shows total number of transactions
- Shows change from previous period
- Has appropriate styling

### Exercise 3: Add Loading Skeleton
Improve the loading state with:
- Skeleton loaders for all components
- Smooth animation
- Proper sizing that matches actual content

---

## ❓ Quiz Questions

### Q1: Layout Component
Why do we create a separate Layout component instead of putting the sidebar in each page?

**Your Answer**: 


### Q2: Data Fetching
Why do we use `Promise.all` to fetch dashboard and transactions data?

**Your Answer**: 


### Q3: Conditional Styling
How does the SummaryCard component determine whether a change is positive or negative for expenses?

**Your Answer**: 


---

## 📝 Bonus Questions (Optional)

### B1: How would you implement real-time updates to the dashboard when new transactions are added?

**Your Answer**: 


### B2: What caching strategy would you use for the dashboard data?

**Your Answer**: 


---

## ✅ Day 32 Checklist

- [ ] Create Reports API client
- [ ] Create Transactions API client
- [ ] Build Layout component with sidebar
- [ ] Build SummaryCard component
- [ ] Build Dashboard page
- [ ] Implement loading states
- [ ] Implement error handling
- [ ] Add responsive styles
- [ ] Complete Exercise 1 (Date Filter)
- [ ] Complete Exercise 2 (Transaction Count)
- [ ] Complete Exercise 3 (Skeleton)
- [ ] Answer all quiz questions

---

## 🔗 Next Day Preview
Tomorrow you'll build **Transaction Management** - the transaction list, add/edit forms, and CRUD operations.
