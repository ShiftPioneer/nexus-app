
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Resource } from "@/types/knowledge";
import {
  FileText,
  Video,
  Globe,
  BookOpen,
  MoreVertical,
  Edit,
  Trash,
  Link as LinkIcon,
  Clock,
  ExternalLink,
  Check
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ResourceDialog } from "./ResourceDialog";

const sampleResources: Resource[] = [
  {
    id: "1",
    title: "Understanding React Hooks",
    url: "https://reactjs.org/docs/hooks-intro.html",
    type: "article",
    notes: "Great introduction to React hooks",
    tags: ["react", "javascript", "frontend"],
    dateAdded: new Date(2023, 4, 10),
    pinned: true
  },
  {
    id: "2",
    title: "Advanced JavaScript Concepts",
    url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    type: "video",
    notes: "Covers closures, prototypes, and more",
    tags: ["javascript", "programming"],
    dateAdded: new Date(2023, 3, 25)
  },
  {
    id: "3",
    title: "Introduction to MongoDB",
    url: "https://university.mongodb.com/",
    type: "course",
    notes: "Comprehensive course on MongoDB",
    tags: ["database", "backend"],
    dateAdded: new Date(2023, 2, 15),
    completed: true
  },
  {
    id: "4",
    title: "Design System Tips",
    url: "https://medium.com/design-systems",
    type: "article",
    notes: "Best practices for creating design systems",
    tags: ["design", "ui", "ux"],
    dateAdded: new Date(2023, 5, 5)
  }
];

export function ResourcesTab() {
  const [resources, setResources] = useState<Resource[]>(sampleResources);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleEdit = (resource: Resource) => {
    setSelectedResource(resource);
    setDialogOpen(true);
  };

  const handleDelete = (resourceId: string) => {
    setResources(prevResources => prevResources.filter(r => r.id !== resourceId));
  };

  const handleTogglePin = (resourceId: string) => {
    setResources(prevResources =>
      prevResources.map(r =>
        r.id === resourceId ? { ...r, pinned: !r.pinned } : r
      )
    );
  };

  const handleToggleComplete = (resourceId: string) => {
    setResources(prevResources =>
      prevResources.map(r =>
        r.id === resourceId ? { ...r, completed: !r.completed } : r
      )
    );
  };

  const handleSaveResource = (resource: Resource) => {
    if (selectedResource) {
      // Update existing resource
      setResources(prevResources =>
        prevResources.map(r =>
          r.id === resource.id ? resource : r
        )
      );
    } else {
      // Add new resource
      setResources(prevResources => [...prevResources, {
        ...resource,
        id: Date.now().toString(),
        dateAdded: new Date()
      }]);
    }
    setDialogOpen(false);
    setSelectedResource(null);
  };

  const getResourceIcon = (type: string) => {
    switch (type) {
      case "article":
        return <FileText className="h-5 w-5 text-blue-500" />;
      case "video":
        return <Video className="h-5 w-5 text-red-500" />;
      case "book":
        return <BookOpen className="h-5 w-5 text-amber-500" />;
      case "course":
        return <BookOpen className="h-5 w-5 text-green-500" />;
      default:
        return <Globe className="h-5 w-5 text-purple-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Resources Library</h2>
        <Button
          onClick={() => {
            setSelectedResource(null);
            setDialogOpen(true);
          }}
          className="gap-2"
        >
          <LinkIcon className="h-4 w-4" /> Add Resource
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {resources.map(resource => (
          <Card key={resource.id} className="overflow-hidden hover:shadow-md transition-all">
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  {getResourceIcon(resource.type)}
                  <Badge variant="outline" className="capitalize">
                    {resource.type}
                  </Badge>
                  {resource.completed && (
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      <Check className="h-3 w-3 mr-1" /> Completed
                    </Badge>
                  )}
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleEdit(resource)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleTogglePin(resource.id)}>
                      {resource.pinned ? (
                        <>
                          <span className="text-primary mr-2">★</span>
                          Unpin
                        </>
                      ) : (
                        <>
                          <span className="text-muted-foreground mr-2">☆</span>
                          Pin
                        </>
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleToggleComplete(resource.id)}>
                      {resource.completed ? (
                        <>
                          <span className="text-green-500 mr-2">✓</span>
                          Mark as Incomplete
                        </>
                      ) : (
                        <>
                          <span className="text-muted-foreground mr-2">○</span>
                          Mark as Complete
                        </>
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDelete(resource.id)} className="text-destructive">
                      <Trash className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <h3 className="font-semibold text-base mb-1 line-clamp-2">{resource.title}</h3>

              {resource.notes && (
                <p className="text-sm text-muted-foreground mt-2 mb-3 line-clamp-2">
                  {resource.notes}
                </p>
              )}

              {resource.url && (
                <a
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-600 hover:underline flex items-center gap-1 mb-3"
                >
                  <ExternalLink className="h-3 w-3" />
                  Visit Resource
                </a>
              )}

              <div className="flex flex-wrap gap-1 mb-3">
                {resource.tags.map(tag => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>

              <div className="flex items-center justify-between text-xs text-muted-foreground mt-auto">
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Added: {new Date(resource.dateAdded).toLocaleDateString()}
                </div>
                {resource.pinned && (
                  <Badge variant="outline" className="bg-primary/10 text-primary text-xs">
                    Pinned
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <ResourceDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        resource={selectedResource}
        onSave={handleSaveResource}
      />
    </div>
  );
}

export default ResourcesTab;
