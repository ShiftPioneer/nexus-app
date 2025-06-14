
import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, BookText } from "lucide-react";
import JournalEntryCard from "./JournalEntryCard";
import JournalFilters from "./JournalFilters";

interface JournalEntriesListProps {
  entries: JournalEntry[];
  activeTab: string;
  onTabChange: (tab: string) => void;
  onEditEntry: (entry: JournalEntry) => void;
  onDeleteEntry: (id: string) => void;
  onNewEntry: () => void;
}

const JournalEntriesList: React.FC<JournalEntriesListProps> = ({
  entries,
  activeTab,
  onTabChange,
  onEditEntry,
  onDeleteEntry,
  onNewEntry
}) => {
  return (
    <Card className="border-slate-300">
      <CardHeader className="space-y-4">
        <JournalFilters activeTab={activeTab} onTabChange={onTabChange} />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {entries.length > 0 ? (
            entries.map((entry) => (
              <JournalEntryCard
                key={entry.id}
                entry={entry}
                onEdit={onEditEntry}
                onDelete={onDeleteEntry}
              />
            ))
          ) : (
            <div className="text-center py-8">
              <BookText className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
              <h3 className="mt-4 text-lg font-medium">No journal entries found</h3>
              <p className="mt-2 text-muted-foreground">
                {activeTab === "all" 
                  ? "Start writing your first entry to begin your journaling journey." 
                  : "Try changing your filter or create a new entry."
                }
              </p>
              <Button onClick={onNewEntry} className="mt-4 gap-2">
                <Plus size={16} />
                New Journal
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default JournalEntriesList;
