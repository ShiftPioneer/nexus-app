import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lightbulb, RefreshCw, Sparkles, Brain, Zap, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

// Enhanced prompts with categories for more creativity
const creativityPrompts = [
  "What would your future self thank you for starting today?",
  "Describe a moment when you felt completely alive and present",
  "If you could have a conversation with any version of yourself, what would you discuss?",
  "What belief about yourself would you like to challenge this week?",
  "How has a recent failure actually been a disguised gift?",
  "What would you do if you knew you couldn't fail?",
  "Describe the energy you want to bring into tomorrow",
  "What story are you telling yourself that might not be true?",
  "If your life was a book, what would this chapter be titled?",
  "What would you do if you had unlimited courage for one day?",
  "How can you turn today's frustration into tomorrow's wisdom?",
  "What's one way you've grown that you haven't acknowledged yet?",
  "If you could send a message to someone who needs to hear it, what would you say?",
  "What pattern in your life are you ready to break?",
  "How can you honor both your ambition and your need for rest today?"
];

const reflectionPrompts = [
  "What are three things I'm grateful for today?",
  "What's one challenge I faced today and how did I overcome it?",
  "What did I learn today that I can apply in the future?",
  "What's one thing I could have done better today?",
  "What am I looking forward to tomorrow?",
  "How did I take care of myself today?",
  "What made me smile or laugh today?",
  "What progress did I make on my goals today?",
  "What's one thing that surprised me today?",
  "If I could change one thing about today, what would it be?"
];

const insightPrompts = [
  "What assumption am I making that I should question?",
  "How is my current environment shaping my thoughts and behaviors?",
  "What would I do differently if I truly believed in my own potential?",
  "What's the story I keep telling myself, and is it serving me?",
  "How can I turn my biggest weakness into a strength?",
  "What would my most confident self do in this situation?",
  "What am I avoiding that I know would benefit me?",
  "How can I bring more intention to my daily actions?",
  "What would happen if I stopped seeking approval from others?",
  "What's one thing I can do today to surprise myself?"
];

const JournalPrompts: React.FC = () => {
  const { toast } = useToast();
  const [currentPrompt, setCurrentPrompt] = React.useState<string>(() => {
    const allPrompts = [...creativityPrompts, ...reflectionPrompts, ...insightPrompts];
    return allPrompts[Math.floor(Math.random() * allPrompts.length)];
  });
  const [currentCategory, setCurrentCategory] = React.useState<string>('creativity');

  const getNewPrompt = () => {
    let newPrompt;
    let promptArray;
    
    switch (currentCategory) {
      case 'creativity':
        promptArray = creativityPrompts;
        break;
      case 'reflection':
        promptArray = reflectionPrompts;
        break;
      case 'insight':
        promptArray = insightPrompts;
        break;
      default:
        promptArray = [...creativityPrompts, ...reflectionPrompts, ...insightPrompts];
    }
    
    do {
      newPrompt = promptArray[Math.floor(Math.random() * promptArray.length)];
    } while (newPrompt === currentPrompt && promptArray.length > 1);
    
    setCurrentPrompt(newPrompt);
  };

  const handleUsePrompt = () => {
    toast({
      title: "Prompt Applied",
      description: "This inspiring prompt is ready for your journal entry."
    });
  };

  const categories = [
    { key: 'creativity', label: 'Creative', icon: Sparkles, color: 'text-purple-400' },
    { key: 'reflection', label: 'Reflect', icon: Brain, color: 'text-blue-400' },
    { key: 'insight', label: 'Insight', icon: Zap, color: 'text-yellow-400' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-sm border-slate-700/50 hover:border-slate-600/50 transition-all duration-300">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl flex items-center gap-3 text-white">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center">
              <Lightbulb className="h-5 w-5 text-white" />
            </div>
            <div>
              <span>Creative Prompts</span>
              <p className="text-sm font-normal text-slate-400 mt-1">Spark your imagination and deeper thinking</p>
            </div>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Category Selection */}
          <div className="flex gap-2">
            {categories.map((category) => (
              <Button
                key={category.key}
                variant={currentCategory === category.key ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setCurrentCategory(category.key);
                  setTimeout(getNewPrompt, 100);
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
              <p className="text-slate-200 leading-relaxed italic font-medium">
                "{currentPrompt}"
              </p>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={getNewPrompt} 
              className="flex items-center gap-2 bg-slate-800/50 border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white hover:border-slate-500 transition-all duration-200"
            >
              <RefreshCw className="h-4 w-4" />
              Generate New
            </Button>
            <Button 
              onClick={handleUsePrompt}
              className="flex items-center gap-2 bg-gradient-to-r from-primary to-orange-500 hover:from-primary/90 hover:to-orange-500/90 text-white shadow-lg shadow-primary/20 transition-all duration-200"
            >
              <Send className="h-4 w-4" />
              Use This Prompt
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default JournalPrompts;