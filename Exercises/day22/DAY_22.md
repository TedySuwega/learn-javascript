# Day 22: Components & Props

## 📚 What to Learn Today
- **Topics**: Functional components, props, TypeScript interfaces for props
- **Time**: ~40 minutes reading, ~35 minutes practice
- **Goal**: Master component composition and type-safe props

---

## 📖 Key Concepts

### 1. What are Props?
Props (properties) are how we pass data from parent to child components.

```
┌─────────────────────────────────────┐
│ Parent Component                    │
│                                     │
│   <UserCard name="John" age={25} /> │
│         │         │                 │
│         ▼         ▼                 │
│   ┌─────────────────────┐           │
│   │ Child Component     │           │
│   │ props.name = "John" │           │
│   │ props.age = 25      │           │
│   └─────────────────────┘           │
└─────────────────────────────────────┘
```

**Key Points**:
- Props flow DOWN (parent → child)
- Props are READ-ONLY (cannot be modified)
- Props can be any type (string, number, object, function)

### 2. TypeScript Interfaces for Props
Define the shape of your props for type safety.

```tsx
// Define what props the component expects
interface UserCardProps {
    name: string;
    age: number;
    email?: string;  // Optional prop (?)
}

// Use the interface
function UserCard(props: UserCardProps) {
    return <div>{props.name}</div>;
}
```

### 3. Destructuring Props
Cleaner way to access props.

```tsx
// Without destructuring
function UserCard(props: UserCardProps) {
    return <div>{props.name} is {props.age}</div>;
}

// With destructuring (preferred)
function UserCard({ name, age }: UserCardProps) {
    return <div>{name} is {age}</div>;
}
```

### 4. Default Props
Provide fallback values for optional props.

```tsx
interface ButtonProps {
    text: string;
    color?: string;
    size?: 'small' | 'medium' | 'large';
}

function Button({ text, color = 'blue', size = 'medium' }: ButtonProps) {
    return <button style={{ backgroundColor: color }}>{text}</button>;
}
```

### 5. Children Prop
Special prop for nested content.

```tsx
interface CardProps {
    title: string;
    children: React.ReactNode;  // Any valid React content
}

function Card({ title, children }: CardProps) {
    return (
        <div className="card">
            <h2>{title}</h2>
            <div>{children}</div>
        </div>
    );
}

// Usage
<Card title="Welcome">
    <p>This is the card content!</p>
    <button>Click me</button>
</Card>
```

---

## 💻 Code to Type & Understand

### Step 1: UserCard Component

Create `src/components/UserCard.tsx`:

```tsx
// ============================================
// UserCard Component with TypeScript Props
// ============================================

import React from 'react';

// Define the props interface
interface UserCardProps {
    name: string;
    email: string;
    avatar?: string;
    role?: 'admin' | 'user' | 'guest';
    isOnline?: boolean;
}

// Component with destructured props and defaults
function UserCard({
    name,
    email,
    avatar = 'https://via.placeholder.com/80',
    role = 'user',
    isOnline = false
}: UserCardProps) {
    
    // Role badge color
    const getRoleBadgeColor = () => {
        switch (role) {
            case 'admin': return '#e74c3c';
            case 'user': return '#3498db';
            case 'guest': return '#95a5a6';
            default: return '#95a5a6';
        }
    };

    return (
        <div style={styles.card}>
            {/* Avatar with online indicator */}
            <div style={styles.avatarContainer}>
                <img 
                    src={avatar} 
                    alt={name}
                    style={styles.avatar}
                />
                {isOnline && <span style={styles.onlineIndicator}></span>}
            </div>

            {/* User Info */}
            <div style={styles.info}>
                <h3 style={styles.name}>{name}</h3>
                <p style={styles.email}>{email}</p>
                <span style={{
                    ...styles.badge,
                    backgroundColor: getRoleBadgeColor()
                }}>
                    {role.toUpperCase()}
                </span>
            </div>
        </div>
    );
}

// Styles object
const styles: { [key: string]: React.CSSProperties } = {
    card: {
        display: 'flex',
        alignItems: 'center',
        padding: '20px',
        backgroundColor: '#fff',
        borderRadius: '12px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        marginBottom: '15px',
    },
    avatarContainer: {
        position: 'relative',
        marginRight: '15px',
    },
    avatar: {
        width: '80px',
        height: '80px',
        borderRadius: '50%',
        objectFit: 'cover',
    },
    onlineIndicator: {
        position: 'absolute',
        bottom: '5px',
        right: '5px',
        width: '15px',
        height: '15px',
        backgroundColor: '#2ecc71',
        borderRadius: '50%',
        border: '2px solid white',
    },
    info: {
        flex: 1,
    },
    name: {
        margin: '0 0 5px 0',
        fontSize: '1.2rem',
        color: '#333',
    },
    email: {
        margin: '0 0 10px 0',
        color: '#666',
        fontSize: '0.9rem',
    },
    badge: {
        padding: '4px 12px',
        borderRadius: '20px',
        color: 'white',
        fontSize: '0.75rem',
        fontWeight: 'bold',
    },
};

export default UserCard;
```

