
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
    const handleRouteChange = () => setOpen(false);
    window.addEventListener('popstate', handleRouteChange);
    return () => window.removeEventListener('popstate', handleRouteChange);
  }, []);

  if (isMobile) {
    return (
      <>
        <Button 
          variant="ghost" 
          size="sm" 
          className="fixed top-4 left-4 z-30 md:hidden"
          onClick={() => setOpen(true)}
        >
          <Menu size={20} />
        </Button>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetContent side="left" className="w-[250px] sm:w-[300px] p-0">
            {children}
          </SheetContent>
        </Sheet>
      </>
    );
  }

  return <>{children}</>;
};

export default SidebarWrapper;
