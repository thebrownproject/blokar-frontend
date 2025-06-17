"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { usePanel } from "@/hooks/use-panel";
import { cn } from "@/lib/utils";

interface ActionPanelCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  headerActions?: React.ReactNode;
}

export function ActionPanelCard({
  title,
  children,
  className,
  headerActions,
}: ActionPanelCardProps) {
  const { closePanel } = usePanel();

  return (
    <div className="h-full p-4">
      <Card className={cn("h-full flex flex-col", className)}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <h3 className="font-semibold text-lg">{title}</h3>
          <div className="flex items-center gap-2">
            {headerActions}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={closePanel}
                  className="h-6 w-6"
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Close panel</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Close Panel</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </CardHeader>
        <CardContent className="flex-1 p-0 px-6 pb-6">{children}</CardContent>
      </Card>
    </div>
  );
}