### Step 2: ProductCard Component

Create `src/components/ProductCard.tsx`:

```tsx
// ============================================
// ProductCard Component with TypeScript Props
// ============================================

import React from 'react';

// Product interface
interface Product {
    id: number;
    name: string;
    price: number;
    description: string;
    image?: string;
    inStock: boolean;
    category: string;
}

// Props interface
interface ProductCardProps {
    product: Product;
    onAddToCart?: (product: Product) => void;
    showDescription?: boolean;
}

function ProductCard({
    product,
    onAddToCart,
    showDescription = true
}: ProductCardProps) {
    
    const { name, price, description, image, inStock, category } = product;

    const handleAddToCart = () => {
        if (onAddToCart && inStock) {
            onAddToCart(product);
        }
    };

    return (
        <div style={styles.card}>
            {/* Product Image */}
            <div style={styles.imageContainer}>
                <img
                    src={image || 'https://via.placeholder.com/200'}
                    alt={name}
                    style={styles.image}
                />
                {!inStock && (
                    <div style={styles.outOfStock}>Out of Stock</div>
                )}
            </div>

            {/* Product Info */}
            <div style={styles.content}>
                <span style={styles.category}>{category}</span>
                <h3 style={styles.name}>{name}</h3>
                
                {showDescription && (
                    <p style={styles.description}>{description}</p>
                )}

                <div style={styles.footer}>
                    <span style={styles.price}>
                        ${price.toFixed(2)}
                    </span>
                    
                    <button
                        onClick={handleAddToCart}
                        disabled={!inStock}
                        style={{
                            ...styles.button,
                            backgroundColor: inStock ? '#3498db' : '#bdc3c7',
                            cursor: inStock ? 'pointer' : 'not-allowed',
                        }}
                    >
                        {inStock ? 'Add to Cart' : 'Unavailable'}
                    </button>
                </div>
            </div>
        </div>
    );
}

const styles: { [key: string]: React.CSSProperties } = {
    card: {
        backgroundColor: '#fff',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
        transition: 'transform 0.2s',
        maxWidth: '300px',
    },
    imageContainer: {
        position: 'relative',
        height: '200px',
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
    },
    outOfStock: {
        position: 'absolute',
        top: '10px',
        right: '10px',
        backgroundColor: '#e74c3c',
        color: 'white',
        padding: '5px 10px',
        borderRadius: '4px',
        fontSize: '0.8rem',
        fontWeight: 'bold',
    },
    content: {
        padding: '20px',
    },
    category: {
        color: '#3498db',
        fontSize: '0.8rem',
        textTransform: 'uppercase',
        fontWeight: 'bold',
    },
    name: {
        margin: '10px 0',
        fontSize: '1.2rem',
        color: '#333',
    },
    description: {
        color: '#666',
        fontSize: '0.9rem',
        lineHeight: '1.5',
        marginBottom: '15px',
    },
    footer: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    price: {
        fontSize: '1.5rem',
        fontWeight: 'bold',
        color: '#2ecc71',
    },
    button: {
        padding: '10px 20px',
        border: 'none',
        borderRadius: '6px',
        color: 'white',
        fontWeight: 'bold',
        fontSize: '0.9rem',
    },
};

export default ProductCard;
```

### Step 3: Card Container Component (Children Prop)

Create `src/components/Card.tsx`:

```tsx
// ============================================
// Reusable Card Container with Children
// ============================================

import React from 'react';

interface CardProps {
    title?: string;
    subtitle?: string;
    children: React.ReactNode;
    variant?: 'default' | 'outlined' | 'elevated';
    padding?: 'small' | 'medium' | 'large';
}

function Card({
    title,
    subtitle,
    children,
    variant = 'default',
    padding = 'medium'
}: CardProps) {
    
    const getPadding = () => {
        switch (padding) {
            case 'small': return '10px';
            case 'medium': return '20px';
            case 'large': return '30px';
        }
    };

    const getVariantStyles = (): React.CSSProperties => {
        switch (variant) {
            case 'outlined':
                return {
                    border: '2px solid #e0e0e0',
                    boxShadow: 'none',
                };
            case 'elevated':
                return {
                    boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
                };
            default:
                return {
                    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                };
        }
    };

    return (
        <div style={{
            backgroundColor: '#fff',
            borderRadius: '12px',
            padding: getPadding(),
            marginBottom: '20px',
            ...getVariantStyles(),
        }}>
            {title && (
                <div style={{ marginBottom: '15px' }}>
                    <h3 style={{ margin: 0, color: '#333' }}>{title}</h3>
                    {subtitle && (
                        <p style={{ margin: '5px 0 0 0', color: '#666', fontSize: '0.9rem' }}>
                            {subtitle}
                        </p>
                    )}
                </div>
            )}
            {children}
        </div>
    );
}

export default Card;
```

