"use client";

import { MessageCircle, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function TopBarActions() {
  const handleChatClick = () => {
    // Implement chat functionality
    console.log("Opening AI Assistant...");
  };

  const handleNewClick = () => {
    // Implement new item functionality
    console.log("Creating new project...");
  };

  return (
    <div className="flex items-center gap-2">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleChatClick}
            className="h-9 w-9"
          >
            <MessageCircle className="h-4 w-4" />
            <span className="sr-only">Open AI Assistant</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>AI Assistant</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleNewClick}
            className="h-9 w-9"
          >
            <Plus className="h-4 w-4" />
            <span className="sr-only">Create new</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>New Project</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
}
