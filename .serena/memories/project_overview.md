# Blokar Frontend - Project Overview

## Purpose
Blokar Frontend is a Next.js TypeScript application that appears to be a construction/project management platform (based on the components structure including contacts, projects, tasks, documents). It features:

- User authentication with Supabase
- Project management dashboard
- Resizable panel layouts
- Document management
- Contact management
- Task tracking
- AI assistant capabilities

## Tech Stack
- **Framework**: Next.js 15.3.3 with App Router
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4 with shadcn/ui components
- **Authentication**: Supabase (@supabase/ssr 0.6.1, @supabase/supabase-js 2.50.0)
- **UI Components**: Radix UI primitives with shadcn/ui
- **Icons**: Lucide React
- **Fonts**: Geist Sans and Geist Mono
- **Themes**: next-themes for dark/light mode
- **React**: React 19 (latest)
- **State Management**: React hooks (no external state library detected)

## Key Dependencies
- Radix UI components for accessibility
- react-resizable-panels for layout management
- class-variance-authority and clsx for styling utilities
- Supabase for backend and authentication
- Modern React 19 with concurrent features

## Architecture Pattern
- App Router with route groups: (app) and (auth)
- Component-based architecture with shadcn/ui
- Custom hooks for data management
- Supabase SSR for authentication
- Middleware-based auth protection
