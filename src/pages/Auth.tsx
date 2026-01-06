import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { AuthError } from "@supabase/supabase-js";
import { Eye, EyeOff, Globe, AlertCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [oauthError, setOauthError] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();

  // Check for OAuth error in URL parameters (Supabase redirects with error in hash or query)
  useEffect(() => {
    const error = searchParams.get("error");
    const errorDescription = searchParams.get("error_description");
    
    // Also check hash fragment for errors
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const hashError = hashParams.get("error");
    const hashErrorDescription = hashParams.get("error_description");
    
    const finalError = error || hashError;
    const finalDescription = errorDescription || hashErrorDescription;
    
    if (finalError) {
      let userFriendlyMessage = "Google sign-in failed. ";
      
      if (finalError === "server_error" || finalDescription?.includes("Error getting user profile")) {
        userFriendlyMessage += "There's a configuration issue with Google OAuth. Please contact support or try email/password login.";
      } else if (finalError === "access_denied") {
        userFriendlyMessage += "You denied access to your Google account.";
      } else {
        userFriendlyMessage += finalDescription || "Please try again or use email/password.";
      }
      
      setOauthError(userFriendlyMessage);
      
      // Clear the error from URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [searchParams]);

  // If user is already authenticated, redirect to dashboard
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);
  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();

    // Input validation
    if (!email || !password) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }
    if (isSignUp && password !== confirmPassword) {
      toast({
        title: "Passwords Don't Match",
        description: "The passwords you entered don't match. Please try again.",
        variant: "destructive"
      });
      return;
    }
    setLoading(true);
    try {
      if (isSignUp) {
        // Sign up flow
        const {
          error
        } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/`
          }
        });
        if (error) throw error;
        toast({
          title: "Account Created",
          description: "You have successfully created an account. Please check your email for verification."
        });
      } else {
        // Sign in flow
        const {
          error
        } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        if (error) throw error;
        toast({
          title: "Welcome Back!",
          description: "You have successfully logged in."
        });
        navigate("/");
      }
    } catch (error: unknown) {
      const authError = error as AuthError;
      toast({
        title: "Authentication Error",
        description: authError.message || "An error occurred during authentication.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  const handleGoogleAuth = async () => {
    setOauthError(null); // Clear previous errors
    setLoading(true);
    
    try {
      // IMPORTANT: For Google OAuth to work properly, we need:
      // 1. openid, email, profile - for user authentication (required by Supabase)
      // 2. calendar scopes - for Google Calendar integration (optional but useful)
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          scopes: 'openid email profile https://www.googleapis.com/auth/calendar.readonly https://www.googleapis.com/auth/calendar.events',
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
          redirectTo: `${window.location.origin}/auth`,
        }
      });
      
      if (error) throw error;
      
      // If we get here without redirect, something went wrong
      if (!data?.url) {
        throw new Error("Failed to initiate Google sign-in. Please try again.");
      }
    } catch (error: unknown) {
      const authError = error as AuthError;
      setOauthError(authError.message || "An error occurred during Google authentication.");
      toast({
        title: "Google Authentication Error",
        description: authError.message || "An error occurred during Google authentication.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  return <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="w-full max-w-lg px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">
            <span className="text-white">NEXUS</span>
            <span className="text-[#FF6500] mx-[10px]">PLATFORM</span>
          </h1>
          <p className="text-gray-400">Your all-in-one productivity solution</p>
        </div>
        
        <Card className="border-slate-700 bg-slate-800/80 backdrop-blur-sm text-white shadow-xl">
          <CardHeader className="space-y-2">
            <CardTitle className="text-2xl text-center text-accent-dark">
              {isSignUp ? "Create an Account" : "Welcome Back"}
            </CardTitle>
            <CardDescription className="text-center text-slate-400">
              {isSignUp ? "Sign up to start managing your productivity" : "Sign in to your account to continue"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {oauthError && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Authentication Error</AlertTitle>
                <AlertDescription>{oauthError}</AlertDescription>
              </Alert>
            )}
            <form onSubmit={handleAuth} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email address</Label>
                  <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="name@example.com" required className="bg-slate-900 border-slate-700 text-white" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input id="password" type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required className="bg-slate-900 border-slate-700 text-white pr-10" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white">
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {isSignUp && <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input id="confirmPassword" type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="••••••••" required className="bg-slate-900 border-slate-700 text-white" />
                  </div>}
              </div>

              <div className="flex flex-col space-y-4">
                <Button type="submit" disabled={loading} className="w-full text-white bg-accent-dark">
                  {loading ? "Loading..." : isSignUp ? "Sign Up" : "Sign In"}
                </Button>
                
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-slate-700"></span>
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="px-2 bg-slate-800 text-slate-400">or continue with</span>
                  </div>
                </div>

                <Button type="button" variant="outline" onClick={handleGoogleAuth} className="w-full border-slate-700 hover:bg-slate-700 hover:text-white">
                  <Globe className="h-5 w-5 mr-2" />
                  Google
                </Button>
              </div>
            </form>
          </CardContent>
          <CardFooter>
            <div className="text-center w-full text-sm text-slate-400">
              {isSignUp ? <>
                  Already have an account?{" "}
                  <a href="#" onClick={e => {
                e.preventDefault();
                setIsSignUp(false);
              }} className="text-cyan-500 hover:underline">
                    Sign in
                  </a>
                </> : <>
                  Don't have an account?{" "}
                  <a href="#" onClick={e => {
                e.preventDefault();
                setIsSignUp(true);
              }} className="text-orange-600 hover:underline">
                    Sign up
                  </a>
                </>}
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>;
};
export default Auth;