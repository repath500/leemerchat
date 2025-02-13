"use client";

import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DemoButtonProps {
  onClick: () => void;
}

export function DemoButton({ onClick }: DemoButtonProps) {
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={onClick}
      className="w-full flex items-center gap-2 justify-start px-2"
    >
      <Sparkles className="h-4 w-4" />
      <span className="hidden lg:inline-block">Home Page</span>
    </Button>
  );
}
