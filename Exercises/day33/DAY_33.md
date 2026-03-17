# Day 33: Transaction Management

## 📚 What to Learn Today
- **Topics**: Transaction list, add/edit forms, CRUD operations
- **Time**: ~50 minutes reading, ~50 minutes practice
- **Goal**: Build complete transaction management UI

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

---

## 💻 Code to Type & Understand

### Step 1: Categories API

Create `src/api/categories.ts`:

```typescript
// ============================================
// Categories API
// ============================================

import api from './client';
import { Category } from '../types';

export const categoriesApi = {
    // Get all categories
    getAll: async (): Promise<Category[]> => {
        const response = await api.get<Category[]>('/api/categories');
        if (response.success && response.data) {
            return response.data;
        }
        throw new Error(response.error || 'Failed to fetch categories');
    },

    // Get categories by type
    getByType: async (type: 'income' | 'expense'): Promise<Category[]> => {
        const response = await api.get<Category[]>('/api/categories', { type });
        if (response.success && response.data) {
            return response.data;
        }
        throw new Error(response.error || 'Failed to fetch categories');
    },
};
```

### Step 2: Modal Component

Create `src/components/Modal.tsx`:

```tsx
// ============================================
// Modal Component
// ============================================

import React, { useEffect, useRef } from 'react';
import '../styles/Modal.css';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    size?: 'small' | 'medium' | 'large';
}

function Modal({ isOpen, onClose, title, children, size = 'medium' }: ModalProps) {
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const handleOverlayClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div className="modal-overlay" onClick={handleOverlayClick}>
            <div className={`modal-content ${size}`} ref={modalRef}>
                <div className="modal-header">
                    <h2>{title}</h2>
                    <button className="modal-close" onClick={onClose}>
                        ×
                    </button>
                </div>
                <div className="modal-body">
                    {children}
                </div>
            </div>
        </div>
    );
}

export default Modal;
```

### Step 3: Modal Styles

Create `src/styles/Modal.css`:

```css
/* ============================================
   Modal Styles
   ============================================ */

.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: 20px;
    animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}

.modal-content {
    background: white;
    border-radius: 16px;
    width: 100%;
    max-height: 90vh;
    overflow-y: auto;
    animation: slideUp 0.3s ease;
}

@keyframes slideUp {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.modal-content.small {
    max-width: 400px;
}

.modal-content.medium {
    max-width: 500px;
}

.modal-content.large {
    max-width: 700px;
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 24px;
    border-bottom: 1px solid #eee;
}

.modal-header h2 {
    margin: 0;
    font-size: 1.3rem;
    color: #333;
}

.modal-close {
    width: 36px;
    height: 36px;
    border: none;
    background: #f0f0f0;
    border-radius: 50%;
    font-size: 1.5rem;
    color: #666;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
}

.modal-close:hover {
    background: #e0e0e0;
    color: #333;
}

.modal-body {
    padding: 24px;
}
```

### Step 4: Transaction Form Component

Create `src/components/TransactionForm.tsx`:

