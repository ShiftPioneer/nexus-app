
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface TagManagerProps {
  tags: string[];
  tagInput: string;
  onTagInputChange: (value: string) => void;
  onAddTag: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onRemoveTag: (tag: string) => void;
}

const TagManager: React.FC<TagManagerProps> = ({
  tags,
  tagInput,
  onTagInputChange,
  onAddTag,
  onRemoveTag
}) => {
  return (
    <div>
      <Label htmlFor="tags">Tags</Label>
      <Input
        id="tags"
        placeholder="Add tags (press Enter after each tag)"
        value={tagInput}
        onChange={(e) => onTagInputChange(e.target.value)}
        onKeyDown={onAddTag}
        className="mt-1"
      />
      <div className="flex flex-wrap gap-2 mt-2">
        {tags.map((tag) => (
          <Badge key={tag} variant="secondary" className="flex items-center gap-1">
            {tag}
            <button 
              type="button" 
              onClick={() => onRemoveTag(tag)}
              className="ml-1 h-4 w-4 rounded-full hover:bg-destructive/20"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default TagManager;
