# Registries Directory

## Overview
The `registries` directory contains JSON configuration files that define the structure, styling, validation rules, and data for dynamic components. This system allows for declarative configuration of UI elements, forms, layouts, and application behavior without hard-coding values in components.

## Structure
```
registries/
├── components/            # Component styling and behavior configurations
│   ├── buttons.json
│   ├── cards.json
│   ├── inputs.json
│   └── user-card.json
├── forms/                 # Form structure and field configurations
│   ├── user-profile.json
│   ├── login-form.json
│   └── chat-settings.json
├── layouts/               # Layout and grid configurations
│   ├── dashboard.json
│   ├── chat-interface.json
│   └── mobile-layout.json
├── labels/                # Internationalization and text content
│   ├── en.json
│   ├── es.json
│   └── fr.json
├── navigation/            # Menu and navigation configurations
│   ├── main-menu.json
│   ├── sidebar.json
│   └── breadcrumbs.json
├── themes/                # Theme and styling configurations
│   ├── default.json
│   ├── dark.json
│   └── light.json
├── validations/           # Form validation rules
│   ├── user-validations.json
│   ├── form-validations.json
│   └── input-validations.json
└── data/                  # Sample and mock data
    ├── sample-users.json
    ├── mock-chats.json
    └── test-data.json
```

## Registry Types and Usage

### 1. Components Registry
**Purpose**: Define styling variants, sizes, and default properties for UI components.

**File**: `components/user-card.json`
```json
{
  "component": "UserCard",
  "variants": {
    "default": {
      "name": "default",
      "className": "bg-white border border-gray-200 rounded-lg shadow-sm"
    },
    "compact": {
      "name": "compact",
      "className": "bg-white border border-gray-200 rounded-md shadow-sm"
    },
    "elevated": {
      "name": "elevated",
      "className": "bg-white border border-gray-200 rounded-lg shadow-lg"
    }
  },
  "sizes": {
    "sm": {
      "name": "sm",
      "className": "p-3",
      "dimensions": { "width": "200px", "height": "auto" }
    },
    "md": {
      "name": "md",
      "className": "p-4",
      "dimensions": { "width": "280px", "height": "auto" }
    },
    "lg": {
      "name": "lg",
      "className": "p-6",
      "dimensions": { "width": "320px", "height": "auto" }
    }
  },
  "defaultProps": {
    "variant": "default",
    "size": "md",
    "showStatus": true,
    "showLastSeen": true
  }
}
```

**Usage in Components**:
```typescript
import { useComponentConfig } from '@/hooks/useRegistry';

function UserCard({ variant, size, ...props }) {
  const { data: config } = useComponentConfig('user-card');
  
  const variantClass = config?.variants[variant]?.className || '';
  const sizeClass = config?.sizes[size]?.className || '';
  
  return (
    <div className={`${variantClass} ${sizeClass}`}>
      {/* Component content */}
    </div>
  );
}
```

### 2. Forms Registry
**Purpose**: Define form structure, fields, validation rules, and layout.

**File**: `forms/user-profile.json`
```json
{
  "formId": "user-profile",
  "title": "User Profile Settings",
  "description": "Update your profile information",
  "layout": "vertical",
  "sections": [
    {
      "sectionId": "personal-info",
      "title": "Personal Information",
      "fields": [
        {
          "id": "firstName",
          "type": "text",
          "label": "First Name",
          "placeholder": "Enter your first name",
          "required": true,
          "validation": {
            "minLength": 2,
            "maxLength": 50,
            "pattern": "^[a-zA-Z\\s]+$"
          },
          "gridColumn": "1/2"
        },
        {
          "id": "lastName",
          "type": "text",
          "label": "Last Name",
          "placeholder": "Enter your last name",
          "required": true,
          "validation": {
            "minLength": 2,
            "maxLength": 50,
            "pattern": "^[a-zA-Z\\s]+$"
          },
          "gridColumn": "2/3"
        },
        {
          "id": "email",
          "type": "email",
          "label": "Email Address",
          "placeholder": "your.email@example.com",
          "required": true,
          "validation": {
            "pattern": "^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$"
          },
          "gridColumn": "1/3"
        }
      ]
    }
  ],
  "actions": [
    {
      "type": "submit",
      "label": "Save Changes",
      "variant": "primary",
      "position": "right"
    },
    {
      "type": "reset",
      "label": "Reset",
      "variant": "secondary",
      "position": "left"
    }
  ]
}
```

