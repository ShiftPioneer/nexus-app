import React, { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Skillset, SkillsetCategory } from "@/types/knowledge";
import { HexColorPicker } from "react-colorful";
import { ColorSwatch } from "@/components/ui/color-swatch";

interface SkillsetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (skillset: Skillset) => void;
  skillset?: Skillset;
}

export function SkillsetDialog({ 
  open, 
  onOpenChange, 
  onSave, 
  skillset 
}: SkillsetDialogProps) {
  const [skillsetName, setSkillsetName] = useState(skillset?.name || "");
  const [description, setDescription] = useState(skillset?.description || "");
  const [category, setCategory] = useState(skillset?.category || "technical");
  const [mastery, setMastery] = useState(skillset?.mastery || 0);
  const [lastPracticed, setLastPracticed] = useState(skillset?.lastPracticed || new Date());
  const [resourceCount, setResourceCount] = useState(skillset?.resourceCount || 0);
  const [color, setColor] = useState(skillset?.color || "#ffffff");
  
  const handleSave = () => {
    if (!skillsetName) return;
    
    const newSkillset: Skillset = {
      id: skillset?.id || Date.now().toString(),
      name: skillsetName,
      description: description,
      category: category as SkillsetCategory,
      // Ensure proficiency is set to a default value if not provided
      proficiency: mastery || 0,
      mastery: mastery,
      lastPracticed: lastPracticed || new Date(),
      resourceCount: resourceCount || 0,
      color: color
    };
    
    onSave(newSkillset);
    onOpenChange(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{skillset ? "Edit Skillset" : "Add New Skillset"}</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input 
              id="name" 
              value={skillsetName} 
              onChange={(e) => setSkillsetName(e.target.value)} 
              className="col-span-3" 
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Textarea 
              id="description" 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              className="col-span-3" 
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="category" className="text-right">
              Category
            </Label>
            <Select value={category} onValueChange={(value) => setCategory(value)}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="technical">Technical</SelectItem>
                <SelectItem value="creative">Creative</SelectItem>
                <SelectItem value="soft">Soft Skills</SelectItem>
                <SelectItem value="language">Language</SelectItem>
                <SelectItem value="business">Business</SelectItem>
                <SelectItem value="other">Other</SelectItem>
                <SelectItem value="Programming">Programming</SelectItem>
                <SelectItem value="Design">Design</SelectItem>
                <SelectItem value="Analytics">Analytics</SelectItem>
                <SelectItem value="Soft Skills">Soft Skills</SelectItem>
                <SelectItem value="Language">Language</SelectItem>
                <SelectItem value="Music">Music</SelectItem>
                <SelectItem value="Sport">Sport</SelectItem>
                <SelectItem value="Art">Art</SelectItem>
                <SelectItem value="Business">Business</SelectItem>
                <SelectItem value="Religion">Religion</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="mastery" className="text-right">
              Mastery
            </Label>
            <Slider
              id="mastery"
              defaultValue={[mastery]}
              max={100}
              step={1}
              onValueChange={(value) => setMastery(value[0])}
              className="col-span-3"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">
              Color
            </Label>
            <div className="col-span-3 flex items-center">
              <HexColorPicker color={color} onChange={setColor} />
              <ColorSwatch color={color} />
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="submit" onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
