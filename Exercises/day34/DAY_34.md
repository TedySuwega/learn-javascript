# Day 34: Charts & Reports

## 📚 What to Learn Today
- **Topics**: Chart library (Recharts), data visualization
- **Time**: ~45 minutes reading, ~45 minutes practice
- **Goal**: Build pie chart and line chart for financial data

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
];
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

import React from 'react';
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Legend,
    Tooltip,
} from 'recharts';
import { CategorySummary } from '../../types';

interface ExpensePieChartProps {
    data: CategorySummary[];
    loading?: boolean;
}

const COLORS = [
    '#3498db', '#2ecc71', '#e74c3c', '#f39c12', '#9b59b6',
    '#1abc9c', '#e67e22', '#34495e', '#16a085', '#c0392b',
];

function ExpensePieChart({ data, loading }: ExpensePieChartProps) {
    if (loading) {
        return (
            <div className="chart-loading">
                <div className="chart-skeleton"></div>
            </div>
        );
    }

    if (data.length === 0) {
        return (
            <div className="chart-empty">
                <p>No expense data available</p>
            </div>
        );
    }

    const chartData = data.map(item => ({
        name: item.category_name,
        value: item.total,
        icon: item.category_icon,
        percentage: item.percentage,
    }));

    const formatCurrency = (value: number): string => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
        }).format(value);
    };

    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="custom-tooltip">
                    <p className="tooltip-label">
                        {data.icon} {data.name}
                    </p>
                    <p className="tooltip-value">{formatCurrency(data.value)}</p>
                    <p className="tooltip-percent">{data.percentage.toFixed(1)}%</p>
                </div>
            );
        }
        return null;
    };

    const renderCustomLabel = ({
        cx,
        cy,
        midAngle,
        innerRadius,
        outerRadius,
        percent,
    }: any) => {
        if (percent < 0.05) return null;
        
        const RADIAN = Math.PI / 180;
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        return (
            <text
                x={x}
                y={y}
                fill="white"
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={12}
                fontWeight="bold"
            >
                {`${(percent * 100).toFixed(0)}%`}
            </text>
        );
    };

    return (
        <div className="pie-chart-container">
            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={renderCustomLabel}
                        outerRadius={100}
                        innerRadius={40}
                        fill="#8884d8"
                        dataKey="value"
                        animationDuration={800}
                    >
                        {chartData.map((entry, index) => (
                            <Cell 
                                key={`cell-${index}`} 
                                fill={COLORS[index % COLORS.length]}
                            />
                        ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                        formatter={(value, entry: any) => (
                            <span style={{ color: '#333' }}>
                                {entry.payload.icon} {value}
                            </span>
                        )}
                    />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}

export default ExpensePieChart;
```

### Step 3: Line Chart Component

Create `src/components/charts/MonthlyTrendChart.tsx`:

```tsx
// ============================================
// Monthly Trend Line Chart Component
// ============================================

import React from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Area,
    ComposedChart,
} from 'recharts';
import { MonthlyTrend } from '../../types';

interface MonthlyTrendChartProps {
    data: MonthlyTrend[];
    loading?: boolean;
    showBalance?: boolean;
}

function MonthlyTrendChart({ data, loading, showBalance = true }: MonthlyTrendChartProps) {
    if (loading) {
        return (
            <div className="chart-loading">
                <div className="chart-skeleton"></div>
            </div>
        );
    }

    if (data.length === 0) {
        return (
            <div className="chart-empty">
                <p>No trend data available</p>
            </div>
        );
    }

    // Format month names
    const chartData = data.map(item => ({
        ...item,
        monthLabel: formatMonth(item.month),
    })).reverse(); // Oldest first

    function formatMonth(monthStr: string): string {
        const [year, month] = monthStr.split('-');
        const date = new Date(parseInt(year), parseInt(month) - 1);
        return date.toLocaleDateString('en-US', { month: 'short' });
    }

    const formatCurrency = (value: number): string => {
        if (value >= 1000) {
            return `$${(value / 1000).toFixed(1)}k`;
        }
        return `$${value}`;
    };

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="custom-tooltip">
                    <p className="tooltip-label">{label}</p>
                    {payload.map((entry: any, index: number) => (
                        <p 
                            key={index}
                            style={{ color: entry.color }}
                            className="tooltip-value"
                        >
                            {entry.name}: ${entry.value.toLocaleString()}
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    return (
        <div className="line-chart-container">
            <ResponsiveContainer width="100%" height={300}>
                <ComposedChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                        dataKey="monthLabel" 
                        tick={{ fill: '#666', fontSize: 12 }}
                        axisLine={{ stroke: '#e0e0e0' }}
                    />
                    <YAxis 
                        tickFormatter={formatCurrency}
                        tick={{ fill: '#666', fontSize: 12 }}
                        axisLine={{ stroke: '#e0e0e0' }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    
                    {showBalance && (
                        <Area
                            type="monotone"
                            dataKey="balance"
                            name="Balance"
                            fill="rgba(52, 152, 219, 0.1)"
                            stroke="transparent"
                        />
                    )}
                    
                    <Line
                        type="monotone"
                        dataKey="income"
                        name="Income"
                        stroke="#2ecc71"
                        strokeWidth={3}
                        dot={{ fill: '#2ecc71', strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6 }}
                    />
                    <Line
                        type="monotone"
                        dataKey="expense"
                        name="Expense"
                        stroke="#e74c3c"
                        strokeWidth={3}
                        dot={{ fill: '#e74c3c', strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6 }}
                    />
                </ComposedChart>
            </ResponsiveContainer>
        </div>
    );
}

export default MonthlyTrendChart;
```

### Step 4: Bar Chart Component

Create `src/components/charts/CategoryBarChart.tsx`:

```tsx
// ============================================
// Category Bar Chart Component
// ============================================

import React from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
} from 'recharts';
import { CategorySummary } from '../../types';

interface CategoryBarChartProps {
    data: CategorySummary[];
    type: 'income' | 'expense';
    loading?: boolean;
}

function CategoryBarChart({ data, type, loading }: CategoryBarChartProps) {
    if (loading) {
        return (
            <div className="chart-loading">
                <div className="chart-skeleton"></div>
            </div>
        );
    }

    if (data.length === 0) {
        return (
            <div className="chart-empty">
                <p>No {type} data available</p>
            </div>
        );
    }

    const chartData = data.slice(0, 6).map(item => ({
        name: item.category_name,
        value: item.total,
        icon: item.category_icon,
    }));

    const barColor = type === 'income' ? '#2ecc71' : '#e74c3c';

    const formatCurrency = (value: number): string => {
        if (value >= 1000) {
            return `$${(value / 1000).toFixed(1)}k`;
        }
        return `$${value}`;
    };

    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="custom-tooltip">
                    <p className="tooltip-label">
                        {data.icon} {data.name}
                    </p>
                    <p className="tooltip-value" style={{ color: barColor }}>
                        ${data.value.toLocaleString()}
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="bar-chart-container">
            <ResponsiveContainer width="100%" height={250}>
                <BarChart
                    data={chartData}
                    layout="vertical"
                    margin={{ left: 20, right: 20 }}
                >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
                    <XAxis 
                        type="number" 
                        tickFormatter={formatCurrency}
                        tick={{ fill: '#666', fontSize: 12 }}
                    />
                    <YAxis 
                        type="category" 
                        dataKey="name"
                        tick={{ fill: '#666', fontSize: 12 }}
                        width={100}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar 
                        dataKey="value" 
                        radius={[0, 4, 4, 0]}
                        animationDuration={800}
                    >
                        {chartData.map((entry, index) => (
                            <Cell 
                                key={`cell-${index}`} 
                                fill={barColor}
                                fillOpacity={1 - (index * 0.1)}
                            />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}

export default CategoryBarChart;
```

### Step 5: Chart Styles

Create `src/styles/Charts.css`:

```css
/* ============================================
   Chart Styles
   ============================================ */

.chart-loading,
.chart-empty {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 300px;
    color: #666;
}

.chart-skeleton {
    width: 200px;
    height: 200px;
    border-radius: 50%;
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
}

/* Custom Tooltip */
.custom-tooltip {
    background: white;
    padding: 12px 16px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    border: 1px solid #e0e0e0;
}

.tooltip-label {
    margin: 0 0 8px 0;
    font-weight: 600;
    color: #333;
}

.tooltip-value {
    margin: 0;
    font-size: 1.1rem;
    font-weight: 700;
}

.tooltip-percent {
    margin: 4px 0 0 0;
    color: #666;
    font-size: 0.9rem;
}

/* Chart Containers */
.pie-chart-container,
.line-chart-container,
.bar-chart-container {
    padding: 20px 0;
}

/* Legend Customization */
.recharts-legend-wrapper {
    padding-top: 20px !important;
}

.recharts-legend-item {
    margin-right: 20px !important;
}

/* Responsive */
@media (max-width: 768px) {
    .chart-loading,
    .chart-empty {
        min-height: 200px;
    }

    .chart-skeleton {
        width: 150px;
        height: 150px;
    }
}
```

### Step 6: Reports Page

Create `src/pages/Reports.tsx`:

```tsx
// ============================================
// Reports Page
// ============================================

import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import ExpensePieChart from '../components/charts/ExpensePieChart';
import MonthlyTrendChart from '../components/charts/MonthlyTrendChart';
import CategoryBarChart from '../components/charts/CategoryBarChart';
import { reportsApi } from '../api/reports';
import { CategorySummary, MonthlyTrend } from '../types';
import '../styles/Reports.css';
import '../styles/Charts.css';

function Reports() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    const [monthlyTrends, setMonthlyTrends] = useState<MonthlyTrend[]>([]);
    const [expenseByCategory, setExpenseByCategory] = useState<CategorySummary[]>([]);
    const [incomeByCategory, setIncomeByCategory] = useState<CategorySummary[]>([]);
    
    const [selectedPeriod, setSelectedPeriod] = useState<'3' | '6' | '12'>('6');

    useEffect(() => {
        fetchReportData();
    }, [selectedPeriod]);

    const fetchReportData = async () => {
        try {
            setLoading(true);
            setError(null);

            const [trends, categories] = await Promise.all([
                reportsApi.getMonthlyTrends(parseInt(selectedPeriod)),
                reportsApi.getCategoryBreakdown(),
            ]);

            setMonthlyTrends(trends);
            setExpenseByCategory(categories.expense);
            setIncomeByCategory(categories.income);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load reports');
        } finally {
            setLoading(false);
        }
    };

    // Calculate totals
    const totalIncome = incomeByCategory.reduce((sum, c) => sum + c.total, 0);
    const totalExpense = expenseByCategory.reduce((sum, c) => sum + c.total, 0);
    const savingsRate = totalIncome > 0 
        ? ((totalIncome - totalExpense) / totalIncome * 100).toFixed(1)
        : '0';

    const formatCurrency = (amount: number): string => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    return (
        <Layout>
            <div className="reports-page">
                {/* Header */}
                <div className="page-header">
                    <div>
                        <h1>Financial Reports</h1>
                        <p>Analyze your spending patterns and trends</p>
                    </div>
                    <div className="period-selector">
                        <button
                            className={selectedPeriod === '3' ? 'active' : ''}
                            onClick={() => setSelectedPeriod('3')}
                        >
                            3 Months
                        </button>
                        <button
                            className={selectedPeriod === '6' ? 'active' : ''}
                            onClick={() => setSelectedPeriod('6')}
                        >
                            6 Months
                        </button>
                        <button
                            className={selectedPeriod === '12' ? 'active' : ''}
                            onClick={() => setSelectedPeriod('12')}
                        >
                            12 Months
                        </button>
                    </div>
                </div>

                {/* Error */}
                {error && (
                    <div className="error-banner">
                        {error}
                        <button onClick={fetchReportData}>Retry</button>
                    </div>
                )}

                {/* Summary Stats */}
                <div className="stats-row">
                    <div className="stat-card">
                        <span className="stat-label">Total Income</span>
                        <span className="stat-value income">{formatCurrency(totalIncome)}</span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-label">Total Expenses</span>
                        <span className="stat-value expense">{formatCurrency(totalExpense)}</span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-label">Net Savings</span>
                        <span className="stat-value balance">
                            {formatCurrency(totalIncome - totalExpense)}
                        </span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-label">Savings Rate</span>
                        <span className="stat-value">{savingsRate}%</span>
                    </div>
                </div>

                {/* Charts Grid */}
                <div className="charts-grid">
                    {/* Monthly Trends */}
                    <div className="chart-card full-width">
                        <h3>Income vs Expenses Trend</h3>
                        <MonthlyTrendChart data={monthlyTrends} loading={loading} />
                    </div>

                    {/* Expense Breakdown */}
                    <div className="chart-card">
                        <h3>Expense Breakdown</h3>
                        <ExpensePieChart data={expenseByCategory} loading={loading} />
                    </div>

                    {/* Income Breakdown */}
                    <div className="chart-card">
                        <h3>Income Sources</h3>
                        <ExpensePieChart data={incomeByCategory} loading={loading} />
                    </div>

                    {/* Top Expenses */}
                    <div className="chart-card">
                        <h3>Top Expense Categories</h3>
                        <CategoryBarChart 
                            data={expenseByCategory} 
                            type="expense"
                            loading={loading}
                        />
                    </div>

                    {/* Top Income */}
                    <div className="chart-card">
                        <h3>Top Income Sources</h3>
                        <CategoryBarChart 
                            data={incomeByCategory} 
                            type="income"
                            loading={loading}
                        />
                    </div>
                </div>

                {/* Category Details Table */}
                <div className="details-section">
                    <h3>Category Details</h3>
                    <div className="details-grid">
                        {/* Expenses Table */}
                        <div className="details-card">
                            <h4>💸 Expenses by Category</h4>
                            <table className="details-table">
                                <thead>
                                    <tr>
                                        <th>Category</th>
                                        <th>Amount</th>
                                        <th>%</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {expenseByCategory.map(cat => (
                                        <tr key={cat.category_id}>
                                            <td>
                                                {cat.category_icon} {cat.category_name}
                                            </td>
                                            <td>{formatCurrency(cat.total)}</td>
                                            <td>{cat.percentage.toFixed(1)}%</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Income Table */}
                        <div className="details-card">
                            <h4>💰 Income by Source</h4>
                            <table className="details-table">
                                <thead>
                                    <tr>
                                        <th>Source</th>
                                        <th>Amount</th>
                                        <th>%</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {incomeByCategory.map(cat => (
                                        <tr key={cat.category_id}>
                                            <td>
                                                {cat.category_icon} {cat.category_name}
                                            </td>
                                            <td>{formatCurrency(cat.total)}</td>
                                            <td>{cat.percentage.toFixed(1)}%</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

export default Reports;
```

### Step 7: Reports Page Styles

Create `src/styles/Reports.css`:

```css
/* ============================================
   Reports Page Styles
   ============================================ */

.reports-page {
    max-width: 1400px;
    margin: 0 auto;
}

.page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
    flex-wrap: wrap;
    gap: 20px;
}

.page-header h1 {
    margin: 0 0 5px 0;
    color: #333;
}

.page-header p {
    margin: 0;
    color: #666;
}

/* Period Selector */
.period-selector {
    display: flex;
    gap: 8px;
    background: white;
    padding: 6px;
    border-radius: 10px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.period-selector button {
    padding: 10px 20px;
    border: none;
    background: transparent;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 500;
    color: #666;
    transition: all 0.2s;
}

.period-selector button:hover {
    background: #f5f5f5;
}

.period-selector button.active {
    background: #3498db;
    color: white;
}

/* Stats Row */
.stats-row {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 20px;
    margin-bottom: 30px;
}

.stat-card {
    background: white;
    padding: 24px;
    border-radius: 12px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.stat-label {
    color: #666;
    font-size: 0.9rem;
}

.stat-value {
    font-size: 1.8rem;
    font-weight: 700;
    color: #333;
}

.stat-value.income {
    color: #2ecc71;
}

.stat-value.expense {
    color: #e74c3c;
}

.stat-value.balance {
    color: #3498db;
}

/* Charts Grid */
.charts-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
    margin-bottom: 30px;
}

.chart-card {
    background: white;
    padding: 24px;
    border-radius: 12px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.chart-card.full-width {
    grid-column: 1 / -1;
}

.chart-card h3 {
    margin: 0 0 20px 0;
    color: #333;
    font-size: 1.1rem;
}

/* Details Section */
.details-section {
    background: white;
    padding: 24px;
    border-radius: 12px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.details-section h3 {
    margin: 0 0 20px 0;
    color: #333;
}

.details-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
    gap: 30px;
}

.details-card h4 {
    margin: 0 0 15px 0;
    color: #333;
}

.details-table {
    width: 100%;
    border-collapse: collapse;
}

.details-table th,
.details-table td {
    padding: 12px;
    text-align: left;
    border-bottom: 1px solid #f0f0f0;
}

.details-table th {
    color: #666;
    font-weight: 600;
    font-size: 0.85rem;
}

.details-table td:nth-child(2),
.details-table td:nth-child(3) {
    text-align: right;
}

.details-table th:nth-child(2),
.details-table th:nth-child(3) {
    text-align: right;
}

/* Error Banner */
.error-banner {
    background: #fee;
    color: #c00;
    padding: 16px;
    border-radius: 8px;
    margin-bottom: 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.error-banner button {
    padding: 8px 16px;
    background: #c00;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
}

/* Responsive */
@media (max-width: 1024px) {
    .charts-grid {
        grid-template-columns: 1fr;
    }
}

@media (max-width: 768px) {
    .page-header {
        flex-direction: column;
        align-items: flex-start;
    }

    .details-grid {
        grid-template-columns: 1fr;
    }
}
```

---

## ✍️ Exercises

### Exercise 1: Add Date Range Filter
Add a date range picker that:
- Allows selecting custom start/end dates
- Updates all charts based on selection
- Shows comparison with previous period

### Exercise 2: Add Download Chart Feature
Implement chart download that:
- Exports chart as PNG image
- Includes title and date range
- Works for all chart types

### Exercise 3: Add Budget Comparison Chart
Create a new chart that:
- Shows budget vs actual spending per category
- Uses grouped bar chart
- Highlights over-budget categories

---

## ❓ Quiz Questions

### Q1: Recharts ResponsiveContainer
Why do we wrap charts in `ResponsiveContainer`?

**Your Answer**: 


### Q2: Data Transformation
Why do we transform API data before passing it to charts?

**Your Answer**: 


### Q3: Chart Performance
What considerations should you have when rendering charts with large datasets?

**Your Answer**: 


---

## 📝 Bonus Questions (Optional)

### B1: How would you implement chart animations that trigger when scrolling into view?

**Your Answer**: 


### B2: How would you add drill-down functionality to the pie chart?

**Your Answer**: 


---

## ✅ Day 34 Checklist

- [ ] Install and configure Recharts
- [ ] Build ExpensePieChart component
- [ ] Build MonthlyTrendChart component
- [ ] Build CategoryBarChart component
- [ ] Create chart styles
- [ ] Build Reports page
- [ ] Add period selector
- [ ] Add summary statistics
- [ ] Add category details tables
- [ ] Complete Exercise 1 (Date Range)
- [ ] Complete Exercise 2 (Download)
- [ ] Complete Exercise 3 (Budget Chart)
- [ ] Answer all quiz questions

---

## 🔗 Next Day Preview
Tomorrow is the final day! You'll **Polish & Complete** the application - adding responsive design, error handling, and final touches.
