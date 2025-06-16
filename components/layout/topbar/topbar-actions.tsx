"use client";

import { MessageCircle, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { usePanel } from "@/hooks/use-panel";

export function TopBarActions() {
  const { togglePanel, isOpen, closePanel } = usePanel();

  return (
    <div className="flex items-center gap-2">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => togglePanel("ai-assistant")}
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
            onClick={() => togglePanel("new-project")}
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

      {isOpen && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={closePanel}
              className="h-9 w-9"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close panel</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Close Panel</p>
          </TooltipContent>
        </Tooltip>
      )}
    </div>
  );
}
