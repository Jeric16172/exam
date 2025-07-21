# Hooks Directory

## Overview
The `hooks` directory contains custom React hooks that encapsulate reusable logic, state management, and side effects. These hooks follow React's hooks conventions and provide a clean API for components to consume shared functionality.

## Structure
```
hooks/
├── useRegistry.tsx        # Registry data loading and caching
├── useValidations.tsx     # Form validation logic
├── useAuth.tsx           # Authentication state management
├── useChat.tsx           # Chat functionality
├── useTheme.tsx          # Theme management
├── useLocalStorage.tsx   # Local storage operations
├── useDebounce.tsx       # Debounced values
├── useApi.tsx            # API request handling
└── index.ts              # Barrel exports
```

## Core Hooks

### `useRegistry.tsx`
**Purpose**: Load and cache JSON registry configurations.

**Features**:
- Async loading of registry files
- Caching mechanism
- Error handling
- Loading states
- TypeScript generic support

**Usage**:
```typescript
import { useRegistry } from '@/hooks/useRegistry';

function UserForm() {
  const { data: formConfig, loading, error } = useRegistry<FormRegistry>('forms/user-profile');
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return <DynamicForm config={formConfig} />;
}
```

**Implementation Details**:
```typescript
export function useRegistry<T>(registryPath: string): {
  data: T | null;
  loading: boolean;
  error: string | null;
} {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadRegistry = async () => {
      try {
        const response = await import(`@/registries/${registryPath}.json`);
        setData(response.default);
      } catch (err) {
        setError(`Failed to load registry: ${registryPath}`);
      } finally {
        setLoading(false);
      }
    };

    loadRegistry();
  }, [registryPath]);

  return { data, loading, error };
}
```

### `useValidations.tsx`
**Purpose**: Handle form validation with configurable rules.

**Features**:
- Field-level validation
- Form-level validation
- Custom validation rules
- Error message management
- Real-time validation

**Usage**:
```typescript
import { useValidation } from '@/hooks/useValidations';

function ContactForm() {
  const { errors, validateField, validateForm, clearErrors } = useValidation();
  
  const handleSubmit = (data: FormData) => {
    const isValid = validateForm(data, validationRules);
    if (isValid) {
      // Submit form
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        onChange={(e) => validateField(e.target.value, nameRules, 'name')}
      />
      {errors.name && <span>{errors.name}</span>}
    </form>
  );
}
```

**Validation Rules**:
```typescript
const validationRules = {
  name: [
    { type: 'required', message: 'Name is required' },
    { type: 'minLength', value: 2, message: 'Name must be at least 2 characters' }
  ],
  email: [
    { type: 'required', message: 'Email is required' },
    { type: 'email', message: 'Please enter a valid email' }
  ]
};
```

### `useAuth.tsx`
**Purpose**: Manage authentication state and operations.

**Features**:
- User authentication state
- Login/logout functionality
- Token management
- Protected route logic
- User profile management

**Usage**:
```typescript
import { useAuth } from '@/hooks/useAuth';

function Dashboard() {
  const { user, login, logout, isAuthenticated, loading } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  if (!isAuthenticated) return <LoginForm onLogin={login} />;
  
  return (
    <div>
      <h1>Welcome, {user.name}!</h1>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### `useChat.tsx`
**Purpose**: Handle chat functionality and real-time messaging.

**Features**:
- Message sending/receiving
- Real-time updates
- Chat room management
- Typing indicators
- Message history

**Usage**:
```typescript
import { useChat } from '@/hooks/useChat';

function ChatInterface() {
  const { 
    messages, 
    sendMessage, 
    isTyping, 
    onlineUsers,
    joinRoom,
    leaveRoom 
  } = useChat('room-123');
  
  return (
    <div>
      <MessageList messages={messages} />
      {isTyping && <TypingIndicator />}
      <MessageInput onSend={sendMessage} />
    </div>
  );
}
```

### `useTheme.tsx`
**Purpose**: Manage application theme and styling.

**Features**:
- Theme switching (light/dark/auto)
- Theme persistence
- System theme detection
- CSS custom properties
- Component theme context

**Usage**:
```typescript
import { useTheme } from '@/hooks/useTheme';

function ThemeToggle() {
  const { theme, setTheme, systemTheme } = useTheme();
  
  return (
    <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
      Current theme: {theme}
    </button>
  );
}
```

## Utility Hooks

### `useLocalStorage.tsx`
**Purpose**: Persist state in browser's local storage.

**Features**:
- Automatic serialization/deserialization
- SSR-safe implementation
- Error handling
- TypeScript support

**Usage**:
```typescript
import { useLocalStorage } from '@/hooks/useLocalStorage';

function UserPreferences() {
  const [preferences, setPreferences] = useLocalStorage<UserPrefs>('userPrefs', {
    theme: 'light',
    language: 'en'
  });
  
  return (
    <div>
      <select 
        value={preferences.theme}
        onChange={(e) => setPreferences({...preferences, theme: e.target.value})}
      >
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>
    </div>
  );
}
```

### `useDebounce.tsx`
**Purpose**: Debounce rapidly changing values.

**Features**:
- Configurable delay
- Automatic cleanup
- Performance optimization
- Search optimization

**Usage**:
```typescript
import { useDebounce } from '@/hooks/useDebounce';

