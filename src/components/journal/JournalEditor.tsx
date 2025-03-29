
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { Smile, Meh, Frown, X } from "lucide-react";

interface JournalEditorProps {
  initialEntry: JournalEntry;
  onSave: (entry: JournalEntry) => void;
  onCancel: () => void;
}

const JournalEditor: React.FC<JournalEditorProps> = ({ initialEntry, onSave, onCancel }) => {
  const [entry, setEntry] = useState<JournalEntry>({ ...initialEntry });
  const [tagInput, setTagInput] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEntry(prev => ({ ...prev, [name]: value }));
  };

  const handleMoodChange = (mood: string) => {
    setEntry(prev => ({ ...prev, mood: mood as "positive" | "negative" | "neutral" | "mixed" }));
  };

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!entry.tags.includes(tagInput.trim())) {
        setEntry(prev => ({ ...prev, tags: [...prev.tags, tagInput.trim()] }));
      }
      setTagInput("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setEntry(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }));
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          name="title"
          placeholder="Entry title"
          value={entry.title}
          onChange={handleChange}
          className="mt-1"
        />
      </div>

      <div>
        <Label htmlFor="content">Journal Content</Label>
        <Textarea
          id="content"
          name="content"
          placeholder="Write your thoughts here..."
          value={entry.content}
          onChange={handleChange}
          className="min-h-[200px] mt-1 resize-y"
        />
      </div>

      <div>
        <Label>How are you feeling?</Label>
        <RadioGroup
          value={entry.mood}
          onValueChange={handleMoodChange}
          className="flex gap-4 mt-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="positive" id="positive" />
            <Label htmlFor="positive" className="flex items-center gap-1 cursor-pointer">
              <Smile className="h-5 w-5 text-success" />
              Positive
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="neutral" id="neutral" />
            <Label htmlFor="neutral" className="flex items-center gap-1 cursor-pointer">
              <Meh className="h-5 w-5 text-secondary" />
              Neutral
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="negative" id="negative" />
            <Label htmlFor="negative" className="flex items-center gap-1 cursor-pointer">
              <Frown className="h-5 w-5 text-destructive" />
              Negative
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="mixed" id="mixed" />
            <Label htmlFor="mixed" className="cursor-pointer">Mixed</Label>
          </div>
        </RadioGroup>
      </div>

      <div>
        <Label htmlFor="tags">Tags</Label>
        <Input
          id="tags"
          placeholder="Add tags (press Enter after each tag)"
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={handleAddTag}
          className="mt-1"
        />
        <div className="flex flex-wrap gap-2 mt-2">
          {entry.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="flex items-center gap-1">
              {tag}
              <button 
                type="button" 
                onClick={() => handleRemoveTag(tag)}
                className="ml-1 h-4 w-4 rounded-full hover:bg-destructive/20"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button 
          onClick={() => onSave(entry)} 
          disabled={!entry.title.trim() || !entry.content.trim()}
        >
          Save Entry
        </Button>
      </div>
    </div>
  );
};

export default JournalEditor;
