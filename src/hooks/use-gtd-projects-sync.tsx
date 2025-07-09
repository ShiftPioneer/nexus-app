
import { useEffect } from 'react';

export const useGTDProjectsSync = () => {
  const syncGTDProjects = () => {
    try {
      // Get GTD tasks that are projects
      const gtdTasks = JSON.parse(localStorage.getItem('gtdTasks') || '[]');
      const gtdProjects = gtdTasks.filter((task: any) => task.status === 'project');

      // Get existing planning projects
      const planningProjects = JSON.parse(localStorage.getItem('planningProjects') || '[]');
      
      // Convert GTD projects to planning projects format
      const convertedProjects = gtdProjects.map((gtdProject: any) => {
        // Check if this project already exists in planning
        const existingProject = planningProjects.find((p: any) => p.gtdId === gtdProject.id);
        
        if (existingProject) {
          // Update existing project
          return {
            ...existingProject,
            title: gtdProject.title,
            description: gtdProject.description || '',
            status: gtdProject.completed ? 'completed' : 'in-progress',
            progress: gtdProject.completed ? 100 : existingProject.progress || 0,
            gtdId: gtdProject.id,
            updatedAt: new Date()
          };
        } else {
          // Create new project from GTD task
          return {
            id: `gtd-${gtdProject.id}`,
            gtdId: gtdProject.id,
            title: gtdProject.title,
            description: gtdProject.description || '',
            category: 'career' as const,
            progress: gtdProject.completed ? 100 : 0,
            startDate: gtdProject.createdAt ? new Date(gtdProject.createdAt) : new Date(),
            endDate: gtdProject.dueDate ? new Date(gtdProject.dueDate) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            status: gtdProject.completed ? 'completed' : 'in-progress',
            blockingProjects: [],
            blockedByProjects: [],
            createdAt: gtdProject.createdAt ? new Date(gtdProject.createdAt) : new Date(),
            updatedAt: new Date()
          };
        }
      });

      // Keep manually created projects (those without gtdId)
      const manualProjects = planningProjects.filter((p: any) => !p.gtdId);
      
      // Combine converted and manual projects
      const allProjects = [...manualProjects, ...convertedProjects];
      
      // Save back to localStorage
      localStorage.setItem('planningProjects', JSON.stringify(allProjects));
      
      // Dispatch custom event to notify other components
      window.dispatchEvent(new CustomEvent('projectsUpdated', { detail: allProjects }));
      
      console.log('GTD Projects synced to Planning:', allProjects);
      
    } catch (error) {
      console.error('Error syncing GTD projects:', error);
    }
  };

  useEffect(() => {
    // Initial sync
    syncGTDProjects();

    // Listen for GTD task updates
    const handleTaskUpdate = () => {
      setTimeout(syncGTDProjects, 100); // Small delay to ensure GTD updates are saved
    };

    // Listen for custom events
    window.addEventListener('tasksUpdated', handleTaskUpdate);
    window.addEventListener('gtdTaskCreated', handleTaskUpdate);
    window.addEventListener('gtdTaskUpdated', handleTaskUpdate);
    
    return () => {
      window.removeEventListener('tasksUpdated', handleTaskUpdate);
      window.removeEventListener('gtdTaskCreated', handleTaskUpdate);
      window.removeEventListener('gtdTaskUpdated', handleTaskUpdate);
    };
  }, []);

  return { syncGTDProjects };
};
