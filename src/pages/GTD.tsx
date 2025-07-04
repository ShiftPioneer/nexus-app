
import React, { useState } from "react";
import ModernAppLayout from "@/components/layout/ModernAppLayout";
import { ModernTabs, ModernTabsList, ModernTabsTrigger, ModernTabsContent } from "@/components/ui/modern-tabs";
import { UnifiedPageHeader } from "@/components/ui/unified-page-header";
import { Inbox, Search, Folder, CheckCircle, Eye, RotateCcw } from "lucide-react";
import CaptureView from "@/components/gtd/views/CaptureView";
import ClarifyView from "@/components/gtd/views/ClarifyView";
import OrganizeView from "@/components/gtd/views/OrganizeView";
import EngageView from "@/components/gtd/views/EngageView";
import ReflectView from "@/components/gtd/views/ReflectView";
import { GTDProvider } from "@/components/gtd/GTDContext";

const GTD = () => {
  const [activeTab, setActiveTab] = useState("capture");

  const tabItems = [
    { 
      value: "capture", 
      label: "Capture", 
      icon: Inbox,
      gradient: "from-blue-500 via-indigo-500 to-purple-500"
    },
    { 
      value: "clarify", 
      label: "Clarify", 
      icon: Search,
      gradient: "from-purple-500 via-pink-500 to-rose-500"
    },
    { 
      value: "organize", 
      label: "Organize", 
      icon: Folder,
      gradient: "from-emerald-500 via-teal-500 to-cyan-500"
    },
    { 
      value: "engage", 
      label: "Engage", 
      icon: CheckCircle,
      gradient: "from-orange-500 via-red-500 to-pink-500"
    },
    { 
      value: "reflect", 
      label: "Reflect", 
      icon: RotateCcw,
      gradient: "from-cyan-500 via-blue-500 to-indigo-500"
    }
  ];

  return (
    <ModernAppLayout>
      <GTDProvider>
        <div className="animate-fade-in space-y-8">
          <UnifiedPageHeader
            title="Getting Things Done"
            description="Capture, clarify, organize, engage, and reflect on your tasks and projects"
            icon={Inbox}
            gradient="from-blue-500 via-indigo-500 to-purple-500"
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
            
            <ModernTabsContent value="capture">
              <CaptureView />
            </ModernTabsContent>
            
            <ModernTabsContent value="clarify">
              <ClarifyView />
            </ModernTabsContent>
            
            <ModernTabsContent value="organize">
              <OrganizeView />
            </ModernTabsContent>
            
            <ModernTabsContent value="engage">
              <EngageView />
            </ModernTabsContent>
            
            <ModernTabsContent value="reflect">
              <ReflectView />
            </ModernTabsContent>
          </ModernTabs>
        </div>
      </GTDProvider>
    </ModernAppLayout>
  );
};

export default GTD;
