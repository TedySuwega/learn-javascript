# Day 21: React Introduction & Setup

## 📚 What to Learn Today
- **Topics**: What is React, Virtual DOM, JSX, Create React App with TypeScript
- **Time**: ~40 minutes reading, ~30 minutes practice
- **Goal**: Understand React fundamentals and create your first React component

---

## 📖 Key Concepts

### 1. What is React?
React is a JavaScript library for building user interfaces, created by Facebook.

```
Traditional Web                    React
┌─────────────────┐               ┌─────────────────┐
│ HTML + JS       │               │ Components      │
│ Manual DOM      │               │ Virtual DOM     │
│ manipulation    │               │ Automatic       │
│ Page reloads    │               │ updates         │
└─────────────────┘               └─────────────────┘
```

**Why React?**
- Component-based architecture (reusable pieces)
- Virtual DOM for efficient updates
- Large ecosystem and community
- Used by Facebook, Netflix, Airbnb, and many more

### 2. Virtual DOM
The Virtual DOM is a lightweight copy of the real DOM.

```
User Action → State Change → Virtual DOM Update → Diff → Real DOM Update
                                    ↓
                            Only changed parts
                            are updated!
```

**Benefits**:
- Faster updates (batch changes)
- Automatic optimization
- No manual DOM manipulation needed

### 3. JSX (JavaScript XML)
JSX lets you write HTML-like code in JavaScript.

```jsx
// JSX (what you write)
const element = <h1>Hello, World!</h1>;

// What it becomes (JavaScript)
const element = React.createElement('h1', null, 'Hello, World!');
```

**JSX Rules**:
- Must return a single parent element
- Use `className` instead of `class`
- Use `{}` for JavaScript expressions
- Close all tags (including self-closing like `<img />`)

### 4. Components
Components are reusable pieces of UI.

```jsx
// Functional Component
function Welcome() {
    return <h1>Welcome to React!</h1>;
}

// Using the component
<Welcome />
```

### 5. Create React App with TypeScript
CRA is the official way to start a React project.

```bash
npx create-react-app my-app --template typescript
```

**Project Structure**:
```
my-app/
├── public/
│   └── index.html      # HTML template
├── src/
│   ├── App.tsx         # Main component
│   ├── index.tsx       # Entry point
│   └── App.css         # Styles
├── package.json
└── tsconfig.json       # TypeScript config
```

---

## 💻 Code to Type & Understand

### Step 1: Create React App

```bash
# In your terminal
npx create-react-app finance-tracker-frontend --template typescript
cd finance-tracker-frontend
npm start
```

### Step 2: Understanding the Entry Point

Type this in `src/index.tsx`:

```tsx
// ============================================
// ENTRY POINT - Where React starts
// ============================================

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// Find the root element in index.html
const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);

// Render our App component
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
```

### Step 3: Your First Component

Replace `src/App.tsx` with:

```tsx
// ============================================
// DAY 21 - First React Component
// ============================================

import React from 'react';
import './App.css';

// Simple functional component
function App() {
    // Variables in component
    const appName = "Finance Tracker";
    const currentYear = new Date().getFullYear();
    const features = ["Track Income", "Track Expenses", "View Reports"];

    return (
        <div className="App">
            {/* Header Section */}
            <header className="App-header">
                <h1>{appName}</h1>
                <p>Welcome to your personal finance manager!</p>
            </header>

            {/* Main Content */}
            <main>
                {/* Using JavaScript expressions in JSX */}
                <section>
                    <h2>Features</h2>
                    <ul>
                        {features.map((feature, index) => (
                            <li key={index}>{feature}</li>
                        ))}
                    </ul>
                </section>

                {/* Conditional rendering */}
                <section>
                    <h2>Status</h2>
                    {currentYear >= 2024 ? (
                        <p>✅ App is up to date!</p>
                    ) : (
                        <p>⚠️ Please update the app</p>
                    )}
                </section>
            </main>

            {/* Footer */}
            <footer>
                <p>© {currentYear} {appName}</p>
            </footer>
        </div>
    );
}

export default App;
```

