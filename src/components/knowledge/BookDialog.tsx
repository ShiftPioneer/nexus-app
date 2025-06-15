
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Star, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface BookDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  book?: any;
  onSave: (book: any) => void;
  onDelete?: (bookId: string) => void;
  coverImage?: string | null;
  onCoverImageChange?: (image: string | null) => void;
}

const BookDialog: React.FC<BookDialogProps> = ({ 
  open, 
  onOpenChange, 
  book, 
  onSave, 
  onDelete,
  coverImage,
  onCoverImageChange 
}) => {
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    category: "",
    readingStatus: "Not Yet Read",
    rating: 0,
    pages: "",
    description: "",
    summary: "",
    keyLessons: "",
    relatedSkillsets: [] as string[],
    dateStarted: "",
    dateCompleted: "",
  });

  const [hoveredStar, setHoveredStar] = useState(0);

  useEffect(() => {
    if (book) {
      setFormData({
        title: book.title || "",
        author: book.author || "",
        category: book.category || "",
        readingStatus: book.readingStatus || "Not Yet Read",
        rating: book.rating || 0,
        pages: book.pages?.toString() || "",
        description: book.description || "",
        summary: book.summary || "",
        keyLessons: book.keyLessons || "",
        relatedSkillsets: book.relatedSkillsets || [],
        dateStarted: book.dateStarted || "",
        dateCompleted: book.dateCompleted || "",
      });
    } else {
      setFormData({
        title: "",
        author: "",
        category: "",
        readingStatus: "Not Yet Read",
        rating: 0,
        pages: "",
        description: "",
        summary: "",
        keyLessons: "",
        relatedSkillsets: [],
        dateStarted: "",
        dateCompleted: "",
      });
    }
  }, [book, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const bookData = {
      ...formData,
      id: book?.id || Date.now().toString(),
      pages: formData.pages ? parseInt(formData.pages) : undefined,
      relatedSkillsets: formData.relatedSkillsets,
      createdAt: book?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSave(bookData);
    onOpenChange(false);
  };

  const handleDelete = () => {
    if (book && onDelete) {
      onDelete(book.id);
      onOpenChange(false);
    }
  };

  const renderStarRating = () => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onMouseEnter={() => setHoveredStar(star)}
            onMouseLeave={() => setHoveredStar(0)}
            onClick={() => setFormData(prev => ({ ...prev, rating: star }))}
            className="focus:outline-none"
          >
            <Star
              className={cn(
                "h-6 w-6 transition-colors cursor-pointer",
                (hoveredStar >= star || formData.rating >= star)
                  ? "fill-lime-400 text-lime-400"
                  : "text-gray-300 hover:text-lime-300"
              )}
            />
          </button>
        ))}
        <span className="text-sm text-muted-foreground ml-2">
          {formData.rating > 0 ? `${formData.rating}/5` : "No rating"}
        </span>
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>{book ? "Edit Book" : "Add New Book"}</DialogTitle>
            {book && onDelete && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleDelete}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Enter book title"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="author">Author *</Label>
            <Input
              id="author"
              value={formData.author}
              onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
              placeholder="Enter author name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="readingStatus">Reading Status</Label>
            <Select
              value={formData.readingStatus}
              onValueChange={(value) => setFormData(prev => ({ ...prev, readingStatus: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Not Yet Read">Want to Read</SelectItem>
                <SelectItem value="Reading Now">Currently Reading</SelectItem>
                <SelectItem value="Finished">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Rating</Label>
            {renderStarRating()}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Brief description of the book"
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="summary">Summary</Label>
            <Textarea
              id="summary"
              value={formData.summary}
              onChange={(e) => setFormData(prev => ({ ...prev, summary: e.target.value }))}
              placeholder="Your summary of the book"
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="keyLessons">Key Lessons</Label>
            <Textarea
              id="keyLessons"
              value={formData.keyLessons}
              onChange={(e) => setFormData(prev => ({ ...prev, keyLessons: e.target.value }))}
              placeholder="Key takeaways and lessons"
              rows={2}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              {book ? "Update Book" : "Add Book"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default BookDialog;
