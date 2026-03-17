# Day 23: State & Events

## 📚 What to Learn Today
- **Topics**: useState hook, event handling, controlled inputs
- **Time**: ~45 minutes reading, ~35 minutes practice
- **Goal**: Make components interactive with state management

---

## 📖 Key Concepts

### 1. What is State?
State is data that can change over time and triggers re-renders.

```
Props vs State
┌─────────────────────────────────────────────┐
│ Props                  │ State              │
├────────────────────────┼────────────────────┤
│ Passed from parent     │ Managed internally │
│ Read-only              │ Can be updated     │
│ External data          │ Internal data      │
│ Like function params   │ Like local vars    │
└────────────────────────┴────────────────────┘
```

### 2. useState Hook
The useState hook lets you add state to functional components.

```tsx
import { useState } from 'react';

function Counter() {
    // Declare state variable
    // count = current value
    // setCount = function to update it
    const [count, setCount] = useState(0);  // 0 is initial value

    return (
        <div>
            <p>Count: {count}</p>
            <button onClick={() => setCount(count + 1)}>
                Increment
            </button>
        </div>
    );
}
```

### 3. State Update Rules

```tsx
// ❌ WRONG - Never mutate state directly
count = count + 1;

// ✅ CORRECT - Use the setter function
setCount(count + 1);

// ✅ CORRECT - Use callback for updates based on previous state
setCount(prevCount => prevCount + 1);
```

### 4. Event Handling
React uses camelCase event names.

```tsx
// HTML
<button onclick="handleClick()">

// React
<button onClick={handleClick}>

// Common events:
// onClick, onChange, onSubmit, onFocus, onBlur, onKeyDown, onKeyUp
```

### 5. Controlled Inputs
Input values controlled by React state.

```tsx
function Form() {
    const [name, setName] = useState('');

    return (
        <input
            type="text"
            value={name}                           // Controlled by state
            onChange={(e) => setName(e.target.value)}  // Update state on change
        />
    );
}
```

### 6. TypeScript with Events

```tsx
// Event types
const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    console.log('Clicked!');
};

const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log(event.target.value);
};

const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
};
```

---

## 💻 Code to Type & Understand

### Step 1: Counter Component

Create `src/components/Counter.tsx`:

```tsx
// ============================================
// Counter Component - useState Basics
// ============================================

import React, { useState } from 'react';

function Counter() {
    // Declare state with initial value of 0
    const [count, setCount] = useState<number>(0);
    const [step, setStep] = useState<number>(1);

    // Event handlers
    const increment = () => {
        setCount(prevCount => prevCount + step);
    };

    const decrement = () => {
        setCount(prevCount => prevCount - step);
    };

    const reset = () => {
        setCount(0);
    };

    const handleStepChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(event.target.value) || 1;
        setStep(value);
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>Counter</h2>
            
            {/* Display count */}
            <div style={styles.countDisplay}>
                <span style={{
                    ...styles.count,
                    color: count > 0 ? '#2ecc71' : count < 0 ? '#e74c3c' : '#333'
                }}>
                    {count}
                </span>
            </div>

            {/* Control buttons */}
            <div style={styles.buttons}>
                <button onClick={decrement} style={styles.button}>
                    - {step}
                </button>
                <button onClick={reset} style={styles.resetButton}>
                    Reset
                </button>
                <button onClick={increment} style={styles.button}>
                    + {step}
                </button>
            </div>

            {/* Step input */}
            <div style={styles.stepControl}>
                <label>Step: </label>
                <input
                    type="number"
                    value={step}
                    onChange={handleStepChange}
                    min="1"
                    style={styles.input}
                />
            </div>
        </div>
    );
}

const styles: { [key: string]: React.CSSProperties } = {
    container: {
        padding: '30px',
        backgroundColor: '#fff',
        borderRadius: '12px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
        textAlign: 'center',
        maxWidth: '400px',
        margin: '0 auto',
    },
    title: {
        margin: '0 0 20px 0',
        color: '#333',
    },
    countDisplay: {
        padding: '30px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        marginBottom: '20px',
    },
    count: {
        fontSize: '4rem',
        fontWeight: 'bold',
    },
    buttons: {
        display: 'flex',
        justifyContent: 'center',
        gap: '10px',
        marginBottom: '20px',
    },
    button: {
        padding: '12px 24px',
        fontSize: '1.1rem',
        border: 'none',
        borderRadius: '8px',
        backgroundColor: '#3498db',
        color: 'white',
        cursor: 'pointer',
        fontWeight: 'bold',
    },
    resetButton: {
        padding: '12px 24px',
        fontSize: '1.1rem',
        border: '2px solid #e74c3c',
        borderRadius: '8px',
        backgroundColor: 'transparent',
        color: '#e74c3c',
        cursor: 'pointer',
        fontWeight: 'bold',
    },
    stepControl: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px',
    },
    input: {
        width: '60px',
        padding: '8px',
        fontSize: '1rem',
        border: '2px solid #ddd',
        borderRadius: '6px',
        textAlign: 'center',
    },
};

export default Counter;
```

