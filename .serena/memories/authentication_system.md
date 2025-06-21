# Authentication System and Known Issues

## Supabase Authentication Setup

### Architecture
- **Server-side**: `utils/supabase/server.ts` - Server component auth
- **Client-side**: `utils/supabase/client.ts` - Browser auth client
- **Middleware**: `middleware.ts` + `utils/supabase/middleware.ts` - Route protection
- **Hook**: `hooks/use-user.ts` - Client-side user state management

### Auth Flow
1. Middleware checks auth status on all routes
2. Redirects unauthenticated users to `/login`
3. Client components use `useUser()` hook for user state
4. Server components use `createClient()` from server utils

### Route Protection
- Protected routes: All except `/login`, `/register`, `/auth/*`
- Middleware handles redirects automatically
- Cookie-based session management

## CRITICAL ISSUE: Infinite Render Loop

### Location
`hooks/use-user.ts` - Line with `useEffect(..., [supabase.auth])`

### Problem
```typescript
export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient(); // ← NEW INSTANCE EVERY RENDER

  useEffect(() => {
    // ... auth logic
  }, [supabase.auth]); // ← DEPENDENCY ON NEW OBJECT REFERENCE
}
```

### Root Cause
- `createClient()` creates a new Supabase instance on every render
- `supabase.auth` is a new object reference each time
- useEffect dependency array includes this changing reference
- Causes infinite re-renders

### Solution
```typescript
// Option 1: Empty dependency array
useEffect(() => {
  // ... auth logic
}, []); // Remove supabase.auth dependency

// Option 2: Memoize the client
const supabase = useMemo(() => createClient(), []);

// Option 3: Move client outside component
const supabase = createClient(); // Outside component
```

### Testing the Fix
- Replace dependency array with `[]`
- Restart development server
- Check if dashboard stops refreshing infinitely
- Verify auth still works correctly

## Auth State Management
- User state managed in `useUser` hook
- Loading state prevents flash of unauthenticated content
- Auth state changes handled via `onAuthStateChange`
- Cleanup subscription in useEffect return
