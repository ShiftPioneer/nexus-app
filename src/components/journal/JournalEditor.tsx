
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import ReflectionFields from "./editor/ReflectionFields";
import MoodSelector from "./editor/MoodSelector";
import TagManager from "./editor/TagManager";

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
  
  const handleReflectionChange = (field: string, value: string) => {
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
          <ReflectionFields 
            reflections={reflections}
            onReflectionChange={handleReflectionChange}
          />
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

      <MoodSelector mood={entry.mood} onMoodChange={handleMoodChange} />

      <TagManager
        tags={entry.tags}
        tagInput={tagInput}
        onTagInputChange={setTagInput}
        onAddTag={handleAddTag}
        onRemoveTag={handleRemoveTag}
      />

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
