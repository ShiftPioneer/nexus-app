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
        if (error) {
          console.error('Error getting session:', error);
        }
        setSession(data?.session || null);
        setUser(data?.session?.user || null);
      } catch (err) {
        console.error('Unexpected error getting session:', err);
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
    // Before signing out, save all user data to localStorage
    const saveUserData = () => {
      try {
        // Save tasks
        const tasks = localStorage.getItem('gtdTasks');
        
        // Save goals
        const goals = localStorage.getItem('planningGoals');
        
        // Save projects
        const projects = localStorage.getItem('planningProjects');
        
        // Save other important data as needed
        
        // Save all to a user-specific key if needed
        if (user?.id) {
          localStorage.setItem(`userData-${user.id}`, JSON.stringify({
            tasks,
            goals,
            projects,
            // Add other data as needed
          }));
        }
        
        console.log("All user data saved before signing out");
      } catch (error) {
        console.error("Failed to save user data before signing out:", error);
      }
    };

    // Call saveUserData before actually signing out
    saveUserData();

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
