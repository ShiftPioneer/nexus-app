
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tag } from "lucide-react";
import { useKnowledge } from "@/contexts/KnowledgeContext";

export function TagsTab() {
  const { 
    notes, 
    resources, 
    books, 
    skillsets,
  } = useKnowledge();
  
  const allTags = Array.from(new Set([
    ...notes.flatMap(note => note.tags),
    ...resources.flatMap(resource => resource.tags),
    ...books.flatMap(book => book.relatedSkillsets || []),
    ...skillsets.map(skillset => skillset.name)
  ]));
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {allTags.map(tag => (
        <Card key={tag} className="hover:shadow-md transition-all cursor-pointer">
          <CardContent className="p-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Tag className="h-4 w-4" />
              <h3 className="font-medium">{tag}</h3>
            </div>
            <Badge variant="secondary">
              {notes.filter(note => note.tags.includes(tag)).length + 
               resources.filter(resource => resource.tags.includes(tag)).length +
               books.filter(book => (book.relatedSkillsets || []).includes(tag)).length +
               skillsets.filter(skillset => skillset.name === tag).length}
            </Badge>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
