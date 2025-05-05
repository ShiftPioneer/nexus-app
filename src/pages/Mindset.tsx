import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash, Save, Image, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import CoreValuesSection from '@/components/mindset/CoreValuesSection';
import MissionSection from '@/components/mindset/MissionSection';
import KeyBeliefsSection from '@/components/mindset/KeyBeliefsSection';
import AffirmationsSection from '@/components/mindset/AffirmationsSection';
import VisionBoardSection from '@/components/mindset/VisionBoardSection';
const Mindset = () => {
  const {
    toast
  } = useToast();
  const [activeTab, setActiveTab] = useState('core-values');
  return <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold py-[10px]">Mindset</h1>
          <p className="text-muted-foreground">Define your life philosophy and mental framework</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="w-full justify-start overflow-x-auto">
            <TabsTrigger value="core-values">Core Values</TabsTrigger>
            <TabsTrigger value="mission">Mission Statement</TabsTrigger>
            <TabsTrigger value="beliefs">Key Beliefs</TabsTrigger>
            <TabsTrigger value="affirmations">Daily Affirmations</TabsTrigger>
            <TabsTrigger value="vision">Vision Board</TabsTrigger>
          </TabsList>

          <TabsContent value="core-values" className="space-y-4">
            <CoreValuesSection />
          </TabsContent>

          <TabsContent value="mission" className="space-y-4">
            <MissionSection />
          </TabsContent>

          <TabsContent value="beliefs" className="space-y-4">
            <KeyBeliefsSection />
          </TabsContent>

          <TabsContent value="affirmations" className="space-y-4">
            <AffirmationsSection />
          </TabsContent>

          <TabsContent value="vision" className="space-y-4">
            <VisionBoardSection />
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>;
};
export default Mindset;