# Day 33: Transaction Management

## 📚 What to Learn Today
- **Topics**: Transaction list, add/edit forms, CRUD operations, modals
- **Time**: ~50 minutes reading, ~50 minutes practice
- **Goal**: Build complete transaction management UI with Tailwind CSS

---

## 📖 Key Concepts

### 1. Transaction Management Features

```
Transaction Management:
├── List View (with filters)
├── Create Transaction
├── Edit Transaction
├── Delete Transaction
├── Search & Filter
└── Pagination
```

### 2. Form Patterns

```
Controlled Form:
├── State for each field
├── onChange handlers
├── Validation on submit
└── Error display
```

### 3. Modal Pattern

```
Modal Component:
├── Overlay (click to close)
├── Content container
├── Close button
├── Focus trap
└── Escape key handler
```

### 4. Filter State Management

```typescript
interface Filters {
    type?: 'income' | 'expense'
    categoryId?: string
    startDate?: string
    endDate?: string
    search?: string
}
```

---

## 💻 Code to Type & Understand

### Step 1: Categories API

Create `src/api/categories.ts`:

```typescript
// ============================================
// Categories API
// ============================================

import api from './client'
import { Category } from '../types'

export const categoriesApi = {
    getAll: async (): Promise<Category[]> => {
        const response = await api.get<Category[]>('/api/v1/categories')
        if (response.success && response.data) {
            return response.data
        }
        throw new Error(response.error || 'Failed to fetch categories')
    },

    getByType: async (type: 'income' | 'expense'): Promise<Category[]> => {
        const response = await api.get<Category[]>('/api/v1/categories', { type })
        if (response.success && response.data) {
            return response.data
        }
        throw new Error(response.error || 'Failed to fetch categories')
    },
}
```

### Step 2: Modal Component

Create `src/components/Modal.tsx`:

```tsx
// ============================================
// Modal Component
// ============================================

import { useEffect, useRef } from 'react'

interface ModalProps {
    isOpen: boolean
    onClose: () => void
    title: string
    children: React.ReactNode
    size?: 'sm' | 'md' | 'lg'
}

export function Modal({ isOpen, onClose, title, children, size = 'md' }: ModalProps) {
    const modalRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose()
        }

        if (isOpen) {
            document.addEventListener('keydown', handleEscape)
            document.body.style.overflow = 'hidden'
        }

        return () => {
            document.removeEventListener('keydown', handleEscape)
            document.body.style.overflow = 'unset'
        }
    }, [isOpen, onClose])

    if (!isOpen) return null

    const sizeClasses = {
        sm: 'max-w-md',
        md: 'max-w-lg',
        lg: 'max-w-2xl',
    }

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="flex min-h-full items-center justify-center p-4">
                <div
                    ref={modalRef}
                    className={`relative bg-white rounded-xl shadow-xl w-full ${sizeClasses[size]} transform transition-all`}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                        <button
                            onClick={onClose}
                            className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-4">{children}</div>
                </div>
            </div>
        </div>
    )
}
```

### Step 3: Transaction Form Component

Create `src/components/TransactionForm.tsx`:

