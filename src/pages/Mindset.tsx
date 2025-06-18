
import React, { useState } from 'react';
import ModernAppLayout from '@/components/layout/ModernAppLayout';
import { ModernTabs, ModernTabsList, ModernTabsTrigger, ModernTabsContent } from '@/components/ui/modern-tabs';
import { Brain, Heart, Target, Sparkles, Eye } from 'lucide-react';
import CoreValuesSection from '@/components/mindset/CoreValuesSection';
import MissionSection from '@/components/mindset/MissionSection';
import KeyBeliefsSection from '@/components/mindset/KeyBeliefsSection';
import AffirmationsSection from '@/components/mindset/AffirmationsSection';
import VisionBoardSection from '@/components/mindset/VisionBoardSection';

const Mindset = () => {
  const [activeTab, setActiveTab] = useState('core-values');

  const tabItems = [
    { 
      value: 'core-values', 
      label: 'Core Values', 
      icon: Heart,
      gradient: 'from-red-500 via-pink-500 to-rose-500'
    },
    { 
      value: 'mission', 
      label: 'Mission', 
      icon: Target,
      gradient: 'from-blue-500 via-indigo-500 to-purple-500'
    },
    { 
      value: 'beliefs', 
      label: 'Beliefs', 
      icon: Brain,
      gradient: 'from-purple-500 via-violet-500 to-indigo-500'
    },
    { 
      value: 'affirmations', 
      label: 'Affirmations', 
      icon: Sparkles,
      gradient: 'from-emerald-500 via-teal-500 to-cyan-500'
    },
    { 
      value: 'vision', 
      label: 'Vision Board', 
      icon: Eye,
      gradient: 'from-yellow-500 via-orange-500 to-red-500'
    }
  ];

  return (
    <ModernAppLayout>
      <div className="animate-fade-in space-y-8">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent flex items-center gap-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 shadow-lg">
              <Brain className="h-6 w-6 text-white" />
            </div>
            Mindset
          </h1>
          <p className="text-slate-400 mt-3 text-lg">Define your life philosophy and mental framework</p>
        </div>

        <ModernTabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <ModernTabsList className="grid grid-cols-5">
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

          <ModernTabsContent value="core-values">
            <CoreValuesSection />
          </ModernTabsContent>
          <ModernTabsContent value="mission">
            <MissionSection />
          </ModernTabsContent>
          <ModernTabsContent value="beliefs">
            <KeyBeliefsSection />
          </ModernTabsContent>
          <ModernTabsContent value="affirmations">
            <AffirmationsSection />
          </ModernTabsContent>
          <ModernTabsContent value="vision">
            <VisionBoardSection />
          </ModernTabsContent>
        </ModernTabs>
      </div>
    </ModernAppLayout>
  );
};

export default Mindset;
