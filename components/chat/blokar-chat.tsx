'use client';

import { useChat } from '@ai-sdk/react';
import { useState } from 'react';
import { useWorkspace } from '@/hooks/use-workspace';
import { useProjects } from '@/hooks/use-projects';
import { createToolHandler } from '@/components/action-panel/ai-assistant/tool-handlers';
import { ChatMessages } from './chat-messages';
import { ChatInput } from './chat-input';

interface BlokarChatProps {
  /**
   * Chat ID for conversation persistence
   */
  id?: string;
  /**
   * Initial messages to populate the chat
   */
  initialMessages?: any[];
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * BlokarChat - Main chat container component
 * 
 * This is the primary chat interface that combines:
 * - Message display area (ChatMessages)
 * - Input area (ChatInput) 
 * - Integration with our existing tool handlers
 * 
 * Based on Vercel's AI chatbot structure but adapted for Blokar's needs.
 */
export function BlokarChat({ 
  id = 'blokar-chat', 
  initialMessages = [],
  className = '' 
}: BlokarChatProps) {
  // Get our existing workspace and projects hooks
  const workspace = useWorkspace();
  const { projects } = useProjects();
  
  // Create tool handler (using existing logic)
  const handleToolCall = createToolHandler({ workspace, projects });

  // Initialize chat with Vercel AI SDK - same structure as original
  const { 
    messages, 
    input, 
    handleInputChange, 
    handleSubmit, 
    isLoading,
    stop,
    append
  } = useChat({
    api: '/api/chat',
    maxSteps: 5,
    onToolCall: handleToolCall,
    initialMessages,
    id,
  });

  // File attachments state (placeholder for future)
  const [attachments, setAttachments] = useState<File[]>([]);

  return (
    <div className={`flex flex-col h-full bg-background ${className}`}>
      {/* Messages Area - matches Vercel's structure */}
      <ChatMessages 
        messages={messages}
        isLoading={isLoading}
        append={append}
      />
      
      {/* Input Area - matches Vercel's form structure */}
      <div className="flex mx-auto px-4 bg-background pb-4 md:pb-6 gap-2 w-full">
        <ChatInput
          input={input}
          onChange={handleInputChange}
          onSubmit={handleSubmit}
          isLoading={isLoading}
          stop={stop}
          attachments={attachments}
          setAttachments={setAttachments}
        />
      </div>
    </div>
  );
}
