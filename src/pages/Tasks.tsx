
import React from "react";
import { useNavigate } from "react-router-dom";

// This is a placeholder file that redirects to Actions page
// since we no longer have a Tasks page and use Actions page instead

const TasksRedirect = () => {
  const navigate = useNavigate();
  
  React.useEffect(() => {
    // Redirect to Actions page
    navigate("/actions");
  }, [navigate]);
  
  return null;
};

export default TasksRedirect;
