
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Bell, Search, Sun, Moon, User, X, 
  Menu as MenuIcon, Check, ArrowLeft
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import ThemeToggle from '@/components/theme/ThemeToggle';

interface TopBarProps {
  toggleSidebar?: () => void;
}

const TopBar: React.FC<TopBarProps> = ({ toggleSidebar }) => {
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useAuth();

  const handleSearchClick = () => {
    setShowSearch(true);
  };

  const handleCloseSearch = () => {
    setShowSearch(false);
    setSearchQuery('');
  };

  const handleBack = () => {
    window.history.back();
  };

  return (
    <header className="h-14 border-b px-4 flex items-center justify-between bg-background/95 backdrop-blur supports-backdrop-blur:bg-background/60">
      <div className="flex items-center">
        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden mr-2" 
          onClick={toggleSidebar}
        >
          <MenuIcon className="h-5 w-5" />
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          className="mr-2"
          onClick={handleBack}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        
        <AnimatePresence mode="wait">
          {showSearch ? (
            <motion.div 
              className="relative w-full md:w-[300px]"
              initial={{ width: 40, opacity: 0 }}
              animate={{ width: "100%", opacity: 1 }}
              exit={{ width: 40, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Input
                type="text"
                placeholder="Search..."
                className="w-full pr-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
              <Button 
                variant="ghost" 
                size="icon" 
                className="absolute right-0 top-0 hover:bg-transparent"
                onClick={handleCloseSearch}
              >
                <X className="h-4 w-4" />
              </Button>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleSearchClick}
              >
                <Search className="h-5 w-5" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      <div className="flex items-center space-x-2">
        <ThemeToggle />
        
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 bg-[#FF6500] text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">3</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-80 p-0">
            <div className="p-4 border-b">
              <h3 className="font-medium">Notifications</h3>
            </div>
            <div className="max-h-[300px] overflow-y-auto py-2">
              {[1, 2, 3].map((_, i) => (
                <div key={i} className="px-4 py-2 hover:bg-muted/50 transition-colors cursor-pointer">
                  <div className="flex items-start gap-3">
                    <div className="rounded-full bg-[#FF6500]/10 text-[#FF6500] p-2">
                      <Check className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">Task Completed</h4>
                      <p className="text-xs text-muted-foreground">You completed the task "Finish project proposal"</p>
                      <p className="text-xs text-muted-foreground mt-1">2 hours ago</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-2 border-t">
              <Button variant="ghost" size="sm" className="w-full text-xs">
                View all notifications
              </Button>
            </div>
          </PopoverContent>
        </Popover>
        
        <Avatar className="h-8 w-8 ring-2 ring-primary/20">
          <AvatarImage src={user?.photoURL || ""} />
          <AvatarFallback className="bg-primary-600/10 text-primary">
            {user?.displayName?.charAt(0) || "U"}
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
};

export default TopBar;
