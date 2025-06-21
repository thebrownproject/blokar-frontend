# Project Structure and Key Files

## Directory Structure
```
blokar-frontend/
├── app/                    # Next.js App Router
│   ├── (app)/             # Main app layout group
│   │   ├── dashboard/     # Dashboard pages
│   │   └── playground/    # Playground/testing pages
│   ├── (auth)/            # Auth layout group
│   │   ├── login/         # Login page
│   │   └── register/      # Registration page
│   ├── auth/              # Auth API routes
│   │   ├── confirm/       # Email confirmation
│   │   └── logout/        # Logout route
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── ui/                # shadcn/ui components
│   ├── layout/            # Layout components (sidebar, topbar)
│   └── action-panel/      # Feature panels (contact, document, etc.)
├── hooks/                 # Custom React hooks
├── utils/                 # Utility functions
│   └── supabase/         # Supabase client configurations
├── lib/                   # Library configurations
├── services/              # API service clients
└── types/                 # TypeScript type definitions
```

## Critical Files

### Authentication & Middleware
- `middleware.ts` - Next.js middleware for auth protection
- `utils/supabase/client.ts` - Browser Supabase client
- `utils/supabase/server.ts` - Server Supabase client
- `utils/supabase/middleware.ts` - Auth middleware implementation
- `hooks/use-user.ts` - **CRITICAL**: User authentication hook (potential infinite loop source)

### Layouts
- `app/layout.tsx` - Root layout with providers
- `app/(app)/layout.tsx` - Main app layout with sidebar and panels
- `app/(auth)/layout.tsx` - Simple auth layout (if exists)

### Key Components
- `components/layout/sidebar/` - Sidebar navigation components
- `components/layout/topbar/` - Top navigation components
- `components/layout/resizable-layout/` - Panel layout system
- `components/action-panel/` - Feature-specific panels

### Configuration Files
- `package.json` - Dependencies and scripts
- `tsconfig.json` - TypeScript configuration
- `next.config.ts` - Next.js configuration
- `eslint.config.mjs` - ESLint configuration
- `components.json` - shadcn/ui configuration

## Important Patterns
- Route groups `(app)` and `(auth)` for different layouts
- Supabase SSR pattern with server/client separation
- Custom hooks for data management
- Resizable panel system for dynamic layouts
- Action panels for CRUD operations
