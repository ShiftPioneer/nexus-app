import React, { useState } from "react";
import ModernAppLayout from "@/components/layout/ModernAppLayout";
import { ModernTabs, ModernTabsList, ModernTabsTrigger, ModernTabsContent } from "@/components/ui/modern-tabs";
import { UnifiedPageHeader } from "@/components/ui/unified-page-header";
import { Inbox, Search, Folder, CheckCircle, RotateCcw, Brain } from "lucide-react";
import CaptureView from "@/components/gtd/views/CaptureView";
import ClarifyView from "@/components/gtd/views/ClarifyView";
import OrganizeView from "@/components/gtd/views/OrganizeView";
import EngageView from "@/components/gtd/views/EngageView";
import ReflectView from "@/components/gtd/views/ReflectView";
import { GTDProvider } from "@/components/gtd/GTDContext";
import { motion } from "framer-motion";
const GTD = () => {
  const [activeTab, setActiveTab] = useState("capture");
  const tabItems = [{
    value: "capture",
    label: "Capture",
    icon: Inbox,
    gradient: "from-blue-500 via-indigo-500 to-purple-500",
    description: "Collect everything into a trusted system"
  }, {
    value: "clarify",
    label: "Clarify",
    icon: Search,
    gradient: "from-purple-500 via-pink-500 to-rose-500",
    description: "Process what each item means"
  }, {
    value: "organize",
    label: "Organize",
    icon: Folder,
    gradient: "from-emerald-500 via-teal-500 to-cyan-500",
    description: "Put items where they belong"
  }, {
    value: "engage",
    label: "Engage",
    icon: CheckCircle,
    gradient: "from-orange-500 via-red-500 to-pink-500",
    description: "Take action with confidence"
  }, {
    value: "reflect",
    label: "Reflect",
    icon: RotateCcw,
    gradient: "from-cyan-500 via-blue-500 to-indigo-500",
    description: "Review and update your system"
  }];
  return <ModernAppLayout>
      <GTDProvider>
        <motion.div className="animate-fade-in space-y-8 min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} transition={{
        duration: 0.5
      }}>
          <UnifiedPageHeader title="Getting Things Done" description="Master your workflow with the proven GTD methodology" icon={Brain} gradient="from-blue-500 via-indigo-500 to-purple-500" />

          {/* Enhanced GTD Principles Banner */}
          

          <ModernTabs value={activeTab} onValueChange={setActiveTab} className="w-full max-w-7xl mx-auto px-6">
            <ModernTabsList className="grid w-full grid-cols-5 max-w-4xl mx-auto bg-slate-900/50 backdrop-blur-sm border border-slate-700/50">
              {tabItems.map(tab => <ModernTabsTrigger key={tab.value} value={tab.value} gradient={tab.gradient} icon={tab.icon} className="flex-1 data-[state=active]:bg-slate-800/50">
                  {tab.label}
                </ModernTabsTrigger>)}
            </ModernTabsList>
            
            <ModernTabsContent value="capture" className="mt-8">
              <motion.div initial={{
              opacity: 0,
              y: 20
            }} animate={{
              opacity: 1,
              y: 0
            }} transition={{
              duration: 0.3
            }}>
                <CaptureView />
              </motion.div>
            </ModernTabsContent>
            
            <ModernTabsContent value="clarify" className="mt-8">
              <motion.div initial={{
              opacity: 0,
              y: 20
            }} animate={{
              opacity: 1,
              y: 0
            }} transition={{
              duration: 0.3
            }}>
                <ClarifyView />
              </motion.div>
            </ModernTabsContent>
            
            <ModernTabsContent value="organize" className="mt-8">
              <motion.div initial={{
              opacity: 0,
              y: 20
            }} animate={{
              opacity: 1,
              y: 0
            }} transition={{
              duration: 0.3
            }}>
                <OrganizeView />
              </motion.div>
            </ModernTabsContent>
            
            <ModernTabsContent value="engage" className="mt-8">
              <motion.div initial={{
              opacity: 0,
              y: 20
            }} animate={{
              opacity: 1,
              y: 0
            }} transition={{
              duration: 0.3
            }}>
                <EngageView />
              </motion.div>
            </ModernTabsContent>
            
            <ModernTabsContent value="reflect" className="mt-8">
              <motion.div initial={{
              opacity: 0,
              y: 20
            }} animate={{
              opacity: 1,
              y: 0
            }} transition={{
              duration: 0.3
            }}>
                <ReflectView />
              </motion.div>
            </ModernTabsContent>
          </ModernTabs>
        </motion.div>
      </GTDProvider>
    </ModernAppLayout>;
};
export default GTD;