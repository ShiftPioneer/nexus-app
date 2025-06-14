import React from "react";
import { useGTD } from "../GTDContext";
import { useToast } from "@/hooks/use-toast";
import TasksList from "../TasksList";
import GTDPrinciple from "../GTDPrinciple";
import QuickCaptureForm from "./capture/QuickCaptureForm";
const CaptureView: React.FC = () => {
  const {
    tasks,
    addTask
  } = useGTD();
  const {
    toast
  } = useToast();
  const inboxTasks = tasks.filter(task => task.status === "inbox");
  return <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <QuickCaptureForm />
      <GTDPrinciple />
      
      <div className="md:col-span-2">
        <h3 className="text-xl font-medium mb-4 text-cyan-600">Inbox</h3>
        <TasksList tasks={inboxTasks} />
      </div>
    </div>;
};
export default CaptureView;