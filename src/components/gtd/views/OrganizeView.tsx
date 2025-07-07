
import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  Filter, 
  Folder, 
  Clock, 
  User, 
  Archive, 
  Brain,
  ArrowRight,
  CheckCircle2,
  Calendar,
  Flag
} from "lucide-react";
import { useGTD } from "../GTDContext";
import { GTDTask, TaskCategory } from "@/types/gtd";

const OrganizeView = () => {
  const { tasks, updateTask } = useGTD();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("projects");

  const clarifiedTasks = tasks.filter(task => task.clarified);

  const organizedTasks = useMemo(() => {
    const filtered = clarifiedTasks.filter(task =>
      searchTerm === "" || task.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return {
      projects: filtered.filter(task => task.category === 'projects'),
      nextActions: filtered.filter(task => task.category === 'next-actions'),
      waitingFor: filtered.filter(task => task.category === 'waiting-for'),
      somedayMaybe: filtered.filter(task => task.category === 'someday-maybe'),
      reference: filtered.filter(task => task.category === 'reference')
    };
  }, [clarifiedTasks, searchTerm]);

  const moveTask = (taskId: string, newCategory: TaskCategory) => {
    updateTask(taskId, { category: newCategory });
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="glass rounded-2xl p-6 border border-slate-700/50">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Organize</h2>
            <p className="text-slate-300">Structure your clarified tasks into actionable categories</p>
          </div>
          <div className="flex gap-2">
            <Badge variant="outline" className="bg-green-500/10 border-green-500/30 text-green-300">
              {organizedTasks.projects.length} Projects
            </Badge>
            <Badge variant="outline" className="bg-blue-500/10 border-blue-500/30 text-blue-300">
              {organizedTasks.nextActions.length} Next Actions
            </Badge>
          </div>
        </div>

        {/* Search */}
        <div className="relative mt-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
          <Input
            placeholder="Search organized tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-slate-800/50 border-slate-600 text-white"
          />
        </div>
      </div>

      {/* Organization Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5 bg-slate-800/50 border border-slate-700/50">
          <TabsTrigger value="projects" className="gap-2">
            <Folder className="h-4 w-4" />
            Projects
          </TabsTrigger>
          <TabsTrigger value="next-actions" className="gap-2">
            <ArrowRight className="h-4 w-4" />
            Next Actions
          </TabsTrigger>
          <TabsTrigger value="waiting-for" className="gap-2">
            <Clock className="h-4 w-4" />
            Waiting For
          </TabsTrigger>
          <TabsTrigger value="someday-maybe" className="gap-2">
            <Brain className="h-4 w-4" />
            Someday/Maybe
          </TabsTrigger>
          <TabsTrigger value="reference" className="gap-2">
            <Archive className="h-4 w-4" />
            Reference
          </TabsTrigger>
        </TabsList>

        <TabsContent value="projects" className="mt-6">
          <CategorySection
            title="Projects"
            tasks={organizedTasks.projects}
            onMoveTask={moveTask}
            emptyMessage="No projects yet. Projects are outcomes that require multiple steps to complete."
            icon={Folder}
          />
        </TabsContent>

        <TabsContent value="next-actions" className="mt-6">
          <CategorySection
            title="Next Actions"
            tasks={organizedTasks.nextActions}
            onMoveTask={moveTask}
            emptyMessage="No next actions yet. These are concrete, physical actions you can take immediately."
            icon={ArrowRight}
          />
        </TabsContent>

        <TabsContent value="waiting-for" className="mt-6">
          <CategorySection
            title="Waiting For"
            tasks={organizedTasks.waitingFor}
            onMoveTask={moveTask}
            emptyMessage="Nothing you're waiting for. Track items that depend on others here."
            icon={Clock}
          />
        </TabsContent>

        <TabsContent value="someday-maybe" className="mt-6">
          <CategorySection
            title="Someday/Maybe"
            tasks={organizedTasks.somedayMaybe}
            onMoveTask={moveTask}
            emptyMessage="No someday/maybe items. Store ideas and possibilities here for future review."
            icon={Brain}
          />
        </TabsContent>

        <TabsContent value="reference" className="mt-6">
          <CategorySection
            title="Reference"
            tasks={organizedTasks.reference}
            onMoveTask={moveTask}
            emptyMessage="No reference materials yet. Store information you might need later here."
            icon={Archive}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

const CategorySection = ({ 
  title, 
  tasks, 
  onMoveTask, 
  emptyMessage, 
  icon: Icon 
}: {
  title: string;
  tasks: GTDTask[];
  onMoveTask: (taskId: string, category: TaskCategory) => void;
  emptyMessage: string;
  icon: any;
}) => {
  if (tasks.length === 0) {
    return (
      <Card className="bg-slate-900/50 border-slate-700/50 text-center p-12">
        <Icon className="h-16 w-16 text-slate-500 mx-auto mb-4 opacity-50" />
        <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
        <p className="text-slate-400">{emptyMessage}</p>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} onMoveTask={onMoveTask} />
      ))}
    </div>
  );
};

const TaskCard = ({ task, onMoveTask }: { task: GTDTask; onMoveTask: (taskId: string, category: TaskCategory) => void }) => {
  return (
    <Card className="bg-slate-900/80 border-slate-700/50 hover:border-blue-500/30 transition-all duration-300 group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-white text-sm group-hover:text-blue-300 transition-colors">
              {task.title}
            </CardTitle>
            {task.description && (
              <p className="text-slate-400 text-xs mt-1 line-clamp-2">{task.description}</p>
            )}
          </div>
          <Badge variant="outline" className={`
            ml-2 text-xs
            ${task.priority === 'urgent' ? 'border-red-500/50 text-red-300 bg-red-500/10' : ''}
            ${task.priority === 'high' ? 'border-orange-500/50 text-orange-300 bg-orange-500/10' : ''}
            ${task.priority === 'medium' ? 'border-yellow-500/50 text-yellow-300 bg-yellow-500/10' : ''}
            ${task.priority === 'low' ? 'border-green-500/50 text-green-300 bg-green-500/10' : ''}
          `}>
            <Flag className="h-3 w-3 mr-1" />
            {task.priority}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-3">
          {task.context && (
            <Badge variant="secondary" className="bg-slate-700/50 text-slate-300 text-xs">
              {task.context}
            </Badge>
          )}
          
          <div className="flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>{new Date(task.createdAt).toLocaleDateString()}</span>
            </div>
            {task.status === 'completed' && (
              <div className="flex items-center gap-1 text-green-400">
                <CheckCircle2 className="h-3 w-3" />
                <span>Done</span>
              </div>
            )}
          </div>

          {/* Quick Move Actions */}
          <div className="flex flex-wrap gap-1 pt-2 border-t border-slate-700/30">
            {task.category !== 'next-actions' && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onMoveTask(task.id, 'next-actions')}
                className="text-xs h-6 px-2 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
              >
                → Next Action
              </Button>
            )}
            {task.category !== 'projects' && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onMoveTask(task.id, 'projects')}
                className="text-xs h-6 px-2 text-green-400 hover:text-green-300 hover:bg-green-500/10"
              >
                → Project
              </Button>
            )}
            {task.category !== 'waiting-for' && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onMoveTask(task.id, 'waiting-for')}
                className="text-xs h-6 px-2 text-yellow-400 hover:text-yellow-300 hover:bg-yellow-500/10"
              >
                → Waiting
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrganizeView;
