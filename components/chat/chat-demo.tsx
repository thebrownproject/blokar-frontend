'use client';

import { BlokarChat } from '@/components/chat';
import { TooltipProvider } from '@/components/ui/tooltip';

/**
 * ChatDemo - Demo page for testing the new chat interface
 * 
 * This is a standalone demo component to test our new Blokar chat
 * interface before integrating it into the main application.
 * 
 * Navigate to this component to see the new chat in action!
 */
export default function ChatDemo() {
  return (
    <TooltipProvider>
      <div className="h-screen flex flex-col bg-background">
        {/* Header */}
        <div className="border-b px-4 py-3">
          <h1 className="text-lg font-semibold">Blokar Chat Demo</h1>
          <p className="text-sm text-muted-foreground">
            Testing the new AI chat interface
          </p>
        </div>
        
        {/* Chat Interface */}
        <div className="flex-1 min-h-0">
          <BlokarChat 
            id="demo-chat"
            className="h-full"
          />
        </div>
      </div>
    </TooltipProvider>
  );
}