```tsx
// ============================================
// Transaction Form Component
// ============================================

import React, { useState, useEffect } from 'react';
import { Transaction, TransactionCreate, Category } from '../types';
import { categoriesApi } from '../api/categories';
import '../styles/TransactionForm.css';

interface TransactionFormProps {
    transaction?: Transaction;
    onSubmit: (data: TransactionCreate) => Promise<void>;
    onCancel: () => void;
}

function TransactionForm({ transaction, onSubmit, onCancel }: TransactionFormProps) {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(false);
    const [loadingCategories, setLoadingCategories] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        type: transaction?.type || 'expense' as 'income' | 'expense',
        category_id: transaction?.category_id || 0,
        amount: transaction?.amount?.toString() || '',
        description: transaction?.description || '',
        date: transaction?.date || new Date().toISOString().split('T')[0],
    });

    const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        // Reset category when type changes
        if (!transaction) {
            setFormData(prev => ({ ...prev, category_id: 0 }));
        }
    }, [formData.type, transaction]);

    const fetchCategories = async () => {
        try {
            const data = await categoriesApi.getAll();
            setCategories(data);
        } catch (err) {
            setError('Failed to load categories');
        } finally {
            setLoadingCategories(false);
        }
    };

    const filteredCategories = categories.filter(c => c.type === formData.type);

    const validate = (): boolean => {
        const errors: { [key: string]: string } = {};

        if (!formData.category_id) {
            errors.category_id = 'Please select a category';
        }

        if (!formData.amount || parseFloat(formData.amount) <= 0) {
            errors.amount = 'Please enter a valid amount';
        }

        if (!formData.date) {
            errors.date = 'Please select a date';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        
        if (formErrors[name]) {
            setFormErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) return;

        try {
            setLoading(true);
            setError(null);

            await onSubmit({
                category_id: formData.category_id,
                amount: parseFloat(formData.amount),
                description: formData.description,
                date: formData.date,
            });
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to save transaction');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="transaction-form">
            {error && <div className="form-error">{error}</div>}

            {/* Type Toggle */}
            <div className="type-toggle">
                <button
                    type="button"
                    className={`type-btn ${formData.type === 'income' ? 'active income' : ''}`}
                    onClick={() => setFormData(prev => ({ ...prev, type: 'income' }))}
                >
                    💰 Income
                </button>
                <button
                    type="button"
                    className={`type-btn ${formData.type === 'expense' ? 'active expense' : ''}`}
                    onClick={() => setFormData(prev => ({ ...prev, type: 'expense' }))}
                >
                    💸 Expense
                </button>
            </div>

            {/* Category */}
            <div className="form-group">
                <label>Category</label>
                {loadingCategories ? (
                    <div className="loading-text">Loading categories...</div>
                ) : (
                    <div className="category-grid">
                        {filteredCategories.map(category => (
                            <button
                                key={category.id}
                                type="button"
                                className={`category-btn ${formData.category_id === category.id ? 'selected' : ''}`}
                                onClick={() => setFormData(prev => ({ ...prev, category_id: category.id }))}
                            >
                                <span className="category-icon">{category.icon}</span>
                                <span className="category-name">{category.name}</span>
                            </button>
                        ))}
                    </div>
                )}
                {formErrors.category_id && (
                    <span className="error-text">{formErrors.category_id}</span>
                )}
            </div>

            {/* Amount */}
            <div className="form-group">
                <label htmlFor="amount">Amount</label>
                <div className="amount-input">
                    <span className="currency">$</span>
                    <input
                        type="number"
                        id="amount"
                        name="amount"
                        value={formData.amount}
                        onChange={handleChange}
                        placeholder="0.00"
                        step="0.01"
                        min="0"
                        className={formErrors.amount ? 'error' : ''}
                    />
                </div>
                {formErrors.amount && (
                    <span className="error-text">{formErrors.amount}</span>
                )}
            </div>

            {/* Date */}
            <div className="form-group">
                <label htmlFor="date">Date</label>
                <input
                    type="date"
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className={formErrors.date ? 'error' : ''}
                />
                {formErrors.date && (
                    <span className="error-text">{formErrors.date}</span>
                )}
            </div>

            {/* Description */}
            <div className="form-group">
                <label htmlFor="description">Description (Optional)</label>
                <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Add a note..."
                    rows={3}
                />
            </div>

            {/* Actions */}
            <div className="form-actions">
                <button type="button" className="btn-cancel" onClick={onCancel}>
                    Cancel
                </button>
                <button type="submit" className="btn-submit" disabled={loading}>
                    {loading ? 'Saving...' : transaction ? 'Update' : 'Add Transaction'}
                </button>
            </div>
        </form>
    );
}

export default TransactionForm;
```

### Step 5: Transaction Form Styles

Create `src/styles/TransactionForm.css`:

