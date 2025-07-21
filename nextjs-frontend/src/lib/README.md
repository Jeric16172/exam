# Lib Directory

## Overview
The `lib` directory contains utility functions, configuration files, shared constants, and helper modules that are used throughout the application. This directory serves as the foundation for common functionality that doesn't fit into specific feature areas.

## Structure
```
lib/
├── utils.ts           # General utility functions
├── constants.ts       # Application-wide constants
├── api.ts            # API client configuration and helpers
├── auth.ts           # Authentication utilities
├── validation.ts     # Validation helpers and schemas
├── storage.ts        # Local storage utilities
├── date.ts           # Date formatting and manipulation
├── string.ts         # String manipulation utilities
├── array.ts          # Array utility functions
├── object.ts         # Object manipulation utilities
├── file.ts           # File handling utilities
├── theme.ts          # Theme utilities and helpers
├── registry.ts       # Registry loading and validation
└── types.ts          # Utility types and type guards
```

## Core Utilities

### `utils.ts` - General Utilities
**Purpose**: Common utility functions used across the application.

```typescript
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combines and merges Tailwind CSS classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Generates a unique ID
 */
export function generateId(prefix: string = 'id'): string {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}-${Date.now()}`;
}

/**
 * Debounces a function call
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Throttles a function call
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

/**
 * Sleeps for a specified duration
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Capitalizes the first letter of a string
 */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Truncates text to a specified length
 */
export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.substring(0, length) + '...';
}

/**
 * Formats bytes to human readable format
 */
