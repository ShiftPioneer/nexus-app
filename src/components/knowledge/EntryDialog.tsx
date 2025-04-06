
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { KnowledgeEntry, KnowledgeCategory } from "@/types/knowledge";
import { PlusCircle, X } from "lucide-react";

export interface EntryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (entry: KnowledgeEntry) => void;
  entry: KnowledgeEntry | null;
}

export function EntryDialog({ 
  open, 
  onOpenChange, 
  onSave, 
  entry
}: EntryDialogProps) {
  // Default empty entry
  const defaultEntry: KnowledgeEntry = {
    id: "",
    title: "",
    content: "",
    category: "note",
    tags: [],
    createdAt: new Date(),
    attachments: []
  };

  const isNewEntry = !entry?.id;
  const currentEntry = entry || defaultEntry;
  
  const [title, setTitle] = useState(currentEntry.title || "");
  const [content, setContent] = useState(currentEntry.content || "");
  const [category, setCategory] = useState<KnowledgeCategory>(currentEntry.category || "note");
  const [tagsString, setTagsString] = useState((currentEntry.tags || []).join(", "));
  const [url, setUrl] = useState(currentEntry.url || "");
  
  // Update form fields when entry prop changes
  useEffect(() => {
    if (entry) {
      setTitle(entry.title || "");
      setContent(entry.content || "");
      setCategory(entry.category || "note");
      setTagsString((entry.tags || []).join(", "));
      setUrl(entry.url || "");
    }
  }, [entry]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const updatedEntry: KnowledgeEntry = {
      id: currentEntry.id || "",
      title,
      content,
      category,
      tags: tagsString.split(",").map(tag => tag.trim()).filter(tag => tag !== ""),
      createdAt: currentEntry.createdAt || new Date(),
      updatedAt: new Date(),
      pinned: currentEntry.pinned || false,
      url: category === "resource" ? url : undefined
    };
    
    onSave(updatedEntry);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isNewEntry ? "Add New Entry" : "Edit Entry"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input 
                id="title" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                required
              />
            </div>
            
            <div>
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
                  <SelectItem value="concept">Concept</SelectItem>
                  <SelectItem value="idea">Idea</SelectItem>
                  <SelectItem value="question">Question</SelectItem>
                  <SelectItem value="insight">Insight</SelectItem>
                  <SelectItem value="summary">Summary</SelectItem>
                  <SelectItem value="resource">Resource</SelectItem>
                  <SelectItem value="reference">Reference</SelectItem>
                  <SelectItem value="inbox">Inbox</SelectItem>
                  <SelectItem value="projects">Projects</SelectItem>
                  <SelectItem value="areas">Areas</SelectItem>
                  <SelectItem value="archives">Archives</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {category === "resource" && (
              <div>
                <Label htmlFor="url">URL</Label>
                <Input 
                  id="url" 
                  value={url} 
                  onChange={(e) => setUrl(e.target.value)} 
                  placeholder="https://example.com"
                />
              </div>
            )}
            
            <div>
              <Label htmlFor="content">Content</Label>
              <Textarea 
                id="content" 
                value={content} 
                onChange={(e) => setContent(e.target.value)} 
                className="min-h-[200px]"
                placeholder="Enter your thoughts, ideas, or notes here..."
              />
            </div>
            
            <div>
              <Label htmlFor="tags">Tags (comma separated)</Label>
              <Input 
                id="tags" 
                value={tagsString} 
                onChange={(e) => setTagsString(e.target.value)} 
                placeholder="productivity, ideas, work"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button type="submit">{isNewEntry ? "Add Entry" : "Save Changes"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
