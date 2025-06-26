"use client";

import { useChat } from "@ai-sdk/react";
import { MessageSquare, User, Bot } from "lucide-react";
import { ActionPanelCard } from "../action-panel-card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useWorkspace } from "@/hooks/use-workspace";
import { useProjects } from "@/hooks/use-projects";
import { createToolHandler } from "./tool-handlers";
import ReactMarkdown from "react-markdown";

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
        <ScrollArea className="flex-1">
          <div className="divide-y">
            {messages.length === 0 ? (
              <div className="text-center text-muted-foreground py-12 px-6">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-base font-medium mb-2">Ask me about your projects!</p>
                <p className="text-sm opacity-75">
                  Try: "Show me all projects" or "Create a new task"
                </p>
              </div>
            ) : (
              messages.map((message) => (
                <div key={message.id} className="px-6 py-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      {message.role === "user" ? (
                        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                          <User className="h-4 w-4 text-primary-foreground" />
                        </div>
                      ) : (
                        <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                          <Bot className="h-4 w-4 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-foreground mb-3">
                        {message.role === "user" ? "You" : "Blokar Copilot"}
                      </div>
                      
                      <div className="prose prose-sm max-w-none text-foreground">
                        <ReactMarkdown
                          components={{
                            p: ({ children }) => (
                              <p className="text-sm leading-relaxed mb-3 last:mb-0 text-foreground">{children}</p>
                            ),
                            ul: ({ children }) => (
                              <ul className="list-disc list-inside mb-3 space-y-1 text-foreground">{children}</ul>
                            ),
                            ol: ({ children }) => (
                              <ol className="list-decimal list-inside mb-3 space-y-1 text-foreground">{children}</ol>
                            ),
                            li: ({ children }) => (
                              <li className="text-sm text-foreground">{children}</li>
                            ),
                            h1: ({ children }) => (
                              <h1 className="text-lg font-bold mb-3 mt-4 first:mt-0 text-foreground">{children}</h1>
                            ),
                            h2: ({ children }) => (
                              <h2 className="text-base font-bold mb-2 mt-4 first:mt-0 text-foreground">{children}</h2>
                            ),
                            h3: ({ children }) => (
                              <h3 className="text-sm font-semibold mb-2 mt-3 first:mt-0 text-foreground">{children}</h3>
                            ),
                            strong: ({ children }) => (
                              <strong className="font-semibold text-foreground">{children}</strong>
                            ),
                            em: ({ children }) => (
                              <em className="italic text-foreground">{children}</em>
                            ),
                            code: ({ children }) => (
                              <code className="bg-muted px-1.5 py-0.5 rounded text-xs font-mono text-foreground border">
                                {children}
                              </code>
                            ),
                            pre: ({ children }) => (
                              <pre className="bg-muted p-4 rounded-lg text-xs font-mono overflow-x-auto mb-3 border">
                                {children}
                              </pre>
                            ),
                            blockquote: ({ children }) => (
                              <blockquote className="border-l-4 border-muted-foreground/20 pl-4 mb-3 text-muted-foreground italic">
                                {children}
                              </blockquote>
                            ),
                          }}
                        >
                          {message.content}
                        </ReactMarkdown>
                      </div>

                      {message.toolInvocations?.map((tool) => (
                        <div key={tool.toolCallId} className="mt-4 text-xs">
                          <div className="flex items-center space-x-2 text-muted-foreground">
                            <span>🔧</span>
                            <span className="font-medium">{tool.toolName}</span>
                          </div>
                          {tool.state === "result" && (
                            <div className="mt-2 text-xs bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-md px-3 py-2">
                              <div className="flex items-center space-x-2">
                                <span className="text-green-600 dark:text-green-400">✅</span>
                                <span className="text-green-800 dark:text-green-200 font-medium">
                                  {String(tool.result)}
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))
            )}
            
            {isLoading && (
              <div className="px-6 py-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                      <Bot className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-foreground mb-3">
                      Blokar Copilot
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <div className="animate-pulse">●</div>
                      <span>Thinking...</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="border-t bg-background/50 px-6 py-4">
          <form onSubmit={handleSubmit} className="space-y-3">
            <textarea
              value={input}
              onChange={handleInputChange}
              placeholder="Message Blokar Copilot..."
              className="w-full resize-none border rounded-lg px-4 py-3 text-sm min-h-[80px] max-h-[200px] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-background"
              disabled={isLoading}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
            />
            <div className="flex justify-between items-center text-xs text-muted-foreground">
              <span>Press Enter to send, Shift+Enter for new line</span>
              <span>{input.length} characters</span>
            </div>
          </form>
        </div>
      </div>
    </ActionPanelCard>
  );
}
