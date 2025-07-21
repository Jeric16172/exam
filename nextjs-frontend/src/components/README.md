# Components Directory

## Overview
The `components` directory contains reusable UI components that can be used throughout the application. Components are organized by functionality and type.

## What goes in this folder
- `ui/` - Basic UI components (buttons, inputs, cards, etc.)
- `layout/` - Layout components (header, footer, sidebar, etc.)
- `chat/` - Chat-specific components (message bubbles, chat avatars, etc.)
- `user/` - User-related components (profile cards, user lists, etc.)
- `forms/` - Form components (login forms, registration forms, etc.)
- `common/` - Common/shared components used across the app

## Purpose
This folder provides reusable UI building blocks that maintain consistency across the application.

## Directory Breakdown

### `ui/` - Basic UI Primitives
**Purpose**: Fundamental, atomic UI components that form the building blocks of the application.

**Components**:
- `Button.tsx` - Configurable button component
- `Input.tsx` - Form input component
- `Avatar.tsx` - User avatar display component
- `Badge.tsx` - Notification and status badges
- `Card.tsx` - Container component for content
- `Modal.tsx` - Modal dialog component

**Example**:
```typescript
// components/ui/Button.tsx
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  onClick?: () => void;
}

export default function Button({ variant = 'primary', size = 'md', children, onClick }: ButtonProps) {
  // Implementation
}
```

### `chat/` - Chat-Specific Components
**Purpose**: Components specifically designed for chat functionality.

**Components**:
- `MessageBubble.tsx` - Chat avatar/contact button
- `ChatMessage.tsx` - Individual chat message display
- `ChatInput.tsx` - Message input component
- `ChatList.tsx` - List of chat conversations
- `TypingIndicator.tsx` - Shows when users are typing

**Example**:
```typescript
// components/chat/MessageBubble.tsx
interface MessageBubbleProps {
  user: User;
  hasUnreadMessages?: boolean;
  onClick: () => void;
}
```

### `layout/` - Layout Components
**Purpose**: Components that define the application's structural layout.

**Components**:
- `Header.tsx` - Application header/navigation
- `Sidebar.tsx` - Side navigation panel
- `Footer.tsx` - Application footer
- `Navigation.tsx` - Main navigation component
- `Breadcrumbs.tsx` - Navigation breadcrumbs

### `forms/` - Form Components
**Purpose**: Components for form creation and validation.

**Components**:
- `FormField.tsx` - Generic form field wrapper
- `ValidationMessage.tsx` - Error/validation message display
- `FormSection.tsx` - Form section container
- `DynamicForm.tsx` - Form generated from registry configuration

### `dynamic/` - Registry-Driven Components
**Purpose**: Components that use JSON registries for configuration.

**Components**:
- `DynamicForm.tsx` - Forms configured via registry
- `DynamicLayout.tsx` - Layouts configured via registry
- `ConfigurableCard.tsx` - Cards with registry-based styling

**Example**:
```typescript
// components/dynamic/DynamicForm.tsx
interface DynamicFormProps {
  registryPath: string;
  onSubmit: (data: any) => void;
}

export default function DynamicForm({ registryPath, onSubmit }: DynamicFormProps) {
  const formConfig = useRegistry<FormRegistry>(`forms/${registryPath}`);
  // Component logic
}
```

### `providers/` - Context Providers
**Purpose**: React context providers for global state management.

**Components**:
- `ThemeProvider.tsx` - Theme context provider
- `AuthProvider.tsx` - Authentication context provider
- `ChatProvider.tsx` - Chat state management

## Component Architecture Patterns

### 1. Atomic Design Principles
- **Atoms**: Basic UI elements (Button, Input, Avatar)
- **Molecules**: Simple combinations (SearchBar, UserCard)
- **Organisms**: Complex components (ChatList, UserProfile)
- **Templates**: Layout structures
- **Pages**: Specific instances

### 2. Composition Pattern
```typescript
// Good: Composable components
<Card>
  <Card.Header>
    <Card.Title>User Profile</Card.Title>
  </Card.Header>
  <Card.Body>
    <UserAvatar user={user} />
    <UserInfo user={user} />
  </Card.Body>
</Card>
```

