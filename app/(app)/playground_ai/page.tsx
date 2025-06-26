"use client";

import { useProjects } from "@/hooks/use-projects";
import { useWorkspace } from "@/hooks/use-workspace";
import { ProjectCard } from "@/components/projects/project-card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquare, Trash2 } from "lucide-react";

export default function PlaygroundAIPage() {
  const { projects } = useProjects();
  const workspace = useWorkspace();

  // Function to manually add a project card for testing
  const addProjectCard = (project: any) => {
    workspace.showProjectCard(project);
  };

  return (
    <div className="flex flex-1 h-[calc(100vh-4rem)]">
      {/* Dynamic Card Area - Full Width */}
      <div className="flex-1 p-6">
        <div className="space-y-4 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">AI Playground</h1>
              <p className="text-muted-foreground">
                Use the Blokar Copilot action panel to interact with projects and watch them appear here
              </p>
            </div>

            <div className="flex gap-2">
              {/* Quick test buttons */}
              {projects.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => addProjectCard(projects[0])}
                  className="flex items-center gap-2"
                >
                  <MessageSquare className="h-4 w-4" />
                  Test Add Card
                </Button>
              )}
              
              {workspace.cards.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={workspace.clearAllCards}
                  className="flex items-center gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Clear All Cards
                </Button>
              )}
            </div>
          </div>

          {/* Workspace Stats */}
          <div className="text-sm text-muted-foreground">
            {workspace.cards.length} card{workspace.cards.length !== 1 ? "s" : ""} displayed
            {workspace.layout !== "grid" && ` • Layout: ${workspace.layout}`}
            {workspace.density !== "comfortable" && ` • Density: ${workspace.density}`}
          </div>
        </div>

        {/* Dynamic Cards Display Area */}
        <ScrollArea className="h-[calc(100vh-12rem)]">
          {workspace.cards.length === 0 ? (
            <div className="flex items-center justify-center h-64 border-2 border-dashed border-muted-foreground/25 rounded-lg">
              <div className="text-center">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                <h3 className="text-lg font-semibold mb-2">
                  No Cards Displayed
                </h3>
                <p className="text-muted-foreground max-w-sm">
                  Open the Blokar Copilot from the action panel and ask it to show project cards!
                  <br />
                  <br />
                  Try: "Show me all projects" or "Display multiple project cards"
                </p>
              </div>
            </div>
          ) : (
            <div className={`grid gap-4 ${
              workspace.layout === "grid" 
                ? "auto-fit-cards" 
                : workspace.layout === "list"
                ? "grid-cols-1"
                : "auto-fit-cards"
            }`}>
              {workspace.cards.map((card) => (
                <div 
                  key={card.id} 
                  className={`relative group transition-all duration-300 ${
                    card.highlighted ? "ring-2 ring-primary shadow-lg scale-105" : ""
                  }`}
                >
                  <ProjectCard project={card.data} taskCount={0} />
                  <Button
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0"
                    onClick={() => workspace.removeCard(card.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </div>
    </div>
  );
}
