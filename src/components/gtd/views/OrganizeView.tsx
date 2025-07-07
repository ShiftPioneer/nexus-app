
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, Filter, Calendar, Users, Archive, CheckCircle2, Clock, FolderOpen } from "lucide-react";
import { motion } from "framer-motion";
import { useGTD } from "../GTDContext";
import { Badge } from "@/components/ui/badge";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const OrganizeView = () => {
  const { tasks, updateTask } = useGTD();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = [
    { 
      id: 'next-actions', 
      title: 'Next Actions', 
      icon: CheckCircle2, 
      color: 'from-green-500 to-emerald-600',
      description: 'Tasks you can do right now'
    },
    { 
      id: 'projects', 
      title: 'Projects', 
      icon: FolderOpen, 
      color: 'from-blue-500 to-indigo-600',
      description: 'Multi-step outcomes'
    },
    { 
      id: 'waiting-for', 
      title: 'Waiting For', 
      icon: Users, 
      color: 'from-orange-500 to-amber-600',
      description: 'Delegated and pending items'
    },
    { 
      id: 'calendar', 
      title: 'Calendar', 
      icon: Calendar, 
      color: 'from-purple-500 to-pink-600',
      description: 'Scheduled appointments and deadlines'
    },
    { 
      id: 'someday-maybe', 
      title: 'Someday/Maybe', 
      icon: Clock, 
      color: 'from-cyan-500 to-teal-600',
      description: 'Things to consider in the future'
    },
    { 
      id: 'reference', 
      title: 'Reference', 
      icon: Archive, 
      color: 'from-slate-500 to-slate-600',
      description: 'Information that might be useful later'
    }
  ];

  const getTasksByCategory = (categoryId: string) => {
    return tasks.filter(task => 
      task.category === categoryId && 
      task.clarified &&
      (searchTerm === "" || task.title.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;
    
    if (source.droppableId !== destination.droppableId) {
      updateTask(draggableId, {
        category: destination.droppableId,
        status: destination.droppableId
      });
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div 
        className="text-center space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg">
            <FolderOpen className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
            Organize Everything
          </h1>
        </div>
        <p className="text-slate-400 text-lg max-w-3xl mx-auto">
          Put everything in its right place. Organize your clarified tasks into the appropriate GTD categories.
        </p>
      </motion.div>

      {/* Search and Filters */}
      <motion.div 
        className="flex flex-col md:flex-row gap-4 items-center justify-between"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search across all categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-slate-900/50 border-slate-700 focus:border-emerald-500"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={selectedCategory === null ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(null)}
            className="border-slate-600"
          >
            All Categories
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="border-slate-600 text-slate-300"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </div>
      </motion.div>

      {/* Categories Grid */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          {categories.map((category) => {
            const categoryTasks = getTasksByCategory(category.id);
            const Icon = category.icon;
            
            return (
              <Card 
                key={category.id} 
                className="bg-slate-950/80 backdrop-blur-sm border-slate-700/50 hover:border-slate-600 transition-all duration-300"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-r ${category.color} flex items-center justify-center shadow-lg`}>
                        <Icon className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-lg font-semibold text-white">
                          {category.title}
                        </CardTitle>
                        <p className="text-xs text-slate-400 mt-1">
                          {category.description}
                        </p>
                      </div>
                    </div>
                    <Badge variant="secondary" className="bg-slate-800 text-slate-300">
                      {categoryTasks.length}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <Droppable droppableId={category.id}>
                    {(provided, snapshot) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className={`min-h-32 space-y-2 p-3 rounded-lg border-2 border-dashed transition-all duration-200 ${
                          snapshot.isDraggingOver
                            ? 'border-emerald-500 bg-emerald-500/5'
                            : 'border-slate-700 bg-slate-900/30'
                        }`}
                      >
                        {categoryTasks.length === 0 ? (
                          <div className="text-center py-6">
                            <p className="text-sm text-slate-500">
                              Drop tasks here or click to add
                            </p>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="mt-2 text-slate-400 hover:text-slate-300"
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Add Task
                            </Button>
                          </div>
                        ) : (
                          categoryTasks.map((task, index) => (
                            <Draggable key={task.id} draggableId={task.id} index={index}>
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className={`p-3 rounded-lg bg-slate-800/50 border border-slate-700 hover:bg-slate-800 transition-all duration-200 cursor-move ${
                                    snapshot.isDragging ? 'shadow-xl rotate-2 scale-105' : ''
                                  }`}
                                >
                                  <h4 className="font-medium text-white text-sm mb-1">
                                    {task.title}
                                  </h4>
                                  {task.description && (
                                    <p className="text-xs text-slate-400 line-clamp-2">
                                      {task.description}
                                    </p>
                                  )}
                                  <div className="flex items-center justify-between mt-2">
                                    <Badge
                                      variant="outline"
                                      className={`text-xs ${
                                        task.priority === 'urgent' ? 'border-red-500 text-red-400' :
                                        task.priority === 'high' ? 'border-orange-500 text-orange-400' :
                                        task.priority === 'medium' ? 'border-yellow-500 text-yellow-400' :
                                        'border-green-500 text-green-400'
                                      }`}
                                    >
                                      {task.priority}
                                    </Badge>
                                    {task.dueDate && (
                                      <span className="text-xs text-slate-500">
                                        {new Date(task.dueDate).toLocaleDateString()}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              )}
                            </Draggable>
                          ))
                        )}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </CardContent>
              </Card>
            );
          })}
        </motion.div>
      </DragDropContext>

      {/* Organization Tips */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <Card className="bg-gradient-to-r from-emerald-950/20 to-teal-950/20 border-emerald-500/20 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg text-emerald-300">Organization Best Practices</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-medium text-white">Regular Reviews:</h4>
                <ul className="text-sm text-slate-300 space-y-1">
                  <li>• Weekly review of all categories</li>
                  <li>• Update project progress regularly</li>
                  <li>• Clean up completed items</li>
                  <li>• Move items between categories as needed</li>
                </ul>
              </div>
              <div className="space-y-3">
                <h4 className="font-medium text-white">Organization Tips:</h4>
                <ul className="text-sm text-slate-300 space-y-1">
                  <li>• Keep Next Actions specific and doable</li>
                  <li>• Break down large projects into smaller tasks</li>
                  <li>• Use contexts for better organization</li>
                  <li>• Regularly review Someday/Maybe items</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default OrganizeView;
