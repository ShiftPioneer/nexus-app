
import React, { useState } from "react";
import ModernAppLayout from "@/components/layout/ModernAppLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SkillsetTab } from "@/components/knowledge/SkillsetTab";
import { ResourcesTab } from "@/components/knowledge/ResourcesTab";
import BookshelfTab from "@/components/knowledge/BookshelfTab";
import { BookOpen, LayoutGrid, Brain } from "lucide-react";

const Knowledge = () => {
  const [activeTab, setActiveTab] = useState("skillsets");
  
  const tabItems = [
    { value: "skillsets", label: "Skillsets", icon: Brain, gradient: "from-purple-500 to-pink-600" },
    { value: "resources", label: "Resources", icon: LayoutGrid, gradient: "from-blue-500 to-indigo-600" },
    { value: "bookshelf", label: "Bookshelf", icon: BookOpen, gradient: "from-emerald-500 to-teal-600" }
  ];
  
  return (
    <ModernAppLayout>
      <div className="animate-fade-in space-y-6 max-w-full overflow-hidden">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-600 shadow-lg">
              <BookOpen className="h-5 w-5 text-white" />
            </div>
            Knowledge Hub
          </h1>
          <p className="text-muted-foreground my-[10px]">Track your learning progress and manage your educational resources</p>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-slate-800/50 border border-slate-700/50 backdrop-blur-sm rounded-xl p-1">
            {tabItems.map((tab) => (
              <TabsTrigger 
                key={tab.value}
                value={tab.value} 
                className={`
                  flex items-center gap-2 px-4 py-3 rounded-lg transition-all duration-300
                  data-[state=active]:bg-gradient-to-r data-[state=active]:${tab.gradient} 
                  data-[state=active]:text-white data-[state=active]:shadow-lg
                  hover:bg-slate-700/50 text-slate-300
                `}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </TabsTrigger>
            ))}
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
