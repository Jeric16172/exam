# Types Directory

## Overview
The `types` directory contains TypeScript type definitions and interfaces that provide type safety throughout the application. These types define the structure of data, component props, API responses, and other shared contracts used across the codebase.

## Structure
```
types/
├── index.ts           # Main barrel export file
├── user.ts            # User-related types
├── chat.ts            # Chat and messaging types
├── component.ts       # Component and UI types
├── form.ts            # Form and input types
├── registry.ts        # Registry configuration types
├── api.ts             # API request/response types
├── auth.ts            # Authentication types
├── theme.ts           # Theme and styling types
└── common.ts          # Common utility types
```

## Core Type Categories

### 1. User Types (`user.ts`)
**Purpose**: Define user-related data structures and interfaces.

```typescript
export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  isOnline?: boolean;
  lastSeen?: Date;
  gender?: 'male' | 'female' | 'other';
  age?: number;
  status?: UserStatus;
  preferences?: UserPreferences;
}

export type UserStatus = 'online' | 'offline' | 'away' | 'busy';

export interface UserPreferences {
  theme: ThemeMode;
  notifications: boolean;
  language: string;
  timezone: string;
  privacy: PrivacySettings;
}

export interface PrivacySettings {
  showOnlineStatus: boolean;
  allowDirectMessages: boolean;
  showLastSeen: boolean;
}

export interface UserProfile extends User {
  bio?: string;
  location?: string;
  website?: string;
  joinedAt: Date;
  followers: number;
  following: number;
  isVerified: boolean;
}

// Utility types for user operations
export type UserUpdate = Partial<Pick<User, 'name' | 'email' | 'avatar' | 'preferences'>>;
export type UserCreateData = Omit<User, 'id' | 'isOnline' | 'lastSeen'>;
```

### 2. Chat Types (`chat.ts`)
**Purpose**: Define chat and messaging-related structures.

```typescript
export interface ChatMessage {
  id: string;
  content: string;
  senderId: string;
  recipientId?: string;
  roomId?: string;
  timestamp: Date;
  type: MessageType;
  status: MessageStatus;
  attachments?: MessageAttachment[];
  replyTo?: string;
  edited?: boolean;
  editedAt?: Date;
}

export type MessageType = 'text' | 'image' | 'file' | 'audio' | 'video' | 'system';
export type MessageStatus = 'sending' | 'sent' | 'delivered' | 'read' | 'failed';

export interface MessageAttachment {
  id: string;
  type: 'image' | 'file' | 'audio' | 'video';
  url: string;
  name: string;
  size: number;
  mimeType: string;
  thumbnail?: string;
}

export interface ChatRoom {
  id: string;
  name?: string;
  type: ChatRoomType;
  participants: string[];
  messages: ChatMessage[];
  lastMessage?: ChatMessage;
  unreadCount: number;
  createdAt: Date;
  updatedAt: Date;
  settings: ChatRoomSettings;
}

export type ChatRoomType = 'direct' | 'group' | 'public' | 'private';

export interface ChatRoomSettings {
  allowMessages: boolean;
  allowFileUploads: boolean;
  maxParticipants?: number;
  isEncrypted: boolean;
  autoDeleteMessages?: number; // in days
}

export interface TypingIndicator {
  userId: string;
  roomId: string;
  isTyping: boolean;
  timestamp: Date;
}

export interface ChatState {
  rooms: ChatRoom[];
  activeRoom: string | null;
  messages: Record<string, ChatMessage[]>;
  typingUsers: TypingIndicator[];
  onlineUsers: string[];
}
```

### 3. Component Types (`component.ts`)
**Purpose**: Define component props and UI-related types.

```typescript
export interface ComponentVariant {
  name: string;
  className: string;
  disabled?: boolean;
}

export interface ComponentSize {
  name: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className: string;
  dimensions?: {
    width?: string;
    height?: string;
  };
}

export interface ComponentConfig {
  component: string;
  variants: Record<string, ComponentVariant>;
  sizes: Record<string, ComponentSize>;
  defaultProps: Record<string, any>;
}

// Button component types
export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  children: React.ReactNode;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

// Avatar component types
export interface AvatarProps {
  src: string;
  alt: string;
  size?: 'sm' | 'md' | 'lg';
  isOnline?: boolean;
  showStatus?: boolean;
  fallback?: string;
  className?: string;
}

// Card component types
export interface CardProps {
  variant?: 'default' | 'elevated' | 'outline';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

// Modal component types
export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  children: React.ReactNode;
  showCloseButton?: boolean;
  closeOnBackdrop?: boolean;
  className?: string;
}

// Layout component types
export interface LayoutProps {
  children: React.ReactNode;
  sidebar?: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}
```

