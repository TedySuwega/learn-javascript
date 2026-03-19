# Day 34: Charts & Reports

## 📚 What to Learn Today
- **Topics**: Chart library (Recharts), data visualization, reports page
- **Time**: ~45 minutes reading, ~45 minutes practice
- **Goal**: Build pie chart and line chart for financial data with Tailwind CSS

---

## 📖 Key Concepts

### 1. Why Data Visualization?

```
Raw Data:
Income: $5000, $4500, $6000, $5500

vs

Visual Chart:
📈 Shows trends at a glance
📊 Compares values easily
🎯 Highlights patterns
```

### 2. Recharts Library

```
Recharts Features:
├── Declarative components
├── Responsive containers
├── Customizable styling
├── Animation support
└── TypeScript support
```

### 3. Common Chart Types

```
Financial Data:
├── Pie Chart → Category breakdown
├── Line Chart → Trends over time
├── Bar Chart → Comparisons
└── Area Chart → Volume over time
```

### 4. Chart Data Format

```typescript
// Recharts expects array of objects
const data = [
    { name: 'Jan', income: 5000, expense: 3000 },
    { name: 'Feb', income: 4500, expense: 3200 },
    { name: 'Mar', income: 6000, expense: 2800 },
]
```

---

## 💻 Code to Type & Understand

### Step 1: Install Recharts

```bash
npm install recharts
```

### Step 2: Pie Chart Component

Create `src/components/charts/ExpensePieChart.tsx`:

```tsx
// ============================================
// Expense Pie Chart Component
// ============================================

import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Legend,
    Tooltip,
} from 'recharts'
import { CategorySummary } from '../../types'

interface ExpensePieChartProps {
    data: CategorySummary[]
    loading?: boolean
}

const COLORS = [
    '#3b82f6', '#10b981', '#ef4444', '#f59e0b', '#8b5cf6',
    '#06b6d4', '#ec4899', '#84cc16', '#f97316', '#6366f1',
]

export function ExpensePieChart({ data, loading }: ExpensePieChartProps) {
    if (loading) {
        return (
            <div className="h-80 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
            </div>
        )
    }

    if (data.length === 0) {
        return (
            <div className="h-80 flex items-center justify-center text-gray-500">
                No data available
            </div>
        )
    }

    const chartData = data.map((item, index) => ({
        name: `${item.category_icon} ${item.category_name}`,
        value: item.total,
        percentage: item.percentage,
        color: COLORS[index % COLORS.length],
    }))

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
        }).format(value)
    }

    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload
            return (
                <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
                    <p className="font-medium">{data.name}</p>
                    <p className="text-gray-600">{formatCurrency(data.value)}</p>
                    <p className="text-sm text-gray-500">{data.percentage.toFixed(1)}%</p>
                </div>
            )
        }
        return null
    }

    return (
        <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={2}
                        dataKey="value"
                    >
                        {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                        layout="vertical"
                        align="right"
                        verticalAlign="middle"
                        formatter={(value: string) => (
                            <span className="text-sm text-gray-700">{value}</span>
                        )}
                    />
                </PieChart>
            </ResponsiveContainer>
        </div>
    )
}
```

### Step 3: Line Chart Component

Create `src/components/charts/MonthlyTrendChart.tsx`:

