"use client";

import { Moon, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useThemeStore } from "@/stores/use-theme-store";

export function ThemeToggle() {
  const { theme, toggle } = useThemeStore();

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className="size-11"
      onClick={() => toggle()}
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
    >
      {theme === "dark" ? <Sun className="size-5" /> : <Moon className="size-5" />}
    </Button>
  );
}