export function formatBytes(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

/**
 * Copies text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy text: ', err);
    return false;
  }
}
```

### `constants.ts` - Application Constants
**Purpose**: Centralized constants used throughout the application.

```typescript
// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
} as const;

// App Configuration
export const APP_CONFIG = {
  NAME: 'Usapp',
  VERSION: '1.0.0',
  DESCRIPTION: 'User Management Application',
  AUTHOR: 'Your Company',
  HOMEPAGE: 'https://usapp.com',
} as const;

// Theme Configuration
export const THEME_CONFIG = {
  DEFAULT_THEME: 'light',
  STORAGE_KEY: 'usapp-theme',
  BREAKPOINTS: {
    xs: '475px',
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
} as const;

// Form Configuration
export const FORM_CONFIG = {
  DEBOUNCE_DELAY: 300,
  VALIDATION_DELAY: 500,
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  ALLOWED_FILE_TYPES: ['application/pdf', 'text/plain', 'application/docx'],
} as const;

// Chat Configuration
export const CHAT_CONFIG = {
  MESSAGE_LIMIT: 50,
  TYPING_TIMEOUT: 3000,
  RECONNECT_DELAY: 2000,
  MAX_RECONNECT_ATTEMPTS: 5,
  FILE_UPLOAD_LIMIT: 25 * 1024 * 1024, // 25MB
} as const;

// Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth-token',
  REFRESH_TOKEN: 'refresh-token',
  USER_PREFERENCES: 'user-preferences',
  THEME: 'theme',
  LANGUAGE: 'language',
  CHAT_SETTINGS: 'chat-settings',
} as const;

// Routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
  SETTINGS: '/settings',
  CHAT: '/chat',
  USERS: '/users',
  HELP: '/help',
} as const;

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;

// Asset Paths
export const ASSETS = {
  AVATARS: {
    DEFAULT: '/assets/avatars/default-img.jpg',
    MALE: '/assets/avatars/default-img-male.jpg',
    FEMALE: '/assets/avatars/default-img-female.jpg',
  },
  ICONS: {
    CHAT: '/assets/icons/chat.svg',
    NOTIFICATION: '/assets/icons/notification.svg',
    USER: '/assets/icons/user.svg',
  },
  IMAGES: {
    LOGO: '/assets/images/logo.svg',
    HERO: '/assets/images/hero.jpg',
    PLACEHOLDER: '/assets/images/placeholder.svg',
  },
} as const;

// Validation Rules
export const VALIDATION_RULES = {
  PASSWORD: {
    MIN_LENGTH: 8,
    MAX_LENGTH: 128,
    PATTERN: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
  },
  USERNAME: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 30,
    PATTERN: /^[a-zA-Z0-9_]+$/,
  },
  EMAIL: {
    PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  PHONE: {
    PATTERN: /^[\+]?[1-9][\d]{0,15}$/,
  },
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  GENERIC: 'Something went wrong. Please try again.',
  NETWORK: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  VALIDATION: 'Please check your input and try again.',
  FILE_SIZE: 'File size exceeds the maximum limit.',
  FILE_TYPE: 'File type is not supported.',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  SAVE: 'Changes saved successfully.',
  DELETE: 'Item deleted successfully.',
  UPDATE: 'Updated successfully.',
  CREATE: 'Created successfully.',
  UPLOAD: 'File uploaded successfully.',
} as const;
```

### `api.ts` - API Client
**Purpose**: HTTP client configuration and API request helpers.

```typescript
import { API_CONFIG, HTTP_STATUS } from './constants';
import type { ApiResponse, ApiError } from '@/types/api';

class ApiClient {
  private baseURL: string;
  private timeout: number;
  private defaultHeaders: Record<string, string>;

  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
    this.timeout = API_CONFIG.TIMEOUT;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
  }

  private async request<T>(
    url: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(`${this.baseURL}${url}`, {
        ...options,
        headers: {
          ...this.defaultHeaders,
          ...options.headers,
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  async get<T>(url: string, params?: Record<string, any>): Promise<ApiResponse<T>> {
    const searchParams = params ? new URLSearchParams(params).toString() : '';
    const fullUrl = searchParams ? `${url}?${searchParams}` : url;
    
    return this.request<T>(fullUrl, {
      method: 'GET',
    });
  }

  async post<T>(url: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(url, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(url: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(url, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(url: string): Promise<ApiResponse<T>> {
    return this.request<T>(url, {
      method: 'DELETE',
    });
  }

  async patch<T>(url: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(url, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  setAuthToken(token: string): void {
    this.defaultHeaders.Authorization = `Bearer ${token}`;
  }

  removeAuthToken(): void {
    delete this.defaultHeaders.Authorization;
  }

  async uploadFile<T>(
    url: string,
    file: File,
    additionalData?: Record<string, any>
  ): Promise<ApiResponse<T>> {
    const formData = new FormData();
    formData.append('file', file);
    
    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        formData.append(key, value);
      });
    }

    return this.request<T>(url, {
      method: 'POST',
      body: formData,
      headers: {
        // Remove Content-Type to let browser set it with boundary
        ...Object.fromEntries(
          Object.entries(this.defaultHeaders).filter(([key]) => key !== 'Content-Type')
        ),
      },
    });
  }
}

export const apiClient = new ApiClient();

// Helper functions
export async function handleApiError(error: unknown): Promise<ApiError> {
  if (error instanceof Error) {
    return {
      message: error.message,
      code: 'UNKNOWN_ERROR',
    };
  }
  
  return {
    message: 'An unexpected error occurred',
    code: 'UNKNOWN_ERROR',
  };
}

export function isApiError(error: unknown): error is ApiError {
  return typeof error === 'object' && error !== null && 'message' in error;
}
```

### `validation.ts` - Validation Utilities
**Purpose**: Form validation helpers and schema validation.

```typescript
import { ValidationRule } from '@/types/form';
import { VALIDATION_RULES } from './constants';

export class ValidationError extends Error {
  constructor(
    message: string,
    public field: string,
    public code: string
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}

export function validateField(
  value: any,
  rules: ValidationRule[]
): string | null {
  for (const rule of rules) {
    const error = validateSingleRule(value, rule);
    if (error) return error;
  }
  return null;
}

export function validateSingleRule(
  value: any,
  rule: ValidationRule
): string | null {
  switch (rule.type) {
    case 'required':
      if (!value || (typeof value === 'string' && value.trim() === '')) {
        return rule.message;
      }
      break;
      
    case 'email':
      if (value && !VALIDATION_RULES.EMAIL.PATTERN.test(value)) {
        return rule.message;
      }
      break;
      
    case 'minLength':
      if (value && value.length < (rule.value as number)) {
        return rule.message.replace('{min}', rule.value?.toString() || '');
      }
      break;
      
    case 'maxLength':
      if (value && value.length > (rule.value as number)) {
        return rule.message.replace('{max}', rule.value?.toString() || '');
      }
      break;
      
    case 'pattern':
      const regex = new RegExp(rule.value as string);
      if (value && !regex.test(value)) {
        return rule.message;
      }
      break;
      
    case 'custom':
      if (typeof rule.value === 'function') {
        const isValid = rule.value(value);
        if (!isValid) {
          return rule.message;
        }
      }
      break;
  }
  
  return null;
}

export function validateForm(
  data: Record<string, any>,
  validationRules: Record<string, ValidationRule[]>
): { isValid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {};
  
  Object.entries(validationRules).forEach(([fieldName, rules]) => {
    const fieldValue = data[fieldName];
    const error = validateField(fieldValue, rules);
    if (error) {
      errors[fieldName] = error;
    }
  });
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

// Specific validation functions
export function validateEmail(email: string): boolean {
  return VALIDATION_RULES.EMAIL.PATTERN.test(email);
}

export function validatePassword(password: string): boolean {
  return password.length >= VALIDATION_RULES.PASSWORD.MIN_LENGTH &&
         password.length <= VALIDATION_RULES.PASSWORD.MAX_LENGTH &&
         VALIDATION_RULES.PASSWORD.PATTERN.test(password);
}

export function validateUsername(username: string): boolean {
  return username.length >= VALIDATION_RULES.USERNAME.MIN_LENGTH &&
         username.length <= VALIDATION_RULES.USERNAME.MAX_LENGTH &&
         VALIDATION_RULES.USERNAME.PATTERN.test(username);
}

export function validatePhone(phone: string): boolean {
  return VALIDATION_RULES.PHONE.PATTERN.test(phone);
}

export function validateFileSize(file: File, maxSize: number): boolean {
  return file.size <= maxSize;
}

export function validateFileType(file: File, allowedTypes: string[]): boolean {
  return allowedTypes.includes(file.type);
}
```

### `date.ts` - Date Utilities
**Purpose**: Date formatting and manipulation helpers.

```typescript
export function formatDate(date: Date | string, format: string = 'short'): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  switch (format) {
    case 'short':
      return dateObj.toLocaleDateString();
    case 'long':
      return dateObj.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    case 'time':
      return dateObj.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      });
    case 'datetime':
      return dateObj.toLocaleString();
    case 'relative':
      return formatRelativeTime(dateObj);
    default:
      return dateObj.toLocaleDateString();
  }
}

export function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  
  if (diffInMinutes < 1) return 'Just now';
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays}d ago`;
  
  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) return `${diffInWeeks}w ago`;
  
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) return `${diffInMonths}mo ago`;
  
  const diffInYears = Math.floor(diffInDays / 365);
  return `${diffInYears}y ago`;
}

export function isToday(date: Date): boolean {
  const today = new Date();
  return date.toDateString() === today.toDateString();
}

export function isYesterday(date: Date): boolean {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return date.toDateString() === yesterday.toDateString();
}

export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export function startOfDay(date: Date): Date {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
}

export function endOfDay(date: Date): Date {
  const result = new Date(date);
  result.setHours(23, 59, 59, 999);
  return result;
}
```

### `storage.ts` - Storage Utilities
**Purpose**: Local storage and session storage helpers.

```typescript
import { STORAGE_KEYS } from './constants';

export class StorageManager {
  private static instance: StorageManager;
  private storage: Storage;

  private constructor(storage: Storage) {
    this.storage = storage;
  }

  static getInstance(type: 'local' | 'session' = 'local'): StorageManager {
    if (!StorageManager.instance) {
      const storage = type === 'local' ? localStorage : sessionStorage;
      StorageManager.instance = new StorageManager(storage);
    }
    return StorageManager.instance;
  }

  setItem<T>(key: string, value: T): void {
    try {
      const serializedValue = JSON.stringify(value);
      this.storage.setItem(key, serializedValue);
    } catch (error) {
      console.error('Error saving to storage:', error);
    }
  }

  getItem<T>(key: string): T | null {
    try {
      const item = this.storage.getItem(key);
      if (item === null) return null;
      return JSON.parse(item);
    } catch (error) {
      console.error('Error reading from storage:', error);
      return null;
    }
  }

  removeItem(key: string): void {
    try {
      this.storage.removeItem(key);
    } catch (error) {
      console.error('Error removing from storage:', error);
    }
  }

  clear(): void {
    try {
      this.storage.clear();
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  }

  key(index: number): string | null {
    try {
      return this.storage.key(index);
    } catch (error) {
      console.error('Error getting storage key:', error);
      return null;
    }
  }

  get length(): number {
    try {
      return this.storage.length;
    } catch (error) {
      console.error('Error getting storage length:', error);
      return 0;
    }
  }
}

// Convenience functions
export const localStorage = StorageManager.getInstance('local');
export const sessionStorage = StorageManager.getInstance('session');

// Type-safe storage helpers
export function getAuthToken(): string | null {
  return localStorage.getItem<string>(STORAGE_KEYS.AUTH_TOKEN);
}

export function setAuthToken(token: string): void {
  localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
}

export function removeAuthToken(): void {
  localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
}

export function getUserPreferences(): Record<string, any> | null {
  return localStorage.getItem<Record<string, any>>(STORAGE_KEYS.USER_PREFERENCES);
}

export function setUserPreferences(preferences: Record<string, any>): void {
  localStorage.setItem(STORAGE_KEYS.USER_PREFERENCES, preferences);
}

export function getTheme(): string | null {
  return localStorage.getItem<string>(STORAGE_KEYS.THEME);
}

export function setTheme(theme: string): void {
  localStorage.setItem(STORAGE_KEYS.THEME, theme);
}
```

## Integration with Other Systems

### Registry Integration
```typescript
// lib/registry.ts
import { useRegistry } from '@/hooks/useRegistry';

export async function loadRegistry<T>(path: string): Promise<T> {
  try {
    const module = await import(`@/registries/${path}.json`);
    return module.default;
  } catch (error) {
    console.error(`Failed to load registry: ${path}`, error);
    throw error;
  }
}

export function validateRegistrySchema<T>(
  data: unknown,
  schema: Record<string, any>
): data is T {
  // Schema validation logic
  return true;
}
```

### Theme Integration
```typescript
// lib/theme.ts
import { ThemeRegistry } from '@/types/registry';

export function applyTheme(theme: ThemeRegistry): void {
  const root = document.documentElement;
  
  // Apply CSS custom properties
  Object.entries(theme.colors.primary).forEach(([key, value]) => {
    root.style.setProperty(`--color-primary-${key}`, value);
  });
  
  Object.entries(theme.spacing).forEach(([key, value]) => {
    root.style.setProperty(`--spacing-${key}`, value);
  });
}

export function getSystemTheme(): 'light' | 'dark' {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}
```

## Best Practices

### 1. Function Design
- Keep functions pure when possible
- Use descriptive names
- Add proper TypeScript types
- Include JSDoc comments

### 2. Error Handling
- Always handle errors gracefully
- Provide meaningful error messages
- Log errors for debugging
- Use try-catch blocks appropriately

### 3. Performance
- Memoize expensive operations
- Use debouncing for frequent operations
- Implement proper caching strategies
- Avoid unnecessary computations

### 4. Testing
- Write unit tests for utility functions
- Test edge cases and error conditions
- Mock external dependencies
- Use type-safe testing patterns

## Usage Examples

### Component Integration
```typescript
import { cn, formatDate, debounce } from '@/lib/utils';
import { ASSETS } from '@/lib/constants';

function UserCard({ user, className }) {
  const debouncedSearch = debounce(handleSearch, 300);
  
  return (
    <div className={cn('p-4 border rounded-lg', className)}>
      <img src={user.avatar || ASSETS.AVATARS.DEFAULT} alt={user.name} />
      <h3>{user.name}</h3>
      <p>Last seen: {formatDate(user.lastSeen, 'relative')}</p>
    </div>
  );
}
```

### API Integration
```typescript
import { apiClient } from '@/lib/api';
import { handleApiError } from '@/lib/api';

async function fetchUsers() {
  try {
    const response = await apiClient.get<User[]>('/users');
    return response.data;
  } catch (error) {
    const apiError = await handleApiError(error);
    throw apiError;
  }
}
```

### Form Validation
```typescript
import { validateForm } from '@/lib/validation';

function LoginForm() {
  const handleSubmit = (data: LoginData) => {
    const { isValid, errors } = validateForm(data, validationRules);
    
    if (!isValid) {
      setErrors(errors);
      return;
    }
    
    // Submit form
  };
}
```

## Related Documentation
- [Components README](../components/README.md) - Using utilities in components
- [Hooks README](../hooks/README.md) - Utility hooks
- [Types README](../types/README.md) - Type definitions
- [API Documentation](../api/README.md) - API client usage
