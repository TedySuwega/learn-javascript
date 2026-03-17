# Day 24: useEffect & API Calls

## 📚 What to Learn Today
- **Topics**: useEffect lifecycle, fetching data, loading/error states
- **Time**: ~45 minutes reading, ~40 minutes practice
- **Goal**: Master side effects and data fetching in React

---

## 📖 Key Concepts

### 1. What is useEffect?
useEffect handles side effects in functional components.

```
Side Effects = Operations outside React's rendering:
- Fetching data from APIs
- Setting up subscriptions
- Manually changing the DOM
- Timers (setTimeout, setInterval)
- Logging
```

### 2. useEffect Syntax

```tsx
import { useEffect } from 'react';

useEffect(() => {
    // Effect code runs here
    
    return () => {
        // Cleanup code (optional)
    };
}, [dependencies]);  // When to re-run
```

### 3. Dependency Array

```tsx
// Runs on EVERY render
useEffect(() => {
    console.log('Every render');
});

// Runs ONCE on mount
useEffect(() => {
    console.log('Only on mount');
}, []);

// Runs when 'count' changes
useEffect(() => {
    console.log('Count changed:', count);
}, [count]);

// Runs when 'a' OR 'b' changes
useEffect(() => {
    console.log('a or b changed');
}, [a, b]);
```

### 4. Effect Lifecycle

```
Component Mount    →  Effect Runs
        ↓
State/Props Change →  Cleanup Runs → Effect Runs Again
        ↓
Component Unmount  →  Cleanup Runs
```

### 5. Fetching Data Pattern

```tsx
function UserList() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoading(true);
                const response = await fetch('/api/users');
                if (!response.ok) throw new Error('Failed to fetch');
                const data = await response.json();
                setUsers(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Unknown error');
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;
    return <ul>{users.map(u => <li key={u.id}>{u.name}</li>)}</ul>;
}
```

### 6. Cleanup Function
Prevents memory leaks and stale data.

```tsx
useEffect(() => {
    const controller = new AbortController();

    fetch('/api/data', { signal: controller.signal })
        .then(res => res.json())
        .then(data => setData(data));

    // Cleanup: Cancel fetch if component unmounts
    return () => controller.abort();
}, []);
```

---

## 💻 Code to Type & Understand

### Step 1: User List with API

Create `src/components/UserList.tsx`:

```tsx
// ============================================
// UserList - Fetching Data from API
// ============================================

import React, { useState, useEffect } from 'react';

// User interface
interface User {
    id: number;
    name: string;
    email: string;
    company: {
        name: string;
    };
}

function UserList() {
    // State for data, loading, and error
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>('');

    // Fetch users on component mount
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoading(true);
                setError(null);

                // Using JSONPlaceholder API
                const response = await fetch(
                    'https://jsonplaceholder.typicode.com/users'
                );

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data: User[] = await response.json();
                setUsers(data);
            } catch (err) {
                const message = err instanceof Error ? err.message : 'Failed to fetch users';
                setError(message);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);  // Empty array = run once on mount

    // Filter users based on search
    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Loading state
    if (loading) {
        return (
            <div style={styles.container}>
                <div style={styles.loading}>
                    <div style={styles.spinner}></div>
                    <p>Loading users...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div style={styles.container}>
                <div style={styles.error}>
                    <h3>❌ Error</h3>
                    <p>{error}</p>
                    <button 
                        onClick={() => window.location.reload()}
                        style={styles.retryButton}
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    // Success state
    return (
        <div style={styles.container}>
            <h2 style={styles.title}>User Directory</h2>
            
            {/* Search Input */}
            <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={styles.searchInput}
            />

            {/* Results count */}
            <p style={styles.count}>
                Showing {filteredUsers.length} of {users.length} users
            </p>

            {/* User List */}
            <div style={styles.userList}>
                {filteredUsers.map(user => (
                    <div key={user.id} style={styles.userCard}>
                        <div style={styles.avatar}>
                            {user.name.charAt(0)}
                        </div>
                        <div style={styles.userInfo}>
                            <h3 style={styles.userName}>{user.name}</h3>
                            <p style={styles.userEmail}>{user.email}</p>
                            <span style={styles.company}>
                                🏢 {user.company.name}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {filteredUsers.length === 0 && (
                <p style={styles.noResults}>No users found matching "{searchTerm}"</p>
            )}
        </div>
    );
}

const styles: { [key: string]: React.CSSProperties } = {
    container: {
        maxWidth: '600px',
        margin: '0 auto',
        padding: '20px',
    },
    title: {
        textAlign: 'center',
        color: '#333',
        marginBottom: '20px',
    },
    loading: {
        textAlign: 'center',
        padding: '50px',
    },
    spinner: {
        width: '40px',
        height: '40px',
        border: '4px solid #f3f3f3',
        borderTop: '4px solid #3498db',
        borderRadius: '50%',
        margin: '0 auto 20px',
        animation: 'spin 1s linear infinite',
    },
    error: {
        textAlign: 'center',
        padding: '30px',
        backgroundColor: '#fee',
        borderRadius: '12px',
        color: '#c00',
    },
    retryButton: {
        padding: '10px 20px',
        backgroundColor: '#3498db',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        marginTop: '10px',
    },
    searchInput: {
        width: '100%',
        padding: '12px 16px',
        fontSize: '1rem',
        border: '2px solid #ddd',
        borderRadius: '8px',
        marginBottom: '15px',
        boxSizing: 'border-box',
    },
    count: {
        color: '#666',
        marginBottom: '15px',
    },
    userList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
    },
    userCard: {
        display: 'flex',
        alignItems: 'center',
        padding: '20px',
        backgroundColor: '#fff',
        borderRadius: '12px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    },
    avatar: {
        width: '50px',
        height: '50px',
        borderRadius: '50%',
        backgroundColor: '#3498db',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.5rem',
        fontWeight: 'bold',
        marginRight: '15px',
    },
    userInfo: {
        flex: 1,
    },
    userName: {
        margin: '0 0 5px 0',
        color: '#333',
    },
    userEmail: {
        margin: '0 0 5px 0',
        color: '#666',
        fontSize: '0.9rem',
    },
    company: {
        fontSize: '0.85rem',
        color: '#888',
    },
    noResults: {
        textAlign: 'center',
        color: '#666',
        padding: '20px',
    },
};

export default UserList;
```

