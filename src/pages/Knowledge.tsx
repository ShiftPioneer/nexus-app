
import React, { useState } from "react";
import ModernAppLayout from "@/components/layout/ModernAppLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
      gradient: "from-purple-500 via-violet-500 to-indigo-500",
      bgGradient: "from-purple-500/10 via-violet-500/10 to-indigo-500/10",
      description: "Track your skills"
    },
    { 
      value: "resources", 
      label: "Resources", 
      icon: LayoutGrid, 
      gradient: "from-blue-500 via-cyan-500 to-teal-500",
      bgGradient: "from-blue-500/10 via-cyan-500/10 to-teal-500/10",
      description: "Learning materials"
    },
    { 
      value: "bookshelf", 
      label: "Bookshelf", 
      icon: BookOpen, 
      gradient: "from-emerald-500 via-green-500 to-teal-500",
      bgGradient: "from-emerald-500/10 via-green-500/10 to-teal-500/10",
      description: "Digital library"
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
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-slate-800/30 border border-slate-700/30 backdrop-blur-sm rounded-2xl p-2 shadow-lg">
            {tabItems.map((tab) => (
              <TabsTrigger 
                key={tab.value}
                value={tab.value} 
                className={`
                  group relative flex items-center gap-3 px-6 py-4 rounded-xl transition-all duration-300 overflow-hidden
                  data-[state=active]:shadow-lg data-[state=active]:shadow-black/20
                  hover:bg-slate-700/30 text-slate-400 hover:text-slate-200
                  ${activeTab === tab.value ? `bg-gradient-to-r ${tab.gradient} text-white shadow-xl` : ''}
                `}
              >
                {/* Background gradient for active state */}
                {activeTab === tab.value && (
                  <div className={`absolute inset-0 bg-gradient-to-r ${tab.bgGradient} opacity-20`} />
                )}
                
                {/* Icon */}
                <div className={`
                  relative flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-300
                  ${activeTab === tab.value ? 'bg-white/20 shadow-lg' : 'bg-slate-700/50 group-hover:bg-slate-600/50'}
                `}>
                  <tab.icon className="h-4 w-4" />
                </div>
                
                {/* Text content */}
                <div className="flex flex-col items-start">
                  <span className="font-semibold">{tab.label}</span>
                  <span className="text-xs opacity-80">{tab.description}</span>
                </div>
                
                {/* Hover shimmer effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 rounded-xl" />
              </TabsTrigger>
            ))}
          </TabsList>
          
          <TabsContent value="skillsets" className="mt-8">
            <SkillsetTab />
          </TabsContent>
          
          <TabsContent value="resources" className="mt-8">
            <ResourcesTab />
          </TabsContent>
          
          <TabsContent value="bookshelf" className="mt-8">
            <BookshelfTab />
          </TabsContent>
        </Tabs>
      </div>
    </ModernAppLayout>
  );
};

export default Knowledge;
