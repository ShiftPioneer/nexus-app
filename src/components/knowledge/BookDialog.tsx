
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface BookDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  book?: any;
  onSave: (book: any) => void;
}

const BookDialog: React.FC<BookDialogProps> = ({ open, onOpenChange, book, onSave }) => {
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    category: "",
    status: "want-to-read",
    rating: 0,
    pages: "",
    notes: "",
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
        status: book.status || "want-to-read",
        rating: book.rating || 0,
        pages: book.pages?.toString() || "",
        notes: book.notes || "",
        dateStarted: book.dateStarted || "",
        dateCompleted: book.dateCompleted || "",
      });
    } else {
      setFormData({
        title: "",
        author: "",
        category: "",
        status: "want-to-read",
        rating: 0,
        pages: "",
        notes: "",
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
      createdAt: book?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSave(bookData);
    onOpenChange(false);
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
          <DialogTitle>{book ? "Edit Book" : "Add New Book"}</DialogTitle>
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
            <Label htmlFor="category">Category</Label>
            <Input
              id="category"
              value={formData.category}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
              placeholder="e.g., Fiction, Non-fiction, Self-help"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Reading Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="want-to-read">Want to Read</SelectItem>
                <SelectItem value="reading">Currently Reading</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Rating</Label>
            {renderStarRating()}
          </div>

          <div className="space-y-2">
            <Label htmlFor="pages">Pages</Label>
            <Input
              id="pages"
              type="number"
              value={formData.pages}
              onChange={(e) => setFormData(prev => ({ ...prev, pages: e.target.value }))}
              placeholder="Number of pages"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Your thoughts, quotes, or notes about this book"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dateStarted">Date Started</Label>
              <Input
                id="dateStarted"
                type="date"
                value={formData.dateStarted}
                onChange={(e) => setFormData(prev => ({ ...prev, dateStarted: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dateCompleted">Date Completed</Label>
              <Input
                id="dateCompleted"
                type="date"
                value={formData.dateCompleted}
                onChange={(e) => setFormData(prev => ({ ...prev, dateCompleted: e.target.value }))}
              />
            </div>
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
