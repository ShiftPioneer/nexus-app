
import React, { useState } from "react";
import ModernAppLayout from "@/components/layout/ModernAppLayout";
import { ModernTabs, ModernTabsList, ModernTabsTrigger, ModernTabsContent } from "@/components/ui/modern-tabs";
import { SkillsetTab } from "@/components/knowledge/SkillsetTab";
import { ResourcesTab } from "@/components/knowledge/ResourcesTab";
import BookshelfTab from "@/components/knowledge/BookshelfTab";
import { BookOpen, LayoutGrid, Brain, Lightbulb } from "lucide-react";

const Knowledge = () => {
  const [activeTab, setActiveTab] = useState("skillsets");
  
  const tabItems = [
    { 
      value: "skillsets", 
      label: "Skillsets", 
      icon: Brain, 
      gradient: "from-purple-500 via-violet-500 to-indigo-500"
    },
    { 
      value: "resources", 
      label: "Resources", 
      icon: LayoutGrid, 
      gradient: "from-blue-500 via-cyan-500 to-teal-500"
    },
    { 
      value: "bookshelf", 
      label: "Bookshelf", 
      icon: BookOpen, 
      gradient: "from-emerald-500 via-green-500 to-teal-500"
    }
  ];
  
  return (
    <ModernAppLayout>
      <div className="animate-fade-in space-y-8 max-w-full overflow-hidden">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent flex items-center gap-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-500 shadow-lg">
              <Lightbulb className="h-6 w-6 text-white" />
            </div>
            Knowledge Hub
          </h1>
          <p className="text-slate-400 mt-3 text-lg">Track your learning progress and manage your educational resources</p>
        </div>
        
        <ModernTabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <ModernTabsList>
            {tabItems.map((tab) => (
              <ModernTabsTrigger 
                key={tab.value}
                value={tab.value}
                gradient={tab.gradient}
                icon={tab.icon}
              >
                {tab.label}
              </ModernTabsTrigger>
            ))}
          </ModernTabsList>
          
          <ModernTabsContent value="skillsets">
            <SkillsetTab />
          </ModernTabsContent>
          
          <ModernTabsContent value="resources">
            <ResourcesTab />
          </ModernTabsContent>
          
          <ModernTabsContent value="bookshelf">
            <BookshelfTab />
          </ModernTabsContent>
        </ModernTabs>
      </div>
    </ModernAppLayout>
  );
};

export default Knowledge;
