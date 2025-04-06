
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X, Upload, Link as LinkIcon, FileText, ExternalLink, Circle, CheckCircle } from "lucide-react";
import { KnowledgeCategory, KnowledgeEntry } from "@/types/knowledge";

interface EntryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (entry: KnowledgeEntry) => void;
  entry?: KnowledgeEntry | null;
  defaultCategory?: KnowledgeCategory;
  isEditMode?: boolean;
}

export function EntryDialog({
  open,
  onOpenChange,
  onSave,
  entry = null,
  defaultCategory = "inbox",
  isEditMode = false
}: EntryDialogProps) {
  const [title, setTitle] = useState(entry?.title || "");
  const [content, setContent] = useState(entry?.content || "");
  const [category, setCategory] = useState<KnowledgeCategory>(entry?.category || defaultCategory);
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>(entry?.tags || []);
  const [url, setUrl] = useState(entry?.url || "");
  const [fileAttachment, setFileAttachment] = useState<{ name: string; url: string; type: string } | null>(
    entry?.fileAttachment || null
  );
  
  const categoryOptions: KnowledgeCategory[] = [
    "inbox",
    "projects",
    "areas",
    "resources",
    "note",
    "concept",
    "idea",
    "question",
    "insight",
    "summary",
    "archives"
  ];
  
  const handleAddTag = () => {
    const newTags = tagInput
      .split(",")
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0 && !tags.includes(tag));
    
    if (newTags.length > 0) {
      setTags([...tags, ...newTags]);
      setTagInput("");
    }
  };
  
  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      handleAddTag();
    }
  };
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, this would upload to a server. Here we're just creating a local URL.
      const fileObject = {
        name: file.name,
        type: file.type,
        url: URL.createObjectURL(file)
      };
      setFileAttachment(fileObject);
    }
  };
  
  const handleRemoveAttachment = () => {
    setFileAttachment(null);
  };
  
  const handleSave = () => {
    if (!title || !content) {
      // In a real app, show an error message
      return;
    }
    
    const newEntry: KnowledgeEntry = {
      id: entry?.id || Date.now().toString(),
      title,
      content,
      category,
      tags,
      createdAt: entry?.createdAt || new Date(),
      updatedAt: new Date(),
      pinned: entry?.pinned || false,
      url: url || undefined,
      fileAttachment: fileAttachment || undefined,
      linkedTaskIds: entry?.linkedTaskIds || [],
      aiSummary: entry?.aiSummary || undefined
    };
    
    onSave(newEntry);
    onOpenChange(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Edit Entry' : 'Add Knowledge Entry'}</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter a title for your entry"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your content here..."
              className="min-h-[150px]"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={(value) => setCategory(value as KnowledgeCategory)}>
              <SelectTrigger id="category">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categoryOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="tags">Tags</Label>
            <div className="flex gap-2">
              <Input
                id="tags"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Add tags (comma separated)"
                className="flex-grow"
              />
              <Button type="button" onClick={handleAddTag} variant="secondary">
                Add
              </Button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="pl-2 flex items-center gap-1">
                    <span>{tag}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-5 w-5 p-0 ml-1"
                      onClick={() => handleRemoveTag(tag)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            )}
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="url">URL (optional)</Label>
            <div className="flex gap-2 items-center">
              <LinkIcon className="h-4 w-4 text-muted-foreground" />
              <Input
                id="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com/resource"
                className="flex-grow"
              />
            </div>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="attachment">Attachment (optional)</Label>
            {fileAttachment ? (
              <div className="flex items-center justify-between p-2 border rounded">
                <div className="flex items-center gap-2">
                  {fileAttachment.type.includes("image") ? (
                    <img
                      src={fileAttachment.url}
                      alt="Attachment preview"
                      className="h-10 w-10 object-cover rounded"
                    />
                  ) : fileAttachment.type.includes("pdf") ? (
                    <FileText className="h-10 w-10 text-red-500" />
                  ) : (
                    <ExternalLink className="h-10 w-10 text-blue-500" />
                  )}
                  <div>
                    <p className="text-sm font-medium">{fileAttachment.name}</p>
                    <p className="text-xs text-muted-foreground">{fileAttachment.type}</p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleRemoveAttachment}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="border border-dashed rounded p-4 text-center">
                <Input
                  id="attachment"
                  type="file"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <Label htmlFor="attachment" className="cursor-pointer">
                  <Upload className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm font-medium">Click to upload a file</p>
                  <p className="text-xs text-muted-foreground">
                    PDF, images, and documents allowed
                  </p>
                </Label>
              </div>
            )}
          </div>
        </div>
        
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSave}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