### Step 4: Using All Components in App

Update `src/App.tsx`:

```tsx
// ============================================
// DAY 22 - Using Components with Props
// ============================================

import React from 'react';
import './App.css';
import UserCard from './components/UserCard';
import ProductCard from './components/ProductCard';
import Card from './components/Card';

function App() {
    // Sample data
    const users = [
        { name: 'John Doe', email: 'john@example.com', role: 'admin' as const, isOnline: true },
        { name: 'Jane Smith', email: 'jane@example.com', role: 'user' as const, isOnline: false },
        { name: 'Guest User', email: 'guest@example.com', role: 'guest' as const, isOnline: true },
    ];

    const products = [
        {
            id: 1,
            name: 'Wireless Headphones',
            price: 99.99,
            description: 'High-quality wireless headphones with noise cancellation.',
            inStock: true,
            category: 'Electronics',
        },
        {
            id: 2,
            name: 'Smart Watch',
            price: 199.99,
            description: 'Feature-rich smartwatch with health tracking.',
            inStock: false,
            category: 'Electronics',
        },
    ];

    // Event handler passed as prop
    const handleAddToCart = (product: typeof products[0]) => {
        alert(`Added ${product.name} to cart!`);
    };

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
            <h1>Day 22: Components & Props</h1>

            {/* User Cards Section */}
            <Card title="Team Members" subtitle="Our amazing team" variant="elevated">
                {users.map((user, index) => (
                    <UserCard
                        key={index}
                        name={user.name}
                        email={user.email}
                        role={user.role}
                        isOnline={user.isOnline}
                    />
                ))}
            </Card>

            {/* Product Cards Section */}
            <Card title="Featured Products" variant="outlined">
                <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                    {products.map(product => (
                        <ProductCard
                            key={product.id}
                            product={product}
                            onAddToCart={handleAddToCart}
                        />
                    ))}
                </div>
            </Card>

            {/* Nested Children Example */}
            <Card title="About Props" padding="large">
                <p>Props allow us to:</p>
                <ul>
                    <li>Pass data from parent to child</li>
                    <li>Make components reusable</li>
                    <li>Create type-safe interfaces</li>
                </ul>
            </Card>
        </div>
    );
}

export default App;
```

---

## ✍️ Exercises

### Exercise 1: Create a StatCard Component
Create `src/components/StatCard.tsx` that:
- Accepts props: `title` (string), `value` (number), `icon` (string/emoji), `trend` ('up' | 'down' | 'neutral')
- Displays the value prominently
- Shows a colored arrow based on trend (green up, red down, gray neutral)
- Use TypeScript interface for props

### Exercise 2: Create a Button Component
Create `src/components/Button.tsx` that:
- Accepts props: `text`, `onClick`, `variant` ('primary' | 'secondary' | 'danger'), `disabled`, `fullWidth`
- Styles differently based on variant
- Handles the click event
- All props should be properly typed

### Exercise 3: Create an Alert Component
Create `src/components/Alert.tsx` that:
- Accepts props: `message`, `type` ('success' | 'warning' | 'error' | 'info'), `onClose` (optional callback)
- Shows appropriate icon/color for each type
- Has a close button if `onClose` is provided
- Uses children prop for additional content

---

## ❓ Quiz Questions

### Q1: Props Direction
Can a child component pass props back to its parent? Explain why or why not.

**Your Answer**: 


### Q2: Optional Props
How do you make a prop optional in TypeScript? What's the difference between `name: string` and `name?: string`?

**Your Answer**: 


### Q3: Children Prop
What type should you use for the `children` prop in TypeScript, and why?

**Your Answer**: 


---

## 📝 Bonus Questions (Optional)

### B1: What is the difference between passing `onClick={handleClick}` and `onClick={() => handleClick()}`?

**Your Answer**: 


### B2: Why do we use `as const` when defining role values in the users array?

**Your Answer**: 


---

## ✅ Day 22 Checklist

- [ ] Understand what props are and how they flow
- [ ] Create TypeScript interfaces for props
- [ ] Use destructuring with default values
- [ ] Understand the children prop
- [ ] Create UserCard component
- [ ] Create ProductCard component
- [ ] Create reusable Card container
- [ ] Pass functions as props (event handlers)
- [ ] Complete Exercise 1 (StatCard)
- [ ] Complete Exercise 2 (Button)
- [ ] Complete Exercise 3 (Alert)
- [ ] Answer all quiz questions

---

## 🔗 Next Day Preview
Tomorrow you'll learn about **State & Events** - how to make your components interactive with useState hook and handle user events.