### Step 2: Post Detail with Dynamic Fetch

Create `src/components/PostDetail.tsx`:

```tsx
// ============================================
// PostDetail - Fetch based on prop change
// ============================================

import React, { useState, useEffect } from 'react';

interface Post {
    id: number;
    title: string;
    body: string;
    userId: number;
}

interface Comment {
    id: number;
    name: string;
    email: string;
    body: string;
}

interface PostDetailProps {
    postId: number;
}

function PostDetail({ postId }: PostDetailProps) {
    const [post, setPost] = useState<Post | null>(null);
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch post when postId changes
    useEffect(() => {
        const controller = new AbortController();

        const fetchPost = async () => {
            try {
                setLoading(true);
                setError(null);

                // Fetch post and comments in parallel
                const [postRes, commentsRes] = await Promise.all([
                    fetch(`https://jsonplaceholder.typicode.com/posts/${postId}`, {
                        signal: controller.signal
                    }),
                    fetch(`https://jsonplaceholder.typicode.com/posts/${postId}/comments`, {
                        signal: controller.signal
                    })
                ]);

                if (!postRes.ok || !commentsRes.ok) {
                    throw new Error('Failed to fetch post data');
                }

                const postData = await postRes.json();
                const commentsData = await commentsRes.json();

                setPost(postData);
                setComments(commentsData);
            } catch (err) {
                if (err instanceof Error && err.name !== 'AbortError') {
                    setError(err.message);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchPost();

        // Cleanup: abort fetch if postId changes or component unmounts
        return () => controller.abort();
    }, [postId]);  // Re-run when postId changes

    if (loading) {
        return <div style={styles.loading}>Loading post #{postId}...</div>;
    }

    if (error || !post) {
        return <div style={styles.error}>Error: {error || 'Post not found'}</div>;
    }

    return (
        <div style={styles.container}>
            <article style={styles.post}>
                <h2 style={styles.title}>{post.title}</h2>
                <p style={styles.body}>{post.body}</p>
            </article>

            <section style={styles.commentsSection}>
                <h3>Comments ({comments.length})</h3>
                {comments.map(comment => (
                    <div key={comment.id} style={styles.comment}>
                        <strong>{comment.name}</strong>
                        <span style={styles.email}>{comment.email}</span>
                        <p>{comment.body}</p>
                    </div>
                ))}
            </section>
        </div>
    );
}

