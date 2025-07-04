
import React, { useState } from "react";
import ModernAppLayout from "@/components/layout/ModernAppLayout";
import { ModernTabs, ModernTabsList, ModernTabsTrigger, ModernTabsContent } from "@/components/ui/modern-tabs";
import { UnifiedPageHeader } from "@/components/ui/unified-page-header";
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
        <UnifiedPageHeader
          title="Knowledge Hub"
          description="Track your learning progress and manage your educational resources"
          icon={Lightbulb}
          gradient="from-teal-500 via-cyan-500 to-blue-500"
        />
        
        <ModernTabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <ModernTabsList className="grid w-full grid-cols-3 max-w-2xl mx-auto">
            {tabItems.map((tab) => (
              <ModernTabsTrigger 
                key={tab.value}
                value={tab.value}
                gradient={tab.gradient}
                icon={tab.icon}
                className="flex-1"
              >
                {tab.label}
              </ModernTabsTrigger>
            ))}
          </ModernTabsList>
          
          <ModernTabsContent value="skillsets" className="mt-8">
            <div className="max-w-6xl mx-auto">
              <SkillsetTab />
            </div>
          </ModernTabsContent>
          
          <ModernTabsContent value="resources" className="mt-8">
            <div className="max-w-6xl mx-auto">
              <ResourcesTab />
            </div>
          </ModernTabsContent>
          
          <ModernTabsContent value="bookshelf" className="mt-8">
            <div className="max-w-6xl mx-auto">
              <BookshelfTab />
            </div>
          </ModernTabsContent>
        </ModernTabs>
      </div>
    </ModernAppLayout>
  );
};

export default Knowledge;
