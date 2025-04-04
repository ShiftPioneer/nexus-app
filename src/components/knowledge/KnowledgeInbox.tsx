
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import TagInput from "@/components/ui/tag-input";
import { Label } from "@/components/ui/label";
import { Mic, MicOff, Paperclip, Plus, BookOpen, FileUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { KnowledgeEntry } from "@/types/knowledge";

interface KnowledgeInboxProps {
  onAddEntry: (entry: KnowledgeEntry) => void;
}

const KnowledgeInbox: React.FC<KnowledgeInboxProps> = ({ onAddEntry }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedText, setRecordedText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [url, setUrl] = useState("");

  const { toast } = useToast();
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      toast({
        title: "File Selected",
        description: `${selectedFile.name} has been added to your entry`,
        duration: 3000,
      });
    }
  };

  const toggleRecording = () => {
    // This would normally use the Web Speech API
    setIsRecording(!isRecording);

    if (isRecording) {
      // Stop recording
      setContent(prev => prev + " " + recordedText);
      setRecordedText("");
      toast({
        title: "Recording Stopped",
        description: "Your speech has been added to the content",
        duration: 3000,
      });
    } else {
      // Start recording
      toast({
        title: "Recording Started",
        description: "Speak now to add content to your entry",
        duration: 3000,
      });
      
      // Simulating a recording
      setTimeout(() => {
        setRecordedText("This is simulated voice recording content.");
      }, 2000);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter a title for your entry",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    const newEntry: KnowledgeEntry = {
      id: Date.now().toString(),
      title,
      content,
      tags,
      createdAt: new Date(),
      updatedAt: new Date(),
      category: "inbox", // Always start in inbox
      url: url || undefined,
      fileAttachment: file ? {
        name: file.name,
        type: file.type,
        size: file.size,
        url: URL.createObjectURL(file)
      } : undefined
    };

    onAddEntry(newEntry);
    
    // Reset form
    setTitle("");
    setContent("");
    setTags([]);
    setFile(null);
    setUrl("");

    toast({
      title: "Entry Captured",
      description: "Your knowledge has been added to the inbox",
      duration: 3000,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary" />
          Capture Knowledge
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Enter a title for your knowledge entry"
              value={title}
              onChange={e => setTitle(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="content">Content</Label>
              <Button
                type="button"
                size="sm"
                variant={isRecording ? "destructive" : "outline"}
                onClick={toggleRecording}
                className="gap-1"
              >
                {isRecording ? (
                  <>
                    <MicOff className="h-4 w-4" />
                    Stop Recording
                  </>
                ) : (
                  <>
                    <Mic className="h-4 w-4" />
                    Record Voice
                  </>
                )}
              </Button>
            </div>
            <Textarea
              id="content"
              placeholder="Write your knowledge entry here"
              value={content}
              onChange={e => setContent(e.target.value)}
              className="min-h-[150px]"
            />
            {recordedText && (
              <div className="text-sm mt-1 text-muted-foreground">
                <p>Recording: {recordedText}</p>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags</Label>
            <TagInput
              id="tags"
              value={tags}
              onChange={setTags}
              placeholder="Add tags..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="url">Web URL (optional)</Label>
            <Input
              id="url"
              placeholder="https://example.com/article"
              value={url}
              onChange={e => setUrl(e.target.value)}
            />
          </div>

          <div>
            <input 
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileChange}
            />
            <Button 
              type="button"
              variant="outline"
              onClick={handleFileUpload}
              className="w-full gap-2"
            >
              <Paperclip className="h-4 w-4" />
              {file ? file.name : "Attach File"}
            </Button>
          </div>

          <Button type="submit" className="w-full gap-2">
            <Plus className="h-4 w-4" />
            Capture Entry
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default KnowledgeInbox;
