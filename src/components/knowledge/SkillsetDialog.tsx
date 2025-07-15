
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
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto bg-slate-900/95 border border-white/10 backdrop-blur-sm">
        <DialogHeader className="border-b border-white/10 pb-4">
          <DialogTitle className="text-2xl font-bold text-white flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-orange-500 to-red-500 shadow-lg">
              <span className="text-white font-bold">📚</span>
            </div>
            {skillset ? 'Edit Skillset' : 'Add New Skillset'}
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            Track your progress in learning and mastering new skills.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-6 py-6">
          <div className="grid gap-3">
            <label htmlFor="name" className="text-sm font-semibold text-white">Skill Name</label>
            <Input
              id="name"
              placeholder="e.g., JavaScript, UI/UX Design, Public Speaking"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-slate-800/50 border-white/10 text-white placeholder:text-slate-400 focus:border-orange-500/50 focus:ring-orange-500/20"
            />
          </div>
          
          <div className="grid gap-3">
            <label htmlFor="category" className="text-sm font-semibold text-white">Category</label>
            <Select 
              value={category} 
              onValueChange={(value: string) => setCategory(value as SkillsetCategory)}
            >
              <SelectTrigger className="bg-slate-800/50 border-white/10 text-white focus:border-orange-500/50 focus:ring-orange-500/20">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-white/10">
                {skillsetCategories.map((cat) => (
                  <SelectItem key={cat} value={cat} className="text-white hover:bg-slate-700 focus:bg-slate-700">{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid gap-3">
            <label htmlFor="description" className="text-sm font-semibold text-white">Description</label>
            <Textarea
              id="description"
              placeholder="Brief description of this skill"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-slate-800/50 border-white/10 text-white placeholder:text-slate-400 focus:border-orange-500/50 focus:ring-orange-500/20 min-h-[80px]"
            />
          </div>
          
          <div className="grid gap-3">
            <div className="flex justify-between items-center">
              <label htmlFor="mastery" className="text-sm font-semibold text-white">Mastery Level</label>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-orange-500">{mastery}%</span>
              </div>
            </div>
            <div className="px-2">
              <Slider 
                value={[mastery]} 
                onValueChange={(values) => setMastery(values[0])} 
                min={0} 
                max={100} 
                step={1}
                className="w-full"
              />
            </div>
            <div className="flex justify-between text-xs text-slate-400 px-2">
              <span>Beginner</span>
              <span>Intermediate</span>
              <span>Expert</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-3">
              <label htmlFor="lastPracticed" className="text-sm font-semibold text-white">Last Practiced</label>
              <Input
                id="lastPracticed"
                type="date"
                value={lastPracticed}
                onChange={(e) => setLastPracticed(e.target.value)}
                className="bg-slate-800/50 border-white/10 text-white focus:border-orange-500/50 focus:ring-orange-500/20"
              />
            </div>
            
            <div className="grid gap-3">
              <label htmlFor="resourceCount" className="text-sm font-semibold text-white">Resource Count</label>
              <Input
                id="resourceCount"
                type="number"
                value={resourceCount}
                onChange={(e) => setResourceCount(parseInt(e.target.value) || 0)}
                min={0}
                className="bg-slate-800/50 border-white/10 text-white focus:border-orange-500/50 focus:ring-orange-500/20"
              />
            </div>
          </div>
          
          <div className="grid gap-3">
            <label className="text-sm font-semibold text-white">Skill Color</label>
            <div className="flex items-center gap-3">
              <div 
                className="w-12 h-12 rounded-xl cursor-pointer border-2 border-white/20 hover:border-orange-500/50 transition-colors shadow-lg"
                style={{ backgroundColor: color }}
                onClick={() => setShowColorPicker(!showColorPicker)}
              />
              <Input
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="font-mono bg-slate-800/50 border-white/10 text-white focus:border-orange-500/50 focus:ring-orange-500/20"
                placeholder="#FF6500"
              />
            </div>
            {showColorPicker && (
              <div className="mt-3 p-4 border border-white/10 rounded-xl bg-slate-800/50 backdrop-blur-sm">
                <HexColorPicker color={color} onChange={setColor} />
              </div>
            )}
          </div>
        </div>
        
        <DialogFooter className="border-t border-white/10 pt-4 gap-3">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            className="border-white/20 text-slate-300 hover:bg-slate-800/50 hover:text-white"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
            className="bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600 shadow-lg"
          >
            {skillset ? 'Update Skillset' : 'Create Skillset'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
