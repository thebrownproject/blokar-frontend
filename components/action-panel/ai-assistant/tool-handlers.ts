import type { Project } from "@/services/supabase";

interface ToolHandlerDeps {
  workspace: {
    clearAllCards: () => void;
    showProjectCard: (project: Project) => void;
    showMultipleProjectCards: (projects: Project[], clearFirst?: boolean) => void;
    highlightCard: (cardId: string) => void;
    setLayout: (layout: "grid" | "list" | "timeline" | "kanban") => void;
    setDensity: (density: "compact" | "comfortable" | "spacious") => void;
    cards: Array<{ id: string; type: "project"; data: Project }>;
  };
  projects: Project[];
}

export function createToolHandler({ workspace, projects }: ToolHandlerDeps) {
  return async ({ toolCall }: { toolCall: any }) => {
    const { toolName, args } = toolCall;

    switch (toolName) {
      case "clearAllCards":
        workspace.clearAllCards();
        return "All cards cleared from workspace";

      case "showProjectCard": {
        const project = projects.find((p) => p.id === args.projectId);
        if (!project) return `Project with ID ${args.projectId} not found`;
        
        workspace.showProjectCard(project);
        return `Showing ${project.name} project card`;
      }

      case "showMultipleProjectCards": {
        const foundProjects = projects.filter((p) => args.projectIds.includes(p.id));
        if (foundProjects.length === 0) return "No projects found for the provided IDs";
        
        workspace.showMultipleProjectCards(foundProjects, args.clearFirst);
        return `Showing ${foundProjects.length} project cards`;
      }

      case "highlightProject": {
        const project = projects.find((p) => p.id === args.projectId);
        if (!project) return `Project with ID ${args.projectId} not found`;
        
        const card = workspace.cards.find(
          (c) => c.type === "project" && c.data.id === args.projectId
        );
        if (!card) return `Project ${project.name} is not currently displayed`;
        
        workspace.highlightCard(card.id);
        return `Highlighted ${project.name} project card`;
      }

      case "updateWorkspaceLayout":
        workspace.setLayout(args.layout);
        if (args.density) workspace.setDensity(args.density);
        return `Workspace layout updated to ${args.layout}${
          args.density ? ` with ${args.density} density` : ""
        }`;

      case "navigateToProject": {
        const project = projects.find((p) => p.id === args.projectId);
        if (!project) return `Project with ID ${args.projectId} not found`;
        
        workspace.showProjectCard(project);
        return `Navigated to ${project.name} project`;
      }

      case "refreshProjectList":
        return "Project list refreshed";

      default:
        return `Tool ${toolName} executed`;
    }
  };
}
