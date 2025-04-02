
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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
import Auth from './pages/Auth';
import { FocusTimerProvider } from './components/focus/FocusTimerService';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from './contexts/AuthContext';

// Protected Route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  // Check if user is logged in from localStorage
  const isAuthenticated = localStorage.getItem('supabase.auth.token') !== null;
  
  // For development, you can disable this check
  // return <>{children}</>;
  
  // Uncomment this for production use
  return isAuthenticated ? <>{children}</> : <Navigate to="/auth" />;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <FocusTimerProvider>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route 
              path="/" 
              element={
                <ProtectedRoute>
                  <Index />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/tasks" 
              element={
                <ProtectedRoute>
                  <Tasks />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/time-design" 
              element={
                <ProtectedRoute>
                  <TimeDesign />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/habits" 
              element={
                <ProtectedRoute>
                  <Habits />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/journal" 
              element={
                <ProtectedRoute>
                  <Journal />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/planning" 
              element={
                <ProtectedRoute>
                  <Planning />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/knowledge" 
              element={
                <ProtectedRoute>
                  <Knowledge />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/energy" 
              element={
                <ProtectedRoute>
                  <Energy />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/settings" 
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/mindset" 
              element={
                <ProtectedRoute>
                  <Mindset />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/focus" 
              element={
                <ProtectedRoute>
                  <Focus />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/gtd" 
              element={
                <ProtectedRoute>
                  <GTD />
                </ProtectedRoute>
              } 
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </FocusTimerProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
