
import React, { useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { KnowledgeHeader } from "@/components/knowledge/KnowledgeHeader";
import { NotesTab } from "@/components/knowledge/NotesTab";
import ResourcesTab from "@/components/knowledge/ResourcesTab";
import { BookshelfTab } from "@/components/knowledge/BookshelfTab";
import { SkillsetTab } from "@/components/knowledge/SkillsetTab";
import { TagsTab } from "@/components/knowledge/TagsTab";
import AIInsightsPanel from "@/components/knowledge/AIInsightsPanel";
import { useToast } from "@/hooks/use-toast";

const Knowledge: React.FC = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>("notes");
  
  const handleAddNewItem = () => {
    toast({
      title: `Create new ${activeTab === "notes" ? "note" : 
        activeTab === "resources" ? "resource" : 
        activeTab === "books" ? "book" : 
        activeTab === "skillsets" ? "skillset" : 
        activeTab === "tags" ? "tag" : ""}`,
      description: "Creation dialog coming soon",
      duration: 3000,
    });
  };
  
  return (
    <AppLayout>
      <div className="container px-4 py-6 mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Knowledge Base</h1>
            <p className="text-muted-foreground">Organize your notes, resources, books, and skillsets</p>
          </div>
          <Button onClick={handleAddNewItem} className="gap-2">
            <Plus className="h-4 w-4" />
            Add {
              activeTab === "notes" ? "Note" : 
              activeTab === "resources" ? "Resource" : 
              activeTab === "books" ? "Book" : 
              activeTab === "skillsets" ? "Skillset" : 
              activeTab === "tags" ? "Tag" : ""
            }
          </Button>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <KnowledgeHeader activeTab={activeTab} setActiveTab={setActiveTab} />
          
          <TabsContent value="notes" className="mt-6">
            <NotesTab />
          </TabsContent>
          
          <TabsContent value="resources" className="mt-6">
            <ResourcesTab />
          </TabsContent>
          
          <TabsContent value="books" className="mt-6">
            <BookshelfTab />
          </TabsContent>
          
          <TabsContent value="skillsets" className="mt-6">
            <SkillsetTab />
          </TabsContent>
          
          <TabsContent value="insights" className="mt-6">
            <AIInsightsPanel />
          </TabsContent>
          
          <TabsContent value="tags" className="mt-6">
            <TagsTab />
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Knowledge;
