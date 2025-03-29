
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lightbulb, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const prompts = [
  "What are three things I'm grateful for today?",
  "What's one challenge I faced today and how did I overcome it?",
  "What did I learn today that I can apply in the future?",
  "What's one thing I could have done better today?",
  "What am I looking forward to tomorrow?",
  "How did I take care of myself today?",
  "What made me smile or laugh today?",
  "What progress did I make on my goals today?",
  "What's one thing that surprised me today?",
  "If I could change one thing about today, what would it be?",
  "Who did I connect with today and how did it make me feel?",
  "What's one thing I did today that aligned with my values?",
  "What's something I need to let go of?",
  "How did I push myself out of my comfort zone today?",
  "What's a small win I achieved today?"
];

const JournalPrompts: React.FC = () => {
  const { toast } = useToast();
  const [currentPrompt, setCurrentPrompt] = React.useState<string>(() => {
    return prompts[Math.floor(Math.random() * prompts.length)];
  });

  const getNewPrompt = () => {
    let newPrompt;
    do {
      newPrompt = prompts[Math.floor(Math.random() * prompts.length)];
    } while (newPrompt === currentPrompt && prompts.length > 1);
    
    setCurrentPrompt(newPrompt);
  };

  const handleUsePrompt = () => {
    // In a real app, this would populate the journal editor
    toast({
      title: "Prompt Selected",
      description: "The prompt has been applied to your journal entry.",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-amber-500" />
          Journal Prompts
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-muted/50 p-4 rounded-lg">
          <p className="italic">"{currentPrompt}"</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={getNewPrompt} className="flex items-center gap-1">
            <RefreshCw className="h-3.5 w-3.5" />
            New Prompt
          </Button>
          <Button size="sm" onClick={handleUsePrompt}>
            Use This Prompt
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default JournalPrompts;
