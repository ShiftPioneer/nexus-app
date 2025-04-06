
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Book, ReadingStatus } from "@/types/knowledge";

export interface BookDialogProps {
  open: boolean;
  onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
  onSave: (book: Book) => void;
  book: Book | null;
}

export function BookDialog({ open, onOpenChange, onSave, book }: BookDialogProps) {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");
  const [readingStatus, setReadingStatus] = useState<ReadingStatus>("Not Yet Read");
  const [rating, setRating] = useState<number>(0);
  const [tags, setTags] = useState<string[]>([]);
  const [tagsInput, setTagsInput] = useState("");
  const [relatedSkillsets, setRelatedSkillsets] = useState<string[]>([]);
  const [skillsetsInput, setSkillsetsInput] = useState("");
  const [summary, setSummary] = useState("");
  const [keyLessons, setKeyLessons] = useState("");
  
  useEffect(() => {
    if (book) {
      setTitle(book.title);
      setAuthor(book.author);
      setDescription(book.description || "");
      setReadingStatus(book.readingStatus);
      setRating(book.rating);
      setTags(book.tags || []);
      setRelatedSkillsets(book.relatedSkillsets || []);
      setSummary(book.summary || "");
      setKeyLessons(book.keyLessons || "");
    } else {
      resetForm();
    }
  }, [book, open]);
  
  const resetForm = () => {
    setTitle("");
    setAuthor("");
    setDescription("");
    setReadingStatus("Not Yet Read");
    setRating(0);
    setTags([]);
    setTagsInput("");
    setRelatedSkillsets([]);
    setSkillsetsInput("");
    setSummary("");
    setKeyLessons("");
  };
  
  const handleAddTag = () => {
    if (tagsInput.trim() && !tags.includes(tagsInput.trim())) {
      setTags([...tags, tagsInput.trim()]);
      setTagsInput("");
    }
  };
  
  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };
  
  const handleAddSkillset = () => {
    if (skillsetsInput.trim() && !relatedSkillsets.includes(skillsetsInput.trim())) {
      setRelatedSkillsets([...relatedSkillsets, skillsetsInput.trim()]);
      setSkillsetsInput("");
    }
  };
  
  const handleRemoveSkillset = (skillset: string) => {
    setRelatedSkillsets(relatedSkillsets.filter(s => s !== skillset));
  };
  
  const handleSave = () => {
    if (!title || !author) return;
    
    const newBook: Book = {
      id: book?.id || Date.now().toString(),
      title,
      author,
      description,
      readingStatus,
      rating,
      tags,
      relatedSkillsets,
      summary,
      keyLessons,
      dateAdded: book?.dateAdded || new Date(),
      coverImage: book?.coverImage || "",
    };
    
    onSave(newBook);
    resetForm();
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{book ? "Edit Book" : "Add New Book"}</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Book title"
              required
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="author">Author *</Label>
            <Input
              id="author"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Author name"
              required
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of the book"
              rows={2}
            />
          </div>
          
          <div className="grid gap-2">
            <Label>Reading Status</Label>
            <RadioGroup 
              value={readingStatus} 
              onValueChange={(value) => setReadingStatus(value as ReadingStatus)}
              className="flex space-x-2"
            >
              <div className="flex items-center space-x-1">
                <RadioGroupItem value="Not Yet Read" id="not-read" />
                <Label htmlFor="not-read" className="cursor-pointer">Not Yet Read</Label>
              </div>
              <div className="flex items-center space-x-1">
                <RadioGroupItem value="Reading Now" id="reading" />
                <Label htmlFor="reading" className="cursor-pointer">Reading Now</Label>
              </div>
              <div className="flex items-center space-x-1">
                <RadioGroupItem value="Finished" id="finished" />
                <Label htmlFor="finished" className="cursor-pointer">Finished</Label>
              </div>
            </RadioGroup>
          </div>
          
          <div className="grid gap-2">
            <Label>Rating {readingStatus === "Finished" ? "(out of 5)" : ""}</Label>
            <div className="flex space-x-2">
              {[1, 2, 3, 4, 5].map(star => (
                <Button
                  key={star}
                  type="button"
                  variant="outline"
                  size="sm"
                  className={`w-8 h-8 p-0 ${rating >= star ? "bg-yellow-100 text-yellow-700 border-yellow-400" : ""}`}
                  onClick={() => setRating(star)}
                  disabled={readingStatus !== "Finished"}
                >
                  {star}
                </Button>
              ))}
            </div>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="tags">Tags</Label>
            <div className="flex gap-2">
              <Input
                id="tags"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="Add a tag"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
              />
              <Button type="button" onClick={handleAddTag} variant="outline">
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-1 mt-2">
              {tags.map(tag => (
                <span 
                  key={tag} 
                  className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs flex items-center"
                >
                  {tag}
                  <button 
                    type="button" 
                    className="ml-1 text-gray-500 hover:text-gray-700"
                    onClick={() => handleRemoveTag(tag)}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="skillsets">Related Skillsets</Label>
            <div className="flex gap-2">
              <Input
                id="skillsets"
                value={skillsetsInput}
                onChange={(e) => setSkillsetsInput(e.target.value)}
                placeholder="Add a skillset"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSkillset();
                  }
                }}
              />
              <Button type="button" onClick={handleAddSkillset} variant="outline">
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-1 mt-2">
              {relatedSkillsets.map(skillset => (
                <span 
                  key={skillset} 
                  className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs flex items-center"
                >
                  {skillset}
                  <button 
                    type="button" 
                    className="ml-1 text-blue-500 hover:text-blue-700"
                    onClick={() => handleRemoveSkillset(skillset)}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
          
          {readingStatus === "Finished" && (
            <>
              <div className="grid gap-2">
                <Label htmlFor="summary">Summary</Label>
                <Textarea
                  id="summary"
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder="Brief summary of the book"
                  rows={3}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="keyLessons">Key Lessons or Takeaways</Label>
                <Textarea
                  id="keyLessons"
                  value={keyLessons}
                  onChange={(e) => setKeyLessons(e.target.value)}
                  placeholder="What are your main takeaways?"
                  rows={3}
                />
              </div>
            </>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!title || !author}>
            {book ? "Save Changes" : "Add Book"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
