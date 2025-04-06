
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
      <div className="flex min-h-screen bg-[#101114]">
        <Sidebar />
        <main className={cn(
          "flex-1 ml-[64px] lg:ml-[205px] transition-all duration-300 overflow-auto p-6"
        )}>
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
};

export default AppLayout;
