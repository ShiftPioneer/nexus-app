
import React from "react";
import { KnowledgeEntry, KnowledgeCategory } from "@/types/knowledge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

export interface KnowledgeCategoryViewProps {
  entries: KnowledgeEntry[];
  category: KnowledgeCategory | "all";
  onAddEntry: () => void;
  onSelectEntry: (entry: KnowledgeEntry) => void;
}

const KnowledgeCategoryView: React.FC<KnowledgeCategoryViewProps> = ({
  entries,
  category,
  onAddEntry,
  onSelectEntry
}) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold capitalize">{category === "all" ? "All Entries" : category}</h2>
        <Button variant="outline" size="sm" onClick={onAddEntry}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Entry
        </Button>
      </div>

      {entries.length === 0 ? (
        <Card>
          <CardContent className="py-6 text-center text-muted-foreground">
            No entries found in this category. Add one to get started.
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {entries.map((entry) => (
            <Card 
              key={entry.id}
              className="cursor-pointer hover:border-primary/50 transition-colors"
              onClick={() => onSelectEntry(entry)}
            >
              <CardContent className="p-4">
                <h3 className="font-medium truncate">{entry.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                  {entry.content || "No content"}
                </p>
                {entry.tags && entry.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {entry.tags.slice(0, 3).map((tag) => (
                      <span 
                        key={tag}
                        className="text-xs bg-muted px-2 py-0.5 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                    {entry.tags.length > 3 && (
                      <span className="text-xs bg-muted px-2 py-0.5 rounded-full">
                        +{entry.tags.length - 3}
                      </span>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default KnowledgeCategoryView;
