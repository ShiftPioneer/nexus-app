
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { KnowledgeEntry } from "@/types/knowledge";
import { FileText, Link, Calendar, Tag, Pin } from "lucide-react";

interface KnowledgeListProps {
  entries: KnowledgeEntry[];
  showCategory?: boolean;
}

function KnowledgeList({ entries, showCategory = true }: KnowledgeListProps) {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'projects': return <FileText className="h-4 w-4" />;
      case 'resources': return <Link className="h-4 w-4" />;
      case 'areas': return <Tag className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };
  
  return (
    <div className="space-y-4">
      {entries.length === 0 ? (
        <Card className="p-6 text-center">
          <CardContent>
            <p className="text-muted-foreground">No entries found</p>
          </CardContent>
        </Card>
      ) : (
        entries.map(entry => (
          <Card key={entry.id} className="hover:shadow-sm transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {entry.title}
                    {entry.pinned && <Pin className="h-4 w-4 text-primary" fill="currentColor" />}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-2 mt-1">
                    {showCategory && (
                      <Badge variant="outline" className="flex items-center gap-1">
                        {getCategoryIcon(entry.category)}
                        {entry.category}
                      </Badge>
                    )}
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {formatDate(entry.createdAt)}
                    </span>
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm line-clamp-3">{entry.content}</p>
              {entry.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {entry.tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}

export default KnowledgeList;
