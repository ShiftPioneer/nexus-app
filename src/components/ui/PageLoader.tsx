/**
 * NEXUS Page Loader
 * Loading fallback for lazy-loaded routes
 */

import React from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

const PageLoader: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <motion.div
        className="flex flex-col items-center gap-4"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Logo pulse */}
        <motion.div
          className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-orange-500/20 flex items-center justify-center border border-primary/30"
          animate={{ 
            boxShadow: [
              "0 0 0 0 rgba(255, 101, 0, 0)",
              "0 0 20px 10px rgba(255, 101, 0, 0.15)",
              "0 0 0 0 rgba(255, 101, 0, 0)"
            ]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <img 
            src="/lovable-uploads/06a28437-426a-41c4-ad18-3c92853de084.png" 
            alt="NEXUS" 
            className="w-10 h-10 object-contain"
          />
        </motion.div>
        
        {/* Loading spinner */}
        <div className="flex items-center gap-2 text-slate-400">
          <Loader2 className="h-4 w-4 animate-spin text-primary" />
          <span className="text-sm font-medium">Loading...</span>
        </div>
        
        {/* Loading bar */}
        <div className="w-48 h-1 bg-slate-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-primary to-orange-400 rounded-full"
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{ 
              duration: 1, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
          />
        </div>
      </motion.div>
    </div>
  );
};

export default PageLoader;
