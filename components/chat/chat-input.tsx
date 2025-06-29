'use client';

import { useRef, useEffect, useState, FormEvent } from 'react';
import { Send, StopCircle, Paperclip, Mic } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface ChatInputProps {
  /**
   * Current input value
   */
  input: string;
  /**
   * Input change handler
   */
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  /**
   * Form submit handler
   */
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  /**
   * Whether AI is currently generating
   */
  isLoading: boolean;
  /**
   * Stop generation function
   */
  stop: () => void;
  /**
   * File attachments (placeholder)
   */
  attachments: File[];
  /**
   * Set attachments function
   */
  setAttachments: (files: File[]) => void;
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * ChatInput - Modern chat input component
 * 
 * Features:
 * - Auto-resizing textarea (like Vercel's MultimodalInput)
 * - Send/Stop button states
 * - File attachment support (placeholder)
 * - Voice input support (placeholder)
 * - Keyboard shortcuts (Enter to send, Shift+Enter for new line)
 * - Smooth animations and modern styling
 */
export function ChatInput({
  input,
  onChange,
  onSubmit,
  isLoading,
  stop,
  attachments,
  setAttachments,
  className = ''
}: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isRecording, setIsRecording] = useState(false);

  // Auto-resize textarea based on content
  const adjustHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  };

  // Reset height after submit
  const resetHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = '48px';
    }
  };

  // Auto-resize when input changes
  useEffect(() => {
    adjustHeight();
  }, [input]);

  // Focus textarea on mount
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  // Handle input change with auto-resize
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e);
    adjustHeight();
  };

  // Handle form submission
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    
    onSubmit(e);
    resetHeight();
  };

  // Handle keyboard shortcuts
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!input.trim() || isLoading) return;
      
      // Create a synthetic form event
      const form = e.currentTarget.closest('form');
      if (form) {
        const syntheticEvent = new Event('submit', { bubbles: true, cancelable: true });
        Object.defineProperty(syntheticEvent, 'preventDefault', {
          value: () => {},
          writable: false
        });
        form.dispatchEvent(syntheticEvent);
        handleSubmit(syntheticEvent as any);
      }
    }
  };

  // Handle file attachment (placeholder)
  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setAttachments([...attachments, ...files]);
  };

  // Handle voice recording (placeholder)
  const handleVoiceToggle = () => {
    setIsRecording(!isRecording);
    // TODO: Implement voice recording
  };

  const canSubmit = input.trim() && !isLoading;

  return (
    <div className={cn("relative w-full", className)}>
      {/* File Attachments Preview */}
      {attachments.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-2">
          {attachments.map((file, index) => (
            <div 
              key={index} 
              className="flex items-center gap-2 bg-muted px-3 py-1 rounded-md text-sm"
            >
              <span>{file.name}</span>
              <button
                onClick={() => setAttachments(attachments.filter((_, i) => i !== index))}
                className="text-muted-foreground hover:text-foreground"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Main Input Form */}
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative flex items-end gap-2 bg-background border rounded-lg p-2">
          {/* Left Actions */}
          <div className="flex items-end gap-1 pb-1">
            {/* File Attachment Button */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleFileSelect}
                  className="h-8 w-8 p-0 hover:bg-muted"
                >
                  <Paperclip className="size-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Attach files (coming soon)</p>
              </TooltipContent>
            </Tooltip>

            {/* Voice Input Button */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleVoiceToggle}
                  className={cn(
                    "h-8 w-8 p-0 hover:bg-muted",
                    isRecording && "bg-red-100 text-red-600 hover:bg-red-200"
                  )}
                >
                  <Mic className="size-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Voice input (coming soon)</p>
              </TooltipContent>
            </Tooltip>
          </div>

          {/* Textarea */}
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Message Blokar Copilot..."
            className="min-h-[48px] max-h-[200px] resize-none border-0 bg-transparent focus-visible:ring-0 text-sm"
            style={{ height: '48px' }}
            disabled={isLoading}
          />

          {/* Submit/Stop Button */}
          <div className="pb-1">
            {isLoading ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    size="sm"
                    onClick={stop}
                    variant="secondary"
                    className="h-8 w-8 p-0 bg-red-100 hover:bg-red-200 text-red-600"
                  >
                    <StopCircle className="size-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Stop generation</p>
                </TooltipContent>
              </Tooltip>
            ) : (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="submit"
                    size="sm"
                    disabled={!canSubmit}
                    className="h-8 w-8 p-0"
                  >
                    <Send className="size-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Send message</p>
                </TooltipContent>
              </Tooltip>
            )}
          </div>
        </div>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileChange}
          className="hidden"
          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif"
        />
      </form>

      {/* Helper Text */}
      <div className="flex justify-between items-center text-xs text-muted-foreground mt-2 px-1">
        <span>Press Enter to send, Shift+Enter for new line</span>
        <span>{input.length} characters</span>
      </div>
    </div>
  );
}