function SearchInput() {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  
  useEffect(() => {
    if (debouncedSearchTerm) {
      // Perform search
      searchUsers(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm]);
  
  return (
    <input
      type="text"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      placeholder="Search users..."
    />
  );
}
```

### `useApi.tsx`
**Purpose**: Handle API requests with loading states and error handling.

**Features**:
- Request/response handling
- Loading states
- Error management
- Request cancellation
- Retry logic

**Usage**:
```typescript
import { useApi } from '@/hooks/useApi';

function UserList() {
  const { data: users, loading, error, refetch } = useApi<User[]>('/api/users');
  
  if (loading) return <div>Loading users...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return (
    <div>
      {users?.map(user => (
        <UserCard key={user.id} user={user} />
      ))}
      <button onClick={refetch}>Refresh</button>
    </div>
  );
}
```

## Hook Design Patterns

### 1. State Management Pattern
```typescript
function useCounter(initialValue: number = 0) {
  const [count, setCount] = useState(initialValue);
  
  const increment = useCallback(() => setCount(c => c + 1), []);
  const decrement = useCallback(() => setCount(c => c - 1), []);
  const reset = useCallback(() => setCount(initialValue), [initialValue]);
  
  return { count, increment, decrement, reset };
}
```

### 2. Effect Management Pattern
```typescript
function useWindowSize() {
  const [size, setSize] = useState({ width: 0, height: 0 });
  
  useEffect(() => {
    function updateSize() {
      setSize({ width: window.innerWidth, height: window.innerHeight });
    }
    
    window.addEventListener('resize', updateSize);
    updateSize();
    
    return () => window.removeEventListener('resize', updateSize);
  }, []);
  
  return size;
}
```

### 3. Context Consumer Pattern
```typescript
function useAuth() {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}
```

## Advanced Hook Patterns

### 1. Custom Hook with Reducer
```typescript
function useFormState<T>(initialState: T) {
  const [state, dispatch] = useReducer(formReducer, initialState);
  
  const updateField = useCallback((field: keyof T, value: any) => {
    dispatch({ type: 'UPDATE_FIELD', field, value });
  }, []);
  
  const resetForm = useCallback(() => {
    dispatch({ type: 'RESET', payload: initialState });
  }, [initialState]);
  
  return { state, updateField, resetForm };
}
```

### 2. Hook with Async Operations
```typescript
function useAsyncOperation<T>(
  operation: () => Promise<T>,
  dependencies: React.DependencyList = []
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  const execute = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await operation();
      setData(result);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, dependencies);
  
  return { data, loading, error, execute };
}
```

## TypeScript Integration

### Generic Hooks
```typescript
function useArray<T>(initialArray: T[] = []) {
  const [array, setArray] = useState<T[]>(initialArray);
  
  const push = useCallback((item: T) => {
    setArray(arr => [...arr, item]);
  }, []);
  
  const remove = useCallback((index: number) => {
    setArray(arr => arr.filter((_, i) => i !== index));
  }, []);
  
  return { array, push, remove, setArray };
}
```

### Strongly Typed Hook Return
```typescript
interface UseAuthReturn {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => Promise<void>;
}

function useAuth(): UseAuthReturn {
  // Implementation
}
```

## Best Practices

### 1. Hook Naming
- Always prefix with "use"
- Use descriptive names
- Be consistent with naming conventions

### 2. Dependencies
- Always include dependencies in useEffect
- Use useCallback for stable references
- Use useMemo for expensive calculations

### 3. Error Handling
- Always handle errors gracefully
- Provide meaningful error messages
- Use try-catch blocks for async operations

### 4. Performance
- Memoize expensive operations
- Use useCallback for event handlers
- Avoid unnecessary re-renders

### 5. Testing
- Write unit tests for hooks
- Use @testing-library/react-hooks
- Test edge cases and error conditions

## Registry Integration

### Loading Registry Data
```typescript
function useFormRegistry(formType: string) {
  const { data: formConfig, loading } = useRegistry<FormRegistry>(`forms/${formType}`);
  const { data: validationRules } = useRegistry<ValidationRules>(`validations/${formType}`);
  
  return {
    formConfig,
    validationRules,
    loading
  };
}
```

### Using Registry in Components
```typescript
function DynamicUserForm() {
  const { formConfig, validationRules, loading } = useFormRegistry('user-profile');
  const { validateForm } = useValidation();
  
  if (loading) return <div>Loading form...</div>;
  
  return (
    <form>
      {formConfig?.fields.map(field => (
        <FormField
          key={field.id}
          config={field}
          validation={validationRules?.[field.id]}
        />
      ))}
    </form>
  );
}
```

## Testing Hooks

### Unit Testing
```typescript
import { renderHook, act } from '@testing-library/react-hooks';
import { useCounter } from './useCounter';

test('should increment counter', () => {
  const { result } = renderHook(() => useCounter(0));
  
  act(() => {
    result.current.increment();
  });
  
  expect(result.current.count).toBe(1);
});
```

### Integration Testing
```typescript
test('should validate form correctly', () => {
  const { result } = renderHook(() => useValidation());
  
  const isValid = result.current.validateField('', [
    { type: 'required', message: 'Required' }
  ], 'name');
  
  expect(isValid).toBe(false);
  expect(result.current.errors.name).toBe('Required');
});
```

## Related Documentation
- [Components README](../components/README.md) - Using hooks in components
- [Types README](../types/README.md) - TypeScript interfaces for hooks
- [Registries README](../registries/README.md) - Configuration data
- [React Hooks Documentation](https://react.dev/reference/react)
