
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { UserProvider } from "@/contexts/UserContext";
import Index from "./pages/Index";
import Actions from "./pages/Actions";
import Habits from "./pages/Habits";
import Journal from "./pages/Journal";
import Planning from "./pages/Planning";
import TimeDesign from "./pages/TimeDesign";
import Knowledge from "./pages/Knowledge";
import Energy from "./pages/Energy";
import Mindset from "./pages/Mindset";
import Settings from "./pages/Settings";
import Focus from "./pages/Focus";
import GTD from "./pages/GTD";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <UserProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
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
              <Route path="/gtd" element={<GTD />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </UserProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
