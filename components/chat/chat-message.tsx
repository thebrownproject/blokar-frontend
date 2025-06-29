'use client';

import { motion } from 'framer-motion';
import { User, Bot, Copy, RotateCcw } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import ReactMarkdown from 'react-markdown';
import { cn } from '@/lib/utils';

interface ChatMessageProps {
  /**
   * Message object containing role, content, etc.
   */
  message: {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    toolInvocations?: any[];
  };
  /**
   * Whether this message is currently being generated
   */
  isLoading?: boolean;
}

/**
 * ChatMessage - Individual message bubble
 * 
 * Features:
 * - User vs Assistant styling (right vs left alignment)
 * - Proper avatars for each role
 * - Message actions (copy, regenerate) on hover
 * - Tool invocation display
 * - Smooth animations
 * 
 * Based on Vercel's message structure but with chat bubble styling
 */
export function ChatMessage({ message, isLoading = false }: ChatMessageProps) {
  const [showActions, setShowActions] = useState(false);
  const isUser = message.role === 'user';

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    // Could add toast notification here
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className={cn(
        "w-full mx-auto max-w-3xl px-4 group/message",
        isUser ? "flex justify-end" : "flex justify-start"
      )}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className={cn(
        "flex gap-3 max-w-[80%]",
        isUser ? "flex-row-reverse" : "flex-row"
      )}>
        {/* Avatar */}
        <div className={cn(
          "size-8 flex items-center rounded-full justify-center ring-1 shrink-0 ring-border",
          isUser 
            ? "bg-primary text-primary-foreground" 
            : "bg-background text-foreground"
        )}>
          {isUser ? (
            <User className="size-4" />
          ) : (
            <Bot className="size-4" />
          )}
        </div>

        {/* Message Content */}
        <div className={cn(
          "flex flex-col gap-2 min-w-0",
          isUser ? "items-end" : "items-start"
        )}>
          {/* Message Bubble */}
          <div className={cn(
            "rounded-lg px-4 py-3 break-words",
            isUser
              ? "bg-primary text-primary-foreground" 
              : "bg-muted text-foreground"
          )}>
            {isUser ? (
              // User messages - plain text
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
            ) : (
              // Assistant messages - rendered markdown
              <div className="prose prose-sm max-w-none dark:prose-invert">
                <ReactMarkdown
                  components={{
                    p: ({ children }) => (
                      <p className="text-sm leading-relaxed mb-2 last:mb-0">{children}</p>
                    ),
                    ul: ({ children }) => (
                      <ul className="list-disc list-inside mb-2 space-y-1">{children}</ul>
                    ),
                    ol: ({ children }) => (
                      <ol className="list-decimal list-inside mb-2 space-y-1">{children}</ol>
                    ),
                    li: ({ children }) => (
                      <li className="text-sm">{children}</li>
                    ),
                    h1: ({ children }) => (
                      <h1 className="text-lg font-bold mb-2 mt-3 first:mt-0">{children}</h1>
                    ),
                    h2: ({ children }) => (
                      <h2 className="text-base font-bold mb-2 mt-3 first:mt-0">{children}</h2>
                    ),
                    h3: ({ children }) => (
                      <h3 className="text-sm font-semibold mb-1 mt-2 first:mt-0">{children}</h3>
                    ),
                    strong: ({ children }) => (
                      <strong className="font-semibold">{children}</strong>
                    ),
                    code: ({ children }) => (
                      <code className="bg-background/50 px-1.5 py-0.5 rounded text-xs font-mono border">
                        {children}
                      </code>
                    ),
                    pre: ({ children }) => (
                      <pre className="bg-background/50 p-3 rounded-lg text-xs font-mono overflow-x-auto mb-2 border">
                        {children}
                      </pre>
                    ),
                  }}
                >
                  {message.content}
                </ReactMarkdown>
              </div>
            )}
          </div>

          {/* Tool Invocations Display */}
          {message.toolInvocations?.map((tool, index) => (
            <div key={`${message.id}-tool-${index}`} className="text-xs w-full">
              <div className="flex items-center space-x-2 text-muted-foreground mb-1">
                <span>🔧</span>
                <span className="font-medium">{tool.toolName}</span>
              </div>
              {tool.state === 'result' && (
                <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-md px-3 py-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-green-600 dark:text-green-400">✅</span>
                    <span className="text-green-800 dark:text-green-200 font-medium text-xs">
                      {String(tool.result)}
                    </span>
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Message Actions - Show on hover for assistant messages */}
          {!isUser && showActions && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex items-center gap-1"
            >
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCopy}
                    className="h-7 w-7 p-0"
                  >
                    <Copy className="size-3" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Copy message</p>
                </TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {}} // TODO: Implement regenerate
                    className="h-7 w-7 p-0"
                  >
                    <RotateCcw className="size-3" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Regenerate</p>
                </TooltipContent>
              </Tooltip>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
