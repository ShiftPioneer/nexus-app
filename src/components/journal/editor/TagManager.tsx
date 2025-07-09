
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { X, Hash } from "lucide-react";

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
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Hash className="h-4 w-4 text-primary" />
        <Label htmlFor="tags" className="text-white font-medium">Tags</Label>
      </div>
      
      <Input 
        id="tags" 
        placeholder="Add tags (press Enter after each tag)" 
        value={tagInput} 
        onChange={e => onTagInputChange(e.target.value)} 
        onKeyDown={onAddTag} 
        className="bg-slate-800/50 border-slate-600/50 text-white placeholder-slate-400 focus:border-primary focus:ring-primary/20 transition-all duration-200"
      />
      
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tags.map(tag => (
            <Badge 
              key={tag} 
              variant="secondary" 
              className="flex items-center gap-2 bg-slate-700/50 text-slate-200 border-slate-600/50 hover:bg-slate-600/50 transition-all duration-200"
            >
              <Hash className="h-3 w-3" />
              {tag}
              <button 
                type="button" 
                onClick={() => onRemoveTag(tag)} 
                className="ml-1 h-4 w-4 rounded-full hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors duration-200"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};

export default TagManager;
