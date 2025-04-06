
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pin, PinOff, Clock } from "lucide-react";
import { useKnowledge } from "@/contexts/KnowledgeContext";
import { Note } from "@/types/knowledge";

export function NotesTab() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filterTag, setFilterTag] = useState<string>("all");
  const { notes, togglePinNote } = useKnowledge();
  
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
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {filteredNotes.length === 0 ? (
        <div className="col-span-full text-center p-12 border-2 border-dashed rounded-lg">
          <h3 className="text-xl font-medium mb-2">No notes found</h3>
          <p className="text-muted-foreground mb-6">
            {searchQuery || filterTag !== "all" 
              ? "Try adjusting your search or filters" 
              : "Create your first note to get started"}
          </p>
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
  );
}
