# Blokar AI Agent Implementation Technical Details

## File Structure Plan
```
app/api/chat/
├── route.ts                    # Thin orchestration layer
├── agents/
│   ├── master-agent.ts         # Router & coordinator  
│   ├── project-agent.ts        # Project CRUD specialist
│   └── canvas-agent.ts         # Workspace manager
├── tools/
│   ├── projects.ts             # Project CRUD tools
│   ├── tasks.ts                # Task CRUD tools
│   ├── contacts.ts             # Contact CRUD tools
│   └── system.ts               # UI management tools
├── utils/
│   ├── supabase.ts             # Database helpers
│   ├── validation.ts           # Common Zod schemas
│   ├── intent-classifier.ts    # LLM-based routing logic
│   └── context-analyzer.ts     # Screen state analysis
└── types/
    └── agents.ts               # TypeScript definitions
```

## Key React Insight
- **No manual UI state tracking**: Client-side tools update React state, automatic re-renders
- **Canvas Agent doesn't need to track UI**: React handles that automatically
- **Simplified architecture**: Master Agent routes, Domain Agents return data, Canvas Agent triggers React updates

## Tool Patterns
- **CRUD Pattern**: create/read/update/delete for each domain
- **Server-side**: Database operations, return data
- **Client-side**: UI updates via React state (setVisibleCards)
- **Validation**: Zod schemas for all tool parameters

## Critical Dependencies
- `@ai-sdk/anthropic` for Claude integration
- `maxSteps` parameter for multi-step workflows
- Existing Supabase setup continues unchanged