### Step 4: Basic Styling

Replace `src/App.css` with:

```css
/* ============================================
   DAY 21 - Basic React Styles
   ============================================ */

.App {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
}

.App-header {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 40px;
    border-radius: 10px;
    text-align: center;
    margin-bottom: 30px;
}

.App-header h1 {
    margin: 0 0 10px 0;
    font-size: 2.5rem;
}

.App-header p {
    margin: 0;
    opacity: 0.9;
}

main {
    display: grid;
    gap: 20px;
}

section {
    background: #f8f9fa;
    padding: 20px;
    border-radius: 8px;
    border-left: 4px solid #667eea;
}

section h2 {
    margin-top: 0;
    color: #333;
}

ul {
    list-style: none;
    padding: 0;
}

li {
    padding: 10px;
    margin: 5px 0;
    background: white;
    border-radius: 4px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

footer {
    text-align: center;
    margin-top: 40px;
    padding: 20px;
    color: #666;
    border-top: 1px solid #eee;
}
```

### Step 5: Creating a Separate Component

Create `src/components/Greeting.tsx`:

```tsx
// ============================================
// Greeting Component - Separate file
// ============================================

import React from 'react';

function Greeting() {
    const hour = new Date().getHours();
    let greeting: string;

    if (hour < 12) {
        greeting = "Good Morning! ☀️";
    } else if (hour < 18) {
        greeting = "Good Afternoon! 🌤️";
    } else {
        greeting = "Good Evening! 🌙";
    }

    return (
        <div style={{
            padding: '15px',
            background: '#e8f5e9',
            borderRadius: '8px',
            textAlign: 'center',
            marginBottom: '20px'
        }}>
            <h3 style={{ margin: 0 }}>{greeting}</h3>
        </div>
    );
}

export default Greeting;
```

Update `src/App.tsx` to use it:

```tsx
import React from 'react';
import './App.css';
import Greeting from './components/Greeting';

function App() {
    // ... rest of the code

    return (
        <div className="App">
            <Greeting />  {/* Add this line after opening div */}
            {/* ... rest of JSX */}
        </div>
    );
}

export default App;
```

---

## ✍️ Exercises

### Exercise 1: Create a Welcome Component
Create a new component `src/components/Welcome.tsx` that:
- Displays a welcome message
- Shows the current date formatted nicely
- Has a different background color

### Exercise 2: Feature Card Component
Create `src/components/FeatureCard.tsx` that:
- Displays a feature name and description
- Has an icon (use emoji)
- Is styled with a card-like appearance

### Exercise 3: Navigation Component
Create `src/components/Navigation.tsx` that:
- Shows a list of navigation links (Home, Dashboard, Settings)
- Uses a horizontal layout
- Highlights on hover (use CSS)

---

## ❓ Quiz Questions

### Q1: What is the Virtual DOM?
Explain what the Virtual DOM is and why React uses it.

**Your Answer**: 


### Q2: JSX Rules
What are three rules you must follow when writing JSX?

**Your Answer**: 


### Q3: Component Export
Why do we use `export default` at the end of a component file?

**Your Answer**: 


---

## 📝 Bonus Questions (Optional)

### B1: What does `React.StrictMode` do in index.tsx?

**Your Answer**: 


### B2: Why do we need a `key` prop when mapping over arrays in JSX?

**Your Answer**: 


---

## ✅ Day 21 Checklist

- [ ] Understand what React is and why it's useful
- [ ] Understand the Virtual DOM concept
- [ ] Learn JSX syntax and rules
- [ ] Create a new React app with TypeScript
- [ ] Create your first functional component
- [ ] Create a separate component file
- [ ] Import and use components
- [ ] Complete Exercise 1 (Welcome)
- [ ] Complete Exercise 2 (FeatureCard)
- [ ] Complete Exercise 3 (Navigation)
- [ ] Answer all quiz questions

---

## 🔗 Next Day Preview
Tomorrow you'll learn about **Components & Props** - how to pass data between components and create reusable UI pieces with TypeScript interfaces.
