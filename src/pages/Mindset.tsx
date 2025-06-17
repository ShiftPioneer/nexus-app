
import React, { useState } from 'react';
import ModernAppLayout from '@/components/layout/ModernAppLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Brain } from 'lucide-react';
import CoreValuesSection from '@/components/mindset/CoreValuesSection';
import MissionSection from '@/components/mindset/MissionSection';
import KeyBeliefsSection from '@/components/mindset/KeyBeliefsSection';
import AffirmationsSection from '@/components/mindset/AffirmationsSection';
import VisionBoardSection from '@/components/mindset/VisionBoardSection';

const Mindset = () => {
  const [activeTab, setActiveTab] = useState('core-values');

  const tabItems = [
    { value: 'core-values', label: 'Core Values', gradient: 'from-red-500 to-orange-600' },
    { value: 'mission', label: 'Mission Statement', gradient: 'from-blue-500 to-indigo-600' },
    { value: 'beliefs', label: 'Key Beliefs', gradient: 'from-purple-500 to-pink-600' },
    { value: 'affirmations', label: 'Daily Affirmations', gradient: 'from-emerald-500 to-teal-600' },
    { value: 'vision', label: 'Vision Board', gradient: 'from-yellow-500 to-orange-600' }
  ];

  return (
    <ModernAppLayout>
      <div className="animate-fade-in space-y-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-r from-purple-500 to-pink-600 shadow-lg">
              <Brain className="h-5 w-5 text-white" />
            </div>
            Mindset
          </h1>
          <p className="text-muted-foreground">Define your life philosophy and mental framework</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-slate-800/50 border border-slate-700/50 backdrop-blur-sm rounded-xl p-1">
            {tabItems.map((tab) => (
              <TabsTrigger 
                key={tab.value}
                value={tab.value}
                className={`
                  px-4 py-3 rounded-lg transition-all duration-300
                  data-[state=active]:bg-gradient-to-r data-[state=active]:${tab.gradient} 
                  data-[state=active]:text-white data-[state=active]:shadow-lg
                  hover:bg-slate-700/50 text-slate-300
                `}
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="core-values" className="mt-6">
            <CoreValuesSection />
          </TabsContent>
          <TabsContent value="mission" className="mt-6">
            <MissionSection />
          </TabsContent>
          <TabsContent value="beliefs" className="mt-6">
            <KeyBeliefsSection />
          </TabsContent>
          <TabsContent value="affirmations" className="mt-6">
            <AffirmationsSection />
          </TabsContent>
          <TabsContent value="vision" className="mt-6">
            <VisionBoardSection />
          </TabsContent>
        </Tabs>
      </div>
    </ModernAppLayout>
  );
};

export default Mindset;
