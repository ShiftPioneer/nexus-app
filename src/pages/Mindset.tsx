
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

  return (
    <ModernAppLayout>
      <div className="animate-fade-in space-y-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Brain className="h-6 w-6 text-primary" />
            Mindset
          </h1>
          <p className="text-muted-foreground">Define your life philosophy and mental framework</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList>
            <TabsTrigger value="core-values">Core Values</TabsTrigger>
            <TabsTrigger value="mission">Mission Statement</TabsTrigger>
            <TabsTrigger value="beliefs">Key Beliefs</TabsTrigger>
            <TabsTrigger value="affirmations">Daily Affirmations</TabsTrigger>
            <TabsTrigger value="vision">Vision Board</TabsTrigger>
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
