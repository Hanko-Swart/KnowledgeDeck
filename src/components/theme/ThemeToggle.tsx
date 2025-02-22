import React from "react";
import { Moon, Sun } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "./ThemeProvider";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center space-x-2">
      <Sun className="h-5 w-5 text-foreground" />
      <Switch
        id="theme-toggle"
        checked={theme === "dark"}
        onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
      />
      <Moon className="h-5 w-5 text-foreground" />
      <span className="sr-only">Toggle theme</span>
    </div>
  );
} 