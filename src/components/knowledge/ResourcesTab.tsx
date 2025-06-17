
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Plus, Link as LinkIcon, Youtube, Globe, BookOpen, ExternalLink } from "lucide-react";
import { Resource, ResourceType } from "@/types/knowledge";
import { ResourceDialog } from "./ResourceDialog";
import { cn } from "@/lib/utils";
import { useLocalStorage } from "@/hooks/use-local-storage";

const defaultResources: Resource[] = [
  {
    id: "1",
    name: "JavaScript Fundamentals",
    type: "YouTube",
    description: "Complete JavaScript course for beginners",
    link: "https://www.youtube.com/watch?v=example",
    relatedSkillsets: ["JavaScript", "Programming"],
    notes: "Good for beginners, chapters 3-5 most useful"
  },
  {
    id: "2",
    name: "Design Principles",
    type: "Online Course",
    description: "Learn core design principles and theories",
    link: "https://www.udemy.com/example",
    relatedSkillsets: ["UI/UX Design"],
    notes: "Need to complete assignments"
  },
  {
    id: "3",
    name: "Data Visualization Techniques",
    type: "Social Media",
    description: "Twitter thread on data visualization best practices",
    link: "https://twitter.com/example",
    relatedSkillsets: ["Data Science", "Programming"],
    notes: "Useful examples and case studies"
  }
];

export function ResourcesTab() {
  const [resources, setResources] = useLocalStorage<Resource[]>("userResources", defaultResources);
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
        return <BookOpen className="h-5 w-5 text-emerald-500" />;
      default:
        return <LinkIcon className="h-5 w-5 text-slate-400" />;
    }
  };

  const getResourceGradient = (type: ResourceType) => {
    switch (type) {
      case 'YouTube':
        return "from-red-500 to-pink-500";
      case 'Social Media':
        return "from-blue-500 to-cyan-500";
      case 'Online Course':
        return "from-emerald-500 to-teal-500";
      case 'Book':
        return "from-amber-500 to-orange-500";
      case 'Article':
        return "from-purple-500 to-violet-500";
      case 'Website':
        return "from-indigo-500 to-blue-500";
      default:
        return "from-slate-500 to-gray-500";
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">Learning Resources</h2>
          <p className="text-slate-400 mt-2">Curate and organize your learning materials</p>
        </div>
        <Button 
          onClick={() => {
            setCurrentResource(null);
            setDialogOpen(true);
          }} 
          className="gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-lg border-none rounded-xl px-6 py-3 font-semibold transition-all duration-300 hover:scale-105"
        >
          <Plus size={18} />
          Add Resource
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resources.map(resource => (
          <Card key={resource.id} className="relative overflow-hidden bg-gradient-to-br from-slate-900/90 to-slate-950/90 border border-slate-700/30 shadow-xl backdrop-blur-sm group hover:shadow-2xl transition-all duration-300 hover:scale-105">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-white/10 to-transparent rounded-full blur-2xl" />
            </div>
            
            <CardContent className="p-6 relative z-10">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="mt-1 p-2 rounded-lg bg-slate-800/50 border border-slate-600/50">
                    {getResourceIcon(resource.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-2">
                      <h3 className="font-bold text-lg text-white leading-tight">{resource.name}</h3>
                      <span className={`text-xs px-2 py-1 rounded-full bg-gradient-to-r ${getResourceGradient(resource.type)} text-white font-semibold whitespace-nowrap`}>
                        {resource.type}
                      </span>
                    </div>
                    
                    <p className="text-sm text-slate-400 mt-2 line-clamp-2">{resource.description}</p>
                    
                    <a 
                      href={resource.link} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="inline-flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 mt-3 transition-colors duration-300 group/link"
                    >
                      <ExternalLink className="h-3 w-3 group-hover/link:scale-110 transition-transform duration-300" />
                      <span className="truncate">
                        {resource.link.length > 35 ? resource.link.substring(0, 35) + '...' : resource.link}
                      </span>
                    </a>

                    {resource.relatedSkillsets.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-4">
                        {resource.relatedSkillsets.map(skill => (
                          <span key={skill} className="text-xs bg-slate-800/50 border border-slate-600/50 px-2 py-1 rounded-full text-slate-300">
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}
                    
                    {resource.notes && (
                      <div className="mt-4 p-3 bg-slate-800/30 rounded-lg border border-slate-700/30">
                        <p className="text-sm font-medium text-slate-300 mb-1">Notes:</p>
                        <p className="text-sm text-slate-400">{resource.notes}</p>
                      </div>
                    )}
                    
                    <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-slate-700/30">
                      <Button 
                        size="icon" 
                        variant="outline" 
                        onClick={() => handleEdit(resource)}
                        className="border-slate-600/50 hover:bg-slate-700/50 hover:border-slate-500/50 text-slate-300 hover:text-white transition-all duration-300"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="icon" 
                        variant="outline" 
                        onClick={() => handleDelete(resource.id)} 
                        className="border-red-600/50 hover:bg-red-600/20 hover:border-red-500/50 text-red-400 hover:text-red-300 transition-all duration-300"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <ResourceDialog 
        open={dialogOpen} 
        onOpenChange={setDialogOpen} 
        onSave={handleAddResource} 
        resource={currentResource} 
      />
    </div>
  );
}