### Step 2: Form with Controlled Inputs

Create `src/components/ContactForm.tsx`:

```tsx
// ============================================
// Contact Form - Controlled Inputs
// ============================================

import React, { useState } from 'react';

// Form data interface
interface FormData {
    name: string;
    email: string;
    message: string;
    category: string;
    subscribe: boolean;
}

// Initial form state
const initialFormData: FormData = {
    name: '',
    email: '',
    message: '',
    category: 'general',
    subscribe: false,
};

function ContactForm() {
    const [formData, setFormData] = useState<FormData>(initialFormData);
    const [submitted, setSubmitted] = useState<boolean>(false);
    const [errors, setErrors] = useState<Partial<FormData>>({});

    // Generic change handler for all inputs
    const handleChange = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value, type } = event.target;
        
        // Handle checkbox differently
        const newValue = type === 'checkbox' 
            ? (event.target as HTMLInputElement).checked 
            : value;

        setFormData(prev => ({
            ...prev,
            [name]: newValue
        }));

        // Clear error when user types
        if (errors[name as keyof FormData]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    // Validation
    const validate = (): boolean => {
        const newErrors: Partial<FormData> = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }

        if (!formData.message.trim()) {
            newErrors.message = 'Message is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Form submission
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();  // Prevent page reload

        if (validate()) {
            console.log('Form submitted:', formData);
            setSubmitted(true);
            
            // Reset form after 3 seconds
            setTimeout(() => {
                setFormData(initialFormData);
                setSubmitted(false);
            }, 3000);
        }
    };

    // Reset form
    const handleReset = () => {
        setFormData(initialFormData);
        setErrors({});
    };

    if (submitted) {
        return (
            <div style={styles.successMessage}>
                <h2>✅ Thank you!</h2>
                <p>Your message has been sent successfully.</p>
                <p>Name: {formData.name}</p>
                <p>Email: {formData.email}</p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} style={styles.form}>
            <h2 style={styles.title}>Contact Us</h2>

            {/* Name Input */}
            <div style={styles.formGroup}>
                <label style={styles.label}>Name *</label>
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    style={{
                        ...styles.input,
                        borderColor: errors.name ? '#e74c3c' : '#ddd'
                    }}
                />
                {errors.name && <span style={styles.error}>{errors.name}</span>}
            </div>

            {/* Email Input */}
            <div style={styles.formGroup}>
                <label style={styles.label}>Email *</label>
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    style={{
                        ...styles.input,
                        borderColor: errors.email ? '#e74c3c' : '#ddd'
                    }}
                />
                {errors.email && <span style={styles.error}>{errors.email}</span>}
            </div>

            {/* Category Select */}
            <div style={styles.formGroup}>
                <label style={styles.label}>Category</label>
                <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    style={styles.select}
                >
                    <option value="general">General Inquiry</option>
                    <option value="support">Technical Support</option>
                    <option value="feedback">Feedback</option>
                    <option value="other">Other</option>
                </select>
            </div>

            {/* Message Textarea */}
            <div style={styles.formGroup}>
                <label style={styles.label}>Message *</label>
                <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Your message..."
                    rows={4}
                    style={{
                        ...styles.textarea,
                        borderColor: errors.message ? '#e74c3c' : '#ddd'
                    }}
                />
                {errors.message && <span style={styles.error}>{errors.message}</span>}
            </div>

            {/* Subscribe Checkbox */}
            <div style={styles.checkboxGroup}>
                <input
                    type="checkbox"
                    name="subscribe"
                    checked={formData.subscribe}
                    onChange={handleChange}
                    id="subscribe"
                />
                <label htmlFor="subscribe" style={styles.checkboxLabel}>
                    Subscribe to newsletter
                </label>
            </div>

            {/* Buttons */}
            <div style={styles.buttonGroup}>
                <button type="submit" style={styles.submitButton}>
                    Send Message
                </button>
                <button type="button" onClick={handleReset} style={styles.resetButton}>
                    Reset
                </button>
            </div>
        </form>
    );
}

const styles: { [key: string]: React.CSSProperties } = {
    form: {
        maxWidth: '500px',
        margin: '0 auto',
        padding: '30px',
        backgroundColor: '#fff',
        borderRadius: '12px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
    },
    title: {
        margin: '0 0 25px 0',
        color: '#333',
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
    select: {
        width: '100%',
        padding: '12px',
        fontSize: '1rem',
        border: '2px solid #ddd',
        borderRadius: '8px',
        backgroundColor: '#fff',
    },
    textarea: {
        width: '100%',
        padding: '12px',
        fontSize: '1rem',
        border: '2px solid #ddd',
        borderRadius: '8px',
        boxSizing: 'border-box',
        resize: 'vertical',
        fontFamily: 'inherit',
    },
    error: {
        color: '#e74c3c',
        fontSize: '0.85rem',
        marginTop: '5px',
        display: 'block',
    },
    checkboxGroup: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        marginBottom: '25px',
    },
    checkboxLabel: {
        color: '#666',
    },
    buttonGroup: {
        display: 'flex',
        gap: '10px',
    },
    submitButton: {
        flex: 1,
        padding: '14px',
        fontSize: '1rem',
        fontWeight: 'bold',
        border: 'none',
        borderRadius: '8px',
        backgroundColor: '#3498db',
        color: 'white',
        cursor: 'pointer',
    },
    resetButton: {
        padding: '14px 24px',
        fontSize: '1rem',
        fontWeight: 'bold',
        border: '2px solid #95a5a6',
        borderRadius: '8px',
        backgroundColor: 'transparent',
        color: '#95a5a6',
        cursor: 'pointer',
    },
    successMessage: {
        maxWidth: '500px',
        margin: '0 auto',
        padding: '40px',
        backgroundColor: '#d4edda',
        borderRadius: '12px',
        textAlign: 'center',
        color: '#155724',
    },
};

export default ContactForm;
```

