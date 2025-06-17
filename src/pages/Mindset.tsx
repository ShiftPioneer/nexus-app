
import React, { useState } from 'react';
import ModernAppLayout from '@/components/layout/ModernAppLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
      gradient: 'from-red-500 via-pink-500 to-rose-500',
      bgGradient: 'from-red-500/10 via-pink-500/10 to-rose-500/10',
      description: 'Your foundations'
    },
    { 
      value: 'mission', 
      label: 'Mission', 
      icon: Target,
      gradient: 'from-blue-500 via-indigo-500 to-purple-500',
      bgGradient: 'from-blue-500/10 via-indigo-500/10 to-purple-500/10',
      description: 'Your purpose'
    },
    { 
      value: 'beliefs', 
      label: 'Beliefs', 
      icon: Brain,
      gradient: 'from-purple-500 via-violet-500 to-indigo-500',
      bgGradient: 'from-purple-500/10 via-violet-500/10 to-indigo-500/10',
      description: 'Your mindset'
    },
    { 
      value: 'affirmations', 
      label: 'Affirmations', 
      icon: Sparkles,
      gradient: 'from-emerald-500 via-teal-500 to-cyan-500',
      bgGradient: 'from-emerald-500/10 via-teal-500/10 to-cyan-500/10',
      description: 'Daily mantras'
    },
    { 
      value: 'vision', 
      label: 'Vision Board', 
      icon: Eye,
      gradient: 'from-yellow-500 via-orange-500 to-red-500',
      bgGradient: 'from-yellow-500/10 via-orange-500/10 to-red-500/10',
      description: 'Your dreams'
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

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-slate-800/30 border border-slate-700/30 backdrop-blur-sm rounded-2xl p-2 shadow-lg grid grid-cols-5">
            {tabItems.map((tab) => (
              <TabsTrigger 
                key={tab.value}
                value={tab.value}
                className={`
                  group relative flex flex-col items-center gap-2 px-4 py-4 rounded-xl transition-all duration-300 overflow-hidden
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
                <div className="text-center">
                  <span className="font-semibold text-xs">{tab.label}</span>
                  <p className="text-xs opacity-80 mt-1">{tab.description}</p>
                </div>
                
                {/* Hover shimmer effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 rounded-xl" />
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="core-values" className="mt-8">
            <CoreValuesSection />
          </TabsContent>
          <TabsContent value="mission" className="mt-8">
            <MissionSection />
          </TabsContent>
          <TabsContent value="beliefs" className="mt-8">
            <KeyBeliefsSection />
          </TabsContent>
          <TabsContent value="affirmations" className="mt-8">
            <AffirmationsSection />
          </TabsContent>
          <TabsContent value="vision" className="mt-8">
            <VisionBoardSection />
          </TabsContent>
        </Tabs>
      </div>
    </ModernAppLayout>
  );
};

export default Mindset;
