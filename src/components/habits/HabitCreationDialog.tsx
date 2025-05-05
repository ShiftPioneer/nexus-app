
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface HabitCreationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (habit: Habit) => void;
}

const HabitCreationDialog: React.FC<HabitCreationDialogProps> = ({ open, onOpenChange, onSubmit }) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<any>('productivity');
  const [type, setType] = useState<any>('daily');
  const [target, setTarget] = useState(21);
  const [duration, setDuration] = useState('15');
  const [scoreValue, setScoreValue] = useState(1);
  const [penaltyValue, setPenaltyValue] = useState(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newHabit: Habit = {
      id: Date.now().toString(),
      title,
      category,
      streak: 0,
      target,
      status: 'pending',
      completionDates: [],
      type,
      createdAt: new Date(),
      duration,
      scoreValue,
      penaltyValue,
      completedToday: false,
      accountabilityScore: 0
    };
    
    onSubmit(newHabit);
    resetForm();
  };
  
  const resetForm = () => {
    setTitle('');
    setCategory('productivity');
    setType('daily');
    setTarget(21);
    setDuration('15');
    setScoreValue(1);
    setPenaltyValue(1);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create a New Habit</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-2">
            <Label htmlFor="title">Habit Name</Label>
            <Input 
              id="title" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Drink water, Meditate, Exercise" 
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={category} onValueChange={setCategory} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mindfulness">Mindfulness</SelectItem>
                  <SelectItem value="health">Health</SelectItem>
                  <SelectItem value="learning">Learning</SelectItem>
                  <SelectItem value="productivity">Productivity</SelectItem>
                  <SelectItem value="relationships">Relationships</SelectItem>
                  <SelectItem value="finance">Finance</SelectItem>
                  <SelectItem value="religion">Religion</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="type">Frequency</Label>
              <Select value={type} onValueChange={setType} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="target">Target Days (Habit Formation)</Label>
              <Input 
                id="target"
                type="number"
                min={1}
                value={target}
                onChange={(e) => setTarget(parseInt(e.target.value))}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="duration">Time Required (minutes)</Label>
              <Input 
                id="duration"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="e.g., 15" 
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="scoreValue">Points for Completion</Label>
              <Input 
                id="scoreValue"
                type="number"
                min={1}
                value={scoreValue}
                onChange={(e) => setScoreValue(parseInt(e.target.value))}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="penaltyValue">Points Lost for Missing</Label>
              <Input 
                id="penaltyValue"
                type="number"
                min={1}
                value={penaltyValue}
                onChange={(e) => setPenaltyValue(parseInt(e.target.value))}
                required
              />
            </div>
          </div>
          
          <div className="flex justify-end gap-2 mt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Create Habit</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default HabitCreationDialog;
