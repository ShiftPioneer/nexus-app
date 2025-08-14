import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface MindsetData {
  visionItems: Array<{ id: string; title: string; description: string; imageUrl?: string; category: string; }>;
  mission: string;
  coreValues: Array<{ id: string; value: string; description: string; priority: number; }>;
  keyBeliefs: Array<{ id: string; belief: string; evidence: string; strength: number; }>;
  affirmations: Array<{ id: string; text: string; category: string; isActive: boolean; }>;
  dailyPractices: Array<{ id: string; practice: string; completed: boolean; date: string; }>;
}

export const useSecureMindsetStorage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [data, setData] = useState<MindsetData>({
    visionItems: [],
    mission: '',
    coreValues: [],
    keyBeliefs: [],
    affirmations: [],
    dailyPractices: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadMindsetData();
    } else {
      setData({
        visionItems: [],
        mission: '',
        coreValues: [],
        keyBeliefs: [],
        affirmations: [],
        dailyPractices: []
      });
      setLoading(false);
    }
  }, [user]);

  const loadMindsetData = async () => {
    if (!user) return;
    
    try {
      const { data: mindsetData, error } = await supabase
        .from('mindset_data')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;

      if (mindsetData) {
        setData({
          visionItems: (mindsetData.vision_items as any[]) || [],
          mission: (mindsetData.mission as string) || '',
          coreValues: (mindsetData.core_values as any[]) || [],
          keyBeliefs: (mindsetData.key_beliefs as any[]) || [],
          affirmations: (mindsetData.affirmations as any[]) || [],
          dailyPractices: (mindsetData.daily_practices as any[]) || []
        });
      }
    } catch (error) {
      console.error('Error loading mindset data:', error);
      toast({
        title: "Error",
        description: "Failed to load mindset data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateData = async (updates: Partial<MindsetData>) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to save mindset data",
        variant: "destructive"
      });
      return;
    }

    try {
      const newData = { ...data, ...updates };
      
      const updatePayload = {
        user_id: user.id,
        vision_items: newData.visionItems,
        mission: newData.mission,
        core_values: newData.coreValues,
        key_beliefs: newData.keyBeliefs,
        affirmations: newData.affirmations,
        daily_practices: newData.dailyPractices
      };

      const { error } = await supabase
        .from('mindset_data')
        .upsert(updatePayload, {
          onConflict: 'user_id'
        });

      if (error) throw error;

      setData(newData);
      
      toast({
        title: "Success",
        description: "Mindset data saved securely",
      });
    } catch (error) {
      console.error('Error updating mindset data:', error);
      toast({
        title: "Error",
        description: "Failed to save mindset data",
        variant: "destructive"
      });
    }
  };

  const getStats = () => {
    const today = new Date().toDateString();
    
    // Count active affirmations
    const activeAffirmations = data.affirmations.filter(a => a.isActive).length;
    
    // Count defined goals/vision items
    const goalsSet = data.visionItems.length;
    
    // Count core values
    const valuesDefined = data.coreValues.length;

    // Calculate days active from daily practices
    const uniqueDates = new Set(data.dailyPractices.map(p => p.date));
    const daysActive = uniqueDates.size;

    return {
      daysActive,
      affirmations: activeAffirmations,
      goalsSet,
      valuesDefined
    };
  };

  const addPracticeEntry = async (practice: string) => {
    const today = new Date().toDateString();
    const newPractice = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      practice,
      completed: true,
      date: today
    };

    const updatedPractices = [...data.dailyPractices, newPractice];
    await updateData({ dailyPractices: updatedPractices });
  };

  return {
    data,
    loading,
    updateData,
    getStats,
    addPracticeEntry,
    refresh: loadMindsetData
  };
};