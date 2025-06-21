# Suggested Commands for Blokar Frontend

## Development Commands

### Start Development Server
```bash
npm run dev
# Uses Next.js with Turbopack for faster builds
# Serves on http://localhost:3000
```

### Build and Production
```bash
npm run build        # Build for production
npm start           # Start production server
```

### Code Quality
```bash
npm run lint        # Run ESLint with Next.js config
```

## System Commands (macOS/Darwin)

### File Operations
```bash
ls -la              # List files with details
find . -name "*.ts" # Find TypeScript files
grep -r "useUser"   # Search for text in files
cd app/             # Navigate to directories
```

### Git Operations
```bash
git status          # Check git status
git add .           # Stage all changes
git commit -m ""    # Commit changes
git push            # Push to remote
git pull            # Pull from remote
```

### Package Management
```bash
npm install         # Install dependencies
npm install <pkg>   # Add new dependency
npm update          # Update dependencies
```

### Development Tools
```bash
code .              # Open in VS Code
open .              # Open in Finder
```

## Project-Specific Commands

### Supabase (if local development)
```bash
npx supabase start  # Start local Supabase
npx supabase stop   # Stop local Supabase
```

### Database/Migration Commands
```bash
# Commands will depend on Supabase setup
npx supabase db push
npx supabase db pull
```

## Environment Setup
- Ensure Node.js 18+ is installed
- Set up Supabase environment variables:
  - NEXT_PUBLIC_SUPABASE_URL
  - NEXT_PUBLIC_SUPABASE_ANON_KEY
