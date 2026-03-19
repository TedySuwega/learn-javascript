# Day 35: Polish & Completion

## 📚 What to Learn Today
- **Topics**: Error boundaries, toast notifications, Docker deployment, final polish
- **Time**: ~45 minutes reading, ~60 minutes practice
- **Goal**: Complete and deploy the Finance Tracker application

---

## 📖 Key Concepts

### 1. Application Polish Checklist

```
Polish Areas:
├── Error Handling (error boundaries, user-friendly messages)
├── Loading States (skeletons, spinners)
├── Empty States (helpful guidance)
├── Toast Notifications (success, error feedback)
├── Responsive Design (mobile, tablet, desktop)
└── Docker Deployment (containerization)
```

### 2. Error Boundary Pattern

```tsx
class ErrorBoundary extends React.Component {
    state = { hasError: false }

    static getDerivedStateFromError(error) {
        return { hasError: true }
    }

    componentDidCatch(error, errorInfo) {
        logErrorToService(error, errorInfo)
    }

    render() {
        if (this.state.hasError) {
            return <ErrorFallback />
        }
        return this.props.children
    }
}
```

### 3. Toast Notifications

```
Toast Types:
├── Success (green) - Action completed
├── Error (red) - Something went wrong
├── Warning (yellow) - Attention needed
└── Info (blue) - General information
```

### 4. Docker Deployment

```
Docker Setup:
├── Dockerfile (backend)
├── Dockerfile (frontend)
├── docker-compose.yml (full stack)
└── .dockerignore
```

---

## 💻 Code to Type & Understand

### Step 1: Error Boundary Component

Create `src/components/ErrorBoundary.tsx`:

```tsx
// ============================================
// Error Boundary Component
// ============================================

import { Component, ErrorInfo, ReactNode } from 'react'

interface Props {
    children: ReactNode
    fallback?: ReactNode
}

interface State {
    hasError: boolean
    error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = { hasError: false, error: null }
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error }
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Error caught by boundary:', error, errorInfo)
    }

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback
            }

            return (
                <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
                    <div className="max-w-md w-full text-center">
                        <div className="text-6xl mb-4">😵</div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">
                            Something went wrong
                        </h1>
                        <p className="text-gray-600 mb-6">
                            We're sorry, but something unexpected happened. Please try refreshing the page.
                        </p>
                        <button
                            onClick={() => window.location.reload()}
                            className="btn btn-primary"
                        >
                            Refresh Page
                        </button>
                        {process.env.NODE_ENV === 'development' && this.state.error && (
                            <details className="mt-6 text-left">
                                <summary className="cursor-pointer text-sm text-gray-500">
                                    Error details
                                </summary>
                                <pre className="mt-2 p-4 bg-gray-100 rounded-lg text-xs overflow-auto">
                                    {this.state.error.toString()}
                                </pre>
                            </details>
                        )}
                    </div>
                </div>
            )
        }

        return this.props.children
    }
}
```

### Step 2: Toast Context and Component

Create `src/context/ToastContext.tsx`:

```tsx
// ============================================
// Toast Context
// ============================================

import { createContext, useContext, useState, useCallback, ReactNode } from 'react'

type ToastType = 'success' | 'error' | 'warning' | 'info'

interface Toast {
    id: string
    type: ToastType
    message: string
}

interface ToastContextType {
    toasts: Toast[]
    addToast: (type: ToastType, message: string) => void
    removeToast: (id: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([])

    const addToast = useCallback((type: ToastType, message: string) => {
        const id = Date.now().toString()
        setToasts((prev) => [...prev, { id, type, message }])

        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id))
        }, 5000)
    }, [])

    const removeToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id))
    }, [])

    return (
        <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
            {children}
            <ToastContainer toasts={toasts} removeToast={removeToast} />
        </ToastContext.Provider>
    )
}

export function useToast() {
    const context = useContext(ToastContext)
    if (!context) {
        throw new Error('useToast must be used within ToastProvider')
    }
    return context
}

function ToastContainer({ toasts, removeToast }: { toasts: Toast[]; removeToast: (id: string) => void }) {
    const getToastStyles = (type: ToastType) => {
        switch (type) {
            case 'success':
                return 'bg-green-500 text-white'
            case 'error':
                return 'bg-red-500 text-white'
            case 'warning':
                return 'bg-yellow-500 text-white'
            case 'info':
                return 'bg-blue-500 text-white'
        }
    }

    const getIcon = (type: ToastType) => {
        switch (type) {
            case 'success':
                return '✓'
            case 'error':
                return '✕'
            case 'warning':
                return '⚠'
            case 'info':
                return 'ℹ'
        }
    }

    return (
        <div className="fixed bottom-4 right-4 z-50 space-y-2">
            {toasts.map((toast) => (
                <div
                    key={toast.id}
                    className={`flex items-center p-4 rounded-lg shadow-lg min-w-[300px] animate-slide-in ${getToastStyles(toast.type)}`}
                >
                    <span className="text-lg mr-3">{getIcon(toast.type)}</span>
                    <p className="flex-1">{toast.message}</p>
                    <button
                        onClick={() => removeToast(toast.id)}
                        className="ml-4 hover:opacity-70"
                    >
                        ✕
                    </button>
                </div>
            ))}
        </div>
    )
}
```

