
import React, { useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { LayoutGrid, BookOpen, Brain, Archive, SquarePen, Inbox } from "lucide-react";
import { KnowledgeProvider } from "@/contexts/KnowledgeContext";
import SecondBrainSystem from "@/components/knowledge/SecondBrainSystem";

const Knowledge = () => {
  const [activeTab, setActiveTab] = useState("second-brain");
  
  return (
    <AppLayout>
      <div className="animate-fade-in space-y-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-primary" />
            Knowledge Hub
          </h1>
          <p className="text-muted-foreground my-[10px]">Track your learning progress and manage your educational resources</p>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="bg-card border rounded-lg overflow-hidden mb-6">
            <TabsList className="w-full justify-start rounded-none border-b bg-muted/50 p-0">
              <TabsTrigger 
                value="second-brain" 
                className={cn(
                  "data-[state=active]:bg-background rounded-none border-r px-8 py-3", 
                  "flex items-center gap-2"
                )}
              >
                <Brain className="h-4 w-4" />
                Second Brain
              </TabsTrigger>
              <TabsTrigger 
                value="skillsets" 
                className={cn(
                  "data-[state=active]:bg-background rounded-none border-r px-8 py-3", 
                  "flex items-center gap-2"
                )}
              >
                <Brain className="h-4 w-4" />
                Skillsets
              </TabsTrigger>
              <TabsTrigger 
                value="resources" 
                className={cn(
                  "data-[state=active]:bg-background rounded-none border-r px-8 py-3", 
                  "flex items-center gap-2"
                )}
              >
                <LayoutGrid className="h-4 w-4" />
                Resources
              </TabsTrigger>
              <TabsTrigger 
                value="bookshelf" 
                className={cn(
                  "data-[state=active]:bg-background rounded-none px-8 py-3", 
                  "flex items-center gap-2"
                )}
              >
                <BookOpen className="h-4 w-4" />
                Bookshelf
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="second-brain" className="mt-0">
            <KnowledgeProvider>
              <SecondBrainSystem />
            </KnowledgeProvider>
          </TabsContent>
          
          <TabsContent value="skillsets" className="mt-0">
            <div className="text-center p-8 text-muted-foreground">
              Skillsets tab will be available soon...
            </div>
          </TabsContent>
          
          <TabsContent value="resources" className="mt-0">
            <div className="text-center p-8 text-muted-foreground">
              Resources tab will be available soon...
            </div>
          </TabsContent>
          
          <TabsContent value="bookshelf" className="mt-0">
            <div className="text-center p-8 text-muted-foreground">
              Bookshelf tab will be available soon...
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Knowledge;