**Usage in Components**:
```typescript
import { useRegistry } from '@/hooks/useRegistry';

function DynamicForm({ registryPath }) {
  const { data: formConfig } = useRegistry<FormRegistry>(`forms/${registryPath}`);
  
  return (
    <form>
      <h2>{formConfig?.title}</h2>
      {formConfig?.sections.map(section => (
        <div key={section.sectionId}>
          <h3>{section.title}</h3>
          {section.fields.map(field => (
            <FormField key={field.id} config={field} />
          ))}
        </div>
      ))}
    </form>
  );
}
```

### 3. Layouts Registry
**Purpose**: Define responsive grid layouts and component positioning.

**File**: `layouts/dashboard.json`
```json
{
  "layoutId": "dashboard",
  "name": "Dashboard Layout",
  "type": "grid",
  "responsive": true,
  "breakpoints": {
    "sm": "640px",
    "md": "768px",
    "lg": "1024px",
    "xl": "1280px"
  },
  "areas": [
    {
      "id": "header",
      "component": "Header",
      "gridArea": "header",
      "sticky": true,
      "height": "64px",
      "className": "border-b"
    },
    {
      "id": "sidebar",
      "component": "Sidebar",
      "gridArea": "sidebar",
      "width": "280px",
      "collapsible": true,
      "className": "border-r"
    },
    {
      "id": "main",
      "component": "MainContent",
      "gridArea": "main",
      "padding": "24px",
      "className": "overflow-y-auto"
    }
  ],
  "gridTemplate": {
    "areas": [
      "header header",
      "sidebar main"
    ],
    "columns": "280px 1fr",
    "rows": "64px 1fr"
  },
  "responsive": {
    "md": {
      "gridTemplate": {
        "areas": ["header", "main"],
        "columns": "1fr",
        "rows": "64px 1fr"
      }
    }
  }
}
```

### 4. Validations Registry
**Purpose**: Define validation rules for form fields and data validation.

**File**: `validations/user-validations.json`
```json
{
  "userProfile": {
    "firstName": [
      {
        "type": "required",
        "message": "First name is required"
      },
      {
        "type": "minLength",
        "value": 2,
        "message": "First name must be at least 2 characters"
      },
      {
        "type": "maxLength",
        "value": 50,
        "message": "First name must not exceed 50 characters"
      },
      {
        "type": "pattern",
        "value": "^[a-zA-Z\\s]+$",
        "message": "First name can only contain letters and spaces"
      }
    ],
    "email": [
      {
        "type": "required",
        "message": "Email is required"
      },
      {
        "type": "email",
        "message": "Please enter a valid email address"
      }
    ],
    "age": [
      {
        "type": "required",
        "message": "Age is required"
      },
      {
        "type": "pattern",
        "value": "^[1-9]\\d*$",
        "message": "Age must be a positive number"
      }
    ]
  }
}
```

**Usage with Validation Hook**:
```typescript
import { useValidation } from '@/hooks/useValidations';
import { useRegistry } from '@/hooks/useRegistry';

function UserForm() {
  const { data: validationRules } = useRegistry('validations/user-validations');
  const { validateField, errors } = useValidation();
  
  const handleFieldChange = (fieldName: string, value: string) => {
    const rules = validationRules?.userProfile[fieldName];
    if (rules) {
      validateField(value, rules, fieldName);
    }
  };
  
  return (
    <form>
      <input
        onChange={(e) => handleFieldChange('firstName', e.target.value)}
      />
      {errors.firstName && <span>{errors.firstName}</span>}
    </form>
  );
}
```

### 5. Labels Registry (Internationalization)
**Purpose**: Store text content and translations for different languages.

