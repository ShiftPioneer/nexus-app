
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pin, PinOff, Clock, Plus, Image } from "lucide-react";
import { useKnowledge } from "@/contexts/KnowledgeContext";
import { Note } from "@/types/knowledge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

export function NotesTab() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filterTag, setFilterTag] = useState<string>("all");
  const { notes, addNote, togglePinNote } = useKnowledge();
  const { toast } = useToast();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newNoteTitle, setNewNoteTitle] = useState("");
  const [newNoteContent, setNewNoteContent] = useState("");
  const [newNoteTags, setNewNoteTags] = useState("");
  const [newNoteImage, setNewNoteImage] = useState("");
  
  const filteredNotes = notes
    .filter(note => {
      const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           note.content.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTag = filterTag === "all" || note.tags.includes(filterTag);
      return matchesSearch && matchesTag;
    })
    .sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
    });
  
  const handleAddNote = () => {
    if (!newNoteTitle || !newNoteContent) {
      toast({
        title: "Missing information",
        description: "Please provide both title and content for your note",
        variant: "destructive"
      });
      return;
    }
    
    const tags = newNoteTags.split(",").map(tag => tag.trim()).filter(Boolean);
    
    const newNote: Omit<Note, "id"> = {
      title: newNoteTitle,
      content: newNoteContent,
      tags,
      lastUpdated: new Date(),
      image: newNoteImage || undefined
    };
    
    addNote(newNote);
    
    setNewNoteTitle("");
    setNewNoteContent("");
    setNewNoteTags("");
    setNewNoteImage("");
    setIsDialogOpen(false);
    
    toast({
      title: "Note created",
      description: "Your note has been successfully added"
    });
  };
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setNewNoteImage(event.target.result.toString());
        }
      };
      reader.readAsDataURL(file);
    }
  };
  
  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Your Notes</h2>
        <Button onClick={() => setIsDialogOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Note
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredNotes.length === 0 ? (
          <div className="col-span-full text-center p-12 border-2 border-dashed rounded-lg">
            <h3 className="text-xl font-medium mb-2">No notes found</h3>
            <p className="text-muted-foreground mb-6">
              {searchQuery || filterTag !== "all" 
                ? "Try adjusting your search or filters" 
                : "Create your first note to get started"}
            </p>
            <Button onClick={() => setIsDialogOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Create Note
            </Button>
          </div>
        ) : (
          filteredNotes.map(note => (
            <Card key={note.id} className="group hover:shadow-md transition-all">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="flex-1">{note.title}</CardTitle>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => togglePinNote(note.id)}
                  >
                    {note.pinned ? (
                      <Pin className="h-4 w-4 text-primary" fill="currentColor" />
                    ) : (
                      <PinOff className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
                <CardDescription className="flex items-center gap-2">
                  <Clock className="h-3 w-3" />
                  {new Date(note.lastUpdated).toLocaleDateString()}
                  {note.pinned && (
                    <Badge variant="outline" className="bg-primary/10 text-primary text-xs">
                      <Pin className="h-3 w-3 mr-1" /> Pinned
                    </Badge>
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {note.image && (
                  <div className="mb-3 w-full h-32 rounded overflow-hidden">
                    <img 
                      src={note.image} 
                      alt="Note attachment" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <p className="text-sm line-clamp-3 mb-3">{note.content}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {note.tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create New Note</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input 
                id="title" 
                placeholder="Note title"
                value={newNoteTitle}
                onChange={(e) => setNewNoteTitle(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="content">Content</Label>
              <Textarea 
                id="content" 
                placeholder="Note content"
                className="min-h-[200px]"
                value={newNoteContent}
                onChange={(e) => setNewNoteContent(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="tags">Tags (comma separated)</Label>
              <Input 
                id="tags" 
                placeholder="productivity, ideas, project"
                value={newNoteTags}
                onChange={(e) => setNewNoteTags(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="image">Add Image</Label>
              <div className="flex items-center gap-2">
                <Input 
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
                {newNoteImage && (
                  <div className="w-12 h-12 rounded overflow-hidden border flex-shrink-0">
                    <img 
                      src={newNoteImage} 
                      alt="Note attachment preview" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={handleAddNote}>
              Create Note
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
