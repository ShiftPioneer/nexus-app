import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Lightbulb, Sparkles, RefreshCw, PenTool, BookOpen, Heart } from "lucide-react";
import { motion } from "framer-motion";
import ReflectionFields from "./editor/ReflectionFields";
import MoodSelector from "./editor/MoodSelector";
import TagManager from "./editor/TagManager";

interface JournalEditorProps {
  initialEntry: JournalEntry;
  onSave: (entry: JournalEntry) => void;
  onCancel: () => void;
}

const JournalEditor: React.FC<JournalEditorProps> = ({
  initialEntry,
  onSave,
  onCancel
}) => {
  const [entry, setEntry] = useState<JournalEntry>({
    ...initialEntry
  });
  const [tagInput, setTagInput] = useState("");
  const [activeTab, setActiveTab] = useState("reflections");
  const [currentPrompt, setCurrentPrompt] = useState("");

  // Enhanced prompts pool
  const enhancedPrompts = [
    "What breakthrough moment did you experience today that shifted your perspective?",
    "If you could send a message to your future self one year from now, what would you say?",
    "What's one belief you held this morning that you're questioning tonight?",
    "Describe a moment today when you felt most authentically yourself.",
    "What would you do differently if you knew no one was watching or judging?",
    "What's the most meaningful conversation you had today, and why did it matter?",
    "If your day was a movie, what would be the title and who would be the main character?",
    "What pattern in your thinking today would you like to transform?",
    "What's one thing you learned about yourself that surprised you?",
    "If you could relive one moment from today with more presence, which would it be?",
    "What question are you avoiding asking yourself right now?",
    "What would your wisest self tell you about today's challenges?",
    "What's one small action you took today that aligned with your biggest dreams?",
    "If today was a teacher, what was the main lesson?",
    "What would you tell someone going through exactly what you're experiencing?",
    "What's one thing you're grateful for that you usually take for granted?",
    "How did you grow today in a way that isn't measurable?",
    "What's one assumption you made today that might not be true?",
    "If you could bottle today's best feeling, what would you label it?",
    "What's one thing you forgave yourself for today?",
    "What would courage look like in your current situation?",
    "What story are you telling yourself about today, and is it serving you?",
    "What's one boundary you honored today that you're proud of?",
    "If you were mentoring someone exactly like you, what advice would you give?",
    "What's one thing you're excited to explore more deeply?"
  ];

  const generateRandomPrompt = () => {
    const randomIndex = Math.floor(Math.random() * enhancedPrompts.length);
    setCurrentPrompt(enhancedPrompts[randomIndex]);
  };

  React.useEffect(() => {
    if (!currentPrompt) {
      generateRandomPrompt();
    }
  }, []);

  // Structured reflection questions
  const [reflections, setReflections] = useState({
    intentions: initialEntry.content.includes("Today's intentions:") ? initialEntry.content.split("Today's intentions:")[1]?.split("3 Morning Affirmations:")[0]?.trim() : "",
    morningAffirmations: initialEntry.content.includes("3 Morning Affirmations:") ? initialEntry.content.split("3 Morning Affirmations:")[1]?.split("3 Things I'm Grateful For:")[0]?.trim() : "",
    gratitude: initialEntry.content.includes("3 Things I'm Grateful For:") ? initialEntry.content.split("3 Things I'm Grateful For:")[1]?.split("What Would make Today Great:")[0]?.trim() : "",
    makeTodayGreat: initialEntry.content.includes("What Would make Today Great:") ? initialEntry.content.split("What Would make Today Great:")[1]?.split("Highlight of The Day:")[0]?.trim() : "",
    highlight: initialEntry.content.includes("Highlight of The Day:") ? initialEntry.content.split("Highlight of The Day:")[1]?.split("3 Night Affirmations:")[0]?.trim() : "",
    nightAffirmations: initialEntry.content.includes("3 Night Affirmations:") ? initialEntry.content.split("3 Night Affirmations:")[1]?.split("What Made Today Great/Bad:")[0]?.trim() : "",
    todayEvaluation: initialEntry.content.includes("What Made Today Great/Bad:") ? initialEntry.content.split("What Made Today Great/Bad:")[1]?.split("What Can Be Improved/Fixed:")[0]?.trim() : "",
    improvement: initialEntry.content.includes("What Can Be Improved/Fixed:") ? initialEntry.content.split("What Can Be Improved/Fixed:")[1]?.split("Feel Free:")[0]?.trim() : "",
    freeThoughts: initialEntry.content.includes("Feel Free:") ? initialEntry.content.split("Feel Free:")[1]?.trim() : ""
  });

  // Notes section
  const [notes, setNotes] = useState(initialEntry.content);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEntry(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleMoodChange = (mood: string) => {
    setEntry(prev => ({
      ...prev,
      mood: mood as "positive" | "negative" | "neutral" | "mixed"
    }));
  };

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!entry.tags.includes(tagInput.trim())) {
        setEntry(prev => ({
          ...prev,
          tags: [...prev.tags, tagInput.trim()]
        }));
      }
      setTagInput("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setEntry(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  const handleReflectionChange = (field: string, value: string) => {
    setReflections(prev => ({
      ...prev,
      [field]: value
    }));
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

  const usePromptInEditor = () => {
    if (activeTab === "notes") {
      setNotes(prev => prev ? `${prev}\n\n${currentPrompt}\n\n` : `${currentPrompt}\n\n`);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Enhanced Prompt Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <Card className="bg-gradient-to-r from-purple-950/20 to-indigo-950/20 border-purple-500/30 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center">
                  <Lightbulb className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-purple-400" />
                    Today's Reflection Prompt
                  </CardTitle>
                  <p className="text-sm text-purple-300">Let this question guide your thoughts</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={generateRandomPrompt}
                  className="bg-purple-500/20 border-purple-500/30 text-purple-300 hover:bg-purple-500/30"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  New Prompt
                </Button>
                <Button
                  size="sm"
                  onClick={usePromptInEditor}
                  className="bg-purple-500 hover:bg-purple-600 text-white"
                >
                  Use This Prompt
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-slate-900/50 rounded-lg border border-purple-500/20">
              <p className="text-purple-200 italic text-lg leading-relaxed">
                "{currentPrompt}"
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Title Input */}
      <div className="space-y-2">
        <Label htmlFor="title" className="text-primary font-medium">Entry Title</Label>
        <Input
          id="title"
          name="title"
          placeholder="Give your entry a meaningful title..."
          value={entry.title}
          onChange={handleChange}
          className="bg-slate-900/50 border-slate-700 text-white placeholder-slate-400 focus:border-primary focus:ring-primary/20"
        />
      </div>

      {/* Enhanced Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 bg-slate-900/50 border border-slate-700">
          <TabsTrigger 
            value="reflections" 
            className="flex items-center gap-2 data-[state=active]:bg-slate-800 data-[state=active]:text-white"
          >
            <Heart className="h-4 w-4" />
            Structured Reflection
          </TabsTrigger>
          <TabsTrigger 
            value="notes"
            className="flex items-center gap-2 data-[state=active]:bg-slate-800 data-[state=active]:text-white"
          >
            <PenTool className="h-4 w-4" />
            Free Writing
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="reflections" className="space-y-4 mt-6">
          <Card className="bg-slate-900/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                Daily Reflection Questions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ReflectionFields 
                reflections={reflections} 
                onReflectionChange={handleReflectionChange} 
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notes" className="mt-6">
          <Card className="bg-slate-900/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <PenTool className="h-5 w-5 text-primary" />
                Free Writing Space
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                id="content"
                name="content"
                placeholder="Let your thoughts flow freely here..."
                value={notes}
                onChange={e => setNotes(e.target.value)}
                className="min-h-[300px] bg-slate-800/50 border-slate-600 text-white placeholder-slate-400 focus:border-primary focus:ring-primary/20 resize-none"
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Mood and Tags */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-slate-900/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white text-lg">Mood Tracker</CardTitle>
          </CardHeader>
          <CardContent>
            <MoodSelector mood={entry.mood} onMoodChange={handleMoodChange} />
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white text-lg">Tags</CardTitle>
          </CardHeader>
          <CardContent>
            <TagManager 
              tags={entry.tags} 
              tagInput={tagInput} 
              onTagInputChange={setTagInput} 
              onAddTag={handleAddTag} 
              onRemoveTag={handleRemoveTag} 
            />
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 pt-6">
        <Button 
          variant="outline" 
          onClick={onCancel}
          className="bg-slate-800/50 border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white"
        >
          Cancel
        </Button>
        <Button 
          onClick={handleSave} 
          disabled={!entry.title.trim()}
          className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20"
        >
          Save Entry
        </Button>
      </div>
    </div>
  );
};

export default JournalEditor;
