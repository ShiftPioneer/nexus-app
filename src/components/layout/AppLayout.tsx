
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import TopBar from './TopBar';
import NavigationMenu from './NavigationMenu';
import { 
  Sidebar, 
  SidebarContent, 
  SidebarHeader, 
  SidebarProvider 
} from '@/components/ui/sidebar';
import SidebarWrapper from './SidebarWrapper';

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const isMobile = useIsMobile();
  
  return (
    <SidebarProvider defaultOpen={!isMobile}>
      <div className="flex h-screen overflow-hidden bg-background">
        <SidebarWrapper>
          <Sidebar>
            <SidebarHeader className="py-4 flex justify-center">
              <h1 className="text-xl font-bold text-primary">Nexus</h1>
            </SidebarHeader>
            <SidebarContent>
              <NavigationMenu />
            </SidebarContent>
          </Sidebar>
        </SidebarWrapper>
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <TopBar showMobileMenu={isMobile} />
          <div className="flex-1 overflow-auto">
            <main className="flex-1 p-4 md:p-6">
              {children}
            </main>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AppLayout;
