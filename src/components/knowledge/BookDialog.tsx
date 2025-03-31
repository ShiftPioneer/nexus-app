
import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Book, ReadingStatus } from "@/types/knowledge";
import { Upload, Star } from "lucide-react";

interface BookDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (book: Book) => void;
  book: Book | null;
}

const readingStatuses: ReadingStatus[] = [
  'Reading Now',
  'Not Yet Read',
  'Finished'
];

export function BookDialog({ open, onOpenChange, onSave, book }: BookDialogProps) {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [readingStatus, setReadingStatus] = useState<ReadingStatus>('Not Yet Read');
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
      setDescription(book.description || '');
      setRelatedSkillsets(book.relatedSkillsets.join(', '));
      setSummary(book.summary || '');
      setKeyLessons(book.keyLessons || '');
    } else {
      setTitle('');
      setAuthor('');
      setReadingStatus('Not Yet Read');
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
    alert('Image upload feature would go here');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{book ? 'Edit Book' : 'Add New Book'}</DialogTitle>
          <DialogDescription>
            Add a new book to your collection.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <label htmlFor="title" className="text-sm font-medium">Book Title</label>
              <Input
                id="title"
                placeholder="e.g., Atomic Habits"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            
            <div className="grid gap-2">
              <label htmlFor="author" className="text-sm font-medium">Author</label>
              <Input
                id="author"
                placeholder="e.g., James Clear"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
              />
            </div>
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
              <label className="text-sm font-medium">Rating</label>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="focus:outline-none"
                  >
                    <Star
                      className={`h-5 w-5 ${star <= rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          <div className="grid gap-2">
            <label className="text-sm font-medium">Book Cover</label>
            <div className="border border-dashed rounded-md p-6 flex flex-col items-center justify-center text-center">
              {coverImage ? (
                <div className="relative w-full h-40">
                  <img 
                    src={coverImage} 
                    alt={title} 
                    className="h-full mx-auto object-contain"
                  />
                </div>
              ) : (
                <>
                  <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">Click to upload cover image or PDF</p>
                </>
              )}
              <Button
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={handleImageUpload}
              >
                Select File
              </Button>
            </div>
          </div>
          
          <div className="grid gap-2">
            <label htmlFor="description" className="text-sm font-medium">Description</label>
            <Textarea
              id="description"
              placeholder="Brief description of this book"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          
          <div className="grid gap-2">
            <label htmlFor="skillsets" className="text-sm font-medium">Related Skillsets</label>
            <Input
              id="skillsets"
              placeholder="e.g., Programming, Self-Improvement (comma separated)"
              value={relatedSkillsets}
              onChange={(e) => setRelatedSkillsets(e.target.value)}
            />
          </div>
          
          <div className="grid gap-2">
            <label htmlFor="summary" className="text-sm font-medium">Summary</label>
            <Textarea
              id="summary"
              placeholder="Short summary of the book's content"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
            />
          </div>
          
          <div className="grid gap-2">
            <label htmlFor="keyLessons" className="text-sm font-medium">Key Lessons</label>
            <Textarea
              id="keyLessons"
              placeholder="Main lessons or takeaways from this book"
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
            {book ? 'Update Book' : 'Add Book'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
