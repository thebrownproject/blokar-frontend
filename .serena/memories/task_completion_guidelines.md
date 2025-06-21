# Task Completion Guidelines

## After Making Code Changes

### 1. Code Quality Checks
```bash
npm run lint           # Check for linting errors
npm run build          # Ensure build succeeds
```

### 2. Testing (when tests exist)
```bash
npm test              # Run test suite (if configured)
```

### 3. Git Workflow
```bash
git add .
git commit -m "descriptive commit message"
git push              # Push to remote repository
```

## Development Workflow

### Before Starting Work
- Ensure development server is running: `npm run dev`
- Check current branch: `git branch`
- Pull latest changes: `git pull`

### During Development
- Make small, focused commits
- Test changes in browser frequently
- Use browser dev tools for debugging
- Check console for errors

### After Completing Features
- Test functionality thoroughly
- Check responsive design (mobile/desktop)
- Verify no console errors
- Ensure authentication flows work
- Test with different user states (logged in/out)

## Debugging Process

### For React Issues
1. Check browser console for errors
2. Use React Developer Tools
3. Verify component state and props
4. Check useEffect dependencies
5. Inspect network requests

### For Authentication Issues
1. Check Supabase dashboard for auth logs
2. Verify environment variables are set
3. Test login/logout flows
4. Check cookie/session storage
5. Inspect middleware behavior

### For Build Issues
1. Clear `.next` directory
2. Delete `node_modules` and reinstall
3. Check TypeScript errors
4. Verify import paths
5. Check environment variable availability

## Code Review Checklist
- [ ] No console.log statements in production code
- [ ] Proper TypeScript types used
- [ ] Responsive design implemented
- [ ] Accessibility considerations addressed
- [ ] Error handling implemented
- [ ] Loading states provided
- [ ] Authentication state handled properly
