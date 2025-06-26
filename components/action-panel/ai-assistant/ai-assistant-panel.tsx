"use client";

import { useChat } from "@ai-sdk/react";
import { MessageSquare } from "lucide-react";
import { ActionPanelCard } from "../action-panel-card";
import { ChatInput } from "./chat-input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useWorkspace } from "@/hooks/use-workspace";
import { useProjects } from "@/hooks/use-projects";

export function AiAssistantPanel() {
  const workspace = useWorkspace();
  const { projects } = useProjects();

  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat({
      api: "/api/chat",
      maxSteps: 5, // Enable multi-step tool calling
      onToolCall: async ({ toolCall }) => {
        // Handle client-side tools
        switch (toolCall.toolName) {
          case "clearAllCards":
            workspace.clearAllCards();
            return "All cards cleared from workspace";

          case "showProjectCard": {
            const args = toolCall.args as { projectId: string };
            const project = projects.find((p) => p.id === args.projectId);
            if (project) {
              workspace.showProjectCard(project);
              return `Showing ${project.name} project card`;
            }
            return `Project with ID ${args.projectId} not found`;
          }

          case "showMultipleProjectCards": {
            const args = toolCall.args as { 
              projectIds: string[]; 
              clearFirst?: boolean 
            };
            const foundProjects = projects.filter((p) => 
              args.projectIds.includes(p.id)
            );
            if (foundProjects.length > 0) {
              workspace.showMultipleProjectCards(foundProjects, args.clearFirst);
              return `Showing ${foundProjects.length} project cards`;
            }
            return `No projects found for the provided IDs`;
          }

          case "highlightProject": {
            const args = toolCall.args as { projectId: string };
            const project = projects.find((p) => p.id === args.projectId);
            if (project) {
              // Find the card ID for this project
              const card = workspace.cards.find(
                (c) => c.type === "project" && c.data.id === args.projectId
              );
              if (card) {
                workspace.highlightCard(card.id);
                return `Highlighted ${project.name} project card`;
              }
              return `Project ${project.name} is not currently displayed`;
            }
            return `Project with ID ${args.projectId} not found`;
          }

          case "refreshProjectList":
            return "Project list refreshed";

          case "updateWorkspaceLayout": {
            const args = toolCall.args as { 
              layout: "grid" | "list" | "timeline" | "kanban";
              density?: "compact" | "comfortable" | "spacious";
            };
            workspace.setLayout(args.layout);
            if (args.density) {
              workspace.setDensity(args.density);
            }
            return `Workspace layout updated to ${args.layout}${
              args.density ? ` with ${args.density} density` : ""
            }`;
          }

          case "navigateToProject": {
            const args = toolCall.args as { 
              projectId: string; 
              view?: "details" | "tasks" | "timeline" | "documents" 
            };
            const project = projects.find((p) => p.id === args.projectId);
            if (project) {
              workspace.showProjectCard(project);
              return `Navigated to ${project.name} project`;
            }
            return `Project with ID ${args.projectId} not found`;
          }

          default:
            return `Tool ${toolCall.toolName} executed`;
        }
      },
    });

  const headerActions = <MessageSquare className="h-4 w-4" />;

  return (
    <ActionPanelCard title="Blokar Copilot" headerActions={headerActions}>
      <div className="flex flex-col h-full">
        {/* Messages Area */}
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

                    {/* Render Tool Invocations */}
                    {message.toolInvocations?.map((tool) => (
                      <div
                        key={tool.toolCallId}
                        className="mt-2 text-xs opacity-75"
                      >
                        🔧 {tool.toolName}
                        {tool.state === "result" && (
                          <div className="mt-1 font-medium">
                            ✅ {String(tool.result)}
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
        <div className="border-t p-4">
          <form onSubmit={handleSubmit} className="space-y-2">
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
