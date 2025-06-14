
import React, { useState, useEffect } from 'react';
import ModernAppLayout from '@/components/layout/ModernAppLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash, Save, Image, Calendar, Brain } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import CoreValuesSection from '@/components/mindset/CoreValuesSection';
import MissionSection from '@/components/mindset/MissionSection';
import KeyBeliefsSection from '@/components/mindset/KeyBeliefsSection';
import AffirmationsSection from '@/components/mindset/AffirmationsSection';
import VisionBoardSection from '@/components/mindset/VisionBoardSection';

const Mindset = () => {
  const { toast } = useToast();
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

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <div className="bg-card border rounded-lg overflow-x-auto mb-6 w-fit">
            <TabsList className="justify-start rounded-none border-b bg-muted/50 p-0 w-fit">
              <TabsTrigger value="core-values" className="data-[state=active]:bg-background rounded-none border-r px-6 py-3">
                Core Values
              </TabsTrigger>
              <TabsTrigger value="mission" className="data-[state=active]:bg-background rounded-none border-r px-6 py-3">
                Mission Statement
              </TabsTrigger>
              <TabsTrigger value="beliefs" className="data-[state=active]:bg-background rounded-none border-r px-6 py-3">
                Key Beliefs
              </TabsTrigger>
              <TabsTrigger value="affirmations" className="data-[state=active]:bg-background rounded-none border-r px-6 py-3">
                Daily Affirmations
              </TabsTrigger>
              <TabsTrigger value="vision" className="data-[state=active]:bg-background rounded-none px-6 py-3">
                Vision Board
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="core-values" className="mt-0">
            <CoreValuesSection />
          </TabsContent>

          <TabsContent value="mission" className="mt-0">
            <MissionSection />
          </TabsContent>

          <TabsContent value="beliefs" className="mt-0">
            <KeyBeliefsSection />
          </TabsContent>

          <TabsContent value="affirmations" className="mt-0">
            <AffirmationsSection />
          </TabsContent>

          <TabsContent value="vision" className="mt-0">
            <VisionBoardSection />
          </TabsContent>
        </Tabs>
      </div>
    </ModernAppLayout>
  );
};

export default Mindset;
