import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Lightbulb, Sparkles, RefreshCw, PenTool, BookOpen, Heart, Zap, Send, Stars } from "lucide-react";
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
  const [currentCategory, setCurrentCategory] = useState<string>('mindfulness');

  // Enhanced creative prompts organized by category
  const creativityPrompts = [
    "What breakthrough moment did you experience today that shifted your perspective?",
    "If you could send a message to your future self one year from now, what would you say?",
    "What's one belief you held this morning that you're questioning tonight?",
    "Describe a moment today when you felt most authentically yourself.",
    "What would you do differently if you knew no one was watching or judging?",
    "What's the most meaningful conversation you had today, and why did it matter?",
    "If your day was a movie, what would be the title and who would be the main character?",
    "What pattern in your thinking today would you like to transform?",
    "What's one thing you learned about yourself that surprised you?",
    "If you could relive one moment from today with more presence, which would it be?"
  ];

  const mindfulnessPrompts = [
    "What three things brought you genuine joy today, no matter how small?",
    "Describe a moment when you felt completely present and aware.",
    "What sensations, sounds, or sights made you pause and appreciate the moment?",
    "How did your body feel throughout the day? What was it trying to tell you?",
    "What would you tell someone who needs to hear words of encouragement right now?",
    "What are you most grateful for that you usually take for granted?",
    "How can you show yourself the same compassion you'd show a dear friend?",
    "What small act of kindness did you witness or perform today?",
    "If you could bottle today's most peaceful moment, how would you describe it?",
    "What's one way you honored your needs and boundaries today?"
  ];

  const growthPrompts = [
    "What challenge today helped you discover a new strength?",
    "How did you step outside your comfort zone, even in a small way?",
    "What would your most confident self do in your current situation?",
    "What skill or quality do you want to develop further?",
    "How have you grown in ways that aren't easily measured?",
    "What's one assumption you made today that might not be true?",
    "What would happen if you stopped seeking approval from others?",
    "How can you turn today's frustration into tomorrow's wisdom?",
    "What story are you telling yourself, and is it serving your growth?",
    "What's one small action you can take tomorrow to align with your values?"
  ];

  const visionPrompts = [
    "What legacy do you want to create through your daily actions?",
    "How does today's experience connect to your bigger purpose?",
    "What would your life look like if you fully believed in your potential?",
    "What impact do you want to have on the people around you?",
    "How can you make tomorrow more aligned with your deepest values?",
    "What dream or goal deserves more of your attention and energy?",
    "If you could solve one problem in the world, what would it be?",
    "What would you attempt if you knew you couldn't fail?",
    "How can you be a better version of yourself tomorrow?",
    "What change do you want to see, starting with yourself?"
  ];

  const getPromptsForCategory = (category: string) => {
    switch (category) {
      case 'creativity': return creativityPrompts;
      case 'mindfulness': return mindfulnessPrompts;
      case 'growth': return growthPrompts;
      case 'vision': return visionPrompts;
      default: return mindfulnessPrompts;
    }
  };

  const generateRandomPrompt = () => {
    const promptArray = getPromptsForCategory(currentCategory);
    let newPrompt;
    do {
      newPrompt = promptArray[Math.floor(Math.random() * promptArray.length)];
    } while (newPrompt === currentPrompt && promptArray.length > 1);
    setCurrentPrompt(newPrompt);
  };

  React.useEffect(() => {
    if (!currentPrompt) {
      generateRandomPrompt();
    }
  }, [currentCategory]);

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

  const categories = [
    { key: 'mindfulness', label: 'Mindfulness', icon: Heart, color: 'text-emerald-400', gradient: 'from-emerald-500/20 to-teal-500/20' },
    { key: 'creativity', label: 'Creative', icon: Sparkles, color: 'text-purple-400', gradient: 'from-purple-500/20 to-indigo-500/20' },
    { key: 'growth', label: 'Growth', icon: Zap, color: 'text-blue-400', gradient: 'from-blue-500/20 to-cyan-500/20' },
    { key: 'vision', label: 'Vision', icon: Stars, color: 'text-orange-400', gradient: 'from-orange-500/20 to-red-500/20' }
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Enhanced Prompt Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <Card className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-sm border-slate-700/50 hover:border-slate-600/50 transition-all duration-300">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center shadow-lg">
                  <Lightbulb className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-amber-400" />
                    Creative Writing Prompts
                  </CardTitle>
                  <p className="text-sm text-slate-400">Spark deeper reflection and creativity</p>
                </div>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Category Selection */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {categories.map((category) => (
                <Button
                  key={category.key}
                  variant={currentCategory === category.key ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    setCurrentCategory(category.key);
                    setTimeout(generateRandomPrompt, 100);
                  }}
                  className={`flex items-center gap-2 transition-all duration-200 ${
                    currentCategory === category.key
                      ? "bg-primary text-white shadow-lg shadow-primary/20"
                      : "bg-slate-800/50 border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white"
                  }`}
                >
                  <category.icon className={`h-3.5 w-3.5 ${currentCategory === category.key ? 'text-white' : category.color}`} />
                  {category.label}
                </Button>
              ))}
            </div>

            {/* Current Prompt */}
            <motion.div
              key={currentPrompt}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="relative"
            >
              <div className="bg-gradient-to-r from-slate-800/50 to-slate-700/50 p-6 rounded-xl border border-slate-600/30">
                <div className="absolute top-4 right-4 text-slate-500">
                  <Sparkles className="h-4 w-4" />
                </div>
                <p className="text-slate-200 leading-relaxed italic font-medium text-lg">
                  "{currentPrompt}"
                </p>
              </div>
            </motion.div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={generateRandomPrompt} 
                className="flex items-center gap-2 bg-slate-800/50 border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white hover:border-slate-500 transition-all duration-200"
              >
                <RefreshCw className="h-4 w-4" />
                Generate New
              </Button>
              <Button 
                onClick={usePromptInEditor}
                className="flex items-center gap-2 bg-gradient-to-r from-primary to-orange-500 hover:from-primary/90 hover:to-orange-500/90 text-white shadow-lg shadow-primary/20 transition-all duration-200"
              >
                <Send className="h-4 w-4" />
                Use This Prompt
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Title Input */}
      <motion.div 
        className="space-y-2"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Label htmlFor="title" className="text-white font-semibold text-base">Entry Title</Label>
        <Input
          id="title"
          name="title"
          placeholder="Give your entry a meaningful title..."
          value={entry.title}
          onChange={handleChange}
          className="h-12 text-base bg-slate-800/50 border-slate-600/50 text-white placeholder-slate-400 focus:border-primary focus:ring-primary/20 transition-all duration-200"
        />
      </motion.div>

      {/* Enhanced Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 bg-slate-900/50 border border-slate-700 p-1 rounded-xl">
            <TabsTrigger 
              value="reflections" 
              className="flex items-center gap-2 data-[state=active]:bg-slate-800 data-[state=active]:text-white rounded-lg transition-all duration-200"
            >
              <Heart className="h-4 w-4" />
              Structured Reflection
            </TabsTrigger>
            <TabsTrigger 
              value="notes"
              className="flex items-center gap-2 data-[state=active]:bg-slate-800 data-[state=active]:text-white rounded-lg transition-all duration-200"
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
                  placeholder="Let your thoughts flow freely here..."
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  className="min-h-[300px] bg-slate-800/50 border-slate-600 text-white placeholder-slate-400 focus:border-primary focus:ring-primary/20 resize-none transition-all duration-200"
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>

      {/* Mood and Tags */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
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
      </motion.div>

      {/* Action Buttons */}
      <motion.div 
        className="flex justify-end gap-3 pt-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Button 
          variant="outline" 
          onClick={onCancel}
          className="bg-slate-800/50 border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white transition-all duration-200"
        >
          Cancel
        </Button>
        <Button 
          onClick={handleSave} 
          disabled={!entry.title.trim()}
          className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 transition-all duration-200"
        >
          Save Entry
        </Button>
      </motion.div>
    </div>
  );
};

export default JournalEditor;