const styles: { [key: string]: React.CSSProperties } = {
    container: {
        maxWidth: '700px',
        margin: '0 auto',
    },
    loading: {
        textAlign: 'center',
        padding: '40px',
        color: '#666',
    },
    error: {
        textAlign: 'center',
        padding: '40px',
        color: '#e74c3c',
        backgroundColor: '#fee',
        borderRadius: '8px',
    },
    post: {
        backgroundColor: '#fff',
        padding: '30px',
        borderRadius: '12px',
        marginBottom: '20px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    },
    title: {
        margin: '0 0 15px 0',
        color: '#333',
        textTransform: 'capitalize',
    },
    body: {
        color: '#666',
        lineHeight: '1.6',
    },
    commentsSection: {
        backgroundColor: '#f8f9fa',
        padding: '20px',
        borderRadius: '12px',
    },
    comment: {
        backgroundColor: '#fff',
        padding: '15px',
        borderRadius: '8px',
        marginBottom: '10px',
    },
    email: {
        color: '#3498db',
        fontSize: '0.85rem',
        marginLeft: '10px',
    },
};

export default PostDetail;
```

### Step 3: Timer with Cleanup

Create `src/components/Timer.tsx`:

```tsx
// ============================================
// Timer - useEffect with Cleanup
// ============================================

import React, { useState, useEffect } from 'react';

function Timer() {
    const [seconds, setSeconds] = useState(0);
    const [isRunning, setIsRunning] = useState(false);

    // Timer effect with cleanup
    useEffect(() => {
        let intervalId: NodeJS.Timeout;

        if (isRunning) {
            intervalId = setInterval(() => {
                setSeconds(prev => prev + 1);
            }, 1000);
        }

        // Cleanup: clear interval when isRunning changes or component unmounts
        return () => {
            if (intervalId) {
                clearInterval(intervalId);
            }
        };
    }, [isRunning]);

    // Format time as MM:SS
    const formatTime = (totalSeconds: number): string => {
        const mins = Math.floor(totalSeconds / 60);
        const secs = totalSeconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handleStartStop = () => {
        setIsRunning(prev => !prev);
    };

    const handleReset = () => {
        setIsRunning(false);
        setSeconds(0);
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>Stopwatch</h2>
            
            <div style={styles.display}>
                {formatTime(seconds)}
            </div>

            <div style={styles.buttons}>
                <button
                    onClick={handleStartStop}
                    style={{
                        ...styles.button,
                        backgroundColor: isRunning ? '#e74c3c' : '#2ecc71',
                    }}
                >
                    {isRunning ? 'Stop' : 'Start'}
                </button>
                <button
                    onClick={handleReset}
                    style={styles.resetButton}
                >
                    Reset
                </button>
            </div>
        </div>
    );
}

const styles: { [key: string]: React.CSSProperties } = {
    container: {
        textAlign: 'center',
        padding: '30px',
        backgroundColor: '#fff',
        borderRadius: '12px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
        maxWidth: '300px',
        margin: '0 auto',
    },
    title: {
        margin: '0 0 20px 0',
        color: '#333',
    },
    display: {
        fontSize: '4rem',
        fontFamily: 'monospace',
        fontWeight: 'bold',
        color: '#333',
        padding: '20px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        marginBottom: '20px',
    },
    buttons: {
        display: 'flex',
        gap: '10px',
        justifyContent: 'center',
    },
    button: {
        padding: '12px 30px',
        fontSize: '1.1rem',
        fontWeight: 'bold',
        border: 'none',
        borderRadius: '8px',
        color: 'white',
        cursor: 'pointer',
    },
    resetButton: {
        padding: '12px 30px',
        fontSize: '1.1rem',
        fontWeight: 'bold',
        border: '2px solid #95a5a6',
        borderRadius: '8px',
        backgroundColor: 'transparent',
        color: '#95a5a6',
        cursor: 'pointer',
    },
};

export default Timer;
```

### Step 4: App with All Components

Update `src/App.tsx`:

```tsx
// ============================================
// DAY 24 - useEffect & API Calls
// ============================================

import React, { useState } from 'react';
import './App.css';
import UserList from './components/UserList';
import PostDetail from './components/PostDetail';
import Timer from './components/Timer';

function App() {
    const [selectedPostId, setSelectedPostId] = useState(1);
    const [activeTab, setActiveTab] = useState<'users' | 'posts' | 'timer'>('users');

    return (
        <div style={styles.app}>
            <h1 style={styles.title}>Day 24: useEffect & API Calls</h1>

            {/* Tab Navigation */}
            <div style={styles.tabs}>
                <button
                    onClick={() => setActiveTab('users')}
                    style={{
                        ...styles.tab,
                        backgroundColor: activeTab === 'users' ? '#3498db' : '#fff',
                        color: activeTab === 'users' ? '#fff' : '#333',
                    }}
                >
                    Users
                </button>
                <button
                    onClick={() => setActiveTab('posts')}
                    style={{
                        ...styles.tab,
                        backgroundColor: activeTab === 'posts' ? '#3498db' : '#fff',
                        color: activeTab === 'posts' ? '#fff' : '#333',
                    }}
                >
                    Posts
                </button>
                <button
                    onClick={() => setActiveTab('timer')}
                    style={{
                        ...styles.tab,
                        backgroundColor: activeTab === 'timer' ? '#3498db' : '#fff',
                        color: activeTab === 'timer' ? '#fff' : '#333',
                    }}
                >
                    Timer
                </button>
            </div>

            {/* Content */}
            <div style={styles.content}>
                {activeTab === 'users' && <UserList />}
                
                {activeTab === 'posts' && (
                    <div>
                        <div style={styles.postSelector}>
                            <label>Select Post: </label>
                            <select
                                value={selectedPostId}
                                onChange={(e) => setSelectedPostId(Number(e.target.value))}
                                style={styles.select}
                            >
                                {[1, 2, 3, 4, 5].map(id => (
                                    <option key={id} value={id}>Post #{id}</option>
                                ))}
                            </select>
                        </div>
                        <PostDetail postId={selectedPostId} />
                    </div>
                )}
                
                {activeTab === 'timer' && <Timer />}
            </div>
        </div>
    );
}

const styles: { [key: string]: React.CSSProperties } = {
    app: {
        maxWidth: '900px',
        margin: '0 auto',
        padding: '20px',
    },
    title: {
        textAlign: 'center',
        color: '#333',
        marginBottom: '30px',
    },
    tabs: {
        display: 'flex',
        justifyContent: 'center',
        gap: '10px',
        marginBottom: '30px',
    },
    tab: {
        padding: '12px 24px',
        fontSize: '1rem',
        fontWeight: 'bold',
        border: '2px solid #3498db',
        borderRadius: '8px',
        cursor: 'pointer',
        transition: 'all 0.2s',
    },
    content: {
        minHeight: '400px',
    },
    postSelector: {
        textAlign: 'center',
        marginBottom: '20px',
    },
    select: {
        padding: '10px 20px',
        fontSize: '1rem',
        borderRadius: '6px',
        border: '2px solid #ddd',
        marginLeft: '10px',
    },
};

export default App;
```

---

## ✍️ Exercises

### Exercise 1: Weather Component
Create `src/components/Weather.tsx` that:
- Fetches weather data from a public API (use wttr.in or similar)
- Shows loading spinner while fetching
- Displays temperature, conditions, and location
- Has a refresh button to re-fetch data
- Handles errors gracefully

### Exercise 2: Infinite Scroll Posts
Create `src/components/InfiniteScroll.tsx` that:
- Fetches posts from JSONPlaceholder
- Loads 10 posts initially
- Loads more when user scrolls to bottom
- Shows loading indicator when fetching more
- Uses useEffect with scroll event listener (remember cleanup!)

### Exercise 3: Auto-Save Form
Create `src/components/AutoSaveForm.tsx` that:
- Has a text input for notes
- Auto-saves to localStorage after 2 seconds of no typing (debounce)
- Shows "Saving..." indicator
- Loads saved content on mount
- Uses useEffect for the debounce timer

---

## ❓ Quiz Questions

### Q1: Dependency Array
What's the difference between `useEffect(() => {}, [])` and `useEffect(() => {})`?

**Your Answer**: 


### Q2: Cleanup Function
Why is the cleanup function important when fetching data? What problem does it solve?

**Your Answer**: 


### Q3: Multiple useEffects
Is it better to have one useEffect with multiple responsibilities or multiple useEffects with single responsibilities? Why?

**Your Answer**: 


---

## 📝 Bonus Questions (Optional)

### B1: What is the "stale closure" problem in useEffect, and how do you avoid it?

**Your Answer**: 


### B2: Why can't we make the useEffect callback function async directly (e.g., `useEffect(async () => {})`)?

**Your Answer**: 


---

## ✅ Day 24 Checklist

- [ ] Understand what useEffect is for
- [ ] Know when effects run based on dependencies
- [ ] Implement data fetching with loading/error states
- [ ] Use cleanup functions properly
- [ ] Handle AbortController for fetch cancellation
- [ ] Create UserList component
- [ ] Create PostDetail component
- [ ] Create Timer component with cleanup
- [ ] Complete Exercise 1 (Weather)
- [ ] Complete Exercise 2 (InfiniteScroll)
- [ ] Complete Exercise 3 (AutoSaveForm)
- [ ] Answer all quiz questions

---

## 🔗 Next Day Preview
Tomorrow you'll learn about **React Router & Forms** - how to create multi-page applications with navigation and handle complex form scenarios.
