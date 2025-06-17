buildspec-io/
├── src/
│   ├── app/                                    # Next.js App Router
│   │   ├── globals.css                         # Global styles
│   │   ├── layout.tsx                          # Root layout (HTML, providers)
│   │   ├── page.tsx                            # Landing page (redirect to dashboard)
│   │   ├── (auth)/                             # Route group - Auth layouts
│   │   │   ├── layout.tsx                      # Simple auth wrapper layout
│   │   │   ├── login/
│   │   │   │   └── page.tsx                    # Login page
│   │   │   ├── register/
│   │   │   │   └── page.tsx                    # Register page
│   │   │   └── forgot-password/
│   │   │       └── page.tsx                    # Password reset
│   │   └── (app)/                              # Route group - Full app layout
│   │       ├── layout.tsx                      # Sidebar + Topbar + ResizablePanelLayout
│   │       ├── dashboard/
│   │       │   └── page.tsx                    # Main dashboard
│   │       ├── projects/
│   │       │   ├── page.tsx                    # Projects list
│   │       │   └── [id]/
│   │       │       ├── page.tsx                # Project detail
│   │       │       ├── contacts/
│   │       │       │   └── page.tsx            # Project contacts
│   │       │       ├── tasks/
│   │       │       │   └── page.tsx            # Project tasks
│   │       │       └── documents/
│   │       │           └── page.tsx            # Project documents
│   │       ├── contacts/
│   │       │   └── page.tsx                    # Organization contacts
│   │       ├── documents/
│   │       │   └── page.tsx                    # Organization documents
│   │       └── settings/
│   │           ├── page.tsx                    # Organization settings
│   │           ├── profile/
│   │           │   └── page.tsx                # User profile
│   │           └── team/
│   │               └── page.tsx                # Team management
│   ├── components/
│   │   ├── ui/                                 # shadcn/ui components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   ├── resizable.tsx                   # ResizablePanelGroup, Panel, Handle
│   │   │   ├── tabs.tsx
│   │   │   ├── form.tsx
│   │   │   └── ... (other shadcn components)
│   │   ├── layout/                             # Layout components
│   │   │   ├── index.ts                        # Export barrel
│   │   │   ├── sidebar/
│   │   │   │   ├── index.ts
│   │   │   │   ├── sidebar.tsx
│   │   │   │   ├── sidebar-nav.tsx
│   │   │   │   ├── sidebar-projects.tsx
│   │   │   │   └── sidebar-user.tsx
│   │   │   ├── topbar/
│   │   │   │   ├── index.ts
│   │   │   │   ├── topbar.tsx
│   │   │   │   ├── breadcrumbs.tsx
│   │   │   │   ├── search.tsx
│   │   │   │   └── user-menu.tsx
│   │   │   └── resizable-layout/               # New ResizablePanel system
│   │   │       ├── index.ts
│   │   │       ├── resizable-panel-layout.tsx  # Main layout component
│   │   │       ├── crud-panel.tsx              # Right panel content
│   │   │       ├── panel-header.tsx            # Panel header with title/close
│   │   │       └── panel-content.tsx           # Dynamic content renderer
│   │   ├── features/                           # Business logic components
│   │   │   ├── auth/
│   │   │   │   ├── index.ts
│   │   │   │   ├── login-form.tsx
│   │   │   │   ├── register-form.tsx
│   │   │   │   ├── profile-form.tsx
│   │   │   │   └── organization-setup.tsx
│   │   │   ├── projects/
│   │   │   │   ├── index.ts
│   │   │   │   ├── project-card.tsx
│   │   │   │   ├── project-form.tsx            # For CRUD panel
│   │   │   │   ├── project-list.tsx
│   │   │   │   ├── project-dashboard.tsx
│   │   │   │   ├── building-class-selector.tsx
│   │   │   │   └── project-stats.tsx
│   │   │   ├── contacts/
│   │   │   │   ├── index.ts
│   │   │   │   ├── contact-card.tsx
│   │   │   │   ├── contact-form.tsx            # For CRUD panel
│   │   │   │   ├── contacts-list.tsx
│   │   │   │   ├── council-contact-form.tsx
│   │   │   │   └── contact-type-filter.tsx
│   │   │   ├── tasks/
│   │   │   │   ├── index.ts
│   │   │   │   ├── task-card.tsx
│   │   │   │   ├── task-form.tsx               # For CRUD panel
│   │   │   │   ├── tasks-list.tsx
│   │   │   │   ├── compliance-tracker.tsx
│   │   │   │   └── task-status-filter.tsx
│   │   │   ├── documents/
│   │   │   │   ├── index.ts
│   │   │   │   ├── document-card.tsx
│   │   │   │   ├── document-upload.tsx         # For CRUD panel
│   │   │   │   ├── documents-list.tsx
│   │   │   │   ├── file-preview.tsx
│   │   │   │   ├── category-selector.tsx
│   │   │   │   └── document-metadata-form.tsx
│   │   │   ├── dashboard/
│   │   │   │   ├── index.ts
│   │   │   │   ├── stats-cards.tsx
│   │   │   │   ├── recent-projects.tsx
│   │   │   │   ├── recent-activity.tsx
│   │   │   │   └── construction-metrics.tsx
│   │   │   └── ai-chat/                        # Future Phase 2
│   │   │       ├── index.ts
│   │   │       ├── chat-interface.tsx          # For CRUD panel
│   │   │       ├── message-bubble.tsx
│   │   │       ├── ncc-research.tsx
│   │   │       └── compliance-suggestions.tsx
│   │   └── shared/                             # Reusable components
│   │       ├── index.ts
│   │       ├── loading-spinner.tsx
│   │       ├── error-boundary.tsx
│   │       ├── empty-state.tsx
│   │       ├── data-table.tsx
│   │       └── confirmation-dialog.tsx
│   ├── hooks/                                  # Custom hooks
│   │   ├── index.ts
│   │   ├── use-auth.ts
│   │   ├── use-projects.ts
│   │   ├── use-contacts.ts
│   │   ├── use-tasks.ts
│   │   ├── use-documents.ts
│   │   ├── use-resizable-panel.ts              # Panel state management
│   │   └── use-australian-data.ts              # States, postcodes, etc.
│   ├── services/                               # API and external services
│   │   ├── index.ts
│   │   ├── api.ts                              # Main API client
│   │   ├── auth-service.ts
│   │   ├── projects-service.ts
│   │   ├── contacts-service.ts
│   │   ├── tasks-service.ts
│   │   ├── documents-service.ts
│   │   └── supabase.ts                         # Supabase client
│   ├── types/                                  # TypeScript definitions
│   │   ├── index.ts
│   │   ├── auth.ts
│   │   ├── projects.ts
│   │   ├── contacts.ts
│   │   ├── tasks.ts
│   │   ├── documents.ts
│   │   ├── api.ts
│   │   └── australian-data.ts                  # Building classes, states
│   ├── utils/                                  # Helper functions
│   │   ├── index.ts
│   │   ├── cn.ts                               # Class name utility
│   │   ├── formatters.ts                       # Date, currency, etc.
│   │   ├── validators.ts                       # Form validation
│   │   ├── australian-helpers.ts               # ABN, postcodes, etc.
│   │   └── api-helpers.ts                      # API utilities
│   ├── constants/                              # App constants
│   │   ├── index.ts
│   │   ├── routes.ts
│   │   ├── australian-data.ts                  # States, building classes
│   │   └── api-endpoints.ts
│   └── styles/                                 # Additional styles
│       └── globals.css                         # Extended global styles
├── public/                                     # Static assets
│   ├── icons/
│   ├── images/
│   └── logos/
├── docs/                                       # Your existing documentation
│   └── ... (all your current docs)
└── backend/                                    # Your existing FastAPI backend
    └── ... (all your current backend code)