import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<any>;
  signUp: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<any>;
  updateUser: (userData: any) => Promise<any>; // Add this method
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error && process.env.NODE_ENV === 'development') {
          console.error('Error getting session:', error);
        }
        setSession(data?.session || null);
        setUser(data?.session?.user || null);
      } catch (err) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Unexpected error getting session:', err);
        }
      } finally {
        setLoading(false);
      }
    };

    // Call the async function
    getSession();

    // Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        setSession(newSession);
        setUser(newSession?.user || null);
        setLoading(false);
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const signIn = (email: string, password: string) => {
    return supabase.auth.signInWithPassword({ email, password });
  };

  const signUp = (email: string, password: string) => {
    return supabase.auth.signUp({ email, password });
  };

  const signOut = () => {
    // Clear all sensitive user data from localStorage on logout
    const clearUserData = () => {
      try {
        // Clear all app-specific data
        localStorage.removeItem('gtdTasks');
        localStorage.removeItem('planningGoals');
        localStorage.removeItem('planningProjects');
        localStorage.removeItem('userHabits');
        localStorage.removeItem('focusSessions');
        localStorage.removeItem('userProfile');
        localStorage.removeItem('mindset-core-values');
        localStorage.removeItem('mindset-missions');
        localStorage.removeItem('mindset-key-beliefs');
        localStorage.removeItem('mindset-affirmations');
        localStorage.removeItem('mindset-vision-items');
        localStorage.removeItem('timedesign-activities');
        localStorage.removeItem('tasks');
        
        if (process.env.NODE_ENV === 'development') {
          console.log("User data cleared from localStorage");
        }
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error("Failed to clear user data:", error);
        }
      }
    };

    // Clear user data before signing out
    clearUserData();

    return supabase.auth.signOut();
  };

  // Add the updateUser method
  const updateUser = (userData: any) => {
    return supabase.auth.updateUser(userData);
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signIn, signUp, signOut, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
