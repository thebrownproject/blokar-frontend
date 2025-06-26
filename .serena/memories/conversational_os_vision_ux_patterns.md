# Blokar Conversational OS Vision & UX Patterns

## Core Vision: Interface Becomes the Conversation
- **Not traditional software with AI features** - this is AI as Operating System
- **Dynamic interface generation**: Cards appear/disappear/transform based on conversation flow
- **Just-in-time UI**: Every interface component generated based on what user needs right now
- **Fluid visual conversation**: Main window is living representation of the dialogue

## Key UX Patterns
- **Context Switching**: Harbor project → Oak project = Canvas Agent automatically transitions workspace
- **Related Information**: "Show tasks for this project" = Add task cards alongside existing project card
- **Workspace Optimization**: Canvas Agent proactively cleans up irrelevant cards as conversation evolves
- **User Agency**: Pin system lets users control what stays persistent

## Canvas Agent Decision Examples
```
Current: [Harbor Project (pinned), Random Task Card]
User: "Show Oak project"
Canvas Decision: Keep Harbor (pinned), remove Random Task, show Oak
Result: [Harbor Project (pinned), Oak Project]
```

## Future Advanced Features
- **Batch Operations**: Create 5 tasks with in-chat approval workflow
- **Context Memory**: Remember workspace preferences and conversation patterns
- **Multi-modal**: Integration with CAD files, images, documents
- **Approval Workflow**: Preview cards in chat before pushing to canvas