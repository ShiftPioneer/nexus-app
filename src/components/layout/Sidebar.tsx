
// Since we can't directly modify AppLayout.tsx or Sidebar.tsx which are read-only,
// Let's create a mobile-friendly navigation wrapper component

import React, { useState, useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

interface SidebarWrapperProps {
  children: React.ReactNode;
}

const SidebarWrapper: React.FC<SidebarWrapperProps> = ({ children }) => {
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);

  // Close menu when route changes
  useEffect(() => {
    setOpen(false);
  }, [window.location.pathname]);

  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button 
            variant="ghost" 
            size="sm" 
            className="fixed top-4 left-4 z-30 md:hidden"
          >
            <Menu size={20} />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[250px] sm:w-[300px] p-0">
          {children}
        </SheetContent>
      </Sheet>
    );
  }

  return <>{children}</>;
};

export default SidebarWrapper;