### 3. Prop-Based Configuration
```typescript
// Components accept configuration via props
<Button 
  variant="primary" 
  size="md" 
  disabled={loading}
  onClick={handleSubmit}
>
  Submit
</Button>
```

## TypeScript Integration

### Component Props Interface
```typescript
interface ComponentProps {
  // Required props
  user: User;
  
  // Optional props with defaults
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  
  // Event handlers
  onClick?: (user: User) => void;
  
  // Children and className for composition
  children?: React.ReactNode;
  className?: string;
}
```

### Generic Components
```typescript
interface ListProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
  keyExtractor: (item: T) => string;
}

function List<T>({ items, renderItem, keyExtractor }: ListProps<T>) {
  return (
    <ul>
      {items.map(item => (
        <li key={keyExtractor(item)}>
          {renderItem(item)}
        </li>
      ))}
    </ul>
  );
}
```

## Registry Integration

### Using Component Registries
```typescript
// Components can be configured via JSON registries
const { data: config } = useComponentConfig('user-card');

const variantClasses = config?.variants[variant] || '';
const sizeClasses = config?.sizes[size] || '';
```

### Registry-Driven Styling
```json
// registries/components/button.json
{
  "variants": {
    "primary": "bg-blue-600 text-white hover:bg-blue-700",
    "secondary": "bg-gray-200 text-gray-800 hover:bg-gray-300"
  },
  "sizes": {
    "sm": "px-3 py-1.5 text-sm",
    "md": "px-4 py-2 text-base"
  }
}
```

## Best Practices

### 1. Component Naming
- Use PascalCase for component names
- Be descriptive and specific
- Include the component type (Button, Modal, etc.)

### 2. File Organization
- One component per file
- Use `index.ts` for barrel exports
- Co-locate related components

### 3. Props Design
- Use TypeScript interfaces for props
- Provide sensible defaults
- Keep props focused and minimal

### 4. Styling
- Use Tailwind CSS for styling
- Support className prop for customization
- Use registry-based styling for consistency

### 5. State Management
- Keep local state in components
- Use context for shared state
- Lift state up when needed

## Usage Examples

### Basic Component Usage
```typescript
import { Button, Avatar } from '@/components/ui';
import { MessageBubble } from '@/components/chat';

function UserProfile({ user }: { user: User }) {
  return (
    <div>
      <Avatar src={user.avatar} alt={user.name} />
      <MessageBubble user={user} onClick={() => console.log('Chat clicked')} />
      <Button variant="primary" onClick={() => console.log('Profile clicked')}>
        View Profile
      </Button>
    </div>
  );
}
```

### Registry-Driven Component
```typescript
import { DynamicForm } from '@/components/dynamic';

function UserSettings() {
  return (
    <DynamicForm 
      registryPath="user-settings" 
      onSubmit={(data) => console.log('Form submitted:', data)}
    />
  );
}
```

## Testing Components

### Unit Testing
```typescript
import { render, screen } from '@testing-library/react';
import Button from './Button';

test('renders button with correct text', () => {
  render(<Button>Click me</Button>);
  expect(screen.getByRole('button')).toHaveTextContent('Click me');
});
```

### Integration Testing
```typescript
test('user card handles click events', () => {
  const mockClick = jest.fn();
  render(<UserCard user={mockUser} onClick={mockClick} />);
  
  fireEvent.click(screen.getByRole('button'));
  expect(mockClick).toHaveBeenCalledWith(mockUser);
});
```

## Performance Considerations

### 1. Memoization
```typescript
import { memo } from 'react';

const UserCard = memo(({ user, onClick }: UserCardProps) => {
  // Component logic
});
```

### 2. Lazy Loading
```typescript
import { lazy, Suspense } from 'react';

const HeavyComponent = lazy(() => import('./HeavyComponent'));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HeavyComponent />
    </Suspense>
  );
}
```

## Related Documentation
- [Hooks README](../hooks/README.md) - Custom hooks used in components
- [Types README](../types/README.md) - TypeScript interfaces
- [Registries README](../registries/README.md) - Configuration files
- [Styling Guide](../styles/README.md) - Styling conventions
