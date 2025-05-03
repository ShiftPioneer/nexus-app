
import { useState } from 'react';
import { GTDView } from '@/types/gtd';

export const useGTDView = () => {
  const [activeView, setActiveView] = useState<GTDView>("capture");
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState<boolean>(true);
  
  const markNotificationsAsRead = () => {
    setHasUnreadNotifications(false);
  };

  return {
    activeView,
    setActiveView,
    hasUnreadNotifications,
    setHasUnreadNotifications,
    markNotificationsAsRead
  };
};