```tsx
// ============================================
// Transaction Form Component
// ============================================

import { useState, useEffect } from 'react'
import { Category, Transaction, TransactionCreate, CategoryType } from '../types'
import { categoriesApi } from '../api/categories'

interface TransactionFormProps {
    transaction?: Transaction
    onSubmit: (data: TransactionCreate) => Promise<void>
    onCancel: () => void
    initialType?: CategoryType
}

export function TransactionForm({ transaction, onSubmit, onCancel, initialType }: TransactionFormProps) {
    const [type, setType] = useState<CategoryType>(transaction?.type || initialType || 'expense')
    const [categoryId, setCategoryId] = useState(transaction?.category_id || '')
    const [amount, setAmount] = useState(transaction?.amount?.toString() || '')
    const [description, setDescription] = useState(transaction?.description || '')
    const [date, setDate] = useState(transaction?.date || new Date().toISOString().split('T')[0])
    const [categories, setCategories] = useState<Category[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {
        loadCategories()
    }, [type])

    const loadCategories = async () => {
        try {
            const data = await categoriesApi.getByType(type)
            setCategories(data)
            if (!categoryId || !data.find(c => c.id === categoryId)) {
                setCategoryId(data[0]?.id || '')
            }
        } catch (err) {
            console.error('Failed to load categories:', err)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        if (!categoryId) {
            setError('Please select a category')
            return
        }

        if (!amount || parseFloat(amount) <= 0) {
            setError('Please enter a valid amount')
            return
        }

        setLoading(true)

        try {
            await onSubmit({
                category_id: categoryId,
                amount: parseFloat(amount),
                description,
                date,
                type,
            })
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to save transaction')
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                    {error}
                </div>
            )}

            {/* Type Toggle */}
            <div>
                <label className="label">Type</label>
                <div className="flex rounded-lg overflow-hidden border border-gray-300">
                    <button
                        type="button"
                        onClick={() => setType('income')}
                        className={`flex-1 py-2 px-4 text-sm font-medium transition-colors ${
                            type === 'income'
                                ? 'bg-green-500 text-white'
                                : 'bg-white text-gray-700 hover:bg-gray-50'
                        }`}
                    >
                        💰 Income
                    </button>
                    <button
                        type="button"
                        onClick={() => setType('expense')}
                        className={`flex-1 py-2 px-4 text-sm font-medium transition-colors ${
                            type === 'expense'
                                ? 'bg-red-500 text-white'
                                : 'bg-white text-gray-700 hover:bg-gray-50'
                        }`}
                    >
                        💸 Expense
                    </button>
                </div>
            </div>

            {/* Category */}
            <div>
                <label htmlFor="category" className="label">Category</label>
                <select
                    id="category"
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="input"
                    required
                >
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                            {category.icon} {category.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Amount */}
            <div>
                <label htmlFor="amount" className="label">Amount</label>
                <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                    <input
                        id="amount"
                        type="number"
                        step="0.01"
                        min="0.01"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="input pl-8"
                        placeholder="0.00"
                        required
                    />
                </div>
            </div>

            {/* Date */}
            <div>
                <label htmlFor="date" className="label">Date</label>
                <input
                    id="date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="input"
                    required
                />
            </div>

            {/* Description */}
            <div>
                <label htmlFor="description" className="label">Description (optional)</label>
                <input
                    id="description"
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="input"
                    placeholder="What was this for?"
                    maxLength={500}
                />
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3 pt-4">
                <button
                    type="button"
                    onClick={onCancel}
                    className="btn btn-secondary"
                    disabled={loading}
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                >
                    {loading ? 'Saving...' : transaction ? 'Update' : 'Add Transaction'}
                </button>
            </div>
        </form>
    )
}
```

### Step 4: Transaction List Item Component

Create `src/components/TransactionListItem.tsx`:

```tsx
// ============================================
// Transaction List Item Component
// ============================================

import { Transaction } from '../types'

interface TransactionListItemProps {
    transaction: Transaction
    onEdit: (transaction: Transaction) => void
    onDelete: (transaction: Transaction) => void
}

export function TransactionListItem({ transaction, onEdit, onDelete }: TransactionListItemProps) {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount)
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        })
    }

    return (
        <div className="flex items-center p-4 bg-white rounded-lg border border-gray-100 hover:border-gray-200 transition-colors">
            {/* Icon */}
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'
            }`}>
                <span className="text-xl">{transaction.category_icon}</span>
            </div>

            {/* Details */}
            <div className="ml-4 flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate">
                    {transaction.description || transaction.category_name}
                </p>
                <p className="text-sm text-gray-500">
                    {transaction.category_name} • {formatDate(transaction.date)}
                </p>
            </div>

            {/* Amount */}
            <div className="ml-4 text-right">
                <p className={`font-semibold ${
                    transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                }`}>
                    {transaction.type === 'income' ? '+' : '-'}
                    {formatCurrency(transaction.amount)}
                </p>
            </div>

            {/* Actions */}
            <div className="ml-4 flex items-center space-x-2">
                <button
                    onClick={() => onEdit(transaction)}
                    className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                    title="Edit"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                </button>
                <button
                    onClick={() => onDelete(transaction)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                </button>
            </div>
        </div>
    )
}
```

### Step 5: Transactions Page

Create `src/pages/Transactions.tsx`:

```tsx
// ============================================
// Transactions Page
// ============================================

import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Layout } from '../components/Layout'
import { Modal } from '../components/Modal'
import { TransactionForm } from '../components/TransactionForm'
import { TransactionListItem } from '../components/TransactionListItem'
import { transactionsApi } from '../api/transactions'
import { categoriesApi } from '../api/categories'
import { Transaction, Category, CategoryType, TransactionCreate } from '../types'

