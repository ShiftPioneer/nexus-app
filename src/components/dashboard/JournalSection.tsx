
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
      <CardContent className="p-6 text-center space-y-4">
        <BookOpen className="h-10 w-10 mx-auto text-[#FF6500]" />
        
        <h3 className="text-xl font-bold">Daily Journal</h3>
        <p className="text-sm text-gray-400">
          Capture your thoughts and reflections
        </p>
        
        <div className="py-6">
          <div className="inline-block p-5 rounded-full bg-gray-800/50 mb-4">
            <PenTool className="h-8 w-8 text-gray-400" />
          </div>
          
          <h4 className="text-lg font-semibold">Reflection Prompt</h4>
          <p className="my-2 text-gray-300">
            "What are three things that went well today, and why did they matter to you?"
          </p>
        </div>
        
        <Button 
          className="w-full py-6 text-white bg-[#FF6500] hover:bg-[#E55A00]"
          onClick={handleCreateEntry}
        >
          <PenTool className="mr-2 h-4 w-4" />
          Create Today's Entry
        </Button>
      </CardContent>
    </Card>
  );
};

export default JournalSection;
