import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Resource } from "@/types/knowledge";

const dummyResources: Resource[] = [
  {
    id: "1",
    title: "Understanding React Hooks",
    url: "https://youtube.com/watch?v=react-hooks",
    type: "video", // Changed from "YouTube"
    notes: "Great introduction to React hooks with practical examples",
    tags: ["react", "javascript", "frontend"],
    dateAdded: new Date(2023, 2, 15),
    pinned: true
  },
  {
    id: "2",
    title: "Advanced TypeScript Techniques",
    url: "https://ultimatetypescript.com/course",
    type: "course", // Changed from "Online Course"
    notes: "Comprehensive course on TypeScript with practical exercises",
    tags: ["typescript", "programming"],
    dateAdded: new Date(2023, 3, 10)
  },
  {
    id: "3",
    title: "Design Patterns in JavaScript",
    url: "https://twitter.com/jsdesignpatterns",
    type: "other", // Changed from "Social Media"
    notes: "Thread explaining common design patterns with JS examples",
    tags: ["javascript", "design patterns"],
    dateAdded: new Date(2023, 4, 5)
  }
];

const ResourcesTab = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Resources</CardTitle>
        <CardDescription>
          Your curated list of learning resources.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[400px] w-full">
          <div className="p-4 space-y-4">
            {dummyResources.map((resource) => (
              <div
                key={resource.id}
                className="border rounded-md p-4 hover:bg-accent/5 transition-colors"
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold truncate">
                      {resource.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                      {resource.notes || "No description available"}
                    </p>
                    
                    {resource.url && (
                      <div className="flex items-center gap-2 mt-2">
                        <ExternalLink className="h-3.5 w-3.5 text-blue-500" />
                        <a
                          href={resource.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-500 hover:underline truncate"
                        >
                          {resource.url}
                        </a>
                      </div>
                    )}
                    
                    {resource.tags && resource.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {resource.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default ResourcesTab;
