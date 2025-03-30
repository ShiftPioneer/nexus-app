
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Journal from "./pages/Journal";
import Tasks from "./pages/Tasks";
import TimeDesign from "./pages/TimeDesign";
import Energy from "./pages/Energy";
import Mindset from "./pages/Mindset";
import Knowledge from "./pages/Knowledge";
import Settings from "./pages/Settings";
import Planning from "./pages/Planning";
import Focus from "./pages/Focus";
import Habits from "./pages/Habits";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <SidebarProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/planning" element={<Planning />} />
              <Route path="/tasks" element={<Tasks />} />
              <Route path="/time-design" element={<TimeDesign />} />
              <Route path="/energy" element={<Energy />} />
              <Route path="/mindset" element={<Mindset />} />
              <Route path="/journal" element={<Journal />} />
              <Route path="/knowledge" element={<Knowledge />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/focus" element={<Focus />} />
              <Route path="/habits" element={<Habits />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </SidebarProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
