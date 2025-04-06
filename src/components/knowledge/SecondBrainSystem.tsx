
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus, Filter } from "lucide-react";
import { Label } from "@/components/ui/label";
import { KnowledgeEntry, KnowledgeCategory } from "@/types/knowledge";
import KnowledgeCategoryView from "./KnowledgeCategoryView";
import { EntryDialog } from "./EntryDialog";
import { useToast } from "@/hooks/use-toast";
import { useKnowledge } from "@/contexts/KnowledgeContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function SecondBrainSystem() {
  const { entries, addEntry, updateEntry } = useKnowledge();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | KnowledgeCategory>("all");
  const [editingEntry, setEditingEntry] = useState<KnowledgeEntry | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Get unique tags from all entries
  const allTags = Array.from(new Set(entries.flatMap(entry => entry.tags || [])));

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Filter entries based on search query, active tab, and selected tags
  const filteredEntries = entries.filter(entry => {
    const matchesSearch = 
      entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.content.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = activeTab === "all" || entry.category === activeTab;
    
    const matchesTags = 
      selectedTags.length === 0 || 
      selectedTags.some(tag => entry.tags.includes(tag));
    
    return matchesSearch && matchesCategory && matchesTags;
  });

  const handleAddEntry = () => {
    setEditingEntry(null);
    setDialogOpen(true);
  };

  const handleEditEntry = (entry: KnowledgeEntry) => {
    setEditingEntry(entry);
    setDialogOpen(true);
  };

  const handleSaveEntry = (entry: KnowledgeEntry) => {
    if (editingEntry) {
      updateEntry(entry.id, entry);
      toast({
        title: "Entry updated",
        description: `"${entry.title}" has been updated successfully.`,
      });
    } else {
      addEntry(entry);
      toast({
        title: "Entry added",
        description: `"${entry.title}" has been added to your knowledge base.`,
      });
    }
    
    setDialogOpen(false);
    setEditingEntry(null);
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="w-full sm:w-96">
          <Label htmlFor="search-entries" className="sr-only">Search entries</Label>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              id="search-entries"
              placeholder="Search entries..."
              className="pl-9"
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>
        </div>
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              {allTags.map(tag => (
                <DropdownMenuCheckboxItem
                  key={tag}
                  checked={selectedTags.includes(tag)}
                  onCheckedChange={() => toggleTag(tag)}
                >
                  {tag}
                </DropdownMenuCheckboxItem>
              ))}
              {allTags.length === 0 && (
                <div className="px-2 py-1.5 text-sm text-muted-foreground">
                  No tags found
                </div>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button onClick={handleAddEntry} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Entry
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "all" | KnowledgeCategory)}>
        <TabsList className="mb-4 flex w-full flex-wrap">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="note">Notes</TabsTrigger>
          <TabsTrigger value="resource">Resources</TabsTrigger>
          <TabsTrigger value="reference">References</TabsTrigger>
          <TabsTrigger value="idea">Ideas</TabsTrigger>
          <TabsTrigger value="concept">Concepts</TabsTrigger>
          <TabsTrigger value="insight">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <KnowledgeCategoryView 
            entries={filteredEntries} 
            category="all"
            onAddEntry={handleAddEntry}
            onSelectEntry={handleEditEntry}
          />
        </TabsContent>
        
        <TabsContent value="note">
          <KnowledgeCategoryView 
            entries={filteredEntries.filter(entry => entry.category === "note")} 
            category="note"
            onAddEntry={handleAddEntry}
            onSelectEntry={handleEditEntry}
          />
        </TabsContent>
        
        <TabsContent value="resource">
          <KnowledgeCategoryView 
            entries={filteredEntries.filter(entry => entry.category === "resource")} 
            category="resource"
            onAddEntry={handleAddEntry}
            onSelectEntry={handleEditEntry}
          />
        </TabsContent>
        
        <TabsContent value="reference">
          <KnowledgeCategoryView 
            entries={filteredEntries.filter(entry => entry.category === "reference")} 
            category="reference"
            onAddEntry={handleAddEntry}
            onSelectEntry={handleEditEntry}
          />
        </TabsContent>
        
        <TabsContent value="idea">
          <KnowledgeCategoryView 
            entries={filteredEntries.filter(entry => entry.category === "idea")} 
            category="idea"
            onAddEntry={handleAddEntry}
            onSelectEntry={handleEditEntry}
          />
        </TabsContent>
        
        <TabsContent value="concept">
          <KnowledgeCategoryView 
            entries={filteredEntries.filter(entry => entry.category === "concept")} 
            category="concept"
            onAddEntry={handleAddEntry}
            onSelectEntry={handleEditEntry}
          />
        </TabsContent>
        
        <TabsContent value="insight">
          <KnowledgeCategoryView 
            entries={filteredEntries.filter(entry => entry.category === "insight")} 
            category="insight"
            onAddEntry={handleAddEntry}
            onSelectEntry={handleEditEntry}
          />
        </TabsContent>
      </Tabs>

      <EntryDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSave={handleSaveEntry}
        entry={editingEntry}
      />
    </div>
  );
}