### Step 3: Toggle Component

Create `src/components/Toggle.tsx`:

```tsx
// ============================================
// Toggle Component - Boolean State
// ============================================

import React, { useState } from 'react';

interface ToggleProps {
    label: string;
    initialValue?: boolean;
    onChange?: (value: boolean) => void;
}

function Toggle({ label, initialValue = false, onChange }: ToggleProps) {
    const [isOn, setIsOn] = useState<boolean>(initialValue);

    const handleToggle = () => {
        const newValue = !isOn;
        setIsOn(newValue);
        if (onChange) {
            onChange(newValue);
        }
    };

    return (
        <div style={styles.container} onClick={handleToggle}>
            <span style={styles.label}>{label}</span>
            <div style={{
                ...styles.track,
                backgroundColor: isOn ? '#3498db' : '#ddd',
            }}>
                <div style={{
                    ...styles.thumb,
                    transform: isOn ? 'translateX(24px)' : 'translateX(0)',
                }} />
            </div>
            <span style={styles.status}>{isOn ? 'ON' : 'OFF'}</span>
        </div>
    );
}

const styles: { [key: string]: React.CSSProperties } = {
    container: {
        display: 'flex',
        alignItems: 'center',
        gap: '15px',
        padding: '15px',
        backgroundColor: '#fff',
        borderRadius: '8px',
        cursor: 'pointer',
        userSelect: 'none',
    },
    label: {
        flex: 1,
        fontWeight: 'bold',
        color: '#333',
    },
    track: {
        width: '50px',
        height: '26px',
        borderRadius: '13px',
        position: 'relative',
        transition: 'background-color 0.2s',
    },
    thumb: {
        width: '22px',
        height: '22px',
        borderRadius: '50%',
        backgroundColor: '#fff',
        position: 'absolute',
        top: '2px',
        left: '2px',
        transition: 'transform 0.2s',
        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
    },
    status: {
        width: '30px',
        fontSize: '0.85rem',
        color: '#666',
    },
};

export default Toggle;
```

