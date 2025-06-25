## Core Concept

User wants to implement a sophisticated AI agent system using Vercel AI SDK that goes beyond simple chatbot functionality to create a truly intelligent AEC project management interface.

## Key Innovation: Context-Aware Card Management

- AI maintains awareness of what cards are currently displayed on screen
- Intelligently removes irrelevant cards when context changes
- Example: \"Show Harbor Project\" → \"Show Oak Project\" = AI automatically clears Harbor card and shows Oak
- Uses tools like getCurrentScreenState(), smartClearCards(), removeSpecificCards()

## Implementation Phases

### Phase 1: Medium Scale (8-12 tools)

- Full CRUD operations for projects, tasks, contacts
- Organized tool structure in separate files (tools/projects.ts, tools/tasks.ts, etc.)
- Context-aware card management
- Target: Current implementation

### Phase 2: Agent Specialization (30-50 tools)

- Domain-specific agents (ProjectAgent, TaskAgent, ContactAgent)
- Intent classification and routing
- Multi-step workflows across agents

### Phase 3: Large Scale (100+ tools)

- Master agent with hierarchical sub-agents
- Role-based agents (architect, PM, contractor)
- Dynamic tool loading based on context
- Advanced workflow orchestration

## File Structure Evolution

```
Phase 1: route.ts + tools/ directory (by domain)
Phase 2: route.ts + agents/ + tools/ (organized by agent)
Phase 3: Thin route.ts + agents/domains/ + agents/roles/ + agents/context/ + dynamic tool registry
```

## Tool Calling Strategy

- Server-side tools: Data fetching, CRUD operations
- Client-side tools: UI manipulation, state management
- Hybrid tools: Complex workflows that combine both

## Key Technical Decisions

- Use Vercel AI SDK's maxSteps for multi-tool workflows
- Implement agent triage through intent classification
- Context-aware tool selection based on user role, project phase, current screen
- Performance optimization through lazy loading and caching

## Vision: AI Operating System for AEC

Transform from traditional software to conversational interface where AI:

- Understands current context and manages interface dynamically
- Routes complex requests to specialized agents
- Maintains state across interactions
- Proactively organizes information based on user intent

## Current Implementation Status

- User has created playground-ai route to test dynamic card generation
- Working on implementing basic tools for showing/hiding project cards
- Next steps: Extract tools into organized file structure, implement context awareness
- Future: Scale to full agent triage system with 100+ tools

## Architecture Artifact

Created comprehensive architecture document covering medium to large scale implementation strategy, available as artifact for copying to Claude project.
