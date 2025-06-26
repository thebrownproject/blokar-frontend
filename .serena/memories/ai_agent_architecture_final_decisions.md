# Blokar AI Agent Architecture - Final Implementation Decisions

## Core Architecture Decision: Multi-Agent System
- **Master Agent**: Claude-based router using LLM intent classification (not keyword matching)
- **Domain Specialist Agents**: Project Agent, Task Agent, Contact Agent (future: Notes, Calendar, Documents)
- **Canvas Agent**: Autonomous workspace management with full authority (no permission requests)

## Key Technology Choices
- **Provider**: Switch from OpenAI to Claude Sonnet 4 (@ai-sdk/anthropic)
- **Framework**: Vercel AI SDK with maxSteps for multi-step workflows
- **UI Management**: React automatic state updates (no manual UI state tracking needed)
- **Database**: Continue using Supabase for all CRUD operations

## Tool Organization Pattern
- **Server-side tools**: Domain CRUD operations (createProject, readProject, etc.)
- **Client-side tools**: UI management (showProjectCard, clearAllCards, etc.)
- **File structure**: tools/projects.ts, tools/tasks.ts, tools/contacts.ts, tools/system.ts

## Canvas Agent Authority
- **Pin System**: Users can pin cards to prevent AI removal
- **Smart Cleanup**: LLM-driven decisions about workspace relevance
- **Context Switching**: Autonomous card management as conversation flows
- **No Suggestions**: Just intelligent action without asking permission

## Implementation Phases
1. **Phase 1**: Master Agent + Project Agent with basic CRUD
2. **Phase 2**: Add Canvas Agent for workspace management  
3. **Phase 3**: Scale to full multi-agent system with all domains