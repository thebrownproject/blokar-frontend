# Blokar Frontend - Comprehensive Project Overview

## Purpose
Blokar Frontend is a fully-featured construction/project management platform built with modern technologies. It provides:

- **Complete Authentication System** (Supabase-powered)
- **Project Management Dashboard** with real-time data
- **Document Management** with file upload/organization
- **Contact Management** for construction teams
- **Task Tracking** with status management
- **AI Assistant** for project support
- **Resizable Panel Layouts** for customizable workspace

## Tech Stack
- **Framework**: Next.js 15.3.3 with App Router (latest)
- **Language**: TypeScript 5 (strict mode)
- **Styling**: Tailwind CSS 4 with shadcn/ui component system
- **Authentication**: Supabase (@supabase/ssr 0.6.1, @supabase/supabase-js 2.50.0)
- **UI Framework**: Radix UI primitives with shadcn/ui
- **Icons**: Lucide React
- **Fonts**: Geist Sans and Geist Mono
- **Themes**: next-themes for dark/light mode support
- **React**: React 19 (latest with concurrent features)
- **State Management**: Custom React hooks (no external state library)

## Current Application Status: FULLY OPERATIONAL ✅

### Authentication ✅
- User registration, login, logout working
- Protected routes with middleware
- Session persistence and state management
- Email confirmation flow
- **No performance issues or infinite loops**

### Dashboard Features ✅
- **Main Dashboard**: `/dashboard` - Overview and stats
- **Active Projects**: `/projects/active` - Project listings  
- **Project Detail**: `/projects/[projectId]` - Individual project view
- **Playground**: `/playground` - Development/testing area

### Core Components ✅
- **Sidebar Navigation** with user profile, projects, quick actions
- **Resizable Panel System** for customizable workspace
- **Action Panels** for all CRUD operations:
  - Contact management (view/edit/new)
  - Document upload and management  
  - Project creation and editing
  - Task management (view/edit/new)
  - AI Assistant integration

### Data Types & Management ✅
- **Projects**: Full project lifecycle management
- **Contacts**: Team member and client management
- **Documents**: File organization with categories and status
- **Tasks**: Task tracking with types and status
- **Authentication**: User profiles and sessions

## Architecture Patterns
- **App Router** with route groups: `(app)` and `(auth)`
- **Component-based architecture** with shadcn/ui
- **Custom hooks** for data management and auth
- **Supabase SSR** for authentication and data
- **Middleware-based** route protection
- **TypeScript strict mode** for type safety
- **Responsive design** with mobile considerations

## Key Features
- **Professional UI/UX** with dark/light theme support
- **Real-time authentication** state management
- **File upload** and document organization
- **Project categorization** by building classifications
- **Task status tracking** and management
- **Contact type categorization** (client, contractor, etc.)
- **AI assistant** integration for project support