Add animation to `src/index.css`:

```css
@keyframes slide-in {
    from {
        transform: translateX(100%);
        opacity: 0;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
}

.animate-slide-in {
    animation: slide-in 0.3s ease-out;
}
```

### Step 3: Backend Dockerfile

Create `backend/Dockerfile`:

```dockerfile
# ============================================
# Finance Tracker Backend Dockerfile
# ============================================

# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build TypeScript
RUN npm run build

# Production stage
FROM node:20-alpine AS production

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies only
RUN npm ci --only=production

# Copy built files
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/db ./db

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

USER nodejs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1

# Start the application
CMD ["node", "dist/index.js"]
```

Create `backend/.dockerignore`:

```
node_modules
dist
*.log
.env
.git
.gitignore
README.md
```

### Step 4: Frontend Dockerfile

Create `frontend/Dockerfile`:

```dockerfile
# ============================================
# Finance Tracker Frontend Dockerfile
# ============================================

# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build for production
RUN npm run build

# Production stage - serve with nginx
FROM nginx:alpine AS production

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built files
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:80 || exit 1

CMD ["nginx", "-g", "daemon off;"]
```

Create `frontend/nginx.conf`:

```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;

    # Handle React Router
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # API proxy (if needed)
    location /api {
        proxy_pass http://backend:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Step 5: Full Stack Docker Compose

Create `docker-compose.yml` in project root:

```yaml
# ============================================
# Finance Tracker - Full Stack Docker Compose
# ============================================

version: '3.8'

services:
  # PostgreSQL Database
  postgres:
    image: postgres:15-alpine
    container_name: finance-tracker-db
    environment:
      POSTGRES_USER: ${DB_USER:-finance_user}
      POSTGRES_PASSWORD: ${DB_PASSWORD:-finance_password}
      POSTGRES_DB: ${DB_NAME:-finance_tracker}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U finance_user -d finance_tracker"]
      interval: 5s
      timeout: 5s
      retries: 5
    networks:
      - finance-network

  # Backend API
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: finance-tracker-api
    environment:
      NODE_ENV: production
      PORT: 3000
      DB_HOST: postgres
      DB_PORT: 5432
      DB_NAME: ${DB_NAME:-finance_tracker}
      DB_USER: ${DB_USER:-finance_user}
      DB_PASSWORD: ${DB_PASSWORD:-finance_password}
      JWT_SECRET: ${JWT_SECRET:-your-super-secret-jwt-key-change-in-production}
      JWT_EXPIRES_IN: ${JWT_EXPIRES_IN:-7d}
    ports:
      - "3000:3000"
    depends_on:
      postgres:
        condition: service_healthy
    healthcheck:
      test: ["CMD", "wget", "--no-verbose", "--tries=1", "--spider", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
    networks:
      - finance-network

  # Frontend
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: finance-tracker-web
    ports:
      - "80:80"
    depends_on:
      - backend
    networks:
      - finance-network

volumes:
  postgres_data:

networks:
  finance-network:
    driver: bridge
```

### Step 6: Deployment Script

Create `deploy.sh` in project root:

```bash
#!/bin/bash

# ============================================
# Finance Tracker Deployment Script
# ============================================

set -e

echo "🚀 Starting Finance Tracker deployment..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker and try again."
    exit 1
fi

# Build and start containers
echo "📦 Building containers..."
docker-compose build

echo "🔄 Starting services..."
docker-compose up -d

# Wait for services to be healthy
echo "⏳ Waiting for services to be ready..."
sleep 10

# Run database migrations
echo "🗄️ Running database migrations..."
docker-compose exec backend npm run db:migrate

# Check health
echo "🏥 Checking service health..."
if curl -s http://localhost:3000/health | grep -q "success"; then
    echo "✅ Backend is healthy"
else
    echo "❌ Backend health check failed"
    exit 1
fi

if curl -s http://localhost:80 | grep -q "html"; then
    echo "✅ Frontend is healthy"
else
    echo "❌ Frontend health check failed"
    exit 1
fi

echo ""
echo "╔════════════════════════════════════════════════╗"
echo "║     🎉 Deployment Complete!                    ║"
echo "║                                                ║"
echo "║     Frontend: http://localhost                 ║"
echo "║     Backend:  http://localhost:3000            ║"
echo "║     API Docs: http://localhost:3000/documentation ║"
echo "╚════════════════════════════════════════════════╝"
```

Make it executable:

```bash
chmod +x deploy.sh
```

### Step 7: Update App with Error Boundary and Toast

Update `src/App.tsx`:

```tsx
// ============================================
// App Component - Final Version
// ============================================

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ToastProvider } from './context/ToastContext'
import { ErrorBoundary } from './components/ErrorBoundary'
import { ProtectedRoute } from './components/ProtectedRoute'
import { Login } from './pages/Login'
import { Register } from './pages/Register'
import { Dashboard } from './pages/Dashboard'
import { Transactions } from './pages/Transactions'
import { Reports } from './pages/Reports'

