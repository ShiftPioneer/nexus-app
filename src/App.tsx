
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import NotFound from './pages/NotFound';
import Tasks from './pages/Tasks';
import TimeDesign from './pages/TimeDesign';
import Habits from './pages/Habits';
import Journal from './pages/Journal';
import Planning from './pages/Planning';
import Knowledge from './pages/Knowledge';
import Energy from './pages/Energy';
import Settings from './pages/Settings';
import Mindset from './pages/Mindset';
import Focus from './pages/Focus';
import GTD from './pages/GTD';
import { FocusTimerProvider } from './components/focus/FocusTimerService';
import { Toaster } from '@/components/ui/toaster';

function App() {
  return (
    <Router>
      <FocusTimerProvider>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/time-design" element={<TimeDesign />} />
          <Route path="/habits" element={<Habits />} />
          <Route path="/journal" element={<Journal />} />
          <Route path="/planning" element={<Planning />} />
          <Route path="/knowledge" element={<Knowledge />} />
          <Route path="/energy" element={<Energy />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/mindset" element={<Mindset />} />
          <Route path="/focus" element={<Focus />} />
          <Route path="/gtd" element={<GTD />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </FocusTimerProvider>
    </Router>
  );
}

export default App;
