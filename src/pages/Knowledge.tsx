import React, { useState } from "react";
import ModernAppLayout from "@/components/layout/ModernAppLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { SkillsetTab } from "@/components/knowledge/SkillsetTab";
import { ResourcesTab } from "@/components/knowledge/ResourcesTab";
import BookshelfTab from "@/components/knowledge/BookshelfTab";
import { BookOpen, LayoutGrid, Brain } from "lucide-react";
const Knowledge = () => {
  const [activeTab, setActiveTab] = useState("skillsets");
  return <ModernAppLayout>
      <div className="animate-fade-in space-y-6 max-w-full overflow-hidden">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-primary" />
            Knowledge Hub
          </h1>
          <p className="text-muted-foreground my-[10px]">Track your learning progress and manage your educational resources</p>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="bg-card border rounded-lg overflow-x-auto mb-6 w-fit">
            <TabsList className="justify-start border-b p-0 w-fit bg-slate-950 rounded-lg">
              <TabsTrigger value="skillsets" className={cn("data-[state=active]:bg-background rounded-none border-r px-6 py-3", "flex items-center gap-2 whitespace-nowrap")}>
                <Brain className="h-4 w-4" />
                Skillsets
              </TabsTrigger>
              <TabsTrigger value="resources" className={cn("data-[state=active]:bg-background rounded-none border-r px-6 py-3", "flex items-center gap-2 whitespace-nowrap")}>
                <LayoutGrid className="h-4 w-4" />
                Resources
              </TabsTrigger>
              <TabsTrigger value="bookshelf" className={cn("data-[state=active]:bg-background rounded-none px-6 py-3", "flex items-center gap-2 whitespace-nowrap")}>
                <BookOpen className="h-4 w-4" />
                Bookshelf
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="skillsets" className="mt-0">
            <SkillsetTab />
          </TabsContent>
          
          <TabsContent value="resources" className="mt-0">
            <ResourcesTab />
          </TabsContent>
          
          <TabsContent value="bookshelf" className="mt-0">
            <BookshelfTab />
          </TabsContent>
        </Tabs>
      </div>
    </ModernAppLayout>;
};
export default Knowledge;