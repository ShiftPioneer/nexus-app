
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Index from './pages/Index';
import NotFound from './pages/NotFound';
import Tasks from './pages/Tasks';
import TimeDesign from './pages/TimeDesign';
import Habits from './pages/Habits';
import Journal from './pages/Journal';
import Planning from './pages/Planning';
import Projects from './pages/Projects';
import Knowledge from './pages/Knowledge';
import Energy from './pages/Energy';
import Settings from './pages/Settings';
import Mindset from './pages/Mindset';
import Focus from './pages/Focus';
import GTD from './pages/GTD';
import Auth from './pages/Auth';
import { FocusTimerProvider } from './components/focus/FocusTimerService';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { HabitProvider } from './contexts/HabitContext';
import { GoalProvider } from './contexts/GoalContext';
import { TaskProvider } from './contexts/TaskContext';
import { KnowledgeProvider } from './contexts/KnowledgeContext';
import { ProjectProvider } from './contexts/ProjectContext';
import { useEffect, useState } from 'react';

// Protected Route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const [isChecking, setIsChecking] = useState(true);
  
  useEffect(() => {
    // Wait for auth to initialize before deciding to redirect
    if (!loading) {
      setIsChecking(false);
    }
  }, [loading]);
  
  if (loading || isChecking) {
    return <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FF6500]"></div>
    </div>;
  }
  
  if (!user) {
    return <Navigate to="/auth" />;
  }
  
  return <>{children}</>;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <GoalProvider>
          <TaskProvider>
            <HabitProvider>
              <KnowledgeProvider>
                <ProjectProvider>
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
                        path="/projects" 
                        element={
                          <ProtectedRoute>
                            <Projects />
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
                </ProjectProvider>
              </KnowledgeProvider>
            </HabitProvider>
          </TaskProvider>
        </GoalProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
