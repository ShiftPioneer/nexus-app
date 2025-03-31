
import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Skillset, SkillsetCategory } from "@/types/knowledge";
import { Slider } from "@/components/ui/slider";
import { HexColorPicker } from "react-colorful";

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

export function SkillsetDialog({ open, onOpenChange, onSave, skillset }: SkillsetDialogProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<SkillsetCategory>('Programming');
  const [mastery, setMastery] = useState<number>(50);
  const [resourceCount, setResourceCount] = useState(0);
  const [lastPracticed, setLastPracticed] = useState(new Date().toISOString().split('T')[0]);
  const [color, setColor] = useState('#FEC6A1'); // Changed default color to orange
  const [showColorPicker, setShowColorPicker] = useState(false);
  
  useEffect(() => {
    if (skillset) {
      setName(skillset.name);
      setDescription(skillset.description || '');
      // Fixed the type issue by ensuring we only set valid SkillsetCategory values
      setCategory(skillsetCategories.includes(skillset.category as SkillsetCategory) 
        ? (skillset.category as SkillsetCategory) 
        : 'Other');
      setMastery(skillset.mastery);
      setResourceCount(skillset.resourceCount);
      setLastPracticed(skillset.lastPracticed.toISOString().split('T')[0]);
      setColor(skillset.color || '#FEC6A1');
    } else {
      setName('');
      setDescription('');
      setCategory('Programming');
      setMastery(50);
      setResourceCount(0);
      setLastPracticed(new Date().toISOString().split('T')[0]);
      setColor('#FEC6A1');
    }
  }, [skillset, open]);

  const handleSave = () => {
    const newSkillset: Skillset = {
      id: skillset?.id || Date.now().toString(),
      name,
      description,
      category,
      mastery,
      lastPracticed: new Date(lastPracticed),
      resourceCount,
      color
    };
    onSave(newSkillset);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{skillset ? 'Edit Skillset' : 'Add New Skillset'}</DialogTitle>
          <DialogDescription>
            Track your progress in learning and mastering new skills.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label htmlFor="name" className="text-sm font-medium">Skill Name</label>
            <Input
              id="name"
              placeholder="e.g., JavaScript, UI/UX Design, Public Speaking"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          
          <div className="grid gap-2">
            <label htmlFor="category" className="text-sm font-medium">Category</label>
            <Select 
              value={category} 
              onValueChange={(value: string) => setCategory(value as SkillsetCategory)}
            >
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
            <label htmlFor="description" className="text-sm font-medium">Description</label>
            <Textarea
              id="description"
              placeholder="Brief description of this skill"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          
          <div className="grid gap-2">
            <div className="flex justify-between">
              <label htmlFor="mastery" className="text-sm font-medium">Mastery Level</label>
              <span className="text-sm font-medium">{mastery}%</span>
            </div>
            <Slider 
              value={[mastery]} 
              onValueChange={(values) => setMastery(values[0])} 
              min={0} 
              max={100} 
              step={1}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <label htmlFor="lastPracticed" className="text-sm font-medium">Last Practiced</label>
              <Input
                id="lastPracticed"
                type="date"
                value={lastPracticed}
                onChange={(e) => setLastPracticed(e.target.value)}
              />
            </div>
            
            <div className="grid gap-2">
              <label htmlFor="resourceCount" className="text-sm font-medium">Resource Count</label>
              <Input
                id="resourceCount"
                type="number"
                value={resourceCount}
                onChange={(e) => setResourceCount(parseInt(e.target.value) || 0)}
                min={0}
              />
            </div>
          </div>
          
          <div className="grid gap-2">
            <label className="text-sm font-medium">Color</label>
            <div className="flex items-center gap-2">
              <div 
                className="w-8 h-8 rounded-md cursor-pointer border"
                style={{ backgroundColor: color }}
                onClick={() => setShowColorPicker(!showColorPicker)}
              />
              <Input
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="font-mono"
              />
            </div>
            {showColorPicker && (
              <div className="mt-2 p-2 border rounded-md">
                <HexColorPicker color={color} onChange={setColor} />
              </div>
            )}
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Skillset
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
