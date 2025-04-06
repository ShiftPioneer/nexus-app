
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Filter, Grid3X3, List, Search, FolderOpen, Inbox, FileSpreadsheet, Archive, Tag } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import KnowledgeList from "./KnowledgeList";
import KnowledgeCategoryView from "./KnowledgeCategoryView";
import { KnowledgeInbox } from "./KnowledgeInbox";
import { useKnowledge } from "@/contexts/KnowledgeContext";
import { KnowledgeCategory } from "@/types/knowledge";
import AIInsightsPanel from "./AIInsightsPanel";

export function SecondBrainSystem() {
  const {
    entries,
    getEntriesByCategory,
    searchQuery,
    setSearchQuery,
    activeFilter,
    setActiveFilter,
    activeTags,
    setActiveTags,
    filterEntries,
    getEntriesStats,
  } = useKnowledge();
  
  const [activeCategory, setActiveCategory] = useState<KnowledgeCategory | 'all'>('all');
  const [showAddPanel, setShowAddPanel] = useState(false);
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [showAIInsights, setShowAIInsights] = useState(false);
  
  useEffect(() => {
    const tags = new Set<string>();
    entries.forEach(entry => {
      entry.tags.forEach(tag => tags.add(tag));
    });
    setAvailableTags(Array.from(tags));
  }, [entries]);
  
  const stats = getEntriesStats ? getEntriesStats() : {
    categories: {
      inboxCount: 0,
      projectsCount: 0,
      areasCount: 0,
      resourcesCount: 0,
      archivesCount: 0
    },
    totalEntries: 0,
    withTasks: 0,
    withFiles: 0
  };
  
  const filteredEntries = filterEntries ? filterEntries(
    activeFilter || 'all', 
    activeTags || [], 
    searchQuery || ''
  ) : [];
  
  const toggleTag = (tag: string) => {
    if (activeTags?.includes(tag)) {
      setActiveTags?.(activeTags.filter(t => t !== tag));
    } else {
      setActiveTags?.([...(activeTags || []), tag]);
    }
  };
  
  const clearFilters = () => {
    setActiveFilter?.('all');
    setActiveTags?.([]);
    setSearchQuery?.('');
  };
  
  const handleAddPanelClose = () => {
    setShowAddPanel(false);
  };
  
  return (
    <div>
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div className="flex-1 w-full relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search your Second Brain..."
            value={searchQuery || ''}
            onChange={(e) => setSearchQuery?.(e.target.value)}
            className="pl-9 w-full"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant={showAddPanel ? "default" : "outline"} 
            onClick={() => setShowAddPanel(!showAddPanel)}
          >
            Capture Knowledge
          </Button>
          <Button
            variant={showAIInsights ? "default" : "outline"}
            onClick={() => setShowAIInsights(!showAIInsights)}
          >
            AI Insights
          </Button>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2 mt-4">
        <Button 
          variant={activeFilter === 'all' ? "default" : "outline"} 
          size="sm" 
          onClick={() => setActiveFilter?.('all')}
          className="flex gap-1 items-center"
        >
          <FolderOpen className="h-4 w-4" />
          All
          <Badge variant="secondary" className="ml-1">
            {stats.totalEntries}
          </Badge>
        </Button>
        <Button 
          variant={activeFilter === 'inbox' ? "default" : "outline"} 
          size="sm" 
          onClick={() => setActiveFilter?.('inbox')}
          className="flex gap-1 items-center"
        >
          <Inbox className="h-4 w-4" />
          Inbox
          <Badge variant="secondary" className="ml-1">
            {stats.categories.inboxCount}
          </Badge>
        </Button>
        <Button 
          variant={activeFilter === 'projects' ? "default" : "outline"}
          size="sm" 
          onClick={() => setActiveFilter?.('projects')}
          className="flex gap-1 items-center"
        >
          <FileSpreadsheet className="h-4 w-4" />
          Projects
          <Badge variant="secondary" className="ml-1">
            {stats.categories.projectsCount}
          </Badge>
        </Button>
        <Button 
          variant={activeFilter === 'areas' ? "default" : "outline"}
          size="sm" 
          onClick={() => setActiveFilter?.('areas')}
          className="flex gap-1 items-center"
        >
          <FolderOpen className="h-4 w-4" />
          Areas
          <Badge variant="secondary" className="ml-1">
            {stats.categories.areasCount}
          </Badge>
        </Button>
        <Button 
          variant={activeFilter === 'resources' ? "default" : "outline"}
          size="sm" 
          onClick={() => setActiveFilter?.('resources')}
          className="flex gap-1 items-center"
        >
          <FolderOpen className="h-4 w-4" />
          Resources
          <Badge variant="secondary" className="ml-1">
            {stats.categories.resourcesCount}
          </Badge>
        </Button>
        <Button 
          variant={activeFilter === 'archives' ? "default" : "outline"}
          size="sm" 
          onClick={() => setActiveFilter?.('archives')}
          className="flex gap-1 items-center"
        >
          <Archive className="h-4 w-4" />
          Archives
          <Badge variant="secondary" className="ml-1">
            {stats.categories.archivesCount}
          </Badge>
        </Button>
        
        {availableTags.length > 0 && (
          <div className="flex flex-wrap items-center gap-1 ml-2 border-l pl-2">
            <Tag className="h-4 w-4 text-muted-foreground mr-1" />
            {availableTags.slice(0, 5).map(tag => (
              <Badge 
                key={tag}
                variant={activeTags?.includes(tag) ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => toggleTag(tag)}
              >
                {tag}
              </Badge>
            ))}
            {availableTags.length > 5 && (
              <Badge variant="secondary">+{availableTags.length - 5} more</Badge>
            )}
          </div>
        )}
        
        {(activeFilter !== 'all' || (activeTags && activeTags.length > 0) || searchQuery) && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={clearFilters}
            className="ml-auto"
          >
            Clear filters
          </Button>
        )}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-2">
          {showAddPanel ? (
            <KnowledgeInbox 
              open={true} 
              onOpenChange={handleAddPanelClose}
            />
          ) : (
            <KnowledgeList 
              entries={filteredEntries}
              showCategory={activeFilter === 'all'}
            />
          )}
        </div>
        
        <div className="lg:col-span-1">
          {showAIInsights ? (
            <AIInsightsPanel />
          ) : (
            <Card className="h-full">
              <KnowledgeCategoryView 
                category={activeFilter as KnowledgeCategory}
                showEntryList={false}
              />
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

export default SecondBrainSystem;
