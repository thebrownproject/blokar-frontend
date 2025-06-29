'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

interface ChatSuggestionsProps {
  /**
   * Function to append new messages
   */
  append: (message: { role: string; content: string }) => void;
}

/**
 * ChatSuggestions - Prompt suggestion buttons
 * 
 * Provides helpful starter prompts focused on construction
 * and project management workflows. Based on Vercel's
 * SuggestedActions but customized for Blokar's AEC domain.
 */
export function ChatSuggestions({ append }: ChatSuggestionsProps) {
  const suggestions = [
    {
      title: 'Show a project',
      label: 'Display project details and status',
      action: 'Show me a project',
    },
    {
      title: 'Show my dashboard',
      label: 'View project overview and analytics',
      action: 'Show my dashboard',
    },
    {
      title: 'Show my current tasks',
      label: 'List active tasks and deadlines',
      action: 'Show my current tasks',
    },
    {
      title: 'Create a new project',
      label: 'Start a new construction project',
      action: 'Help me create a new project',
    },
    {
      title: 'Project statistics',
      label: 'Get project analytics and metrics',
      action: 'Show me project statistics',
    },
    {
      title: 'Find project documents',
      label: 'Search for drawings and files',
      action: 'Help me find project documents',
    },
  ];

  const handleSuggestionClick = (action: string) => {
    append({
      role: 'user',
      content: action,
    });
  };

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 w-full">
      {suggestions.map((suggestion, index) => (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ delay: 0.05 * index }}
          key={`suggestion-${suggestion.title}-${index}`}
          className={index > 3 ? 'hidden lg:block' : 'block'}
        >
          <Button
            variant="outline"
            onClick={() => handleSuggestionClick(suggestion.action)}
            className="text-left border rounded-xl px-4 py-4 text-sm flex-1 gap-1 flex-col w-full h-auto justify-start items-start hover:bg-muted/50 transition-colors"
          >
            <span className="font-medium text-foreground">{suggestion.title}</span>
            <span className="text-muted-foreground text-xs leading-relaxed">
              {suggestion.label}
            </span>
          </Button>
        </motion.div>
      ))}
    </div>
  );
}
