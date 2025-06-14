
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus, BookText } from "lucide-react";

interface JournalHeaderProps {
  onNewEntry: () => void;
}

const JournalHeader: React.FC<JournalHeaderProps> = ({ onNewEntry }) => {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <BookText className="h-6 w-6 text-primary" />
          Digital Journal
        </h1>
        <p className="text-muted-foreground">Capture your thoughts, reflections, and personal growth</p>
      </div>
      <Button onClick={onNewEntry} className="gap-2">
        <Plus size={18} />
        New Journal
      </Button>
    </div>
  );
};

export default JournalHeader;