**File**: `labels/en.json`
```json
{
  "common": {
    "save": "Save",
    "cancel": "Cancel",
    "delete": "Delete",
    "edit": "Edit",
    "create": "Create",
    "update": "Update",
    "submit": "Submit",
    "reset": "Reset",
    "loading": "Loading...",
    "error": "Error",
    "success": "Success"
  },
  "forms": {
    "validation": {
      "required": "This field is required",
      "email": "Please enter a valid email address",
      "minLength": "Minimum {min} characters required",
      "maxLength": "Maximum {max} characters allowed",
      "pattern": "Please enter a valid format"
    },
    "labels": {
      "firstName": "First Name",
      "lastName": "Last Name",
      "email": "Email Address",
      "password": "Password",
      "confirmPassword": "Confirm Password"
    }
  },
  "chat": {
    "online": "Online",
    "offline": "Offline",
    "typing": "Typing...",
    "lastSeen": "Last seen {time}",
    "newMessage": "New message",
    "sendMessage": "Send message"
  }
}
```

**Usage for Internationalization**:
```typescript
import { useRegistry } from '@/hooks/useRegistry';

function useLabels(language: string = 'en') {
  const { data: labels } = useRegistry<LabelsRegistry>(`labels/${language}`);
  
  const getLabel = (key: string): string => {
    const keys = key.split('.');
    let value = labels;
    
    for (const k of keys) {
      value = value?.[k];
    }
    
    return value || key;
  };
  
  return { getLabel, labels };
}

function LoginForm() {
  const { getLabel } = useLabels();
  
  return (
    <form>
      <label>{getLabel('forms.labels.email')}</label>
      <input type="email" />
      
      <button type="submit">
        {getLabel('forms.labels.submit')}
      </button>
    </form>
  );
}
```

### 6. Navigation Registry
**Purpose**: Define menu structures and navigation hierarchies.

**File**: `navigation/main-menu.json`
```json
{
  "menuId": "main-menu",
  "items": [
    {
      "id": "dashboard",
      "label": "Dashboard",
      "icon": "DashboardIcon",
      "href": "/dashboard",
      "badge": null
    },
    {
      "id": "chat",
      "label": "Chat",
      "icon": "ChatIcon",
      "href": "/chat",
      "badge": {
        "count": 3,
        "variant": "primary"
      }
    },
    {
      "id": "users",
      "label": "Users",
      "icon": "UsersIcon",
      "href": "/users",
      "submenu": [
        {
          "id": "all-users",
          "label": "All Users",
          "href": "/users"
        },
        {
          "id": "add-user",
          "label": "Add User",
          "href": "/users/add"
        }
      ]
    }
  ]
}
```

### 7. Themes Registry
**Purpose**: Define color schemes, typography, and styling configurations.

**File**: `themes/default.json`
```json
{
  "themeId": "default",
  "name": "Default Theme",
  "colors": {
    "primary": {
      "50": "#eff6ff",
      "500": "#3b82f6",
      "900": "#1e3a8a"
    },
    "secondary": {
      "50": "#f9fafb",
      "500": "#6b7280",
      "900": "#111827"
    },
    "success": "#10b981",
    "warning": "#f59e0b",
    "error": "#ef4444"
  },
  "typography": {
    "fontFamily": {
      "sans": ["Inter", "system-ui", "sans-serif"],
      "mono": ["Fira Code", "monospace"]
    },
    "fontSize": {
      "xs": "0.75rem",
      "sm": "0.875rem",
      "base": "1rem",
      "lg": "1.125rem",
      "xl": "1.25rem"
    }
  },
  "spacing": {
    "xs": "0.25rem",
    "sm": "0.5rem",
    "md": "1rem",
    "lg": "1.5rem",
    "xl": "2rem"
  },
  "borderRadius": {
    "none": "0",
    "sm": "0.125rem",
    "md": "0.375rem",
    "lg": "0.5rem",
    "full": "9999px"
  }
}
```

## Registry Management

### Creating New Registries
1. **Identify the configuration need**
2. **Design the JSON structure**
3. **Create TypeScript interfaces**
4. **Implement the registry file**
5. **Create or update the consuming hook**
6. **Test the integration**

