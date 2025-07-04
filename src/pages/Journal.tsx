
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

  // Placeholder data and handlers
  const [entries] = useState<JournalEntry[]>([]);

  // Create a default initial entry for the editor
  const initialEntry: JournalEntry = {
    id: '',
    title: '',
    content: '',
    date: new Date(),
    tags: [],
    mood: 'neutral'
  };

  const handleSave = (entry: JournalEntry) => {
    console.log('Save entry:', entry);
  };

  const handleCancel = () => {
    console.log('Cancel editing');
  };

  const handleEditEntry = (entry: JournalEntry) => {
    console.log('Edit entry:', entry);
  };

  const handleDeleteEntry = (id: string) => {
    console.log('Delete entry:', id);
  };

  const handleNewEntry = () => {
    console.log('New entry');
    setActiveTab("write");
  };

  const handleTabChange = (tab: string) => {
    console.log('Tab change:', tab);
  };

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
          <ModernTabsList className="grid w-full grid-cols-4">
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
          
          <ModernTabsContent value="write" className="mt-8">
            <div className="max-w-4xl mx-auto">
              <JournalEditor 
                initialEntry={initialEntry}
                onSave={handleSave}
                onCancel={handleCancel}
              />
            </div>
          </ModernTabsContent>
          
          <ModernTabsContent value="entries" className="mt-8">
            <div className="max-w-6xl mx-auto">
              <JournalEntriesList 
                entries={entries}
                activeTab={activeTab}
                onTabChange={handleTabChange}
                onEditEntry={handleEditEntry}
                onDeleteEntry={handleDeleteEntry}
                onNewEntry={handleNewEntry}
              />
            </div>
          </ModernTabsContent>
          
          <ModernTabsContent value="insights" className="mt-8">
            <div className="max-w-6xl mx-auto">
              <JournalStats entries={entries} />
            </div>
          </ModernTabsContent>
          
          <ModernTabsContent value="prompts" className="mt-8">
            <div className="max-w-4xl mx-auto">
              <JournalPrompts />
            </div>
          </ModernTabsContent>
        </ModernTabs>
      </div>
    </ModernAppLayout>
  );
};

export default Journal;