```css
/* ============================================
   Transaction Form Styles
   ============================================ */

.transaction-form {
    display: flex;
    flex-direction: column;
    gap: 24px;
}

.form-error {
    background: #fee;
    color: #c00;
    padding: 12px;
    border-radius: 8px;
    text-align: center;
}

/* Type Toggle */
.type-toggle {
    display: flex;
    gap: 10px;
}

.type-btn {
    flex: 1;
    padding: 14px;
    border: 2px solid #e0e0e0;
    background: white;
    border-radius: 10px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
}

.type-btn:hover {
    border-color: #ccc;
}

.type-btn.active.income {
    border-color: #2ecc71;
    background: rgba(46, 204, 113, 0.1);
    color: #2ecc71;
}

.type-btn.active.expense {
    border-color: #e74c3c;
    background: rgba(231, 76, 60, 0.1);
    color: #e74c3c;
}

/* Form Groups */
.form-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.form-group label {
    font-weight: 600;
    color: #333;
}

/* Category Grid */
.category-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    gap: 10px;
}

.category-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    padding: 12px 8px;
    border: 2px solid #e0e0e0;
    background: white;
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.2s;
}

.category-btn:hover {
    border-color: #3498db;
    background: rgba(52, 152, 219, 0.05);
}

.category-btn.selected {
    border-color: #3498db;
    background: rgba(52, 152, 219, 0.1);
}

.category-icon {
    font-size: 1.5rem;
}

.category-name {
    font-size: 0.75rem;
    color: #666;
    text-align: center;
}

/* Amount Input */
.amount-input {
    display: flex;
    align-items: center;
    border: 2px solid #e0e0e0;
    border-radius: 10px;
    overflow: hidden;
}

.amount-input .currency {
    padding: 12px 16px;
    background: #f5f5f5;
    color: #666;
    font-weight: 600;
}

.amount-input input {
    flex: 1;
    padding: 12px;
    border: none;
    font-size: 1.2rem;
    font-weight: 600;
}

.amount-input input:focus {
    outline: none;
}

/* Inputs */
.form-group input[type="date"],
.form-group textarea {
    padding: 12px;
    border: 2px solid #e0e0e0;
    border-radius: 10px;
    font-size: 1rem;
    font-family: inherit;
}

.form-group input:focus,
.form-group textarea:focus {
    outline: none;
    border-color: #3498db;
}

.form-group input.error,
.form-group textarea.error {
    border-color: #e74c3c;
}

.error-text {
    color: #e74c3c;
    font-size: 0.85rem;
}

.loading-text {
    color: #666;
    padding: 20px;
    text-align: center;
}

/* Actions */
.form-actions {
    display: flex;
    gap: 12px;
    padding-top: 10px;
}

.btn-cancel {
    flex: 1;
    padding: 14px;
    border: 2px solid #e0e0e0;
    background: white;
    border-radius: 10px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
}

.btn-cancel:hover {
    background: #f5f5f5;
}

.btn-submit {
    flex: 2;
    padding: 14px;
    border: none;
    background: #3498db;
    color: white;
    border-radius: 10px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
}

.btn-submit:hover:not(:disabled) {
    background: #2980b9;
}

.btn-submit:disabled {
    opacity: 0.7;
    cursor: not-allowed;
}
```

### Step 6: Transactions Page

Create `src/pages/Transactions.tsx`:

