
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { Mail, Lock, User, Loader2, AlertCircle } from "lucide-react";

const Auth = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check if user is already logged in
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate("/");
      }
    };
    checkSession();
  }, [navigate]);

  // Set up auth state change listener
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        navigate("/");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      // First create the user
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          }
        }
      });

      if (error) throw error;

      if (data) {
        toast({
          title: "Account created!",
          description: "Please check your email to verify your account.",
        });
      }
    } catch (error: any) {
      setErrorMsg(error.message || "Error creating account");
      toast({
        title: "Error",
        description: error.message || "Error creating account",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.session) {
        toast({
          title: "Signed in!",
          description: "Welcome back!",
        });
        navigate("/");
      }
    } catch (error: any) {
      setErrorMsg(error.message || "Error signing in");
      toast({
        title: "Error",
        description: error.message || "Error signing in",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: window.location.origin,
        },
      });

      if (error) throw error;
    } catch (error: any) {
      setErrorMsg(error.message || "Error signing in with Google");
      toast({
        title: "Error",
        description: error.message || "Error signing in with Google",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-950 flex items-center justify-center p-4">
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white mb-2">NEXUS</h1>
          <p className="text-slate-300">Your personal productivity system</p>
        </div>

        <Card className="border-slate-700 bg-slate-800/50 backdrop-blur-lg">
          <CardHeader>
            <CardTitle className="text-white text-xl">Welcome</CardTitle>
            <CardDescription className="text-slate-300">
              Sign in or create an account to continue
            </CardDescription>
          </CardHeader>

          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-slate-900">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="signin">
              <form onSubmit={handleSignIn}>
                <CardContent className="space-y-4 pt-5">
                  <div className="space-y-2">
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                      <Input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10 bg-slate-900 border-slate-700 text-white"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                      <Input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 bg-slate-900 border-slate-700 text-white"
                        required
                      />
                    </div>
                  </div>

                  {errorMsg && (
                    <div className="flex items-center gap-2 p-3 bg-red-500/20 text-red-300 rounded-md">
                      <AlertCircle className="h-4 w-4" />
                      <span className="text-sm">{errorMsg}</span>
                    </div>
                  )}
                </CardContent>

                <CardFooter className="flex flex-col space-y-4">
                  <Button 
                    type="submit" 
                    className="w-full bg-[#FF6500] hover:bg-[#FF7F38]"
                    disabled={loading}
                  >
                    {loading ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : null}
                    Sign In
                  </Button>

                  <div className="relative w-full">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-slate-700" />
                    </div>
                    <div className="relative flex justify-center text-xs">
                      <span className="bg-slate-800 px-2 text-slate-400">
                        Or continue with
                      </span>
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    className="w-full border-slate-700 text-white hover:bg-slate-700"
                    onClick={handleGoogleSignIn}
                  >
                    <svg
                      className="mr-2 h-4 w-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M22.5 12.0002C22.5 10.8702 22.41 9.9202 22.23 8.9702H12V12.9602H18.04C17.91 14.0702 17.23 15.6502 15.82 16.7302L15.8 16.8702L19.05 19.3402L19.25 19.3502C21.2 17.5502 22.5 15.0302 22.5 12.0002Z"
                        fill="#4285F4"
                      />
                      <path
                        d="M12.0001 22.5C14.7001 22.5 16.9601 21.54 18.2501 19.35L15.8201 16.73C14.9401 17.32 13.6701 17.74 12.0001 17.74C9.24005 17.74 6.92005 15.92 6.07005 13.46L5.94005 13.47L2.57005 16.04L2.52005 16.17C3.78005 19.86 7.60005 22.5 12.0001 22.5Z"
                        fill="#34A853"
                      />
                      <path
                        d="M6.06995 13.46C5.85995 12.86 5.74995 12.21 5.74995 11.55C5.74995 10.89 5.85995 10.24 6.06995 9.64L6.06995 9.49L2.65995 6.87L2.51995 6.93C1.85995 8.29 1.49995 9.8 1.49995 11.55C1.49995 13.3 1.85995 14.81 2.51995 16.17L6.06995 13.46Z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M12.0001 5.36C13.6801 5.36 14.8301 6.11 15.4901 6.72L17.6401 4.6C16.0001 3.09 14.0101 2.15 12.0001 2.15C7.60005 2.15 3.78005 4.79 2.52005 8.48L6.07005 11.19C6.92005 8.73 9.24005 6.91 12.0001 6.91V5.36Z"
                        fill="#EB4335"
                      />
                    </svg>
                    Google
                  </Button>
                </CardFooter>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSignUp}>
                <CardContent className="space-y-4 pt-5">
                  <div className="space-y-2">
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                      <Input
                        type="text"
                        placeholder="Full Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="pl-10 bg-slate-900 border-slate-700 text-white"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                      <Input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10 bg-slate-900 border-slate-700 text-white"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                      <Input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 bg-slate-900 border-slate-700 text-white"
                        required
                      />
                    </div>
                  </div>

                  {errorMsg && (
                    <div className="flex items-center gap-2 p-3 bg-red-500/20 text-red-300 rounded-md">
                      <AlertCircle className="h-4 w-4" />
                      <span className="text-sm">{errorMsg}</span>
                    </div>
                  )}
                </CardContent>

                <CardFooter className="flex flex-col space-y-4">
                  <Button 
                    type="submit" 
                    className="w-full bg-[#FF6500] hover:bg-[#FF7F38]"
                    disabled={loading}
                  >
                    {loading ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : null}
                    Create Account
                  </Button>

                  <div className="relative w-full">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-slate-700" />
                    </div>
                    <div className="relative flex justify-center text-xs">
                      <span className="bg-slate-800 px-2 text-slate-400">
                        Or continue with
                      </span>
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    className="w-full border-slate-700 text-white hover:bg-slate-700"
                    onClick={handleGoogleSignIn}
                  >
                    <svg
                      className="mr-2 h-4 w-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M22.5 12.0002C22.5 10.8702 22.41 9.9202 22.23 8.9702H12V12.9602H18.04C17.91 14.0702 17.23 15.6502 15.82 16.7302L15.8 16.8702L19.05 19.3402L19.25 19.3502C21.2 17.5502 22.5 15.0302 22.5 12.0002Z"
                        fill="#4285F4"
                      />
                      <path
                        d="M12.0001 22.5C14.7001 22.5 16.9601 21.54 18.2501 19.35L15.8201 16.73C14.9401 17.32 13.6701 17.74 12.0001 17.74C9.24005 17.74 6.92005 15.92 6.07005 13.46L5.94005 13.47L2.57005 16.04L2.52005 16.17C3.78005 19.86 7.60005 22.5 12.0001 22.5Z"
                        fill="#34A853"
                      />
                      <path
                        d="M6.06995 13.46C5.85995 12.86 5.74995 12.21 5.74995 11.55C5.74995 10.89 5.85995 10.24 6.06995 9.64L6.06995 9.49L2.65995 6.87L2.51995 6.93C1.85995 8.29 1.49995 9.8 1.49995 11.55C1.49995 13.3 1.85995 14.81 2.51995 16.17L6.06995 13.46Z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M12.0001 5.36C13.6801 5.36 14.8301 6.11 15.4901 6.72L17.6401 4.6C16.0001 3.09 14.0101 2.15 12.0001 2.15C7.60005 2.15 3.78005 4.79 2.52005 8.48L6.07005 11.19C6.92005 8.73 9.24005 6.91 12.0001 6.91V5.36Z"
                        fill="#EB4335"
                      />
                    </svg>
                    Google
                  </Button>
                </CardFooter>
              </form>
            </TabsContent>
          </Tabs>
        </Card>

        <div className="mt-6 text-center text-sm text-slate-400">
          <p>
            By signing up, you agree to our{" "}
            <a href="#" className="text-blue-400 hover:underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-blue-400 hover:underline">
              Privacy Policy
            </a>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;
