'use client';

import { useChat } from '@ai-sdk/react';
import { useEffect, useState } from 'react';
import { useWorkspace } from '@/hooks/use-workspace';
import { useProjects } from '@/hooks/use-projects';
import { createToolHandler } from '@/components/action-panel/ai-assistant/tool-handlers';
import { Messages } from './messages';
import { MultimodalInput } from './multimodal-input';

interface BlokarChatProps {
  id?: string;
  initialMessages?: any[];
  className?: string;
}

/**
 * BlokarChat - Main chat component (copied from Vercel AI Chatbot)
 * 
 * Exact structure as Vercel's Chat component but adapted for Blokar
 */
export function BlokarChat({ 
  id = 'blokar-chat', 
  initialMessages = [],
  className = '' 
}: BlokarChatProps) {
  const workspace = useWorkspace();
  const { projects } = useProjects();
  const handleToolCall = createToolHandler({ workspace, projects });

  const {
    messages,
    setMessages,
    handleSubmit,
    input,
    setInput,
    append,
    status,
    stop,
    reload,
  } = useChat({
    api: '/api/chat',
    maxSteps: 5,
    onToolCall: handleToolCall,
    initialMessages,
    id,
  });

  const [attachments, setAttachments] = useState<any[]>([]);

  return (
    <div className={`flex flex-col min-w-0 h-dvh bg-background ${className}`}>
      <Messages
        chatId={id}
        status={status}
        votes={[]}
        messages={messages}
        setMessages={setMessages}
        reload={reload}
        isReadonly={false}
        isArtifactVisible={false}
      />

      <form className="flex mx-auto px-4 bg-background pb-4 md:pb-6 gap-2 w-full md:max-w-3xl">
        <MultimodalInput
          chatId={id}
          input={input}
          setInput={setInput}
          handleSubmit={handleSubmit}
          status={status}
          stop={stop}
          attachments={attachments}
          setAttachments={setAttachments}
          messages={messages}
          setMessages={setMessages}
          append={append}
          selectedVisibilityType="public"
        />
      </form>
    </div>
  );
}
