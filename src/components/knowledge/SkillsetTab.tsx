
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skillset, SkillsetCategory } from "@/types/knowledge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Plus, MoreVertical, Edit, Trash, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { MasteryChart } from "./MasteryChart";
import { CategoryChart } from "./CategoryChart";

const sampleSkillsets: Skillset[] = [
  {
    id: "1",
    name: "React Development",
    description: "Building applications with React.js and related technologies",
    category: "Programming" as SkillsetCategory,
    proficiency: 85,
    mastery: 85,
    lastPracticed: new Date(2024, 2, 15),
    resourceCount: 12,
    color: "#61DAFB"
  },
  {
    id: "2",
    name: "UX Design",
    description: "Creating user-friendly interfaces and experiences",
    category: "Design" as SkillsetCategory,
    proficiency: 72,
    mastery: 72,
    lastPracticed: new Date(2024, 2, 10),
    resourceCount: 8,
    color: "#FF6E6E"
  },
  {
    id: "3",
    name: "Data Visualization",
    description: "Creating interactive and informative data visualizations",
    category: "Analytics" as SkillsetCategory,
    proficiency: 65,
    mastery: 65,
    lastPracticed: new Date(2024, 2, 20),
    resourceCount: 5,
    color: "#5E72E4"
  },
  {
    id: "4",
    name: "Public Speaking",
    description: "Effectively communicating ideas to audiences",
    category: "Soft Skills" as SkillsetCategory,
    proficiency: 78,
    mastery: 78,
    lastPracticed: new Date(2024, 2, 5),
    resourceCount: 3,
    color: "#FF9F43"
  }
];

export function SkillsetTab() {
  const [skillsets, setSkillsets] = useState<Skillset[]>(sampleSkillsets);
  const [selectedSkillset, setSelectedSkillset] = useState<Skillset | null>(null);
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };
  
  const handleEdit = (skillset: Skillset) => {
    setSelectedSkillset(skillset);
    // Open edit dialog (to be implemented)
  };
  
  const handleDelete = (skillsetId: string) => {
    setSkillsets(prevSkillsets => prevSkillsets.filter(s => s.id !== skillsetId));
  };
  
  const handleTogglePin = (skillsetId: string) => {
    setSkillsets(prevSkillsets => 
      prevSkillsets.map(s => 
        s.id === skillsetId ? { ...s, pinned: !s.pinned } : s
      )
    );
  };
  
  const getSkillsetsByCategory = () => {
    const categories: Record<string, Skillset[]> = {};
    
    skillsets.forEach(skillset => {
      if (!categories[skillset.category]) {
        categories[skillset.category] = [];
      }
      categories[skillset.category].push(skillset);
    });
    
    return categories;
  };
  
  const categoryGroups = getSkillsetsByCategory();
  
  const getCategoryColor = (category: string) => {
    switch(category) {
      case "Programming": return "bg-blue-100 text-blue-800";
      case "Design": return "bg-purple-100 text-purple-800";
      case "Analytics": return "bg-green-100 text-green-800";
      case "Soft Skills": return "bg-orange-100 text-orange-800";
      case "Language": return "bg-pink-100 text-pink-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Your Skillsets</h2>
        <Button className="gap-2">
          <Plus className="h-4 w-4" /> Add Skillset
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Skillset Overview</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium mb-4">Skill Mastery</h3>
                  <MasteryChart skillsets={skillsets} />
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-4">Category Distribution</h3>
                  <CategoryChart skillsets={skillsets} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Quick Stats</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Skillsets</p>
                <p className="text-2xl font-bold">{skillsets.length}</p>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground mb-1">Categories</p>
                <p className="text-2xl font-bold">{Object.keys(categoryGroups).length}</p>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground mb-1">Top Skillset</p>
                <p className="text-lg font-medium">
                  {skillsets.sort((a, b) => b.mastery - a.mastery)[0]?.name}
                </p>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground mb-1">Latest Practice</p>
                <p className="text-lg font-medium">
                  {formatDate(skillsets.sort((a, b) => 
                    new Date(b.lastPracticed || 0).getTime() - 
                    new Date(a.lastPracticed || 0).getTime()
                  )[0]?.lastPracticed || new Date())}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {Object.entries(categoryGroups).map(([category, skills]) => (
        <div key={category} className="space-y-4">
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-semibold">{category}</h3>
            <Badge className={getCategoryColor(category)}>{skills.length}</Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {skills.map(skill => (
              <Card key={skill.id} className="hover:shadow-md transition-all">
                <CardContent className="p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <h4 className="font-semibold text-base">{skill.name}</h4>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEdit(skill)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleTogglePin(skill.id)}>
                          {skill.pinned ? (
                            <>
                              <span className="text-primary mr-2">★</span>
                              Unpin
                            </>
                          ) : (
                            <>
                              <span className="text-muted-foreground mr-2">☆</span>
                              Pin
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDelete(skill.id)} className="text-destructive">
                          <Trash className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  
                  {skill.description && (
                    <p className="text-sm text-muted-foreground">{skill.description}</p>
                  )}
                  
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-sm">
                      <span>Mastery</span>
                      <span className="font-medium">{skill.mastery}%</span>
                    </div>
                    <Progress value={skill.mastery} className="h-2" style={{ backgroundColor: `${skill.color}20` }}>
                      <div 
                        className="h-full rounded-full transition-all" 
                        style={{ width: `${skill.mastery}%`, backgroundColor: skill.color }} 
                      />
                    </Progress>
                  </div>
                  
                  <div className="flex justify-between items-center text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatDate(skill.lastPracticed || new Date())}
                    </div>
                    <div>{skill.resourceCount} resources</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
