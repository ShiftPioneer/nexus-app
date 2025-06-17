
import React, { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  sidebarTheme?: boolean;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({
  sidebarTheme = false
}) => {
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  useEffect(() => {
    // Check for stored preference, default to dark
    const storedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    
    if (storedTheme === "light") {
      setTheme("light");
      document.documentElement.classList.remove("dark");
    } else {
      // Default to dark mode
      setTheme("dark");
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
  }, []);

  const toggleTheme = () => {
    if (theme === "light") {
      setTheme("dark");
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      setTheme("light");
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  return (
    <Button
      variant="ghost"
      size={sidebarTheme ? "sm" : "icon"}
      onClick={toggleTheme}
      className={cn(
        "transition-all duration-200 border border-slate-300",
        sidebarTheme 
          ? "flex-1 justify-start gap-2 text-slate-300 hover:text-white hover:bg-slate-800" 
          : "h-9 w-9 sm:h-10 sm:w-10 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-slate-200"
      )}
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
    >
      {theme === "light" ? (
        <Moon className="h-4 w-4 sm:h-5 sm:w-5" />
      ) : (
        <Sun className="h-4 w-4 sm:h-5 sm:w-5" />
      )}
      {sidebarTheme && (
        <span className="text-sm">
          {theme === "light" ? "Dark" : "Light"} Mode
        </span>
      )}
    </Button>
  );
};

export default ThemeToggle;
