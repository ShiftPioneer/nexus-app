
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { GTDTask } from '@/types/gtd';
import { Trash2, RefreshCw, Clock, CalendarIcon, Tag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';

interface DeletedTasksDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  deletedTasks: GTDTask[];
  onRestoreTask: (id: string) => void;
  onPermanentlyDeleteTask: (id: string) => void;
}

const DeletedTasksDialog: React.FC<DeletedTasksDialogProps> = ({
  open,
  onOpenChange,
  deletedTasks,
  onRestoreTask,
  onPermanentlyDeleteTask
}) => {
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const { toast } = useToast();

  const handleRestore = (id: string) => {
    onRestoreTask(id);
    setSelectedTask(null);
    toast({
      title: "Task Restored",
      description: "The task has been restored successfully"
    });
  };

  const handlePermanentDelete = (id: string) => {
    onPermanentlyDeleteTask(id);
    setSelectedTask(null);
    toast({
      title: "Task Deleted Permanently",
      description: "The task has been permanently removed"
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Deleted Tasks</DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="h-[400px] pr-4">
          {deletedTasks.length > 0 ? (
            <div className="space-y-3">
              {deletedTasks.map((task) => (
                <div
                  key={task.id}
                  className={`p-3 border rounded-md transition-colors ${
                    selectedTask === task.id ? 'border-primary bg-muted' : 'hover:bg-muted/50'
                  }`}
                  onClick={() => setSelectedTask(task.id === selectedTask ? null : task.id)}
                >
                  <div className="flex justify-between">
                    <h4 className="font-medium">{task.title}</h4>
                    {task.priority && (
                      <Badge variant={
                        task.priority === "high" || task.priority === "urgent" 
                          ? "destructive" 
                          : task.priority === "medium" 
                            ? "default" 
                            : "outline"
                      }>
                        {task.priority}
                      </Badge>
                    )}
                  </div>
                  
                  {task.description && (
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {task.description}
                    </p>
                  )}
                  
                  <div className="flex flex-wrap gap-2 mt-2">
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>Deleted {format(new Date(task.createdAt), 'MMM d, yyyy')}</span>
                    </div>
                    
                    {task.dueDate && (
                      <div className="flex items-center text-xs text-muted-foreground">
                        <CalendarIcon className="h-3 w-3 mr-1" />
                        <span>Due {format(new Date(task.dueDate), 'MMM d')}</span>
                      </div>
                    )}
                  </div>
                  
                  {task.tags && task.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {task.tags.map(tag => (
                        <Badge key={tag} variant="outline" className="text-xs py-0">
                          <Tag className="h-3 w-3 mr-1" />
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                  
                  {selectedTask === task.id && (
                    <div className="flex justify-end gap-2 mt-3">
                      <Button 
                        size="sm"
                        variant="outline"
                        className="h-8"
                        onClick={() => handleRestore(task.id)}
                      >
                        <RefreshCw className="h-3 w-3 mr-1" />
                        Restore
                      </Button>
                      <Button 
                        size="sm"
                        variant="destructive"
                        className="h-8"
                        onClick={() => handlePermanentDelete(task.id)}
                      >
                        <Trash2 className="h-3 w-3 mr-1" />
                        Delete Permanently
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-[300px] text-center">
              <Trash2 className="h-10 w-10 text-muted-foreground mb-2 opacity-30" />
              <p className="text-muted-foreground">No deleted tasks</p>
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default DeletedTasksDialog;
