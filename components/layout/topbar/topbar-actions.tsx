"use client";

import {
  MessageSquare,
  Plus,
  Building,
  ListTodo,
  UserPlus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { usePanel } from "@/hooks/use-panel";

export function TopBarActions() {
  const { togglePanel, openPanel } = usePanel();

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
            <MessageSquare className="h-4 w-4" />
            <span className="sr-only">Open Blokar Copilot</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Blokar Copilot</p>
        </TooltipContent>
      </Tooltip>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <Plus className="h-4 w-4" />
                  <span className="sr-only">Create new</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Create New</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="min-w-48 rounded-lg"
          align="end"
          sideOffset={4}
        >
          <DropdownMenuLabel className="text-muted-foreground text-xs">
            Create New
          </DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => openPanel("new-project")}
            className="gap-2 p-2"
          >
            <Building className="h-4 w-4" />
            New Project
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => openPanel("new-task")}
            className="gap-2 p-2"
          >
            <ListTodo className="h-4 w-4" />
            New Task
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => openPanel("new-contact")}
            className="gap-2 p-2"
          >
            <UserPlus className="h-4 w-4" />
            New Contact
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
