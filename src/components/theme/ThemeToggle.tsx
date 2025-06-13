
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
      variant={sidebarTheme ? "ghost" : "outline"}
      size="icon"
      onClick={toggleTheme}
      className={cn(
        "rounded-full",
        sidebarTheme && "w-full justify-start px-3 py-2"
      )}
    >
      {theme === "light" ? (
        <>
          <Sun className="h-5 w-5" />
          {sidebarTheme && <span className="ml-3">Dark Mode</span>}
        </>
      ) : (
        <>
          <Moon className="h-5 w-5" />
          {sidebarTheme && <span className="ml-3">Light Mode</span>}
        </>
      )}
    </Button>
  );
};

export default ThemeToggle;