### 4. Form Types (`form.ts`)
**Purpose**: Define form-related structures and validation types.

```typescript
export interface FormField {
  id: string;
  type: FormFieldType;
  label: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  validation?: ValidationConfig;
  options?: FormFieldOption[];
  defaultValue?: any;
  gridColumn?: string;
  helpText?: string;
}

export type FormFieldType = 
  | 'text' 
  | 'email' 
  | 'password' 
  | 'number' 
  | 'tel' 
  | 'url' 
  | 'textarea' 
  | 'select' 
  | 'checkbox' 
  | 'radio' 
  | 'file' 
  | 'date' 
  | 'datetime-local' 
  | 'time';

export interface FormFieldOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

export interface ValidationConfig {
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  min?: number;
  max?: number;
  custom?: (value: any) => string | null;
}

export interface ValidationRule {
  type: 'required' | 'email' | 'minLength' | 'maxLength' | 'pattern' | 'custom';
  value?: string | number | ((value: any) => boolean);
  message: string;
}

export interface FormSection {
  sectionId: string;
  title: string;
  description?: string;
  fields: FormField[];
  collapsible?: boolean;
  defaultCollapsed?: boolean;
}

export interface FormAction {
  type: 'submit' | 'reset' | 'button';
  label: string;
  variant: 'primary' | 'secondary' | 'outline' | 'danger';
  position: 'left' | 'right' | 'center';
  disabled?: boolean;
  onClick?: () => void;
}

export interface FormRegistry {
  formId: string;
  title: string;
  description?: string;
  layout: 'vertical' | 'horizontal' | 'grid';
  sections: FormSection[];
  actions: FormAction[];
  validation?: Record<string, ValidationRule[]>;
}

export interface FormState<T = any> {
  data: T;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  isSubmitting: boolean;
  isValid: boolean;
}

export interface UseFormReturn<T = any> {
  formState: FormState<T>;
  register: (name: string) => {
    name: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
    value: any;
  };
  handleSubmit: (onSubmit: (data: T) => void) => (e: React.FormEvent) => void;
  setValue: (name: string, value: any) => void;
  reset: () => void;
  validate: () => boolean;
}
```

### 5. Registry Types (`registry.ts`)
**Purpose**: Define types for registry configuration files.

```typescript
export interface RegistryConfig {
  version: string;
  registryType: string;
  lastUpdated: string;
  config: any;
}

export interface LayoutRegistry {
  layoutId: string;
  name: string;
  type: 'grid' | 'flex' | 'absolute';
  responsive: boolean;
  breakpoints?: Record<string, string>;
  areas: LayoutArea[];
  gridTemplate?: GridTemplate;
  responsive?: Record<string, Partial<LayoutRegistry>>;
}

export interface LayoutArea {
  id: string;
  component: string;
  gridArea?: string;
  position?: 'static' | 'relative' | 'absolute' | 'fixed' | 'sticky';
  width?: string;
  height?: string;
  padding?: string;
  margin?: string;
  className?: string;
  props?: Record<string, any>;
}

export interface GridTemplate {
  areas: string[];
  columns: string;
  rows: string;
  gap?: string;
}

export interface NavigationRegistry {
  menuId: string;
  type: 'horizontal' | 'vertical' | 'sidebar';
  items: NavigationItem[];
  settings?: NavigationSettings;
}

export interface NavigationItem {
  id: string;
  label: string;
  icon?: string;
  href?: string;
  onClick?: string;
  badge?: {
    count: number;
    variant: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  };
  submenu?: NavigationItem[];
  permissions?: string[];
  active?: boolean;
  disabled?: boolean;
}

export interface NavigationSettings {
  collapsible: boolean;
  defaultCollapsed: boolean;
  showIcons: boolean;
  showLabels: boolean;
  animation: boolean;
}

export interface ThemeRegistry {
  themeId: string;
  name: string;
  type: 'light' | 'dark' | 'auto';
  colors: ThemeColors;
  typography: ThemeTypography;
  spacing: ThemeSpacing;
  borderRadius: ThemeBorderRadius;
  shadows: ThemeShadows;
}

export interface ThemeColors {
  primary: ColorPalette;
  secondary: ColorPalette;
  success: string;
  warning: string;
  error: string;
  info: string;
  background: string;
  surface: string;
  text: {
    primary: string;
    secondary: string;
    disabled: string;
  };
}

export interface ColorPalette {
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
}

export interface ThemeTypography {
  fontFamily: {
    sans: string[];
    serif: string[];
    mono: string[];
  };
  fontSize: Record<string, string>;
  fontWeight: Record<string, number>;
  lineHeight: Record<string, string>;
}

export interface ThemeSpacing {
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  [key: string]: string;
}

export interface ThemeBorderRadius {
  none: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  full: string;
}

export interface ThemeShadows {
  sm: string;
  md: string;
  lg: string;
  xl: string;
  none: string;
}
```

