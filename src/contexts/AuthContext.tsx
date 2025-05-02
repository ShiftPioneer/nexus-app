
import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Session, User } from "@supabase/supabase-js";
import { useToast } from "@/hooks/use-toast";

interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
  updateUserProfile: (data: any) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { toast } = useToast();

  // Function to update profile data
  const updateUserProfile = async (data: any) => {
    try {
      // Store profile data in localStorage
      const currentProfile = localStorage.getItem('userProfile');
      const profile = currentProfile ? { ...JSON.parse(currentProfile), ...data } : data;
      
      localStorage.setItem('userProfile', JSON.stringify(profile));
      
      // Dispatch a custom event to notify other components
      window.dispatchEvent(new CustomEvent('profileUpdated', { detail: profile }));
      
      // Optional: Update user metadata in Supabase if user is logged in
      if (user) {
        await supabase.auth.updateUser({
          data: { ...user.user_metadata, ...data }
        });
      }
      
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully",
      });
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast({
        title: "Update Failed",
        description: "Failed to update your profile",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);

      // Handle auth events
      switch (event) {
        case "SIGNED_IN":
          toast({
            title: "Signed in",
            description: `Welcome${session?.user?.email ? ` ${session.user.email}` : ""}!`,
          });
          
          // If user has name in metadata, store it in profile
          if (session?.user?.user_metadata?.name || session?.user?.user_metadata?.full_name) {
            const name = session.user.user_metadata.name || session.user.user_metadata.full_name;
            const avatar = session.user.user_metadata.avatar_url || "";
            updateUserProfile({ name, avatar });
          }
          break;
        case "SIGNED_OUT":
          toast({
            title: "Signed out",
            description: "You have been signed out",
          });
          break;
      }
    });

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      
      // If user has name in metadata, store it in profile
      if (session?.user?.user_metadata?.name || session?.user?.user_metadata?.full_name) {
        const name = session.user.user_metadata.name || session.user.user_metadata.full_name;
        const avatar = session.user.user_metadata.avatar_url || "";
        updateUserProfile({ name, avatar });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ 
      session, 
      user, 
      loading, 
      signOut,
      updateUserProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
};
