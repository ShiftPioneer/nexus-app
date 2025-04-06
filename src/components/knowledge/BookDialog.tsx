
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
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
  SelectValue,
} from "@/components/ui/select";
import { CalendarIcon, Star } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Book, ReadingStatus } from "@/types/knowledge";

interface BookDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (book: Book) => void;
  book?: Book;
}

export function BookDialog({ open, onOpenChange, onSave, book }: BookDialogProps) {
  const [title, setTitle] = useState(book?.title || "");
  const [author, setAuthor] = useState(book?.author || "");
  const [readingStatus, setReadingStatus] = useState<ReadingStatus>(book?.readingStatus || "Not Yet Read");
  const [description, setDescription] = useState(book?.description || "");
  const [notes, setNotes] = useState(book?.notes || "");
  const [pages, setPages] = useState(book?.pages?.toString() || "");
  const [coverImage, setCoverImage] = useState(book?.coverImage || "");
  const [tags, setTags] = useState(book?.tags.join(", ") || "");
  const [rating, setRating] = useState(book?.rating || 0);
  const [dateAdded, setDateAdded] = useState<Date>(book?.dateAdded || new Date());
  const [dateCompleted, setDateCompleted] = useState<Date | undefined>(book?.dateCompleted);
  const [summary, setSummary] = useState(book?.summary || "");
  const [keyLessons, setKeyLessons] = useState(book?.keyLessons || "");
  const [relatedSkillsets, setRelatedSkillsets] = useState(book?.relatedSkillsets?.join(", ") || "");

  const handleSave = () => {
    if (!title || !author) return;

    const newBook: Book = {
      id: book?.id || Date.now().toString(),
      title,
      author,
      readingStatus,
      description,
      notes,
      pages: pages ? parseInt(pages) : undefined,
      coverImage,
      tags: tags.split(",").map((tag) => tag.trim()).filter(Boolean),
      rating,
      dateAdded,
      dateCompleted,
      summary,
      keyLessons,
      relatedSkillsets: relatedSkillsets
        ? relatedSkillsets.split(",").map((skill) => skill.trim()).filter(Boolean)
        : [],
      pinned: book?.pinned || false,
    };

    onSave(newBook);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{book ? "Edit Book" : "Add New Book"}</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Book title"
              />
            </div>

            <div>
              <Label htmlFor="author">Author</Label>
              <Input
                id="author"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Author name"
              />
            </div>

            <div>
              <Label htmlFor="status">Reading Status</Label>
              <Select value={readingStatus} onValueChange={(value) => setReadingStatus(value as ReadingStatus)}>
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

            <div>
              <Label htmlFor="pages">Pages</Label>
              <Input
                id="pages"
                type="number"
                value={pages}
                onChange={(e) => setPages(e.target.value)}
                placeholder="Number of pages"
              />
            </div>

            <div>
              <Label htmlFor="coverImage">Cover Image URL</Label>
              <Input
                id="coverImage"
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                placeholder="https://example.com/book-cover.jpg"
              />
            </div>

            <div>
              <Label htmlFor="tags">Tags (comma separated)</Label>
              <Input
                id="tags"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="philosophy, science, history"
              />
            </div>

            <div>
              <Label htmlFor="related-skillsets">Related Skillsets (comma separated)</Label>
              <Input
                id="related-skillsets"
                value={relatedSkillsets}
                onChange={(e) => setRelatedSkillsets(e.target.value)}
                placeholder="critical thinking, writing"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label>Rating</Label>
              <div className="flex items-center space-x-1 mt-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={cn(
                      "h-6 w-6 cursor-pointer",
                      star <= rating
                        ? "text-yellow-500 fill-yellow-500"
                        : "text-gray-300"
                    )}
                    onClick={() => setRating(star)}
                  />
                ))}
              </div>
            </div>

            <div>
              <Label>Date Added</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal mt-2"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateAdded ? format(dateAdded, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={dateAdded}
                    onSelect={(date) => date && setDateAdded(date)}
                  />
                </PopoverContent>
              </Popover>
            </div>

            {(readingStatus === "Finished" || book?.dateCompleted) && (
              <div>
                <Label>Date Completed</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal mt-2"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateCompleted ? format(dateCompleted, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={dateCompleted}
                      onSelect={(date) => setDateCompleted(date || undefined)}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            )}

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Book description"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="notes">Personal Notes</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Your notes about the book"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="summary">Summary</Label>
              <Textarea
                id="summary"
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="Brief summary of the book"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="keyLessons">Key Lessons</Label>
              <Textarea
                id="keyLessons"
                value={keyLessons}
                onChange={(e) => setKeyLessons(e.target.value)}
                placeholder="Key takeaways from the book"
                rows={3}
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
