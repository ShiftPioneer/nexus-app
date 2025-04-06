import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Plus } from "lucide-react";
import { Skillset, SkillsetCategory } from "@/types/knowledge";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { SkillsetDialog } from "./SkillsetDialog";
import { MasteryChart } from "./MasteryChart";
import { CategoryChart } from "./CategoryChart";
const sampleSkillsets: Skillset[] = [{
  id: "1",
  name: "JavaScript",
  description: "Modern JavaScript programming language",
  category: "Programming",
  mastery: 75,
  lastPracticed: new Date("2023-12-15"),
  resourceCount: 5,
  color: "#FFDD00"
}, {
  id: "2",
  name: "UI/UX Design",
  description: "User interface and experience design",
  category: "Design",
  mastery: 60,
  lastPracticed: new Date("2023-12-10"),
  resourceCount: 8,
  color: "#FF5733"
}, {
  id: "3",
  name: "Data Science",
  description: "Statistical analysis and machine learning",
  category: "Analytics",
  mastery: 40,
  lastPracticed: new Date("2023-11-28"),
  resourceCount: 12,
  color: "#4285F4"
}, {
  id: "4",
  name: "Public Speaking",
  description: "Effective communication and presentation skills",
  category: "Soft Skills",
  mastery: 80,
  lastPracticed: new Date("2023-12-05"),
  resourceCount: 3,
  color: "#9C27B0"
}];
export function SkillsetTab() {
  const [skillsets, setSkillsets] = useState<Skillset[]>(sampleSkillsets);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentSkillset, setCurrentSkillset] = useState<Skillset | null>(null);
  const handleAddSkillset = (skillset: Skillset) => {
    if (currentSkillset) {
      setSkillsets(skillsets.map(s => s.id === skillset.id ? skillset : s));
    } else {
      setSkillsets([...skillsets, {
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
    setSkillsets(skillsets.filter(s => s.id !== id));
  };
  const categoryColors: Record<string, string> = {
    "Programming": "bg-blue-100 text-blue-800",
    "Design": "bg-indigo-100 text-indigo-800",
    "Analytics": "bg-violet-100 text-violet-800",
    "Soft Skills": "bg-purple-100 text-purple-800"
  };
  const getCardBorder = (color: string = "#DDDDDD") => {
    return `border-t-4 border-t-[${color}]`;
  };
  return <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Your Skillsets</h2>
        <Button onClick={() => {
        setCurrentSkillset(null);
        setDialogOpen(true);
      }} className="gap-1">
          <Plus size={18} />
          Add Skillset
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {skillsets.map(skillset => <Card key={skillset.id} className="bg-blue-800 rounded-25px rounded-2xl">
            <CardContent className="p-6 bg-blue-800 rounded-2xl py-[24px]">
              <div className="flex flex-col bg-blue-800">
                <div className="flex justify-between items-start bg-transparent">
                  <div className="space-y-1">
                    <h3 className="text-xl font-bold text-left px-0 text-primary-dark">{skillset.name}</h3>
                    <p className="text-muted-foreground text-sm font-normal text-cyan-500">{skillset.description}</p>
                  </div>
                  <span className="bg-slate-950 text-lime-500 font-normal pd-5px px-[5px] py-[5px] rounded-xl">
                    {skillset.category}
                  </span>
                </div>
                
                <div className="mt-6 space-y-1">
                  <div className="flex justify-between">
                    <span className="text-sm text-lime-500 font-bold">Mastery</span>
                    <span className="text-sm text-lime-500 font-bold py-0 my-[10px]">{skillset.mastery}%</span>
                  </div>
                  <Progress value={skillset.mastery} className="h-2" />
                </div>
                
                <div className="flex justify-between items-center mt-6 text-sm text-muted-foreground">
                  <span className="text-zinc-200">Resources: {skillset.resourceCount}</span>
                  <span className="text-zinc-200">Last practiced: {skillset.lastPracticed.toISOString().split('T')[0]}</span>
                </div>
                
                <div className="flex justify-end gap-2 mt-4 bg-blue-800">
                  <Button size="icon" variant="outline" onClick={() => handleEdit(skillset)} className="bg-lime-500 hover:bg-lime-400 font-normal text-slate-950 rounded">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="outline" onClick={() => handleDelete(skillset.id)} className="text-destructive hover:text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>)}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <Card>
          <CardContent className="p-6">
            <h3 className="font-bold text-xl mb-4">Mastery Overview</h3>
            <MasteryChart skillsets={skillsets} />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <h3 className="font-bold text-xl mb-4">Skillsets by Category</h3>
            <CategoryChart skillsets={skillsets} />
          </CardContent>
        </Card>
      </div>
      
      <SkillsetDialog open={dialogOpen} onOpenChange={setDialogOpen} onSave={handleAddSkillset} skillset={currentSkillset} />
    </div>;
}