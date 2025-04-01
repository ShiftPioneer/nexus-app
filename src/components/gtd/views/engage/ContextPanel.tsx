
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";

interface ContextPanelProps {
  contexts: (string | undefined)[];
  selectedContext: string | null;
  setSelectedContext: (context: string | null) => void;
}

const ContextPanel: React.FC<ContextPanelProps> = ({
  contexts,
  selectedContext,
  setSelectedContext
}) => {
  return (
    <Card className="bg-slate-900 border-slate-700 text-slate-200">
      <CardHeader className="pb-2">
        <CardTitle>
          Context Filtering
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Button 
          variant={selectedContext === null ? "default" : "outline"}
          className={`w-full mb-2 ${selectedContext === null ? "bg-[#FF5722] hover:bg-[#FF6E40] text-white" : ""}`}
          onClick={() => setSelectedContext(null)}
        >
          All Tasks
        </Button>
        
        {contexts.map((context) => context && (
          <Button
            key={context}
            variant={selectedContext === context ? "default" : "outline"}
            className={`w-full mb-2 ${selectedContext === context ? "bg-[#FF5722] hover:bg-[#FF6E40] text-white" : ""}`}
            onClick={() => setSelectedContext(context)}
          >
            @{context}
          </Button>
        ))}
      </CardContent>
    </Card>
  );
};

export default ContextPanel;
