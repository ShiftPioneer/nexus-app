
import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import NavigationMenu from "./NavigationMenu";
import { useSidebar } from "@/components/ui/sidebar";

const Sidebar: React.FC = () => {
  const { expanded, setExpanded } = useSidebar();
  const isCollapsed = !expanded;

  return (
    <motion.aside
      initial={{ width: isCollapsed ? 80 : 256 }}
      animate={{ width: isCollapsed ? 80 : 256 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className={cn(
        "fixed left-0 z-20 flex h-screen flex-col border-r border-[#2A2F3C] bg-[#181A22] transition-all duration-300",
        isCollapsed ? "items-center" : "items-start"
      )}
    >
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
        className="flex w-full items-center justify-between p-4"
      >
        <div className="flex items-center gap-2">
          <img
            src="/nexus.png"
            alt="Nexus Logo"
            className={cn(
              "h-8 w-8 transition-all duration-300",
              isCollapsed ? "mr-0" : "mr-2"
            )}
          />
          {!isCollapsed && (
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="text-lg font-bold text-white"
            >
              Nexus
            </motion.span>
          )}
        </div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="rounded-full p-1 text-white hover:bg-[#2A2F3C] focus:outline-none"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={cn(
              "h-5 w-5 transition-transform duration-300",
              isCollapsed ? "rotate-180" : "rotate-0"
            )}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
      </motion.div>

      <div className="flex-1 overflow-y-auto p-3 scrollbar-none">
        <NavigationMenu isCollapsed={isCollapsed} />
      </div>
    </motion.aside>
  );
};

export default Sidebar;
