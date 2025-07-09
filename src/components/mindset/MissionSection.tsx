
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Target, Plus, Edit, Save, Trash, Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { v4 as uuidv4 } from 'uuid';
import { motion } from 'framer-motion';

interface Mission {
  id: string;
  title: string;
  statement: string;
  category: "personal" | "professional" | "spiritual" | "health" | "relationships";
  createdAt: Date;
  lastEditedAt: Date;
}

const MissionSection = () => {
  const { toast } = useToast();
  const [missions, setMissions] = useState<Mission[]>(() => {
    const saved = localStorage.getItem('mindset-missions');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentMission, setCurrentMission] = useState<Mission | null>(null);
  const [title, setTitle] = useState('');
  const [statement, setStatement] = useState('');
  const [category, setCategory] = useState<Mission["category"]>('personal');

  const categories = [
    { key: "personal", label: "Personal", color: "text-purple-400", bg: "bg-purple-500/20" },
    { key: "professional", label: "Professional", color: "text-blue-400", bg: "bg-blue-500/20" },
    { key: "spiritual", label: "Spiritual", color: "text-indigo-400", bg: "bg-indigo-500/20" },
    { key: "health", label: "Health", color: "text-green-400", bg: "bg-green-500/20" },
    { key: "relationships", label: "Relationships", color: "text-pink-400", bg: "bg-pink-500/20" }
  ];

  useEffect(() => {
    localStorage.setItem('mindset-missions', JSON.stringify(missions));
  }, [missions]);

  const handleAddMission = () => {
    setCurrentMission(null);
    setTitle('');
    setStatement('');
    setCategory('personal');
    setIsDialogOpen(true);
  };

  const handleEditMission = (mission: Mission) => {
    setCurrentMission(mission);
    setTitle(mission.title);
    setStatement(mission.statement);
    setCategory(mission.category);
    setIsDialogOpen(true);
  };

  const handleDeleteMission = (id: string) => {
    setMissions(missions.filter(mission => mission.id !== id));
    toast({
      title: "Mission Deleted",
      description: "Your mission statement has been removed."
    });
  };

  const handleSaveMission = () => {
    if (!title.trim() || !statement.trim()) {
      toast({
        title: "Required Fields Missing",
        description: "Please enter both title and mission statement.",
        variant: "destructive"
      });
      return;
    }

    if (currentMission) {
      setMissions(missions.map(mission => 
        mission.id === currentMission.id 
          ? { ...mission, title, statement, category, lastEditedAt: new Date() }
          : mission
      ));
      toast({
        title: "Mission Updated",
        description: "Your mission statement has been updated."
      });
    } else {
      const newMission: Mission = {
        id: uuidv4(),
        title,
        statement,
        category,
        createdAt: new Date(),
        lastEditedAt: new Date()
      };
      setMissions([...missions, newMission]);
      toast({
        title: "Mission Added",
        description: "Your new mission statement has been added."
      });
    }
    setIsDialogOpen(false);
  };

  const getCategoryInfo = (categoryKey: string) => {
    return categories.find(cat => cat.key === categoryKey) || categories[0];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center">
            <Target className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Mission Statements</h2>
            <p className="text-slate-400">Define your life's purpose and direction</p>
          </div>
        </div>
        <Button
          onClick={handleAddMission}
          className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white shadow-lg"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Mission
        </Button>
      </motion.div>

      {/* Missions Grid */}
      {missions.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <Target className="h-8 w-8 text-slate-500" />
          </div>
          <h3 className="text-lg font-semibold text-slate-300 mb-2">No mission statements yet</h3>
          <p className="text-slate-500 mb-4">Create mission statements to guide your life's direction.</p>
          <Button onClick={handleAddMission} className="bg-primary hover:bg-primary/90">
            <Plus className="h-4 w-4 mr-2" />
            Create Your First Mission
          </Button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {missions.map((mission, index) => {
            const categoryInfo = getCategoryInfo(mission.category);
            return (
              <motion.div
                key={mission.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="group relative overflow-hidden bg-slate-900/50 border-slate-700 hover:border-slate-600 transition-all duration-300 hover:scale-105">
                  <div className={`absolute inset-0 ${categoryInfo.bg.replace('/20', '/5')} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                  
                  <CardHeader className="relative">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg ${categoryInfo.bg} flex items-center justify-center border border-slate-600/30`}>
                          <Target className={`h-5 w-5 ${categoryInfo.color}`} />
                        </div>
                        <Badge className={`${categoryInfo.bg} ${categoryInfo.color} border-slate-600/30`}>
                          {categoryInfo.label}
                        </Badge>
                      </div>
                      
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditMission(mission)}
                          className="h-8 w-8 p-0 hover:bg-slate-700/50 text-slate-400 hover:text-cyan-400"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteMission(mission.id)}
                          className="h-8 w-8 p-0 hover:bg-red-500/20 text-slate-400 hover:text-red-400"
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <CardTitle className="text-lg font-semibold text-white mb-2">
                      {mission.title}
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent className="relative">
                    <blockquote className="text-slate-300 text-sm leading-relaxed italic border-l-4 border-primary/30 pl-4 mb-4">
                      "{mission.statement}"
                    </blockquote>
                    
                    <div className="flex items-center justify-between pt-3 border-t border-slate-700/30">
                      <div className="text-xs text-slate-500">
                        Created {new Date(mission.createdAt).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 text-primary" />
                        <span className="text-xs text-slate-400">Mission Statement</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-slate-950 border-slate-700 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-white">
              {currentMission ? "Edit Mission Statement" : "Create Mission Statement"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <label htmlFor="title" className="text-sm font-medium block mb-1 text-slate-300">Mission Title</label>
              <Input 
                id="title" 
                placeholder="e.g., Personal Growth Mission, Career Purpose" 
                value={title} 
                onChange={e => setTitle(e.target.value)} 
                className="bg-slate-800/50 border-slate-600 text-white"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium block mb-2 text-slate-300">Category</label>
              <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat.key}
                    type="button"
                    onClick={() => setCategory(cat.key as Mission["category"])}
                    className={`p-3 rounded-lg border transition-all duration-200 ${
                      category === cat.key
                        ? `${cat.bg} border-primary/50`
                        : "bg-slate-800/30 border-slate-600/50 hover:bg-slate-700/30"
                    }`}
                  >
                    <Target className={`h-4 w-4 mx-auto mb-1 ${
                      category === cat.key ? cat.color : "text-slate-400"
                    }`} />
                    <div className={`text-xs ${
                      category === cat.key ? "text-white" : "text-slate-400"
                    }`}>
                      {cat.label}
                    </div>
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <label htmlFor="statement" className="text-sm font-medium block mb-1 text-slate-300">Mission Statement</label>
              <Textarea 
                id="statement" 
                placeholder="Write your mission statement here. What is your purpose? What drives you?" 
                rows={6} 
                value={statement} 
                onChange={e => setStatement(e.target.value)} 
                className="bg-slate-800/50 border-slate-600 text-white resize-none"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="border-slate-600 text-slate-300">
              Cancel
            </Button>
            <Button onClick={handleSaveMission} className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white">
              <Save className="h-4 w-4 mr-2" />
              Save Mission
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MissionSection;
