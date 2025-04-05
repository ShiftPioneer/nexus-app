import React, { useState, useContext } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, X, UploadCloud } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog";
import { KnowledgeCategory, KnowledgeEntry } from "@/types/knowledge";
import { KnowledgeContext } from "@/contexts/KnowledgeContext";
import { useToast } from "@/hooks/use-toast";

const categoryOptions: KnowledgeCategory[] = ["note", "concept", "idea", "question", "insight", "summary", "inbox", "projects", "areas", "resources", "archives"];

interface KnowledgeInboxProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function KnowledgeInbox({ open, onOpenChange }: KnowledgeInboxProps) {
  const { addEntry } = useContext(KnowledgeContext);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState<KnowledgeCategory>("inbox");
  const [tags, setTags] = useState("");
  const [attachment, setAttachment] = useState<{ name: string; url: string; type: string } | null>(null);
  const { toast } = useToast();

  const handleSave = () => {
    if (!title || !content) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const newEntry: Omit<KnowledgeEntry, "id"> = {
      title,
      content,
      category,
      tags: tags.split(",").map(tag => tag.trim()),
      createdAt: new Date(),
      pinned: false,
      fileAttachment: attachment
    };

    addEntry(newEntry);
    toast({
      title: "Entry added",
      description: `Successfully added entry "${title}" to ${category}.`,
    });
    onOpenChange(false);
    clearForm();
  };

  const clearForm = () => {
    setTitle("");
    setContent("");
    setCategory("inbox");
    setTags("");
    setAttachment(null);
  };

  const handleRemoveAttachment = () => {
    setAttachment(null);
  };

  // Remove the 'size' property when attaching files
  const handleAttachFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setAttachment({
        name: file.name,
        url: URL.createObjectURL(file),
        type: file.type
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Knowledge Entry</DialogTitle>
          <DialogDescription>Enter the details for your new knowledge entry.</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[100px]"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="category">Category</Label>
            <Select onValueChange={(value) => setCategory(value as KnowledgeCategory)} defaultValue={category}>
              <SelectTrigger id="category">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categoryOptions.map((cat) => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="tags">Tags (comma separated)</Label>
            <Input
              type="text"
              id="tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="attachment">Attachment</Label>
            {attachment ? (
              <div className="flex items-center justify-between rounded-md border p-2">
                <span>{attachment.name}</span>
                <Button type="button" variant="ghost" onClick={handleRemoveAttachment}>
                  <X className="h-4 w-4" />
                  Remove
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Input
                  type="file"
                  id="attachment"
                  className="hidden"
                  onChange={handleAttachFile}
                />
                <Label htmlFor="attachment" className="cursor-pointer flex items-center">
                  <UploadCloud className="mr-2 h-4 w-4" />
                  Attach File
                </Label>
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="submit" onClick={handleSave}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

interface DialogDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}

const DialogDescription = React.forwardRef<HTMLParagraphElement, DialogDescriptionProps>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn(
        "text-sm text-muted-foreground",
        className
      )}
      {...props}
    />
  )
);
DialogDescription.displayName = "DialogDescription";

function cn(...inputs: any[]) {
  let className = "";
  for (let i = 0; i < inputs.length; i++) {
    const input = inputs[i];
    if (input) {
      if (typeof input === "string") {
        className += input + " ";
      } else if (typeof input === "object") {
        if (Array.isArray(input)) {
          className += cn(...input) + " ";
        } else {
          for (const key in input) {
            if (input.hasOwnProperty(key) && input[key]) {
              className += key + " ";
            }
          }
        }
      }
    }
  }
  return className.trim();
}
