
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { GTDTask } from "../../GTDContext";

interface TaskEditDialogProps {
  task: GTDTask | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (taskId: string, updates: Partial<GTDTask>) => void;
}

const TaskEditDialog: React.FC<TaskEditDialogProps> = ({
  task,
  open,
  onOpenChange,
  onSave
}) => {
  const [editedTitle, setEditedTitle] = useState("");
  const [editedDescription, setEditedDescription] = useState("");
  const [editedPriority, setEditedPriority] = useState("");

  // Update the form when task changes
  React.useEffect(() => {
    if (task) {
      setEditedTitle(task.title);
      setEditedDescription(task.description || "");
      setEditedPriority(task.priority);
    }
  }, [task]);

  const handleSave = () => {
    if (!task || !editedTitle.trim()) return;

    onSave(task.id, {
      title: editedTitle,
      description: editedDescription,
      priority: editedPriority as GTDTask["priority"]
    });
    
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
          <DialogDescription>
            Update task details and save changes
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <label className="text-sm font-medium">Title</label>
            <Input 
              value={editedTitle} 
              onChange={(e) => setEditedTitle(e.target.value)} 
              placeholder="Task title" 
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <Textarea 
              value={editedDescription} 
              onChange={(e) => setEditedDescription(e.target.value)} 
              placeholder="Task description (optional)" 
              rows={3} 
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Priority</label>
            <Select value={editedPriority} onValueChange={setEditedPriority}>
              <SelectTrigger>
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Very Low">Very Low</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Very High">Very High</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button onClick={handleSave}>Save Changes</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TaskEditDialog;
