"use client";

import { useChat } from "@ai-sdk/react";
import { MessageSquare } from "lucide-react";
import { ActionPanelCard } from "../action-panel-card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useWorkspace } from "@/hooks/use-workspace";
import { useProjects } from "@/hooks/use-projects";
import { createToolHandler } from "./tool-handlers";

export function AiAssistantPanel() {
  const workspace = useWorkspace();
  const { projects } = useProjects();
  
  const handleToolCall = createToolHandler({ workspace, projects });

  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: "/api/chat",
    maxSteps: 5,
    onToolCall: handleToolCall,
  });

  return (
    <ActionPanelCard title="Blokar Copilot" headerActions={<MessageSquare className="h-4 w-4" />}>
      <div className="flex flex-col h-full">
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Ask me about your projects, tasks, or contacts!</p>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg px-3 py-2 ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    
                    {message.toolInvocations?.map((tool) => (
                      <div key={tool.toolCallId} className="mt-2 text-xs opacity-75">
                        🔧 {tool.toolName}
                        {tool.state === "result" && (
                          <div className="mt-1 font-medium">✅ {String(tool.result)}</div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-muted rounded-lg px-3 py-2">
                  <div className="flex items-center space-x-2">
                    <div className="animate-pulse">●</div>
                    <span className="text-sm text-muted-foreground">Thinking...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="border-t p-4">
          <form onSubmit={handleSubmit}>
            <textarea
              value={input}
              onChange={handleInputChange}
              placeholder="Ask about your projects..."
              className="w-full resize-none border rounded-md px-3 py-2 text-sm min-h-[60px]"
              disabled={isLoading}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
            />
          </form>
        </div>
      </div>
    </ActionPanelCard>
  );
}
