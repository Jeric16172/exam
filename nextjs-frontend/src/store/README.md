# Store Directory

## Overview
The `store` directory contains state management logic for the application. This directory houses global state management, context providers, and state-related utilities that manage application-wide data flow and state synchronization.

## Structure
```
store/
├── index.ts              # Main store configuration and exports
├── auth-store.ts         # Authentication state management
├── chat-store.ts         # Chat and messaging state
├── theme-store.ts        # Theme and UI state
├── user-store.ts         # User profile and preferences
├── ui-store.ts           # UI component state (modals, notifications)
├── middleware/           # Store middleware and enhancers
│   ├── persistence.ts    # State persistence middleware
│   ├── logger.ts         # Development logging middleware
│   └── api-sync.ts       # API synchronization middleware
├── providers/            # React context providers
│   ├── auth-provider.tsx
│   ├── chat-provider.tsx
│   └── theme-provider.tsx
├── hooks/                # Store-specific hooks
│   ├── use-auth-store.ts
│   ├── use-chat-store.ts
│   └── use-theme-store.ts
├── types/                # Store type definitions
│   ├── auth.ts
│   ├── chat.ts
│   └── ui.ts
└── utils/                # Store utility functions
    ├── selectors.ts
    ├── actions.ts
    └── reducers.ts
```

## State Management Architecture

### Core State Stores

### 1. Authentication Store (`auth-store.ts`)
**Purpose**: Manages user authentication state, tokens, and session management.

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthUser, LoginCredentials, RegisterData } from '@/types/auth';
import { apiClient } from '@/lib/api';
import { STORAGE_KEYS } from '@/lib/constants';

interface AuthState {
  // State
  user: AuthUser | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  
  // Actions
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  refreshAuth: () => Promise<void>;
  updateProfile: (updates: Partial<AuthUser>) => Promise<void>;
  clearError: () => void;
  
  // Selectors
  getUser: () => AuthUser | null;
  isLoading: () => boolean;
  getError: () => string | null;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      loading: false,
      error: null,

      // Actions
      login: async (credentials) => {
        try {
          set({ loading: true, error: null });
          
          const response = await apiClient.post<{
            user: AuthUser;
            token: string;
            refreshToken: string;
          }>('/auth/login', credentials);
          
          const { user, token, refreshToken } = response.data;
          
          // Set auth token for future requests
          apiClient.setAuthToken(token);
          
          set({
            user,
            token,
            refreshToken,
            isAuthenticated: true,
            loading: false,
            error: null,
          });
        } catch (error) {
          set({
            loading: false,
            error: error instanceof Error ? error.message : 'Login failed',
          });
          throw error;
        }
      },

      logout: () => {
        apiClient.removeAuthToken();
        set({
          user: null,
          token: null,
          refreshToken: null,
          isAuthenticated: false,
          loading: false,
          error: null,
        });
      },

