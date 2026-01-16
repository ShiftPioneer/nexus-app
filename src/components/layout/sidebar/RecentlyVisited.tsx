/**
 * NEXUS Recently Visited Section
 * Shows quick links to recently visited pages
 */

import React from "react";
import { Link } from "react-router-dom";
import { Clock, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRecentlyVisited } from "@/hooks/use-recently-visited";
import { motion, AnimatePresence } from "framer-motion";

interface RecentlyVisitedProps {
  isCollapsed: boolean;
}

const RecentlyVisited: React.FC<RecentlyVisitedProps> = ({ isCollapsed }) => {
  const { recentPages } = useRecentlyVisited();

  if (isCollapsed || recentPages.length === 0) {
    return null;
  }

  return (
    <div className="px-3 py-2 border-t border-slate-700/30">
      <div className="flex items-center gap-2 px-2 py-1.5 text-xs font-medium text-slate-400 uppercase tracking-wider">
        <Clock className="h-3 w-3" />
        <span>Recent</span>
      </div>
      
      <AnimatePresence mode="popLayout">
        <div className="space-y-0.5 mt-1">
          {recentPages.map((page, index) => (
            <motion.div
              key={page.path}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link
                to={page.path}
                className={cn(
                  "flex items-center justify-between px-3 py-2 rounded-md",
                  "text-sm text-slate-400 hover:text-white",
                  "hover:bg-slate-800/50 transition-all duration-200",
                  "group"
                )}
              >
                <span className="truncate">{page.name}</span>
                <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            </motion.div>
          ))}
        </div>
      </AnimatePresence>
    </div>
  );
};

export default RecentlyVisited;
