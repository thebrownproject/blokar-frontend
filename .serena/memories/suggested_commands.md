# Suggested Commands - Updated for Current Operational State

## Primary Development Commands

### Start/Stop Development
```bash
npm run dev              # Start Next.js dev server (http://localhost:3000)
npm run build            # Build for production (should complete without errors)
npm start               # Start production server
npm run lint            # ESLint check (should pass cleanly)
```

### Project Status Verification
```bash
# Quick health check
npm run dev && echo "✅ Dev server started successfully"
npm run build && echo "✅ Production build successful"
npm run lint && echo "✅ Linting passed"
```

## Feature Development Commands

### Component Development
```bash
# Find components by type
find components -name "*-panel.tsx"     # Action panels
find components -name "sidebar-*.tsx"   # Sidebar components  
find components -name "topbar-*.tsx"    # Topbar components
find components/ui -name "*.tsx"        # UI components

# Search for component usage
grep -r "useUser" .                     # Find auth hook usage
grep -r "ActionPanel" .                 # Find panel usage
grep -r "createClient" .                # Find Supabase usage
```

### Type Development
```bash
# Review type definitions
cat types/sidebar.ts                    # Navigation types
cat types/contacts.ts                   # Contact types
cat types/documents.ts                  # Document types
cat types/tasks.ts                      # Task types
```

### Authentication Testing
```bash
# Check auth-related files
cat hooks/use-user.ts                   # Auth hook (FIXED)
cat middleware.ts                       # Route protection
cat utils/supabase/client.ts            # Browser client
cat utils/supabase/server.ts            # Server client
```

## Database and Backend Commands

### Supabase Integration
```bash
# Local Supabase (if configured)
npx supabase start                      # Start local instance
npx supabase stop                       # Stop local instance
npx supabase status                     # Check status

# Database operations (if configured)
npx supabase db reset                   # Reset local DB
npx supabase db push                    # Push schema changes
npx supabase db pull                    # Pull schema changes
```

### Environment Management
```bash
# Check environment variables
echo $NEXT_PUBLIC_SUPABASE_URL          # Should be set
echo $NEXT_PUBLIC_SUPABASE_ANON_KEY     # Should be set

# Environment file management
cat .env.local                          # Local environment
cp .env.example .env.local              # Setup from example
```

## Code Quality and Maintenance

### File Organization
```bash
# Project structure overview
tree -I 'node_modules|.next|.git'      # View project structure
ls -la components/                      # List components
ls -la app/                            # List pages/routes
ls -la hooks/                          # List custom hooks
```

### Code Analysis
```bash
# Find specific patterns
grep -r "useState" hooks/               # State management
grep -r "useEffect" .                   # Side effects
grep -r "createClient" .                # Supabase usage
grep -r "TODO\|FIXME" .                 # Code comments

# Component analysis
wc -l components/**/*.tsx               # Component sizes
find . -name "*.tsx" -o -name "*.ts" | wc -l  # Total files
```

## Git and Version Control

### Standard Git Workflow
```bash
git status                              # Check current state
git add .                              # Stage all changes
git commit -m "feat: description"      # Commit with convention
git push                               # Push to remote
git pull                               # Pull latest changes
```

### Branch Management
```bash
git branch                             # List branches
git checkout -b feature/new-feature    # Create feature branch
git checkout main                      # Switch to main
git merge feature/new-feature          # Merge feature
```

### History and Logs
```bash
git log --oneline -10                  # Recent commits
git log --grep="auth"                  # Search commit messages
git log --since="1 week ago"           # Recent activity
```

## Testing and Debugging

### Browser Testing
```bash
# Open specific pages (after npm run dev)
open http://localhost:3000              # Dashboard
open http://localhost:3000/login        # Login page
open http://localhost:3000/dashboard    # Main dashboard
open http://localhost:3000/projects/active  # Active projects
```

### Console Debugging
```bash
# Check for common issues
npm run dev 2>&1 | grep -i "error"     # Filter errors
npm run dev 2>&1 | grep -i "warning"   # Filter warnings
npm run build 2>&1 | tee build.log     # Save build output
```

### Performance Monitoring
```bash
# Bundle analysis (if configured)
npm run analyze                         # Bundle analyzer

# Development monitoring
npm run dev -- --turbo                 # Enable Turbopack
```

## Package Management

### Dependency Management
```bash
npm install                            # Install dependencies
npm update                             # Update dependencies
npm audit                              # Security audit
npm audit fix                          # Fix vulnerabilities
```

### Add New Dependencies
```bash
# UI components (already comprehensive)
npm install @radix-ui/react-*          # Additional Radix components

# Utilities
npm install clsx class-variance-authority  # Already installed
npm install lucide-react                    # Already installed
```

## System-Specific Commands (macOS)

### File Operations
```bash
ls -la                                 # List with details
find . -name "*.ts" -type f            # Find TypeScript files
grep -r "pattern" --include="*.tsx"    # Search in React files
cd app/                                # Navigate to app directory
```

### Development Environment
```bash
code .                                 # Open in VS Code
open .                                 # Open in Finder
which node                             # Check Node.js path
node --version                         # Check Node.js version
npm --version                          # Check npm version
```

## Current Project Status Commands

### Health Check
```bash
# Complete project health check
npm run lint && npm run build && echo "✅ Project is healthy"

# Quick development start
npm run dev && echo "🚀 Development server running at http://localhost:3000"
```

### Feature Verification
```bash
# Verify core features work
curl -s http://localhost:3000 > /dev/null && echo "✅ Server responsive"
grep -q "useUser" hooks/use-user.ts && echo "✅ Auth hook present"
ls components/action-panel/ && echo "✅ Action panels implemented"
```