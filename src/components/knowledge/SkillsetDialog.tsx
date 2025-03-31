
import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Skillset, SkillsetCategory } from "@/types/knowledge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface SkillsetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (skillset: Skillset) => void;
  skillset: Skillset | null;
}

const skillsetCategories: SkillsetCategory[] = [
  'Programming',
  'Design',
  'Analytics',
  'Soft Skills',
  'Language',
  'Music',
  'Sport',
  'Art',
  'Business',
  'Religion',
  'Other'
];

const colorOptions = [
  '#1E88E5', // blue
  '#00BCD4', // teal
  '#FFC107', // amber
  '#FF5722', // deep orange
  '#9C27B0', // purple
  '#F44336', // red
  '#2196F3', // lighter blue
];

export function SkillsetDialog({ open, onOpenChange, onSave, skillset }: SkillsetDialogProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<SkillsetCategory>('Programming');
  const [mastery, setMastery] = useState(0);
  const [lastPracticed, setLastPracticed] = useState<Date>(new Date());
  const [selectedColor, setSelectedColor] = useState(colorOptions[0]);
  
  useEffect(() => {
    if (skillset) {
      setName(skillset.name);
      setDescription(skillset.description || '');
      setCategory(skillset.category as SkillsetCategory);
      setMastery(skillset.mastery);
      setLastPracticed(skillset.lastPracticed);
      setSelectedColor(skillset.color || colorOptions[0]);
    } else {
      setName('');
      setDescription('');
      setCategory('Programming');
      setMastery(0);
      setLastPracticed(new Date());
      setSelectedColor(colorOptions[0]);
    }
  }, [skillset, open]);

  const handleSave = () => {
    const newSkillset: Skillset = {
      id: skillset?.id || '',
      name,
      description,
      category,
      mastery,
      lastPracticed,
      resourceCount: skillset?.resourceCount || 0,
      color: selectedColor
    };
    onSave(newSkillset);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{skillset ? 'Edit Skillset' : 'Add New Skillset'}</DialogTitle>
          <DialogDescription>
            Enter the details of your {skillset ? 'existing' : 'new'} skillset to track your progress.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label htmlFor="name" className="text-sm font-medium">Skillset Name</label>
            <Input
              id="name"
              placeholder="e.g. JavaScript, Public Speaking, etc."
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          
          <div className="grid gap-2">
            <label htmlFor="description" className="text-sm font-medium">Description</label>
            <Textarea
              id="description"
              placeholder="Brief description of this skillset"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          
          <div className="grid gap-2">
            <label htmlFor="category" className="text-sm font-medium">Category</label>
            <Select value={category} onValueChange={(value) => setCategory(value as SkillsetCategory)}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {skillsetCategories.map((cat) => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid gap-2">
            <label htmlFor="last-practiced" className="text-sm font-medium">Last Practiced</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !lastPracticed && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {lastPracticed ? format(lastPracticed, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={lastPracticed}
                  onSelect={(date) => date && setLastPracticed(date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="grid gap-2">
            <label className="text-sm font-medium">
              Mastery Level ({mastery}%)
            </label>
            <Slider
              value={[mastery]}
              min={0}
              max={100}
              step={1}
              onValueChange={(value) => setMastery(value[0])}
            />
          </div>
          
          <div className="grid gap-2">
            <label className="text-sm font-medium">Color</label>
            <div className="flex gap-2">
              {colorOptions.map((color) => (
                <button
                  key={color}
                  type="button"
                  className={`w-8 h-8 rounded-full cursor-pointer ${selectedColor === color ? 'ring-2 ring-offset-2 ring-primary' : ''}`}
                  style={{ backgroundColor: color }}
                  onClick={() => setSelectedColor(color)}
                  aria-label={`Select color ${color}`}
                />
              ))}
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            {skillset ? 'Save Changes' : 'Save'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
