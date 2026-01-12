
import React, { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Plus, Link as LinkIcon, Youtube, Globe, BookOpen, ExternalLink, Search, Filter, Star, StarOff, Grid, List, FileText, PlayCircle, Newspaper, LayoutGrid, Heart, Clock, CheckCircle, ArrowUpRight } from "lucide-react";
import { Resource, ResourceType } from "@/types/knowledge";
import { ResourceDialog } from "./ResourceDialog";
import { cn } from "@/lib/utils";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EmptyState } from "@/components/ui/empty-state";
import { ModernTabs, ModernTabsList, ModernTabsTrigger, ModernTabsContent } from "@/components/ui/modern-tabs";
import { toast } from "sonner";

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

const resourceTypes: ResourceType[] = [
  'YouTube', 'Social Media', 'Online Course', 'Book', 'Article', 'Website', 'Other'
];

interface ExtendedResource extends Resource {
  isFavorite?: boolean;
  status?: 'not_started' | 'in_progress' | 'completed';
  addedDate?: string;
}

export function ResourcesTab() {
  const [resources, setResources] = useLocalStorage<ExtendedResource[]>("userResources", defaultResources);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentResource, setCurrentResource] = useState<ExtendedResource | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Filter resources
  const filteredResources = useMemo(() => {
    return resources.filter(r => {
      const matchesSearch = r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           r.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           r.relatedSkillsets.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesType = typeFilter === "all" || r.type === typeFilter;
      const matchesStatus = statusFilter === "all" || r.status === statusFilter;
      return matchesSearch && matchesType && matchesStatus;
    });
  }, [resources, searchTerm, typeFilter, statusFilter]);

  // Stats
  const stats = useMemo(() => ({
    total: resources.length,
    favorites: resources.filter(r => r.isFavorite).length,
    completed: resources.filter(r => r.status === 'completed').length,
    inProgress: resources.filter(r => r.status === 'in_progress').length,
  }), [resources]);

  const handleAddResource = (resource: ExtendedResource) => {
    if (currentResource) {
      setResources(resources.map(r => r.id === resource.id ? resource : r));
      toast.success("Resource updated!");
    } else {
      setResources([...resources, {
        ...resource,
        id: Date.now().toString(),
        addedDate: new Date().toISOString(),
        status: 'not_started'
      }]);
      toast.success("Resource added to your library!");
    }
    setDialogOpen(false);
    setCurrentResource(null);
  };

  const handleEdit = (resource: ExtendedResource) => {
    setCurrentResource(resource);
    setDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setResources(resources.filter(r => r.id !== id));
    toast.success("Resource removed");
  };

  const toggleFavorite = (id: string) => {
    setResources(resources.map(r => 
      r.id === id ? { ...r, isFavorite: !r.isFavorite } : r
    ));
  };

  const updateStatus = (id: string, status: 'not_started' | 'in_progress' | 'completed') => {
    setResources(resources.map(r => 
      r.id === id ? { ...r, status } : r
    ));
    toast.success(`Status updated to ${status.replace('_', ' ')}`);
  };

  const getResourceIcon = (type: ResourceType) => {
    switch (type) {
      case 'YouTube':
        return <Youtube className="h-5 w-5 text-red-500" />;
      case 'Social Media':
        return <Globe className="h-5 w-5 text-cyan-500" />;
      case 'Online Course':
        return <PlayCircle className="h-5 w-5 text-emerald-500" />;
      case 'Book':
        return <BookOpen className="h-5 w-5 text-amber-500" />;
      case 'Article':
        return <Newspaper className="h-5 w-5 text-violet-500" />;
      case 'Website':
        return <LayoutGrid className="h-5 w-5 text-indigo-500" />;
      default:
        return <LinkIcon className="h-5 w-5 text-slate-400" />;
    }
  };

  const getResourceGradient = (type: ResourceType) => {
    switch (type) {
      case 'YouTube':
        return "from-red-500 to-pink-500";
      case 'Social Media':
        return "from-cyan-500 to-teal-500";
      case 'Online Course':
        return "from-emerald-500 to-green-500";
      case 'Book':
        return "from-amber-500 to-orange-500";
      case 'Article':
        return "from-purple-500 to-violet-500";
      case 'Website':
        return "from-indigo-500 to-violet-500";
      default:
        return "from-slate-500 to-gray-500";
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'completed':
        return "bg-emerald-500/20 text-emerald-300 border-emerald-500/30";
      case 'in_progress':
        return "bg-amber-500/20 text-amber-300 border-amber-500/30";
      default:
        return "bg-slate-500/20 text-slate-300 border-slate-500/30";
    }
  };

  const tabItems = [
    { value: "all", label: `All (${resources.length})`, gradient: "from-slate-500 to-gray-500" },
    { value: "favorites", label: `Favorites (${stats.favorites})`, gradient: "from-pink-500 to-rose-500" },
    { value: "in_progress", label: `In Progress (${stats.inProgress})`, gradient: "from-amber-500 to-orange-500" },
    { value: "completed", label: `Completed (${stats.completed})`, gradient: "from-emerald-500 to-teal-500" },
  ];

  return (
    <div className="space-y-8">
      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-slate-900/90 to-slate-950/90 border border-slate-700/30 shadow-xl">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <LayoutGrid className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats.total}</p>
              <p className="text-xs text-slate-400">Total Resources</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-slate-900/90 to-slate-950/90 border border-slate-700/30 shadow-xl">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-pink-500/10">
              <Heart className="h-5 w-5 text-pink-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats.favorites}</p>
              <p className="text-xs text-slate-400">Favorites</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-slate-900/90 to-slate-950/90 border border-slate-700/30 shadow-xl">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-500/10">
              <Clock className="h-5 w-5 text-amber-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats.inProgress}</p>
              <p className="text-xs text-slate-400">In Progress</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-slate-900/90 to-slate-950/90 border border-slate-700/30 shadow-xl">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/10">
              <CheckCircle className="h-5 w-5 text-emerald-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats.completed}</p>
              <p className="text-xs text-slate-400">Completed</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">Learning Resources</h2>
          <p className="text-slate-400 mt-2">Curate and organize your learning materials</p>
        </div>
        <Button 
          onClick={() => {
            setCurrentResource(null);
            setDialogOpen(true);
          }} 
          className="gap-2 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white shadow-lg border-none rounded-xl px-6 py-3 font-semibold transition-all duration-300 hover:scale-105"
        >
          <Plus size={18} />
          Add Resource
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search resources..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-slate-900/50 border-slate-700/50 text-white placeholder:text-slate-400"
          />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-[160px] bg-slate-900/50 border-slate-700/50 text-white">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent className="bg-slate-800 border-slate-700">
            <SelectItem value="all" className="text-white hover:bg-slate-700">All Types</SelectItem>
            {resourceTypes.map((type) => (
              <SelectItem key={type} value={type} className="text-white hover:bg-slate-700">{type}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="flex items-center gap-2">
          <Button 
            variant={viewMode === "grid" ? "default" : "outline"} 
            size="sm" 
            onClick={() => setViewMode("grid")}
            className={viewMode === "grid" ? "bg-primary" : "bg-slate-800 border-slate-700 hover:bg-slate-700"}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button 
            variant={viewMode === "list" ? "default" : "outline"} 
            size="sm" 
            onClick={() => setViewMode("list")}
            className={viewMode === "list" ? "bg-primary" : "bg-slate-800 border-slate-700 hover:bg-slate-700"}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Status Tabs */}
      <ModernTabs value={statusFilter} onValueChange={setStatusFilter} className="w-full">
        <ModernTabsList className="grid w-full grid-cols-4 max-w-2xl">
          {tabItems.map(tab => (
            <ModernTabsTrigger key={tab.value} value={tab.value} gradient={tab.gradient}>
              {tab.label}
            </ModernTabsTrigger>
          ))}
        </ModernTabsList>
      </ModernTabs>

      {/* Resources Grid/List */}
      {filteredResources.length === 0 ? (
        <EmptyState
          icon={LinkIcon}
          title="No resources found"
          description={searchTerm || typeFilter !== "all" 
            ? "Try adjusting your search or filters" 
            : "Start building your learning library by adding resources"}
          action={
            <Button 
              onClick={() => {
                setCurrentResource(null);
                setDialogOpen(true);
              }}
              className="mt-4 bg-gradient-to-r from-cyan-500 to-teal-500"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Resource
            </Button>
          }
        />
      ) : (
        <div className={cn(
          viewMode === "grid" 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            : "flex flex-col gap-4"
        )}>
          {filteredResources.map(resource => (
            <Card 
              key={resource.id} 
              className={cn(
                "relative overflow-hidden bg-gradient-to-br from-slate-900/90 to-slate-950/90 border border-slate-700/30 shadow-xl backdrop-blur-sm group hover:shadow-2xl transition-all duration-300",
                viewMode === "grid" ? "hover:scale-[1.02]" : ""
              )}
            >
              {/* Background pattern */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-white/10 to-transparent rounded-full blur-2xl" />
              </div>
              
              {/* Favorite button */}
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite(resource.id);
                }}
                className="absolute top-3 right-3 z-20 p-2 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 transition-colors"
              >
                {resource.isFavorite ? (
                  <Heart className="h-4 w-4 text-pink-500 fill-pink-500" />
                ) : (
                  <Heart className="h-4 w-4 text-slate-400 hover:text-pink-400" />
                )}
              </button>
              
              <CardContent className={cn("p-6 relative z-10", viewMode === "list" && "flex items-center gap-6")}>
                <div className={cn("space-y-4", viewMode === "list" && "flex-1 flex items-center gap-6")}>
                  <div className={cn("flex items-start gap-3", viewMode === "list" && "flex-1")}>
                    <div className="mt-1 p-2 rounded-lg bg-slate-800/50 border border-slate-600/50">
                      {getResourceIcon(resource.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-2 mb-2">
                        <h3 className="font-bold text-lg text-white leading-tight">{resource.name}</h3>
                        <Badge className={`${getResourceGradient(resource.type)} text-white text-xs whitespace-nowrap bg-gradient-to-r`}>
                          {resource.type}
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-slate-400 line-clamp-2">{resource.description}</p>
                      
                      <a 
                        href={resource.link} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="inline-flex items-center gap-2 text-sm text-cyan-400 hover:text-cyan-300 mt-3 transition-colors duration-300 group/link"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ExternalLink className="h-3 w-3 group-hover/link:scale-110 transition-transform duration-300" />
                        <span className="truncate">
                          {resource.link.length > 35 ? resource.link.substring(0, 35) + '...' : resource.link}
                        </span>
                      </a>
                    </div>
                  </div>

                  {viewMode === "grid" && (
                    <>
                      {/* Status selector */}
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-400">Status:</span>
                        <Select 
                          value={resource.status || 'not_started'} 
                          onValueChange={(v) => updateStatus(resource.id, v as any)}
                        >
                          <SelectTrigger className={cn("h-7 text-xs w-32", getStatusColor(resource.status))}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-800 border-slate-700">
                            <SelectItem value="not_started" className="text-white hover:bg-slate-700 text-xs">Not Started</SelectItem>
                            <SelectItem value="in_progress" className="text-white hover:bg-slate-700 text-xs">In Progress</SelectItem>
                            <SelectItem value="completed" className="text-white hover:bg-slate-700 text-xs">Completed</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {resource.relatedSkillsets.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {resource.relatedSkillsets.map(skill => (
                            <Badge key={skill} variant="outline" className="text-xs bg-slate-800/50 border-slate-600/50 text-slate-300">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      )}
                      
                      {resource.notes && (
                        <div className="p-3 bg-slate-800/30 rounded-lg border border-slate-700/30">
                          <p className="text-sm font-medium text-slate-300 mb-1">Notes:</p>
                          <p className="text-sm text-slate-400 line-clamp-2">{resource.notes}</p>
                        </div>
                      )}
                    </>
                  )}
                  
                  <div className={cn(
                    "flex justify-end gap-2 pt-4 border-t border-slate-700/30",
                    viewMode === "list" && "pt-0 border-t-0"
                  )}>
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
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      
      <ResourceDialog 
        open={dialogOpen} 
        onOpenChange={setDialogOpen} 
        onSave={handleAddResource} 
        resource={currentResource} 
      />
    </div>
  );
}
