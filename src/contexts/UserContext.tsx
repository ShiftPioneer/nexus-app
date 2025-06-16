
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  displayName: string;
  avatar?: string;
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  updateDisplayName: (displayName: string) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Load user data from localStorage
    const savedUser = localStorage.getItem('nexusUser');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error('Failed to parse saved user data:', error);
        // Set default user if no saved data
        const defaultUser = {
          id: '1',
          email: 'user@example.com',
          displayName: 'Ayoub',
          avatar: ''
        };
        setUser(defaultUser);
        localStorage.setItem('nexusUser', JSON.stringify(defaultUser));
      }
    } else {
      // Set default user if no saved data
      const defaultUser = {
        id: '1',
        email: 'user@example.com',
        displayName: 'Ayoub',
        avatar: ''
      };
      setUser(defaultUser);
      localStorage.setItem('nexusUser', JSON.stringify(defaultUser));
    }
  }, []);

  const updateDisplayName = (displayName: string) => {
    if (user) {
      const updatedUser = { ...user, displayName };
      setUser(updatedUser);
      localStorage.setItem('nexusUser', JSON.stringify(updatedUser));
    }
  };

  const value = {
    user,
    setUser,
    updateDisplayName,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
