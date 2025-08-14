import { useState, useEffect } from "react";

interface MindsetData {
  visionItems: Array<{ id: string; title: string; description: string; imageUrl?: string; category: string; }>;
  mission: string;
  coreValues: Array<{ id: string; value: string; description: string; priority: number; }>;
  keyBeliefs: Array<{ id: string; belief: string; evidence: string; strength: number; }>;
  affirmations: Array<{ id: string; text: string; category: string; isActive: boolean; }>;
  dailyPractices: Array<{ id: string; practice: string; completed: boolean; date: string; }>;
}

export const useMindsetStorage = () => {
  const [data, setData] = useState<MindsetData>(() => {
    try {
      const saved = localStorage.getItem('mindset-data');
      return saved ? JSON.parse(saved) : {
        visionItems: [],
        mission: '',
        coreValues: [],
        keyBeliefs: [],
        affirmations: [],
        dailyPractices: []
      };
    } catch (error) {
      console.error('Error loading mindset data:', error);
      return {
        visionItems: [],
        mission: '',
        coreValues: [],
        keyBeliefs: [],
        affirmations: [],
        dailyPractices: []
      };
    }
  });

  // Save to localStorage whenever data changes
  useEffect(() => {
    try {
      localStorage.setItem('mindset-data', JSON.stringify(data));
    } catch (error) {
      console.error('Error saving mindset data:', error);
    }
  }, [data]);

  const updateData = (updates: Partial<MindsetData>) => {
    setData(prev => ({ ...prev, ...updates }));
  };

  // Calculate statistics
  const getStats = () => {
    const today = new Date().toDateString();
    
    // Calculate days active (days with any mindset activity)
    const practiceHistory = JSON.parse(localStorage.getItem('mindset-practice-history') || '[]');
    const daysActive = new Set(practiceHistory.map((p: any) => p.date)).size;
    
    // Count active affirmations
    const activeAffirmations = data.affirmations.filter(a => a.isActive).length;
    
    // Count defined goals/vision items
    const goalsSet = data.visionItems.length;
    
    // Count core values
    const valuesDefined = data.coreValues.length;

    return {
      daysActive,
      affirmations: activeAffirmations,
      goalsSet,
      valuesDefined
    };
  };

  const addPracticeEntry = (practice: string) => {
    const today = new Date().toDateString();
    const history = JSON.parse(localStorage.getItem('mindset-practice-history') || '[]');
    history.push({ practice, date: today, timestamp: Date.now() });
    localStorage.setItem('mindset-practice-history', JSON.stringify(history));
  };

  return {
    data,
    updateData,
    getStats,
    addPracticeEntry
  };
};