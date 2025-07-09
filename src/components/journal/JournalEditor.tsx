import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import PromptSection from "./editor/PromptSection";
import EntryTabs from "./editor/EntryTabs";
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
  const creativityPrompts = ["What breakthrough moment did you experience today that shifted your perspective?", "If you could send a message to your future self one year from now, what would you say?", "What's one belief you held this morning that you're questioning tonight?", "Describe a moment today when you felt most authentically yourself.", "What would you do differently if you knew no one was watching or judging?"];
  const mindfulnessPrompts = ["What three things brought you genuine joy today, no matter how small?", "Describe a moment when you felt completely present and aware.", "What sensations, sounds, or sights made you pause and appreciate the moment?", "How did your body feel throughout the day? What was it trying to tell you?", "What would you tell someone who needs to hear words of encouragement right now?"];
  const growthPrompts = ["What challenge today helped you discover a new strength?", "How did you step outside your comfort zone, even in a small way?", "What would your most confident self do in your current situation?", "What skill or quality do you want to develop further?", "How have you grown in ways that aren't easily measured?"];
  const visionPrompts = ["What legacy do you want to create through your daily actions?", "How does today's experience connect to your bigger purpose?", "What would your life look like if you fully believed in your potential?", "What impact do you want to have on the people around you?", "How can you make tomorrow more aligned with your deepest values?"];
  const getPromptsForCategory = (category: string) => {
    switch (category) {
      case 'creativity':
        return creativityPrompts;
      case 'mindfulness':
        return mindfulnessPrompts;
      case 'growth':
        return growthPrompts;
      case 'vision':
        return visionPrompts;
      default:
        return mindfulnessPrompts;
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
    intentions: "",
    morningAffirmations: "",
    gratitude: "",
    makeTodayGreat: "",
    highlight: "",
    nightAffirmations: "",
    todayEvaluation: "",
    improvement: "",
    freeThoughts: ""
  });
  const [notes, setNotes] = useState(initialEntry.content);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      name,
      value
    } = e.target;
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
  const handleCategoryChange = (category: string) => {
    setCurrentCategory(category);
    setTimeout(generateRandomPrompt, 100);
  };
  return <div className="space-y-6 max-w-4xl mx-auto bg-slate-900">
      <PromptSection currentPrompt={currentPrompt} currentCategory={currentCategory} onCategoryChange={handleCategoryChange} onGeneratePrompt={generateRandomPrompt} onUsePrompt={usePromptInEditor} />

      <motion.div className="space-y-2" initial={{
      opacity: 0,
      x: -20
    }} animate={{
      opacity: 1,
      x: 0
    }} transition={{
      delay: 0.1
    }}>
        <Label htmlFor="title" className="text-white font-semibold text-base">Entry Title</Label>
        <Input id="title" name="title" placeholder="Give your entry a meaningful title..." value={entry.title} onChange={handleChange} className="h-12 text-base bg-slate-800/50 border-slate-600/50 text-white placeholder-slate-400 focus:border-primary focus:ring-primary/20 transition-all duration-200" />
      </motion.div>

      <EntryTabs activeTab={activeTab} onTabChange={setActiveTab} reflections={reflections} onReflectionChange={handleReflectionChange} notes={notes} onNotesChange={setNotes} />

      <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-6" initial={{
      opacity: 0,
      y: 20
    }} animate={{
      opacity: 1,
      y: 0
    }} transition={{
      delay: 0.3
    }}>
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
            <TagManager tags={entry.tags} tagInput={tagInput} onTagInputChange={setTagInput} onAddTag={handleAddTag} onRemoveTag={handleRemoveTag} />
          </CardContent>
        </Card>
      </motion.div>

      <motion.div className="flex justify-end gap-3 pt-6" initial={{
      opacity: 0,
      y: 20
    }} animate={{
      opacity: 1,
      y: 0
    }} transition={{
      delay: 0.4
    }}>
        <Button variant="outline" onClick={onCancel} className="bg-slate-800/50 border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white transition-all duration-200">
          Cancel
        </Button>
        <Button onClick={handleSave} disabled={!entry.title.trim()} className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 transition-all duration-200">
          Save Entry
        </Button>
      </motion.div>
    </div>;
};
export default JournalEditor;