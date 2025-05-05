
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import TopBar from './TopBar';
import NavigationMenu from './NavigationMenu';
import { 
  Sidebar, 
  SidebarContent, 
  SidebarHeader, 
  SidebarProvider,
  SidebarTrigger,
  SidebarFooter
} from '@/components/ui/sidebar';
import SidebarWrapper from './SidebarWrapper';
import { Button } from '../ui/button';
import { Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  
  return (
    <SidebarProvider defaultOpen={!isMobile}>
      <div className="flex h-screen overflow-hidden bg-background">
        <SidebarWrapper>
          <Sidebar variant="sidebar" collapsible="icon">
            <SidebarHeader className="py-4 flex justify-center">
              <h1 className="text-xl font-bold text-primary">Nexus</h1>
            </SidebarHeader>
            <SidebarContent>
              <NavigationMenu />
            </SidebarContent>
            <SidebarFooter>
              <div className="p-2">
                <Button 
                  variant="ghost" 
                  className="w-full flex items-center gap-2 p-2" 
                  onClick={() => navigate('/settings')}
                >
                  <Settings className="h-5 w-5" />
                  <span>Settings</span>
                </Button>
              </div>
            </SidebarFooter>
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
        
        {!isMobile && (
          <div className="fixed left-4 bottom-4 z-50">
            <SidebarTrigger />
          </div>
        )}
      </div>
    </SidebarProvider>
  );
};

export default AppLayout;
