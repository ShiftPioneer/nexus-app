
import React from "react";
import Sidebar from "./Sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-background">
        <Sidebar />
        <main className={cn(
          "flex-1 ml-[80px] lg:ml-[256px] transition-all duration-300 overflow-auto"
        )}>
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
};

export default AppLayout;