function App() {
    return (
        <ErrorBoundary>
            <BrowserRouter>
                <AuthProvider>
                    <ToastProvider>
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
                    </ToastProvider>
                </AuthProvider>
            </BrowserRouter>
        </ErrorBoundary>
    )
}

export default App
```

### Step 8: Final Project README

Create `README.md` in project root:

```markdown
# Finance Tracker

A full-stack personal finance management application built with modern technologies.

## Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Fastify
- **Database**: PostgreSQL
- **ORM**: Sequelize (raw SQL)
- **Auth**: JWT + bcrypt

### Frontend
- **Library**: React + TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Routing**: React Router

### DevOps
- **Containerization**: Docker
- **Orchestration**: Docker Compose

## Quick Start

### Prerequisites
- Docker and Docker Compose
- Node.js 20+ (for local development)

### Using Docker (Recommended)

```bash
# Clone the repository
git clone <your-repo-url>
cd finance-tracker

# Start all services
./deploy.sh

# Or manually:
docker-compose up -d
```

### Local Development

**Backend:**
```bash
cd backend
npm install
npm run db:migrate
npm run dev
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

## API Documentation

Visit http://localhost:3000/documentation for Swagger API docs.

## Features

- User authentication (register, login, JWT)
- Transaction management (CRUD)
- Category management
- Financial reports and charts
- Responsive design

## Environment Variables

Create `.env` files based on `.env.example`:

**Backend:**
- `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`
- `JWT_SECRET`, `JWT_EXPIRES_IN`

**Frontend:**
- `VITE_API_URL`

## License

MIT
```

---

## ✍️ Exercises

### Exercise 1: Add Loading Skeleton
Create a reusable `Skeleton` component that:
- Supports different shapes (text, circle, rectangle)
- Has configurable width and height
- Includes pulse animation

### Exercise 2: Add Dark Mode
Implement dark mode support:
- Add toggle in sidebar
- Persist preference in localStorage
- Update all components with dark variants

### Exercise 3: Add PWA Support
Convert the app to a Progressive Web App:
- Add service worker
- Create manifest.json
- Add offline support for viewing cached data

---

## ❓ Quiz Questions

### Q1: Error Boundaries
Why can't we use a function component for error boundaries?

**Your Answer**: 


### Q2: Docker Multi-stage Builds
What are the benefits of using multi-stage Docker builds?

**Your Answer**: 


### Q3: Health Checks
Why do we add health checks to our Docker containers?

**Your Answer**: 


---

## 📝 Bonus Questions (Optional)

### B1: How would you implement CI/CD for this application?

**Your Answer**: 


### B2: What security improvements would you add for a production deployment?

**Your Answer**: 


---

## ✅ Day 35 Checklist

- [ ] Create ErrorBoundary component
- [ ] Create Toast notification system
- [ ] Create Backend Dockerfile
- [ ] Create Frontend Dockerfile
- [ ] Create docker-compose.yml
- [ ] Create deployment script
- [ ] Update App with error handling
- [ ] Create project README
- [ ] Test Docker deployment
- [ ] Complete Exercise 1 (Skeleton)
- [ ] Complete Exercise 2 (Dark Mode)
- [ ] Complete Exercise 3 (PWA)
- [ ] Answer all quiz questions

---

## 🎉 Congratulations!

You've completed the 35-day JavaScript Learning Journey!

### What You've Built
A full-stack Personal Finance Tracker with:
- **Backend**: Fastify + PostgreSQL + Sequelize + JWT auth
- **Frontend**: React + TypeScript + Tailwind CSS + Recharts
- **DevOps**: Docker + Docker Compose

### What You've Learned
- JavaScript/TypeScript fundamentals
- Backend architecture (Repository → Service → Controller)
- Database design and SQL queries
- RESTful API design
- React patterns (Context, Hooks, Protected Routes)
- Modern CSS with Tailwind
- Data visualization with Recharts
- Docker containerization

### Next Steps
1. Deploy to a cloud provider (AWS, DigitalOcean, Railway)
2. Add more features (budgets, goals, recurring transactions)
3. Add unit and integration tests
4. Implement CI/CD pipeline
5. Build your own projects!

---

## 📊 Final Project Summary

```
finance-tracker/
├── backend/
│   ├── src/
│   │   ├── api/v1/
│   │   │   ├── controllers/
│   │   │   ├── services/
│   │   │   └── repositories/
│   │   ├── config/
│   │   ├── plugins/
│   │   ├── types/
│   │   └── index.ts
│   ├── db/migrations/
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── types/
│   │   └── App.tsx
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml
├── deploy.sh
└── README.md
```

**Well done! 🚀**
