
import React, { useState } from "react";
import ModernAppLayout from "@/components/layout/ModernAppLayout";
import { ModernTabs, ModernTabsList, ModernTabsTrigger, ModernTabsContent } from "@/components/ui/modern-tabs";
import { UnifiedPageHeader } from "@/components/ui/unified-page-header";
import { PenTool, BookOpen, BarChart3, Lightbulb } from "lucide-react";
import JournalEditor from "@/components/journal/JournalEditor";
import JournalEntriesList from "@/components/journal/JournalEntriesList";
import JournalStats from "@/components/journal/JournalStats";
import JournalPrompts from "@/components/journal/JournalPrompts";

const Journal = () => {
  const [activeTab, setActiveTab] = useState("write");

  const tabItems = [
    { 
      value: "write", 
      label: "Write", 
      icon: PenTool,
      gradient: "from-purple-500 via-pink-500 to-rose-500"
    },
    { 
      value: "entries", 
      label: "Entries", 
      icon: BookOpen,
      gradient: "from-blue-500 via-indigo-500 to-purple-500"
    },
    { 
      value: "insights", 
      label: "Insights", 
      icon: BarChart3,
      gradient: "from-emerald-500 via-teal-500 to-cyan-500"
    },
    { 
      value: "prompts", 
      label: "Prompts", 
      icon: Lightbulb,
      gradient: "from-orange-500 via-red-500 to-pink-500"
    }
  ];

  return (
    <ModernAppLayout>
      <div className="animate-fade-in space-y-8">
        <UnifiedPageHeader
          title="Productivity Journal"
          description="Reflect, track progress, and gain insights through journaling"
          icon={PenTool}
          gradient="from-purple-500 via-pink-500 to-rose-500"
        />

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
          
          <ModernTabsContent value="write">
            <JournalEditor />
          </ModernTabsContent>
          
          <ModernTabsContent value="entries">
            <JournalEntriesList />
          </ModernTabsContent>
          
          <ModernTabsContent value="insights">
            <JournalStats />
          </ModernTabsContent>
          
          <ModernTabsContent value="prompts">
            <JournalPrompts />
          </ModernTabsContent>
        </ModernTabs>
      </div>
    </ModernAppLayout>
  );
};

export default Journal;
