
import React, { useState } from "react";
import ModernAppLayout from "@/components/layout/ModernAppLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SkillsetTab } from "@/components/knowledge/SkillsetTab";
import { ResourcesTab } from "@/components/knowledge/ResourcesTab";
import BookshelfTab from "@/components/knowledge/BookshelfTab";
import { BookOpen, LayoutGrid, Brain } from "lucide-react";

const Knowledge = () => {
  const [activeTab, setActiveTab] = useState("skillsets");
  return (
    <ModernAppLayout>
      <div className="animate-fade-in space-y-6 max-w-full overflow-hidden">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-primary" />
            Knowledge Hub
          </h1>
          <p className="text-muted-foreground my-[10px]">Track your learning progress and manage your educational resources</p>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList>
              <TabsTrigger value="skillsets" className="flex items-center gap-2 whitespace-nowrap">
                <Brain className="h-4 w-4" />
                Skillsets
              </TabsTrigger>
              <TabsTrigger value="resources" className="flex items-center gap-2 whitespace-nowrap">
                <LayoutGrid className="h-4 w-4" />
                Resources
              </TabsTrigger>
              <TabsTrigger value="bookshelf" className="flex items-center gap-2 whitespace-nowrap">
                <BookOpen className="h-4 w-4" />
                Bookshelf
              </TabsTrigger>
            </TabsList>
          
          <TabsContent value="skillsets" className="mt-6">
            <SkillsetTab />
          </TabsContent>
          
          <TabsContent value="resources" className="mt-6">
            <ResourcesTab />
          </TabsContent>
          
          <TabsContent value="bookshelf" className="mt-6">
            <BookshelfTab />
          </TabsContent>
        </Tabs>
      </div>
    </ModernAppLayout>
  );
};
export default Knowledge;
