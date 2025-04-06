
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { KnowledgeEntry, KnowledgeCategory } from "@/types/knowledge";
import { useKnowledge } from "@/contexts/KnowledgeContext";
import { Button } from "@/components/ui/button";
import { Inbox, Archive, FileSpreadsheet, FolderOpen, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface KnowledgeCategoryViewProps {
  category: KnowledgeCategory | "all";
  entries: KnowledgeEntry[];
  onAddEntry: () => void;
  onSelectEntry: (entry: KnowledgeEntry) => void;
}

export function KnowledgeCategoryView({ 
  category, 
  entries, 
  onAddEntry, 
  onSelectEntry 
}: KnowledgeCategoryViewProps) {
  const { getEntriesStats } = useKnowledge();
  
  const getCategoryIcon = (category: KnowledgeCategory | "all") => {
    switch (category) {
      case "inbox":
        return <Inbox className="h-5 w-5 text-blue-500" />;
      case "archives":
        return <Archive className="h-5 w-5 text-gray-500" />;
      case "resources":
        return <FileSpreadsheet className="h-5 w-5 text-green-500" />;
      case "projects":
      case "areas":
        return <FolderOpen className="h-5 w-5 text-amber-500" />;
      default:
        return <FileSpreadsheet className="h-5 w-5 text-purple-500" />;
    }
  };
  
  const getCategoryDisplayName = (category: KnowledgeCategory | "all") => {
    if (category === "all") return "All Entries";
    
    switch (category) {
      case "inbox":
        return "Inbox";
      case "projects":
        return "Projects";
      case "areas":
        return "Areas of Responsibility";
      case "resources":
        return "Resources";
      case "archives":
        return "Archives";
      default:
        return category.charAt(0).toUpperCase() + category.slice(1);
    }
  };
  
  const getStats = () => {
    if (getEntriesStats) {
      const stats = getEntriesStats();
      if (category === "all") {
        return stats.totalEntries;
      } else if (category === "inbox") {
        return stats.categories.inboxCount;
      } else if (category === "projects") {
        return stats.categories.projectsCount;
      } else if (category === "areas") {
        return stats.categories.areasCount;
      } else if (category === "resources") {
        return stats.categories.resourcesCount;
      } else if (category === "archives") {
        return stats.categories.archivesCount;
      }
    }
    return entries.length;
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          {getCategoryIcon(category)}
          <h2 className="text-xl font-semibold">{getCategoryDisplayName(category)}</h2>
          <Badge variant="secondary" className="bg-gray-100">
            {getStats()}
          </Badge>
        </div>
        
        <Button onClick={onAddEntry} className="gap-1 text-sm" variant="outline" size="sm">
          <Plus className="h-4 w-4" />
          Add Entry
        </Button>
      </div>
      
      <div className="grid grid-cols-1 gap-3">
        {entries.length > 0 ? (
          entries.map(entry => (
            <Card 
              key={entry.id} 
              className="cursor-pointer hover:shadow-md transition-all"
              onClick={() => onSelectEntry(entry)}
            >
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <h3 className="font-medium">{entry.title}</h3>
                  {entry.pinned && <Badge variant="outline">Pinned</Badge>}
                </div>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                  {entry.content}
                </p>
                
                <div className="flex flex-wrap gap-1 mt-2">
                  {entry.tags.slice(0, 3).map(tag => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {entry.tags.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{entry.tags.length - 3} more
                    </Badge>
                  )}
                </div>
                
                <div className="flex justify-between items-center text-xs text-muted-foreground mt-2">
                  <span>
                    {entry.category !== category && category !== "all" ? (
                      <Badge variant="outline" className="text-xs capitalize">
                        {entry.category}
                      </Badge>
                    ) : (
                      <span>
                        Added: {new Date(entry.createdAt).toLocaleDateString()}
                      </span>
                    )}
                  </span>
                  
                  {entry.updatedAt && entry.updatedAt > entry.createdAt && (
                    <span>
                      Updated: {new Date(entry.updatedAt).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-8 border border-dashed rounded-lg">
            <p className="text-muted-foreground">No entries in this category</p>
            <Button onClick={onAddEntry} className="mt-4" variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Add your first entry
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default KnowledgeCategoryView;
