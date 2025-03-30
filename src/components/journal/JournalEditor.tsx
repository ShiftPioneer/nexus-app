
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Smile, Meh, Frown, X } from "lucide-react";

interface JournalEditorProps {
  initialEntry: JournalEntry;
  onSave: (entry: JournalEntry) => void;
  onCancel: () => void;
}

const JournalEditor: React.FC<JournalEditorProps> = ({ initialEntry, onSave, onCancel }) => {
  const [entry, setEntry] = useState<JournalEntry>({ ...initialEntry });
  const [tagInput, setTagInput] = useState("");
  const [activeTab, setActiveTab] = useState("reflections");
  
  // Structured reflection questions
  const [reflections, setReflections] = useState({
    intentions: initialEntry.content.includes("Today's intentions:") ? 
      initialEntry.content.split("Today's intentions:")[1]?.split("3 Morning Affirmations:")[0]?.trim() : "",
    morningAffirmations: initialEntry.content.includes("3 Morning Affirmations:") ? 
      initialEntry.content.split("3 Morning Affirmations:")[1]?.split("3 Things I'm Grateful For:")[0]?.trim() : "",
    gratitude: initialEntry.content.includes("3 Things I'm Grateful For:") ? 
      initialEntry.content.split("3 Things I'm Grateful For:")[1]?.split("What Would make Today Great:")[0]?.trim() : "",
    makeTodayGreat: initialEntry.content.includes("What Would make Today Great:") ? 
      initialEntry.content.split("What Would make Today Great:")[1]?.split("Highlight of The Day:")[0]?.trim() : "",
    highlight: initialEntry.content.includes("Highlight of The Day:") ? 
      initialEntry.content.split("Highlight of The Day:")[1]?.split("3 Night Affirmations:")[0]?.trim() : "",
    nightAffirmations: initialEntry.content.includes("3 Night Affirmations:") ? 
      initialEntry.content.split("3 Night Affirmations:")[1]?.split("What Made Today Great/Bad:")[0]?.trim() : "",
    todayEvaluation: initialEntry.content.includes("What Made Today Great/Bad:") ? 
      initialEntry.content.split("What Made Today Great/Bad:")[1]?.split("What Can Be Improved/Fixed:")[0]?.trim() : "",
    improvement: initialEntry.content.includes("What Can Be Improved/Fixed:") ? 
      initialEntry.content.split("What Can Be Improved/Fixed:")[1]?.split("Feel Free:")[0]?.trim() : "",
    freeThoughts: initialEntry.content.includes("Feel Free:") ? 
      initialEntry.content.split("Feel Free:")[1]?.trim() : "",
  });
  
  // Notes section
  const [notes, setNotes] = useState(initialEntry.content);

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
  
  const handleReflectionChange = (field: keyof typeof reflections, value: string) => {
    setReflections(prev => ({ ...prev, [field]: value }));
  };
  
  const handleSave = () => {
    let finalContent = "";
    
    if (activeTab === "reflections") {
      finalContent += "Today's intentions: " + reflections.intentions + "\n\n";
      finalContent += "3 Morning Affirmations: " + reflections.morningAffirmations + "\n\n";
      finalContent += "3 Things I'm Grateful For: " + reflections.gratitude + "\n\n";
      finalContent += "What Would make Today Great: " + reflections.makeTodayGreat + "\n\n";
      finalContent += "Highlight of The Day: " + reflections.highlight + "\n\n";
      finalContent += "3 Night Affirmations: " + reflections.nightAffirmations + "\n\n";
      finalContent += "What Made Today Great/Bad: " + reflections.todayEvaluation + "\n\n";
      finalContent += "What Can Be Improved/Fixed: " + reflections.improvement + "\n\n";
      finalContent += "Feel Free: " + reflections.freeThoughts;
    } else {
      finalContent = notes;
    }
    
    onSave({
      ...entry,
      content: finalContent
    });
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

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="reflections">Reflections</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
        </TabsList>
        
        <TabsContent value="reflections" className="space-y-4">
          <div className="space-y-3">
            <div>
              <Label htmlFor="intentions">Today's intentions</Label>
              <Textarea
                id="intentions"
                placeholder="What do you intend to focus on today?"
                value={reflections.intentions}
                onChange={(e) => handleReflectionChange("intentions", e.target.value)}
                className="mt-1 resize-none"
                rows={3}
              />
            </div>
            
            <div>
              <Label htmlFor="morningAffirmations">3 Morning Affirmations</Label>
              <Textarea
                id="morningAffirmations"
                placeholder="Write three positive affirmations for your morning"
                value={reflections.morningAffirmations}
                onChange={(e) => handleReflectionChange("morningAffirmations", e.target.value)}
                className="mt-1 resize-none"
                rows={3}
              />
            </div>
            
            <div>
              <Label htmlFor="gratitude">3 Things I'm Grateful For</Label>
              <Textarea
                id="gratitude"
                placeholder="What are you grateful for today?"
                value={reflections.gratitude}
                onChange={(e) => handleReflectionChange("gratitude", e.target.value)}
                className="mt-1 resize-none"
                rows={3}
              />
            </div>
            
            <div>
              <Label htmlFor="makeTodayGreat">What Would make Today Great</Label>
              <Textarea
                id="makeTodayGreat"
                placeholder="What actions or events would make today great?"
                value={reflections.makeTodayGreat}
                onChange={(e) => handleReflectionChange("makeTodayGreat", e.target.value)}
                className="mt-1 resize-none"
                rows={3}
              />
            </div>
            
            <div>
              <Label htmlFor="highlight">Highlight of The Day</Label>
              <Textarea
                id="highlight"
                placeholder="What was the best moment of your day?"
                value={reflections.highlight}
                onChange={(e) => handleReflectionChange("highlight", e.target.value)}
                className="mt-1 resize-none"
                rows={3}
              />
            </div>
            
            <div>
              <Label htmlFor="nightAffirmations">3 Night Affirmations</Label>
              <Textarea
                id="nightAffirmations"
                placeholder="Write three positive affirmations for your evening"
                value={reflections.nightAffirmations}
                onChange={(e) => handleReflectionChange("nightAffirmations", e.target.value)}
                className="mt-1 resize-none"
                rows={3}
              />
            </div>
            
            <div>
              <Label htmlFor="todayEvaluation">What Made Today Great/Bad</Label>
              <Textarea
                id="todayEvaluation"
                placeholder="Reflect on what went well and what didn't"
                value={reflections.todayEvaluation}
                onChange={(e) => handleReflectionChange("todayEvaluation", e.target.value)}
                className="mt-1 resize-none"
                rows={3}
              />
            </div>
            
            <div>
              <Label htmlFor="improvement">What Can Be Improved/Fixed</Label>
              <Textarea
                id="improvement"
                placeholder="What can you improve tomorrow?"
                value={reflections.improvement}
                onChange={(e) => handleReflectionChange("improvement", e.target.value)}
                className="mt-1 resize-none"
                rows={3}
              />
            </div>
            
            <div>
              <Label htmlFor="freeThoughts">Feel Free</Label>
              <Textarea
                id="freeThoughts"
                placeholder="Express any additional thoughts or feelings"
                value={reflections.freeThoughts}
                onChange={(e) => handleReflectionChange("freeThoughts", e.target.value)}
                className="mt-1 resize-y"
                rows={5}
              />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="notes">
          <div>
            <Label htmlFor="content">Journal Content</Label>
            <Textarea
              id="content"
              name="content"
              placeholder="Write your thoughts here..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="min-h-[300px] mt-1 resize-y"
            />
          </div>
        </TabsContent>
      </Tabs>

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
          onClick={handleSave} 
          disabled={!entry.title.trim()}
        >
          Save Entry
        </Button>
      </div>
    </div>
  );
};

export default JournalEditor;
