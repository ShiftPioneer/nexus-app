
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import { format } from "date-fns";

interface JournalStatsProps {
  entries: JournalEntry[];
}

const JournalStats: React.FC<JournalStatsProps> = ({ entries }) => {
  const todayEntries = entries.filter(entry => 
    format(entry.date, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd")
  );

  const uniqueTags = Array.from(new Set(entries.flatMap(entry => entry.tags)));

  const streak = entries.reduce((streak, entry, index) => {
    if (index === 0) return 1;
    const prevDate = new Date(entries[index-1].date);
    prevDate.setDate(prevDate.getDate() - 1);
    return format(prevDate, "yyyy-MM-dd") === format(entry.date, "yyyy-MM-dd") 
      ? streak + 1 : streak;
  }, 0);

  return (
    <Card className="border-slate-300">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          Journal Stats
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="border border-slate-300 rounded-lg p-3 text-center">
            <p className="text-2xl font-bold">{entries.length}</p>
            <p className="text-xs text-muted-foreground">Total Entries</p>
          </div>
          <div className="border border-slate-300 rounded-lg p-3 text-center">
            <p className="text-2xl font-bold">{todayEntries.length}</p>
            <p className="text-xs text-muted-foreground">Today</p>
          </div>
          <div className="border border-slate-300 rounded-lg p-3 text-center">
            <p className="text-2xl font-bold">{uniqueTags.length}</p>
            <p className="text-xs text-muted-foreground">Unique Tags</p>
          </div>
          <div className="border border-slate-300 rounded-lg p-3 text-center">
            <p className="text-2xl font-bold">{streak}</p>
            <p className="text-xs text-muted-foreground">Streak</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default JournalStats;
