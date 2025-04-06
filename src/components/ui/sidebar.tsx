
import React, { createContext, useContext, useState } from "react";

interface SidebarContextValue {
  expanded: boolean;
  setExpanded: (expanded: boolean) => void;
}

const SidebarContext = createContext<SidebarContextValue | undefined>(undefined);

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [expanded, setExpanded] = useState(true);

  return (
    <SidebarContext.Provider value={{ expanded, setExpanded }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = useContext(SidebarContext);
  
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  
  return context;
}