```tsx
// ============================================
// Transactions Page
// ============================================

import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import Modal from '../components/Modal';
import TransactionForm from '../components/TransactionForm';
import { transactionsApi } from '../api/transactions';
import { Transaction, TransactionCreate } from '../types';
import '../styles/Transactions.css';

function Transactions() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    // Modal states
    const [showAddModal, setShowAddModal] = useState(false);
    const [editTransaction, setEditTransaction] = useState<Transaction | null>(null);
    const [deleteTransaction, setDeleteTransaction] = useState<Transaction | null>(null);

    // Filter states
    const [filters, setFilters] = useState({
        type: '' as '' | 'income' | 'expense',
        startDate: '',
        endDate: '',
    });

    // Pagination
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const pageSize = 10;

    useEffect(() => {
        fetchTransactions();
    }, [page, filters]);

    const fetchTransactions = async () => {
        try {
            setLoading(true);
            const result = await transactionsApi.getAll({
                ...filters,
                type: filters.type || undefined,
                limit: pageSize,
                offset: (page - 1) * pageSize,
            });
            setTransactions(result.transactions);
            setTotalPages(result.totalPages);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load transactions');
        } finally {
            setLoading(false);
        }
    };

    const handleAddTransaction = async (data: TransactionCreate) => {
        await transactionsApi.create(data);
        setShowAddModal(false);
        fetchTransactions();
    };

    const handleEditTransaction = async (data: TransactionCreate) => {
        if (!editTransaction) return;
        await transactionsApi.update(editTransaction.id, data);
        setEditTransaction(null);
        fetchTransactions();
    };

    const handleDeleteTransaction = async () => {
        if (!deleteTransaction) return;
        await transactionsApi.delete(deleteTransaction.id);
        setDeleteTransaction(null);
        fetchTransactions();
    };

    const formatCurrency = (amount: number): string => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
    };

    const formatDate = (dateString: string): string => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    return (
        <Layout>
            <div className="transactions-page">
                {/* Header */}
                <div className="page-header">
                    <h1>Transactions</h1>
                    <button 
                        className="add-btn"
                        onClick={() => setShowAddModal(true)}
                    >
                        + Add Transaction
                    </button>
                </div>

                {/* Filters */}
                <div className="filters-bar">
                    <select
                        value={filters.type}
                        onChange={(e) => setFilters(prev => ({ 
                            ...prev, 
                            type: e.target.value as '' | 'income' | 'expense' 
                        }))}
                    >
                        <option value="">All Types</option>
                        <option value="income">Income</option>
                        <option value="expense">Expense</option>
                    </select>

                    <input
                        type="date"
                        value={filters.startDate}
                        onChange={(e) => setFilters(prev => ({ ...prev, startDate: e.target.value }))}
                        placeholder="Start Date"
                    />

                    <input
                        type="date"
                        value={filters.endDate}
                        onChange={(e) => setFilters(prev => ({ ...prev, endDate: e.target.value }))}
                        placeholder="End Date"
                    />

                    <button 
                        className="clear-filters"
                        onClick={() => setFilters({ type: '', startDate: '', endDate: '' })}
                    >
                        Clear
                    </button>
                </div>

                {/* Error */}
                {error && (
                    <div className="error-banner">
                        {error}
                        <button onClick={fetchTransactions}>Retry</button>
                    </div>
                )}

                {/* Transactions List */}
                {loading ? (
                    <div className="loading-state">Loading transactions...</div>
                ) : transactions.length === 0 ? (
                    <div className="empty-state">
                        <p>No transactions found</p>
                        <button onClick={() => setShowAddModal(true)}>
                            Add your first transaction
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="transactions-table">
                            <div className="table-header">
                                <span>Category</span>
                                <span>Description</span>
                                <span>Date</span>
                                <span>Amount</span>
                                <span>Actions</span>
                            </div>

                            {transactions.map(transaction => (
                                <div key={transaction.id} className="table-row">
                                    <div className="cell category">
                                        <span className="icon">{transaction.category_icon}</span>
                                        <span>{transaction.category_name}</span>
                                    </div>
                                    <div className="cell description">
                                        {transaction.description || '-'}
                                    </div>
                                    <div className="cell date">
                                        {formatDate(transaction.date)}
                                    </div>
                                    <div className={`cell amount ${transaction.type}`}>
                                        {transaction.type === 'income' ? '+' : '-'}
                                        {formatCurrency(transaction.amount)}
                                    </div>
                                    <div className="cell actions">
                                        <button 
                                            className="edit-btn"
                                            onClick={() => setEditTransaction(transaction)}
                                        >
                                            ✏️
                                        </button>
                                        <button 
                                            className="delete-btn"
                                            onClick={() => setDeleteTransaction(transaction)}
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="pagination">
                                <button 
                                    disabled={page === 1}
                                    onClick={() => setPage(p => p - 1)}
                                >
                                    Previous
                                </button>
                                <span>Page {page} of {totalPages}</span>
                                <button 
                                    disabled={page === totalPages}
                                    onClick={() => setPage(p => p + 1)}
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </>
                )}

                {/* Add Modal */}
                <Modal
                    isOpen={showAddModal}
                    onClose={() => setShowAddModal(false)}
                    title="Add Transaction"
                >
                    <TransactionForm
                        onSubmit={handleAddTransaction}
                        onCancel={() => setShowAddModal(false)}
                    />
                </Modal>

                {/* Edit Modal */}
                <Modal
                    isOpen={!!editTransaction}
                    onClose={() => setEditTransaction(null)}
                    title="Edit Transaction"
                >
                    {editTransaction && (
                        <TransactionForm
                            transaction={editTransaction}
                            onSubmit={handleEditTransaction}
                            onCancel={() => setEditTransaction(null)}
                        />
                    )}
                </Modal>

                {/* Delete Confirmation */}
                <Modal
                    isOpen={!!deleteTransaction}
                    onClose={() => setDeleteTransaction(null)}
                    title="Delete Transaction"
                    size="small"
                >
                    <div className="delete-confirm">
                        <p>Are you sure you want to delete this transaction?</p>
                        <p className="delete-details">
                            {deleteTransaction?.category_icon} {deleteTransaction?.category_name} - {' '}
                            {deleteTransaction && formatCurrency(deleteTransaction.amount)}
                        </p>
                        <div className="delete-actions">
                            <button 
                                className="btn-cancel"
                                onClick={() => setDeleteTransaction(null)}
                            >
                                Cancel
                            </button>
                            <button 
                                className="btn-delete"
                                onClick={handleDeleteTransaction}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </Modal>
            </div>
        </Layout>
    );
}

export default Transactions;
```

