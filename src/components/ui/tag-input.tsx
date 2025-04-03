
import React, { useState, KeyboardEvent } from "react";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface TagInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value: string[];
  onChange: (value: string[]) => void;
  maxTags?: number;
  className?: string;
}

const TagInput = React.forwardRef<HTMLInputElement, TagInputProps>(
  ({ value, onChange, maxTags = 10, className, ...props }, ref) => {
    const [inputValue, setInputValue] = useState<string>("");

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
      // Add tag on enter or comma
      if ((e.key === "Enter" || e.key === ",") && inputValue.trim()) {
        e.preventDefault();
        
        // Don't add duplicate tags
        const newTag = inputValue.trim();
        if (!value.includes(newTag) && value.length < maxTags) {
          onChange([...value, newTag]);
          setInputValue("");
        } else if (value.length >= maxTags) {
          // Could add toast notification here about max tags
          console.log(`Maximum of ${maxTags} tags allowed`);
        }
      }
      
      // Remove last tag on backspace if input is empty
      if (e.key === "Backspace" && !inputValue && value.length > 0) {
        onChange(value.slice(0, -1));
      }
    };

    const removeTag = (tagToRemove: string) => {
      onChange(value.filter(tag => tag !== tagToRemove));
    };

    return (
      <div className={cn("flex flex-wrap gap-2 border rounded-md p-1.5 bg-background", className)}>
        {value.map(tag => (
          <Badge 
            key={tag} 
            variant="secondary" 
            className="flex items-center gap-1 px-2 py-1 text-xs"
          >
            {tag}
            <X
              className="h-3 w-3 cursor-pointer hover:text-destructive"
              onClick={() => removeTag(tag)}
            />
          </Badge>
        ))}
        
        <Input
          ref={ref}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 border-0 p-0 text-sm focus-visible:ring-0 focus-visible:ring-offset-0"
          {...props}
        />
      </div>
    );
  }
);

TagInput.displayName = "TagInput";

export default TagInput;
