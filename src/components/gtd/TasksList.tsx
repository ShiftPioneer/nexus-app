
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGTD } from "./GTDContext";
import { useToast } from "@/hooks/use-toast";
import TaskCard from "./tasks-list/TaskCard";
import EmptyTasksCard from "./tasks-list/EmptyTasksCard";

interface TasksListProps {
  tasks: any[];
  showActions?: boolean;
  onTaskComplete?: (id: string) => void;
  isToDoNot?: boolean;
  onEdit?: (id: string) => void;
}

const TasksList: React.FC<TasksListProps> = ({
  tasks,
  showActions = false,
  onTaskComplete,
  isToDoNot = false,
  onEdit
}) => {
  const { updateTask, deleteTask } = useGTD();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);

  // Load goals and projects from localStorage
  useEffect(() => {
    try {
      const savedGoals = localStorage.getItem('planningGoals');
      if (savedGoals) {
        setGoals(JSON.parse(savedGoals));
      }
      const savedProjects = localStorage.getItem('planningProjects');
      if (savedProjects) {
        setProjects(JSON.parse(savedProjects));
      }
    } catch (error) {
      console.error("Error loading goals and projects:", error);
    }
  }, []);

  if (!tasks.length) {
    return <EmptyTasksCard isToDoNot={isToDoNot} />;
  }

  const handleMarkComplete = (id: string) => {
    if (onTaskComplete) {
      onTaskComplete(id);
    } else {
      updateTask(id, { status: "completed" });
    }
  };

  const handleEdit = (id: string) => {
    if (onEdit) {
      onEdit(id);
    }
  };

  const handleDelete = (id: string) => {
    deleteTask(id);
  };

  const handleStartFocus = (task: any) => {
    try {
      // Save current task to focus on in localStorage
      localStorage.setItem('currentFocusTask', JSON.stringify({
        id: task.id,
        title: task.title,
        timeEstimate: task.timeEstimate || 25, // Default to 25 minutes if no estimate
        startTime: new Date().toISOString()
      }));

      // Update task status to in-progress
      updateTask(task.id, { status: "in-progress" });

      // Navigate to focus page
      navigate('/focus');
      
      toast({
        title: "Focus Session Started",
        description: `Started focus session for "${task.title}"`
      });
    } catch (error) {
      console.error("Error starting focus session:", error);
      toast({
        title: "Error",
        description: "Failed to start focus session. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Get goal or project title by ID
  const getGoalTitle = (goalId: string) => {
    const goal = goals.find(g => g.id === goalId);
    return goal ? goal.title : "Unknown Goal";
  };

  const getProjectTitle = (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    return project ? project.title : "Unknown Project";
  };

  return (
    <div className="space-y-3">
      {tasks.map(task => (
        <TaskCard
          key={task.id}
          task={task}
          isToDoNot={isToDoNot}
          showActions={showActions}
          getGoalTitle={getGoalTitle}
          getProjectTitle={getProjectTitle}
          handleMarkComplete={handleMarkComplete}
          handleEdit={handleEdit}
          handleStartFocus={handleStartFocus}
          handleDelete={handleDelete}
        />
      ))}
    </div>
  );
};

export default TasksList;
