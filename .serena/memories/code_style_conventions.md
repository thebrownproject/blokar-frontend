# Code Style and Conventions

## TypeScript Configuration
- Strict mode enabled
- Target: ES2017
- Module resolution: bundler
- Path mapping: "@/*" points to project root
- JSX: preserve (handled by Next.js)

## File Organization
```
app/                    # Next.js App Router pages
├── (auth)/            # Route group for auth layouts
├── (app)/             # Route group for main app layouts
├── auth/              # API routes for auth
└── globals.css        # Global styles

components/
├── ui/                # shadcn/ui components
├── layout/            # Layout-specific components
└── action-panel/      # Feature-specific components

hooks/                 # Custom React hooks
utils/                 # Utility functions
types/                 # TypeScript type definitions
services/              # API and external service clients
```

## Naming Conventions
- **Files**: kebab-case (`use-user.ts`, `sidebar-app.tsx`)
- **Components**: PascalCase (`SidebarApp`, `TopBarApp`)
- **Hooks**: camelCase starting with 'use' (`useUser`, `usePanel`)
- **Types**: PascalCase (`User`, `Project`)
- **Constants**: UPPER_SNAKE_CASE

## Component Patterns
- Use `"use client"` directive for client components
- Functional components with TypeScript
- Props interfaces defined inline or exported
- Default exports for components
- Named exports for utilities

## Import Conventions
```typescript
// External libraries first
import { useState, useEffect } from "react";
import { createClient } from "@supabase/ssr";

// Internal imports with path mapping
import { Button } from "@/components/ui/button";
import { useUser } from "@/hooks/use-user";
import type { User } from "@supabase/supabase-js";
```

## React Patterns
- Custom hooks for data fetching and state management
- useEffect for side effects with proper dependency arrays
- Functional components with modern React patterns
- Context providers for global state when needed

## Styling
- Tailwind CSS classes for styling
- shadcn/ui components for consistency
- CSS modules or styled-components not used
- Theme provider for dark/light mode support
