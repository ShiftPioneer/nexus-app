import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Plus, Link as LinkIcon, Youtube, Globe, BookOpen } from "lucide-react";
import { Resource, ResourceType } from "@/types/knowledge";
import { ResourceDialog } from "./ResourceDialog";
import { cn } from "@/lib/utils";
const sampleResources: Resource[] = [{
  id: "1",
  name: "JavaScript Fundamentals",
  type: "YouTube",
  description: "Complete JavaScript course for beginners",
  link: "https://www.youtube.com/watch?v=example",
  relatedSkillsets: ["JavaScript", "Programming"],
  notes: "Good for beginners, chapters 3-5 most useful"
}, {
  id: "2",
  name: "Design Principles",
  type: "Online Course",
  description: "Learn core design principles and theories",
  link: "https://www.udemy.com/example",
  relatedSkillsets: ["UI/UX Design"],
  notes: "Need to complete assignments"
}, {
  id: "3",
  name: "Data Visualization Techniques",
  type: "Social Media",
  description: "Twitter thread on data visualization best practices",
  link: "https://twitter.com/example",
  relatedSkillsets: ["Data Science", "Programming"],
  notes: "Useful examples and case studies"
}];
export function ResourcesTab() {
  const [resources, setResources] = useState<Resource[]>(sampleResources);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentResource, setCurrentResource] = useState<Resource | null>(null);
  const handleAddResource = (resource: Resource) => {
    if (currentResource) {
      setResources(resources.map(r => r.id === resource.id ? resource : r));
    } else {
      setResources([...resources, {
        ...resource,
        id: Date.now().toString()
      }]);
    }
    setDialogOpen(false);
    setCurrentResource(null);
  };
  const handleEdit = (resource: Resource) => {
    setCurrentResource(resource);
    setDialogOpen(true);
  };
  const handleDelete = (id: string) => {
    setResources(resources.filter(r => r.id !== id));
  };
  const getResourceIcon = (type: ResourceType) => {
    switch (type) {
      case 'YouTube':
        return <Youtube className="h-5 w-5 text-red-500" />;
      case 'Social Media':
        return <Globe className="h-5 w-5 text-blue-500" />;
      case 'Online Course':
        return <BookOpen className="h-5 w-5 text-green-500" />;
      default:
        return <LinkIcon className="h-5 w-5 text-gray-500" />;
    }
  };
  const getResourceBadgeStyle = (type: ResourceType) => {
    switch (type) {
      case 'YouTube':
        return "bg-red-100 text-red-800";
      case 'Social Media':
        return "bg-blue-100 text-blue-800";
      case 'Online Course':
        return "bg-green-100 text-green-800";
      case 'Book':
        return "bg-amber-100 text-amber-800";
      case 'Article':
        return "bg-purple-100 text-purple-800";
      case 'Website':
        return "bg-indigo-100 text-indigo-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  return <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Learning Resources</h2>
        <Button onClick={() => {
        setCurrentResource(null);
        setDialogOpen(true);
      }} className="gap-1">
          <Plus size={18} />
          Add Resource
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {resources.map(resource => <Card key={resource.id} className="overflow-hidden bg-accent-dark">
            <CardContent className="p-6 bg-accent-dark">
              <div className="flex items-start gap-3 bg-accent-dark">
                <div className="mt-1">{getResourceIcon(resource.type)}</div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-lg text-slate-950">{resource.name}</h3>
                    <span className={cn("text-xs px-2 py-1 rounded-full", getResourceBadgeStyle(resource.type))}>
                      {resource.type}
                    </span>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mt-1 text-slate-950">{resource.description}</p>
                  
                  <a href={resource.link} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-500 hover:underline flex items-center gap-1 mt-3">
                    <LinkIcon className="h-3 w-3" />
                    {resource.link.length > 30 ? resource.link.substring(0, 30) + '...' : resource.link}
                  </a>

                  <div className="flex flex-wrap gap-1 mt-4">
                    {resource.relatedSkillsets.map(skill => <span key={skill} className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-950">
                        {skill}
                      </span>)}
                  </div>
                  
                  {resource.notes && <div className="mt-4">
                      <p className="text-sm font-medium text-slate-950">Notes:</p>
                      <p className="text-sm text-muted-foreground text-slate-950">{resource.notes}</p>
                    </div>}
                  
                  <div className="flex justify-end gap-2 mt-4">
                    <Button size="icon" variant="outline" onClick={() => handleEdit(resource)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="outline" onClick={() => handleDelete(resource.id)} className="text-destructive hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>)}
      </div>
      
      <ResourceDialog open={dialogOpen} onOpenChange={setDialogOpen} onSave={handleAddResource} resource={currentResource} />
    </div>;
}