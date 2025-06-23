# Code Style and Conventions - Current Implementation Standards

## TypeScript Configuration ✅
- **Strict mode**: Enabled with comprehensive type checking
- **Target**: ES2017+ with modern JavaScript features
- **Module resolution**: bundler (Next.js optimized)
- **Path mapping**: `@/*` points to project root for clean imports
- **JSX**: preserve (handled by Next.js compiler)

## Project File Organization

```
blokar-frontend/
├── app/                    # Next.js App Router (pages and layouts)
│   ├── (auth)/            # Route group: authentication pages
│   ├── (app)/             # Route group: main application pages
│   └── auth/              # API routes for authentication
├── components/
│   ├── ui/                # shadcn/ui base components (reusable)
│   ├── layout/            # Layout-specific components
│   ├── action-panel/      # Feature panels (CRUD operations)
│   └── projects/          # Project-specific components
├── hooks/                 # Custom React hooks
├── types/                 # TypeScript type definitions
├── utils/                 # Utility functions and configurations
├── services/              # API service layer
└── lib/                   # Library configurations
```

## Naming Conventions

### Files and Directories
- **Files**: `kebab-case` (`use-user.ts`, `sidebar-app.tsx`, `new-contact-panel.tsx`)
- **Directories**: `kebab-case` (`action-panel`, `resizable-layout`)
- **Route groups**: `(group-name)` (`(app)`, `(auth)`)

### Components and Functions
- **Components**: `PascalCase` (`SidebarApp`, `TopBarApp`, `NewContactPanel`)
- **Hooks**: `camelCase` starting with 'use' (`useUser`, `useSidebar`)
- **Functions**: `camelCase` (`getProjectIcon`, `formatFileSize`)
- **Constants**: `UPPER_SNAKE_CASE` (`PROJECT_FORM_FIELDS`, `SIDEBAR_WIDTH`)

### Types and Interfaces
- **Types**: `PascalCase` (`User`, `Project`, `DocumentCategory`)
- **Interfaces**: `PascalCase` with descriptive names (`NavigationItem`, `ProjectCardProps`)
- **Enums**: `PascalCase` (`ProjectStatus`, `TaskType`, `ContactType`)

## Component Development Patterns

### Modern React Patterns
```typescript
"use client"; // For client components requiring browser APIs

// Functional components with TypeScript
interface ComponentProps {
  title: string;
  onAction?: () => void;
}

export function ComponentName({ title, onAction }: ComponentProps) {
  // Component logic
  return <div>{title}</div>;
}

// Default exports for components
export default ComponentName;
```

### Custom Hooks Pattern
```typescript
// hooks/use-feature.ts
export function useFeature() {
  const [state, setState] = useState(initialState);
  
  useEffect(() => {
    // Side effects with proper dependencies
  }, []); // Fixed dependency arrays
  
  return { state, actions };
}
```

### Action Panel Pattern
```typescript
// components/action-panel/feature/action-panel.tsx
interface FeaturePanelProps {
  onClose: () => void;
  data?: FeatureData;
}

export function FeaturePanel({ onClose, data }: FeaturePanelProps) {
  // Panel implementation
}
```

## Import Organization

### Import Order and Style
```typescript
// 1. External libraries (React ecosystem)
import { useState, useEffect } from "react";
import { createClient } from "@supabase/ssr";

// 2. External UI libraries
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

// 3. Internal components and hooks
import { useUser } from "@/hooks/use-user";
import { SidebarApp } from "@/components/layout/sidebar/sidebar-app";

// 4. Types (with type-only imports when possible)
import type { User } from "@supabase/supabase-js";
import type { Project, NavigationItem } from "@/types/sidebar";

// 5. Utilities and constants
import { cn } from "@/lib/utils";
```

## Styling and UI Patterns

### Tailwind CSS Standards
```typescript
// Use consistent spacing and sizing
className="flex items-center space-x-2 p-4"

// Conditional classes with cn utility
className={cn(
  "base-classes",
  condition && "conditional-classes",
  variant === "primary" && "primary-variant-classes"
)}

// Component variants with class-variance-authority
const buttonVariants = cva(
  "base-button-classes",
  {
    variants: {
      variant: {
        default: "default-variant-classes",
        destructive: "destructive-variant-classes",
      },
      size: {
        default: "default-size-classes",
        sm: "small-size-classes",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);
```

### shadcn/ui Integration
- **Use existing components**: Prefer shadcn/ui components over custom
- **Extend carefully**: Add variants without breaking existing patterns
- **Consistent theming**: Support dark/light modes
- **Accessibility**: Maintain ARIA attributes and keyboard navigation

## Data Management Patterns

### Supabase Integration
```typescript
// Server components
import { createClient } from "@/utils/supabase/server";

// Client components
import { createClient } from "@/utils/supabase/client";

// Type-safe database operations
const { data, error } = await supabase
  .from('table')
  .select('*')
  .eq('field', value);
```

### State Management
```typescript
// Component-level state
const [loading, setLoading] = useState(false);

// Global auth state (via context/hooks)
const { user, loading } = useUser();

// Form state management
const [formData, setFormData] = useState<FormType>(initialData);
```

## Error Handling and Loading States

### Consistent Error Patterns
```typescript
// Loading states
if (loading) {
  return <Skeleton className="w-full h-20" />;
}

// Error states
if (error) {
  return (
    <div className="text-destructive">
      <p>Error: {error.message}</p>
    </div>
  );
}

// Empty states
if (!data?.length) {
  return <EmptyState message="No items found" />;
}
```

### Form Validation
```typescript
// Client-side validation
const [errors, setErrors] = useState<Record<string, string>>({});

const validateForm = (data: FormData) => {
  const newErrors: Record<string, string> = {};
  
  if (!data.required_field) {
    newErrors.required_field = "This field is required";
  }
  
  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};
```

## Authentication Integration

### Auth-Aware Components
```typescript
// Protected component pattern
export function ProtectedComponent() {
  const { user, loading } = useUser();
  
  if (loading) return <LoadingState />;
  if (!user) return <AuthRequired />;
  
  return <ComponentContent />;
}

// Auth state handling
const handleAuthAction = async () => {
  const { data, error } = await supabase.auth.signOut();
  if (error) {
    // Handle error
  }
};
```

## Performance Best Practices

### Efficient Re-rendering
```typescript
// Stable dependency arrays (CRITICAL)
useEffect(() => {
  // Side effect
}, []); // Empty array for mount-only effects

// Memoized values
const memoizedValue = useMemo(() => 
  expensiveCalculation(data), [data]
);

// Memoized callbacks
const handleClick = useCallback(() => {
  // Handler logic
}, [dependency]);
```

### Component Optimization
- **Small, focused components**: Single responsibility
- **Proper prop typing**: Comprehensive TypeScript interfaces
- **Conditional rendering**: Efficient loading and error states
- **Key props**: Stable keys for list items

## Code Quality Standards

### TypeScript Usage
- **Strict typing**: No `any` types unless absolutely necessary
- **Interface definitions**: Clear prop and data interfaces
- **Type assertions**: Use sparingly and with type guards
- **Utility types**: Leverage TypeScript utility types

### Code Organization
- **File size**: Keep components under 200 lines when possible
- **Function size**: Single-purpose functions
- **Import management**: Clean, organized imports
- **Comment usage**: JSDoc for complex functions, inline for clarity

## Current Implementation Status ✅
All style conventions are actively implemented and enforced in the current codebase. The project demonstrates consistent patterns across all components and features.