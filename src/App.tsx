import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { UserProvider } from "@/contexts/UserContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { CanonicalHostRedirect } from "@/components/routing/CanonicalHostRedirect";

// Lazy load all pages for code splitting - no loader shown (instant feel)
const Index = lazy(() => import("./pages/Index"));
const Auth = lazy(() => import("./pages/Auth"));
const Actions = lazy(() => import("./pages/Actions"));
const Habits = lazy(() => import("./pages/Habits"));
const Journal = lazy(() => import("./pages/Journal"));
const Planning = lazy(() => import("./pages/Planning"));
const TimeDesign = lazy(() => import("./pages/TimeDesign"));
const Knowledge = lazy(() => import("./pages/Knowledge"));
const Energy = lazy(() => import("./pages/Energy"));
const Mindset = lazy(() => import("./pages/Mindset"));
const Settings = lazy(() => import("./pages/Settings"));
const Focus = lazy(() => import("./pages/Focus"));
const Install = lazy(() => import("./pages/Install"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const TermsOfService = lazy(() => import("./pages/TermsOfService"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Configure React Query with optimized defaults
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes (formerly cacheTime)
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// Minimal fallback - just maintains background color, no intrusive loader
const MinimalFallback = () => (
  <div className="min-h-screen bg-background" />
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <AuthProvider>
        <UserProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <CanonicalHostRedirect />
              <Suspense fallback={<MinimalFallback />}>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/actions" element={<Actions />} />
                  <Route path="/habits" element={<Habits />} />
                  <Route path="/journal" element={<Journal />} />
                  <Route path="/planning" element={<Planning />} />
                  <Route path="/time-design" element={<TimeDesign />} />
                  <Route path="/knowledge" element={<Knowledge />} />
                  <Route path="/energy" element={<Energy />} />
                  <Route path="/mindset" element={<Mindset />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/focus" element={<Focus />} />
                  <Route path="/install" element={<Install />} />
                  <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                  <Route path="/terms-of-service" element={<TermsOfService />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </BrowserRouter>
          </TooltipProvider>
        </UserProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
