
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Book, ReadingStatus } from "@/types/knowledge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BookOpen, Upload, X } from "lucide-react";

interface BookDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (book: Book) => void;
  book: Book | null;
  coverImage: string | null;
  onCoverImageChange: (imageUrl: string | null) => void;
}

export function BookDialog({
  open,
  onOpenChange,
  onSave,
  book,
  coverImage,
  onCoverImageChange
}: BookDialogProps) {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");
  const [readingStatus, setReadingStatus] = useState<ReadingStatus>("Not Yet Read" as ReadingStatus);
  const [rating, setRating] = useState(0);
  const [summary, setSummary] = useState("");
  const [keyLessons, setKeyLessons] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [relatedSkillsets, setRelatedSkillsets] = useState<string[]>([]);
  const [skillsetInput, setSkillsetInput] = useState("");

  useEffect(() => {
    if (book) {
      setTitle(book.title);
      setAuthor(book.author);
      setDescription(book.description || "");
      setReadingStatus(book.readingStatus);
      setRating(book.rating);
      setSummary(book.summary || "");
      setKeyLessons(book.keyLessons || "");
      setTags(book.tags || []);
      setRelatedSkillsets(book.relatedSkillsets || []);
    } else {
      setTitle("");
      setAuthor("");
      setDescription("");
      setReadingStatus("Not Yet Read" as ReadingStatus);
      setRating(0);
      setSummary("");
      setKeyLessons("");
      setTags([]);
      setRelatedSkillsets([]);
    }
  }, [book, open]);

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleAddSkillset = () => {
    if (skillsetInput.trim() && !relatedSkillsets.includes(skillsetInput.trim())) {
      setRelatedSkillsets([...relatedSkillsets, skillsetInput.trim()]);
      setSkillsetInput("");
    }
  };

  const handleRemoveSkillset = (skillsetToRemove: string) => {
    setRelatedSkillsets(relatedSkillsets.filter(skillset => skillset !== skillsetToRemove));
  };

  const handleSave = () => {
    const newBook: Book = {
      id: book?.id || Date.now().toString(),
      title,
      author,
      description,
      readingStatus,
      rating,
      summary,
      keyLessons,
      coverImage: coverImage || undefined,
      tags,
      relatedSkillsets,
      dateAdded: book?.dateAdded || new Date(),
      dateCompleted: readingStatus === "Finished" as ReadingStatus ? new Date() : undefined,
    };
    onSave(newBook);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // In a real app, you would upload this to a storage service
    // For demo purposes, we'll use a FileReader to get a data URL
    const reader = new FileReader();
    reader.onload = () => {
      onCoverImageChange(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            {book ? "Edit Book" : "Add New Book"}
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          <div className="flex gap-4 items-start">
            <div className="w-1/3">
              <div className="relative bg-muted h-40 rounded-md flex items-center justify-center overflow-hidden">
                {coverImage ? (
                  <>
                    <img
                      src={coverImage}
                      alt="Book cover"
                      className="w-full h-full object-cover"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-1 right-1 h-6 w-6 p-0 bg-black bg-opacity-50 hover:bg-opacity-70"
                      onClick={() => onCoverImageChange(null)}
                    >
                      <X className="h-4 w-4 text-white" />
                    </Button>
                  </>
                ) : (
                  <div className="text-center p-2">
                    <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-xs text-muted-foreground">Upload cover image</p>
                  </div>
                )}
                <input
                  type="file"
                  id="cover-upload"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </div>
            </div>

            <div className="flex-1 grid gap-3">
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

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="status">Reading Status</Label>
                  <Select
                    value={readingStatus}
                    onValueChange={(value) => setReadingStatus(value as ReadingStatus)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Not Yet Read">Not Yet Read</SelectItem>
                      <SelectItem value="Reading Now">Reading Now</SelectItem>
                      <SelectItem value="Finished">Finished</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="rating">Rating</Label>
                  <Select
                    value={rating.toString()}
                    onValueChange={(value) => setRating(parseInt(value))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Rating" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Not Rated</SelectItem>
                      <SelectItem value="1">★</SelectItem>
                      <SelectItem value="2">★★</SelectItem>
                      <SelectItem value="3">★★★</SelectItem>
                      <SelectItem value="4">★★★★</SelectItem>
                      <SelectItem value="5">★★★★★</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of the book"
              rows={2}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="summary">Summary</Label>
              <Textarea
                id="summary"
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="What is the book about?"
                rows={5}
              />
            </div>

            <div>
              <Label htmlFor="keyLessons">Key Lessons</Label>
              <Textarea
                id="keyLessons"
                value={keyLessons}
                onChange={(e) => setKeyLessons(e.target.value)}
                placeholder="What did you learn from this book?"
                rows={5}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="tags">Tags</Label>
            <div className="flex gap-2 mb-2">
              <Input
                id="tags"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="Add a tag"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
              />
              <Button type="button" onClick={handleAddTag} variant="outline">
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="py-1">
                  {tag}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 ml-1"
                    onClick={() => handleRemoveTag(tag)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="skillsets">Related Skillsets</Label>
            <div className="flex gap-2 mb-2">
              <Input
                id="skillsets"
                value={skillsetInput}
                onChange={(e) => setSkillsetInput(e.target.value)}
                placeholder="Add a skillset"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddSkillset();
                  }
                }}
              />
              <Button type="button" onClick={handleAddSkillset} variant="outline">
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {relatedSkillsets.map((skillset) => (
                <Badge key={skillset} variant="secondary" className="py-1">
                  {skillset}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 ml-1"
                    onClick={() => handleRemoveSkillset(skillset)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!title || !author}>
            {book ? "Update Book" : "Add Book"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
