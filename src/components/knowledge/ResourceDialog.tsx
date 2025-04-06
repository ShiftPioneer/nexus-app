
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
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{resource ? 'Edit Resource' : 'Add New Resource'}</DialogTitle>
          <DialogDescription>
            Add a new resource to help you develop your skills.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label htmlFor="name" className="text-sm font-medium">Resource Name</label>
            <Input
              id="name"
              placeholder="e.g., JavaScript Course, Design Article, etc."
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <label htmlFor="type" className="text-sm font-medium">Resource Type</label>
              <Select value={type} onValueChange={(value) => setType(value as ResourceType)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {resourceTypes.map((resourceType) => (
                    <SelectItem key={resourceType} value={resourceType}>{resourceType}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <label htmlFor="link" className="text-sm font-medium">Link</label>
              <Input
                id="link"
                placeholder="https://..."
                value={link}
                onChange={(e) => setLink(e.target.value)}
              />
            </div>
          </div>
          
          <div className="grid gap-2">
            <label htmlFor="description" className="text-sm font-medium">Description</label>
            <Textarea
              id="description"
              placeholder="Brief description of this resource"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          
          <div className="grid gap-2">
            <label htmlFor="skillsets" className="text-sm font-medium">Related Skillsets</label>
            <Input
              id="skillsets"
              placeholder="e.g., JavaScript, Design (comma separated)"
              value={relatedSkillsets}
              onChange={(e) => setRelatedSkillsets(e.target.value)}
            />
          </div>
          
          <div className="grid gap-2">
            <label className="text-sm font-medium">Upload File or Image</label>
            <div className="border border-dashed rounded-md p-6 flex flex-col items-center justify-center text-center">
              <Upload className="h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">Click to upload file or image</p>
              <Button
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={handleImageUpload}
              >
                Select File
              </Button>
            </div>
          </div>
          
          <div className="grid gap-2">
            <label htmlFor="notes" className="text-sm font-medium">Notes</label>
            <Textarea
              id="notes"
              placeholder="Your personal notes about this resource"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Resource
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
