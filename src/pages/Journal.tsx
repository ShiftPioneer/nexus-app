import React, { useState } from "react";
import ModernAppLayout from "@/components/layout/ModernAppLayout";
import { ModernTabs, ModernTabsList, ModernTabsTrigger, ModernTabsContent } from "@/components/ui/modern-tabs";
import { UnifiedPageHeader } from "@/components/ui/unified-page-header";
import { navigationIcons } from "@/lib/navigation-icons";
import { PenTool, BookOpen, BarChart3, Calendar, TrendingUp, Star, Heart } from "lucide-react";
import JournalEditor from "@/components/journal/JournalEditor";
import JournalEntriesList from "@/components/journal/JournalEntriesList";
import JournalStats from "@/components/journal/JournalStats";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  const tabItems = [{
    value: "write",
    label: "Write",
    icon: PenTool,
    gradient: "from-purple-500 via-pink-500 to-rose-500",
    description: "Express your thoughts and reflections"
  }, {
    value: "entries",
    label: "Entries",
    icon: BookOpen,
    gradient: "from-blue-500 via-indigo-500 to-purple-500",
    description: "Browse your journal history"
  }, {
    value: "insights",
    label: "Insights",
    icon: BarChart3,
    gradient: "from-emerald-500 via-teal-500 to-cyan-500",
    description: "Analyze patterns and growth"
  }];
  const journalStats = [{
    label: "Total Entries",
    value: "47",
    icon: BookOpen,
    color: "text-blue-400",
    trend: "+12%"
  }, {
    label: "Current Streak",
    value: "14 days",
    icon: Calendar,
    color: "text-green-400",
    trend: "+3 days"
  }, {
    label: "Words Written",
    value: "12.5k",
    icon: PenTool,
    color: "text-purple-400",
    trend: "+2.1k"
  }, {
    label: "Avg. Mood",
    value: "7.8/10",
    icon: Heart,
    color: "text-red-400",
    trend: "+0.5"
  }];
  return <ModernAppLayout>
      <motion.div initial={{
      opacity: 0
    }} animate={{
      opacity: 1
    }} transition={{
      duration: 0.5
    }} className="animate-fade-in space-y-8 min-h-screen bg-slate-900 rounded-md">
        <UnifiedPageHeader title="Productivity Journal" description="Reflect, track progress, and gain insights through journaling" icon={navigationIcons.journal} gradient="from-purple-500 via-pink-500 to-rose-500" />

        {/* Enhanced Journal Overview */}
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        delay: 0.2
      }} className="max-w-7xl mx-auto px-6 bg-slate-900">
          {/* Journal Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {journalStats.map((stat, index) => <motion.div key={stat.label} initial={{
            opacity: 0,
            scale: 0.9
          }} animate={{
            opacity: 1,
            scale: 1
          }} transition={{
            delay: 0.1 * index
          }}>
                <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700/50 hover:border-slate-600/50 transition-all duration-300">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className={`w-10 h-10 rounded-lg bg-slate-800/50 flex items-center justify-center`}>
                        <stat.icon className={`h-5 w-5 ${stat.color}`} />
                      </div>
                      <Badge className="bg-green-500/20 text-green-300 border-green-500/30 text-xs">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        {stat.trend}
                      </Badge>
                    </div>
                    <div className="text-xl font-bold text-white mb-1">{stat.value}</div>
                    <div className="text-sm text-slate-400">{stat.label}</div>
                  </CardContent>
                </Card>
              </motion.div>)}
          </div>

          {/* Today's Mood Tracker */}
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          delay: 0.6
        }} className="mb-8">
            <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700/50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center">
                      <Heart className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">How are you feeling today?</h3>
                      <p className="text-sm text-slate-400">Track your emotional state</p>
                    </div>
                  </div>
                  <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30">
                    Excellent
                  </Badge>
                </div>
                <div className="flex gap-2">
                  {['😢', '😕', '😐', '🙂', '😊', '🤩'].map((emoji, index) => <button key={index} className={`w-12 h-12 rounded-lg border-2 transition-all duration-200 hover:scale-110 ${index === 4 ? 'border-emerald-500 bg-emerald-500/20' : 'border-slate-600 hover:border-slate-500'}`}>
                      <span className="text-xl">{emoji}</span>
                    </button>)}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        <ModernTabs value={activeTab} onValueChange={setActiveTab} className="w-full max-w-7xl mx-auto px-6 bg-slate-900">
          <ModernTabsList className="grid w-full grid-cols-3 bg-slate-900/50 backdrop-blur-sm border border-slate-700/50">
            {tabItems.map(tab => <ModernTabsTrigger key={tab.value} value={tab.value} gradient={tab.gradient} icon={tab.icon} className="flex-1 data-[state=active]:bg-slate-800/50">
                {tab.label}
              </ModernTabsTrigger>)}
          </ModernTabsList>
          
          <ModernTabsContent value="write" className="mt-8">
            <motion.div initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.3
          }}>
              <JournalEditor initialEntry={initialEntry} onSave={handleSave} onCancel={handleCancel} />
            </motion.div>
          </ModernTabsContent>
          
          <ModernTabsContent value="entries" className="mt-8">
            <motion.div initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.3
          }}>
              <JournalEntriesList entries={entries} activeTab={activeTab} onTabChange={handleTabChange} onEditEntry={handleEditEntry} onDeleteEntry={handleDeleteEntry} onNewEntry={handleNewEntry} />
            </motion.div>
          </ModernTabsContent>
          
          <ModernTabsContent value="insights" className="mt-8">
            <motion.div initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.3
          }}>
              <JournalStats entries={entries} />
            </motion.div>
          </ModernTabsContent>
        </ModernTabs>
      </motion.div>
    </ModernAppLayout>;
};
export default Journal;