### Step 7: Transactions Page Styles

Create `src/styles/Transactions.css`:

```css
/* ============================================
   Transactions Page Styles
   ============================================ */

.transactions-page {
    max-width: 1200px;
    margin: 0 auto;
}

.page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
}

.page-header h1 {
    margin: 0;
    color: #333;
}

.add-btn {
    padding: 12px 24px;
    background: #3498db;
    color: white;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s;
}

.add-btn:hover {
    background: #2980b9;
}

/* Filters */
.filters-bar {
    display: flex;
    gap: 12px;
    margin-bottom: 24px;
    flex-wrap: wrap;
}

.filters-bar select,
.filters-bar input {
    padding: 10px 16px;
    border: 2px solid #e0e0e0;
    border-radius: 8px;
    font-size: 0.95rem;
}

.filters-bar select:focus,
.filters-bar input:focus {
    outline: none;
    border-color: #3498db;
}

.clear-filters {
    padding: 10px 16px;
    background: #f5f5f5;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    color: #666;
}

.clear-filters:hover {
    background: #e0e0e0;
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

/* Loading & Empty States */
.loading-state,
.empty-state {
    text-align: center;
    padding: 60px 20px;
    background: white;
    border-radius: 12px;
    color: #666;
}

.empty-state button {
    margin-top: 16px;
    padding: 12px 24px;
    background: #3498db;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
}

/* Transactions Table */
.transactions-table {
    background: white;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.table-header {
    display: grid;
    grid-template-columns: 2fr 2fr 1fr 1.5fr 100px;
    gap: 16px;
    padding: 16px 20px;
    background: #f8f9fa;
    font-weight: 600;
    color: #666;
    font-size: 0.9rem;
}

.table-row {
    display: grid;
    grid-template-columns: 2fr 2fr 1fr 1.5fr 100px;
    gap: 16px;
    padding: 16px 20px;
    border-bottom: 1px solid #f0f0f0;
    align-items: center;
    transition: background 0.2s;
}

.table-row:hover {
    background: #f8f9fa;
}

.table-row:last-child {
    border-bottom: none;
}

.cell {
    display: flex;
    align-items: center;
}

.cell.category {
    gap: 10px;
}

.cell.category .icon {
    font-size: 1.3rem;
}

.cell.description {
    color: #666;
}

.cell.date {
    color: #888;
    font-size: 0.9rem;
}

.cell.amount {
    font-weight: 700;
    font-size: 1.05rem;
}

.cell.amount.income {
    color: #2ecc71;
}

.cell.amount.expense {
    color: #e74c3c;
}

.cell.actions {
    gap: 8px;
}

.edit-btn,
.delete-btn {
    width: 36px;
    height: 36px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 1rem;
    transition: all 0.2s;
}

.edit-btn {
    background: rgba(52, 152, 219, 0.1);
}

.edit-btn:hover {
    background: rgba(52, 152, 219, 0.2);
}

.delete-btn {
    background: rgba(231, 76, 60, 0.1);
}

.delete-btn:hover {
    background: rgba(231, 76, 60, 0.2);
}

/* Pagination */
.pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 20px;
    margin-top: 24px;
}

.pagination button {
    padding: 10px 20px;
    border: 2px solid #e0e0e0;
    background: white;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s;
}

.pagination button:hover:not(:disabled) {
    border-color: #3498db;
    color: #3498db;
}

.pagination button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.pagination span {
    color: #666;
}

/* Delete Confirmation */
.delete-confirm {
    text-align: center;
}

.delete-confirm p {
    margin: 0 0 16px 0;
    color: #333;
}

.delete-details {
    font-size: 1.1rem;
    font-weight: 600;
    padding: 16px;
    background: #f8f9fa;
    border-radius: 8px;
}

.delete-actions {
    display: flex;
    gap: 12px;
    margin-top: 24px;
}

.delete-actions .btn-cancel {
    flex: 1;
    padding: 12px;
    border: 2px solid #e0e0e0;
    background: white;
    border-radius: 8px;
    cursor: pointer;
}

.delete-actions .btn-delete {
    flex: 1;
    padding: 12px;
    border: none;
    background: #e74c3c;
    color: white;
    border-radius: 8px;
    cursor: pointer;
}

/* Responsive */
@media (max-width: 768px) {
    .table-header {
        display: none;
    }

    .table-row {
        grid-template-columns: 1fr;
        gap: 8px;
    }

    .cell.actions {
        justify-content: flex-end;
    }
}
```

