
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

const JournalEntryCard: React.FC<JournalEntryCardProps> = ({ entry, onEdit, onDelete }) => {
  return (
    <Card className="cursor-pointer hover:bg-accent/20 transition-colors">
      <CardHeader className="pb-2">
        <div className="flex justify-between">
          <CardTitle className="text-lg">{entry.title}</CardTitle>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={() => onEdit(entry)}>
              <PenSquare className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onDelete(entry.id)}
              className="text-destructive hover:text-destructive"
            >
              ×
            </Button>
          </div>
        </div>
        <div className="flex gap-2 items-center text-sm text-muted-foreground">
          <Calendar className="h-3 w-3" />
          <span>{format(entry.date, "PPP")}</span>
          <Clock className="h-3 w-3 ml-2" />
          <span>{format(entry.date, "p")}</span>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm line-clamp-3">{entry.content}</p>
      </CardContent>
      <CardFooter className="pt-0">
        <div className="flex gap-2 flex-wrap">
          {entry.mood && (
            <Badge variant={
              entry.mood === "positive" ? "default" : 
              entry.mood === "negative" ? "destructive" : 
              "outline"
            } className="mr-1">
              {entry.mood}
            </Badge>
          )}
          {entry.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="flex items-center gap-1">
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
