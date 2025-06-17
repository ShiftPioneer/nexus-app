
import React from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Calendar, Clock, PenSquare, Tag } from "lucide-react";

interface JournalEntryCardProps {
  entry: JournalEntry;
  onEdit: (entry: JournalEntry) => void;
  onDelete: (id: string) => void;
}

const JournalEntryCard: React.FC<JournalEntryCardProps> = ({
  entry,
  onEdit,
  onDelete
}) => {
  return (
    <Card className="cursor-pointer transition-colors border-slate-300 bg-slate-900 hover:bg-slate-800">
      <CardHeader className="pb-2 rounded-lg bg-slate-900">
        <div className="flex justify-between">
          <CardTitle className="text-lg text-white">{entry.title}</CardTitle>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(entry)}
              className="text-primary hover:text-primary/80 hover:bg-slate-800 border border-slate-300"
            >
              <PenSquare className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(entry.id)}
              className="text-red-500 hover:text-red-400 hover:bg-slate-800 border border-slate-300"
            >
              ×
            </Button>
          </div>
        </div>
        <div className="flex gap-2 items-center text-sm text-slate-400">
          <Calendar className="h-3 w-3 text-primary" />
          <span className="text-slate-300">{format(entry.date, "PPP")}</span>
          <Clock className="h-3 w-3 ml-2 text-primary" />
          <span className="text-slate-300">{format(entry.date, "p")}</span>
        </div>
      </CardHeader>
      <CardContent className="bg-slate-900">
        <p className="text-sm line-clamp-3 text-slate-300">{entry.content}</p>
      </CardContent>
      <CardFooter className="pt-0 bg-slate-900 rounded-lg">
        <div className="flex gap-2 flex-wrap">
          {entry.mood && (
            <Badge
              variant={entry.mood === "positive" ? "default" : entry.mood === "negative" ? "destructive" : "outline"}
              className="mr-1 bg-primary text-white border border-slate-300"
            >
              {entry.mood}
            </Badge>
          )}
          {entry.tags.map(tag => (
            <Badge
              key={tag}
              variant="secondary"
              className="flex items-center gap-1 bg-slate-800 text-slate-300 border border-slate-300"
            >
              <Tag className="h-3 w-3" />
              {tag}
            </Badge>
          ))}
        </div>
      </CardFooter>
    </Card>
  );
};

export default JournalEntryCard;