### 6. API Types (`api.ts`)
**Purpose**: Define API request/response structures.

```typescript
export interface ApiResponse<T = any> {
  data: T;
  success: boolean;
  message?: string;
  errors?: ApiError[];
  meta?: ApiMeta;
}

export interface ApiError {
  field?: string;
  message: string;
  code?: string;
}

export interface ApiMeta {
  total?: number;
  page?: number;
  limit?: number;
  hasMore?: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface ApiRequestConfig {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  url: string;
  data?: any;
  params?: Record<string, any>;
  headers?: Record<string, string>;
  timeout?: number;
}

export interface UseApiOptions {
  enabled?: boolean;
  refetchOnWindowFocus?: boolean;
  refetchOnReconnect?: boolean;
  staleTime?: number;
  cacheTime?: number;
  retry?: number;
  retryDelay?: number;
}

export interface UseApiReturn<T> {
  data: T | null;
  loading: boolean;
  error: ApiError | null;
  refetch: () => Promise<void>;
  mutate: (newData: T) => void;
}
```

### 7. Authentication Types (`auth.ts`)
**Purpose**: Define authentication-related types.

```typescript
export interface AuthUser {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  roles: string[];
  permissions: string[];
  lastLogin?: Date;
  emailVerified: boolean;
  twoFactorEnabled: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
}

export interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  token: string | null;
  refreshToken: string | null;
}

export interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  updateProfile: (updates: Partial<AuthUser>) => Promise<void>;
  changePassword: (oldPassword: string, newPassword: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  verifyEmail: (token: string) => Promise<void>;
}

export interface JWTPayload {
  sub: string;
  email: string;
  name: string;
  roles: string[];
  permissions: string[];
  iat: number;
  exp: number;
}
```

### 8. Common Utility Types (`common.ts`)
**Purpose**: Define common utility types and generic helpers.

```typescript
// Utility types
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredKeys<T> = {
  [K in keyof T]-?: {} extends Pick<T, K> ? never : K;
}[keyof T];

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type DeepRequired<T> = {
  [P in keyof T]-?: T[P] extends object ? DeepRequired<T[P]> : T[P];
};

export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

export type UnionToIntersection<U> = (
  U extends any ? (k: U) => void : never
) extends (k: infer I) => void ? I : never;

// Event handlers
export type EventHandler<T = Event> = (event: T) => void;
export type ChangeHandler<T = HTMLInputElement> = (event: React.ChangeEvent<T>) => void;
export type ClickHandler<T = HTMLElement> = (event: React.MouseEvent<T>) => void;
export type SubmitHandler<T = HTMLFormElement> = (event: React.FormEvent<T>) => void;

// Common props
export interface WithChildren {
  children: React.ReactNode;
}

export interface WithClassName {
  className?: string;
}

export interface WithTestId {
  testId?: string;
}

export interface WithLoading {
  loading?: boolean;
}

export interface WithError {
  error?: string | null;
}

// Data states
export interface DataState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export interface AsyncState<T> extends DataState<T> {
  refetch: () => Promise<void>;
  mutate: (newData: T) => void;
}

// Form states
export interface FieldState {
  value: any;
  error: string | null;
  touched: boolean;
  dirty: boolean;
}

export interface FormFieldProps {
  name: string;
  label?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  helpText?: string;
  className?: string;
}

// Theme types
export type ThemeMode = 'light' | 'dark' | 'auto';
export type ColorScheme = 'light' | 'dark';

// Responsive breakpoints
export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
export type ResponsiveValue<T> = T | Partial<Record<Breakpoint, T>>;

// Status types
export type Status = 'idle' | 'loading' | 'success' | 'error';
export type AsyncStatus = 'idle' | 'pending' | 'fulfilled' | 'rejected';

// File types
export interface FileData {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  uploadedAt: Date;
  uploadedBy: string;
}

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

// Search and filter types
export interface SearchParams {
  query?: string;
  filters?: Record<string, any>;
  sort?: {
    field: string;
    order: 'asc' | 'desc';
  };
  pagination?: {
    page: number;
    limit: number;
  };
}

export interface FilterOption {
  value: string | number;
  label: string;
  count?: number;
}

export interface SortOption {
  field: string;
  label: string;
  order: 'asc' | 'desc';
}
```

