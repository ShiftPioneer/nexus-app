
import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Book, ReadingStatus } from "@/types/knowledge";
import { Upload } from "lucide-react";
import { Slider } from "@/components/ui/slider";

interface BookDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (book: Book) => void;
  book: Book | null;
}

const readingStatuses: ReadingStatus[] = ["Reading Now", "Not Yet Read", "Finished"];

export function BookDialog({ open, onOpenChange, onSave, book }: BookDialogProps) {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [readingStatus, setReadingStatus] = useState<ReadingStatus>("Not Yet Read");
  const [rating, setRating] = useState(0);
  const [coverImage, setCoverImage] = useState('');
  const [description, setDescription] = useState('');
  const [relatedSkillsets, setRelatedSkillsets] = useState('');
  const [summary, setSummary] = useState('');
  const [keyLessons, setKeyLessons] = useState('');
  
  useEffect(() => {
    if (book) {
      setTitle(book.title);
      setAuthor(book.author);
      setReadingStatus(book.readingStatus);
      setRating(book.rating);
      setCoverImage(book.coverImage || '');
      setDescription(book.description);
      setRelatedSkillsets(book.relatedSkillsets.join(', '));
      setSummary(book.summary);
      setKeyLessons(book.keyLessons);
    } else {
      setTitle('');
      setAuthor('');
      setReadingStatus("Not Yet Read");
      setRating(0);
      setCoverImage('');
      setDescription('');
      setRelatedSkillsets('');
      setSummary('');
      setKeyLessons('');
    }
  }, [book, open]);

  const handleSave = () => {
    const newBook: Book = {
      id: book?.id || '',
      title,
      author,
      readingStatus,
      rating,
      coverImage: coverImage || undefined,
      description,
      relatedSkillsets: relatedSkillsets.split(',').map(s => s.trim()).filter(Boolean),
      summary,
      keyLessons
    };
    onSave(newBook);
  };

  // Mock function for image upload (in a real app, this would upload to a server)
  const handleImageUpload = () => {
    // This would be replaced with actual file upload logic
    alert('Cover image upload feature would go here');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{book ? 'Edit Book' : 'Add New Book'}</DialogTitle>
          <DialogDescription>
            Add a book to your bookshelf and track your reading progress.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label htmlFor="title" className="text-sm font-medium">Book Title</label>
            <Input
              id="title"
              placeholder="Enter book title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          
          <div className="grid gap-2">
            <label htmlFor="author" className="text-sm font-medium">Author</label>
            <Input
              id="author"
              placeholder="Enter author name"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <label htmlFor="status" className="text-sm font-medium">Reading Status</label>
              <Select value={readingStatus} onValueChange={(value) => setReadingStatus(value as ReadingStatus)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {readingStatuses.map((status) => (
                    <SelectItem key={status} value={status}>{status}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <div className="flex justify-between">
                <label htmlFor="rating" className="text-sm font-medium">Rating</label>
                <span className="text-sm font-medium">{rating}/5</span>
              </div>
              <Slider 
                value={[rating]} 
                onValueChange={(values) => setRating(values[0])} 
                min={0} 
                max={5} 
                step={1}
              />
            </div>
          </div>
          
          <div className="grid gap-2">
            <label className="text-sm font-medium">Cover Image</label>
            <div className="border border-dashed rounded-md p-6 flex flex-col items-center justify-center text-center">
              {coverImage ? (
                <div className="mb-2">
                  <img src={coverImage} alt="Preview" className="max-h-32 mx-auto" />
                </div>
              ) : (
                <Upload className="h-8 w-8 text-muted-foreground mb-2" />
              )}
              <p className="text-sm text-muted-foreground">Click to upload a cover image</p>
              <Button
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={handleImageUpload}
              >
                Select Image
              </Button>
            </div>
          </div>
          
          <div className="grid gap-2">
            <label htmlFor="description" className="text-sm font-medium">Description</label>
            <Textarea
              id="description"
              placeholder="Brief description of the book"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          
          <div className="grid gap-2">
            <label htmlFor="skillsets" className="text-sm font-medium">Related Skillsets</label>
            <Input
              id="skillsets"
              placeholder="e.g., Programming, Design (comma separated)"
              value={relatedSkillsets}
              onChange={(e) => setRelatedSkillsets(e.target.value)}
            />
          </div>
          
          <div className="grid gap-2">
            <label htmlFor="summary" className="text-sm font-medium">Book Summary</label>
            <Textarea
              id="summary"
              placeholder="Summary of the book's main points"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
            />
          </div>
          
          <div className="grid gap-2">
            <label htmlFor="keyLessons" className="text-sm font-medium">Key Lessons</label>
            <Textarea
              id="keyLessons"
              placeholder="Important takeaways and lessons from the book"
              value={keyLessons}
              onChange={(e) => setKeyLessons(e.target.value)}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Book
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
