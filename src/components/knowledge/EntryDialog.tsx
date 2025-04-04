
import React, { useState, useEffect } from "react";
import { useKnowledge } from "@/contexts/KnowledgeContext";
import { KnowledgeEntry, KnowledgeCategory } from "@/types/knowledge";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import TagInput from "@/components/ui/tag-input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Archive, 
  CalendarIcon, 
  Check, 
  CheckCircle, 
  ExternalLink, 
  FileText, 
  FolderOpen, 
  Inbox, 
  Link2, 
  LinkIcon, 
  Mic, 
  Paperclip, 
  Save, 
  Sparkles,
  FileSpreadsheet
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { useTasks } from "@/contexts/TaskContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface EntryDialogProps {
  entry: KnowledgeEntry | null;
  isOpen: boolean;
  onClose: () => void;
}

const EntryDialog: React.FC<EntryDialogProps> = ({ entry, isOpen, onClose }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [category, setCategory] = useState<KnowledgeCategory>("inbox");
  const [url, setUrl] = useState("");
  const [activeTab, setActiveTab] = useState("content");
  const [isEditing, setIsEditing] = useState(false);
  
  const { updateEntry, generateAiSummary, getLinkedTasks, unlinkTaskFromEntry } = useKnowledge();
  const { tasks } = useTasks();
  const { toast } = useToast();
  
  useEffect(() => {
    if (entry) {
      setTitle(entry.title);
      setContent(entry.content);
      setTags(entry.tags || []);
      setCategory(entry.category);
      setUrl(entry.url || "");
      setIsEditing(false);
    }
  }, [entry]);
  
  const linkedTasks = entry ? getLinkedTasks(entry.id) : [];
  
  const handleSave = () => {
    if (!entry) return;
    
    updateEntry(entry.id, {
      title,
      content,
      tags,
      category,
      url: url || undefined
    });
    
    setIsEditing(false);
    toast({
      title: "Entry updated",
      description: "Your knowledge entry has been updated",
      duration: 3000,
    });
  };
  
  const handleGenerateAiSummary = () => {
    if (!entry) return;
    
    const summary = generateAiSummary(entry);
    
    toast({
      title: "AI Summary Generated",
      description: "A summary has been created for this entry",
      duration: 3000,
    });
  };
  
  const handleRemoveTaskLink = (taskId: string) => {
    if (!entry) return;
    
    unlinkTaskFromEntry(entry.id, taskId);
  };
  
  const getCategoryIcon = (catValue: KnowledgeCategory) => {
    switch (catValue) {
      case "inbox": return <Inbox className="h-4 w-4" />;
      case "projects": return <FileSpreadsheet className="h-4 w-4" />;
      case "areas": return <FolderOpen className="h-4 w-4" />;
      case "resources": return <FileText className="h-4 w-4" />;
      case "archives": return <Archive className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl h-[85vh]">
        <DialogHeader>
          <DialogTitle className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              {entry && getCategoryIcon(entry.category)}
              {isEditing ? (
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="font-semibold text-lg"
                  placeholder="Entry title"
                />
              ) : (
                <span>{entry?.title}</span>
              )}
            </div>
            
            {!isEditing && (
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setIsEditing(true)}
                >
                  Edit
                </Button>
                <Button 
                  variant="default" 
                  size="sm"
                  onClick={handleGenerateAiSummary}
                  className="flex items-center gap-1"
                >
                  <Sparkles className="h-4 w-4" />
                  AI Summary
                </Button>
              </div>
            )}
            
            {isEditing && (
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => {
                    if (entry) {
                      setTitle(entry.title);
                      setContent(entry.content);
                      setTags(entry.tags);
                      setCategory(entry.category);
                      setUrl(entry.url || "");
                      setIsEditing(false);
                    }
                  }}
                >
                  Cancel
                </Button>
                <Button 
                  variant="default" 
                  size="sm"
                  onClick={handleSave}
                  className="flex items-center gap-1"
                >
                  <Save className="h-4 w-4" />
                  Save
                </Button>
              </div>
            )}
          </DialogTitle>
        </DialogHeader>
        
        {entry && (
          <div className="flex flex-col h-full overflow-hidden">
            {/* Metadata Bar */}
            <div className="flex items-center gap-4 mb-4 text-xs text-muted-foreground">
              <div className="flex items-center">
                <CalendarIcon className="h-3 w-3 mr-1" />
                <span>Created: {format(new Date(entry.createdAt), "MMM d, yyyy")}</span>
              </div>
              <div className="flex items-center">
                <CalendarIcon className="h-3 w-3 mr-1" />
                <span>Updated: {format(new Date(entry.updatedAt), "MMM d, yyyy")}</span>
              </div>
              
              {isEditing && (
                <div className="ml-auto">
                  <Label htmlFor="category" className="mr-2">Category:</Label>
                  <Select value={category} onValueChange={(val: KnowledgeCategory) => setCategory(val)}>
                    <SelectTrigger id="category" className="h-7 w-[130px] text-xs">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="inbox">
                        <div className="flex items-center">
                          <Inbox className="h-3.5 w-3.5 mr-1.5" /> Inbox
                        </div>
                      </SelectItem>
                      <SelectItem value="projects">
                        <div className="flex items-center">
                          <FileSpreadsheet className="h-3.5 w-3.5 mr-1.5" /> Projects
                        </div>
                      </SelectItem>
                      <SelectItem value="areas">
                        <div className="flex items-center">
                          <FolderOpen className="h-3.5 w-3.5 mr-1.5" /> Areas
                        </div>
                      </SelectItem>
                      <SelectItem value="resources">
                        <div className="flex items-center">
                          <FileText className="h-3.5 w-3.5 mr-1.5" /> Resources
                        </div>
                      </SelectItem>
                      <SelectItem value="archives">
                        <div className="flex items-center">
                          <Archive className="h-3.5 w-3.5 mr-1.5" /> Archives
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
              
              {!isEditing && (
                <div className="ml-auto flex items-center">
                  <span className="flex items-center gap-1">
                    {getCategoryIcon(entry.category)}
                    <span className="capitalize">{entry.category}</span>
                  </span>
                </div>
              )}
            </div>
            
            {/* Tags */}
            <div className="mb-4">
              {isEditing ? (
                <div className="mb-3">
                  <Label htmlFor="tags" className="mb-1 block">Tags</Label>
                  <TagInput
                    id="tags"
                    value={tags}
                    onChange={setTags}
                    placeholder="Add tags..."
                  />
                </div>
              ) : (
                entry.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {entry.tags.map(tag => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )
              )}
            </div>
            
            {/* URL field */}
            {isEditing && (
              <div className="mb-4">
                <Label htmlFor="url" className="mb-1 block">Web URL (optional)</Label>
                <div className="flex items-center">
                  <ExternalLink className="h-4 w-4 mr-2 text-muted-foreground" />
                  <Input
                    id="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://example.com/article"
                  />
                </div>
              </div>
            )}
            
            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 overflow-hidden flex flex-col">
              <TabsList className="self-start mb-2">
                <TabsTrigger value="content" className="text-xs">Content</TabsTrigger>
                {entry.aiSummary && (
                  <TabsTrigger value="ai-summary" className="text-xs">AI Summary</TabsTrigger>
                )}
                {linkedTasks.length > 0 && (
                  <TabsTrigger value="linked-tasks" className="text-xs">Linked Tasks</TabsTrigger>
                )}
                {entry.fileAttachment && (
                  <TabsTrigger value="attachments" className="text-xs">Attachments</TabsTrigger>
                )}
              </TabsList>
              
              <div className="flex-1 overflow-auto">
                <TabsContent value="content" className="h-full m-0">
                  {isEditing ? (
                    <Textarea 
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="Enter knowledge content here..."
                      className="min-h-[300px] h-full resize-none"
                    />
                  ) : (
                    <div className="prose prose-sm max-w-none dark:prose-invert">
                      <pre className="whitespace-pre-wrap font-sans">{entry.content}</pre>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="ai-summary" className="m-0">
                  {entry.aiSummary ? (
                    <div className="border-l-4 border-primary/30 pl-4 py-2 bg-muted/30 rounded-r-md">
                      <h3 className="flex items-center gap-1 text-sm font-medium mb-2">
                        <Sparkles className="h-4 w-4 text-primary" />
                        AI-Generated Summary
                      </h3>
                      <p className="text-sm">{entry.aiSummary}</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center p-8">
                      <Sparkles className="h-10 w-10 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium">No AI Summary Yet</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Generate an AI summary to get key points from this entry.
                      </p>
                      <Button onClick={handleGenerateAiSummary}>
                        <Sparkles className="h-4 w-4 mr-2" />
                        Generate Summary
                      </Button>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="linked-tasks" className="m-0">
                  <div className="space-y-2">
                    <h3 className="flex items-center gap-1 text-sm font-medium mb-2">
                      <Link2 className="h-4 w-4" />
                      Linked Tasks
                    </h3>
                    
                    {linkedTasks.length > 0 ? (
                      linkedTasks.map((task: any) => (
                        <div key={task.id} className="border rounded-md p-3 flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-muted-foreground" />
                            <span>{task.title}</span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveTaskLink(task.id)}
                          >
                            Unlink
                          </Button>
                        </div>
                      ))
                    ) : (
                      <div className="text-muted-foreground text-center py-4">
                        No tasks linked to this entry yet
                      </div>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="attachments" className="m-0">
                  {entry.fileAttachment ? (
                    <div className="border rounded-md p-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-muted p-3 rounded">
                          <Paperclip className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <div>
                          <h4 className="font-medium">{entry.fileAttachment.name}</h4>
                          <p className="text-xs text-muted-foreground">
                            {entry.fileAttachment.type} · {(entry.fileAttachment.size / 1024).toFixed(1)} KB
                          </p>
                        </div>
                        <Button variant="outline" size="sm" className="ml-auto">
                          Download
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center p-8">
                      <Paperclip className="h-10 w-10 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium">No Attachments</h3>
                      <p className="text-sm text-muted-foreground">
                        This entry doesn't have any file attachments.
                      </p>
                    </div>
                  )}
                </TabsContent>
              </div>
            </Tabs>
            
            {/* URL Display */}
            {entry.url && !isEditing && (
              <div className="mt-4 flex items-center gap-2 p-2 bg-muted/30 rounded-md">
                <ExternalLink className="h-4 w-4 text-muted-foreground" />
                <a 
                  href={entry.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline overflow-hidden text-ellipsis"
                >
                  {entry.url}
                </a>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EntryDialog;
