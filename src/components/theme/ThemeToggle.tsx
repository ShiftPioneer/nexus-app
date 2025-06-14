
import React, { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  sidebarTheme?: boolean;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ sidebarTheme = false }) => {
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
      variant={sidebarTheme ? "ghost" : "ghost"}
      size={sidebarTheme ? "default" : "icon"}
      onClick={toggleTheme}
      className={cn(
        "transition-all duration-200",
        sidebarTheme 
          ? "w-full justify-start px-3 py-2 hover:bg-background-dark-tertiary text-text-dark-secondary hover:text-text-dark-primary" 
          : "h-11 w-11 rounded-xl hover:bg-background-secondary text-text-secondary hover:text-text-primary"
      )}
    >
      {theme === "light" ? (
        <>
          <Moon className="h-5 w-5" />
          {sidebarTheme && <span className="ml-3">Dark Mode</span>}
        </>
      ) : (
        <>
          <Sun className="h-5 w-5" />
          {sidebarTheme && <span className="ml-3">Light Mode</span>}
        </>
      )}
    </Button>
  );
};

export default ThemeToggle;
