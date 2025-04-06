
import React from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter,
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { KnowledgeEntry, KnowledgeCategory } from "@/types/knowledge";
import { 
  Pin, 
  NotebookPen, 
  Link, 
  Paperclip, 
  LightbulbIcon, 
  GraduationCap, 
  Eye,
  CalendarDays,
  ExternalLink,
  Clock
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useKnowledge } from "@/contexts/KnowledgeContext";

interface KnowledgeCategoryViewProps {
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
  const { togglePinNote } = useKnowledge();
  
  const getCategoryIcon = (entryCategory: KnowledgeCategory) => {
    switch (entryCategory) {
      case "note":
        return <NotebookPen className="h-5 w-5 text-blue-500" />;
      case "resource":
        return <Link className="h-5 w-5 text-amber-500" />;
      case "reference":
        return <Paperclip className="h-5 w-5 text-green-500" />;
      case "idea":
        return <LightbulbIcon className="h-5 w-5 text-purple-500" />;
      case "concept":
        return <GraduationCap className="h-5 w-5 text-red-500" />;
      case "insight":
        return <Eye className="h-5 w-5 text-teal-500" />;
      default:
        return <NotebookPen className="h-5 w-5 text-gray-500" />;
    }
  };
  
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="mb-4 rounded-full bg-muted p-3">
          {category === "all" ? (
            <NotebookPen className="h-6 w-6 text-muted-foreground" />
          ) : (
            getCategoryIcon(category as KnowledgeCategory)
          )}
        </div>
        <h3 className="mb-2 text-xl font-semibold">No entries found</h3>
        <p className="mb-4 text-muted-foreground">
          {category === "all" 
            ? "Start building your knowledge base by adding your first entry."
            : `You don't have any ${category} entries yet. Add your first one!`}
        </p>
        <Button onClick={onAddEntry}>Add new entry</Button>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {entries.map(entry => (
        <Card 
          key={entry.id} 
          className="overflow-hidden transition-all duration-200 hover:shadow-md cursor-pointer"
          onClick={() => onSelectEntry(entry)}
        >
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-2">
                {getCategoryIcon(entry.category)}
                <Badge variant="outline" className="capitalize">
                  {entry.category}
                </Badge>
              </div>
              {togglePinNote && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-7 w-7"
                  onClick={(e) => {
                    e.stopPropagation();
                    togglePinNote(entry.id);
                  }}
                >
                  <Pin className={`h-4 w-4 ${entry.pinned ? 'text-primary fill-primary' : 'text-muted-foreground'}`} />
                </Button>
              )}
            </div>
            <CardTitle className="line-clamp-2">{entry.title}</CardTitle>
            <CardDescription className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {formatDate(entry.updatedAt || entry.lastUpdated || entry.createdAt)}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm line-clamp-3">{entry.content}</p>
          </CardContent>
          <CardFooter className="pt-0">
            <div className="flex flex-wrap gap-1">
              {entry.tags.slice(0, 3).map(tag => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {entry.tags.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{entry.tags.length - 3} more
                </Badge>
              )}
            </div>
            {entry.url && (
              <Button 
                size="sm" 
                variant="ghost" 
                className="ml-auto" 
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(entry.url, "_blank");
                }}
              >
                <ExternalLink className="h-3 w-3 mr-1" />
                Visit
              </Button>
            )}
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default KnowledgeCategoryView;
