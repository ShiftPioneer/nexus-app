
import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Resource, ResourceType } from "@/types/knowledge";
import { Upload } from "lucide-react";

interface ResourceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (resource: Resource) => void;
  resource: Resource | null;
}

const resourceTypes: ResourceType[] = [
  'YouTube',
  'Social Media',
  'Online Course',
  'Book',
  'Article',
  'Website',
  'Other'
];

export function ResourceDialog({ open, onOpenChange, onSave, resource }: ResourceDialogProps) {
  const [name, setName] = useState('');
  const [type, setType] = useState<ResourceType>('YouTube');
  const [description, setDescription] = useState('');
  const [link, setLink] = useState('');
  const [relatedSkillsets, setRelatedSkillsets] = useState('');
  const [notes, setNotes] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  
  useEffect(() => {
    if (resource) {
      setName(resource.name);
      setType(resource.type);
      setDescription(resource.description || '');
      setLink(resource.link);
      setRelatedSkillsets(resource.relatedSkillsets.join(', '));
      setNotes(resource.notes || '');
      setImageUrl(resource.imageUrl || '');
    } else {
      setName('');
      setType('YouTube');
      setDescription('');
      setLink('');
      setRelatedSkillsets('');
      setNotes('');
      setImageUrl('');
    }
  }, [resource, open]);

  const handleSave = () => {
    const newResource: Resource = {
      id: resource?.id || '',
      name,
      type,
      description,
      link,
      relatedSkillsets: relatedSkillsets.split(',').map(s => s.trim()).filter(Boolean),
      notes,
      imageUrl: imageUrl || undefined
    };
    onSave(newResource);
  };

  // Mock function for image upload (in a real app, this would upload to a server)
  const handleImageUpload = () => {
    // This would be replaced with actual file upload logic
    alert('Image upload feature would go here');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto bg-slate-900/95 border border-white/10 backdrop-blur-sm">
        <DialogHeader className="border-b border-white/10 pb-4">
          <DialogTitle className="text-2xl font-bold text-white flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg">
              <span className="text-white font-bold">📎</span>
            </div>
            {resource ? 'Edit Resource' : 'Add New Resource'}
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            Add a new resource to help you develop your skills.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-6 py-6">
          <div className="grid gap-3">
            <label htmlFor="name" className="text-sm font-semibold text-white">Resource Name</label>
            <Input
              id="name"
              placeholder="e.g., JavaScript Course, Design Article, etc."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-slate-800/50 border-white/10 text-white placeholder:text-slate-400 focus:border-blue-500/50 focus:ring-blue-500/20"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-3">
              <label htmlFor="type" className="text-sm font-semibold text-white">Resource Type</label>
              <Select value={type} onValueChange={(value) => setType(value as ResourceType)}>
                <SelectTrigger className="bg-slate-800/50 border-white/10 text-white focus:border-blue-500/50 focus:ring-blue-500/20">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-white/10">
                  {resourceTypes.map((resourceType) => (
                    <SelectItem key={resourceType} value={resourceType} className="text-white hover:bg-slate-700 focus:bg-slate-700">{resourceType}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-3">
              <label htmlFor="link" className="text-sm font-semibold text-white">Link</label>
              <Input
                id="link"
                placeholder="https://..."
                value={link}
                onChange={(e) => setLink(e.target.value)}
                className="bg-slate-800/50 border-white/10 text-white placeholder:text-slate-400 focus:border-blue-500/50 focus:ring-blue-500/20"
              />
            </div>
          </div>
          
          <div className="grid gap-3">
            <label htmlFor="description" className="text-sm font-semibold text-white">Description</label>
            <Textarea
              id="description"
              placeholder="Brief description of this resource"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-slate-800/50 border-white/10 text-white placeholder:text-slate-400 focus:border-blue-500/50 focus:ring-blue-500/20 min-h-[80px]"
            />
          </div>
          
          <div className="grid gap-3">
            <label htmlFor="skillsets" className="text-sm font-semibold text-white">Related Skillsets</label>
            <Input
              id="skillsets"
              placeholder="e.g., JavaScript, Design (comma separated)"
              value={relatedSkillsets}
              onChange={(e) => setRelatedSkillsets(e.target.value)}
              className="bg-slate-800/50 border-white/10 text-white placeholder:text-slate-400 focus:border-blue-500/50 focus:ring-blue-500/20"
            />
          </div>
          
          <div className="grid gap-3">
            <label className="text-sm font-semibold text-white">Upload File or Image</label>
            <div className="border-2 border-dashed border-white/20 rounded-xl p-8 flex flex-col items-center justify-center text-center bg-slate-800/30 hover:bg-slate-800/50 transition-colors">
              <Upload className="h-10 w-10 text-slate-400 mb-3" />
              <p className="text-sm text-slate-300 mb-2">Click to upload file or image</p>
              <p className="text-xs text-slate-500 mb-4">Supports PDF, images, videos</p>
              <Button
                variant="outline"
                size="sm"
                onClick={handleImageUpload}
                className="border-white/20 text-slate-300 hover:bg-slate-700/50 hover:text-white"
              >
                Select File
              </Button>
            </div>
          </div>
          
          <div className="grid gap-3">
            <label htmlFor="notes" className="text-sm font-semibold text-white">Notes</label>
            <Textarea
              id="notes"
              placeholder="Your personal notes about this resource"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="bg-slate-800/50 border-white/10 text-white placeholder:text-slate-400 focus:border-blue-500/50 focus:ring-blue-500/20 min-h-[100px]"
            />
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
            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 shadow-lg"
          >
            {resource ? 'Update Resource' : 'Create Resource'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