export function Transactions() {
    const [searchParams, setSearchParams] = useSearchParams()
    const [transactions, setTransactions] = useState<Transaction[]>([])
    const [categories, setCategories] = useState<Category[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    // Filters
    const [typeFilter, setTypeFilter] = useState<CategoryType | ''>('')
    const [categoryFilter, setCategoryFilter] = useState('')
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')

    // Pagination
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const limit = 10

    // Modal state
    const [showModal, setShowModal] = useState(false)
    const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null)
    const [deleteConfirm, setDeleteConfirm] = useState<Transaction | null>(null)

    // Check URL params for initial type
    const initialType = searchParams.get('type') as CategoryType | null

    useEffect(() => {
        loadCategories()
    }, [])

    useEffect(() => {
        loadTransactions()
    }, [page, typeFilter, categoryFilter, startDate, endDate])

    useEffect(() => {
        if (initialType) {
            setTypeFilter(initialType)
            setShowModal(true)
            setSearchParams({})
        }
    }, [initialType])

    const loadCategories = async () => {
        try {
            const data = await categoriesApi.getAll()
            setCategories(data)
        } catch (err) {
            console.error('Failed to load categories:', err)
        }
    }

    const loadTransactions = async () => {
        try {
            setLoading(true)
            setError(null)

            const result = await transactionsApi.getAll({
                page,
                limit,
                type: typeFilter || undefined,
                categoryId: categoryFilter || undefined,
                startDate: startDate || undefined,
                endDate: endDate || undefined,
            })

            setTransactions(result.transactions)
            setTotalPages(result.pagination.totalPages)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load transactions')
        } finally {
            setLoading(false)
        }
    }

    const handleCreate = async (data: TransactionCreate) => {
        await transactionsApi.create(data)
        setShowModal(false)
        loadTransactions()
    }

    const handleUpdate = async (data: TransactionCreate) => {
        if (!editingTransaction) return
        await transactionsApi.update(editingTransaction.id, data)
        setEditingTransaction(null)
        loadTransactions()
    }

    const handleDelete = async () => {
        if (!deleteConfirm) return
        try {
            await transactionsApi.delete(deleteConfirm.id)
            setDeleteConfirm(null)
            loadTransactions()
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to delete transaction')
        }
    }

    const clearFilters = () => {
        setTypeFilter('')
        setCategoryFilter('')
        setStartDate('')
        setEndDate('')
        setPage(1)
    }

    const hasFilters = typeFilter || categoryFilter || startDate || endDate

    return (
        <Layout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
                        <p className="text-gray-500 mt-1">Manage your income and expenses</p>
                    </div>
                    <button
                        onClick={() => setShowModal(true)}
                        className="btn btn-primary mt-4 sm:mt-0"
                    >
                        + Add Transaction
                    </button>
                </div>

                {/* Filters */}
                <div className="card">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                        <div>
                            <label className="label">Type</label>
                            <select
                                value={typeFilter}
                                onChange={(e) => {
                                    setTypeFilter(e.target.value as CategoryType | '')
                                    setPage(1)
                                }}
                                className="input"
                            >
                                <option value="">All Types</option>
                                <option value="income">Income</option>
                                <option value="expense">Expense</option>
                            </select>
                        </div>

                        <div>
                            <label className="label">Category</label>
                            <select
                                value={categoryFilter}
                                onChange={(e) => {
                                    setCategoryFilter(e.target.value)
                                    setPage(1)
                                }}
                                className="input"
                            >
                                <option value="">All Categories</option>
                                {categories
                                    .filter(c => !typeFilter || c.type === typeFilter)
                                    .map((category) => (
                                        <option key={category.id} value={category.id}>
                                            {category.icon} {category.name}
                                        </option>
                                    ))}
                            </select>
                        </div>

                        <div>
                            <label className="label">Start Date</label>
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => {
                                    setStartDate(e.target.value)
                                    setPage(1)
                                }}
                                className="input"
                            />
                        </div>

                        <div>
                            <label className="label">End Date</label>
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => {
                                    setEndDate(e.target.value)
                                    setPage(1)
                                }}
                                className="input"
                            />
                        </div>

                        <div className="flex items-end">
                            {hasFilters && (
                                <button
                                    onClick={clearFilters}
                                    className="btn btn-secondary w-full"
                                >
                                    Clear Filters
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Error */}
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                        {error}
                    </div>
                )}

                {/* Transaction List */}
                {loading ? (
                    <div className="space-y-3">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="card animate-pulse">
                                <div className="flex items-center">
                                    <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                                    <div className="ml-4 flex-1">
                                        <div className="h-4 bg-gray-200 rounded w-48"></div>
                                        <div className="h-3 bg-gray-200 rounded w-32 mt-2"></div>
                                    </div>
                                    <div className="h-5 bg-gray-200 rounded w-24"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : transactions.length === 0 ? (
                    <div className="card text-center py-12">
                        <span className="text-4xl">📭</span>
                        <h3 className="text-lg font-medium text-gray-900 mt-4">No transactions found</h3>
                        <p className="text-gray-500 mt-2">
                            {hasFilters
                                ? 'Try adjusting your filters'
                                : 'Start by adding your first transaction'}
                        </p>
                        {!hasFilters && (
                            <button
                                onClick={() => setShowModal(true)}
                                className="btn btn-primary mt-4"
                            >
                                Add Transaction
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="space-y-3">
                        {transactions.map((transaction) => (
                            <TransactionListItem
                                key={transaction.id}
                                transaction={transaction}
                                onEdit={setEditingTransaction}
                                onDelete={setDeleteConfirm}
                            />
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-center space-x-2">
                        <button
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="btn btn-secondary disabled:opacity-50"
                        >
                            Previous
                        </button>
                        <span className="text-gray-600">
                            Page {page} of {totalPages}
                        </span>
                        <button
                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages}
                            className="btn btn-secondary disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>

            {/* Add/Edit Modal */}
            <Modal
                isOpen={showModal || !!editingTransaction}
                onClose={() => {
                    setShowModal(false)
                    setEditingTransaction(null)
                }}
                title={editingTransaction ? 'Edit Transaction' : 'Add Transaction'}
            >
                <TransactionForm
                    transaction={editingTransaction || undefined}
                    onSubmit={editingTransaction ? handleUpdate : handleCreate}
                    onCancel={() => {
                        setShowModal(false)
                        setEditingTransaction(null)
                    }}
                    initialType={typeFilter as CategoryType || undefined}
                />
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={!!deleteConfirm}
                onClose={() => setDeleteConfirm(null)}
                title="Delete Transaction"
                size="sm"
            >
                <div className="space-y-4">
                    <p className="text-gray-600">
                        Are you sure you want to delete this transaction? This action cannot be undone.
                    </p>
                    <div className="flex justify-end space-x-3">
                        <button
                            onClick={() => setDeleteConfirm(null)}
                            className="btn btn-secondary"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleDelete}
                            className="btn btn-danger"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </Modal>
        </Layout>
    )
}
```

### Step 6: Update App Routes

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

function Reports() {
    return <div className="p-8"><h1>Reports - Coming tomorrow!</h1></div>
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

### Exercise 1: Add Search
Add a search input that:
- Filters transactions by description
- Debounces input (wait 300ms after typing stops)
- Shows "No results" message when search has no matches

### Exercise 2: Add Bulk Delete
Add functionality to:
- Select multiple transactions with checkboxes
- Show "Delete Selected" button when items are selected
- Confirm and delete all selected transactions

### Exercise 3: Add Export
Add an "Export" button that:
- Exports current filtered transactions to CSV
- Includes all transaction details
- Names file with current date

---

## ❓ Quiz Questions

### Q1: Controlled Forms
Why do we use controlled inputs (value + onChange) instead of uncontrolled inputs (ref)?

**Your Answer**: 


### Q2: Modal Accessibility
What accessibility features should a modal have? (List at least 3)

**Your Answer**: 


### Q3: Pagination
Why do we reset page to 1 when filters change?

**Your Answer**: 


---

## 📝 Bonus Questions (Optional)

### B1: How would you implement optimistic updates (showing changes immediately before API confirms)?

**Your Answer**: 


### B2: How would you handle offline support for transaction creation?

**Your Answer**: 


---

## ✅ Day 33 Checklist

- [ ] Create Categories API client
- [ ] Build Modal component
- [ ] Build TransactionForm component
- [ ] Build TransactionListItem component
- [ ] Create Transactions page with filters
- [ ] Implement CRUD operations
- [ ] Add pagination
- [ ] Add delete confirmation
- [ ] Update App routes
- [ ] Complete Exercise 1 (Search)
- [ ] Complete Exercise 2 (Bulk Delete)
- [ ] Complete Exercise 3 (Export)
- [ ] Answer all quiz questions

---

## 🔗 Next Day Preview
Tomorrow you'll build **Charts & Reports** - adding data visualization with Recharts for financial insights with Tailwind CSS styling.