      // ... other actions
    }),
    {
      name: STORAGE_KEYS.AUTH_TOKEN,
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
```

### 2. Chat Store (`chat-store.ts`)
**Purpose**: Manages chat rooms, messages, and real-time communication state.

```typescript
import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { ChatRoom, ChatMessage, TypingIndicator } from '@/types/chat';
import { apiClient } from '@/lib/api';

interface ChatState {
  // State
  rooms: ChatRoom[];
  activeRoomId: string | null;
  messages: Record<string, ChatMessage[]>;
  typingUsers: TypingIndicator[];
  onlineUsers: string[];
  loading: boolean;
  error: string | null;
  
  // Actions
  loadRooms: () => Promise<void>;
  selectRoom: (roomId: string) => void;
  sendMessage: (roomId: string, content: string) => Promise<void>;
  loadMessages: (roomId: string, offset?: number) => Promise<void>;
  markAsRead: (roomId: string, messageId: string) => Promise<void>;
  setTyping: (roomId: string, isTyping: boolean) => void;
  updateOnlineUsers: (users: string[]) => void;
  updateTypingUsers: (typingUsers: TypingIndicator[]) => void;
  
  // Selectors
  getActiveRoom: () => ChatRoom | null;
  getRoomMessages: (roomId: string) => ChatMessage[];
  getUnreadCount: () => number;
  isUserTyping: (userId: string, roomId: string) => boolean;
}

export const useChatStore = create<ChatState>()(
  subscribeWithSelector((set, get) => ({
    // Initial state
    rooms: [],
    activeRoomId: null,
    messages: {},
    typingUsers: [],
    onlineUsers: [],
    loading: false,
    error: null,

    // Actions
    loadRooms: async () => {
      try {
        set({ loading: true, error: null });
        
        const response = await apiClient.get<ChatRoom[]>('/chat/rooms');
        
        set({
          rooms: response.data,
          loading: false,
          error: null,
        });
      } catch (error) {
        set({
          loading: false,
          error: error instanceof Error ? error.message : 'Failed to load rooms',
        });
      }
    },

    sendMessage: async (roomId, content) => {
      try {
        const response = await apiClient.post<ChatMessage>(`/chat/rooms/${roomId}/messages`, {
          content,
        });
        
        // Optimistically add message to state
        set((state) => ({
          messages: {
            ...state.messages,
            [roomId]: [...(state.messages[roomId] || []), response.data],
          },
        }));
      } catch (error) {
        set({
          error: error instanceof Error ? error.message : 'Failed to send message',
        });
      }
    },

    // ... other actions and selectors
  }))
);
```

### 3. Theme Store (`theme-store.ts`)
**Purpose**: Manages application theme, UI preferences, and visual settings.

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ThemeMode } from '@/types/common';
import { STORAGE_KEYS } from '@/lib/constants';

interface ThemeState {
  // State
  mode: ThemeMode;
  systemTheme: 'light' | 'dark';
  customColors: Record<string, string>;
  fontSize: 'sm' | 'md' | 'lg';
  reducedMotion: boolean;
  
  // Actions
  setMode: (mode: ThemeMode) => void;
  setSystemTheme: (theme: 'light' | 'dark') => void;
  setCustomColor: (key: string, value: string) => void;
  setFontSize: (size: 'sm' | 'md' | 'lg') => void;
  setReducedMotion: (reduced: boolean) => void;
  resetToDefaults: () => void;
  
  // Selectors
  getActiveTheme: () => 'light' | 'dark';
  getThemeConfig: () => Record<string, any>;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      // Initial state
      mode: 'light',
      systemTheme: 'light',
      customColors: {},
      fontSize: 'md',
      reducedMotion: false,

      // Actions
      setMode: (mode) => {
        set({ mode });
        applyTheme(get().getActiveTheme());
      },

      getActiveTheme: () => {
        const { mode, systemTheme } = get();
        return mode === 'auto' ? systemTheme : mode;
      },

      // ... other actions
    }),
    {
      name: STORAGE_KEYS.THEME,
    }
  )
);
```

### 4. UI Store (`ui-store.ts`)
**Purpose**: Manages transient UI state like modals, notifications, and loading states.

```typescript
import { create } from 'zustand';

interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
  action?: {
    label: string;
    handler: () => void;
  };
}

interface UIState {
  // State
  notifications: Notification[];
  modals: Modal[];
  loading: Record<string, boolean>;
  sidebarOpen: boolean;
  
  // Actions
  showNotification: (notification: Omit<Notification, 'id'>) => void;
  hideNotification: (id: string) => void;
  clearNotifications: () => void;
  openModal: (modal: Omit<Modal, 'id'>) => string;
  closeModal: (id: string) => void;
  setLoading: (key: string, loading: boolean) => void;
  toggleSidebar: () => void;
  
  // Selectors
  isLoading: (key: string) => boolean;
  getNotifications: () => Notification[];
}

export const useUIStore = create<UIState>((set, get) => ({
  // Initial state
  notifications: [],
  modals: [],
  loading: {},
  sidebarOpen: false,

  // Actions
  showNotification: (notification) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newNotification = { ...notification, id };
    
    set((state) => ({
      notifications: [...state.notifications, newNotification],
    }));
    
    // Auto-hide after duration
    if (notification.duration !== 0) {
      setTimeout(() => {
        get().hideNotification(id);
      }, notification.duration || 5000);
    }
  },

  // ... other actions
}));
```

## Context Providers

### React Context Providers for Store Integration

```typescript
// providers/auth-provider.tsx
import { createContext, useContext, useEffect, ReactNode } from 'react';
import { useAuthStore } from '@/store/auth-store';

interface AuthContextValue {
  initializeAuth: () => Promise<void>;
  hasPermission: (permission: string) => boolean;
  hasRole: (role: string) => boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const authStore = useAuthStore();
  
  useEffect(() => {
    // Initialize auth on app start
    if (authStore.token) {
      authStore.refreshAuth().catch(() => {
        authStore.logout();
      });
    }
  }, []);

  const contextValue: AuthContextValue = {
    initializeAuth: async () => {
      try {
        await authStore.refreshAuth();
      } catch (error) {
        console.error('Auth initialization failed:', error);
      }
    },
    
    hasPermission: (permission: string) => {
      return authStore.user?.permissions.includes(permission) || false;
    },
    
    hasRole: (role: string) => {
      return authStore.user?.roles.includes(role) || false;
    },
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}
```

## Store Hooks

### Custom Hooks for Store Integration

```typescript
// hooks/use-auth-store.ts
import { useAuthStore } from '@/store/auth-store';
import { useCallback } from 'react';

export function useAuth() {
  const store = useAuthStore();
  
  const login = useCallback(async (credentials: LoginCredentials) => {
    try {
      await store.login(credentials);
      return { success: true };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Login failed' };
    }
  }, [store]);

  const logout = useCallback(() => {
    store.logout();
  }, [store]);

  return {
    user: store.user,
    isAuthenticated: store.isAuthenticated,
    loading: store.loading,
    error: store.error,
    login,
    logout,
    updateProfile: store.updateProfile,
    clearError: store.clearError,
  };
}
```

## Best Practices

### 1. Store Design
- Keep stores focused on specific domains
- Use proper TypeScript typing
- Implement proper error handling
- Use middleware for cross-cutting concerns

### 2. State Updates
- Use immutable updates
- Batch related updates
- Optimize re-renders with selectors
- Handle async operations properly

### 3. Persistence
- Persist only necessary data
- Handle hydration correctly
- Use versioning for breaking changes
- Implement proper cleanup

### 4. Performance
- Use selectors to prevent unnecessary re-renders
- Implement proper memoization
- Use subscriptions for specific updates
- Monitor store performance

## Integration Examples

### Component Integration
```typescript
import { useAuth } from '@/store/hooks/use-auth-store';
import { useUIStore } from '@/store/ui-store';

function Dashboard() {
  const { user, isAuthenticated } = useAuth();
  const { showNotification } = useUIStore();
  
  if (!isAuthenticated) {
    return <LoginForm />;
  }
  
  return (
    <div>
      <h1>Welcome, {user?.name}!</h1>
      <button onClick={() => showNotification({ type: 'success', title: 'Welcome!' })}>
        Show Notification
      </button>
    </div>
  );
}
```

### API Integration
```typescript
// Middleware for API synchronization
export const apiSyncMiddleware = (store) => (next) => (action) => {
  const result = next(action);
  
  // Sync certain actions with API
  if (action.type === 'updateProfile') {
    // Sync with backend
    apiClient.put('/profile', action.payload);
  }
  
  return result;
};
```

## Testing

### Store Testing
```typescript
import { renderHook, act } from '@testing-library/react-hooks';
import { useAuthStore } from '@/store/auth-store';

test('should handle login correctly', async () => {
  const { result } = renderHook(() => useAuthStore());
  
  await act(async () => {
    await result.current.login({
      email: 'test@example.com',
      password: 'password123',
    });
  });
  
  expect(result.current.isAuthenticated).toBe(true);
  expect(result.current.user).toBeDefined();
});
```

## Registry Integration

### Using Registries with Store
```typescript
// Store can load configuration from registries
export const useConfigStore = create<ConfigState>((set, get) => ({
  config: null,
  
  loadConfig: async () => {
    try {
      const themeConfig = await import('@/registries/themes/default.json');
      const formConfig = await import('@/registries/forms/user-profile.json');
      
      set({
        config: {
          theme: themeConfig.default,
          forms: formConfig.default,
        },
      });
    } catch (error) {
      console.error('Failed to load config:', error);
    }
  },
}));
```

## Usage with Registry System

The store system integrates seamlessly with the registry system:

1. **Theme Store**: Loads theme configurations from `registries/themes/`
2. **Form Store**: Can load form configurations from `registries/forms/`
3. **Component Store**: Manages component state based on `registries/components/`
4. **Validation Store**: Uses validation rules from `registries/validations/`

```typescript
// Example: Loading theme from registry
const themeStore = useThemeStore();
const { data: themeConfig } = useRegistry('themes/default');

useEffect(() => {
  if (themeConfig) {
    themeStore.setMode(themeConfig.type);
  }
}, [themeConfig]);
```

## Related Documentation
- [Components README](../components/README.md) - Using store in components
- [Hooks README](../hooks/README.md) - Custom hooks integration
- [Types README](../types/README.md) - Store type definitions
- [Registries README](../registries/README.md) - Configuration integration
- [Zustand Documentation](https://docs.pmnd.rs/zustand/getting-started/introduction)