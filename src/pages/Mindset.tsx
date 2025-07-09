
import React, { useState } from "react";
import ModernAppLayout from "@/components/layout/ModernAppLayout";
import { ModernTabs, ModernTabsList, ModernTabsTrigger, ModernTabsContent } from "@/components/ui/modern-tabs";
import { UnifiedPageHeader } from "@/components/ui/unified-page-header";
import { Brain, Target, Heart, Sparkles, Eye, Lightbulb, Star } from "lucide-react";
import VisionBoardSection from "@/components/mindset/VisionBoardSection";
import MissionSection from "@/components/mindset/MissionSection";
import CoreValuesSection from "@/components/mindset/CoreValuesSection";
import KeyBeliefsSection from "@/components/mindset/KeyBeliefsSection";
import AffirmationsSection from "@/components/mindset/AffirmationsSection";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

const Mindset = () => {
  const [activeTab, setActiveTab] = useState("vision");

  const tabItems = [
    { 
      value: "vision", 
      label: "Vision Board", 
      icon: Eye,
      gradient: "from-purple-500 via-pink-500 to-rose-500",
      description: "Visualize your dreams and aspirations"
    },
    { 
      value: "mission", 
      label: "Mission", 
      icon: Target,
      gradient: "from-blue-500 via-indigo-500 to-purple-500",
      description: "Define your life's purpose and direction"
    },
    { 
      value: "values", 
      label: "Core Values", 
      icon: Heart,
      gradient: "from-emerald-500 via-teal-500 to-cyan-500",
      description: "Identify what matters most to you"
    },
    { 
      value: "beliefs", 
      label: "Key Beliefs", 
      icon: Brain,
      gradient: "from-orange-500 via-red-500 to-pink-500",
      description: "Examine and strengthen your mindset"
    },
    { 
      value: "affirmations", 
      label: "Affirmations", 
      icon: Sparkles,
      gradient: "from-cyan-500 via-blue-500 to-indigo-500",
      description: "Daily positive reinforcement"
    }
  ];

  const mindsetStats = [
    { label: "Days Active", value: "127", icon: Star, color: "text-yellow-400" },
    { label: "Affirmations", value: "45", icon: Sparkles, color: "text-blue-400" },
    { label: "Goals Set", value: "12", icon: Target, color: "text-green-400" },
    { label: "Values Defined", value: "8", icon: Heart, color: "text-red-400" }
  ];

  return (
    <ModernAppLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <motion.div 
          className="animate-fade-in space-y-8 p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <UnifiedPageHeader
            title="Mindset OS"
            description="Shape your mindset, clarify your vision, and align with your values"
            icon={Brain}
            gradient="from-purple-500 via-pink-500 to-rose-500"
          />

          {/* Enhanced Progress Overview */}
          <motion.div 
            className="max-w-7xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {mindsetStats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700/50 hover:border-slate-600/50 transition-all duration-300">
                    <CardContent className="p-4 text-center">
                      <div className={`w-10 h-10 rounded-lg bg-slate-800/50 flex items-center justify-center mx-auto mb-3`}>
                        <stat.icon className={`h-5 w-5 ${stat.color}`} />
                      </div>
                      <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                      <div className="text-sm text-slate-400">{stat.label}</div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Daily Inspiration Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mb-8"
            >
              <Card className="bg-slate-900/30 border-purple-500/20 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                      <Lightbulb className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">Daily Inspiration</h3>
                      <p className="text-sm text-slate-400">Your mindset shapes your reality</p>
                    </div>
                  </div>
                  <blockquote className="text-lg text-purple-200 italic border-l-4 border-purple-500/30 pl-4">
                    "The mind is everything. What you think you become." - Buddha
                  </blockquote>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>

          <ModernTabs value={activeTab} onValueChange={setActiveTab} className="w-full max-w-7xl mx-auto">
            <ModernTabsList className="grid w-full grid-cols-5 max-w-4xl mx-auto bg-slate-900/50 backdrop-blur-sm border border-slate-700/50">
              {tabItems.map((tab) => (
                <ModernTabsTrigger 
                  key={tab.value}
                  value={tab.value}
                  gradient={tab.gradient}
                  icon={tab.icon}
                  className="flex-1 data-[state=active]:bg-slate-800/50"
                >
                  {tab.label}
                </ModernTabsTrigger>
              ))}
            </ModernTabsList>
            
            <ModernTabsContent value="vision" className="mt-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <VisionBoardSection />
              </motion.div>
            </ModernTabsContent>
            
            <ModernTabsContent value="mission" className="mt-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <MissionSection />
              </motion.div>
            </ModernTabsContent>
            
            <ModernTabsContent value="values" className="mt-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <CoreValuesSection />
              </motion.div>
            </ModernTabsContent>
            
            <ModernTabsContent value="beliefs" className="mt-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <KeyBeliefsSection />
              </motion.div>
            </ModernTabsContent>
            
            <ModernTabsContent value="affirmations" className="mt-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <AffirmationsSection />
              </motion.div>
            </ModernTabsContent>
          </ModernTabs>
        </motion.div>
      </div>
    </ModernAppLayout>
  );
};

export default Mindset;
