import React, { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Book, ReadingStatus } from "@/types/knowledge";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, X, UploadCloud, Star, StarHalf } from "lucide-react";

interface BookDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (book: Book) => void;
  book?: Book | null;
  coverImage?: string | null;
  onCoverImageChange: (coverImage: string | null) => void;
}

export function BookDialog({ 
  open, 
  onOpenChange, 
  onSave, 
  book, 
  coverImage, 
  onCoverImageChange 
}: BookDialogProps) {
  const [title, setTitle] = useState(book?.title || "");
  const [author, setAuthor] = useState(book?.author || "");
  const [description, setDescription] = useState(book?.description || "");
  const [readingStatus, setReadingStatus] = useState<ReadingStatus>(book?.readingStatus || "Not Yet Read");
  const [rating, setRating] = useState(book?.rating || 0);
  const [tags, setTags] = useState(book?.tags?.join(", ") || "");
  const [summary, setSummary] = useState(book?.summary || "");
  const [keyLessons, setKeyLessons] = useState(book?.keyLessons || "");

  const handleSave = () => {
    const newBook: Book = {
      id: book?.id || Date.now().toString(),
      title,
      author,
      coverImage: coverImage || undefined,
      description,
      readingStatus,
      rating,
      tags: tags.split(",").map(tag => tag.trim()),
      dateAdded: book?.dateAdded || new Date(),
      summary,
      keyLessons
    };
    onSave(newBook);
    onOpenChange(false);
  };

  const handleRatingChange = (newRating: number) => {
    setRating(newRating);
  };

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(<Star key={i} className="text-yellow-500 h-5 w-5" />);
      } else if (i === Math.ceil(rating) && rating % 1 !== 0) {
        stars.push(<StarHalf key={i} className="text-yellow-500 h-5 w-5" />);
      } else {
        stars.push(<Star key={i} className="text-gray-300 h-5 w-5" />);
      }
    }
    return stars;
  };

  const handleCoverImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        onCoverImageChange(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{book ? "Edit Book" : "Add New Book"}</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Title
            </Label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="col-span-3" />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="author" className="text-right">
              Author
            </Label>
            <Input id="author" value={author} onChange={(e) => setAuthor(e.target.value)} className="col-span-3" />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="coverImage" className="text-right">
              Cover Image
            </Label>
            <div className="col-span-3 flex items-center space-x-2">
              <Input type="file" id="coverImage" accept="image/*" onChange={handleCoverImageUpload} className="hidden" />
              <Label htmlFor="coverImage" className="cursor-pointer bg-secondary hover:bg-secondary-foreground text-secondary-foreground hover:text-card rounded-md px-3 py-1.5 text-sm font-medium">
                <UploadCloud className="inline-block h-4 w-4 mr-2" />
                Upload
              </Label>
              {coverImage && (
                <div className="relative">
                  <img src={coverImage} alt="Cover" className="h-10 w-10 rounded-md object-cover" />
                  <Button variant="ghost" size="icon" className="absolute top-0 right-0 h-5 w-5 p-0" onClick={() => onCoverImageChange(null)}>
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="description" className="text-right mt-2">
              Description
            </Label>
            <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} className="col-span-3" />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="readingStatus" className="text-right">
              Reading Status
            </Label>
            <Select value={readingStatus} onValueChange={(value) => setReadingStatus(value as ReadingStatus)} className="col-span-3">
              <SelectTrigger>
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

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="rating" className="text-right">
              Rating
            </Label>
            <div className="col-span-3 flex items-center">
              {renderStars()}
            </div>
          </div>

          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="tags" className="text-right mt-2">
              Tags
            </Label>
            <Textarea id="tags" value={tags} onChange={(e) => setTags(e.target.value)} className="col-span-3" placeholder="Comma-separated" />
          </div>

          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="summary" className="text-right mt-2">
              Summary
            </Label>
            <Textarea id="summary" value={summary} onChange={(e) => setSummary(e.target.value)} className="col-span-3" />
          </div>

          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="keyLessons" className="text-right mt-2">
              Key Lessons
            </Label>
            <Textarea id="keyLessons" value={keyLessons} onChange={(e) => setKeyLessons(e.target.value)} className="col-span-3" />
          </div>
        </div>

        <DialogFooter>
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="submit" onClick={handleSave}>
            {book ? "Update Book" : "Add Book"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