```tsx
// ============================================
// Monthly Trend Line Chart Component
// ============================================

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts'
import { MonthlyTrend } from '../../types'

interface MonthlyTrendChartProps {
    data: MonthlyTrend[]
    loading?: boolean
}

export function MonthlyTrendChart({ data, loading }: MonthlyTrendChartProps) {
    if (loading) {
        return (
            <div className="h-80 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
            </div>
        )
    }

    if (data.length === 0) {
        return (
            <div className="h-80 flex items-center justify-center text-gray-500">
                No data available
            </div>
        )
    }

    const chartData = [...data].reverse().map((item) => ({
        month: formatMonth(item.month),
        income: item.total_income,
        expense: item.total_expense,
        balance: item.balance,
    }))

    function formatMonth(monthStr: string) {
        const [year, month] = monthStr.split('-')
        const date = new Date(parseInt(year), parseInt(month) - 1)
        return date.toLocaleDateString('en-US', { month: 'short' })
    }

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            notation: 'compact',
        }).format(value)
    }

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
                    <p className="font-medium mb-2">{label}</p>
                    {payload.map((entry: any, index: number) => (
                        <p key={index} style={{ color: entry.color }} className="text-sm">
                            {entry.name}: {formatCurrency(entry.value)}
                        </p>
                    ))}
                </div>
            )
        }
        return null
    }

    return (
        <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis
                        dataKey="month"
                        tick={{ fill: '#6b7280', fontSize: 12 }}
                        tickLine={false}
                    />
                    <YAxis
                        tick={{ fill: '#6b7280', fontSize: 12 }}
                        tickLine={false}
                        tickFormatter={formatCurrency}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                        formatter={(value: string) => (
                            <span className="text-sm text-gray-700 capitalize">{value}</span>
                        )}
                    />
                    <Line
                        type="monotone"
                        dataKey="income"
                        stroke="#10b981"
                        strokeWidth={2}
                        dot={{ fill: '#10b981', strokeWidth: 2 }}
                        activeDot={{ r: 6 }}
                    />
                    <Line
                        type="monotone"
                        dataKey="expense"
                        stroke="#ef4444"
                        strokeWidth={2}
                        dot={{ fill: '#ef4444', strokeWidth: 2 }}
                        activeDot={{ r: 6 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    )
}
```

### Step 4: Bar Chart Component

Create `src/components/charts/IncomeExpenseBarChart.tsx`:

```tsx
// ============================================
// Income vs Expense Bar Chart Component
// ============================================

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts'
import { MonthlyTrend } from '../../types'

interface IncomeExpenseBarChartProps {
    data: MonthlyTrend[]
    loading?: boolean
}

export function IncomeExpenseBarChart({ data, loading }: IncomeExpenseBarChartProps) {
    if (loading) {
        return (
            <div className="h-80 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
            </div>
        )
    }

    if (data.length === 0) {
        return (
            <div className="h-80 flex items-center justify-center text-gray-500">
                No data available
            </div>
        )
    }

    const chartData = [...data].reverse().slice(-6).map((item) => ({
        month: formatMonth(item.month),
        Income: item.total_income,
        Expense: item.total_expense,
    }))

    function formatMonth(monthStr: string) {
        const [year, month] = monthStr.split('-')
        const date = new Date(parseInt(year), parseInt(month) - 1)
        return date.toLocaleDateString('en-US', { month: 'short' })
    }

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            notation: 'compact',
        }).format(value)
    }

    return (
        <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis
                        dataKey="month"
                        tick={{ fill: '#6b7280', fontSize: 12 }}
                        tickLine={false}
                    />
                    <YAxis
                        tick={{ fill: '#6b7280', fontSize: 12 }}
                        tickLine={false}
                        tickFormatter={formatCurrency}
                    />
                    <Tooltip
                        formatter={(value: number) => formatCurrency(value)}
                        contentStyle={{
                            backgroundColor: 'white',
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px',
                        }}
                    />
                    <Legend
                        formatter={(value: string) => (
                            <span className="text-sm text-gray-700">{value}</span>
                        )}
                    />
                    <Bar dataKey="Income" fill="#10b981" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Expense" fill="#ef4444" radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}
```

### Step 5: Category List Component

Create `src/components/CategoryList.tsx`:

