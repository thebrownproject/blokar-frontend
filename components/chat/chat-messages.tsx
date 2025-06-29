'use client';

import { motion } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { ChatMessage } from './chat-message';
import { ChatGreeting } from './chat-greeting';
import { ChatSuggestions } from './chat-suggestions';

interface ChatMessagesProps {
  /**
   * Array of messages to display
   */
  messages: any[];
  /**
   * Whether AI is currently generating a response
   */
  isLoading: boolean;
  /**
   * Function to append new messages (for suggestions)
   */
  append: (message: { role: string; content: string }) => void;
}

/**
 * ChatMessages - Message display container
 * 
 * Handles:
 * - Message list rendering with animations
 * - Auto-scroll to bottom on new messages
 * - Empty state with greeting and suggestions
 * - Loading state display
 * 
 * Structure copied from Vercel's Messages component
 */
export function ChatMessages({ messages, isLoading, append }: ChatMessagesProps) {
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'end'
      });
    }
  }, [messages.length, isLoading]);

  return (
    <div
      ref={messagesContainerRef}
      className="flex flex-col min-w-0 gap-6 flex-1 overflow-y-auto pt-4 relative"
    >
      {/* Empty State - Show greeting and suggestions when no messages */}
      {messages.length === 0 && (
        <>
          <ChatGreeting />
          <div className="max-w-3xl mx-auto px-4 w-full">
            <ChatSuggestions append={append} />
          </div>
        </>
      )}

      {/* Message List - Render each message with animations */}
      {messages.map((message, index) => (
        <ChatMessage
          key={message.id}
          message={message}
          isLoading={isLoading && messages.length - 1 === index}
        />
      ))}

      {/* Thinking State - Show when AI is processing (like Vercel's ThinkingMessage) */}
      {isLoading && 
        messages.length > 0 && 
        messages[messages.length - 1].role === 'user' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="w-full mx-auto max-w-3xl px-4"
        >
          <div className="flex gap-4">
            {/* AI Avatar */}
            <div className="size-8 flex items-center rounded-full justify-center ring-1 shrink-0 ring-border bg-background">
              <div className="translate-y-px">
                ✨
              </div>
            </div>
            
            {/* Thinking Animation */}
            <div className="flex items-center gap-2 text-muted-foreground">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-current rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-current rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-current rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
              </div>
              <span className="text-sm">Thinking...</span>
            </div>
          </div>
        </motion.div>
      )}

      {/* Scroll anchor - invisible element to scroll to */}
      <motion.div
        ref={messagesEndRef}
        className="shrink-0 min-w-[24px] min-h-[24px]"
      />
    </div>
  );
}