## Type Usage Patterns

### 1. Component Props with Generic Types
```typescript
interface ListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  keyExtractor: (item: T) => string;
  loading?: boolean;
  error?: string;
  emptyMessage?: string;
}

function List<T>({ items, renderItem, keyExtractor, ...props }: ListProps<T>) {
  // Component implementation
}
```

### 2. API Response Handling
```typescript
function UserList() {
  const { data, loading, error } = useApi<ApiResponse<User[]>>('/api/users');
  
  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;
  
  return (
    <List
      items={data?.data || []}
      renderItem={(user) => <UserCard user={user} />}
      keyExtractor={(user) => user.id}
    />
  );
}
```

### 3. Form Type Safety
```typescript
interface UserFormData {
  name: string;
  email: string;
  age: number;
}

function UserForm() {
  const form = useForm<UserFormData>({
    defaultValues: {
      name: '',
      email: '',
      age: 0
    }
  });
  
  const handleSubmit = (data: UserFormData) => {
    // Type-safe form submission
  };
}
```

### 4. State Management with Types
```typescript
interface AppState {
  auth: AuthState;
  chat: ChatState;
  theme: ThemeState;
  ui: UIState;
}

const useAppStore = create<AppState>((set, get) => ({
  auth: {
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null
  },
  // ... other state
}));
```

## Best Practices

### 1. Type Organization
- Group related types in the same file
- Use barrel exports for easy imports
- Keep types close to their usage when possible
- Use consistent naming conventions

### 2. Type Safety
- Prefer interfaces over type aliases for objects
- Use union types for constrained values
- Implement proper generic constraints
- Use utility types for transformations

### 3. Performance
- Avoid deeply nested types
- Use type assertions sparingly
- Prefer type narrowing over type assertions
- Consider using type predicates for complex checks

### 4. Documentation
- Add JSDoc comments for complex types
- Provide usage examples
- Document breaking changes
- Include related type references

## Integration Examples

### Registry-Driven Types
```typescript
// Dynamic component props based on registry
interface DynamicComponentProps<T extends ComponentRegistry> {
  config: T;
  variant: keyof T['variants'];
  size: keyof T['sizes'];
}
```

### Hook Return Types
```typescript
// Consistent hook return patterns
interface UseDataReturn<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}
```

### Event Handler Types
```typescript
// Consistent event handler patterns
interface FormEvents {
  onSubmit: (data: any) => void;
  onChange: (field: string, value: any) => void;
  onError: (error: string) => void;
}
```

## Testing Types

### Type Testing
```typescript
// Type-only tests
type TestUser = User;
type TestUserUpdate = UserUpdate;

// Ensure required fields are present
const user: TestUser = {
  id: '1',
  name: 'John',
  email: 'john@example.com',
  avatar: 'avatar.jpg'
};
```

### Mock Types
```typescript
// Mock data with proper types
const mockUser: User = {
  id: '1',
  name: 'John Doe',
  email: 'john@example.com',
  avatar: '/avatars/john.jpg',
  isOnline: true,
  status: 'online'
};
```

## Related Documentation
- [Components README](../components/README.md) - Using types in components
- [Hooks README](../hooks/README.md) - Hook type definitions
- [API README](../api/README.md) - API type contracts
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
