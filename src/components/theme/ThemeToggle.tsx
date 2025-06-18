
import React from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  sidebarTheme?: boolean;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({
  sidebarTheme = false
}) => {
  const [theme, setTheme] = React.useState<"light" | "dark">("dark");
  
  React.useEffect(() => {
    // Check for stored preference, default to dark
    const storedTheme = localStorage.getItem("theme");
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
  
  if (sidebarTheme) {
    return (
      <Button
        variant="ghost" 
        size="icon"
        onClick={toggleTheme}
        className="h-8 w-8 rounded-lg hover:bg-slate-800 transition-colors border border-slate-300"
      >
        {theme === "light" ? (
          <Moon className="h-4 w-4 text-slate-300" />
        ) : (
          <Sun className="h-4 w-4 text-slate-300" />
        )}
      </Button>
    );
  }
  
  return (
    <Button
      variant="ghost" 
      size="icon"
      onClick={toggleTheme}
      className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl hover:bg-slate-800 transition-all duration-200 border border-slate-300 text-slate-400 hover:text-slate-200"
    >
      {theme === "light" ? (
        <Moon className="h-4 w-4 sm:h-5 sm:w-5" />
      ) : (
        <Sun className="h-4 w-4 sm:h-5 sm:w-5" />
      )}
    </Button>
  );
};

export default ThemeToggle;
