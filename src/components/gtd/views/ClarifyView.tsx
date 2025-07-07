
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, Plus, CheckCircle, Clock, Users, Archive, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { useGTD } from "../GTDContext";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import InboxTasksList from "./clarify/InboxTasksList";
import ClarifyCard from "./clarify/ClarifyCard";
import { TaskStatus, TaskCategory } from "@/types/gtd";
import { useGTDDragDrop } from "@/hooks/use-gtd-drag-drop";

const ClarifyView = () => {
  const { tasks, updateTask, deleteTask, moveTask } = useGTD();
  const { handleDragEnd } = useGTDDragDrop(moveTask);
  const [selectedTask, setSelectedTask] = useState<any>(null);

  const inboxTasks = tasks.filter(task => task.status === 'inbox' && !task.clarified);
  const clarifyingTask = selectedTask || inboxTasks[0];

  const clarifyOptions = [
    {
      id: 'do-it',
      title: 'Do It',
      description: 'If it takes less than 2 minutes, do it now.',
      icon: CheckCircle,
      color: 'from-green-500 to-emerald-600',
      droppableId: 'do-it'
    },
    {
      id: 'delegate-it',
      title: 'Delegate It',
      description: 'If someone else should do it, delegate and track.',
      icon: Users,
      color: 'from-blue-500 to-indigo-600',
      droppableId: 'delegate-it'
    },
    {
      id: 'defer-it',
      title: 'Defer It',
      description: 'Schedule it for later if it requires more time.',
      icon: Clock,
      color: 'from-purple-500 to-pink-600',
      droppableId: 'defer-it'
    },
    {
      id: 'reference-it',
      title: 'Reference',
      description: 'Store it if it might be useful later.',
      icon: Archive,
      color: 'from-emerald-500 to-teal-600',
      droppableId: 'reference-it'
    },
    {
      id: 'delete-it',
      title: 'Delete It',
      description: 'Remove it if it\'s no longer relevant or needed.',
      icon: Trash2,
      color: 'from-red-500 to-pink-600',
      droppableId: 'delete-it'
    }
  ];

  const handleClarifyAction = (newStatus: TaskStatus, newCategory: TaskCategory) => {
    if (clarifyingTask) {
      updateTask(clarifyingTask.id, {
        status: newStatus,
        clarified: true,
        category: newCategory
      });
      setSelectedTask(null);
    }
  };

  const handleDeleteAction = () => {
    if (clarifyingTask) {
      deleteTask(clarifyingTask.id);
      setSelectedTask(null);
    }
  };

  const navigateToCapture = () => {
    // This would be handled by the parent component to switch tabs
    console.log('Navigate to capture');
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="space-y-8 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          className="text-center space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-500 to-pink-600 flex items-center justify-center shadow-lg">
              <Search className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Clarify Your Inbox
            </h1>
          </div>
          <p className="text-slate-400 text-lg max-w-3xl mx-auto">
            Transform your captured items into actionable tasks. Decide what each item means and what action, if any, is required.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Side - Items to Process */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-1"
          >
            <Card className="bg-slate-950/80 backdrop-blur-sm border-slate-700/50 h-fit">
              <CardHeader className="pb-4">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-xl font-semibold text-white flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                      <Search className="h-4 w-4 text-blue-400" />
                    </div>
                    Items to Process
                  </CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-slate-600 text-slate-300 hover:bg-slate-800"
                    onClick={navigateToCapture}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Task
                  </Button>
                </div>
                <p className="text-sm text-slate-400">
                  {inboxTasks.length} items waiting to be clarified
                </p>
              </CardHeader>
              <CardContent>
                <InboxTasksList 
                  tasks={inboxTasks}
                  onAddTask={navigateToCapture}
                  onGoToCapture={navigateToCapture}
                />
              </CardContent>
            </Card>

            {/* Current Task Preview */}
            {clarifyingTask && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6"
              >
                <Card className="bg-gradient-to-r from-purple-950/20 to-pink-950/20 border-purple-500/20 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-lg text-purple-300">Currently Processing</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-700">
                      <h3 className="font-medium text-white mb-2">{clarifyingTask.title}</h3>
                      {clarifyingTask.description && (
                        <p className="text-sm text-slate-400">{clarifyingTask.description}</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </motion.div>

          {/* Right Side - Clarification Actions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="lg:col-span-2"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {clarifyOptions.map((option) => (
                <ClarifyCard
                  key={option.id}
                  droppableId={option.droppableId}
                  title={option.title}
                  description={option.description}
                  icon={<option.icon className="h-8 w-8" />}
                  iconBgClass={`bg-gradient-to-r ${option.color}`}
                  iconTextClass="text-white"
                  activeDropClass="bg-slate-800/30 border-slate-500"
                />
              ))}
            </div>
          </motion.div>
        </div>

        {/* Decision Framework */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Card className="bg-gradient-to-r from-purple-950/20 to-pink-950/20 border-purple-500/20 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg text-purple-300">GTD Decision Framework</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <h4 className="font-medium text-white">1. What is it?</h4>
                  <p className="text-sm text-slate-300">
                    Define what the item actually represents
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-white">2. Is it actionable?</h4>
                  <p className="text-sm text-slate-300">
                    Can you do something about it right now?
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-white">3. What's the next action?</h4>
                  <p className="text-sm text-slate-300">
                    What's the very next physical action required?
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </DragDropContext>
  );
};

export default ClarifyView;