```tsx
// ============================================
// Category List Component
// ============================================

import { CategorySummary } from '../types'

interface CategoryListProps {
    data: CategorySummary[]
    type: 'income' | 'expense'
    loading?: boolean
}

export function CategoryList({ data, type, loading }: CategoryListProps) {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount)
    }

    if (loading) {
        return (
            <div className="space-y-3">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="animate-pulse flex items-center">
                        <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                        <div className="ml-3 flex-1">
                            <div className="h-4 bg-gray-200 rounded w-24"></div>
                        </div>
                        <div className="h-4 bg-gray-200 rounded w-16"></div>
                    </div>
                ))}
            </div>
        )
    }

    if (data.length === 0) {
        return (
            <div className="text-center py-8 text-gray-500">
                No {type} data available
            </div>
        )
    }

    const colorClass = type === 'income' ? 'bg-green-500' : 'bg-red-500'

    return (
        <div className="space-y-3">
            {data.map((item) => (
                <div key={item.category_id} className="flex items-center">
                    <span className="text-xl w-8">{item.category_icon}</span>
                    <div className="ml-3 flex-1">
                        <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium text-gray-700">
                                {item.category_name}
                            </span>
                            <span className="text-sm font-medium text-gray-900">
                                {formatCurrency(item.total)}
                            </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                                className={`${colorClass} h-2 rounded-full transition-all duration-500`}
                                style={{ width: `${item.percentage}%` }}
                            />
                        </div>
                        <span className="text-xs text-gray-500">
                            {item.percentage.toFixed(1)}%
                        </span>
                    </div>
                </div>
            ))}
        </div>
    )
}
```

### Step 6: Reports Page

Create `src/pages/Reports.tsx`:

