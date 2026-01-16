/**
 * NEXUS Recently Visited Hook
 * Tracks the user's navigation history for quick access
 */

import { useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { useLocalStorage } from "./use-local-storage";

interface RecentPage {
  path: string;
  name: string;
  timestamp: number;
}

const MAX_RECENT_PAGES = 5;

// Map paths to display names
const pathNames: Record<string, string> = {
  "/": "Dashboard",
  "/actions": "Actions",
  "/time-design": "Time Design",
  "/planning": "Planning",
  "/habits": "Habits",
  "/focus": "Focus",
  "/mindset": "Mindset",
  "/knowledge": "Knowledge",
  "/journal": "Journal",
  "/energy": "Energy",
  "/settings": "Settings",
};

export const useRecentlyVisited = () => {
  const location = useLocation();
  const [recentPages, setRecentPages] = useLocalStorage<RecentPage[]>("nexus-recent-pages", []);

  // Track page visits
  useEffect(() => {
    const currentPath = location.pathname;
    const pageName = pathNames[currentPath];
    
    // Only track known pages
    if (!pageName) return;

    setRecentPages((prev) => {
      // Remove existing entry for this path
      const filtered = prev.filter((p) => p.path !== currentPath);
      
      // Add new entry at the beginning
      const newEntry: RecentPage = {
        path: currentPath,
        name: pageName,
        timestamp: Date.now(),
      };
      
      // Keep only the most recent pages
      return [newEntry, ...filtered].slice(0, MAX_RECENT_PAGES);
    });
  }, [location.pathname, setRecentPages]);

  // Get recent pages excluding current
  const getRecentPages = useCallback((excludeCurrent = true) => {
    if (excludeCurrent) {
      return recentPages.filter((p) => p.path !== location.pathname).slice(0, 3);
    }
    return recentPages.slice(0, 3);
  }, [recentPages, location.pathname]);

  return {
    recentPages: getRecentPages(),
    allRecentPages: recentPages,
  };
};