---

## ✍️ Exercises

### Exercise 1: Add Search Functionality
Add a search input that:
- Filters transactions by description
- Debounces the search input
- Highlights matching text

### Exercise 2: Add Bulk Delete
Implement bulk delete that:
- Adds checkboxes to each row
- Shows "Select All" option
- Confirms before deleting multiple

### Exercise 3: Add Export Feature
Add an export button that:
- Exports filtered transactions to CSV
- Includes all visible columns
- Names file with date range

---

## ❓ Quiz Questions

### Q1: Controlled Forms
Why do we use controlled inputs (value + onChange) instead of uncontrolled inputs?

**Your Answer**: 


### Q2: Modal Accessibility
What accessibility features should a modal have?

**Your Answer**: 


### Q3: Optimistic Updates
What are optimistic updates and when would you use them?

**Your Answer**: 


---

## 📝 Bonus Questions (Optional)

### B1: How would you implement undo functionality for deleted transactions?

**Your Answer**: 


### B2: How would you handle offline transaction creation?

**Your Answer**: 


---

## ✅ Day 33 Checklist

- [ ] Create Categories API
- [ ] Build Modal component
- [ ] Build TransactionForm component
- [ ] Build Transactions page with list
- [ ] Implement create transaction
- [ ] Implement edit transaction
- [ ] Implement delete transaction
- [ ] Add filters (type, date range)
- [ ] Add pagination
- [ ] Complete Exercise 1 (Search)
- [ ] Complete Exercise 2 (Bulk Delete)
- [ ] Complete Exercise 3 (Export)
- [ ] Answer all quiz questions

---

## 🔗 Next Day Preview
Tomorrow you'll build **Charts & Reports** - adding data visualization with Recharts for financial insights.
