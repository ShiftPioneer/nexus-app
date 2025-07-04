
import React, { useState } from "react";
import ModernAppLayout from "@/components/layout/ModernAppLayout";
import { ModernTabs, ModernTabsList, ModernTabsTrigger, ModernTabsContent } from "@/components/ui/modern-tabs";
import { UnifiedPageHeader } from "@/components/ui/unified-page-header";
import { Brain, Target, Heart, Sparkles, Eye } from "lucide-react";
import VisionBoardSection from "@/components/mindset/VisionBoardSection";
import MissionSection from "@/components/mindset/MissionSection";
import CoreValuesSection from "@/components/mindset/CoreValuesSection";
import KeyBeliefsSection from "@/components/mindset/KeyBeliefsSection";
import AffirmationsSection from "@/components/mindset/AffirmationsSection";

const Mindset = () => {
  const [activeTab, setActiveTab] = useState("vision");

  const tabItems = [
    { 
      value: "vision", 
      label: "Vision Board", 
      icon: Eye,
      gradient: "from-purple-500 via-pink-500 to-rose-500"
    },
    { 
      value: "mission", 
      label: "Mission", 
      icon: Target,
      gradient: "from-blue-500 via-indigo-500 to-purple-500"
    },
    { 
      value: "values", 
      label: "Core Values", 
      icon: Heart,
      gradient: "from-emerald-500 via-teal-500 to-cyan-500"
    },
    { 
      value: "beliefs", 
      label: "Key Beliefs", 
      icon: Brain,
      gradient: "from-orange-500 via-red-500 to-pink-500"
    },
    { 
      value: "affirmations", 
      label: "Affirmations", 
      icon: Sparkles,
      gradient: "from-cyan-500 via-blue-500 to-indigo-500"
    }
  ];

  return (
    <ModernAppLayout>
      <div className="animate-fade-in space-y-8">
        <UnifiedPageHeader
          title="Mindset OS"
          description="Shape your mindset, clarify your vision, and align with your values"
          icon={Brain}
          gradient="from-purple-500 via-pink-500 to-rose-500"
        />

        <ModernTabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <ModernTabsList className="grid w-full grid-cols-5 max-w-4xl mx-auto">
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
          
          <ModernTabsContent value="vision" className="mt-8">
            <div className="max-w-6xl mx-auto">
              <VisionBoardSection />
            </div>
          </ModernTabsContent>
          
          <ModernTabsContent value="mission" className="mt-8">
            <div className="max-w-4xl mx-auto">
              <MissionSection />
            </div>
          </ModernTabsContent>
          
          <ModernTabsContent value="values" className="mt-8">
            <div className="max-w-4xl mx-auto">
              <CoreValuesSection />
            </div>
          </ModernTabsContent>
          
          <ModernTabsContent value="beliefs" className="mt-8">
            <div className="max-w-4xl mx-auto">
              <KeyBeliefsSection />
            </div>
          </ModernTabsContent>
          
          <ModernTabsContent value="affirmations" className="mt-8">
            <div className="max-w-4xl mx-auto">
              <AffirmationsSection />
            </div>
          </ModernTabsContent>
        </ModernTabs>
      </div>
    </ModernAppLayout>
  );
};

export default Mindset;
