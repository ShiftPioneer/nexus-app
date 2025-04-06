
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import KnowledgeList from "./KnowledgeList";
import KnowledgeCategoryView from "./KnowledgeCategoryView";
import { KnowledgeInbox } from "./KnowledgeInbox";
import { 
  FolderOpen, 
  Inbox, 
  FileSpreadsheet, 
  Archive, 
  Tag,
  ArrowLeft
} from "lucide-react";
import AIInsightsPanel from "./AIInsightsPanel";
import { KnowledgeEntry, KnowledgeCategory } from "@/types/knowledge";

interface SecondBrainSystemProps {
  entries: KnowledgeEntry[];
  onAddEntry: () => void;
}

export function SecondBrainSystem({ entries, onAddEntry }: SecondBrainSystemProps) {
  const [activeCategory, setActiveCategory] = useState<"all" | KnowledgeCategory>("all");
  const [activeSidebarItem, setActiveSidebarItem] = useState<string>("all");
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const { toast } = useToast();

  useEffect(() => {
    console.log("SecondBrainSystem mounted with entries:", entries);
  }, [entries]);

  const categoryCounts = {
    all: entries.length,
    note: entries.filter(e => e.category === "note").length,
    resource: entries.filter(e => e.category === "resource").length,
    reference: entries.filter(e => e.category === "reference").length,
    concept: entries.filter(e => e.category === "concept").length,
    idea: entries.filter(e => e.category === "idea").length,
  };

  const tagCounts: { [key: string]: number } = {};
  entries.forEach(entry => {
    entry.tags.forEach(tag => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
  });

  const handleCategoryClick = (category: "all" | KnowledgeCategory) => {
    setActiveCategory(category);
    setActiveSidebarItem(category);
    setActiveFilter("all");
  };

  const handleTagClick = (tag: string) => {
    setActiveCategory("all");
    setActiveSidebarItem(`tag-${tag}`);
    setActiveFilter(tag);
  };

  const filteredEntries = entries.filter(entry => {
    if (activeCategory !== "all" && entry.category !== activeCategory) {
      return false;
    }
    
    if (activeFilter !== "all" && !entry.tags.includes(activeFilter)) {
      return false;
    }
    
    return true;
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {/* Sidebar */}
      <Card className="col-span-1 h-fit">
        <CardContent className="p-4">
          <nav className="space-y-2">
            <button
              onClick={() => handleCategoryClick("all")}
              className={cn(
                "w-full flex items-center justify-between p-2 rounded-md hover:bg-secondary text-left",
                activeSidebarItem === "all" && "bg-secondary"
              )}
            >
              <span className="flex items-center gap-2">
                <FolderOpen className="h-4 w-4" />
                All Entries
              </span>
              <Badge variant="outline" className="ml-auto">
                {categoryCounts.all}
              </Badge>
            </button>
            
            <button
              onClick={() => handleCategoryClick("note")}
              className={cn(
                "w-full flex items-center justify-between p-2 rounded-md hover:bg-secondary text-left",
                activeSidebarItem === "note" && "bg-secondary"
              )}
            >
              <span className="flex items-center gap-2">
                <Inbox className="h-4 w-4" />
                Notes
              </span>
              <Badge variant="outline" className="ml-auto">
                {categoryCounts.note}
              </Badge>
            </button>
            
            <button
              onClick={() => handleCategoryClick("resource")}
              className={cn(
                "w-full flex items-center justify-between p-2 rounded-md hover:bg-secondary text-left",
                activeSidebarItem === "resource" && "bg-secondary"
              )}
            >
              <span className="flex items-center gap-2">
                <FileSpreadsheet className="h-4 w-4" />
                Resources
              </span>
              <Badge variant="outline" className="ml-auto">
                {categoryCounts.resource}
              </Badge>
            </button>
            
            <button
              onClick={() => handleCategoryClick("reference")}
              className={cn(
                "w-full flex items-center justify-between p-2 rounded-md hover:bg-secondary text-left",
                activeSidebarItem === "reference" && "bg-secondary"
              )}
            >
              <span className="flex items-center gap-2">
                <FolderOpen className="h-4 w-4" />
                References
              </span>
              <Badge variant="outline" className="ml-auto">
                {categoryCounts.reference}
              </Badge>
            </button>
            
            <button
              onClick={() => handleCategoryClick("concept")}
              className={cn(
                "w-full flex items-center justify-between p-2 rounded-md hover:bg-secondary text-left",
                activeSidebarItem === "concept" && "bg-secondary"
              )}
            >
              <span className="flex items-center gap-2">
                <FolderOpen className="h-4 w-4" />
                Concepts
              </span>
              <Badge variant="outline" className="ml-auto">
                {categoryCounts.concept}
              </Badge>
            </button>
            
            <button
              onClick={() => handleCategoryClick("idea")}
              className={cn(
                "w-full flex items-center justify-between p-2 rounded-md hover:bg-secondary text-left",
                activeSidebarItem === "idea" && "bg-secondary"
              )}
            >
              <span className="flex items-center gap-2">
                <Archive className="h-4 w-4" />
                Ideas
              </span>
              <Badge variant="outline" className="ml-auto">
                {categoryCounts.idea}
              </Badge>
            </button>
            
            {/* Tags section */}
            <div className="pt-4">
              <h3 className="text-sm font-medium mb-2">Tags</h3>
              <div className="space-y-1 max-h-48 overflow-y-auto">
                {Object.entries(tagCounts).map(([tag, count]) => (
                  <button
                    key={tag}
                    onClick={() => handleTagClick(tag)}
                    className={cn(
                      "w-full flex items-center justify-between p-2 rounded-md hover:bg-secondary text-sm text-left",
                      activeSidebarItem === `tag-${tag}` && "bg-secondary"
                    )}
                  >
                    <span className="flex items-center gap-2">
                      <Tag className="h-3 w-3" />
                      {tag}
                    </span>
                    <Badge variant="outline" className="text-xs ml-auto">{count}</Badge>
                  </button>
                ))}
                {Object.keys(tagCounts).length === 0 && (
                  <div className="text-sm text-muted-foreground p-2">
                    No tags yet
                  </div>
                )}
              </div>
            </div>
          </nav>
        </CardContent>
      </Card>

      {/* Main content area */}
      <div className="col-span-1 md:col-span-3 space-y-6">
        <KnowledgeInbox onAddEntry={onAddEntry} />

        <Tabs defaultValue="list">
          <TabsList>
            <TabsTrigger value="list">List</TabsTrigger>
            <TabsTrigger value="category">Category</TabsTrigger>
            <TabsTrigger value="insights">AI Insights</TabsTrigger>
          </TabsList>
          
          <TabsContent value="list" className="mt-6">
            <Card>
              <KnowledgeList entries={filteredEntries} />
            </Card>
          </TabsContent>
          
          <TabsContent value="category" className="mt-6">
            <Card>
              <KnowledgeCategoryView entries={filteredEntries} />
            </Card>
          </TabsContent>
          
          <TabsContent value="insights" className="mt-6">
            <AIInsightsPanel />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