```tsx
// ============================================
// Reports Page
// ============================================

import { useState, useEffect } from 'react'
import { Layout } from '../components/Layout'
import { ExpensePieChart } from '../components/charts/ExpensePieChart'
import { MonthlyTrendChart } from '../components/charts/MonthlyTrendChart'
import { IncomeExpenseBarChart } from '../components/charts/IncomeExpenseBarChart'
import { CategoryList } from '../components/CategoryList'
import { reportsApi } from '../api/reports'
import { CategorySummary, MonthlyTrend } from '../types'

export function Reports() {
    const [monthlyTrends, setMonthlyTrends] = useState<MonthlyTrend[]>([])
    const [incomeCategories, setIncomeCategories] = useState<CategorySummary[]>([])
    const [expenseCategories, setExpenseCategories] = useState<CategorySummary[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [months, setMonths] = useState(6)

    useEffect(() => {
        loadReportData()
    }, [months])

    const loadReportData = async () => {
        try {
            setLoading(true)
            setError(null)

            const [trends, categories] = await Promise.all([
                reportsApi.getMonthlyTrends(months),
                reportsApi.getCategoryBreakdown()
            ])

            setMonthlyTrends(trends)
            setIncomeCategories(categories.income)
            setExpenseCategories(categories.expense)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load reports')
        } finally {
            setLoading(false)
        }
    }

    const totalIncome = incomeCategories.reduce((sum, c) => sum + c.total, 0)
    const totalExpense = expenseCategories.reduce((sum, c) => sum + c.total, 0)
    const balance = totalIncome - totalExpense
    const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpense) / totalIncome) * 100 : 0

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
        }).format(amount)
    }

    return (
        <Layout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
                        <p className="text-gray-500 mt-1">Analyze your financial data</p>
                    </div>
                    <div className="mt-4 sm:mt-0">
                        <select
                            value={months}
                            onChange={(e) => setMonths(parseInt(e.target.value))}
                            className="input w-auto"
                        >
                            <option value={3}>Last 3 months</option>
                            <option value={6}>Last 6 months</option>
                            <option value={12}>Last 12 months</option>
                        </select>
                    </div>
                </div>

                {/* Error */}
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                        {error}
                        <button onClick={loadReportData} className="ml-4 underline">
                            Retry
                        </button>
                    </div>
                )}

                {/* Summary Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="card text-center">
                        <p className="text-sm text-gray-500">Total Income</p>
                        <p className="text-2xl font-bold text-green-600 mt-1">
                            {formatCurrency(totalIncome)}
                        </p>
                    </div>
                    <div className="card text-center">
                        <p className="text-sm text-gray-500">Total Expenses</p>
                        <p className="text-2xl font-bold text-red-600 mt-1">
                            {formatCurrency(totalExpense)}
                        </p>
                    </div>
                    <div className="card text-center">
                        <p className="text-sm text-gray-500">Net Balance</p>
                        <p className={`text-2xl font-bold mt-1 ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {formatCurrency(balance)}
                        </p>
                    </div>
                    <div className="card text-center">
                        <p className="text-sm text-gray-500">Savings Rate</p>
                        <p className={`text-2xl font-bold mt-1 ${savingsRate >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                            {savingsRate.toFixed(1)}%
                        </p>
                    </div>
                </div>

                {/* Charts Row 1 */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Monthly Trend */}
                    <div className="card">
                        <h3 className="text-lg font-semibold mb-4">Monthly Trend</h3>
                        <MonthlyTrendChart data={monthlyTrends} loading={loading} />
                    </div>

                    {/* Income vs Expense */}
                    <div className="card">
                        <h3 className="text-lg font-semibold mb-4">Income vs Expense</h3>
                        <IncomeExpenseBarChart data={monthlyTrends} loading={loading} />
                    </div>
                </div>

                {/* Charts Row 2 */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Expense Breakdown */}
                    <div className="card">
                        <h3 className="text-lg font-semibold mb-4">Expense Breakdown</h3>
                        <ExpensePieChart data={expenseCategories} loading={loading} />
                    </div>

                    {/* Income Breakdown */}
                    <div className="card">
                        <h3 className="text-lg font-semibold mb-4">Income Breakdown</h3>
                        <ExpensePieChart data={incomeCategories} loading={loading} />
                    </div>
                </div>

                {/* Category Details */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Expense Categories */}
                    <div className="card">
                        <h3 className="text-lg font-semibold mb-4">Expense by Category</h3>
                        <CategoryList
                            data={expenseCategories}
                            type="expense"
                            loading={loading}
                        />
                    </div>

                    {/* Income Categories */}
                    <div className="card">
                        <h3 className="text-lg font-semibold mb-4">Income by Category</h3>
                        <CategoryList
                            data={incomeCategories}
                            type="income"
                            loading={loading}
                        />
                    </div>
                </div>
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
import { Transactions } from './pages/Transactions'
import { Reports } from './pages/Reports'

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

### Exercise 1: Add Area Chart
Create an area chart component that:
- Shows cumulative balance over time
- Uses gradient fill
- Includes hover tooltips

### Exercise 2: Add Date Range Picker
Add date range filtering to reports:
- Custom start and end dates
- Preset options (This Month, Last Month, This Year)
- Updates all charts when range changes

### Exercise 3: Add Export to PDF
Add functionality to:
- Export the reports page as PDF
- Include all charts and data
- Add company branding/header

---

## ❓ Quiz Questions

### Q1: ResponsiveContainer
Why do we wrap Recharts components in `ResponsiveContainer`?

**Your Answer**: 


### Q2: Data Transformation
Why do we reverse the monthly trends array before displaying?

**Your Answer**: 


### Q3: Chart Performance
What performance considerations should you keep in mind when rendering charts with large datasets?

**Your Answer**: 


---

## 📝 Bonus Questions (Optional)

### B1: How would you implement chart animations that trigger when the chart scrolls into view?

**Your Answer**: 


### B2: How would you add drill-down functionality (click on pie slice to see transactions)?

**Your Answer**: 


---

## ✅ Day 34 Checklist

- [ ] Install Recharts library
- [ ] Create ExpensePieChart component
- [ ] Create MonthlyTrendChart component
- [ ] Create IncomeExpenseBarChart component
- [ ] Create CategoryList component
- [ ] Build Reports page
- [ ] Add time range filter
- [ ] Style charts with Tailwind
- [ ] Update App routes
- [ ] Complete Exercise 1 (Area Chart)
- [ ] Complete Exercise 2 (Date Range Picker)
- [ ] Complete Exercise 3 (Export to PDF)
- [ ] Answer all quiz questions

---

## 🔗 Next Day Preview
Tomorrow is the final day! You'll **Polish & Complete** the application - adding responsive design improvements, error boundaries, and Docker deployment instructions.
