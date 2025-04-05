
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, PenTool } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const JournalSection = () => {
  const navigate = useNavigate();
  
  const handleCreateEntry = () => {
    // Navigate to the journal page and signal to create a new entry
    navigate('/journal?new=true');
  };
  
  return (
    <Card className="border-dashed border-gray-600 bg-[#131729] text-white">
      <CardContent className="p-4 text-center space-y-2">
        <div className="flex items-center justify-center gap-2">
          <BookOpen className="h-5 w-5 text-[#FF6500]" />
          <h3 className="text-lg font-bold">Daily Journal</h3>
        </div>
        
        <p className="text-xs text-gray-400">
          Capture your thoughts and reflections
        </p>
        
        <div className="flex flex-col items-center py-2">
          <h4 className="text-sm font-semibold">Today's Prompt</h4>
          <p className="my-1 text-xs text-gray-300">
            "What are three things that went well today?"
          </p>
        </div>
        
        <Button 
          className="w-full py-1 text-white text-sm bg-[#FF6500] hover:bg-[#E55A00]"
          onClick={handleCreateEntry}
        >
          <PenTool className="mr-2 h-3 w-3" />
          New Entry
        </Button>
      </CardContent>
    </Card>
  );
};

export default JournalSection;