### Registry Naming Conventions
- Use kebab-case for file names
- Use descriptive, specific names
- Group related configurations in subdirectories
- Include version numbers for breaking changes

### Registry Versioning
```json
{
  "version": "1.0.0",
  "registryType": "form",
  "lastUpdated": "2024-01-15T10:30:00Z",
  "config": {
    // Registry content
  }
}
```

## Best Practices

### 1. Schema Design
- Keep schemas consistent across similar registries
- Use descriptive property names
- Include required and optional fields clearly
- Provide default values where appropriate

### 2. Performance Considerations
- Keep registry files reasonably sized
- Use lazy loading for large configurations
- Implement caching in hooks
- Consider splitting large registries

### 3. Validation
- Validate registry schemas at build time
- Use TypeScript interfaces for type safety
- Implement runtime validation for critical data
- Provide meaningful error messages

### 4. Documentation
- Document registry schemas
- Provide usage examples
- Include migration guides for changes
- Maintain changelog for registry updates

## Integration with Components

### Registry-Driven Component Example
```typescript
import { useRegistry } from '@/hooks/useRegistry';

interface ComponentConfig {
  variants: Record<string, { className: string }>;
  sizes: Record<string, { className: string }>;
  defaultProps: Record<string, any>;
}

function ConfigurableCard({ variant, size, children, ...props }) {
  const { data: config } = useRegistry<ComponentConfig>('components/card');
  
  const variantClass = config?.variants[variant]?.className || '';
  const sizeClass = config?.sizes[size]?.className || '';
  const defaults = config?.defaultProps || {};
  
  const finalProps = { ...defaults, ...props };
  
  return (
    <div className={`${variantClass} ${sizeClass}`} {...finalProps}>
      {children}
    </div>
  );
}
```

### Dynamic Form Generation
```typescript
function DynamicForm({ registryPath, onSubmit }) {
  const { data: formConfig } = useRegistry<FormRegistry>(`forms/${registryPath}`);
  const { data: validationRules } = useRegistry<ValidationRules>(`validations/${registryPath}`);
  
  if (!formConfig) return <div>Loading...</div>;
  
  return (
    <form onSubmit={onSubmit}>
      {formConfig.sections.map(section => (
        <FormSection
          key={section.sectionId}
          config={section}
          validationRules={validationRules}
        />
      ))}
    </form>
  );
}
```

## TypeScript Integration

### Registry Type Definitions
```typescript
// types/registry.ts
export interface FormField {
  id: string;
  type: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  validation?: ValidationConfig;
  gridColumn?: string;
}

export interface FormRegistry {
  formId: string;
  title: string;
  description: string;
  sections: FormSection[];
  actions: FormAction[];
}

export interface ComponentRegistry {
  component: string;
  variants: Record<string, ComponentVariant>;
  sizes: Record<string, ComponentSize>;
  defaultProps: Record<string, any>;
}
```

### Generic Registry Hook
```typescript
function useRegistry<T>(path: string): UseRegistryResult<T> {
  // Implementation with proper typing
}
```

## Testing Registries

### Schema Validation Tests
```typescript
import { validateRegistrySchema } from '@/lib/registry-validator';

test('user-profile form registry has valid schema', () => {
  const registry = require('@/registries/forms/user-profile.json');
  const isValid = validateRegistrySchema(registry, 'form');
  expect(isValid).toBe(true);
});
```

### Integration Tests
```typescript
import { renderHook } from '@testing-library/react-hooks';
import { useRegistry } from '@/hooks/useRegistry';

test('should load form registry correctly', async () => {
  const { result, waitForNextUpdate } = renderHook(() => 
    useRegistry<FormRegistry>('forms/user-profile')
  );
  
  await waitForNextUpdate();
  
  expect(result.current.data).toBeDefined();
  expect(result.current.data.formId).toBe('user-profile');
});
```

## Related Documentation
- [Hooks README](../hooks/README.md) - Registry hooks implementation
- [Components README](../components/README.md) - Using registries in components
- [Types README](../types/README.md) - Registry type definitions
- [Validation Guide](../validations/README.md) - Validation system
