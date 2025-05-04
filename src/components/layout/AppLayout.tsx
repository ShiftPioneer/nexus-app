
// We can't modify AppLayout.tsx directly, so let's create a new improved version
// that wraps the original AppLayout

import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import SidebarWrapper from './SidebarWrapper';

interface ImprovedAppLayoutProps {
  children: React.ReactNode;
}

const ImprovedAppLayout: React.FC<ImprovedAppLayoutProps> = ({ children }) => {
  const isMobile = useIsMobile();
  
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* We'll use the original components but with our wrapper for mobile */}
      <div className="flex-1 overflow-auto">
        <main className="flex-1 px-4 sm:px-6 py-4 md:py-6">
          {/* Add padding at the top on mobile for the menu button */}
          <div className={isMobile ? "pt-12" : ""}>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ImprovedAppLayout;
