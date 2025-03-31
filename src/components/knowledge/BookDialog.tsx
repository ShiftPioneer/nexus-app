
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Book, ReadingStatus } from "@/types/knowledge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Upload, X, Image } from "lucide-react";
import { cn } from "@/lib/utils";

export interface BookDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (book: Book) => void;
  book: Book | null;
  coverImage: string | null;
  onCoverImageChange: (url: string | null) => void;
}

export function BookDialog({ open, onOpenChange, onSave, book, coverImage, onCoverImageChange }: BookDialogProps) {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");
  const [readingStatus, setReadingStatus] = useState<ReadingStatus>("Not Yet Read");
  const [rating, setRating] = useState<number>(0);
  const [relatedSkillsets, setRelatedSkillsets] = useState<string[]>([]);
  const [skillsetInput, setSkillsetInput] = useState("");
  const [summary, setSummary] = useState("");
  const [keyLessons, setKeyLessons] = useState("");
  
  useEffect(() => {
    if (book) {
      setTitle(book.title);
      setAuthor(book.author);
      setDescription(book.description || "");
      setReadingStatus(book.readingStatus);
      setRating(book.rating);
      setRelatedSkillsets(book.relatedSkillsets || []);
      setSummary(book.summary || "");
      setKeyLessons(book.keyLessons || "");
    } else {
      resetForm();
    }
  }, [book]);
  
  const resetForm = () => {
    setTitle("");
    setAuthor("");
    setDescription("");
    setReadingStatus("Not Yet Read");
    setRating(0);
    setRelatedSkillsets([]);
    setSkillsetInput("");
    setSummary("");
    setKeyLessons("");
    onCoverImageChange(null);
  };
  
  const handleAddSkillset = () => {
    if (skillsetInput && !relatedSkillsets.includes(skillsetInput)) {
      setRelatedSkillsets([...relatedSkillsets, skillsetInput]);
      setSkillsetInput("");
    }
  };
  
  const handleRemoveSkillset = (skillset: string) => {
    setRelatedSkillsets(relatedSkillsets.filter(s => s !== skillset));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newBook: Book = {
      id: book?.id || Date.now().toString(),
      title,
      author,
      readingStatus,
      rating,
      description,
      relatedSkillsets,
      summary,
      keyLessons,
      coverImage: coverImage || undefined
    };
    
    onSave(newBook);
  };
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      // In a real app, we would upload this to a server and get a URL back
      // For now, we'll create an object URL
      const imageUrl = URL.createObjectURL(file);
      onCoverImageChange(imageUrl);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{book ? "Edit Book" : "Add New Book"}</DialogTitle>
          <DialogDescription>
            Add details about the book you're reading or have read.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Book Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter book title"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="author">Author</Label>
                <Input
                  id="author"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="Enter author name"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief description of the book"
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="reading-status">Reading Status</Label>
                <Select value={readingStatus} onValueChange={(value: ReadingStatus) => setReadingStatus(value)}>
                  <SelectTrigger id="reading-status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Reading Now">Reading Now</SelectItem>
                    <SelectItem value="Not Yet Read">Not Yet Read</SelectItem>
                    <SelectItem value="Finished">Finished</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="rating">Rating (0-5)</Label>
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Button
                      key={star}
                      type="button"
                      variant="ghost"
                      size="sm"
                      className={`p-0 w-8 h-8 ${rating >= star ? 'text-yellow-400' : 'text-gray-300'}`}
                      onClick={() => setRating(star)}
                    >
                      ★
                    </Button>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Book Cover</Label>
                <div className="border-2 border-dashed rounded-md p-4 flex flex-col items-center justify-center">
                  {coverImage ? (
                    <div className="relative">
                      <img 
                        src={coverImage} 
                        alt="Book cover"
                        className="max-h-44 object-contain rounded"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute top-0 right-0 rounded-full p-1 h-auto"
                        onClick={() => onCoverImageChange(null)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <>
                      <Image className="h-10 w-10 text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground mb-2">Upload book cover</p>
                      <Label
                        htmlFor="cover-upload"
                        className="cursor-pointer inline-flex items-center gap-2 px-3 py-1.5 bg-primary/90 text-primary-foreground rounded-md hover:bg-primary text-sm"
                      >
                        <Upload className="h-4 w-4" />
                        <span>Choose file</span>
                        <Input
                          id="cover-upload"
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="sr-only"
                        />
                      </Label>
                    </>
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Related Skillsets</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    value={skillsetInput}
                    onChange={(e) => setSkillsetInput(e.target.value)}
                    placeholder="e.g., Web Development"
                    className="flex-1"
                  />
                  <Button 
                    type="button" 
                    onClick={handleAddSkillset}
                    variant="outline"
                  >
                    Add
                  </Button>
                </div>
                
                <div className="flex flex-wrap gap-2 mt-2">
                  {relatedSkillsets.map((skillset) => (
                    <div 
                      key={skillset}
                      className="bg-orange-100 text-orange-800 px-2 py-1 rounded-md flex items-center gap-1 text-sm"
                    >
                      {skillset}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0"
                        onClick={() => handleRemoveSkillset(skillset)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="summary">Summary</Label>
                <Textarea
                  id="summary"
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder="Brief summary of what the book is about"
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="key-lessons">Key Lessons</Label>
                <Textarea
                  id="key-lessons"
                  value={keyLessons}
                  onChange={(e) => setKeyLessons(e.target.value)}
                  placeholder="Main takeaways from the book"
                  rows={3}
                />
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!title || !author}>
              {book ? 'Update Book' : 'Add Book'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
