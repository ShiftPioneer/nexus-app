
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Book, ReadingStatus } from "@/types/knowledge";

export interface BookDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (book: Book) => void;
  book: Book | null;
  coverImage?: string | null;
  onCoverImageChange?: (coverImage: string | null) => void;
}

export function BookDialog({ 
  open, 
  onOpenChange, 
  onSave, 
  book,
  coverImage: initialCoverImage = null,
  onCoverImageChange
}: BookDialogProps) {
  const [title, setTitle] = useState(book?.title || "");
  const [author, setAuthor] = useState(book?.author || "");
  const [description, setDescription] = useState(book?.description || "");
  const [readingStatus, setReadingStatus] = useState<ReadingStatus>(book?.readingStatus || "Not Yet Read");
  const [tags, setTags] = useState(book?.tags?.join(", ") || "");
  const [rating, setRating] = useState(book?.rating?.toString() || "0");
  const [coverImage, setCoverImage] = useState(initialCoverImage || book?.coverImage || "");
  const [summary, setSummary] = useState(book?.summary || "");
  const [keyLessons, setKeyLessons] = useState(book?.keyLessons || "");
  const [skillsets, setSkillsets] = useState(book?.relatedSkillsets?.join(", ") || "");
  
  const handleSave = () => {
    if (!title || !author) {
      // Show an error message
      return;
    }
    
    const newBook: Book = {
      id: book?.id || Date.now().toString(),
      title,
      author,
      description,
      readingStatus,
      tags: tags.split(",").map(tag => tag.trim()).filter(Boolean),
      rating: parseInt(rating) || 0,
      coverImage: coverImage || undefined,
      summary,
      keyLessons,
      relatedSkillsets: skillsets.split(",").map(s => s.trim()).filter(Boolean),
      dateAdded: book?.dateAdded || new Date(),
      dateCompleted: readingStatus === "Finished" ? (book?.dateCompleted || new Date()) : undefined
    };
    
    onSave(newBook);
  };
  
  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setCoverImage(imageUrl);
      if (onCoverImageChange) {
        onCoverImageChange(imageUrl);
      }
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{book ? 'Edit Book' : 'Add New Book'}</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Book title"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="author">Author</Label>
              <Input
                id="author"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Author name"
              />
            </div>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="A brief description of the book"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="status">Reading Status</Label>
              <Select value={readingStatus} onValueChange={(value) => setReadingStatus(value as ReadingStatus)}>
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Not Yet Read">Not Yet Read</SelectItem>
                  <SelectItem value="Reading Now">Reading Now</SelectItem>
                  <SelectItem value="Finished">Finished</SelectItem>
                  <SelectItem value="abandoned">Abandoned</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="rating">Rating (0-5)</Label>
              <Input
                type="number"
                id="rating"
                min="0"
                max="5"
                value={rating}
                onChange={(e) => setRating(e.target.value)}
              />
            </div>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="tags">Tags (comma separated)</Label>
            <Input
              id="tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="fiction, science, history"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="skillsets">Related Skillsets (comma separated)</Label>
            <Input
              id="skillsets"
              value={skillsets}
              onChange={(e) => setSkillsets(e.target.value)}
              placeholder="Programming, Design, Psychology"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="cover">Cover Image</Label>
            <Input
              type="file"
              id="cover"
              accept="image/*"
              onChange={handleCoverImageChange}
              className="hidden"
            />
            <div className="flex items-center gap-4">
              {coverImage && (
                <div className="relative w-24 h-36 bg-gray-100 rounded overflow-hidden">
                  <img src={coverImage} alt="Book cover" className="w-full h-full object-cover" />
                </div>
              )}
              <Label htmlFor="cover" className="cursor-pointer bg-muted hover:bg-muted/90 text-sm px-4 py-2 rounded">
                {coverImage ? "Change Cover" : "Upload Cover"}
              </Label>
            </div>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="summary">Summary</Label>
            <Textarea
              id="summary"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="A brief summary of the book's content"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="keyLessons">Key Lessons</Label>
            <Textarea
              id="keyLessons"
              value={keyLessons}
              onChange={(e) => setKeyLessons(e.target.value)}
              placeholder="Important takeaways from the book"
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
