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
  return <Card className="cursor-pointer hover:bg-accent/20 transition-colors border-slate-300">
      <CardHeader className="pb-2 rounded-lg bg-slate-900">
        <div className="flex justify-between">
          <CardTitle className="text-lg">{entry.title}</CardTitle>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={() => onEdit(entry)} className="text-cyan-500">
              <PenSquare className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => onDelete(entry.id)} className="text-red-600">
              ×
            </Button>
          </div>
        </div>
        <div className="flex gap-2 items-center text-sm text-muted-foreground">
          <Calendar className="h-3 w-3 text-lime-600" />
          <span className="text-lime-600">{format(entry.date, "PPP")}</span>
          <Clock className="h-3 w-3 ml-2 text-lime-600" />
          <span className="text-lime-600">{format(entry.date, "p")}</span>
        </div>
      </CardHeader>
      <CardContent className="bg-slate-900">
        <p className="text-sm line-clamp-3">{entry.content}</p>
      </CardContent>
      <CardFooter className="pt-0 bg-slate-900 rounded-lg">
        <div className="flex gap-2 flex-wrap">
          {entry.mood && <Badge variant={entry.mood === "positive" ? "default" : entry.mood === "negative" ? "destructive" : "outline"} className="mr-1 bg-orange-600 text-white">
              {entry.mood}
            </Badge>}
          {entry.tags.map(tag => <Badge key={tag} variant="secondary" className="flex items-center gap-1">
              <Tag className="h-3 w-3" />
              {tag}
            </Badge>)}
        </div>
      </CardFooter>
    </Card>;
};
export default JournalEntryCard;