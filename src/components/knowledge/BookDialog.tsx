
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Book, ReadingStatus } from "@/types/knowledge";

export interface BookDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (book: Book) => void;
  book: Book | null;
  bookCoverImage?: string | null;
  onBookCoverImageChange?: (url: string) => void;
}

export function BookDialog({ 
  open, 
  onOpenChange, 
  onSave, 
  book,
  bookCoverImage,
  onBookCoverImageChange
}: BookDialogProps) {
  const isNewBook = !book?.id;
  
  const [title, setTitle] = useState(book?.title || "");
  const [author, setAuthor] = useState(book?.author || "");
  const [genre, setGenre] = useState(book?.genre || "");
  const [description, setDescription] = useState(book?.description || "");
  const [coverImage, setCoverImage] = useState(bookCoverImage || book?.coverImage || "");
  const [readingStatus, setReadingStatus] = useState<ReadingStatus>(book?.readingStatus || "Not Started");
  const [currentPage, setCurrentPage] = useState(book?.currentPage || 0);
  const [totalPages, setTotalPages] = useState(book?.totalPages || 0);
  const [notes, setNotes] = useState(book?.notes || "");
  const [tagsString, setTagsString] = useState((book?.tags || []).join(", "));
  const [rating, setRating] = useState(book?.rating || 0);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const updatedBook: Book = {
      id: book?.id || "",
      title,
      author,
      genre,
      description,
      coverImage,
      readingStatus,
      currentPage: readingStatus === "In Progress" ? currentPage : undefined,
      totalPages: (readingStatus === "In Progress" || readingStatus === "Completed") ? totalPages : undefined,
      notes,
      tags: tagsString.split(",").map(tag => tag.trim()).filter(tag => tag !== ""),
      dateAdded: book?.dateAdded || new Date(),
      dateCompleted: readingStatus === "Completed" ? (book?.dateCompleted || new Date()) : undefined,
      rating: rating || 0
    };
    
    onSave(updatedBook);
  };

  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setCoverImage(url);
    if (onBookCoverImageChange) {
      onBookCoverImageChange(url);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isNewBook ? "Add New Book" : "Edit Book"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input 
                  id="title" 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)} 
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="author">Author</Label>
                <Input 
                  id="author" 
                  value={author} 
                  onChange={(e) => setAuthor(e.target.value)} 
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="genre">Genre</Label>
                <Input 
                  id="genre" 
                  value={genre} 
                  onChange={(e) => setGenre(e.target.value)} 
                />
              </div>
              
              <div>
                <Label htmlFor="cover">Cover URL</Label>
                <Input 
                  id="cover" 
                  value={coverImage} 
                  onChange={handleCoverImageChange} 
                  placeholder="https://example.com/book-cover.jpg"
                />
              </div>
              
              <div>
                <Label htmlFor="status">Reading Status</Label>
                <Select
                  value={readingStatus}
                  onValueChange={(value) => setReadingStatus(value as ReadingStatus)}
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Not Started">Not Started</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {readingStatus === "In Progress" && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="currentPage">Current Page</Label>
                    <Input 
                      id="currentPage" 
                      type="number" 
                      min="0"
                      value={currentPage} 
                      onChange={(e) => setCurrentPage(parseInt(e.target.value) || 0)} 
                    />
                  </div>
                  <div>
                    <Label htmlFor="totalPages">Total Pages</Label>
                    <Input 
                      id="totalPages" 
                      type="number" 
                      min="1"
                      value={totalPages} 
                      onChange={(e) => setTotalPages(parseInt(e.target.value) || 0)} 
                    />
                  </div>
                </div>
              )}
              
              {readingStatus === "Completed" && (
                <div>
                  <Label htmlFor="totalPages">Total Pages</Label>
                  <Input 
                    id="totalPages" 
                    type="number" 
                    min="1"
                    value={totalPages} 
                    onChange={(e) => setTotalPages(parseInt(e.target.value) || 0)} 
                  />
                </div>
              )}
              
              <div>
                <Label htmlFor="tags">Tags (comma separated)</Label>
                <Input 
                  id="tags" 
                  value={tagsString} 
                  onChange={(e) => setTagsString(e.target.value)} 
                  placeholder="fiction, sci-fi, recommended"
                />
              </div>

              <div>
                <Label htmlFor="rating">Rating (0-5)</Label>
                <Input 
                  id="rating" 
                  type="number" 
                  min="0"
                  max="5"
                  value={rating} 
                  onChange={(e) => setRating(parseInt(e.target.value) || 0)} 
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)} 
                  className="h-24"
                />
              </div>
              
              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea 
                  id="notes" 
                  value={notes} 
                  onChange={(e) => setNotes(e.target.value)} 
                  className="h-48"
                  placeholder="Your thoughts, quotes, or summaries..."
                />
              </div>
              
              {coverImage && (
                <div className="mt-4">
                  <Label>Cover Preview</Label>
                  <div className="mt-2 w-32 h-48 bg-gray-100 rounded overflow-hidden">
                    <img 
                      src={coverImage} 
                      alt={`Cover for ${title}`} 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/128x192?text=No+Cover';
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <DialogFooter>
            <Button type="submit">{isNewBook ? "Add Book" : "Save Changes"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
