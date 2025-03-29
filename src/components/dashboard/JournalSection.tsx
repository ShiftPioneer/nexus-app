
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, PenSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const todayPrompt = {
  title: "Reflection Prompt",
  question: "What are three things that went well today, and why did they matter to you?",
  icon: <PenSquare className="h-5 w-5 text-primary" />,
}

const JournalSection = () => {
  const { toast } = useToast();
  
  const handleCreateEntry = () => {
    toast({
      description: "Journal feature coming soon!",
    });
  };
  
  return (
    <section className="mb-6">
      <Card className="border-dashed border-2 bg-card/50">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Daily Journal
              </CardTitle>
              <CardDescription>Capture your thoughts and reflections</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="max-w-md mx-auto">
              <div className="flex justify-center mb-4">
                {todayPrompt.icon}
              </div>
              <h3 className="text-lg font-medium mb-2">{todayPrompt.title}</h3>
              <p className="text-muted-foreground mb-6">
                "{todayPrompt.question}"
              </p>
              <Button onClick={handleCreateEntry} className="gap-2">
                <PenSquare className="h-4 w-4" />
                <span>Create Today's Entry</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default JournalSection;
