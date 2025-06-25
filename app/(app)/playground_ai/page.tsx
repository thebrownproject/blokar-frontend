"use client";

import { useState } from "react";
import { useChat } from "@ai-sdk/react";
import { useProjects } from "@/hooks/use-projects";
import { ProjectCard } from "@/components/projects/project-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquare, Trash2 } from "lucide-react";
import type { Project } from "@/services/supabase";

// State for managing visible cards
interface VisibleCard {
  id: string;
  type: "project";
  data: Project;
  timestamp: number;
}

export default function PlaygroundAIPage() {
  const [visibleCards, setVisibleCards] = useState<VisibleCard[]>([]);
  const { projects } = useProjects();

  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat({
      api: "/api/chat",
      maxSteps: 5,
      onToolCall: async ({ toolCall }) => {
        // Handle client-side tools
        if (toolCall.toolName === "clearAllCards") {
          setVisibleCards([]);
          return "All cards cleared from display";
        }

        if (toolCall.toolName === "showProjectCard") {
          const args = toolCall.args as { projectId: string };
          const { projectId } = args;
          const project = projects.find((p) => p.id === projectId);

          if (project) {
            // Add card to display
            const newCard: VisibleCard = {
              id: `project-${Date.now()}`,
              type: "project",
              data: project,
              timestamp: Date.now(),
            };

            setVisibleCards((prev) => [...prev, newCard]);
            return `Showing ${project.name} project card`;
          }

          return `Project with ID ${projectId} not found`;
        }
      },
    });

  const clearAllCards = () => {
    setVisibleCards([]);
  };

  const removeCard = (cardId: string) => {
    setVisibleCards((prev) => prev.filter((card) => card.id !== cardId));
  };

  return (
    <div className="flex flex-1 h-[calc(100vh-4rem)]">
      {/* Dynamic Card Area - Left Side */}
      <div className="flex-1 p-6 border-r">
        <div className="space-y-4 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">AI Playground</h1>
              <p className="text-muted-foreground">
                Ask AI to show project cards and watch them appear dynamically
              </p>
            </div>

            {visibleCards.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearAllCards}
                className="flex items-center gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Clear All Cards
              </Button>
            )}
          </div>
        </div>

        {/* Dynamic Cards Display Area */}
        <ScrollArea className="h-[calc(100vh-12rem)]">
          {visibleCards.length === 0 ? (
            <div className="flex items-center justify-center h-64 border-2 border-dashed border-muted-foreground/25 rounded-lg">
              <div className="text-center">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                <h3 className="text-lg font-semibold mb-2">
                  No Cards Displayed
                </h3>
                <p className="text-muted-foreground max-w-sm">
                  Ask the AI to show project cards and they'll appear here!
                  <br />
                  Try: "Show me a project" or "Display the Harbor project"
                </p>
              </div>
            </div>
          ) : (
            <div className="grid gap-4 auto-fit-cards">
              {visibleCards.map((card) => (
                <div key={card.id} className="relative group">
                  <ProjectCard project={card.data} taskCount={0} />
                  <Button
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0"
                    onClick={() => removeCard(card.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </div>

      {/* AI Chat Area - Right Side */}
      <div className="w-96 flex flex-col">
        <Card className="h-full flex flex-col">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Blokar AI Assistant
            </CardTitle>
          </CardHeader>

          <CardContent className="flex-1 flex flex-col">
            {/* Messages Area */}
            <ScrollArea className="flex-1 mb-4">
              <div className="space-y-4">
                {messages.length === 0 ? (
                  <div className="text-center text-muted-foreground py-8">
                    <p className="text-sm">
                      Try asking:
                      <br />
                      • "Show me a project"
                      <br />
                      • "Display all my projects"
                      <br />• "Clear the screen"
                    </p>
                  </div>
                ) : (
                  messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.role === "user"
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${
                          message.role === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        }`}
                      >
                        {message.content}

                        {/* Show tool invocations */}
                        {message.toolInvocations?.map((tool) => (
                          <div
                            key={tool.toolCallId}
                            className="mt-2 text-xs opacity-75"
                          >
                            🔧 {tool.toolName}
                            {"result" in tool && tool.result && (
                              <div className="mt-1 font-medium">
                                ✅ {tool.result}
                              </div>
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
                        <span className="text-sm text-muted-foreground">
                          Thinking...
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Input Area */}
            <form onSubmit={handleSubmit} className="space-y-2">
              <textarea
                value={input}
                onChange={handleInputChange}
                placeholder="Ask me to show projects..."
                className="w-full resize-none border rounded-md px-3 py-2 text-sm min-h-[80px]"
                disabled={isLoading}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
              />
              <div className="text-xs text-muted-foreground">
                {visibleCards.length} card{visibleCards.length !== 1 ? "s" : ""}{" "}
                displayed
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
