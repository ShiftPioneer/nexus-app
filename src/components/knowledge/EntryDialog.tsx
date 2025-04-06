
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { KnowledgeCategory, KnowledgeEntry } from "@/types/knowledge";
import { X, Plus, FolderIcon, FileText } from "lucide-react"; 
import { Badge } from "@/components/ui/badge";

interface EntryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (entry: KnowledgeEntry) => void;
  entry?: KnowledgeEntry;
}

export function EntryDialog({ open, onOpenChange, onSave, entry }: EntryDialogProps) {
  const isEditMode = !!entry?.id;
  
  const [title, setTitle] = useState(entry?.title || "");
  const [content, setContent] = useState(entry?.content || "");
  const [category, setCategory] = useState<KnowledgeCategory>(entry?.category || "note");
  const [tags, setTags] = useState<string[]>(entry?.tags || []);
  const [newTag, setNewTag] = useState("");
  const [attachments, setAttachments] = useState<Array<{ name: string; url: string; type: string; }>>(
    entry?.attachments || []
  );
  const [url, setUrl] = useState(entry?.url || "");

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleAddAttachment = () => {
    // In a real app, this would handle file uploads or adding URLs
    const newAttachment = {
      name: `Attachment ${attachments.length + 1}`,
      url: `https://example.com/attachment${attachments.length + 1}`,
      type: "pdf"
    };
    setAttachments([...attachments, newAttachment]);
  };

  const handleRemoveAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const updatedEntry: KnowledgeEntry = {
      id: entry?.id || Date.now().toString(),
      title,
      content,
      category,
      tags,
      dateCreated: entry?.dateCreated || new Date(),
      dateUpdated: new Date(),
      attachments,
      url: category === 'resource' ? url : undefined,
      pinned: entry?.pinned || false
    };
    
    onSave(updatedEntry);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Edit Entry' : 'Create New Entry'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="grid grid-cols-4 gap-4">
            <div className="col-span-4">
              <Label htmlFor="title">Title</Label>
              <Input 
                id="title" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                required 
              />
            </div>
            
            <div className="col-span-4 sm:col-span-1">
              <Label htmlFor="category">Category</Label>
              <Select 
                value={category} 
                onValueChange={(value) => setCategory(value as KnowledgeCategory)}
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="note">Note</SelectItem>
                  <SelectItem value="resource">Resource</SelectItem>
                  <SelectItem value="reference">Reference</SelectItem>
                  <SelectItem value="concept">Concept</SelectItem>
                  <SelectItem value="idea">Idea</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {category === 'resource' && (
              <div className="col-span-4 sm:col-span-3">
                <Label htmlFor="url">URL</Label>
                <Input 
                  id="url" 
                  value={url} 
                  onChange={(e) => setUrl(e.target.value)} 
                  placeholder="https://" 
                />
              </div>
            )}
            
            <div className="col-span-4">
              <Label htmlFor="content">Content</Label>
              <Textarea 
                id="content" 
                value={content} 
                onChange={(e) => setContent(e.target.value)} 
                className="min-h-[200px]" 
              />
            </div>

            <div className="col-span-4">
              <Label htmlFor="tags">Tags</Label>
              <div className="flex gap-2 flex-wrap mb-2">
                {tags.map(tag => (
                  <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                    {tag}
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => handleRemoveTag(tag)} 
                    />
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input 
                  id="tags" 
                  value={newTag} 
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Add a tag" 
                  className="flex-1"
                />
                <Button 
                  type="button" 
                  onClick={handleAddTag} 
                  size="sm" 
                  variant="outline"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="col-span-4">
              <Label>Attachments</Label>
              <div className="space-y-2 mt-2">
                {attachments.map((attachment, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 border rounded-md">
                    {attachment.type === "pdf" ? (
                      <FileText className="h-4 w-4 text-red-500" />
                    ) : (
                      <FolderIcon className="h-4 w-4 text-blue-500" />
                    )}
                    <span className="flex-1 text-sm">{attachment.name}</span>
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleRemoveAttachment(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  onClick={handleAddAttachment} 
                  className="w-full flex items-center gap-1"
                >
                  <Plus className="h-4 w-4" /> Add Attachment
                </Button>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button type="submit">{isEditMode ? 'Update' : 'Create'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
