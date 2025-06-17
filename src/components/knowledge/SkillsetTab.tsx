
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Plus, Star, TrendingUp } from "lucide-react";
import { Skillset, SkillsetCategory } from "@/types/knowledge";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { SkillsetDialog } from "./SkillsetDialog";
import { MasteryChart } from "./MasteryChart";
import { CategoryChart } from "./CategoryChart";
import { useLocalStorage } from "@/hooks/use-local-storage";

const defaultSkillsets: Skillset[] = [
  {
    id: "1",
    name: "JavaScript",
    description: "Modern JavaScript programming language",
    category: "Programming",
    mastery: 75,
    lastPracticed: new Date("2023-12-15"),
    resourceCount: 5,
    color: "#f59e0b"
  },
  {
    id: "2",
    name: "UI/UX Design",
    description: "User interface and experience design",
    category: "Design",
    mastery: 60,
    lastPracticed: new Date("2023-12-10"),
    resourceCount: 8,
    color: "#ec4899"
  },
  {
    id: "3",
    name: "Data Science",
    description: "Statistical analysis and machine learning",
    category: "Analytics",
    mastery: 40,
    lastPracticed: new Date("2023-11-28"),
    resourceCount: 12,
    color: "#3b82f6"
  },
  {
    id: "4",
    name: "Public Speaking",
    description: "Effective communication and presentation skills",
    category: "Soft Skills",
    mastery: 80,
    lastPracticed: new Date("2023-12-05"),
    resourceCount: 3,
    color: "#8b5cf6"
  }
];

export function SkillsetTab() {
  const [skillsetsRaw, setSkillsetsRaw] = useLocalStorage<Skillset[]>("userSkillsets", defaultSkillsets);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentSkillset, setCurrentSkillset] = useState<Skillset | null>(null);

  // Convert lastPracticed strings back to Date objects when loading from localStorage
  const skillsets = skillsetsRaw.map(skillset => ({
    ...skillset,
    lastPracticed: typeof skillset.lastPracticed === 'string' ? new Date(skillset.lastPracticed) : skillset.lastPracticed
  }));

  const handleAddSkillset = (skillset: Skillset) => {
    if (currentSkillset) {
      setSkillsetsRaw(skillsetsRaw.map(s => s.id === skillset.id ? skillset : s));
    } else {
      setSkillsetsRaw([...skillsetsRaw, {
        ...skillset,
        id: Date.now().toString()
      }]);
    }
    setDialogOpen(false);
    setCurrentSkillset(null);
  };

  const handleEdit = (skillset: Skillset) => {
    setCurrentSkillset(skillset);
    setDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setSkillsetsRaw(skillsetsRaw.filter(s => s.id !== id));
  };

  const getMasteryColor = (mastery: number) => {
    if (mastery >= 80) return "from-emerald-500 to-teal-500";
    if (mastery >= 60) return "from-blue-500 to-indigo-500";
    if (mastery >= 40) return "from-orange-500 to-red-500";
    return "from-slate-500 to-gray-500";
  };

  const getMasteryLabel = (mastery: number) => {
    if (mastery >= 80) return "Expert";
    if (mastery >= 60) return "Advanced";
    if (mastery >= 40) return "Intermediate";
    return "Beginner";
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">Your Skillsets</h2>
          <p className="text-slate-400 mt-2">Track and develop your professional skills</p>
        </div>
        <Button 
          onClick={() => {
            setCurrentSkillset(null);
            setDialogOpen(true);
          }} 
          className="gap-2 bg-gradient-to-r from-purple-500 to-violet-500 hover:from-purple-600 hover:to-violet-600 text-white shadow-lg border-none rounded-xl px-6 py-3 font-semibold transition-all duration-300 hover:scale-105"
        >
          <Plus size={18} />
          Add Skillset
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {skillsets.map(skillset => (
          <Card key={skillset.id} className="relative overflow-hidden bg-gradient-to-br from-slate-900/90 to-slate-950/90 border border-slate-700/30 shadow-xl backdrop-blur-sm group hover:shadow-2xl transition-all duration-300 hover:scale-105">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-white/10 to-transparent rounded-full blur-2xl" />
            </div>
            
            <CardContent className="p-6 relative z-10">
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-bold text-white">{skillset.name}</h3>
                      <div className={`px-2 py-1 rounded-lg text-xs font-semibold bg-gradient-to-r ${getMasteryColor(skillset.mastery)} text-white`}>
                        {getMasteryLabel(skillset.mastery)}
                      </div>
                    </div>
                    <p className="text-slate-400 text-sm">{skillset.description}</p>
                  </div>
                  <span className="bg-slate-800/50 text-slate-300 text-xs px-3 py-1 rounded-full border border-slate-600/50">
                    {skillset.category}
                  </span>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-300 font-semibold flex items-center gap-2">
                      <TrendingUp className="h-4 w-4" />
                      Mastery Level
                    </span>
                    <span className="text-sm font-bold text-white">{skillset.mastery}%</span>
                  </div>
                  <div className="relative">
                    <Progress value={skillset.mastery} className="h-3 bg-slate-800/50" />
                    <div 
                      className={`absolute top-0 left-0 h-3 rounded-full bg-gradient-to-r ${getMasteryColor(skillset.mastery)} transition-all duration-500`}
                      style={{ width: `${skillset.mastery}%` }}
                    />
                  </div>
                </div>
                
                <div className="flex justify-between items-center text-sm text-slate-400 pt-2 border-t border-slate-700/30">
                  <span className="flex items-center gap-2">
                    <Star className="h-4 w-4" />
                    {skillset.resourceCount} resources
                  </span>
                  <span>
                    Last: {skillset.lastPracticed.toISOString().split('T')[0]}
                  </span>
                </div>
                
                <div className="flex justify-end gap-2 pt-2">
                  <Button 
                    size="icon" 
                    variant="outline" 
                    onClick={() => handleEdit(skillset)} 
                    className="border-slate-600/50 hover:bg-slate-700/50 hover:border-slate-500/50 text-slate-300 hover:text-white transition-all duration-300"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="icon" 
                    variant="outline" 
                    onClick={() => handleDelete(skillset.id)} 
                    className="border-red-600/50 hover:bg-red-600/20 hover:border-red-500/50 text-red-400 hover:text-red-300 transition-all duration-300"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-10">
        <Card className="bg-gradient-to-br from-slate-900/90 to-slate-950/90 border border-slate-700/30 shadow-xl backdrop-blur-sm">
          <CardContent className="p-8">
            <h3 className="font-bold text-2xl mb-6 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">Mastery Overview</h3>
            <MasteryChart skillsets={skillsets} />
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-slate-900/90 to-slate-950/90 border border-slate-700/30 shadow-xl backdrop-blur-sm">
          <CardContent className="p-8">
            <h3 className="font-bold text-2xl mb-6 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">Categories</h3>
            <CategoryChart skillsets={skillsets} />
          </CardContent>
        </Card>
      </div>
      
      <SkillsetDialog 
        open={dialogOpen} 
        onOpenChange={setDialogOpen} 
        onSave={handleAddSkillset} 
        skillset={currentSkillset} 
      />
    </div>
  );
}
