import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Exercise, ExerciseTemplate, MuscleGroup } from "@/types/energy";
import { Search } from "lucide-react";

interface ExerciseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (exercise: Exercise) => void;
  exercise: Exercise | null;
  exerciseTemplates: ExerciseTemplate[];
}

const muscleGroups: MuscleGroup[] = [
  "Chest",
  "Back",
  "Legs",
  "Shoulders",
  "Arms",
  "Core",
  "Back/Legs",
  "Cardio",
  "Full Body"
];

export function ExerciseDialog({ open, onOpenChange, onSave, exercise, exerciseTemplates }: ExerciseDialogProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<ExerciseTemplate | null>(null);
  
  const [name, setName] = useState('');
  const [category, setCategory] = useState<MuscleGroup>("Chest");
  const [sets, setSets] = useState('3');
  const [reps, setReps] = useState('10');
  const [weight, setWeight] = useState('');
  const [notes, setNotes] = useState('');
  
  useEffect(() => {
    if (exercise) {
      setName(exercise.name);
      setCategory(exercise.category);
      setSets(exercise.sets.toString());
      setReps(exercise.reps.toString());
      setWeight(exercise.weight?.toString() || '');
      setNotes(exercise.notes || '');
    } else {
      resetForm();
    }
  }, [exercise, open]);
  
  const resetForm = () => {
    setName('');
    setCategory("Chest");
    setSets('3');
    setReps('10');
    setWeight('');
    setNotes('');
    setSearchTerm('');
    setSelectedTemplate(null);
  };
  
  const handleSave = () => {
    const newExercise: Exercise = {
      id: exercise?.id || '',
      name,
      category,
      sets: parseInt(sets) || 0,
      reps: parseInt(reps) || 0,
      weight: weight ? parseInt(weight) : undefined,
      notes
    };
    onSave(newExercise);
  };
  
  const handleSelectTemplate = (template: ExerciseTemplate) => {
    setSelectedTemplate(template);
    setName(template.name);
    setCategory(template.category);
    // Keep the current sets, reps, weight values
  };
  
  // Filter templates based on search term
  const filteredTemplates = exerciseTemplates.filter(template => 
    template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.category.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Group by category
  const templatesByCategory: Record<string, ExerciseTemplate[]> = {};
  filteredTemplates.forEach(template => {
    if (!templatesByCategory[template.category]) {
      templatesByCategory[template.category] = [];
    }
    templatesByCategory[template.category].push(template);
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{exercise ? 'Edit Exercise' : 'Add Exercise'}</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          {/* Search for exercise template */}
          {!exercise && (
            <div className="grid gap-2 mb-2">
              <label className="text-sm font-medium">Search Exercise Library</label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name or muscle group..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              {searchTerm && (
                <div className="border rounded-md mt-2 max-h-60 overflow-y-auto">
                  {Object.entries(templatesByCategory).length > 0 ? (
                    Object.entries(templatesByCategory).map(([category, templates]) => (
                      <div key={category}>
                        <div className="bg-muted px-3 py-2 text-xs font-medium">{category}</div>
                        <div className="divide-y">
                          {templates.map((template) => (
                            <button
                              key={template.id}
                              type="button"
                              className="w-full px-3 py-2 text-left hover:bg-muted text-sm flex justify-between items-center"
                              onClick={() => handleSelectTemplate(template)}
                            >
                              <span>{template.name}</span>
                              <span className="text-xs text-muted-foreground">{template.equipment}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-3 text-sm text-center text-muted-foreground">
                      No exercises found
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
          
          {/* Exercise form */}
          <div className="grid gap-2">
            <label htmlFor="name" className="text-sm font-medium">Exercise Name</label>
            <Input
              id="name"
              placeholder="e.g., Bench Press"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          
          <div className="grid gap-2">
            <label htmlFor="category" className="text-sm font-medium">Muscle Group</label>
            <Select value={category} onValueChange={(value) => setCategory(value as MuscleGroup)}>
              <SelectTrigger>
                <SelectValue placeholder="Select muscle group" />
              </SelectTrigger>
              <SelectContent>
                {muscleGroups.map((group) => (
                  <SelectItem key={group} value={group}>{group}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="grid gap-2">
              <label htmlFor="sets" className="text-sm font-medium">Sets</label>
              <Input
                id="sets"
                type="number"
                min="1"
                value={sets}
                onChange={(e) => setSets(e.target.value)}
              />
            </div>
            
            <div className="grid gap-2">
              <label htmlFor="reps" className="text-sm font-medium">Reps</label>
              <Input
                id="reps"
                type="number"
                min="1"
                value={reps}
                onChange={(e) => setReps(e.target.value)}
              />
            </div>
            
            <div className="grid gap-2">
              <label htmlFor="weight" className="text-sm font-medium">Weight (kg)</label>
              <Input
                id="weight"
                type="number"
                min="0"
                placeholder="Optional"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
              />
            </div>
          </div>
          
          <div className="grid gap-2">
            <label htmlFor="notes" className="text-sm font-medium">Notes</label>
            <Input
              id="notes"
              placeholder="Any notes about this exercise"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
          
          {selectedTemplate && (
            <div className="text-sm bg-muted p-3 rounded-md">
              <p className="font-medium">{selectedTemplate.name}</p>
              <p className="text-muted-foreground mt-1">{selectedTemplate.description}</p>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            {exercise ? 'Update Exercise' : 'Add Exercise'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
