
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { KnowledgeEntry, KnowledgeCategory } from "@/types/knowledge";
import { Trash, FolderMove, Paperclip, ExternalLink } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface EntryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  entry: KnowledgeEntry | null;
  onSave: (entry: Omit<KnowledgeEntry, "id">) => void;
  onDelete?: (entryId: string) => void;
  onMove?: (entryId: string, category: KnowledgeCategory) => void;
  editMode?: boolean;
}

export function EntryDialog({ 
  open, 
  onOpenChange, 
  entry, 
  onSave, 
  onDelete,
  onMove,
  editMode = false
}: EntryDialogProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState<KnowledgeCategory>("inbox");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [url, setUrl] = useState("");
  const [attachment, setAttachment] = useState<{
    name: string;
    url: string;
    type: string;
  } | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [moveDialogOpen, setMoveDialogOpen] = useState(false);
  
  useEffect(() => {
    if (entry) {
      setTitle(entry.title);
      setContent(entry.content);
      setCategory(entry.category);
      setTags(entry.tags);
      setUrl(entry.url || "");
      setAttachment(entry.fileAttachment || null);
    } else {
      resetForm();
    }
  }, [entry, open]);
  
  const resetForm = () => {
    setTitle("");
    setContent("");
    setCategory("inbox");
    setTags([]);
    setTagInput("");
    setUrl("");
    setAttachment(null);
  };
  
  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };
  
  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };
  
  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };
  
  const handleSave = () => {
    if (!title) return;
    
    const newEntry: Omit<KnowledgeEntry, "id"> = {
      title,
      content,
      category,
      tags,
      createdAt: entry?.createdAt || new Date(),
      updatedAt: new Date(),
      url: url || undefined,
      fileAttachment: attachment || undefined,
      pinned: entry?.pinned || false,
      linkedTaskIds: entry?.linkedTaskIds || [],
      aiSummary: entry?.aiSummary
    };
    
    onSave(newEntry);
    resetForm();
  };
  
  const handleDelete = () => {
    if (entry && onDelete) {
      onDelete(entry.id);
      setDeleteDialogOpen(false);
      onOpenChange(false);
    }
  };
  
  const handleMove = (newCategory: KnowledgeCategory) => {
    if (entry && onMove) {
      onMove(entry.id, newCategory);
      setMoveDialogOpen(false);
    }
  };
  
  const handleAttachmentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // This is a mock function - in a real application, you'd upload the file to storage
      // and get back a URL
      const mockUploadFile = (file: File) => {
        return {
          name: file.name,
          url: URL.createObjectURL(file), // This will create a temporary URL
          type: file.type
        };
      };
      
      setAttachment(mockUploadFile(file));
    }
  };
  
  const handleRemoveAttachment = () => {
    setAttachment(null);
  };
  
  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[625px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editMode ? "Edit Entry" : "Create New Entry"}</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Entry title"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="category">Category</Label>
              <Select value={category} onValueChange={(value) => setCategory(value as KnowledgeCategory)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="inbox">Inbox</SelectItem>
                  <SelectItem value="projects">Projects</SelectItem>
                  <SelectItem value="areas">Areas</SelectItem>
                  <SelectItem value="resources">Resources</SelectItem>
                  <SelectItem value="archives">Archives</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your thoughts, ideas, or notes here..."
                className="min-h-[200px]"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="url">URL (optional)</Label>
              <div className="flex gap-2">
                <Input
                  id="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com"
                  type="url"
                />
                {url && (
                  <a 
                    href={url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center px-3 bg-gray-100 rounded-md hover:bg-gray-200"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                )}
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="tags">Tags</Label>
              <div className="flex gap-2">
                <Input
                  id="tags"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagInputKeyDown}
                  placeholder="Add a tag and press Enter"
                />
                <Button type="button" variant="outline" onClick={handleAddTag}>
                  Add
                </Button>
              </div>
              
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {tags.map(tag => (
                    <span 
                      key={tag} 
                      className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm flex items-center"
                    >
                      #{tag}
                      <button 
                        type="button" 
                        className="ml-1 text-gray-500 hover:text-gray-700"
                        onClick={() => handleRemoveTag(tag)}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
            
            <div className="grid gap-2">
              <Label>Attachment</Label>
              {attachment ? (
                <div className="flex items-center justify-between bg-gray-50 p-2 rounded">
                  <div className="flex items-center">
                    <Paperclip className="h-4 w-4 mr-2" />
                    <span className="text-sm truncate max-w-[300px]">{attachment.name}</span>
                  </div>
                  <Button variant="ghost" size="sm" onClick={handleRemoveAttachment}>
                    Remove
                  </Button>
                </div>
              ) : (
                <div className="flex items-center">
                  <Input
                    type="file"
                    id="attachment"
                    className="hidden"
                    onChange={handleAttachmentUpload}
                  />
                  <Label htmlFor="attachment" className="cursor-pointer flex items-center gap-2 text-sm border rounded p-2">
                    <Paperclip className="h-4 w-4" />
                    Attach a file
                  </Label>
                </div>
              )}
            </div>
          </div>
          
          <DialogFooter className="flex justify-between">
            <div className="flex gap-2">
              {editMode && entry && (
                <>
                  <Popover open={moveDialogOpen} onOpenChange={setMoveDialogOpen}>
                    <PopoverTrigger asChild>
                      <Button variant="outline" size="sm">
                        <FolderMove className="h-4 w-4 mr-2" />
                        Move
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                      <div className="p-2">
                        <p className="text-sm font-medium mb-2">Move to category:</p>
                        <div className="space-y-1">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="w-full justify-start" 
                            onClick={() => handleMove("inbox")}
                          >
                            Inbox
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="w-full justify-start" 
                            onClick={() => handleMove("projects")}
                          >
                            Projects
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="w-full justify-start" 
                            onClick={() => handleMove("areas")}
                          >
                            Areas
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="w-full justify-start" 
                            onClick={() => handleMove("resources")}
                          >
                            Resources
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="w-full justify-start" 
                            onClick={() => handleMove("archives")}
                          >
                            Archives
                          </Button>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                  
                  <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm" className="text-destructive">
                        <Trash className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Entry</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete this entry? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </>
              )}
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave}>
                {editMode ? "Save Changes" : "Create Entry"}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