### Step 4: App with All Components

Update `src/App.tsx`:

```tsx
// ============================================
// DAY 23 - State & Events Demo
// ============================================

import React, { useState } from 'react';
import './App.css';
import Counter from './components/Counter';
import ContactForm from './components/ContactForm';
import Toggle from './components/Toggle';

function App() {
    const [darkMode, setDarkMode] = useState(false);
    const [notifications, setNotifications] = useState(true);

    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: darkMode ? '#1a1a2e' : '#f5f5f5',
            padding: '20px',
            transition: 'background-color 0.3s',
        }}>
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                <h1 style={{ 
                    color: darkMode ? '#fff' : '#333',
                    textAlign: 'center',
                    marginBottom: '30px'
                }}>
                    Day 23: State & Events
                </h1>

                {/* Settings Toggles */}
                <div style={{
                    marginBottom: '30px',
                    backgroundColor: darkMode ? '#16213e' : '#fff',
                    padding: '20px',
                    borderRadius: '12px',
                }}>
                    <h3 style={{ color: darkMode ? '#fff' : '#333', marginTop: 0 }}>
                        Settings
                    </h3>
                    <Toggle
                        label="Dark Mode"
                        initialValue={darkMode}
                        onChange={setDarkMode}
                    />
                    <div style={{ height: '10px' }} />
                    <Toggle
                        label="Notifications"
                        initialValue={notifications}
                        onChange={setNotifications}
                    />
                </div>

                {/* Counter */}
                <div style={{ marginBottom: '30px' }}>
                    <Counter />
                </div>

                {/* Contact Form */}
                <ContactForm />
            </div>
        </div>
    );
}

export default App;
```

---

## ✍️ Exercises

### Exercise 1: Todo List Component
Create `src/components/TodoList.tsx` that:
- Has an input to add new todos
- Displays a list of todos
- Each todo has a checkbox to mark complete
- Has a delete button for each todo
- Shows count of remaining todos

### Exercise 2: Temperature Converter
Create `src/components/TemperatureConverter.tsx` that:
- Has an input for Celsius
- Has an input for Fahrenheit
- When one changes, automatically updates the other
- Shows the conversion formula used

### Exercise 3: Character Counter
Create `src/components/CharacterCounter.tsx` that:
- Has a textarea input
- Shows character count in real-time
- Has a max character limit (e.g., 280 for tweets)
- Changes color when approaching/exceeding limit
- Disables submit when over limit

---

## ❓ Quiz Questions

### Q1: State Updates
Why should you use `setCount(prev => prev + 1)` instead of `setCount(count + 1)` when the new state depends on the previous state?

**Your Answer**: 


### Q2: Controlled vs Uncontrolled
What is the difference between a controlled and uncontrolled input in React?

**Your Answer**: 


### Q3: Event Prevention
What does `event.preventDefault()` do in a form's onSubmit handler, and why is it important?

**Your Answer**: 


---

## 📝 Bonus Questions (Optional)

### B1: Why does React batch state updates, and how does this affect your code?

**Your Answer**: 


### B2: What happens if you call `setCount(count + 1)` three times in a row? What about `setCount(prev => prev + 1)` three times?

**Your Answer**: 


---

## ✅ Day 23 Checklist

- [ ] Understand the difference between props and state
- [ ] Use useState hook with TypeScript
- [ ] Handle click events
- [ ] Handle form input changes
- [ ] Create controlled inputs
- [ ] Validate form data
- [ ] Handle form submission
- [ ] Create Counter component
- [ ] Create ContactForm component
- [ ] Create Toggle component
- [ ] Complete Exercise 1 (TodoList)
- [ ] Complete Exercise 2 (TemperatureConverter)
- [ ] Complete Exercise 3 (CharacterCounter)
- [ ] Answer all quiz questions

---

## 🔗 Next Day Preview
Tomorrow you'll learn about **useEffect & API Calls** - how to fetch data from APIs, handle loading states, and manage side effects in React.
