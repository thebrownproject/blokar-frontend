"use client";

import { MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePanel } from "@/hooks/use-panel";

export function FloatingAIButton() {
  const { isOpen, openAIAssistant } = usePanel();

  // Only show when panel is closed
  if (isOpen) return null;

  return (
    <Button
      onClick={openAIAssistant}
      size="lg"
      className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
    >
      <MessageSquare className="h-6 w-6" />
      <span className="sr-only">Open Blokar Copilot</span>
    </Button>
  );
}
