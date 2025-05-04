
import { useEffect } from 'react';

// This hook will handle the daily reset of habits accountability score
export const useHabitsReset = () => {
  useEffect(() => {
    // Function to check and reset habits daily
    const checkAndResetHabits = () => {
      try {
        // Get last reset date
        const lastResetDate = localStorage.getItem('habitsLastReset');
        
        // Get current date formatted as YYYY-MM-DD
        const today = new Date().toISOString().split('T')[0];
        
        // If no last reset or if it's a new day
        if (!lastResetDate || lastResetDate !== today) {
          console.log('Resetting habits for a new day');
          
          // Reset habits accountability score
          const habits = JSON.parse(localStorage.getItem('habits') || '[]');
          
          const resetHabits = habits.map((habit: any) => ({
            ...habit,
            completedToday: false,
            accountabilityScore: 0
          }));
          
          // Save updated habits
          localStorage.setItem('habits', JSON.stringify(resetHabits));
          
          // Update last reset date to today
          localStorage.setItem('habitsLastReset', today);
          
          console.log('Habits reset successful');
        }
      } catch (error) {
        console.error('Error resetting habits:', error);
      }
    };

    // Check at load time
    checkAndResetHabits();
    
    // Set up a timer to check periodically (each hour)
    const intervalId = setInterval(checkAndResetHabits, 60 * 60 * 1000);
    
    // If user's device date changes while app is running (e.g. midnight)
    // we'll check and reset when they interact with the page
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        checkAndResetHabits();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      clearInterval(intervalId);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);
};
