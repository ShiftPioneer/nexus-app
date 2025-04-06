
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useKnowledge } from "@/contexts/KnowledgeContext";
import { KnowledgeEntry, KnowledgeCategory } from "@/types/knowledge";
import KnowledgeList from "./KnowledgeList";
import KnowledgeCategoryView from "./KnowledgeCategoryView";
import { EntryDialog } from "./EntryDialog";
import AIInsightsPanel from "./AIInsightsPanel";
import { KnowledgeInbox } from "./KnowledgeInbox";
import { 
  FolderOpen, 
  Inbox, 
  FileSpreadsheet, 
  Archive, 
  Tag, 
  ArrowLeft,
  ArrowRight
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function SecondBrainSystem() {
  const { 
    entries, 
    searchEntries,
    filterEntries, 
    addEntry, 
    updateEntry, 
    deleteEntry, 
    moveEntry,
    getEntriesStats,
    searchQuery,
    setSearchQuery,
    activeFilter,
    setActiveFilter,
    activeTags,
    setActiveTags
  } = useKnowledge();
  
  const [selectedEntry, setSelectedEntry] = useState<KnowledgeEntry | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  
  useEffect(() => {
    if (searchQuery && setSearchQuery) {
      setSearchQuery(searchQuery);
    }
  }, [searchQuery, setSearchQuery]);
  
  const handleFilterChange = (filter: string) => {
    if (setActiveFilter) {
      setActiveFilter(filter as "all" | KnowledgeCategory);
    }
  };
  
  const handleAddEntry = () => {
    setSelectedEntry(null);
    setEditMode(false);
    setDialogOpen(true);
  };
  
  const handleEditEntry = (entry: KnowledgeEntry) => {
    setSelectedEntry(entry);
    setEditMode(true);
    setDialogOpen(true);
  };
  
  const handleSaveEntry = (entry: Omit<KnowledgeEntry, "id">) => {
    if (selectedEntry && editMode) {
      updateEntry(selectedEntry.id, entry);
    } else {
      addEntry(entry);
    }
    setDialogOpen(false);
    setSelectedEntry(null);
  };
  
  const handleDeleteEntry = (entryId: string) => {
    deleteEntry(entryId);
    setSelectedEntry(null);
  };
  
  const handleMoveEntry = (entryId: string, category: KnowledgeCategory) => {
    if (moveEntry) {
      moveEntry(entryId, category);
    }
  };
  
  const stats = getEntriesStats ? getEntriesStats() : null;
  const filteredEntries = filterEntries 
    ? filterEntries(activeFilter || "all", activeTags || [], searchQuery || "") 
    : entries;
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="md:col-span-1">
          <CardContent className="p-4">
            <nav className="space-y-1">
              <Button
                variant={activeFilter === "all" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => handleFilterChange("all")}
              >
                <FolderOpen className="h-4 w-4 mr-2" />
                All Entries
                <Badge className="ml-auto" variant="secondary">
                  {stats?.totalEntries || entries.length}
                </Badge>
              </Button>
              
              <Button
                variant={activeFilter === "inbox" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => handleFilterChange("inbox")}
              >
                <Inbox className="h-4 w-4 mr-2" />
                Inbox
                <Badge className="ml-auto" variant="secondary">
                  {stats?.categories.inboxCount || 0}
                </Badge>
              </Button>
              
              <Button
                variant={activeFilter === "projects" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => handleFilterChange("projects")}
              >
                <FileSpreadsheet className="h-4 w-4 mr-2" />
                Projects
                <Badge className="ml-auto" variant="secondary">
                  {stats?.categories.projectsCount || 0}
                </Badge>
              </Button>
              
              <Button
                variant={activeFilter === "areas" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => handleFilterChange("areas")}
              >
                <FolderOpen className="h-4 w-4 mr-2" />
                Areas
                <Badge className="ml-auto" variant="secondary">
                  {stats?.categories.areasCount || 0}
                </Badge>
              </Button>
              
              <Button
                variant={activeFilter === "resources" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => handleFilterChange("resources")}
              >
                <FolderOpen className="h-4 w-4 mr-2" />
                Resources
                <Badge className="ml-auto" variant="secondary">
                  {stats?.categories.resourcesCount || 0}
                </Badge>
              </Button>
              
              <Button
                variant={activeFilter === "archives" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => handleFilterChange("archives")}
              >
                <Archive className="h-4 w-4 mr-2" />
                Archives
                <Badge className="ml-auto" variant="secondary">
                  {stats?.categories.archivesCount || 0}
                </Badge>
              </Button>
              
              <div className="pt-2 pb-1">
                <h3 className="px-3 text-sm font-medium">
                  <Tag className="h-4 w-4 inline mr-2" />
                  Common Tags
                </h3>
                <div className="flex flex-wrap gap-1 p-3">
                  <Badge variant="outline" className="cursor-pointer">
                    #productivity
                  </Badge>
                  <Badge variant="outline" className="cursor-pointer">
                    #reference
                  </Badge>
                  <Badge variant="outline" className="cursor-pointer">
                    #ideas
                  </Badge>
                  <Badge variant="outline" className="cursor-pointer">
                    View All <Badge className="ml-1" variant="secondary">{30}</Badge>
                  </Badge>
                </div>
              </div>
            </nav>
          </CardContent>
        </Card>
        
        <div className="md:col-span-3 space-y-6">
          <KnowledgeCategoryView 
            category={activeFilter || "all"} 
            entries={filteredEntries}
            onAddEntry={handleAddEntry}
            onSelectEntry={handleEditEntry}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <KnowledgeInbox />
        
        <div>
          <AIInsightsPanel />
          
          <Card className="mt-6">
            <KnowledgeList />
          </Card>
        </div>
      </div>
      
      <EntryDialog 
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        entry={selectedEntry}
        onSave={handleSaveEntry}
        onDelete={handleDeleteEntry}
        onMove={handleMoveEntry}
        editMode={editMode}
      />
    </div>
  );
}
